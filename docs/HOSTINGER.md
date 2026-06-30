# Deploying to Hostinger (Cloud Startup or higher)

This monorepo deploys as **three sites on three subdomains**, all on a single Hostinger plan that supports Node.js (Cloud Startup, Cloud Professional, Business). Two Next.js apps run via Passenger; the Laravel API runs natively on PHP/MySQL.

| URL | App | Hostinger app type | Hostinger app root |
|---|---|---|---|
| `yourdomain.com` | `apps/web` | **Node.js** (entry: `server.js`) | `~/domains/yourdomain.com/public_html` |
| `admin.yourdomain.com` | `apps/admin` | **Node.js** (entry: `server.js`) | `~/domains/admin.yourdomain.com/public_html` |
| `api.yourdomain.com` | `apps/api-php` | **PHP** (web root: `public/`) | `~/domains/api.yourdomain.com/public_html` |

Replace `yourdomain.com` with your real domain everywhere below.

---

## 0. One-time hPanel setup

1. **Domain & subdomains** — hPanel → *Domains*. Add `yourdomain.com`, then create subdomains `admin` and `api`. Each gets its own `public_html` folder under `~/domains/`.
2. **MySQL database** — hPanel → *Databases* → MySQL Databases. Create a DB + user (e.g. `u123_my_website` / `u123_dbuser`). Note the credentials.
3. **SSH access** — hPanel → *Advanced* → *SSH Access*. Enable it and add your public key. Note the host, port (often `65002`), and username.
4. **SSL** — hPanel → *Security* → *SSL*. Issue Let's Encrypt for all three subdomains. Enable "Force HTTPS".
5. **Node.js apps** — hPanel → *Websites* → pick `yourdomain.com` → *Advanced* → *Node.js*:
   - Click **Create Application**
   - Node version: **20** (or latest 20.x)
   - Application mode: **Production**
   - Application root: `domains/yourdomain.com/public_html`
   - Application URL: `yourdomain.com`
   - Application startup file: `server.js`
   - Save. Repeat for `admin.yourdomain.com` (root: `domains/admin.yourdomain.com/public_html`).
6. **Environment variables** — in each Node.js app, click *Edit* → *Environment Variables* → add:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
   PORT=3000           # Passenger overrides; this is just a fallback
   ```

---

## 1. First-time setup on your laptop

Create `.env.deploy` at the repo root (gitignored — see below):

```bash
HOSTINGER_HOST=ssh.hostinger.com           # or whatever hPanel shows
HOSTINGER_USER=u123456789
HOSTINGER_PORT=65002
HOSTINGER_WEB_DIR=domains/yourdomain.com/public_html
HOSTINGER_ADMIN_DIR=domains/admin.yourdomain.com/public_html
HOSTINGER_API_DIR=domains/api.yourdomain.com/public_html
```

Make sure `.env.deploy` is listed in `.gitignore` (it is, by default — verify with `git check-ignore .env.deploy`).

Test SSH:

```bash
ssh -p $HOSTINGER_PORT $HOSTINGER_USER@$HOSTINGER_HOST 'php -v && node -v'
```

Should print PHP 8.x and Node 20.x.

---

## 2. First deploy (api side — one-time bootstrap)

The api needs `.env` populated and migrations run on the server before the first deploy. SSH in once:

```bash
ssh -p $HOSTINGER_PORT $HOSTINGER_USER@$HOSTINGER_HOST
cd ~/domains/api.yourdomain.com/public_html
# Once the build script has uploaded files (next step), you'll find
# .env.production.example here. Copy it and fill in:
cp .env.production.example .env
nano .env
# Generate APP_KEY:
php artisan key:generate --force
# (Migrations run automatically on each deploy via deploy-hostinger.sh.)
```

---

## 3. Build + deploy

From the repo root:

```bash
# Build all three apps into dist/
./scripts/build-for-hostinger.sh

# Deploy all three (or a subset)
./scripts/deploy-hostinger.sh                  # web + admin + api
./scripts/deploy-hostinger.sh web              # web only
./scripts/deploy-hostinger.sh --check          # dry run
```

The deploy script:
- `rsync -az --delete` each `dist/<app>/` to its target folder
- For Node apps: `touch tmp/restart.txt` (Passenger restart signal)
- For api: runs `php artisan migrate --force && config:cache && route:cache && view:cache` over SSH

Final sanity check:

```bash
curl -s https://api.yourdomain.com/api/health        # should print {"status":"ok",...}
curl -s -o /dev/null -w "%{http_code}\n" https://yourdomain.com         # 200
curl -s -o /dev/null -w "%{http_code}\n" https://admin.yourdomain.com   # 307 (redirects to /dashboard)
```

---

## 4. Things that bit me last time (read this)

**Sanctum cookie auth across subdomains.** The admin (on `admin.yourdomain.com`) calls the api (on `api.yourdomain.com`) and expects the auth cookie to round-trip. For that to work, three things must line up:

1. `SESSION_DOMAIN=.yourdomain.com` (note the leading dot) in the api's `.env`.
2. `SANCTUM_STATEFUL_DOMAINS=yourdomain.com,admin.yourdomain.com` (no scheme, no port).
3. `SESSION_SECURE_COOKIE=true` and `SESSION_SAME_SITE=lax` — required because all three subdomains are HTTPS.

If you see "Unauthenticated" loops on the admin after login, this is almost always the cause.

**CORS allow-list.** Already configured in [apps/api-php/config/cors.php](apps/api-php/config/cors.php) to read `WEB_URL`, `ADMIN_URL`, and `FRONTEND_URL` from `.env`. Set them in production.

**File uploads.** The admin's media library writes to `apps/api-php/storage/app/public`. Symlink it:

```bash
ssh: cd ~/domains/api.yourdomain.com/public_html && php artisan storage:link
```

The deploy script does this for you on every run, but the first one might fail before storage exists — re-run after the first migrate.

**Composer on the server.** Hostinger ships Composer, but the build script ships a pre-installed `vendor/` so the server doesn't have to run `composer install` on every deploy. If you ever need to do it remotely:

```bash
cd ~/domains/api.yourdomain.com/public_html
composer install --no-dev --optimize-autoloader --no-interaction
```

**Passenger restart.** Touch `tmp/restart.txt` (the deploy script does this). If the new code doesn't appear, check `~/logs/yourdomain.com/error.log` for boot failures.

**Static-export fallback.** If your plan only allows **one** Node.js app (some Premium plans), turn the `web` app into a static export instead. Open [apps/web/next.config.ts](apps/web/next.config.ts) and add `output: 'export'` for production. Then upload `apps/web/out/` to `public_html` directly — it serves as plain files via Apache/PHP, no Node process needed. Keep `admin` as the single Node app.

---

## 5. Subsequent deploys

```bash
git pull
./scripts/build-for-hostinger.sh
./scripts/deploy-hostinger.sh
```

That's the whole loop.

---

## 6. CI — deploy from GitHub on push (alternative to local deploys)

Three independent workflows live in `.github/workflows/`. Each watches its own paths and deploys only the app it owns:

| Workflow | Triggers when | Deploys to |
|---|---|---|
| `deploy-api.yml`   | `apps/api-php/**` changes | `${HOSTINGER_API_DIR}` |
| `deploy-admin.yml` | `apps/admin/**`, `packages/**`, `pnpm-lock.yaml` changes | `${HOSTINGER_ADMIN_DIR}` |
| `deploy-web.yml`   | `apps/web/**`, `packages/**`, `pnpm-lock.yaml` changes | `${HOSTINGER_WEB_DIR}` |

All three also support `workflow_dispatch` so you can deploy any one manually from the Actions tab or via:

```bash
gh workflow run deploy-api.yml
gh workflow run deploy-admin.yml
gh workflow run deploy-web.yml
```

### Secrets the workflows need

| Secret | Purpose |
|---|---|
| `HOSTINGER_HOST` | SSH host (e.g. `ssh.hostinger.com`) |
| `HOSTINGER_USER` | SSH user (`u123456789`) |
| `HOSTINGER_PORT` | SSH port (often `65002`) |
| `HOSTINGER_SSH_KEY` | Private key contents — use a **dedicated CI key**, not your laptop's |
| `HOSTINGER_KNOWN_HOSTS` | Pinned host key from `ssh-keyscan` (optional but recommended) |
| `HOSTINGER_API_DIR` | Remote path: `domains/api.yourdomain.com/public_html` |
| `HOSTINGER_ADMIN_DIR` | Remote path: `domains/admin.yourdomain.com/public_html` |
| `HOSTINGER_WEB_DIR` | Remote path: `domains/yourdomain.com/public_html` |
| `API_HEALTH_URL` *(optional)* | e.g. `https://api.yourdomain.com/api/health` |
| `ADMIN_HEALTH_URL` *(optional)* | e.g. `https://admin.yourdomain.com` |
| `WEB_HEALTH_URL` *(optional)* | e.g. `https://yourdomain.com` |

Plus one repository **variable** (not a secret — it ends up in the client bundle):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | e.g. `https://api.yourdomain.com/api` |

### One-shot setup

If you've already filled in `.env.deploy` (see §1), this provisions every secret + variable above:

```bash
./scripts/setup-github-secrets.sh             # interactive — confirms each value
./scripts/setup-github-secrets.sh --yes       # non-interactive (CI bootstrap)
./scripts/setup-github-secrets.sh --dry-run   # show what would happen
```

Requires `gh` CLI authenticated (`gh auth status`). The script reads SSH key contents from disk (default: `~/.ssh/id_ed25519_hostinger`) and runs `ssh-keyscan` to pin the host key.

### A few CI-specific gotchas

- **Generate a dedicated SSH key for CI**, not your personal one. Lock it down to `command="rrsync …"` in `~/.ssh/authorized_keys` on Hostinger if you want extra paranoia.
- **First api deploy still needs `.env`** filled in on the server manually (see §2). The workflow doesn't ship `.env` — it would be a bad idea to put DB creds in CI artifacts.
- **The api workflow runs `php artisan migrate --force`** on every deploy. Migrations must be backwards-compatible if web/admin are still serving old code mid-deploy.
- **Concurrency** is set to `cancel-in-progress: false` per workflow so two pushes in a row queue rather than racing.
