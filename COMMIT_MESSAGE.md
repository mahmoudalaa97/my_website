feat: Add comprehensive admin features, RBAC, and white-labeling

This commit introduces a complete admin dashboard system with user management,
role-based access control, comprehensive settings management, and white-labeling
capabilities. It also includes bug fixes and documentation improvements.

## Major Features Added

### User Management & RBAC
- Implement role-based access control (RBAC) with 4 roles:
  - Super Admin: Full access, manages all users and settings
  - Admin: Manages content and users (except Super Admins)
  - Editor: Can only edit content (services, packages, projects)
  - Viewer: Read-only dashboard access
- Add user management endpoints (CRUD operations)
- Implement user invitation system with email notifications
- Add password reset functionality for admins
- Create user suspension/activation features
- Add audit logging for administrative actions

### Admin Profile Management
- Add profile page for admins to view/edit their information
- Implement password change functionality
- Track last login timestamps

### Comprehensive Settings & Branding
- Expand settings to include full branding customization:
  - Logo uploads (light/dark variants)
  - Custom color themes (primary, secondary, accent, background, foreground)
  - Typography settings (font family, heading font)
  - SEO configuration (title, description, keywords, OG image)
  - Analytics integration (Google Analytics, Plausible)
  - Hero section customization
  - About section content
  - Contact information
  - Social media links
  - Statistics display
  - Footer customization
- Add settings preview functionality
- Implement tabbed settings interface for better organization

### Media Management
- Add image upload functionality with local storage
- Create media library with file metadata tracking
- Support for multiple file uploads
- File deletion with proper cleanup

### Email System
- Implement email service using Nodemailer
- Support for SMTP configuration (Gmail, SendGrid)
- Email templates for user invitations

## Bug Fixes

### Frontend
- Fix hero section animation variants structure
  - Refactor to use centralized `transitionVariants` object
  - Remove duplicate inline variant definitions
  - Fix TypeScript type errors with `as const` assertion
- Fix settings update to filter out `id` and `updatedAt` fields
  - Prevent validation errors when updating settings
  - Only send valid update fields to API

### Backend
- Update validation pipe to handle extra fields gracefully
- Fix admin entity to support nullable password for invitations
- Update seed script to use configurable admin credentials via env vars

## White-Labeling

- Remove all personal branding from template
- Replace hardcoded values with generic placeholders:
  - "Your Business Name" instead of specific names
  - "your-domain.com" instead of example domains
  - Generic email placeholders
- Update default settings to be template-friendly
- Make admin credentials configurable via environment variables

## Documentation

- Completely rewrite README.md with comprehensive feature list
- Add detailed installation guide (docs/INSTALLATION.md)
- Add deployment guides for Vercel, Railway, and VPS (docs/DEPLOYMENT.md)
- Add admin user guide for non-technical users (docs/ADMIN_GUIDE.md)
- Add environment variables documentation (docs/ENV_VARIABLES.md)
- Update all code examples to use generic placeholders

## Infrastructure

- Add Docker Compose configuration for production
- Add Nginx reverse proxy configuration
- Create database migrations system
- Add health check endpoints
- Update environment variable examples

## Code Quality

- Add TypeScript types for all new features
- Implement proper error handling with toast notifications
- Add permission hooks for frontend RBAC
- Improve code organization with proper module structure
- Add comprehensive DTOs with validation

## Files Changed

- 24 files modified
- 20+ new files added (controllers, services, DTOs, pages, hooks)
- 1,314 insertions, 510 deletions

This update transforms the project from a basic portfolio template into a
production-ready, white-labeled website template with a powerful admin dashboard
suitable for both template sales and done-for-you services.

