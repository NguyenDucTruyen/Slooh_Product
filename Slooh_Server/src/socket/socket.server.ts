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

          // Allow requests with no origin
          if (!origin) return callback(null, true);

          // In development, allow all origins
          if (config.env === 'development') {
            return callback(null, true);
          }

          // In production, check against allowed origins
          const allowedOrigins = [
            config.appUrl.client,
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

          if (allowedOrigins.includes(origin) || isDockerNetwork) {
            callback(null, true);
          } else {
            logger.error(`Socket.IO CORS rejected origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
          }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
      },
      // Quan trọng: Cấu hình để tương thích với client
      allowEIO3: true, // Allow Engine.IO v3 clients
      transports: ['polling', 'websocket'], // Explicitly set transports
      path: '/socket.io/', // Đảm bảo path đúng
      serveClient: false, // Không serve client files
      pingTimeout: 60000, // Tăng timeout
      pingInterval: 25000,
      upgradeTimeout: 10000,
      maxHttpBufferSize: 1e6 // 1MB
    });

    // Log Engine.IO errors để debug
    this.io.engine.on('connection_error', (err: any) => {
      logger.error('Socket.IO Engine connection error:', {
        type: err.type,
        message: err.message,
        context: err.context
      });
    });

    this.setupMiddleware();
    this.setupHandlers();

    logger.info('Socket.IO server initialized');
  }

  private setupMiddleware() {
    // Authentication middleware
    this.io.use(async (socket: AuthenticatedSocket, next) => {
      try {
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
      logger.info(`Socket connected - User: ${userId}, Socket ID: ${socket.id}`);

      // Send connection success
      socket.emit('connected', {
        socketId: socket.id,
        userId: userId
      });

      // Setup handlers for presentation sessions
      phienTrinhChieuHandler(socket, this.io);

      // Test event để debug
      socket.on('ping', (callback) => {
        logger.info(`Ping received from ${userId}`);
        if (typeof callback === 'function') {
          callback('pong');
        }
      });

      // Handle disconnection
      socket.on('disconnect', (reason) => {
        logger.info(`Socket disconnected - User: ${userId}, Reason: ${reason}`);
      });

      // Handle errors
      socket.on('error', (error) => {
        logger.error(`Socket error for user ${userId}:`, error);
      });

      // Handle reconnection
      socket.on('reconnect', () => {
        logger.info(`Socket reconnected - User: ${userId}`);
      });
    });

    // Log general connection errors
    this.io.on('connection_error', (error) => {
      logger.error('Socket.IO connection error:', error);
    });
  }

  public getIO(): SocketIOServer {
    return this.io;
  }
}

export default SocketServer;
