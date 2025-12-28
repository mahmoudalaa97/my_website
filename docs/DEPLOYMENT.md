# Deployment Guide

This guide covers deploying your website to various platforms.

## Deployment Options

| Platform | Best For | Difficulty |
|----------|----------|------------|
| Vercel + Railway | Quick setup, auto-scaling | Easy |
| Railway | Full-stack in one place | Easy |
| Docker on VPS | Full control, self-hosted | Medium |
| Kubernetes | Enterprise scale | Advanced |

---

## Option 1: Vercel + Railway (Recommended)

Deploy the frontend apps to Vercel and the backend to Railway.

### Prerequisites

- [Vercel account](https://vercel.com)
- [Railway account](https://railway.app)
- GitHub repository with your code

### Step 1: Deploy API to Railway

1. Go to [Railway](https://railway.app) and create a new project
2. Click "Deploy from GitHub repo" and select your repository
3. Railway will auto-detect the monorepo. Configure the API service:
   - **Root Directory**: `apps/api`
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `node dist/main.js`

4. Add a PostgreSQL database:
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will auto-inject the `DATABASE_URL` variable

5. Add Redis (optional):
   - Click "New" → "Database" → "Redis"

6. Set environment variables:
   ```
   NODE_ENV=production
   JWT_SECRET=your-production-secret
   SESSION_SECRET=your-session-secret
   WEB_URL=https://your-website.vercel.app
   ADMIN_URL=https://your-admin.vercel.app
   ```

7. Note your Railway API URL (e.g., `https://api-production-xxxx.up.railway.app`)

### Step 2: Deploy Public Website to Vercel

1. Go to [Vercel](https://vercel.com) and import your GitHub repository
2. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && pnpm install && pnpm build --filter=@repo/web`

3. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://api-production-xxxx.up.railway.app/api
   ```

4. Deploy!

### Step 3: Deploy Admin Dashboard to Vercel

1. Import the same repository again in Vercel
2. Configure differently:
   - **Root Directory**: `apps/admin`
   - **Build Command**: `cd ../.. && pnpm install && pnpm build --filter=@repo/admin`

3. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://api-production-xxxx.up.railway.app/api
   ```

4. Deploy!

### Step 4: Update CORS Settings

In Railway, update your API environment variables to include your Vercel domains in CORS:
```
WEB_URL=https://your-website.vercel.app
ADMIN_URL=https://your-admin.vercel.app
```

---

## Option 2: Railway Only

Deploy everything to Railway.

### Step 1: Create Project

1. Go to Railway and create a new project
2. Add PostgreSQL and Redis databases

### Step 2: Deploy Services

For each service (api, web, admin), add a new service:

1. Click "New" → "GitHub Repo"
2. Select your repository
3. Configure each service:

**API Service:**
```
Root Directory: apps/api
Build Command: pnpm install && pnpm build
Start Command: node dist/main.js
```

**Web Service:**
```
Root Directory: apps/web
Build Command: cd ../.. && pnpm install && pnpm build --filter=@repo/web
Start Command: cd ../.. && pnpm start --filter=@repo/web
```

**Admin Service:**
```
Root Directory: apps/admin
Build Command: cd ../.. && pnpm install && pnpm build --filter=@repo/admin
Start Command: cd ../.. && pnpm start --filter=@repo/admin
```

### Step 3: Configure Domains

1. For each service, go to Settings → Domains
2. Generate a Railway domain or add your custom domain

---

## Option 3: Docker on VPS

Deploy using Docker Compose on a VPS (DigitalOcean, AWS EC2, etc.).

### Prerequisites

- VPS with Docker and Docker Compose installed
- Domain name pointing to your server
- SSL certificate (Let's Encrypt)

### Step 1: Prepare Your Server

```bash
# SSH into your server
ssh user@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Docker Compose
sudo apt install docker-compose-plugin

# Create app directory
mkdir -p /app
cd /app
```

### Step 2: Clone and Configure

```bash
# Clone your repository
git clone https://github.com/yourusername/website-template.git .

# Create production environment file
cp apps/api/.env.example apps/api/.env.production

# Edit with production values
nano apps/api/.env.production
```

Set production values:
```env
NODE_ENV=production
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-secure-password
DB_NAME=website_db
REDIS_HOST=redis
JWT_SECRET=your-very-secure-jwt-secret
SESSION_SECRET=your-very-secure-session-secret
WEB_URL=https://your-domain.com
ADMIN_URL=https://admin.your-domain.com
API_URL=https://api.your-domain.com
```

### Step 3: Build and Deploy

```bash
# Build and start all services
docker compose -f docker/docker-compose.prod.yml up -d --build

# Run migrations
docker compose -f docker/docker-compose.prod.yml exec api pnpm db:migrate

# Seed initial data (first time only)
docker compose -f docker/docker-compose.prod.yml exec api pnpm db:seed
```

### Step 4: Configure Nginx & SSL

Edit `docker/nginx.conf` with your domain names:

```nginx
server_name your-domain.com www.your-domain.com;
```

Start with Nginx profile:
```bash
docker compose -f docker/docker-compose.prod.yml --profile with-nginx up -d
```

For SSL, use Certbot:
```bash
# Install certbot
apt install certbot python3-certbot-nginx

# Get certificates
certbot --nginx -d your-domain.com -d www.your-domain.com -d admin.your-domain.com -d api.your-domain.com
```

### Step 5: Auto-restart and Updates

Set Docker to start on boot:
```bash
sudo systemctl enable docker
```

Create update script `/app/update.sh`:
```bash
#!/bin/bash
cd /app
git pull
docker compose -f docker/docker-compose.prod.yml up -d --build
docker compose -f docker/docker-compose.prod.yml exec api pnpm db:migrate
```

---

## Environment Variables Reference

### API (`apps/api/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | `development` or `production` |
| `DB_HOST` | Yes | PostgreSQL host |
| `DB_PORT` | Yes | PostgreSQL port |
| `DB_USERNAME` | Yes | Database username |
| `DB_PASSWORD` | Yes | Database password |
| `DB_NAME` | Yes | Database name |
| `REDIS_HOST` | No | Redis host |
| `REDIS_PORT` | No | Redis port |
| `JWT_SECRET` | Yes | Secret for JWT tokens |
| `SESSION_SECRET` | Yes | Secret for sessions |
| `WEB_URL` | Yes | Public website URL |
| `ADMIN_URL` | Yes | Admin dashboard URL |
| `SMTP_HOST` | No | Email SMTP host |
| `SMTP_PORT` | No | Email SMTP port |
| `SMTP_USER` | No | Email username |
| `SMTP_PASS` | No | Email password |

### Frontend Apps

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Full API URL (e.g., `https://api.your-domain.com/api`) |

---

## Post-Deployment Checklist

- [ ] Change default admin password
- [ ] Configure custom domain
- [ ] Set up SSL certificates
- [ ] Configure email (SMTP) for user invitations
- [ ] Update branding in admin dashboard
- [ ] Test contact form
- [ ] Set up monitoring (optional)
- [ ] Configure backups (optional)

---

## Monitoring & Maintenance

### Health Checks

The API provides health endpoints:
- `/api/health` - Full health check
- `/api/health/live` - Liveness probe
- `/api/health/ready` - Readiness probe

### Logs

**Railway:**
View logs in the Railway dashboard.

**Docker:**
```bash
# View all logs
docker compose -f docker/docker-compose.prod.yml logs

# Follow specific service
docker compose -f docker/docker-compose.prod.yml logs -f api
```

### Backups

**Database backup:**
```bash
docker compose -f docker/docker-compose.prod.yml exec postgres pg_dump -U postgres website_db > backup.sql
```

**Restore:**
```bash
docker compose -f docker/docker-compose.prod.yml exec -T postgres psql -U postgres website_db < backup.sql
```

