# Deployment Guide (Hostinger)

All three apps deploy to **Hostinger** using the **[Hostinger Connector](https://www.hostinger.com/support/how-to-set-up-web-hosting-mcp-on-local-ides/)** extension in Cursor.

| URL | App | Type |
|-----|-----|------|
| `mahmoudalaa.com` | `apps/web` | Node.js (Next.js standalone) |
| `admin.mahmoudalaa.com` | `apps/admin` | Node.js (Next.js standalone) |
| `api.mahmoudalaa.com` | `apps/api-php` | PHP 8.4 (Laravel) |

---

## Setup (one-time)

1. Install **Hostinger Connector** in Cursor and sign in (hPanel → API → Cursor).
2. In hPanel, for each site:
   - **api.mahmoudalaa.com** — PHP **8.4**, document root **`public_html/public`**
   - **mahmoudalaa.com** & **admin.mahmoudalaa.com** — Node.js app, startup file **`server.js`**, Node **20**
3. Create MySQL database and copy `apps/api-php/.env.production.example` → `.env` on the server.
4. Set Node env vars in hPanel for web + admin:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://api.mahmoudalaa.com/api
   ```

---

## Deploy with Connector

Ask Cursor (with Hostinger MCP enabled) to deploy, or use the Hostinger sidebar.

| App | Connector tool | Notes |
|-----|----------------|-------|
| **web** / **admin** | `hosting_deployJsApplication` | Upload source archive; Hostinger builds on server |
| **web** / **admin** (pre-built) | `hosting_deployStaticWebsite` | Upload pre-built standalone zip if already built locally |
| **api** | `hosting_deployStaticWebsite` | Upload Laravel bundle zip to `api.mahmoudalaa.com` |

After API deploy, run once on server via SSH:

```bash
/opt/alt/php84/usr/bin/php artisan migrate --force --seed
/opt/alt/php84/usr/bin/php artisan storage:link
/opt/alt/php84/usr/bin/php artisan config:cache
```

Use Connector MCP tools to manage PHP version, databases, DNS, and deployment status.

---

## Verify

```bash
curl https://api.mahmoudalaa.com/api/health
curl -I https://mahmoudalaa.com
curl -I https://admin.mahmoudalaa.com
```

---

## Local development

See [README.md](README.md) and `./dev.sh`. Docker stack in [docker/](docker/) is for local dev only.
