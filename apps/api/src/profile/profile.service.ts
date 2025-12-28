import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from '../database/entities';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async getProfile(adminId: string) {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
      select: ['id', 'email', 'name', 'role', 'lastLoginAt', 'createdAt'],
    });

    return admin;
  }

  async updateProfile(adminId: string, updateProfileDto: UpdateProfileDto) {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
    });

    if (!admin) {
      throw new BadRequestException('Admin not found');
    }

    // Check if email is being changed and if it's already taken
    if (updateProfileDto.email && updateProfileDto.email !== admin.email) {
      const existingAdmin = await this.adminRepository.findOne({
        where: { email: updateProfileDto.email },
      });

      if (existingAdmin) {
        throw new ConflictException('Email is already in use');
      }
    }

    Object.assign(admin, updateProfileDto);
    await this.adminRepository.save(admin);

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };
  }

  async changePassword(adminId: string, changePasswordDto: ChangePasswordDto) {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
    });

    if (!admin) {
      throw new BadRequestException('Admin not found');
    }

    if (!admin.password) {
      throw new BadRequestException('Password not set. Please use the invite link to set your password.');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    admin.password = hashedPassword;

    await this.adminRepository.save(admin);

    return { message: 'Password changed successfully' };
  }
}

