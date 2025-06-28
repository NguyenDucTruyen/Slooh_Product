.PHONY: help dev prod build up down restart logs ps clean

# Default target
help:
	@echo "Available commands:"
	@echo "  make dev        - Start development environment"
	@echo "  make prod       - Start production environment"
	@echo "  make build      - Build all Docker images"
	@echo "  make up         - Start all services"
	@echo "  make down       - Stop all services"
	@echo "  make restart    - Restart all services"
	@echo "  make logs       - View logs from all services"
	@echo "  make ps         - List running containers"
	@echo "  make clean      - Clean up volumes and images"
	@echo "  make db-reset   - Reset database"
	@echo "  make db-seed    - Seed database"

# Development environment
dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

dev-d:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

# Production environment
prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build

prod-d:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Build images
build:
	docker-compose build

# Start services
up:
	docker-compose up -d

# Stop services
down:
	docker-compose down

# Restart services
restart:
	docker-compose down
	docker-compose up -d

# View logs
logs:
	docker-compose logs -f

# List containers
ps:
	docker-compose ps

# Clean up
clean:
	docker-compose down -v
	docker system prune -af

# Database commands
db-reset:
	docker-compose exec server yarn db:reset

db-seed:
	docker-compose exec server yarn db:seed

db-studio:
	docker-compose exec server yarn db:studio

# Server commands
server-logs:
	docker-compose logs -f server

server-shell:
	docker-compose exec server sh

# Client commands
client-logs:
	docker-compose logs -f client

client-shell:
	docker-compose exec client sh

# Create admin user
create-admin:
	docker-compose exec server yarn create-admin