import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentAdmin } from '../common/decorators/current-admin.decorator';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@CurrentAdmin() admin: any) {
    return {
      success: true,
      data: await this.profileService.getProfile(admin.id),
    };
  }

  @Put()
  async updateProfile(
    @CurrentAdmin() admin: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return {
      success: true,
      data: await this.profileService.updateProfile(admin.id, updateProfileDto),
    };
  }

  @Put('password')
  async changePassword(
    @CurrentAdmin() admin: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return {
      success: true,
      data: await this.profileService.changePassword(
        admin.id,
        changePasswordDto,
      ),
    };
  }
}

