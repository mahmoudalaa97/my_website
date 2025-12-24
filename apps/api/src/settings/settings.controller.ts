import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async get() {
    const settings = await this.settingsService.get();
    return { success: true, data: settings };
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async update(@Body() updateSettingsDto: UpdateSettingsDto) {
    const settings = await this.settingsService.update(updateSettingsDto);
    return { success: true, data: settings };
  }
}

