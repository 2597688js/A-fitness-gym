# Push A Fitness Gym to Docker Hub

## Prerequisites

1. Docker installed and running on your VM
2. Docker Hub account (create at https://hub.docker.com)
3. Docker CLI access

## Step-by-Step Instructions

### 1. Login to Docker Hub

```bash
docker login
```

When prompted, enter:
- **Username**: Your Docker Hub username
- **Password**: Your Docker Hub access token (or password)

To create an access token:
1. Go to https://hub.docker.com/settings/security
2. Click "New Access Token"
3. Give it a name (e.g., "gym-app")
4. Copy the token and use it as the password

### 2. Navigate to Project Directory

```bash
cd /path/to/gym-web-app
```

### 3. Build Docker Images

```bash
# Build all images
docker-compose build

# Or build individual images
docker build -t a-fitness-gym-backend:latest ./backend
docker build -t a-fitness-gym-frontend:latest ./frontend
```

### 4. Tag Images for Docker Hub

Replace `YOUR_DOCKERHUB_USERNAME` with your actual Docker Hub username:

```bash
# Tag backend image
docker tag a-fitness-gym-backend:latest YOUR_DOCKERHUB_USERNAME/a-fitness-gym-backend:latest
docker tag a-fitness-gym-backend:latest YOUR_DOCKERHUB_USERNAME/a-fitness-gym-backend:1.0

# Tag frontend image
docker tag a-fitness-gym-frontend:latest YOUR_DOCKERHUB_USERNAME/a-fitness-gym-frontend:latest
docker tag a-fitness-gym-frontend:latest YOUR_DOCKERHUB_USERNAME/a-fitness-gym-frontend:1.0
```

### 5. Push Images to Docker Hub

```bash
# Push backend image
docker push YOUR_DOCKERHUB_USERNAME/a-fitness-gym-backend:latest
docker push YOUR_DOCKERHUB_USERNAME/a-fitness-gym-backend:1.0

# Push frontend image
docker push YOUR_DOCKERHUB_USERNAME/a-fitness-gym-frontend:latest
docker push YOUR_DOCKERHUB_USERNAME/a-fitness-gym-frontend:1.0
```

### 6. Verify on Docker Hub

1. Go to https://hub.docker.com
2. Check your repositories
3. You should see:
   - `your-username/a-fitness-gym-backend`
   - `your-username/a-fitness-gym-frontend`

## Quick Script (All-in-One)

Create a file `push_to_docker_hub.sh`:

```bash
#!/bin/bash

# Configuration
DOCKERHUB_USERNAME="YOUR_DOCKERHUB_USERNAME"
VERSION="1.0"

# Build images
echo "🔨 Building Docker images..."
docker-compose build

# Tag backend
echo "🏷️  Tagging backend image..."
docker tag a-fitness-gym-backend:latest $DOCKERHUB_USERNAME/a-fitness-gym-backend:latest
docker tag a-fitness-gym-backend:latest $DOCKERHUB_USERNAME/a-fitness-gym-backend:$VERSION

# Tag frontend
echo "🏷️  Tagging frontend image..."
docker tag a-fitness-gym-frontend:latest $DOCKERHUB_USERNAME/a-fitness-gym-frontend:latest
docker tag a-fitness-gym-frontend:latest $DOCKERHUB_USERNAME/a-fitness-gym-frontend:$VERSION

# Push backend
echo "📤 Pushing backend image..."
docker push $DOCKERHUB_USERNAME/a-fitness-gym-backend:latest
docker push $DOCKERHUB_USERNAME/a-fitness-gym-backend:$VERSION

# Push frontend
echo "📤 Pushing frontend image..."
docker push $DOCKERHUB_USERNAME/a-fitness-gym-frontend:latest
docker push $DOCKERHUB_USERNAME/a-fitness-gym-frontend:$VERSION

echo "✅ Done! Images pushed to Docker Hub"
echo ""
echo "Pull commands:"
echo "docker pull $DOCKERHUB_USERNAME/a-fitness-gym-backend:latest"
echo "docker pull $DOCKERHUB_USERNAME/a-fitness-gym-frontend:latest"
```

Make it executable and run:

```bash
chmod +x push_to_docker_hub.sh
./push_to_docker_hub.sh
```

## Docker Hub URLs

After pushing, your images will be available at:

- `https://hub.docker.com/r/YOUR_DOCKERHUB_USERNAME/a-fitness-gym-backend`
- `https://hub.docker.com/r/YOUR_DOCKERHUB_USERNAME/a-fitness-gym-frontend`

## Deploy from Docker Hub

On any VM with Docker installed, you can now run:

```bash
# Create docker-compose.yml for pulling from Docker Hub
cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  backend:
    image: YOUR_DOCKERHUB_USERNAME/a-fitness-gym-backend:latest
    container_name: a-fitness-gym-backend
    ports:
      - "5001:5001"
    environment:
      - PORT=5001
      - JWT_SECRET=your_secret_here
      - RAZORPAY_KEY_ID=your_key_id
      - RAZORPAY_KEY_SECRET=your_key_secret
    restart: unless-stopped
    networks:
      - gym-network

  frontend:
    image: YOUR_DOCKERHUB_USERNAME/a-fitness-gym-frontend:latest
    container_name: a-fitness-gym-frontend
    ports:
      - "5174:5174"
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - gym-network

networks:
  gym-network:
    driver: bridge
EOF

# Pull and run
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Authentication Error

```bash
# Re-login with token
docker logout
docker login
# Enter username and paste access token as password
```

### Push fails - Image not found

```bash
# Check your images
docker images | grep a-fitness-gym

# Verify tagging
docker tag a-fitness-gym-backend:latest YOUR_USERNAME/a-fitness-gym-backend:latest
```

### Network Error

```bash
# Test Docker Hub connection
docker run hello-world

# Check internet connection
ping hub.docker.com
```

## Monitor Upload Progress

```bash
# View local images
docker images | grep a-fitness-gym

# Check pushed images on Docker Hub
curl https://hub.docker.com/v2/repositories/YOUR_USERNAME/a-fitness-gym-backend/
```

## Make Images Private

1. Go to https://hub.docker.com
2. Click on your repository
3. Go to "Settings"
4. Change visibility to "Private"
5. Add collaborators if needed

## Update Images

When you make code changes:

```bash
# Rebuild
docker-compose build

# Retag with new version
docker tag a-fitness-gym-backend:latest YOUR_USERNAME/a-fitness-gym-backend:1.1
docker tag a-fitness-gym-frontend:latest YOUR_USERNAME/a-fitness-gym-frontend:1.1

# Push new version
docker push YOUR_USERNAME/a-fitness-gym-backend:1.1
docker push YOUR_USERNAME/a-fitness-gym-frontend:1.1
```

## Summary

1. ✅ Install Docker on VM
2. ✅ Create Docker Hub account
3. ✅ Run `docker-compose build`
4. ✅ Tag images with your Docker Hub username
5. ✅ Run `docker push` to upload
6. ✅ Use images anywhere with Docker!
