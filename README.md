# Website Monorepo

A Turborepo monorepo containing a freelancer portfolio website with an admin dashboard and NestJS backend.

## Project Structure

```
my_website/
├── apps/
│   ├── web/              # Public website (Next.js)
│   ├── admin/            # Admin dashboard (Next.js)
│   └── api/              # Backend API (NestJS)
├── packages/
│   ├── types/            # Shared TypeScript types
│   ├── ui/               # Shared UI components
│   └── config/           # Shared configs
├── docker-compose.yml    # PostgreSQL & Redis
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

## Prerequisites

- Node.js 18+
- pnpm 9+
- Docker & Docker Compose (for database)

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Database Services

```bash
docker-compose up -d
```

This starts PostgreSQL (port 5432) and Redis (port 6379).

### 3. Configure Environment

Copy the example environment file for the API:

```bash
cp apps/api/env.example.txt apps/api/.env
```

### 4. Seed the Database

```bash
cd apps/api
pnpm db:seed
```

This creates:
- Default admin user: `admin@example.com` / `admin123`
- Default site settings
- Sample services, packages, and projects

### 5. Start Development Servers

From the root directory:

```bash
# Start all apps
pnpm dev

# Or start individually
pnpm dev:web    # Public website on http://localhost:3000
pnpm dev:admin  # Admin dashboard on http://localhost:3001
pnpm dev:api    # API server on http://localhost:4000
```

## Apps

### Public Website (apps/web)

The freelancer portfolio website featuring:
- Hero section with stats
- About section
- Services showcase
- Portfolio/Projects gallery
- Pricing packages
- Contact form

Runs on: `http://localhost:3000`

### Admin Dashboard (apps/admin)

Content management system for:
- Site settings (name, tagline, social links, etc.)
- Services management (CRUD)
- Pricing packages management (CRUD)
- Portfolio projects management (CRUD)
- Contact form messages inbox

Runs on: `http://localhost:3001`

Default login: `admin@example.com` / `admin123`

### API Backend (apps/api)

NestJS backend providing:
- Authentication (JWT + Sessions)
- CRUD endpoints for all resources
- PostgreSQL database with TypeORM
- Redis support (for caching/sessions)

Runs on: `http://localhost:4000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Admin login |
| POST | /api/auth/logout | Admin logout |
| GET | /api/auth/me | Get current admin |
| GET | /api/auth/session | Check session |
| GET/PUT | /api/settings | Site settings |
| CRUD | /api/services | Services |
| CRUD | /api/packages | Pricing packages |
| CRUD | /api/projects | Portfolio projects |
| GET/POST | /api/messages | Contact messages |

## Environment Variables

### API (.env)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=website_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
SESSION_SECRET=your-session-secret
WEB_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
PORT=4000
NODE_ENV=development
```

### Web/Admin

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Scripts

```bash
# Development
pnpm dev          # Start all apps
pnpm dev:web      # Start web only
pnpm dev:admin    # Start admin only
pnpm dev:api      # Start API only

# Build
pnpm build        # Build all apps

# Database
pnpm db:migrate   # Run migrations
pnpm db:seed      # Seed database

# Lint
pnpm lint         # Lint all apps
```

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS v4, Motion
- **Backend**: NestJS, TypeORM, PostgreSQL, Redis
- **Monorepo**: Turborepo, pnpm workspaces
- **Auth**: JWT + Sessions
- **UI**: shadcn/ui components

## License

MIT
