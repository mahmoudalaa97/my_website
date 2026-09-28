# Deployment Guide (Railway)

All three apps deploy to **one Railway project** from this GitHub repo. Hostinger stays the registrar and email host; `amack-*` sites stay on Hostinger.

| URL | App | Railway service | Builder |
|-----|-----|-----------------|---------|
| `mahmoudalaa.com` | `apps/web` | `web` | [`docker/Dockerfile.web`](docker/Dockerfile.web) |
| `admin.mahmoudalaa.com` | `apps/admin` | `admin` | [`docker/Dockerfile.admin`](docker/Dockerfile.admin) |
| `api.mahmoudalaa.com` | `apps/api-php` | `api` | [`docker/Dockerfile.api-php`](docker/Dockerfile.api-php) |

MySQL is a Railway plugin. Uploads persist on a volume mounted at `/app/storage/app/public`.

Project: [railway.com/project/6fec5a66-14db-4628-ac4a-181b97a5412b](https://railway.com/project/6fec5a66-14db-4628-ac4a-181b97a5412b)

Preview URLs (live now):

- Web: https://web-production-fbe06.up.railway.app
- Admin: https://admin-production-d5b6.up.railway.app
- API: https://api-production-fdb25.up.railway.app

Config-as-code files (set each service's **Config File** path in Railway):

- [`docker/railway.web.json`](docker/railway.web.json)
- [`docker/railway.admin.json`](docker/railway.admin.json)
- [`docker/railway.api.json`](docker/railway.api.json)

---

## One-time project setup

Requires the [Railway CLI](https://docs.railway.com/guides/cli) (`railway login`).

1. Create a project named `mahmoudalaa` and connect this GitHub repository (`main`).
2. Add a **MySQL** plugin.
3. Add three GitHub services from the same repo. For each service:
   - Root directory: repo root (`.`)
   - Config file: the matching `docker/railway.*.json`
   - Builder: Dockerfile (from the config file)
4. Attach a volume to **api** with mount path `/app/storage/app/public`.
5. Set environment variables (below). Copy `APP_KEY` from the Hostinger `.env` — do not regenerate it after importing data.
6. Add custom domains on each service. Railway will show a CNAME target and a `_railway-verify` TXT record (same pattern as `www.n8n` on this zone).

Service variable references use Railway's `${{ServiceName.VAR}}` syntax. Rename the MySQL service to `MySQL` or update the names to match.

### api

Use [`apps/api-php/.env.railway.example`](apps/api-php/.env.railway.example) as the checklist. Required:

```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.mahmoudalaa.com
APP_KEY=<copy from Hostinger>
DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
WEB_URL=https://mahmoudalaa.com
ADMIN_URL=https://admin.mahmoudalaa.com
FRONTEND_URL=https://mahmoudalaa.com
SANCTUM_STATEFUL_DOMAINS=mahmoudalaa.com,admin.mahmoudalaa.com
SESSION_DOMAIN=.mahmoudalaa.com
SESSION_SECURE_COOKIE=true
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
FILESYSTEM_DISK=local
```

Also copy `ADMIN_*` and `MAIL_*` from Hostinger if you still send mail through Hostinger SMTP.

The API container runs `storage:link`, `migrate --force`, `db:seed --force`, and `config:cache` on boot. Seeding is idempotent (`firstOrCreate` / empty-table guards) so existing data is not duplicated.

### web + admin

These must exist at **build** time (`NEXT_PUBLIC_*` is inlined):

```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.mahmoudalaa.com/api
```

---

## Data migration (Hostinger → Railway)

Do this after the API is healthy on a Railway URL and **before** flipping public DNS. Keep Hostinger as rollback.

Hostinger source: database `u661321560_MyWebsite` on `srv1583.hstgr.io:3306` (assigned to `api.mahmoudalaa.com`).

```bash
# 1. Dump Hostinger (needs the DB password from the Hostinger .env)
mysqldump -h srv1583.hstgr.io -P 3306 -u u661321560_MyWebsite -p \
  --single-transaction --routines --triggers \
  u661321560_MyWebsite > hostinger-mywebsite.sql

# 2. Import into Railway MySQL
railway connect MySQL < hostinger-mywebsite.sql
```

Copy uploaded files from Hostinger `api.mahmoudalaa.com` (`public_html/storage` after `storage:link`, which is `storage/app/public`) onto the Railway volume. Restart the api service after the import.

---

## DNS cutover (Hostinger zone only)

Leave MX, SPF, DKIM, and `amack-*` unchanged.

Verify TXT records are already on the Hostinger zone. Do **not** flip traffic until the MySQL dump is imported.

| Record | New value |
|--------|-----------|
| `@` ALIAS | `e2dbffmh.up.railway.app` |
| `www` CNAME | `sxvnen5k.up.railway.app` |
| `admin` CNAME (remove A/AAAA) | `4mwbyze5.up.railway.app` |
| `api` CNAME (remove A) | `p00ees0m.up.railway.app` |

`@` and `www` already use a 300s TTL. Lower `admin` / `api` to 300 before the flip if you can.

---

## Verify

```bash
curl https://api.mahmoudalaa.com/api/health
curl -I https://mahmoudalaa.com
curl -I https://admin.mahmoudalaa.com
```

In the browser: homepage, admin login, an uploaded image, contact form.

Keep the Hostinger Node/PHP sites running for about 48 hours. After that, disable only those three sites. Do not cancel the Hostinger plan while email and `amack-*` still live there.

---

## Local development

See [README.md](README.md) and `./dev.sh`. The Docker stack in [docker/](docker/) is for local API/MySQL only (`docker compose -f docker/docker-compose.php.yml up`).
