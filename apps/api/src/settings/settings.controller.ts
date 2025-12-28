import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminRole } from '../database/entities';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // Public read - all users (for public website)
  @Get()
  async get() {
    const settings = await this.settingsService.get();
    return { success: true, data: settings };
  }

  // Public read - branding only (for public website head/meta)
  @Get('branding')
  async getBranding() {
    const branding = await this.settingsService.getBranding();
    return { success: true, data: branding };
  }

  // Update - Admins only
  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async update(@Body() updateSettingsDto: UpdateSettingsDto) {
    const settings = await this.settingsService.update(updateSettingsDto);
    return { success: true, data: settings };
  }
}

