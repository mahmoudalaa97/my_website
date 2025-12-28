import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin, AdminRole } from '../database/entities';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async validateAdmin(email: string, password: string): Promise<Admin | null> {
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin) {
      return null;
    }

    if (!admin.password) {
      return null; // User hasn't set password yet (invited but not accepted)
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return null;
    }

    return admin;
  }

  async login(loginDto: LoginDto) {
    const admin = await this.validateAdmin(loginDto.email, loginDto.password);
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is active
    if (!admin.isActive) {
      throw new ForbiddenException('Your account has been suspended. Please contact an administrator.');
    }

    // Update last login
    admin.lastLoginAt = new Date();
    await this.adminRepository.save(admin);

    const payload = { email: admin.email, sub: admin.id, role: admin.role };
    return {
      accessToken: this.jwtService.sign(payload),
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  }

  async getProfile(adminId: string) {
    const admin = await this.adminRepository.findOne({ where: { id: adminId } });
    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      lastLoginAt: admin.lastLoginAt,
      createdAt: admin.createdAt,
    };
  }

  async createAdmin(email: string, password: string, name: string, role: AdminRole = AdminRole.VIEWER) {
    const existingAdmin = await this.adminRepository.findOne({ where: { email } });
    if (existingAdmin) {
      throw new Error('Admin with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = this.adminRepository.create({
      email,
      password: hashedPassword,
      name,
      role,
      isActive: true,
    });

    return this.adminRepository.save(admin);
  }
}

