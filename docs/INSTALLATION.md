# Installation Guide

This guide walks you through setting up the website template for local development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 20+** - [Download](https://nodejs.org/)
- **pnpm 9+** - Install with `npm install -g pnpm`
- **Docker & Docker Compose** - [Download](https://docs.docker.com/get-docker/)
- **Git** - [Download](https://git-scm.com/)

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install dependencies for all workspaces (web, admin, api, and packages).

### 3. Start Database Services

The project uses PostgreSQL for the database and Redis for caching. Start them with Docker:

```bash
docker compose -f docker/docker-compose.dev.yml up -d
```

This starts:
- **PostgreSQL** on port 5433
- **Redis** on port 6379

To verify services are running:

```bash
docker compose -f docker/docker-compose.dev.yml ps
```

### 4. Configure Environment Variables

Create the API environment file:

```bash
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env` with your settings:

```env
# Database
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=root
DB_NAME=demo

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d

# Session
SESSION_SECRET=your-session-secret-change-this

# URLs
WEB_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
API_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3001

# Email (optional - for user invitations)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourwebsite.com
```

### 5. Run Database Migrations

```bash
pnpm db:migrate
```

This creates all the necessary database tables.

### 6. Seed Initial Data

```bash
pnpm db:seed
```

This creates:
- Default super admin user (credentials shown in seed output)
- Default site settings
- Sample services, packages, and projects

### 7. Start Development Servers

Start all applications:

```bash
pnpm dev:apps
```

Or start individual apps:

```bash
# Terminal 1 - API
pnpm dev:api

# Terminal 2 - Public Website
pnpm dev:web

# Terminal 3 - Admin Dashboard
pnpm dev:admin
```

### 8. Access the Applications

- **Public Website**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001
- **API**: http://localhost:4000/api

Login to the admin dashboard with credentials shown in the seed output.
Default credentials (if not configured via env vars):
- Email: `admin@admin.com`
- Password: `changeme123`

**Important**: Change the admin password immediately after first login!

## Troubleshooting

### Database Connection Issues

If you can't connect to the database:

1. Ensure Docker containers are running:
   ```bash
   docker compose -f docker/docker-compose.dev.yml ps
   ```

2. Check database logs:
   ```bash
   docker compose -f docker/docker-compose.dev.yml logs postgres
   ```

3. Verify your `.env` settings match the Docker Compose configuration.

### Port Conflicts

If ports are already in use:

1. For PostgreSQL, change `DB_PORT` in both `.env` and `docker-compose.dev.yml`
2. For the API, set `PORT=4001` in `.env`
3. For web/admin, modify the `dev` script in their `package.json`

### Module Not Found Errors

Run a clean install:

```bash
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
pnpm install
```

### TypeScript Errors

Rebuild TypeScript references:

```bash
pnpm build
```

## Next Steps

- [Configure your branding](ADMIN_GUIDE.md#branding)
- [Deploy to production](DEPLOYMENT.md)
- [Customize the theme](CUSTOMIZATION.md)

## Optional: Database Admin UI

To access a database management UI, start with the admin profile:

```bash
docker compose -f docker/docker-compose.dev.yml --profile with-adminer up -d
```

Access Adminer at http://localhost:8080

- System: PostgreSQL
- Server: postgres
- Username: postgres
- Password: root
- Database: demo

