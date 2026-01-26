#!/bin/bash

# Database Migration and Seed Script for Docker
# This script helps manage database migrations and seeding

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

# Show usage
show_usage() {
    cat << EOF
${GREEN}Database Migration and Seed Management${NC}

Usage: ./db-manager.sh [COMMAND] [ENVIRONMENT]

${BLUE}Commands:${NC}
  migrate         Run all pending migrations
  migrate:revert  Revert the last migration
  seed            Run database seeding
  reset           Reset database (migrate + seed)
  status          Check migration status
  shell           Open database shell (psql)
  backup          Create database backup
  restore         Restore database from backup
  
${BLUE}Options:${NC}
  -d, --dev       Use development environment (default)
  -p, --prod      Use production environment
  -h, --help      Show this help message

${BLUE}Examples:${NC}
  ./db-manager.sh migrate              # Run migrations in dev
  ./db-manager.sh migrate --prod       # Run migrations in prod
  ./db-manager.sh seed                 # Seed database in dev
  ./db-manager.sh reset                # Reset database (migrate + seed)
  ./db-manager.sh shell                # Open PostgreSQL shell
  ./db-manager.sh backup               # Create backup

${BLUE}Important Notes:${NC}
  - Ensure the API container is running before executing commands
  - Backup your database before running migrations in production
  - Seeding will create default admin user from .env variables

EOF
}

# Parse arguments
ENVIRONMENT="dev"
COMMAND=""

while [[ $# -gt 0 ]]; do
    case $1 in
        migrate|seed|reset|status|shell|backup|restore)
            COMMAND=$1
            shift
            ;;
        migrate:revert)
            COMMAND="migrate:revert"
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

# Set compose file and container names based on environment
if [ "$ENVIRONMENT" == "prod" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    API_CONTAINER="my_website_api_prod"
    DB_CONTAINER="my_website_postgres_prod"
else
    COMPOSE_FILE="docker-compose.dev.yml"
    API_CONTAINER="my_website_api_dev"
    DB_CONTAINER="my_website_postgres_dev"
fi

# Check if command is provided
if [ -z "$COMMAND" ]; then
    show_usage
    exit 0
fi

# Check if containers are running
check_containers() {
    if ! docker ps | grep -q "$API_CONTAINER"; then
        print_error "$API_CONTAINER is not running!"
        print_info "Start it with: docker-compose -f $COMPOSE_FILE up -d"
        exit 1
    fi
}

# Execute command
case $COMMAND in
    migrate)
        check_containers
        print_info "Running database migrations..."
        docker exec -it $API_CONTAINER sh -c "cd /app && pnpm db:migrate"
        print_success "Migrations completed successfully!"
        ;;
        
    migrate:revert)
        check_containers
        print_warning "This will revert the last migration!"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Reverting last migration..."
            docker exec -it $API_CONTAINER sh -c "cd /app && pnpm db:migrate:revert"
            print_success "Migration reverted!"
        else
            print_info "Revert cancelled."
        fi
        ;;
        
    seed)
        check_containers
        print_info "Seeding database..."
        docker exec -it $API_CONTAINER sh -c "cd /app && pnpm db:seed"
        print_success "Database seeded successfully!"
        print_warning "Default admin credentials are set from .env file"
        ;;
        
    reset)
        check_containers
        print_warning "This will run migrations and seed the database!"
        read -p "Continue? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Running migrations..."
            docker exec -it $API_CONTAINER sh -c "cd /app && pnpm db:migrate"
            print_success "Migrations completed!"
            
            print_info "Seeding database..."
            docker exec -it $API_CONTAINER sh -c "cd /app && pnpm db:seed"
            print_success "Database reset completed!"
        else
            print_info "Reset cancelled."
        fi
        ;;
        
    status)
        check_containers
        print_info "Checking migration status..."
        docker exec -it $API_CONTAINER sh -c "cd /app && pnpm typeorm migration:show -d dist/data-source.js"
        ;;
        
    shell)
        if ! docker ps | grep -q "$DB_CONTAINER"; then
            print_error "$DB_CONTAINER is not running!"
            exit 1
        fi
        print_info "Opening PostgreSQL shell..."
        print_info "Common commands:"
        print_info "  \\dt          - List all tables"
        print_info "  \\d+ <table>  - Describe table"
        print_info "  \\q           - Quit"
        echo
        
        # Get database info from .env or use defaults
        if [ -f .env ]; then
            source .env
        fi
        
        DB_NAME="${POSTGRES_DB:-my_website}"
        DB_USER="${POSTGRES_USER:-postgres}"
        
        docker exec -it $DB_CONTAINER psql -U $DB_USER -d $DB_NAME
        ;;
        
    backup)
        if ! docker ps | grep -q "$DB_CONTAINER"; then
            print_error "$DB_CONTAINER is not running!"
            exit 1
        fi
        
        BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
        
        # Get database info from .env or use defaults
        if [ -f .env ]; then
            source .env
        fi
        
        DB_NAME="${POSTGRES_DB:-my_website}"
        DB_USER="${POSTGRES_USER:-postgres}"
        
        print_info "Creating backup: $BACKUP_FILE"
        docker exec $DB_CONTAINER pg_dump -U $DB_USER $DB_NAME > $BACKUP_FILE
        print_success "Backup created: $BACKUP_FILE"
        ;;
        
    restore)
        if ! docker ps | grep -q "$DB_CONTAINER"; then
            print_error "$DB_CONTAINER is not running!"
            exit 1
        fi
        
        # List available backup files
        BACKUPS=(backup_*.sql)
        if [ ${#BACKUPS[@]} -eq 0 ] || [ ! -f "${BACKUPS[0]}" ]; then
            print_error "No backup files found!"
            exit 1
        fi
        
        print_info "Available backups:"
        select BACKUP_FILE in "${BACKUPS[@]}"; do
            if [ -n "$BACKUP_FILE" ]; then
                break
            fi
        done
        
        print_warning "This will restore database from: $BACKUP_FILE"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Get database info from .env or use defaults
            if [ -f .env ]; then
                source .env
            fi
            
            DB_NAME="${POSTGRES_DB:-my_website}"
            DB_USER="${POSTGRES_USER:-postgres}"
            
            print_info "Restoring database..."
            cat $BACKUP_FILE | docker exec -i $DB_CONTAINER psql -U $DB_USER $DB_NAME
            print_success "Database restored from: $BACKUP_FILE"
        else
            print_info "Restore cancelled."
        fi
        ;;
        
    *)
        print_error "Unknown command: $COMMAND"
        show_usage
        exit 1
        ;;
esac
