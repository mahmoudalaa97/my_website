# Deploy Monorepo Separately with Dokploy

This guide explains how to deploy each app in your monorepo (Frontend, Admin, API) as separate applications using Dokploy.

## Project Structure

Your monorepo has three deployable applications:
- **Frontend (Web)**: `apps/web` - Public website
- **Admin**: `apps/admin` - Admin dashboard
- **API**: `apps/api` - NestJS backend

Each will be deployed as a separate Dokploy application with its own configuration.

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│           Your VPS (Dokploy)                │
├─────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐        │
│  │  Frontend    │  │   Admin      │        │
│  │  Port: 3001  │  │   Port: 3002 │        │
│  └──────────────┘  └──────────────┘        │
│  ┌──────────────┐                          │
│  │     API      │                          │
│  │   Port: 3003 │                          │
│  └──────────────┘                          │
└─────────────────────────────────────────────┘
    ↑ GitHub Webhooks (Auto-deploy)
```

## Prerequisites

1. Dokploy installed on VPS
2. GitHub repository with all three apps
3. Sufficient VPS resources (2GB+ RAM recommended)
4. Domains for each app (optional, can use subdomains)

## Step 1: Create nixpacks.toml for Web App

Create `/apps/web/nixpacks.toml`:

```toml
[phases.setup]
nixPkgs = ["nodejs_20", "pnpm"]

[phases.install]
cmds = ["npm install -g corepack@0.24.1 && corepack enable", "pnpm install --filter=@repo/web"]

[phases.build]
cmds = ["pnpm run build --filter=@repo/web"]

[phases.start]
cmd = "pnpm start --filter=@repo/web"
```

## Step 2: Create nixpacks.toml for API App

Create `/apps/api/nixpacks.toml`:

```toml
[phases.setup]
nixPkgs = ["nodejs_20", "pnpm"]

[phases.install]
cmds = ["npm install -g corepack@0.24.1 && corepack enable", "pnpm install --filter=@repo/api"]

[phases.build]
cmds = ["pnpm run build --filter=@repo/api"]

[phases.start]
cmd = "pnpm start --filter=@repo/api"
```

## Step 3: Configure Admin App nixpacks.toml

Your `/apps/admin/nixpacks.toml` already exists. Update it to:

```toml
[phases.setup]
nixPkgs = ["nodejs_20", "pnpm"]

[phases.install]
cmds = ["npm install -g corepack@0.24.1 && corepack enable", "pnpm install --filter=@repo/admin"]

[phases.build]
cmds = ["pnpm run build --filter=@repo/admin"]

[phases.start]
cmd = "pnpm start --filter=@repo/admin"
```

## Step 4: Deploy Frontend App in Dokploy

### In Dokploy Dashboard:

1. **Create New Application**
   - Click "New Application"
   - Name: `Frontend`
   - Source: GitHub
   - Repository: `mahmoudalaa97/my_website`
   - Branch: `new_website_nextjs`

2. **Configure Build**
   - Build Directory: `apps/web`
   - Auto-detect will use `apps/web/nixpacks.toml`

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://api.your-domain.com
   TURBO_TELEMETRY_DISABLED=1
   ```

4. **Configure Domain & Port**
   - Port: `3001`
   - Domain: `your-domain.com` or `web.your-domain.com`
   - Enable SSL

5. **Deploy**
   - Click Deploy button
   - Monitor logs

## Step 5: Deploy Admin App in Dokploy

### In Dokploy Dashboard:

1. **Create New Application**
   - Click "New Application"
   - Name: `Admin`
   - Source: GitHub
   - Repository: `mahmoudalaa97/my_website`
   - Branch: `new_website_nextjs`

2. **Configure Build**
   - Build Directory: `apps/admin`
   - Auto-detect will use `apps/admin/nixpacks.toml`

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://api.your-domain.com
   TURBO_TELEMETRY_DISABLED=1
   ```

4. **Configure Domain & Port**
   - Port: `3002`
   - Domain: `admin.your-domain.com`
   - Enable SSL

5. **Deploy**
   - Click Deploy button
   - Monitor logs

## Step 6: Deploy API App in Dokploy

### In Dokploy Dashboard:

1. **Create New Application**
   - Click "New Application"
   - Name: `API`
   - Source: GitHub
   - Repository: `mahmoudalaa97/my_website`
   - Branch: `new_website_nextjs`

2. **Configure Build**
   - Build Directory: `apps/api`
   - Auto-detect will use `apps/api/nixpacks.toml`

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=3003
   DATABASE_URL=postgresql://user:password@localhost:5432/my_website
   JWT_SECRET=your-secret-key
   TURBO_TELEMETRY_DISABLED=1
   ```

4. **Configure Port**
   - Port: `3003`
   - Domain: `api.your-domain.com`
   - Enable SSL

5. **Add Database Service (if needed)**
   - In Dokploy, create PostgreSQL service
   - Connect to API app

6. **Deploy**
   - Click Deploy button
   - Monitor logs

## Step 7: Configure Webhooks for Each App

For each application in Dokploy:

1. Go to Application → Deployment
2. Copy the Webhook URL
3. In GitHub:
   - Settings → Webhooks → Add webhook
   - Paste webhook URL
   - Content type: `application/json`
   - Events: Push events
   - Active: ✓

Now each app deploys independently when you push changes!

## Step 8: Set Up Reverse Proxy (Nginx)

To route traffic to different apps, create Nginx configuration:

```nginx
# /etc/nginx/sites-available/my-website

upstream frontend {
    server localhost:3001;
}

upstream admin {
    server localhost:3002;
}

upstream api {
    server localhost:3003;
}

server {
    listen 80;
    server_name your-domain.com *.your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 443 ssl http2;
    server_name admin.your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    location / {
        proxy_pass http://admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 443 ssl http2;
    server_name api.your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    location / {
        proxy_pass http://api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the config:
```bash
sudo ln -s /etc/nginx/sites-available/my-website /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 9: Verify Deployments

### Check if apps are running
```bash
curl http://localhost:3001    # Frontend
curl http://localhost:3002    # Admin
curl http://localhost:3003    # API
```

### Monitor in Dokploy
- Dashboard → Each Application → Logs
- Check for any errors
- Verify environment variables loaded correctly

## Step 10: Set Up Database (if using PostgreSQL)

In Dokploy:

1. Go to Services → New Service → PostgreSQL
2. Configure:
   - Name: `my-website-db`
   - Database: `my_website`
   - Username: `postgres`
   - Password: Generate strong password

3. Connect to API app:
   - Add environment variable: `DATABASE_URL=postgresql://...`

4. Run migrations:
   - SSH to container: `docker exec -it <container> sh`
   - Run: `pnpm run migrate --filter=@repo/api`

## Deployment Workflow

### Making Updates

1. **Make changes locally**
   ```bash
   git checkout new_website_nextjs
   # Make your changes
   git add .
   git commit -m "feat: update"
   ```

2. **Push to GitHub**
   ```bash
   git push origin new_website_nextjs
   ```

3. **Automatic Deployment**
   - GitHub sends webhook to Dokploy
   - Each affected app redeploys automatically
   - Monitor in Dokploy dashboard

### Manual Redeployment

If webhook fails:
1. Go to Dokploy Dashboard
2. Select Application
3. Click Redeploy button

## Troubleshooting

### App fails to deploy
- Check Logs tab for errors
- Verify nixpacks.toml syntax
- Ensure correct Build Directory set

### Port conflicts
- Change port in nixpacks.toml start command
- Or use different port numbers (3001, 3002, 3003)

### Environment variables not loading
- Check "Environment" tab in Dokploy
- Redeploy after adding/changing variables

### Webhook not triggering
- Check webhook URL is correct
- Verify GitHub webhook delivery in Settings
- Check Dokploy application logs

### Database connection errors
- Verify DATABASE_URL format
- Check database service is running
- Test connection: `psql $DATABASE_URL`

## Scaling Considerations

- **Monorepo**: All apps installed together
- **Shared node_modules**: Reduces disk space
- **Turbo caching**: Speeds up rebuilds
- **Filter flag**: Only installs needed dependencies

## Security Best Practices

1. Use strong database passwords
2. Store secrets in Dokploy environment variables
3. Enable SSL for all domains
4. Use firewall rules to restrict ports
5. Regular backups of database and files
6. Monitor logs for suspicious activity

## Performance Tips

1. **Cache builds**: Dokploy caches layers automatically
2. **Use filters**: `--filter=@repo/app` speeds up installs
3. **Monitor resources**: Watch CPU/memory in dashboard
4. **Optimize images**: Compress static assets
5. **CDN**: Use CDN for static content

## Next Steps

1. Create nixpacks.toml files for web and api apps
2. Create three separate applications in Dokploy
3. Configure webhooks for each
4. Make a test commit to verify auto-deploy
5. Monitor logs and verify all apps running

---

**Architecture**: Monorepo with 3 separate Dokploy deployments
**Status**: Ready for production
**Last Updated**: January 21, 2026
