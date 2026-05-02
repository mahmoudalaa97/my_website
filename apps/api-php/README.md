# PHP / MySQL Backend (Laravel 13)

Drop-in replacement for the NestJS API at `apps/api`. Same endpoints, same response shapes — but PHP + MySQL so it can run on cheap shared hosting that doesn't allow Node.js.

| Item | Value |
|------|-------|
| Framework | Laravel 13 |
| PHP | 8.4+ required (8.3 won't work) |
| Database | MySQL 8.4 (or MariaDB 10.6+) |
| Auth | Laravel Sanctum (bearer tokens) |
| API prefix | `/api` |
| Default port | 8000 |

## Quick start (Docker — recommended)

From the repo root:

```bash
docker compose -f docker/docker-compose.php.yml up -d --build
```

Starts MySQL on `localhost:3307` and the Laravel API on `localhost:8000`. On first boot it auto-runs:
- `composer install`
- `php artisan key:generate`
- `php artisan migrate --seed`
- `php artisan storage:link`
- `php artisan serve`

After ~30 seconds:
- Health: http://localhost:8000/api/health
- Default login: `admin@admin.com` / `Admin123!`

```bash
# Smoke test
curl http://localhost:8000/api/health
curl http://localhost:8000/api/services
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@admin.com","password":"Admin123!"}'
```

## Quick start (native, no Docker)

Requires PHP 8.4+, Composer, and a running MySQL.

```bash
cd apps/api-php
composer install
# Edit .env: DB_HOST=127.0.0.1 DB_PORT=3306 (or 3307 if using Docker MySQL)
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve --port=8000
```

## Endpoint mapping (NestJS → Laravel)

All endpoints preserved 1:1. Same paths, same JSON response shape `{success, data}`.

| Module | Routes | Auth |
|--------|--------|------|
| Health | `GET /api/health`, `/health/live`, `/health/ready` | public |
| Auth | `POST /api/auth/login`, `POST /auth/logout`, `GET /auth/me`, `GET /auth/session` | mixed |
| Settings | `GET /api/settings`, `GET /settings/branding`, `PUT /settings` | read public, write admin+ |
| Services | `GET/POST/PUT/DELETE /api/services[/:id]`, `POST /services/reorder` | read public, write editor+ |
| Packages | same shape | read public, write editor+ |
| Projects | + `GET /api/projects/featured` | read public, write editor+ |
| Messages | `POST` public, reads/state changes admin-only | mixed |
| Profile | `GET/PUT /api/profile`, `PUT /profile/password` | authenticated |
| Users | full CRUD + `invite`, `accept-invite`, `suspend`, `activate`, `reset-password` | admin+ |
| Upload | full CRUD, `multiple`, `folders` | editor+ write, admin+ delete |

Roles in order of decreasing power: `super_admin`, `admin`, `editor`, `viewer`.

## Auth — how it differs from the NestJS version

The NestJS version used **JWT in httpOnly cookies + server-side sessions**. This PHP version uses **Sanctum bearer tokens**.

Login response shape (matches the original):
```json
{
  "success": true,
  "data": {
    "admin": { "id": "...", "email": "...", "role": "super_admin" },
    "accessToken": "1|abcd1234..."
  }
}
```

The token is also set as an `accessToken` cookie for backward compatibility. Authenticated requests should send `Authorization: Bearer <token>`.

## What is NOT fully ported (stubs in code)

These work but use placeholder logic — wire them up when needed:

- **Email invitations** (`UsersController::invite`): creates the token but does not send the email. Token is returned in the JSON response. To send mail, configure `MAIL_*` in `.env` and uncomment the `Mail::to(...)` line.
- **Image thumbnail generation** (`UploadController::saveFile`): saves files to `storage/app/public/<folder>/` without generating thumbnails. To add, install `intervention/image`.
- **Audit logging**: the `audit_logs` table exists, but no controllers write to it yet. Add `AuditLog::create([...])` where needed.
- **Cloud storage providers**: only `local` is implemented. For S3/Cloudinary, configure Laravel's filesystem.

## Deployment to shared hosting (Hostinger, etc.)

This is why we ported to PHP — most shared hosts run PHP/MySQL but not Node.js.

1. Confirm your host offers **PHP 8.4+** and **MySQL 8.0+** (or MariaDB 10.6+)
2. Upload `apps/api-php/` content to the host
3. Make `public/` the document root (most hosts allow setting this)
4. Create a MySQL database and user via the host's control panel
5. Edit `.env` with the host's DB credentials, set `APP_DEBUG=false`, generate `APP_KEY`
6. Via SSH or terminal in cPanel:
   ```bash
   composer install --no-dev --optimize-autoloader
   php artisan key:generate
   php artisan migrate --force --seed
   php artisan storage:link
   php artisan config:cache
   ```
7. If the host doesn't allow CLI:
   - Upload prebuilt `vendor/` from your machine
   - Generate `APP_KEY` locally and paste into `.env`
   - Run migrations once via a temporary protected route, then remove

## Deployment to VPS (Hetzner, etc.)

The same `docker/docker-compose.php.yml` works on any VPS. Just override env vars with production values (strong passwords, `APP_DEBUG=false`, real domains in `WEB_URL` / `ADMIN_URL` for CORS).

## File layout

```
apps/api-php/
├── app/
│   ├── Http/
│   │   ├── Controllers/    # 10 controllers, one per module
│   │   └── Middleware/     # EnsureRole.php for RBAC
│   └── Models/             # 8 Eloquent models
├── config/auth.php         # Admin model as auth user
├── database/
│   ├── migrations/         # 8 schema migrations + Sanctum + Laravel internals
│   └── seeders/            # DatabaseSeeder.php
├── routes/api.php          # All routes wired with role middleware
├── bootstrap/app.php       # Kernel config + 'role' middleware alias
└── .env                    # Local config
```

## Switch the frontend to use this API

In `apps/web/.env.local` and `apps/admin/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Restart the Next.js apps. Same API contract → no other changes.

## Useful commands

```bash
# Inside the container
docker exec my_website_api_php_dev php artisan migrate
docker exec my_website_api_php_dev php artisan migrate:fresh --seed   # WARNING: drops everything
docker exec -it my_website_api_php_dev php artisan tinker
docker exec my_website_api_php_dev php artisan route:list
docker exec my_website_api_php_dev php artisan config:clear
```
