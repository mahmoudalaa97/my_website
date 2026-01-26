#!/bin/bash

# Docker Management Script for My Website Turborepo
# This script helps manage Docker services for development and production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Change to docker directory
cd "$(dirname "$0")"

# Check if .env file exists
check_env_file() {
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from .env.example..."
        if [ -f .env.example ]; then
            cp .env.example .env
            print_success ".env file created. Please update it with your configuration."
        else
            print_error ".env.example not found!"
            exit 1
        fi
    fi
}

# Show usage
show_usage() {
    cat << EOF
${GREEN}Docker Management Script for My Website${NC}

Usage: ./docker-manager.sh [COMMAND] [ENVIRONMENT]

${BLUE}Commands:${NC}
  up          Start all services
  down        Stop all services
  restart     Restart all services
  build       Build all services
  logs        Show logs for all services
  ps          Show running containers
  clean       Remove all containers, volumes, and images
  
${BLUE}Options:${NC}
  -d, --dev       Use development environment (default)
  -p, --prod      Use production environment
  -s, --service   Specify service (api, admin, web, nginx, postgres)
  -f, --follow    Follow logs
  -h, --help      Show this help message

${BLUE}Examples:${NC}
  ./docker-manager.sh up                    # Start dev environment
  ./docker-manager.sh up --prod             # Start prod environment
  ./docker-manager.sh logs -f               # Follow all logs
  ./docker-manager.sh logs -s api           # Show API logs
  ./docker-manager.sh build -s web          # Build only web service
  ./docker-manager.sh restart -s api        # Restart only API service

${BLUE}Quick Access URLs (Development):${NC}
  API:    http://localhost:4000
  Admin:  http://localhost:3001
  Web:    http://localhost:3000

${BLUE}Quick Access URLs (Production):${NC}
  API:    https://api.mahmoudalaa.com
  Admin:  https://admin.mahmoudalaa.com
  Web:    https://demo.mahmoudalaa.com

EOF
}

# Parse arguments
ENVIRONMENT="dev"
SERVICE=""
FOLLOW_LOGS=false
COMMAND=""

while [[ $# -gt 0 ]]; do
    case $1 in
        up|down|restart|build|logs|ps|clean)
            COMMAND=$1
            shift
            ;;
        -d|--dev)
            ENVIRONMENT="dev"
            shift
            ;;
        -p|--prod)
            ENVIRONMENT="prod"
            shift
            ;;
        -s|--service)
            SERVICE=$2
            shift 2
            ;;
        -f|--follow)
            FOLLOW_LOGS=true
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Set compose file based on environment
if [ "$ENVIRONMENT" == "prod" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    ENV_FILE=".env.prod"
else
    COMPOSE_FILE="docker-compose.dev.yml"
    ENV_FILE=".env"
fi

# Check if command is provided
if [ -z "$COMMAND" ]; then
    show_usage
    exit 0
fi

print_info "Using $ENVIRONMENT environment with $COMPOSE_FILE"

# Execute command
case $COMMAND in
    up)
        check_env_file
        print_info "Starting services..."
        if [ -z "$SERVICE" ]; then
            docker-compose -f $COMPOSE_FILE up -d
            print_success "All services started successfully!"
            print_info "Access URLs:"
            if [ "$ENVIRONMENT" == "dev" ]; then
                echo "  API:    http://localhost:4000"
                echo "  Admin:  http://localhost:3001"
                echo "  Web:    http://localhost:3000"
            else
                echo "  API:    https://api.mahmoudalaa.com"
                echo "  Admin:  https://admin.mahmoudalaa.com"
                echo "  Web:    https://demo.mahmoudalaa.com"
            fi
        else
            docker-compose -f $COMPOSE_FILE up -d $SERVICE
            print_success "$SERVICE started successfully!"
        fi
        ;;
        
    down)
        print_info "Stopping services..."
        if [ -z "$SERVICE" ]; then
            docker-compose -f $COMPOSE_FILE down
            print_success "All services stopped!"
        else
            docker-compose -f $COMPOSE_FILE stop $SERVICE
            print_success "$SERVICE stopped!"
        fi
        ;;
        
    restart)
        print_info "Restarting services..."
        if [ -z "$SERVICE" ]; then
            docker-compose -f $COMPOSE_FILE restart
            print_success "All services restarted!"
        else
            docker-compose -f $COMPOSE_FILE restart $SERVICE
            print_success "$SERVICE restarted!"
        fi
        ;;
        
    build)
        print_info "Building services..."
        if [ -z "$SERVICE" ]; then
            docker-compose -f $COMPOSE_FILE build --no-cache
            print_success "All services built successfully!"
        else
            docker-compose -f $COMPOSE_FILE build --no-cache $SERVICE
            print_success "$SERVICE built successfully!"
        fi
        ;;
        
    logs)
        if [ "$FOLLOW_LOGS" = true ]; then
            if [ -z "$SERVICE" ]; then
                docker-compose -f $COMPOSE_FILE logs -f
            else
                docker-compose -f $COMPOSE_FILE logs -f $SERVICE
            fi
        else
            if [ -z "$SERVICE" ]; then
                docker-compose -f $COMPOSE_FILE logs --tail=100
            else
                docker-compose -f $COMPOSE_FILE logs --tail=100 $SERVICE
            fi
        fi
        ;;
        
    ps)
        print_info "Running containers:"
        docker-compose -f $COMPOSE_FILE ps
        ;;
        
    clean)
        print_warning "This will remove all containers, volumes, and images!"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Cleaning up..."
            docker-compose -f $COMPOSE_FILE down -v --rmi all
            print_success "Cleanup completed!"
        else
            print_info "Cleanup cancelled."
        fi
        ;;
        
    *)
        print_error "Unknown command: $COMMAND"
        show_usage
        exit 1
        ;;
esac
