@echo off
setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════╗
echo ║   A Fitness Gym - Docker Hub Build ^& Push    ║
echo ╚════════════════════════════════════════════════╝
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker first.
    exit /b 1
)

echo ✓ Docker is installed
echo.

REM Get Docker Hub username
set /p DOCKER_USERNAME="Enter your Docker Hub username: "

if "!DOCKER_USERNAME!"=="" (
    echo ❌ Docker Hub username cannot be empty
    exit /b 1
)

echo Setting Docker Hub username to: !DOCKER_USERNAME!
echo.

REM Navigate to script directory
cd /d "%~dp0"

echo.
echo ────────────────────────────────────────────────
echo 🔨 Building Docker images...
echo ────────────────────────────────────────────────
echo.

docker-compose build --no-cache

if errorlevel 1 (
    echo ❌ Build failed
    exit /b 1
)

echo.
echo ✓ Images built successfully
echo.

echo ────────────────────────────────────────────────
echo 🏷️  Tagging images...
echo ────────────────────────────────────────────────
echo.

echo Tagging backend image...
docker tag a-fitness-gym-backend:latest !DOCKER_USERNAME!/a-fitness-gym-backend:latest
docker tag a-fitness-gym-backend:latest !DOCKER_USERNAME!/a-fitness-gym-backend:1.0
echo ✓ Backend image tagged

echo Tagging frontend image...
docker tag a-fitness-gym-frontend:latest !DOCKER_USERNAME!/a-fitness-gym-frontend:latest
docker tag a-fitness-gym-frontend:latest !DOCKER_USERNAME!/a-fitness-gym-frontend:1.0
echo ✓ Frontend image tagged

echo.
echo ────────────────────────────────────────────────
echo 📤 Pushing images to Docker Hub...
echo ────────────────────────────────────────────────
echo.

echo Pushing backend:latest...
docker push !DOCKER_USERNAME!/a-fitness-gym-backend:latest
if errorlevel 1 goto :pusherror

echo ✓ Pushed backend:latest
echo.

echo Pushing backend:1.0...
docker push !DOCKER_USERNAME!/a-fitness-gym-backend:1.0
if errorlevel 1 goto :pusherror

echo ✓ Pushed backend:1.0
echo.

echo Pushing frontend:latest...
docker push !DOCKER_USERNAME!/a-fitness-gym-frontend:latest
if errorlevel 1 goto :pusherror

echo ✓ Pushed frontend:latest
echo.

echo Pushing frontend:1.0...
docker push !DOCKER_USERNAME!/a-fitness-gym-frontend:1.0
if errorlevel 1 goto :pusherror

echo ✓ Pushed frontend:1.0
echo.

echo ════════════════════════════════════════════════
echo ✅ SUCCESS! Images uploaded to Docker Hub
echo ════════════════════════════════════════════════
echo.

echo Your Docker Hub Images:
echo • !DOCKER_USERNAME!/a-fitness-gym-backend:latest
echo • !DOCKER_USERNAME!/a-fitness-gym-backend:1.0
echo • !DOCKER_USERNAME!/a-fitness-gym-frontend:latest
echo • !DOCKER_USERNAME!/a-fitness-gym-frontend:1.0
echo.

echo View on Docker Hub:
echo https://hub.docker.com/r/!DOCKER_USERNAME!/a-fitness-gym-backend
echo https://hub.docker.com/r/!DOCKER_USERNAME!/a-fitness-gym-frontend
echo.

echo To deploy on another VM:
echo docker-compose pull
echo docker-compose up -d
echo.

echo 🎉 Done! Your application is now on Docker Hub!
endlocal
exit /b 0

:pusherror
echo ❌ Push failed. Check your Docker Hub login.
endlocal
exit /b 1
