# Admin Dashboard User Guide

This guide explains how to use the admin dashboard to manage your website content.

## Accessing the Dashboard

1. Go to your admin URL (e.g., `https://admin.your-domain.com` or `http://localhost:3001`)
2. Login with your admin credentials
3. First-time setup: Use the credentials created during database seeding (change password immediately!)

## Dashboard Overview

After logging in, you'll see the main dashboard with:
- Quick statistics (services, packages, projects, messages)
- Quick action links
- Recent activity summary

## Navigation

The sidebar provides access to all sections:

| Section | Description |
|---------|-------------|
| Dashboard | Overview and statistics |
| Services | Manage service offerings |
| Packages | Manage pricing packages |
| Projects | Manage portfolio projects |
| Messages | View contact form submissions |
| Users | Manage admin users (Admin+ only) |
| Settings | Website settings and branding |

---

## Managing Content

### Services

Services appear in the "Services" section of your public website.

**To add a new service:**
1. Go to **Services** in the sidebar
2. Click **Add Service**
3. Fill in:
   - **Title**: Service name (e.g., "Web Development")
   - **Description**: Brief description
   - **Icon**: Choose from available icons
   - **Features**: Add bullet points
4. Click **Save**

**To edit or delete:**
- Click the **Edit** button on any service card
- Use the **Delete** button to remove (requires confirmation)
- Drag services to reorder them

### Packages (Pricing)

Packages appear in the "Pricing" section of your website.

**To add a new package:**
1. Go to **Packages**
2. Click **Add Package**
3. Fill in:
   - **Name**: Package name (e.g., "Starter")
   - **Description**: What's included
   - **Price**: Numeric value
   - **Price Note**: Optional text (e.g., "per month", "starting from")
   - **Features**: List of included features
   - **Popular**: Toggle to highlight this package
4. Click **Save**

### Projects (Portfolio)

Projects appear in the "Portfolio" section.

**To add a new project:**
1. Go to **Projects**
2. Click **Add Project**
3. Fill in:
   - **Title**: Project name
   - **Description**: Project overview
   - **Image**: Upload a screenshot or thumbnail
   - **Tags**: Technologies used (comma-separated)
   - **Live URL**: Link to live project
   - **GitHub URL**: Link to repository (optional)
   - **Featured**: Toggle to highlight on homepage
4. Click **Save**

### Messages

View and manage contact form submissions.

**Features:**
- **Unread indicator**: New messages are highlighted
- **Mark as Read**: Click to mark as read
- **Archive**: Move to archive for later reference
- **Delete**: Permanently remove

**Tip**: Set up email notifications to be alerted of new messages.

---

## Settings

The Settings page has multiple tabs for different configurations.

### General Settings

Basic website information:
- **Site Name**: Your business/brand name
- **Tagline**: Short description
- **Description**: Longer description for SEO

### Branding

Customize your website's visual identity:

**Logo & Favicon:**
- Upload your logo (light and dark versions recommended)
- Upload a favicon (browser tab icon)
- Supported formats: PNG, SVG, ICO

**Theme Colors:**
- **Primary Color**: Main brand color
- **Secondary Color**: Complementary color
- **Accent Color**: Highlight color
- **Background/Foreground**: Page colors

Click the color picker or enter a hex code directly.

### Typography

Choose fonts for your website:
- **Body Font**: Used for paragraphs and general text
- **Heading Font**: Used for titles and headings

All Google Fonts are available.

### SEO Settings

Optimize for search engines:
- **Title Template**: Use `%s` as placeholder (e.g., `%s | Your Business`)
- **Meta Description**: Default page description
- **Keywords**: Comma-separated list
- **OG Image**: Image shown when shared on social media

### Analytics

Track website visitors:
- **Google Analytics ID**: Enter your GA4 measurement ID (G-XXXXXXX)
- **Plausible Domain**: For privacy-friendly analytics

### Content

Customize page sections:

**Hero Section:**
- Badge text (small label above title)
- Main title
- Subtitle text
- CTA button labels

**About Section:**
- Section title
- Description text
- Profile image

**Footer:**
- Footer text
- Copyright text (use `{year}` and `{siteName}` as placeholders)

### Contact Information

Your contact details:
- Email address
- Phone number
- WhatsApp number
- Location

**Social Links:**
- LinkedIn, GitHub, Twitter, Instagram, YouTube, Facebook

---

## User Management

*Available to Admin and Super Admin roles only*

### Roles and Permissions

| Permission | Super Admin | Admin | Editor | Viewer |
|------------|:-----------:|:-----:|:------:|:------:|
| View Dashboard | ✓ | ✓ | ✓ | ✓ |
| Edit Content | ✓ | ✓ | ✓ | ✗ |
| Delete Content | ✓ | ✓ | ✗ | ✗ |
| Manage Settings | ✓ | ✓ | ✗ | ✗ |
| View Users | ✓ | ✓ | ✗ | ✗ |
| Create Users | ✓ | ✓* | ✗ | ✗ |
| Edit Users | ✓ | ✓* | ✗ | ✗ |
| Delete Users | ✓ | ✓* | ✗ | ✗ |

*Admins cannot manage other Admins or Super Admins*

### Inviting New Users

1. Go to **Users**
2. Click **Invite User**
3. Enter their email, name, and select a role
4. Click **Send Invitation**

The user will receive an email with a link to set their password.

### Managing Users

- **Suspend**: Temporarily disable access
- **Activate**: Re-enable a suspended user
- **Reset Password**: Generate a new password for the user
- **Delete**: Permanently remove the user

---

## Your Profile

Click your name in the sidebar to access your profile.

### Update Profile

Change your:
- Display name
- Email address

### Change Password

1. Enter your current password
2. Enter your new password (min. 8 characters)
3. Click **Save**

**Security Tips:**
- Use a strong, unique password
- Don't share your credentials
- Log out when using shared computers

---

## Best Practices

### Images

- **Logos**: Use SVG or PNG with transparent background
- **Project images**: 1200x630px recommended for best display
- **File size**: Keep under 500KB for fast loading

### Content

- Keep descriptions concise but informative
- Use active voice
- Update your portfolio regularly
- Respond to contact messages promptly

### SEO

- Write unique, descriptive titles
- Include relevant keywords naturally
- Update content regularly
- Add alt text to images

---

## Troubleshooting

### Can't log in?

1. Check caps lock is off
2. Try resetting your password
3. Contact a Super Admin to verify your account is active

### Changes not appearing on website?

1. Clear your browser cache
2. Wait a few minutes (caching)
3. Check that content is set to "Active"

### Image upload failing?

1. Check file size (max 10MB)
2. Use supported formats (PNG, JPG, GIF, WebP, SVG)
3. Try a different browser

### Need help?

Contact your administrator or refer to the [technical documentation](../README.md).

