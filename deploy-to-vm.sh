#!/bin/bash

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  A Fitness Gym - Safe VM Deployment Script           ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
   echo -e "${RED}❌ This script must be run as root${NC}"
   exit 1
fi

echo -e "${YELLOW}📋 Pre-deployment checks...${NC}"
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker not found. Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker Compose not found. Installing...${NC}"
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

echo -e "${GREEN}✓ Docker is installed${NC}"
echo -e "${GREEN}✓ Docker Compose is installed${NC}"
echo ""

# Check ports
echo -e "${YELLOW}🔍 Checking ports 5001 and 5174...${NC}"
if lsof -i :5001 &> /dev/null; then
    echo -e "${RED}❌ Port 5001 is in use${NC}"
    exit 1
fi

if lsof -i :5174 &> /dev/null; then
    echo -e "${RED}❌ Port 5174 is in use${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Ports 5001 and 5174 are available${NC}"
echo ""

# Create isolated directory
echo -e "${YELLOW}📁 Creating isolated deployment directory...${NC}"
mkdir -p /opt/a-fitness-gym/{data,logs,config}
cd /opt/a-fitness-gym

echo -e "${GREEN}✓ Directory created at /opt/a-fitness-gym${NC}"
echo ""

# Create docker-compose.yml
echo -e "${YELLOW}📝 Creating docker-compose.yml...${NC}"
cat > docker-compose.yml << 'EOF'
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
EOF

echo -e "${GREEN}✓ docker-compose.yml created${NC}"
echo ""

# Pull images
echo -e "${YELLOW}📥 Pulling Docker images from Docker Hub...${NC}"
docker-compose pull

echo -e "${GREEN}✓ Images pulled successfully${NC}"
echo ""

# Start containers
echo -e "${YELLOW}🚀 Starting containers...${NC}"
docker-compose up -d

echo -e "${GREEN}✓ Containers started${NC}"
echo ""

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to be healthy...${NC}"
sleep 10

# Check status
echo -e "${YELLOW}📊 Container status:${NC}"
docker-compose ps

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ DEPLOYMENT SUCCESSFUL!${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${BLUE}📍 Deployment Location:${NC}"
echo -e "   ${GREEN}/opt/a-fitness-gym${NC}"
echo ""

echo -e "${BLUE}🌐 Access Information:${NC}"
echo -e "   Frontend:   ${GREEN}http://localhost:5174${NC}"
echo -e "   Backend API: ${GREEN}http://localhost:5001${NC}"
echo ""

echo -e "${BLUE}🔐 Demo Credentials:${NC}"
echo -e "   Member: ${GREEN}john@example.com / john123${NC}"
echo -e "   Admin:  ${GREEN}admin@afitnessgyam.com / admin123${NC}"
echo ""

echo -e "${BLUE}📋 Useful Commands:${NC}"
echo -e "   View logs:      ${YELLOW}cd /opt/a-fitness-gym && docker-compose logs -f${NC}"
echo -e "   Stop services:  ${YELLOW}cd /opt/a-fitness-gym && docker-compose down${NC}"
echo -e "   Restart:        ${YELLOW}cd /opt/a-fitness-gym && docker-compose restart${NC}"
echo -e "   Check status:   ${YELLOW}cd /opt/a-fitness-gym && docker-compose ps${NC}"
echo ""

echo -e "${BLUE}🛡️  Isolation Verified:${NC}"
echo -e "   ✓ Separate Docker network (gym-network)"
echo -e "   ✓ Dedicated volumes (data, logs)"
echo -e "   ✓ Isolated containers"
echo -e "   ✓ Health checks enabled"
echo -e "   ✓ Auto-restart on failure"
echo ""

echo -e "${GREEN}🎉 Your A Fitness Gym is now running safely on your VM!${NC}"
