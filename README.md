# Website Template with Admin Dashboard

A modern, full-stack website template with a powerful admin dashboard. Perfect for freelancers, agencies, and businesses who need a professional web presence with easy content management.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/YOUR_TEMPLATE)

## Features

### Public Website
- Modern, responsive design with dark theme
- Dynamic branding (colors, fonts, logos)
- SEO optimized with customizable meta tags
- Smooth animations and transitions
- Sections: Hero, About, Services, Portfolio, Pricing, Contact

### Admin Dashboard
- Full content management system
- User management with role-based access control
- Media library with image uploads
- Real-time settings preview
- Contact message management

### Technical Features
- **Monorepo** with Turborepo for efficient builds
- **TypeScript** throughout for type safety
- **PostgreSQL** database with TypeORM
- **Redis** caching for performance
- **JWT** and session-based authentication
- **Docker** support for easy deployment

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend (Public) | Next.js 16, Tailwind CSS, Motion |
| Frontend (Admin) | Next.js 16, Tailwind CSS, React Query |
| Backend API | NestJS, TypeORM, PostgreSQL |
| Caching | Redis |
| Infrastructure | Docker, Docker Compose |

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose (for database)

### 1. Clone and Install

```bash
git clone <repository-url>
cd <project-folder>
pnpm install
```

### 2. Start Database

```bash
docker compose -f docker/docker-compose.dev.yml up -d
```

### 3. Configure Environment

```bash
cp apps/api/.env.example apps/api/.env
# Edit .env with your settings
```

### 4. Run Migrations and Seed

```bash
pnpm db:migrate
pnpm db:seed
```

### 5. Start Development Servers

```bash
pnpm dev:apps
```

Access:
- **Website**: http://localhost:3000
- **Admin**: http://localhost:3001
- **API**: http://localhost:4000

Default admin credentials are created during database seeding. Check the seed output for credentials.

## Project Structure

```
website-template/
├── apps/
│   ├── web/              # Public website (Next.js)
│   ├── admin/            # Admin dashboard (Next.js)
│   └── api/              # Backend API (NestJS)
├── packages/
│   ├── ui/               # Shared UI components
│   ├── types/            # Shared TypeScript types
│   └── config/           # Shared configurations
├── docker/               # Docker configurations
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   ├── Dockerfile.admin
│   ├── docker-compose.dev.yml
│   └── docker-compose.prod.yml
└── docs/                 # Documentation
```

## User Roles

| Role | Permissions |
|------|-------------|
| Super Admin | Full access, manage all users and settings |
| Admin | Manage content and users (except Super Admins) |
| Editor | Edit content (services, packages, projects) |
| Viewer | Read-only dashboard access |

## Customization

### Branding

All branding can be customized from the admin dashboard:

- Logo (light/dark mode)
- Favicon
- Theme colors (primary, secondary, accent)
- Typography (Google Fonts)
- SEO settings

### Content

Manage all content from the admin:

- Hero section text and CTAs
- About section
- Services with features
- Portfolio projects
- Pricing packages
- Contact information
- Social media links

## Deployment

See the [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions on:

- Vercel (recommended for Next.js apps)
- Railway (full-stack deployment)
- VPS/Self-hosted with Docker

## Documentation

- [Installation Guide](docs/INSTALLATION.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Admin User Guide](docs/ADMIN_GUIDE.md)
- [Environment Variables](docs/ENV_VARIABLES.md)
- [API Reference](docs/API_REFERENCE.md)

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm dev:web` | Start public website only |
| `pnpm dev:admin` | Start admin dashboard only |
| `pnpm dev:api` | Start API server only |
| `pnpm build` | Build all apps |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:seed` | Seed database with initial data |

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- Documentation: [docs/](docs/)
- Issues: Create an issue in this repository
