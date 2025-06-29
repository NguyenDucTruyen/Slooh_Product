// src/socket/socket.server.ts
import { NGUOIDUNG as User } from '@prisma/client';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { Socket, Server as SocketIOServer } from 'socket.io';
import prisma from '../client';
import config from '../config';
import logger from '../config/logger';
import phienTrinhChieuHandler from './handlers/phienTrinhChieu.handler';

interface AuthenticatedSocket extends Socket {
  user?: User;
  phienId?: string;
}

class SocketServer {
  private io: SocketIOServer;

  constructor(httpServer: HttpServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: (origin, callback) => {
          // Log để debug
          logger.info(`Socket.IO CORS check - Origin: ${origin}`);

          // Allow requests with no origin (server-to-server, Postman, etc.)
          if (!origin) return callback(null, true);

          // In development, allow all origins
          if (config.env === 'development') {
            return callback(null, true);
          }

          // In production, check against allowed origins
          const allowedOrigins = [
            config.appUrl.client,
            'https://ductruyen.site',
            'https://www.ductruyen.site',
            'http://ductruyen.site',
            'http://www.ductruyen.site',
            // Local development
            'http://localhost',
            'http://localhost:80',
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:8080',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:8080',
            // Docker container names
            'http://client',
            'http://slooh-client',
            'http://client:80',
            'http://slooh-client:80'
          ].filter(Boolean);

          // Allow Docker network IPs
          const isDockerNetwork = origin.match(/^https?:\/\/(172\.|192\.|10\.)/);
          
          // Allow Cloudflare IPs (khi request đi qua Cloudflare proxy)
          const isCloudflareIP = origin.match(/^https?:\/\/(103\.21\.|103\.22\.|103\.31\.|104\.16\.|108\.162\.|131\.0\.|141\.101\.|162\.158\.|172\.64\.|173\.245\.|188\.114\.|190\.93\.|197\.234\.|198\.41\.)/);

          if (allowedOrigins.includes(origin) || isDockerNetwork || isCloudflareIP) {
            callback(null, true);
          } else {
            logger.error(`Socket.IO CORS rejected origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
          }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Authorization', 'Content-Type'],
        exposedHeaders: ['Authorization']
      },
      // Quan trọng: Cấu hình để tương thích với client và proxy
      allowEIO3: true, // Allow Engine.IO v3 clients
      transports: ['polling', 'websocket'], // Polling first for better compatibility
      path: '/socket.io/', // Đảm bảo path đúng
      serveClient: false, // Không serve client files
      pingTimeout: 60000, // Tăng timeout
      pingInterval: 25000,
      upgradeTimeout: 30000, // Tăng timeout cho WebSocket upgrade
      maxHttpBufferSize: 1e6, // 1MB
      
      // Thêm cấu hình cho production với reverse proxy
      allowRequest: (req, callback) => {
        // Log headers để debug
        logger.info('Socket.IO request headers:', {
          'x-forwarded-for': req.headers['x-forwarded-for'],
          'x-real-ip': req.headers['x-real-ip'],
          'x-forwarded-proto': req.headers['x-forwarded-proto'],
          'origin': req.headers.origin,
          'host': req.headers.host
        });
        
        // Always allow in production (CORS will handle origin check)
        callback(null, true);
      }
    });

    // Log Engine.IO errors để debug
    this.io.engine.on('connection_error', (err: any) => {
      logger.error('Socket.IO Engine connection error:', {
        type: err.type,
        message: err.message,
        context: err.context,
        req: err.req ? {
          url: err.req.url,
          headers: err.req.headers
        } : undefined
      });
    });

    this.setupMiddleware();
    this.setupHandlers();

    logger.info('Socket.IO server initialized with config:', {
      env: config.env,
      clientUrl: config.appUrl.client,
      cors: this.io.opts.cors
    });
  }

  private setupMiddleware() {
    // Authentication middleware
    this.io.use(async (socket: AuthenticatedSocket, next) => {
      try {
        // Log connection attempt
        logger.info('Socket authentication attempt:', {
          socketId: socket.id,
          headers: socket.handshake.headers,
          auth: socket.handshake.auth
        });

        const token =
          socket.handshake.auth?.token ||
          socket.handshake.headers?.authorization?.replace('Bearer ', '');

        if (!token) {
          // Allow anonymous users for public rooms
          logger.info('Anonymous socket connection allowed');
          return next();
        }

        // Verify JWT token
        const decoded = jwt.verify(token, config.jwt.secret) as any;

        if (decoded.type !== 'ACCESS') {
          return next(new Error('Invalid token type'));
        }

        // Get user from database
        const user = await prisma.nGUOIDUNG.findUnique({
          where: { maNguoiDung: decoded.sub },
          select: {
            maNguoiDung: true,
            hoTen: true,
            email: true,
            matKhau: true,
            anhDaiDien: true,
            quyen: true,
            trangThai: true,
            daXacThucEmail: true,
            ngayTao: true,
            ngayCapNhat: true
          }
        });

        if (!user || user.trangThai !== 'HOAT_DONG') {
          return next(new Error('User not found or inactive'));
        }

        socket.user = user;
        logger.info(`Authenticated socket connection for user: ${user.maNguoiDung}`);
        next();
      } catch (error) {
        logger.error('Socket authentication error:', error);
        // Cho phép kết nối nhưng không có user info
        next();
      }
    });
  }

  private setupHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      const userId = socket.user?.maNguoiDung || 'anonymous';
      const clientIp = socket.handshake.headers['x-forwarded-for'] || 
                      socket.handshake.headers['x-real-ip'] || 
                      socket.handshake.address;
                      
      logger.info(`Socket connected - User: ${userId}, Socket ID: ${socket.id}, IP: ${clientIp}`);

      // Send connection success
      socket.emit('connected', {
        socketId: socket.id,
        userId: userId,
        timestamp: new Date().toISOString()
      });

      // Setup handlers for presentation sessions
      phienTrinhChieuHandler(socket, this.io);

      // Test event để debug
      socket.on('ping', (data, callback) => {
        logger.info(`Ping received from ${userId}`, data);
        if (typeof callback === 'function') {
          callback({ pong: true, timestamp: new Date().toISOString() });
        }
        // Also emit back for clients that don't use callbacks
        socket.emit('pong', { timestamp: new Date().toISOString() });
      });

      // Handle disconnection
      socket.on('disconnect', (reason) => {
        logger.info(`Socket disconnected - User: ${userId}, Reason: ${reason}`);
      });

      // Handle errors
      socket.on('error', (error) => {
        logger.error(`Socket error for user ${userId}:`, error);
      });

      // Handle reconnection attempt
      socket.on('reconnect_attempt', (attemptNumber) => {
        logger.info(`Socket reconnection attempt ${attemptNumber} - User: ${userId}`);
      });
    });

    // Log general connection errors
    this.io.on('connection_error', (error) => {
      logger.error('Socket.IO connection error:', error);
    });

    // Health check endpoint for monitoring
    this.io.on('health', (callback) => {
      if (typeof callback === 'function') {
        callback({ status: 'ok', connections: this.io.sockets.sockets.size });
      }
    });
  }

  public getIO(): SocketIOServer {
    return this.io;
  }
}

export default SocketServer;