#!/bin/bash

# Health Check Script for VPS Deployment
# Run this script to check the health of all services

echo "🏥 Checking service health..."
echo "================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Function to check service health
check_service() {
    local service=$1
    local port=$2
    local path=$3
    
    if docker ps --filter "name=$service" --filter "status=running" | grep -q "$service"; then
        if curl -f -s "http://localhost:$port$path" > /dev/null; then
            echo -e "${GREEN}✓ $service is healthy (port $port)${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠ $service is running but not responding (port $port)${NC}"
            return 1
        fi
    else
        echo -e "${RED}✗ $service is not running${NC}"
        return 1
    fi
}

# Check PostgreSQL
echo -n "PostgreSQL: "
if docker exec website_postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo -e "${GREEN}✓ healthy${NC}"
else
    echo -e "${RED}✗ not healthy${NC}"
fi

# Check Redis
echo -n "Redis: "
if docker exec website_redis redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✓ healthy${NC}"
else
    echo -e "${RED}✗ not healthy${NC}"
fi

# Check API
echo -n "API: "
check_service "website_api" "4000" "/api/health"

# Check Web
echo -n "Web: "
check_service "website_web" "3000" "/"

# Check Admin
echo -n "Admin: "
check_service "website_admin" "3001" "/"

echo ""
echo "================================"
echo "📊 Container Status:"
$DOCKER_COMPOSE -f docker-compose.prod.yml ps

echo ""
echo "💾 Disk Usage:"
docker system df

echo ""
echo "🔍 Recent Errors (if any):"
docker-compose -f docker-compose.prod.yml logs --tail=10 | grep -i error || echo "No recent errors found"

echo ""
echo "================================"
echo "✅ Health check complete!"
