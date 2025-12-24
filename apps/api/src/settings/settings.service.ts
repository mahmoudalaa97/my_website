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
        siteName: 'My Website',
        tagline: 'Digital Transformation Expert',
        description: 'I help businesses digitize operations and solve problems with software.',
        heroTitle: 'Transform Your Business With Technology',
        heroSubtitle: 'I help businesses digitize operations, solve problems with software, and transition from traditional to systematic approaches.',
        aboutTitle: 'About Me',
        aboutDescription: '',
        email: '',
        phone: '',
        whatsapp: '',
        location: '',
        socialLinks: {},
        stats: [
          { value: '5+', label: 'Years Experience' },
          { value: '50+', label: 'Projects Completed' },
          { value: '30+', label: 'Happy Clients' },
          { value: '99%', label: 'Satisfaction Rate' },
        ],
      });
      await this.settingsRepository.save(settings);
    }
    return settings;
  }

  async update(updateSettingsDto: UpdateSettingsDto) {
    let settings = await this.get();
    Object.assign(settings, updateSettingsDto);
    return this.settingsRepository.save(settings);
  }
}

