#!/bin/bash

# Backup Script for VPS Deployment
# Creates backups of database and uploads

set -e

# Configuration
BACKUP_DIR="/var/backups/my_website"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "💾 Starting backup process..."

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Backup PostgreSQL database
echo "Backing up PostgreSQL database..."
docker exec website_postgres pg_dump -U postgres website_db > "$BACKUP_DIR/db_backup_$DATE.sql"
gzip "$BACKUP_DIR/db_backup_$DATE.sql"
echo -e "${GREEN}✓ Database backup completed: db_backup_$DATE.sql.gz${NC}"

# Backup uploads directory (if it exists)
if docker volume inspect docker_uploads_data > /dev/null 2>&1; then
    echo "Backing up uploads directory..."
    docker run --rm -v docker_uploads_data:/source -v "$BACKUP_DIR:/backup" alpine \
        tar czf "/backup/uploads_backup_$DATE.tar.gz" -C /source .
    echo -e "${GREEN}✓ Uploads backup completed: uploads_backup_$DATE.tar.gz${NC}"
fi

# Remove old backups
echo "Cleaning up old backups (older than $RETENTION_DAYS days)..."
find "$BACKUP_DIR" -name "db_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "uploads_backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete
echo -e "${GREEN}✓ Old backups cleaned up${NC}"

# Show backup size
echo ""
echo "📦 Backup summary:"
ls -lh "$BACKUP_DIR" | grep "$DATE"

echo ""
echo -e "${GREEN}✅ Backup completed successfully!${NC}"
echo -e "${YELLOW}Backups stored in: $BACKUP_DIR${NC}"
