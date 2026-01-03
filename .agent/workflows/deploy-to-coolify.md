---
description: Deploy backend and frontend to Coolify using Hostinger VPS
---

# Deploy to Coolify on Hostinger VPS

This workflow guides you through deploying your monorepo (API backend, public website, and admin dashboard) to Coolify running on a Hostinger VPS.

## Prerequisites

Before starting, ensure you have:

1. **Hostinger VPS** with:
   - Ubuntu 20.04+ or Debian 11+
   - At least 2GB RAM (4GB+ recommended)
   - Root or sudo access
   - Public IP address

2. **Domain names** (optional but recommended):
   - `yourdomain.com` → Public website
   - `admin.yourdomain.com` → Admin dashboard
   - `api.yourdomain.com` → API backend

3. **GitHub repository** with your code pushed

---

## Part 1: Install Coolify on Hostinger VPS

### 1. SSH into your Hostinger VPS

```bash
ssh root@your-vps-ip
```

### 2. Update system packages

```bash
apt update && apt upgrade -y
```

### 3. Install Coolify

Run the official Coolify installation script:

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

This will:
- Install Docker and Docker Compose
- Install Coolify
- Set up the Coolify dashboard
- Start Coolify services

**Installation takes 5-10 minutes**

### 4. Access Coolify Dashboard

Once installed, access Coolify at:
```
http://your-vps-ip:8000
```

**First-time setup:**
- Create your admin account
- Set a strong password
- Configure your email (optional)

---

## Part 2: Configure Coolify

### 1. Add your server

In Coolify dashboard:
- Go to **Servers** → **Add Server**
- Select **Localhost** (since Coolify is on the same VPS)
- Coolify will validate the connection

### 2. Create a new project

- Go to **Projects** → **New Project**
- Name: `my-website`
- Description: `Full-stack website with admin dashboard`

### 3. Configure domains (if you have them)

In your domain registrar (Hostinger, Namecheap, etc.):

**A Records:**
```
@               → your-vps-ip
www             → your-vps-ip
admin           → your-vps-ip
api             → your-vps-ip
```

**Wait 5-10 minutes for DNS propagation**

---

## Part 3: Deploy PostgreSQL Database

### 1. Add PostgreSQL service

In your project:
- Click **New Resource** → **Database** → **PostgreSQL**
- Configuration:
  - **Name:** `website-postgres`
  - **Version:** `16` (or latest)
  - **Database name:** `website_db`
  - **Username:** `postgres`
  - **Password:** Generate a strong password (save it!)
  - **Port:** `5432` (internal)

### 2. Deploy database

- Click **Deploy**
- Wait for deployment to complete (~2 minutes)
- Note the **internal connection string** (e.g., `postgres:5432`)

---

## Part 4: Deploy Redis Cache

### 1. Add Redis service

In your project:
- Click **New Resource** → **Database** → **Redis**
- Configuration:
  - **Name:** `website-redis`
  - **Version:** `7` (or latest)
  - **Port:** `6379` (internal)

### 2. Deploy Redis

- Click **Deploy**
- Wait for deployment (~1 minute)
- Note the **internal connection string** (e.g., `redis:6379`)

---

## Part 5: Deploy API Backend (NestJS)

### 1. Add API application

In your project:
- Click **New Resource** → **Application**
- **Source:** GitHub
- Connect your GitHub account if not already connected
- Select your repository
- **Branch:** `main` (or your production branch)

### 2. Configure API build settings

**Build Pack:** `Dockerfile`

**Dockerfile Path:** `docker/Dockerfile.api`

**Build Context:** `.` (root of repository)

**Port:** `4000`

### 3. Set environment variables

Add these environment variables:

```bash
# Node Environment
NODE_ENV=production

# Database Configuration
DB_HOST=website-postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=<your-postgres-password>
DB_NAME=website_db

# Redis Configuration
REDIS_HOST=website-redis
REDIS_PORT=6379

# JWT & Session Secrets (generate strong random strings)
JWT_SECRET=<generate-random-string-32-chars>
SESSION_SECRET=<generate-random-string-32-chars>

# SMTP Configuration (for emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com

# URLs
FRONTEND_URL=https://admin.yourdomain.com
WEB_URL=https://yourdomain.com
ADMIN_URL=https://admin.yourdomain.com
API_URL=https://api.yourdomain.com
```

**To generate secure secrets:**
```bash
openssl rand -base64 32
```

### 4. Configure domain (optional)

If using a custom domain:
- **Domain:** `api.yourdomain.com`
- **Enable SSL:** Yes (Coolify auto-generates Let's Encrypt certificates)

### 5. Deploy API

- Click **Deploy**
- Monitor build logs
- First deployment takes 5-10 minutes (building Docker image)

### 6. Run database migrations

After API is deployed, run migrations:

In Coolify:
- Go to your API application
- Click **Execute Command**
- Run:
```bash
cd apps/api && npx typeorm migration:run -d dist/config/typeorm.config.js
```

### 7. Seed the database

Run the seed command:
```bash
cd apps/api && npm run seed
```

Or execute the seed script directly if available.

---

## Part 6: Deploy Public Website (Next.js)

### 1. Add web application

In your project:
- Click **New Resource** → **Application**
- **Source:** Same GitHub repository
- **Branch:** `main`

### 2. Configure web build settings

**Build Pack:** `Dockerfile`

**Dockerfile Path:** `docker/Dockerfile.web`

**Build Context:** `.`

**Port:** `3000`

### 3. Set environment variables

```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

**Build arguments:**
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

### 4. Configure domain

- **Domain:** `yourdomain.com` and `www.yourdomain.com`
- **Enable SSL:** Yes

### 5. Deploy website

- Click **Deploy**
- Monitor build logs
- Deployment takes 5-10 minutes

---

## Part 7: Deploy Admin Dashboard (Next.js)

### 1. Add admin application

In your project:
- Click **New Resource** → **Application**
- **Source:** Same GitHub repository
- **Branch:** `main`

### 2. Configure admin build settings

**Build Pack:** `Dockerfile`

**Dockerfile Path:** `docker/Dockerfile.admin`

**Build Context:** `.`

**Port:** `3001`

### 3. Set environment variables

```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

**Build arguments:**
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

### 4. Configure domain

- **Domain:** `admin.yourdomain.com`
- **Enable SSL:** Yes

### 5. Deploy admin dashboard

- Click **Deploy**
- Monitor build logs
- Deployment takes 5-10 minutes

---

## Part 8: Verify Deployment

### 1. Check all services are running

In Coolify dashboard, verify all services show **Running** status:
- ✅ PostgreSQL
- ✅ Redis
- ✅ API
- ✅ Web
- ✅ Admin

### 2. Test the applications

**API Health Check:**
```bash
curl https://api.yourdomain.com/api/health
```

**Public Website:**
Open `https://yourdomain.com` in browser

**Admin Dashboard:**
Open `https://admin.yourdomain.com` in browser

### 3. Test admin login

Use the credentials created during database seeding.

---

## Part 9: Configure Automatic Deployments

### 1. Enable GitHub webhooks

In each application:
- Go to **Settings** → **Webhooks**
- Click **Enable Automatic Deployment**
- Coolify will add a webhook to your GitHub repository

Now, every push to `main` branch will trigger automatic deployment!

### 2. Configure deployment branches (optional)

You can set different branches for different environments:
- `main` → Production
- `staging` → Staging environment

---

## Part 10: Monitoring & Maintenance

### 1. View logs

In Coolify:
- Click on any application
- Go to **Logs** tab
- View real-time logs

### 2. Resource monitoring

- Go to **Servers** → Your server
- View CPU, RAM, and disk usage

### 3. Backups

**Database backups:**
- Go to PostgreSQL service
- Click **Backups**
- Configure automatic backups (recommended: daily)

**Volume backups:**
- Coolify automatically manages Docker volumes
- Consider setting up VPS snapshots in Hostinger panel

### 4. SSL Certificate renewal

Coolify automatically renews Let's Encrypt certificates every 90 days.

---

## Troubleshooting

### Issue: Build fails with "out of memory"

**Solution:** Increase VPS RAM or add swap space:
```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### Issue: Cannot connect to database

**Solution:** Verify environment variables and internal hostnames:
- Use service names (e.g., `website-postgres`, not `localhost`)
- Check PostgreSQL is running in Coolify

### Issue: Next.js apps show 404

**Solution:** Ensure Next.js apps are configured for standalone output:

In `next.config.ts`:
```typescript
output: 'standalone'
```

### Issue: CORS errors

**Solution:** Update API CORS configuration to allow your domains:
```typescript
// In NestJS main.ts
app.enableCors({
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
    'https://admin.yourdomain.com'
  ],
  credentials: true
});
```

---

## Cost Optimization Tips

1. **Use Coolify's built-in proxy** instead of separate nginx
2. **Enable Docker image caching** for faster rebuilds
3. **Set resource limits** for each container
4. **Use Redis for caching** to reduce database load
5. **Enable gzip compression** in Next.js apps

---

## Security Checklist

- ✅ Use strong passwords for database
- ✅ Enable SSL/HTTPS for all domains
- ✅ Keep JWT_SECRET and SESSION_SECRET secure
- ✅ Configure firewall (UFW) on VPS
- ✅ Regular security updates: `apt update && apt upgrade`
- ✅ Enable Coolify's built-in security features
- ✅ Use environment variables (never commit secrets)

---

## Useful Commands

**Restart a service:**
```bash
# In Coolify dashboard, click the service → Restart
```

**View container logs:**
```bash
docker logs -f <container-name>
```

**Access database:**
```bash
docker exec -it website-postgres psql -U postgres -d website_db
```

**Check disk space:**
```bash
df -h
```

**Clean up Docker:**
```bash
docker system prune -a
```

---

## Next Steps

1. **Set up monitoring** (optional): Integrate with Uptime Kuma or similar
2. **Configure email notifications** in Coolify for deployment status
3. **Set up staging environment** for testing before production
4. **Enable database backups** to external storage (S3, Backblaze)
5. **Configure CDN** (Cloudflare) for better performance

---

## Support Resources

- **Coolify Documentation:** https://coolify.io/docs
- **Coolify Discord:** https://discord.gg/coolify
- **Hostinger Support:** https://www.hostinger.com/support
- **Your project README:** [README.md](../README.md)

---

**Deployment complete! 🎉**

Your full-stack application is now live on Coolify!
