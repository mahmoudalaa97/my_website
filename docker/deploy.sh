#!/bin/bash

# VPS Deployment Script for My Website
# This script handles the deployment process on a VPS

set -e  # Exit on any error

echo "🚀 Starting deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo -e "${YELLOW}Please create a .env file from .env.example${NC}"
    exit 1
fi

# Load environment variables
source .env

echo -e "${GREEN}✓ Environment variables loaded${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker is running${NC}"

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}⚠ docker-compose not found, using 'docker compose' instead${NC}"
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Pull latest changes (if in git repo)
if [ -d "../.git" ]; then
    echo "📥 Pulling latest changes..."
    cd ..
    git pull origin $(git branch --show-current)
    cd docker
    echo -e "${GREEN}✓ Latest changes pulled${NC}"
fi

# Stop and remove existing containers
echo "🛑 Stopping existing containers..."
$DOCKER_COMPOSE -f docker-compose.prod.yml down

# Remove dangling images to free up space
echo "🧹 Cleaning up dangling images..."
docker image prune -f

# Build and start containers
echo "🏗️  Building and starting containers..."
$DOCKER_COMPOSE -f docker-compose.prod.yml up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check container status
echo "📊 Container status:"
$DOCKER_COMPOSE -f docker-compose.prod.yml ps

# Show logs
echo -e "\n${GREEN}✅ Deployment complete!${NC}"
echo -e "${YELLOW}View logs with: $DOCKER_COMPOSE -f docker-compose.prod.yml logs -f${NC}"
echo -e "${YELLOW}Stop services with: $DOCKER_COMPOSE -f docker-compose.prod.yml down${NC}"

# Optional: Run database migrations
read -p "Do you want to run database migrations? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗄️  Running database migrations..."
    docker exec website_api node dist/main.js db:migrate || echo -e "${YELLOW}⚠ Migration command not found or failed${NC}"
fi

echo -e "\n${GREEN}🎉 All done!${NC}"
