# A Fitness Gym - Docker Setup Guide

This guide will help you run the A Fitness Gym application using Docker on your VM.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 1.29 or higher)
- At least 2GB of available RAM
- 1GB of disk space

## Installation

### On Linux (Ubuntu/Debian)

```bash
# Update package manager
sudo apt-get update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (optional, to run without sudo)
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

## Quick Start

### 1. Clone/Navigate to the project directory

```bash
cd /path/to/gym-web-app
```

### 2. Build and run the application

```bash
# Build Docker images and start containers
docker-compose up -d

# View logs
docker-compose logs -f
```

### 3. Access the application

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:5001

### 4. Demo Credentials

- **Member**: john@example.com / john123
- **Admin**: admin@afitnessgyam.com / admin123

## Common Commands

### Start the application
```bash
docker-compose up -d
```

### Stop the application
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f
```

### Rebuild images (after code changes)
```bash
docker-compose up -d --build
```

### Remove all containers and images
```bash
docker-compose down -v
docker system prune -a
```

### Access backend container shell
```bash
docker-compose exec backend sh
```

### Access frontend container shell
```bash
docker-compose exec frontend sh
```

## Environment Variables

### Backend (.env file)

Edit the `backend/.env` file to customize:

```env
PORT=5001
JWT_SECRET=your_secret_key_here
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### Frontend

The frontend automatically connects to the backend at `http://backend:5001` when running in Docker.

## Troubleshooting

### Port already in use

If port 5001 or 5174 is already in use, modify the ports in `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "5001:5001"  # Change first number to your desired port

  frontend:
    ports:
      - "5174:5174"  # Change first number to your desired port
```

### Containers not starting

Check logs for errors:
```bash
docker-compose logs backend
docker-compose logs frontend
```

### Out of memory

Increase Docker's memory limit or close other applications:
```bash
docker stats
```

### Rebuild from scratch

```bash
docker-compose down -v
rm -rf backend/node_modules frontend/node_modules
docker-compose up -d --build
```

## Production Deployment

### Update environment variables

Create a `.env.prod` file:

```env
PORT=5001
JWT_SECRET=generate_strong_secret_key_here
RAZORPAY_KEY_ID=prod_key_id
RAZORPAY_KEY_SECRET=prod_key_secret
```

### Use production compose file

Create `docker-compose.prod.yml` with optimized settings:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: a-fitness-gym-backend-prod
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=production
      - PORT=5001
      - JWT_SECRET=${JWT_SECRET}
      - RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}
      - RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET}
    restart: always
    networks:
      - gym-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:5001/api/gallery"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: a-fitness-gym-frontend-prod
    ports:
      - "5174:5174"
    depends_on:
      backend:
        condition: service_healthy
    restart: always
    networks:
      - gym-network

networks:
  gym-network:
    driver: bridge
```

Run with:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Backup and Restore

### Backup data
```bash
docker-compose exec backend tar czf - /app > backup.tar.gz
```

### View container disk usage
```bash
docker system df
```

## Health Checks

The application includes health checks. View their status:

```bash
docker ps --format "table {{.Names}}\t{{.Status}}"
```

## Support

For issues or questions:
1. Check the logs: `docker-compose logs`
2. Verify Docker is running: `docker ps`
3. Check available disk space: `df -h`
4. Ensure ports are not blocked by firewall

## Next Steps

1. Deploy to your VM
2. Set up SSL/HTTPS with nginx reverse proxy
3. Configure automatic backups
4. Set up monitoring and alerting
