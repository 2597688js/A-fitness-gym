# Safe Deployment on VM - A Fitness Gym

This guide ensures your Docker containers run in complete isolation without affecting other services on your VM.

## 📋 System Info
- IP: 213.210.37.157
- Disk: 38.6% used
- Memory: 47% used
- Process: 129 running

## ✅ Step 1: Install Docker (If Not Already Installed)

```bash
# SSH into your VM
ssh root@213.210.37.157

# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

## 📁 Step 2: Create Isolated Directory for Gym App

```bash
# Create dedicated directory for gym app
mkdir -p /opt/a-fitness-gym
cd /opt/a-fitness-gym

# Create subdirectories
mkdir -p data logs config
```

## 🐳 Step 3: Setup Docker Compose (Isolated Network & Volumes)

Create `/opt/a-fitness-gym/docker-compose.yml`:

```yaml
version: '3.8'

services:
  gym-backend:
    image: janarddan/a-fitness-gym-backend:demo
    container_name: gym-backend
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=production
      - PORT=5001
      - JWT_SECRET=your_super_secret_jwt_key_here_change_this
      - RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
      - RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
    restart: unless-stopped
    networks:
      - gym-network
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:5001/api/gallery"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  gym-frontend:
    image: janarddan/a-fitness-gym-frontend:demo
    container_name: gym-frontend
    ports:
      - "5174:5174"
    depends_on:
      gym-backend:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - gym-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:5174/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

networks:
  gym-network:
    driver: bridge
    driver_opts:
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.name: gym_br0

volumes:
  gym-data:
    driver: local
  gym-logs:
    driver: local
```

## 🚀 Step 4: Deploy on VM

```bash
# Navigate to gym app directory
cd /opt/a-fitness-gym

# Pull latest images
docker-compose pull

# Start containers in background
docker-compose up -d

# Check status
docker-compose ps

# View logs (if needed)
docker-compose logs -f
```

## 🔍 Step 5: Verify Safe Isolation

```bash
# Check Docker network isolation
docker network ls | grep gym

# View gym containers
docker ps | grep gym

# Check resource usage
docker stats gym-backend gym-frontend

# Verify no interference with other services
ps aux | grep -v gym | grep docker  # Should show other containers if any
```

## 🌐 Step 6: Access Your Application

```bash
# From VM
curl http://localhost:5174
curl http://localhost:5001/api/gallery

# From local machine
# Open browser: http://213.210.37.157:5174
```

## 📊 Monitoring Commands

```bash
# View all containers
docker ps

# View gym app logs only
docker-compose -f /opt/a-fitness-gym/docker-compose.yml logs -f

# Check disk usage by gym app
docker system df

# View specific container logs
docker logs gym-backend
docker logs gym-frontend

# Monitor real-time stats
docker stats gym-backend gym-frontend

# Check network isolation
docker network inspect gym-network
```

## 🔧 Management Commands

```bash
# Start gym app
cd /opt/a-fitness-gym
docker-compose up -d

# Stop gym app (doesn't affect other services)
docker-compose down

# Restart gym app
docker-compose restart

# Remove gym app completely
docker-compose down -v

# Update to latest images
docker-compose pull
docker-compose up -d

# View real-time logs
docker-compose logs -f --tail=50

# Execute command in container
docker-compose exec gym-backend sh
```

## 🛡️ Safety Checks

### Before Deployment
```bash
# Check no other services using ports 5001, 5174
sudo netstat -tlnp | grep -E ':5001|:5174'

# Check available resources
free -h                    # Memory
df -h /                   # Disk
```

### After Deployment
```bash
# Verify gym app is isolated
docker network inspect gym-network

# Check no port conflicts
sudo netstat -tlnp | grep docker

# Monitor resource usage
docker stats --no-stream

# Verify other services unaffected
systemctl status nginx  # if running
systemctl status mysql  # if running
```

## 📝 Configuration

### Change Ports (If 5001/5174 are in use)

Edit docker-compose.yml:
```yaml
services:
  gym-backend:
    ports:
      - "8001:5001"  # Change to any free port

  gym-frontend:
    ports:
      - "8174:5174"  # Change to any free port
```

Then:
```bash
docker-compose up -d
```

### Change Environment Variables

Edit docker-compose.yml and update:
```yaml
environment:
  - JWT_SECRET=your_new_secret_key
  - RAZORPAY_KEY_ID=your_key
  - RAZORPAY_KEY_SECRET=your_secret
```

Then:
```bash
docker-compose down
docker-compose up -d
```

## 🔄 Backup & Restore

### Backup Application Data
```bash
cd /opt/a-fitness-gym
tar -czf gym-backup-$(date +%Y%m%d).tar.gz data/
```

### Restore from Backup
```bash
cd /opt/a-fitness-gym
tar -xzf gym-backup-YYYYMMDD.tar.gz
docker-compose restart
```

## 🚨 Troubleshooting

### Containers not starting
```bash
docker-compose logs
docker-compose ps
```

### Port already in use
```bash
sudo lsof -i :5001
sudo lsof -i :5174
# Change ports in docker-compose.yml
```

### Out of memory
```bash
docker stats --no-stream
# Reduce other services or add memory limit to docker-compose.yml
```

### Network connectivity
```bash
docker-compose exec gym-backend ping gym-frontend
docker network inspect gym-network
```

## 📱 Access Information

| Service | URL | Internal |
|---------|-----|----------|
| Frontend | http://213.210.37.157:5174 | http://gym-frontend:5174 |
| Backend API | http://213.210.37.157:5001 | http://gym-backend:5001 |

## 🎯 Demo Credentials

- **Member**: john@example.com / john123
- **Admin**: admin@afitnessgyam.com / admin123

## ✨ Next Steps

1. ✅ SSH into VM
2. ✅ Create `/opt/a-fitness-gym` directory
3. ✅ Copy docker-compose.yml
4. ✅ Run `docker-compose up -d`
5. ✅ Verify with `docker-compose ps`
6. ✅ Access at http://213.210.37.157:5174

Your gym app is now completely isolated and running safely on your VM! 🎉
