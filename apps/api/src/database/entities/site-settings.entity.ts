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

  @Column({ name: 'site_name', default: 'My Website' })
  siteName: string;

  @Column({ default: 'Digital Transformation Expert' })
  tagline: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ name: 'hero_title', default: 'Transform Your Business With Technology' })
  heroTitle: string;

  @Column({ name: 'hero_subtitle', type: 'text', default: '' })
  heroSubtitle: string;

  @Column({ name: 'about_title', default: 'About Me' })
  aboutTitle: string;

  @Column({ name: 'about_description', type: 'text', default: '' })
  aboutDescription: string;

  @Column({ default: '' })
  email: string;

  @Column({ default: '' })
  phone: string;

  @Column({ default: '' })
  whatsapp: string;

  @Column({ default: '' })
  location: string;

  @Column({ name: 'social_links', type: 'jsonb', default: {} })
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
  };

  @Column({ type: 'jsonb', default: [] })
  stats: Array<{ value: string; label: string }>;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

