# Environment Variables Reference

Complete reference for all environment variables used in the project.

## API Server (`apps/api/.env`)

### Database Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DB_HOST` | Yes | `localhost` | PostgreSQL host |
| `DB_PORT` | Yes | `5432` | PostgreSQL port |
| `DB_USERNAME` | Yes | `postgres` | Database username |
| `DB_PASSWORD` | Yes | `postgres` | Database password |
| `DB_NAME` | Yes | `website_db` | Database name |

### Redis Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REDIS_HOST` | No | `localhost` | Redis host |
| `REDIS_PORT` | No | `6379` | Redis port |
| `REDIS_URL` | No | - | Full Redis URL (alternative to host/port) |

### Authentication

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `JWT_SECRET` | Yes | - | Secret key for JWT tokens. Use a long, random string in production |
| `JWT_EXPIRES_IN` | No | `7d` | JWT token expiration time |
| `SESSION_SECRET` | Yes | - | Secret key for session cookies |

### Default Admin Account (for seeding)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ADMIN_EMAIL` | No | `admin@admin.com` | Default admin email for seeding |
| `ADMIN_PASSWORD` | No | `changeme123` | Default admin password for seeding |
| `ADMIN_NAME` | No | `Super Admin` | Default admin name for seeding |

### URLs

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `WEB_URL` | Yes | `http://localhost:3000` | Public website URL (for CORS) |
| `ADMIN_URL` | Yes | `http://localhost:3001` | Admin dashboard URL (for CORS) |
| `API_URL` | Yes | `http://localhost:4000` | API URL (for file URLs) |
| `FRONTEND_URL` | Yes | `http://localhost:3001` | Used for invite email links |

### Email Configuration (SMTP)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SMTP_HOST` | No | - | SMTP server host (e.g., `smtp.gmail.com`) |
| `SMTP_PORT` | No | `587` | SMTP server port |
| `SMTP_USER` | No | - | SMTP username/email |
| `SMTP_PASS` | No | - | SMTP password or app password |
| `SMTP_FROM` | No | - | Default "from" email address |

### Server Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `4000` | Server port |
| `NODE_ENV` | No | `development` | Environment: `development` or `production` |

### File Upload

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `UPLOAD_DIR` | No | `uploads` | Directory for uploaded files |
| `MAX_FILE_SIZE` | No | `10485760` | Max file size in bytes (10MB) |
| `STORAGE_PROVIDER` | No | `local` | Storage: `local`, `s3`, or `cloudinary` |

### S3 Configuration (if using S3)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `S3_BUCKET` | No | - | S3 bucket name |
| `S3_REGION` | No | - | S3 region |
| `S3_ACCESS_KEY` | No | - | AWS access key ID |
| `S3_SECRET_KEY` | No | - | AWS secret access key |

### Cloudinary Configuration (if using Cloudinary)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CLOUDINARY_CLOUD_NAME` | No | - | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | No | - | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | No | - | Cloudinary API secret |

---

## Frontend Apps

### Public Website (`apps/web`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Full API URL including `/api` (e.g., `http://localhost:4000/api`) |

### Admin Dashboard (`apps/admin`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Full API URL including `/api` (e.g., `http://localhost:4000/api`) |

---

## Example Configurations

### Development

```env
# apps/api/.env
NODE_ENV=development
PORT=4000

# Database (matches docker-compose.dev.yml)
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=root
DB_NAME=demo

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Authentication
JWT_SECRET=dev-jwt-secret-not-for-production
JWT_EXPIRES_IN=7d
SESSION_SECRET=dev-session-secret-not-for-production

# URLs
WEB_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
API_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3001

# Email (optional for dev - uses console output)
# SMTP_HOST=smtp.mailtrap.io
# SMTP_PORT=2525
# SMTP_USER=your-mailtrap-user
# SMTP_PASS=your-mailtrap-pass
# SMTP_FROM=noreply@localhost
```

### Production

```env
# apps/api/.env.production
NODE_ENV=production
PORT=4000

# Database
DB_HOST=your-db-host.com
DB_PORT=5432
DB_USERNAME=website_user
DB_PASSWORD=super-secure-password-here
DB_NAME=website_production

# Redis
REDIS_HOST=your-redis-host.com
REDIS_PORT=6379

# Authentication (generate secure random strings)
JWT_SECRET=your-32-char-or-longer-random-string-here
JWT_EXPIRES_IN=1d
SESSION_SECRET=another-32-char-or-longer-random-string

# URLs
WEB_URL=https://www.your-domain.com
ADMIN_URL=https://admin.your-domain.com
API_URL=https://api.your-domain.com
FRONTEND_URL=https://admin.your-domain.com

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM=noreply@your-domain.com
```

### Docker Production

When using Docker Compose, many variables reference container names:

```env
DB_HOST=postgres      # Docker service name
REDIS_HOST=redis      # Docker service name
```

---

## Security Notes

1. **Never commit `.env` files** to version control
2. **Use strong secrets** in production (32+ characters)
3. **Rotate secrets** periodically
4. **Use environment-specific files** (`.env.development`, `.env.production`)
5. **Validate all environment variables** on application startup

### Generating Secure Secrets

```bash
# Generate a random 32-character string
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

