import { IsString, IsOptional, IsObject, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SocialLinksDto {
  @IsString()
  @IsOptional()
  linkedin?: string;

  @IsString()
  @IsOptional()
  github?: string;

  @IsString()
  @IsOptional()
  twitter?: string;

  @IsString()
  @IsOptional()
  instagram?: string;

  @IsString()
  @IsOptional()
  youtube?: string;

  @IsString()
  @IsOptional()
  facebook?: string;
}

class StatDto {
  @IsString()
  value: string;

  @IsString()
  label: string;
}

export class UpdateSettingsDto {
  @IsString()
  @IsOptional()
  id?: string;

  // Basic Info
  @IsString()
  @IsOptional()
  siteName?: string;

  @IsString()
  @IsOptional()
  tagline?: string;

  @IsString()
  @IsOptional()
  description?: string;

  // Branding
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsString()
  @IsOptional()
  logoDarkUrl?: string;

  @IsString()
  @IsOptional()
  faviconUrl?: string;

  // Theme Colors
  @IsString()
  @IsOptional()
  primaryColor?: string;

  @IsString()
  @IsOptional()
  secondaryColor?: string;

  @IsString()
  @IsOptional()
  accentColor?: string;

  @IsString()
  @IsOptional()
  backgroundColor?: string;

  @IsString()
  @IsOptional()
  foregroundColor?: string;

  // Typography
  @IsString()
  @IsOptional()
  fontFamily?: string;

  @IsString()
  @IsOptional()
  fontHeading?: string;

  // SEO
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @IsString()
  @IsOptional()
  seoDescription?: string;

  @IsString()
  @IsOptional()
  seoKeywords?: string;

  @IsString()
  @IsOptional()
  ogImageUrl?: string;

  // Analytics
  @IsString()
  @IsOptional()
  googleAnalyticsId?: string;

  @IsString()
  @IsOptional()
  plausibleDomain?: string;

  // Hero Section
  @IsString()
  @IsOptional()
  heroTitle?: string;

  @IsString()
  @IsOptional()
  heroSubtitle?: string;

  @IsString()
  @IsOptional()
  heroBadge?: string;

  @IsString()
  @IsOptional()
  heroCtaPrimary?: string;

  @IsString()
  @IsOptional()
  heroCtaSecondary?: string;

  // About Section
  @IsString()
  @IsOptional()
  aboutTitle?: string;

  @IsString()
  @IsOptional()
  aboutDescription?: string;

  @IsString()
  @IsOptional()
  aboutImageUrl?: string;

  // Contact Info
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  whatsapp?: string;

  @IsString()
  @IsOptional()
  location?: string;

  // Social Links
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto;

  // Stats
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => StatDto)
  stats?: StatDto[];

  // Footer
  @IsString()
  @IsOptional()
  footerText?: string;

  @IsString()
  @IsOptional()
  copyrightText?: string;

  @IsString()
  @IsOptional()
  updatedAt?: string;
}

