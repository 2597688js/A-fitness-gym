#!/bin/bash

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   A Fitness Gym - Docker Hub Build & Push    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker daemon is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker daemon is not running. Please start Docker.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker is installed and running${NC}"
echo ""

# Get Docker Hub username
read -p "Enter your Docker Hub username: " DOCKER_USERNAME

if [ -z "$DOCKER_USERNAME" ]; then
    echo -e "${RED}❌ Docker Hub username cannot be empty${NC}"
    exit 1
fi

echo -e "${YELLOW}Setting Docker Hub username to: $DOCKER_USERNAME${NC}"
echo ""

# Check Docker Hub login
echo -e "${YELLOW}📝 Checking Docker Hub login...${NC}"
if ! docker info 2>&1 | grep -q "Username:"; then
    echo -e "${YELLOW}You are not logged in to Docker Hub. Logging in...${NC}"
    docker login
fi

echo ""
echo -e "${BLUE}────────────────────────────────────────────────${NC}"
echo -e "${YELLOW}🔨 Building Docker images...${NC}"
echo -e "${BLUE}────────────────────────────────────────────────${NC}"
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

# Build images
docker-compose build --no-cache

echo ""
echo -e "${GREEN}✓ Images built successfully${NC}"
echo ""

echo -e "${BLUE}────────────────────────────────────────────────${NC}"
echo -e "${YELLOW}🏷️  Tagging images...${NC}"
echo -e "${BLUE}────────────────────────────────────────────────${NC}"
echo ""

# Tag backend image
echo -e "${YELLOW}Tagging backend image...${NC}"
docker tag a-fitness-gym-backend:latest $DOCKER_USERNAME/a-fitness-gym-backend:latest
docker tag a-fitness-gym-backend:latest $DOCKER_USERNAME/a-fitness-gym-backend:1.0
echo -e "${GREEN}✓ Backend image tagged${NC}"

# Tag frontend image
echo -e "${YELLOW}Tagging frontend image...${NC}"
docker tag a-fitness-gym-frontend:latest $DOCKER_USERNAME/a-fitness-gym-frontend:latest
docker tag a-fitness-gym-frontend:latest $DOCKER_USERNAME/a-fitness-gym-frontend:1.0
echo -e "${GREEN}✓ Frontend image tagged${NC}"

echo ""

echo -e "${BLUE}────────────────────────────────────────────────${NC}"
echo -e "${YELLOW}📤 Pushing images to Docker Hub...${NC}"
echo -e "${BLUE}────────────────────────────────────────────────${NC}"
echo ""

# Push backend images
echo -e "${YELLOW}Pushing backend:latest...${NC}"
docker push $DOCKER_USERNAME/a-fitness-gym-backend:latest
echo -e "${GREEN}✓ Pushed backend:latest${NC}"

echo -e "${YELLOW}Pushing backend:1.0...${NC}"
docker push $DOCKER_USERNAME/a-fitness-gym-backend:1.0
echo -e "${GREEN}✓ Pushed backend:1.0${NC}"

# Push frontend images
echo -e "${YELLOW}Pushing frontend:latest...${NC}"
docker push $DOCKER_USERNAME/a-fitness-gym-frontend:latest
echo -e "${GREEN}✓ Pushed frontend:latest${NC}"

echo -e "${YELLOW}Pushing frontend:1.0...${NC}"
docker push $DOCKER_USERNAME/a-fitness-gym-frontend:1.0
echo -e "${GREEN}✓ Pushed frontend:1.0${NC}"

echo ""
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ SUCCESS! Images uploaded to Docker Hub${NC}"
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
echo ""

echo -e "${BLUE}Your Docker Hub Images:${NC}"
echo -e "${GREEN}• $DOCKER_USERNAME/a-fitness-gym-backend:latest${NC}"
echo -e "${GREEN}• $DOCKER_USERNAME/a-fitness-gym-backend:1.0${NC}"
echo -e "${GREEN}• $DOCKER_USERNAME/a-fitness-gym-frontend:latest${NC}"
echo -e "${GREEN}• $DOCKER_USERNAME/a-fitness-gym-frontend:1.0${NC}"
echo ""

echo -e "${BLUE}View on Docker Hub:${NC}"
echo -e "https://hub.docker.com/r/$DOCKER_USERNAME/a-fitness-gym-backend"
echo -e "https://hub.docker.com/r/$DOCKER_USERNAME/a-fitness-gym-frontend"
echo ""

echo -e "${BLUE}To deploy on another VM:${NC}"
echo -e "${YELLOW}cat > docker-compose.yml << 'EOF'${NC}"
cat docker-compose.prod.yml | sed "s/\${DOCKER_USERNAME:-yourusername}/$DOCKER_USERNAME/g"
echo -e "${YELLOW}EOF${NC}"
echo ""
echo -e "${YELLOW}docker-compose pull${NC}"
echo -e "${YELLOW}docker-compose up -d${NC}"
echo ""

echo -e "${GREEN}🎉 Done! Your application is now on Docker Hub!${NC}"
