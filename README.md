# Slooh Project - Docker Setup

## Cấu trúc project

```
.
├── Slooh_Client/          # Vue.js frontend
├── Slooh_Server/          # Node.js backend
├── docker-compose.yml     # Docker Compose chính
├── docker-compose.dev.yml # Override cho development
├── docker-compose.prod.yml # Override cho production
├── .env                   # Environment variables
├── .env.example           # Template cho .env
└── Makefile              # Shortcuts cho Docker commands
```

## Cài đặt ban đầu

1. Clone repository và tạo file `.env`:

```bash
cp .env.example .env
```

2. Chỉnh sửa file `.env` với các giá trị phù hợp

3. Tạo Dockerfile cho client:

```bash
# Copy Dockerfile vào thư mục Slooh_Client
cp Slooh_Client.Dockerfile Slooh_Client/Dockerfile
```

## Sử dụng với Makefile

### Development

```bash
# Khởi động môi trường development
make dev

# Khởi động ở background
make dev-d
```

### Production

```bash
# Khởi động môi trường production
make prod

# Khởi động ở background
make prod-d
```

### Các lệnh khác

```bash
# Xem logs
make logs

# Xem logs của server
make server-logs

# Xem logs của client
make client-logs

# Restart services
make restart

# Dừng services
make down

# Reset database
make db-reset

# Seed database
make db-seed

# Tạo admin user
make create-admin

# Dọn dẹp volumes và images
make clean
```

## Sử dụng không có Makefile

### Development

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### Production

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

## Ports

- **Client**: http://localhost (production) hoặc http://localhost:5173 (development)
- **Server**: http://localhost:3000
- **Database**: localhost:5432
- **Prisma Studio**: http://localhost:5555 (khi chạy `make db-studio`)

## Lưu ý

1. **Development mode**:

   - Client sử dụng Vite dev server với hot reload
   - Server sử dụng nodemon với auto restart
   - Volumes được mount để thay đổi code không cần rebuild

2. **Production mode**:

   - Client được build và serve qua Nginx
   - Server chạy với PM2
   - Không có volume mounts để bảo mật

3. **Database**:

   - PostgreSQL data được lưu trong Docker volume
   - Database sẽ tự động được khởi tạo với Prisma schema
   - Sử dụng `make db-reset` để reset database

4. **Environment variables**:
   - Tất cả config được quản lý qua file `.env`
   - Không commit file `.env` vào git
   - Sử dụng `.env.example` làm template
