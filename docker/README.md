# Docker Setup for Turborepo Monorepo

This directory contains Docker configurations for running the entire monorepo with nginx reverse proxy.

## Architecture

The setup includes:

- **API**: NestJS backend API
- **Admin**: Next.js admin dashboard
- **Web**: Next.js public website
- **Nginx**: Reverse proxy for routing
- **PostgreSQL**: Database

## Domain Configuration

### Production

- API: `api.mahmoudalaa.com`
- Admin: `admin.mahmoudalaa.com`
- Web: `demo.mahmoudalaa.com`

### Local Development

- API: `localhost:4000`
- Admin: `localhost:3001`
- Web: `localhost:3000`
- Database: `localhost:5432`

## Quick Start

### Development Environment

1. **Create environment file:**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Build and run all services:**

   ```bash
   cd docker
   docker-compose -f docker-compose.dev.yml up --build
   ```

3. **Run in detached mode:**

   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. **View logs:**

   ```bash
   docker-compose -f docker-compose.dev.yml logs -f
   ```

5. **Stop all services:**
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

### Production Environment

1. **Create environment file:**

   ```bash
   cp .env.example .env.prod
   # Edit .env.prod with your production configuration
   ```

2. **Build and run:**

   ```bash
   docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
   ```

3. **View logs:**
   ```bash
   docker-compose -f docker-compose.prod.yml logs -f
   ```

## Individual Service Commands

### Build specific service

```bash
docker-compose -f docker-compose.dev.yml build api
docker-compose -f docker-compose.dev.yml build admin
docker-compose -f docker-compose.dev.yml build web
```

### Restart specific service

```bash
docker-compose -f docker-compose.dev.yml restart api
```

### View logs for specific service

```bash
docker-compose -f docker-compose.dev.yml logs -f api
```

## Database Management

### Using the Database Manager Script

The easiest way to manage migrations and seeding:

```bash
cd docker

# Run migrations
./db-manager.sh migrate

# Seed the database
./db-manager.sh seed

# Run both migrations and seed
./db-manager.sh reset

# Check migration status
./db-manager.sh status

# Open PostgreSQL shell
./db-manager.sh shell

# Create backup
./db-manager.sh backup

# Restore from backup
./db-manager.sh restore
```

### Manual Database Commands

#### Run Migrations

Development:

```bash
docker exec -it my_website_api_dev sh -c "cd /app && pnpm db:migrate"
```

Production:

```bash
docker exec -it my_website_api_prod sh -c "cd /app && pnpm db:migrate"
```

#### Seed Database

Development:

```bash
docker exec -it my_website_api_dev sh -c "cd /app && pnpm db:seed"
```

Production:

```bash
docker exec -it my_website_api_prod sh -c "cd /app && pnpm db:seed"
```

#### Revert Last Migration

```bash
docker exec -it my_website_api_dev sh -c "cd /app && pnpm db:migrate:revert"
```

### Access PostgreSQL

```bash
docker exec -it my_website_postgres_dev psql -U postgres -d my_website
```

### Run migrations

```bash
docker exec -it my_website_api_dev npm run migration:run
```

### Create a backup

```bash
docker exec my_website_postgres_dev pg_dump -U postgres my_website > backup.sql
```

### Restore from backup

```bash
cat backup.sql | docker exec -i my_website_postgres_dev psql -U postgres my_website
```

## Troubleshooting

### Clear all containers and volumes

```bash
docker-compose -f docker-compose.dev.yml down -v
```

### Rebuild without cache

```bash
docker-compose -f docker-compose.dev.yml build --no-cache
```

### Check service health

```bash
docker-compose -f docker-compose.dev.yml ps
```

### Access container shell

```bash
docker exec -it my_website_api_dev sh
docker exec -it my_website_admin_dev sh
docker exec -it my_website_web_dev sh
```

## Nginx Configuration

### Test nginx configuration

```bash
docker exec my_website_nginx_dev nginx -t
```

### Reload nginx

```bash
docker exec my_website_nginx_dev nginx -s reload
```

## Next.js Configuration

For Next.js apps to work with Docker, ensure your `next.config.ts` includes:

```typescript
const nextConfig = {
  output: "standalone",
  // ... other config
};
```

## SSL/HTTPS Setup (Production)

For production with HTTPS:

1. Place SSL certificates in `docker/ssl/` directory:
   - `api.mahmoudalaa.com.crt`
   - `api.mahmoudalaa.com.key`
   - `admin.mahmoudalaa.com.crt`
   - `admin.mahmoudalaa.com.key`
   - `demo.mahmoudalaa.com.crt`
   - `demo.mahmoudalaa.com.key`

2. Update `nginx.conf` to include SSL configuration for each server block.

## Environment Variables

Key environment variables:

- `NODE_ENV`: Environment mode (development/production)
- `PORT`: Application port
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `NEXT_PUBLIC_API_URL`: API URL for Next.js apps
- `POSTGRES_USER`: Database username
- `POSTGRES_PASSWORD`: Database password
- `POSTGRES_DB`: Database name

## Performance Tips

1. Use multi-stage builds to reduce image size
2. Enable nginx caching for static assets
3. Use `.dockerignore` to exclude unnecessary files
4. Set appropriate resource limits in production

## Monitoring

### Check resource usage

```bash
docker stats
```

### View all running containers

```bash
docker ps
```

### Check logs for errors

```bash
docker-compose -f docker-compose.dev.yml logs | grep -i error
```
