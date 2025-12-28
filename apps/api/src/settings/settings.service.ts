import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSettings } from '../database/entities';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SiteSettings)
    private settingsRepository: Repository<SiteSettings>,
  ) {}

  async get() {
    let settings = await this.settingsRepository.findOne({ where: {} });
    if (!settings) {
      // Create default settings if none exist
      settings = this.settingsRepository.create({
        // Basic Info
        siteName: 'Your Business Name',
        tagline: 'Your Tagline Here',
        description: 'Describe your business and services here.',
        
        // Branding
        logoUrl: '',
        logoDarkUrl: '',
        faviconUrl: '',
        
        // Theme Colors
        primaryColor: '#0ea5e9',
        secondaryColor: '#6366f1',
        accentColor: '#8b5cf6',
        backgroundColor: '#09090b',
        foregroundColor: '#fafafa',
        
        // Typography
        fontFamily: 'Inter',
        fontHeading: 'Inter',
        
        // SEO
        seoTitle: '%s | Your Business',
        seoDescription: 'Professional services and solutions for your business.',
        seoKeywords: '',
        ogImageUrl: '',
        
        // Analytics
        googleAnalyticsId: '',
        plausibleDomain: '',
        
        // Hero Section
        heroTitle: 'Welcome to Our Website',
        heroSubtitle: 'We help businesses achieve their goals through professional services and solutions.',
        heroBadge: 'Professional Services',
        heroCtaPrimary: 'Our Services',
        heroCtaSecondary: 'Contact Us',
        
        // About Section
        aboutTitle: 'About Us',
        aboutDescription: '',
        aboutImageUrl: '',
        
        // Contact Info
        email: '',
        phone: '',
        whatsapp: '',
        location: '',
        
        // Social Links
        socialLinks: {},
        
        // Stats
        stats: [
          { value: '10+', label: 'Years Experience' },
          { value: '100+', label: 'Projects Completed' },
          { value: '50+', label: 'Happy Clients' },
          { value: '100%', label: 'Satisfaction Rate' },
        ],
        
        // Footer
        footerText: '',
        copyrightText: '© {year} {siteName}. All rights reserved.',
      });
      await this.settingsRepository.save(settings);
    }
    return settings;
  }

  async update(updateSettingsDto: UpdateSettingsDto) {
    let settings = await this.get();
    Object.assign(settings, updateSettingsDto);
    console.log(settings);
    
    return this.settingsRepository.save(settings);
  }

  // Get branding-specific settings for the public website
  async getBranding() {
    const settings = await this.get();
    return {
      siteName: settings.siteName,
      logoUrl: settings.logoUrl,
      logoDarkUrl: settings.logoDarkUrl,
      faviconUrl: settings.faviconUrl,
      primaryColor: settings.primaryColor,
      secondaryColor: settings.secondaryColor,
      accentColor: settings.accentColor,
      backgroundColor: settings.backgroundColor,
      foregroundColor: settings.foregroundColor,
      fontFamily: settings.fontFamily,
      fontHeading: settings.fontHeading,
      seoTitle: settings.seoTitle,
      seoDescription: settings.seoDescription,
      seoKeywords: settings.seoKeywords,
      ogImageUrl: settings.ogImageUrl,
      googleAnalyticsId: settings.googleAnalyticsId,
      plausibleDomain: settings.plausibleDomain,
    };
  }
}

