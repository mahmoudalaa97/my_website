import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('site_settings')
export class SiteSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Basic Info
  @Column({ name: 'site_name', default: 'Your Business Name' })
  siteName: string;

  @Column({ default: 'Your Tagline Here' })
  tagline: string;

  @Column({ type: 'text', default: '' })
  description: string;

  // Branding
  @Column({ name: 'logo_url', default: '' })
  logoUrl: string;

  @Column({ name: 'logo_dark_url', default: '' })
  logoDarkUrl: string;

  @Column({ name: 'favicon_url', default: '' })
  faviconUrl: string;

  // Theme Colors
  @Column({ name: 'primary_color', default: '#0ea5e9' })
  primaryColor: string;

  @Column({ name: 'secondary_color', default: '#6366f1' })
  secondaryColor: string;

  @Column({ name: 'accent_color', default: '#8b5cf6' })
  accentColor: string;

  @Column({ name: 'background_color', default: '#09090b' })
  backgroundColor: string;

  @Column({ name: 'foreground_color', default: '#fafafa' })
  foregroundColor: string;

  // Typography
  @Column({ name: 'font_family', default: 'Inter' })
  fontFamily: string;

  @Column({ name: 'font_heading', default: 'Inter' })
  fontHeading: string;

  // SEO
  @Column({ name: 'seo_title', default: '%s | Your Business' })
  seoTitle: string;

  @Column({ name: 'seo_description', type: 'text', default: '' })
  seoDescription: string;

  @Column({ name: 'seo_keywords', default: '' })
  seoKeywords: string;

  @Column({ name: 'og_image_url', default: '' })
  ogImageUrl: string;

  // Analytics
  @Column({ name: 'google_analytics_id', default: '' })
  googleAnalyticsId: string;

  @Column({ name: 'plausible_domain', default: '' })
  plausibleDomain: string;

  // Hero Section
  @Column({ name: 'hero_title', default: 'Welcome to Our Website' })
  heroTitle: string;

  @Column({ name: 'hero_subtitle', type: 'text', default: '' })
  heroSubtitle: string;

  @Column({ name: 'hero_badge', default: 'Professional Services' })
  heroBadge: string;

  @Column({ name: 'hero_cta_primary', default: 'Our Services' })
  heroCtaPrimary: string;

  @Column({ name: 'hero_cta_secondary', default: 'Contact Us' })
  heroCtaSecondary: string;

  // About Section
  @Column({ name: 'about_title', default: 'About Us' })
  aboutTitle: string;

  @Column({ name: 'about_description', type: 'text', default: '' })
  aboutDescription: string;

  @Column({ name: 'about_image_url', default: '' })
  aboutImageUrl: string;

  // Contact Info
  @Column({ default: '' })
  email: string;

  @Column({ default: '' })
  phone: string;

  @Column({ default: '' })
  whatsapp: string;

  @Column({ default: '' })
  location: string;

  // Social Links
  @Column({ name: 'social_links', type: 'jsonb', default: {} })
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    facebook?: string;
  };

  // Stats
  @Column({ type: 'jsonb', default: [] })
  stats: Array<{ value: string; label: string }>;

  // Footer
  @Column({ name: 'footer_text', default: '' })
  footerText: string;

  @Column({ name: 'copyright_text', default: '© {year} {siteName}. All rights reserved.' })
  copyrightText: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

