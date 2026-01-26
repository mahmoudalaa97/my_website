# VPS Deployment Guide

This guide will help you deploy the website on a VPS (Virtual Private Server) using Docker.

## Prerequisites

- VPS with at least 2GB RAM (4GB recommended)
- Ubuntu 20.04 LTS or later (or similar Linux distribution)
- Root or sudo access
- Domain name configured (optional but recommended)

## Initial VPS Setup

### 1. Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group
sudo usermod -aG docker $USER

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker
```

### 3. Install Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 4. Install Git (if not already installed)

```bash
sudo apt install git -y
```

## Application Deployment

### 1. Clone Repository

```bash
cd /var/www  # or your preferred directory
git clone https://github.com/mahmoudalaa97/my_website.git
cd my_website/docker
```

### 2. Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit the .env file with your actual values
nano .env
```

**Important environment variables to set:**

- `DB_PASSWORD`: Strong PostgreSQL password
- `JWT_SECRET`: Random 32+ character string
- `SESSION_SECRET`: Random 32+ character string
- `SMTP_*`: Email configuration for notifications
- `*_URL`: Your actual domain URLs

**Generate secure secrets:**

```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate SESSION_SECRET
openssl rand -base64 32
```

### 3. Deploy Application

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

Or manually:

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### 4. Verify Deployment

```bash
# Check container status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check specific service logs
docker logs website_api
docker logs website_web
docker logs website_admin
```

## Domain and SSL Configuration

### Option 1: Using Nginx on VPS (Recommended)

Install Certbot for SSL:

```bash
sudo apt install certbot python3-certbot-nginx -y
```

Configure nginx and obtain SSL certificates:

```bash
# Start nginx service
docker-compose -f docker-compose.prod.yml --profile with-nginx up -d nginx

# Obtain SSL certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com -d dashboard.yourdomain.com
```

### Option 2: Using Cloudflare (Easiest)

1. Add your domain to Cloudflare
2. Point DNS records to your VPS IP:
   - `A` record for `@` → VPS IP
   - `A` record for `www` → VPS IP
   - `A` record for `api` → VPS IP
   - `A` record for `dashboard` → VPS IP
3. Enable SSL/TLS in Cloudflare (Full mode)
4. Let Cloudflare handle SSL termination

## Database Management

### Run Migrations

```bash
docker exec website_api pnpm db:migrate
```

### Seed Database (Optional)

```bash
docker exec website_api pnpm db:seed
```

### Backup Database

```bash
# Create backup
docker exec website_postgres pg_dump -U postgres website_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker exec -i website_postgres psql -U postgres website_db < backup_file.sql
```

## Maintenance

### Update Application

```bash
cd /var/www/my_website
git pull origin main
cd docker
./deploy.sh
```

### View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f api
docker-compose -f docker-compose.prod.yml logs -f web
docker-compose -f docker-compose.prod.yml logs -f admin
```

### Restart Services

```bash
# Restart all services
docker-compose -f docker-compose.prod.yml restart

# Restart specific service
docker-compose -f docker-compose.prod.yml restart api
```

### Stop Services

```bash
docker-compose -f docker-compose.prod.yml down
```

### Clean Up

```bash
# Remove unused Docker resources
docker system prune -a --volumes

# Remove only dangling images
docker image prune -f
```

## Monitoring

### Check Container Health

```bash
docker ps
docker stats
```

### Check Disk Space

```bash
df -h
docker system df
```

### Monitor Resource Usage

```bash
# Install htop
sudo apt install htop -y
htop
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs [service-name]

# Check container details
docker inspect website_api
```

### Port Already in Use

```bash
# Find process using port
sudo lsof -i :4000
sudo lsof -i :3000
sudo lsof -i :3001

# Kill process
sudo kill -9 [PID]
```

### Database Connection Issues

```bash
# Check PostgreSQL container
docker logs website_postgres

# Connect to PostgreSQL
docker exec -it website_postgres psql -U postgres -d website_db
```

### Out of Memory

```bash
# Check memory usage
free -h

# Add swap space
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## Security Best Practices

1. **Firewall Configuration:**

```bash
# Install UFW
sudo apt install ufw -y

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

2. **Regular Updates:**

```bash
# Update system packages weekly
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

3. **Backup Strategy:**
   - Database backups: Daily
   - Uploads folder: Daily
   - Configuration files: After changes

4. **Monitor Logs:**
   - Check application logs regularly
   - Set up log rotation to prevent disk space issues

## Performance Optimization

### Enable Docker BuildKit

Add to `/etc/environment`:

```bash
DOCKER_BUILDKIT=1
COMPOSE_DOCKER_CLI_BUILD=1
```

### Configure Docker Logging

Create `/etc/docker/daemon.json`:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

Restart Docker:

```bash
sudo systemctl restart docker
```

## Support

For issues or questions:
- Check application logs first
- Review this documentation
- Check GitHub issues
- Contact system administrator

## Useful Commands Reference

```bash
# Start services
docker-compose -f docker-compose.prod.yml up -d

# Stop services
docker-compose -f docker-compose.prod.yml down

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Execute command in container
docker exec -it website_api sh

# Database backup
docker exec website_postgres pg_dump -U postgres website_db > backup.sql

# Clean up
docker system prune -a --volumes
```
