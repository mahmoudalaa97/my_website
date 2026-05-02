# Deployment Guide

Each app deploys independently. The monorepo stays as one repo — you just point each platform at the right subdirectory.

| App | Platform | Subdir | Why |
|-----|----------|--------|-----|
| `web` (public site) | Vercel | `apps/web` | Best Next.js hosting |
| `admin` (dashboard) | Vercel | `apps/admin` | Best Next.js hosting |
| `api` (NestJS) | Railway | `apps/api` | Persistent server, DB-friendly |
| Postgres | Neon / Railway / Supabase | — | Managed Postgres |

You connect them via environment variables. No code changes needed when you redeploy one app.

---

## 1. Database (do this first)

You need a managed Postgres. Easiest options:

- **Neon** (free tier, serverless): [neon.tech](https://neon.tech) → create project → copy the connection string
- **Railway Postgres**: add inside the same Railway project as the API
- **Supabase**: [supabase.com](https://supabase.com) → new project → Settings → Database → connection string

Save the connection string — you'll paste it as `DATABASE_URL` in the API.

---

## 2. Deploy the API to Railway

The API is a stateful NestJS server. It cannot run on Vercel.

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Pick this repo
3. In **Service Settings**:
   - Root Directory: leave blank (deploy from monorepo root)
   - Railway will detect `nixpacks.toml` and `railway.toml` automatically
4. Add environment variables (Variables tab):

   ```
   NODE_ENV=production
   PORT=4000

   DATABASE_URL=postgresql://...        # from step 1
   # or set individually:
   DB_HOST=...
   DB_PORT=5432
   DB_USERNAME=...
   DB_PASSWORD=...
   DB_NAME=...

   JWT_SECRET=<generate a 32+ char random string>
   JWT_EXPIRES_IN=7d
   SESSION_SECRET=<generate another random string>

   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=<a strong password>
   ADMIN_NAME=Super Admin

   # Set these AFTER you deploy web/admin (step 3) — needed for CORS
   WEB_URL=https://your-web.vercel.app
   ADMIN_URL=https://your-admin.vercel.app
   ```

5. Generate a public domain in **Settings → Networking → Generate Domain**. You'll get something like `your-api.up.railway.app`.
6. Run migrations + seed once via Railway's shell:
   ```bash
   pnpm --filter @repo/api db:migrate
   pnpm --filter @repo/api db:seed
   ```

The API URL (e.g., `https://your-api.up.railway.app/api`) is what web/admin point to.

---

## 3. Deploy `web` to Vercel

1. Go to [vercel.com](https://vercel.com) → Add New Project → import this repo
2. **Root Directory**: `apps/web` ← important
3. Framework: Next.js (auto-detected)
4. Build/install commands: leave default — `apps/web/vercel.json` overrides them with the correct Turborepo build
5. Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-api.up.railway.app/api
   ```
6. Deploy

After it's live, copy the URL (e.g. `https://your-web.vercel.app`) and set `WEB_URL` in Railway, then redeploy the API.

---

## 4. Deploy `admin` to Vercel

Same as web, but:
- **Root Directory**: `apps/admin`
- Same `NEXT_PUBLIC_API_URL` env var
- After deploy, copy URL → set `ADMIN_URL` in Railway → redeploy API

---

## 5. Custom domains (optional)

Once everything works on the platform-provided URLs:

- In Vercel: Project Settings → Domains → add `yourdomain.com` and `admin.yourdomain.com`
- In Railway: Settings → Networking → add `api.yourdomain.com`
- Update DNS at your registrar with the records each platform shows
- After DNS propagates, update `WEB_URL`, `ADMIN_URL`, and `NEXT_PUBLIC_API_URL` to the new domains

---

## How redeploys work

- Push to `main` → all three platforms rebuild only what changed (Vercel and Railway both detect monorepo changes)
- Each app deploys independently. A broken `web` deploy does not affect `api`
- To roll back, use the platform's UI (Vercel: Deployments → Promote; Railway: Deployments → Rollback)

---

## Local development

Still use the existing setup — see [README.md](README.md). The Docker stack in [docker/](docker/) is for local dev only; production uses managed platforms.
