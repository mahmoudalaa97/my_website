# 🐳 Docker Setup Guide

Complete Docker setup for the Turborepo monorepo with nginx reverse proxy.

## 📋 Quick Start

### For Local Development

```bash
# 1. Navigate to docker directory
cd docker

# 2. Create environment file
cp .env.example .env

# 3. Start all services
./docker-manager.sh up

# OR using docker-compose directly
docker-compose -f docker-compose.dev.yml up -d
```

Your services will be available at:

- **API**: http://localhost:4000
- **Admin**: http://localhost:3001
- **Web**: http://localhost:3000

## 🌐 Domain Configuration

### Production Domains

- **API**: `api.mahmoudalaa.com`
- **Admin**: `admin.mahmoudalaa.com`
- **Web**: `demo.mahmoudalaa.com`

### Local Development

- **API**: `localhost:4000`
- **Admin**: `localhost:3001`
- **Web**: `localhost:3000`
- **Database**: `localhost:5432`

## 🛠️ Using the Docker Manager Script

The `docker-manager.sh` script simplifies Docker operations:

```bash
# Start development environment
./docker/docker-manager.sh up

# Start production environment
./docker/docker-manager.sh up --prod

# View logs (follow mode)
./docker/docker-manager.sh logs -f

# View logs for specific service
./docker/docker-manager.sh logs -s api -f

# Build specific service
./docker/docker-manager.sh build -s web

# Restart specific service
./docker/docker-manager.sh restart -s api

# Stop all services
./docker/docker-manager.sh down

# Clean everything (containers, volumes, images)
./docker/docker-manager.sh clean
```

## 📦 Services

### 1. API (NestJS)

- **Port**: 4000
- **Technology**: NestJS, TypeORM, PostgreSQL
- **Dockerfile**: `docker/Dockerfile.api`
- **Health Check**: `/api/health`

### 2. Admin Dashboard (Next.js)

- **Port**: 3001
- **Technology**: Next.js 15, React, TypeScript
- **Dockerfile**: `docker/Dockerfile.admin`
- **API Connection**: Uses `NEXT_PUBLIC_API_URL`

### 3. Web Frontend (Next.js)

- **Port**: 3000
- **Technology**: Next.js 15, React, TypeScript
- **Dockerfile**: `docker/Dockerfile.web`
- **API Connection**: Uses `NEXT_PUBLIC_API_URL`

### 4. Nginx (Reverse Proxy)

- **Ports**: 80 (HTTP), 443 (HTTPS)
- **Configuration**: `docker/nginx.conf`
- **Purpose**: Routes traffic based on domain names

### 5. PostgreSQL (Database)

- **Port**: 5432
- **Version**: PostgreSQL 16
- **Data Persistence**: Docker volumes

## ⚙️ Environment Variables

### Required Variables

Create a `.env` file in the `docker/` directory:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=my_website

# API
DATABASE_URL=postgresql://postgres:your_secure_password@postgres:5432/my_website
JWT_SECRET=your_jwt_secret_key_min_32_chars
JWT_EXPIRES_IN=7d

# Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin123!

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@mahmoudalaa.com
```

## 🚀 Deployment Steps

### Development

```bash
# 1. Setup environment
cd docker
cp .env.example .env
# Edit .env with your values

# 2. Build and start
docker-compose -f docker-compose.dev.yml up --build -d

# 3. Check status
docker-compose -f docker-compose.dev.yml ps

# 4. View logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Production

```bash
# 1. Setup environment
cd docker
cp .env.example .env.prod
# Edit .env.prod with production values

# 2. Build and start
docker-compose -f docker-compose.prod.yml --env-file .env.prod up --build -d

# 3. Check status
docker-compose -f docker-compose.prod.yml ps
```

## 🔍 Troubleshooting

### Check Service Health

```bash
# Check all services
docker-compose -f docker-compose.dev.yml ps

# Check specific service logs
docker-compose -f docker-compose.dev.yml logs api
docker-compose -f docker-compose.dev.yml logs admin
docker-compose -f docker-compose.dev.yml logs web
```

### Common Issues

#### 1. Port Already in Use

```bash
# Check what's using the port
lsof -i :4000
lsof -i :3001
lsof -i :3000

# Kill the process or change the port in docker-compose.yml
```

#### 2. Database Connection Issues

```bash
# Check if PostgreSQL is running
docker exec my_website_postgres_dev pg_isready -U postgres

# Access database
docker exec -it my_website_postgres_dev psql -U postgres -d my_website
```

#### 3. Build Failures

```bash
# Clean rebuild without cache
docker-compose -f docker-compose.dev.yml build --no-cache

# Remove all containers and volumes
docker-compose -f docker-compose.dev.yml down -v

# Remove all images
docker-compose -f docker-compose.dev.yml down --rmi all
```

#### 4. Next.js Build Issues

Ensure `next.config.ts` has:

```typescript
output: process.env.NODE_ENV === "production" ? "standalone" : undefined;
```

### Reset Everything

```bash
# Stop and remove everything
docker-compose -f docker-compose.dev.yml down -v --rmi all

# Clean Docker system
docker system prune -a --volumes
```

## 📊 Database Management

### Access PostgreSQL

```bash
docker exec -it my_website_postgres_dev psql -U postgres -d my_website
```

### Run Migrations

```bash
# Inside API container
docker exec -it my_website_api_dev sh
npm run migration:run
```

### Backup Database

```bash
docker exec my_website_postgres_dev pg_dump -U postgres my_website > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database

```bash
cat backup.sql | docker exec -i my_website_postgres_dev psql -U postgres my_website
```

## 🔐 SSL/HTTPS Setup (Production)

### 1. Obtain SSL Certificates

Use Let's Encrypt with Certbot:

```bash
# Install certbot
sudo apt-get install certbot

# Generate certificates
sudo certbot certonly --standalone -d api.mahmoudalaa.com
sudo certbot certonly --standalone -d admin.mahmoudalaa.com
sudo certbot certonly --standalone -d demo.mahmoudalaa.com
```

### 2. Copy Certificates

```bash
# Create SSL directory
mkdir -p docker/ssl

# Copy certificates
sudo cp /etc/letsencrypt/live/api.mahmoudalaa.com/fullchain.pem docker/ssl/api.crt
sudo cp /etc/letsencrypt/live/api.mahmoudalaa.com/privkey.pem docker/ssl/api.key

# Repeat for other domains
```

### 3. Update nginx.conf

Add SSL server blocks:

```nginx
server {
    listen 443 ssl http2;
    server_name api.mahmoudalaa.com;

    ssl_certificate /etc/nginx/ssl/api.crt;
    ssl_certificate_key /etc/nginx/ssl/api.key;

    # ... rest of configuration
}
```

## 📈 Monitoring

### View Resource Usage

```bash
docker stats
```

### Check Logs

```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Specific service with timestamp
docker-compose -f docker-compose.dev.yml logs -f --timestamps api
```

### Health Checks

```bash
# API
curl http://localhost:4000/api/health

# Admin
curl http://localhost:3001

# Web
curl http://localhost:3000
```

## 🎯 Best Practices

1. **Always use environment variables** for sensitive data
2. **Regular backups** of the database
3. **Monitor logs** for errors and issues
4. **Keep images updated** with security patches
5. **Use volumes** for persistent data
6. **Implement health checks** for all services
7. **Set resource limits** in production
8. **Use multi-stage builds** to reduce image size

## 📝 Development Workflow

1. **Start services**: `./docker/docker-manager.sh up`
2. **Make changes** to your code
3. **Rebuild specific service**: `./docker/docker-manager.sh build -s api`
4. **Restart service**: `./docker/docker-manager.sh restart -s api`
5. **Check logs**: `./docker/docker-manager.sh logs -s api -f`

## 🔄 Updates and Maintenance

### Update Dependencies

```bash
# Rebuild all services
./docker/docker-manager.sh build

# Restart all services
./docker/docker-manager.sh restart
```

### Clean Old Images

```bash
docker image prune -a
```

## 📞 Support

For issues or questions:

1. Check the logs first
2. Verify environment variables
3. Ensure ports are not in use
4. Check Docker daemon is running

---

**Made with ❤️ for Turborepo Monorepo**
