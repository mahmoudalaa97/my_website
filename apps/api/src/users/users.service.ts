import {
  Injectable,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Admin, AdminRole, AuditLog } from '../database/entities';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
    private emailService: EmailService,
  ) {}

  private canManageUser(currentAdmin: Admin, targetRole: AdminRole): boolean {
    if (currentAdmin.role === AdminRole.SUPER_ADMIN) {
      return true;
    }
    if (currentAdmin.role === AdminRole.ADMIN) {
      return [AdminRole.EDITOR, AdminRole.VIEWER].includes(targetRole);
    }
    return false;
  }

  async findAll(currentAdmin: Admin, role?: AdminRole) {
    const query = this.adminRepository.createQueryBuilder('admin');
    
    if (role) {
      query.where('admin.role = :role', { role });
    }

    // Non-super admins can't see super admins
    if (currentAdmin.role !== AdminRole.SUPER_ADMIN) {
      query.andWhere('admin.role != :superAdmin', {
        superAdmin: AdminRole.SUPER_ADMIN,
      });
    }

    query.orderBy('admin.createdAt', 'DESC');
    query.select([
      'admin.id',
      'admin.email',
      'admin.name',
      'admin.role',
      'admin.isActive',
      'admin.lastLoginAt',
      'admin.createdAt',
    ]);

    return query.getMany();
  }

  async findOne(id: string, currentAdmin: Admin) {
    const user = await this.adminRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'name',
        'role',
        'isActive',
        'lastLoginAt',
        'createdAt',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Non-super admins can't view super admins
    if (
      user.role === AdminRole.SUPER_ADMIN &&
      currentAdmin.role !== AdminRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException('You cannot view this user');
    }

    return user;
  }

  async create(createUserDto: CreateUserDto, currentAdmin: Admin) {
    // Check permission
    if (!this.canManageUser(currentAdmin, createUserDto.role)) {
      throw new ForbiddenException('You cannot create a user with this role');
    }

    // Check if email exists
    const existingUser = await this.adminRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const user = this.adminRepository.create({
      ...createUserDto,
      password: createUserDto.password
        ? await bcrypt.hash(createUserDto.password, 10)
        : null,
      isActive: true,
    });

    await this.adminRepository.save(user);

    // Audit log
    await this.auditLogRepository.save({
      adminId: currentAdmin.id,
      action: 'CREATE',
      entity: 'User',
      entityId: user.id,
      changes: { email: user.email, name: user.name, role: user.role },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
    };
  }

  async invite(inviteUserDto: InviteUserDto, currentAdmin: Admin) {
    // Check permission
    if (!this.canManageUser(currentAdmin, inviteUserDto.role)) {
      throw new ForbiddenException('You cannot invite a user with this role');
    }

    // Check if email exists
    const existingUser = await this.adminRepository.findOne({
      where: { email: inviteUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    // Generate invite token
    const inviteToken = crypto.randomBytes(32).toString('hex');
    const inviteExpiresAt = new Date();
    inviteExpiresAt.setHours(inviteExpiresAt.getHours() + 24); // 24 hours

    const user = this.adminRepository.create({
      ...inviteUserDto,
      inviteToken,
      inviteExpiresAt,
      isActive: false,
    });

    await this.adminRepository.save(user);

    // Send invite email
    await this.emailService.sendInviteEmail(user.email, user.name, inviteToken);

    // Audit log
    await this.auditLogRepository.save({
      adminId: currentAdmin.id,
      action: 'INVITE',
      entity: 'User',
      entityId: user.id,
      changes: { email: user.email, name: user.name, role: user.role },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      inviteToken,
    };
  }

  async acceptInvite(acceptInviteDto: AcceptInviteDto) {
    const user = await this.adminRepository.findOne({
      where: { inviteToken: acceptInviteDto.token },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired invite token');
    }

    if (!user.inviteExpiresAt || user.inviteExpiresAt < new Date()) {
      throw new BadRequestException('Invite token has expired');
    }

    user.password = await bcrypt.hash(acceptInviteDto.password, 10);
    user.inviteToken = null;
    user.inviteExpiresAt = null;
    user.isActive = true;

    await this.adminRepository.save(user);

    return {
      message: 'Account activated successfully',
      email: user.email,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto, currentAdmin: Admin) {
    const user = await this.adminRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check permission
    if (!this.canManageUser(currentAdmin, user.role)) {
      throw new ForbiddenException('You cannot update this user');
    }

    // If changing role, check permission for new role too
    if (updateUserDto.role && !this.canManageUser(currentAdmin, updateUserDto.role)) {
      throw new ForbiddenException('You cannot assign this role');
    }

    // Can't change own account to inactive
    if (id === currentAdmin.id && updateUserDto.isActive === false) {
      throw new BadRequestException('You cannot deactivate your own account');
    }

    // Check email uniqueness if changing
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.adminRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email is already in use');
      }
    }

    const oldData = { ...user };
    Object.assign(user, updateUserDto);
    await this.adminRepository.save(user);

    // Audit log
    await this.auditLogRepository.save({
      adminId: currentAdmin.id,
      action: 'UPDATE',
      entity: 'User',
      entityId: user.id,
      changes: updateUserDto,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
    };
  }

  async suspend(id: string, currentAdmin: Admin) {
    const user = await this.adminRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!this.canManageUser(currentAdmin, user.role)) {
      throw new ForbiddenException('You cannot suspend this user');
    }

    if (id === currentAdmin.id) {
      throw new BadRequestException('You cannot suspend your own account');
    }

    user.isActive = false;
    await this.adminRepository.save(user);

    await this.auditLogRepository.save({
      adminId: currentAdmin.id,
      action: 'SUSPEND',
      entity: 'User',
      entityId: user.id,
    });

    return { message: 'User suspended successfully' };
  }

  async activate(id: string, currentAdmin: Admin) {
    const user = await this.adminRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!this.canManageUser(currentAdmin, user.role)) {
      throw new ForbiddenException('You cannot activate this user');
    }

    user.isActive = true;
    await this.adminRepository.save(user);

    await this.auditLogRepository.save({
      adminId: currentAdmin.id,
      action: 'ACTIVATE',
      entity: 'User',
      entityId: user.id,
    });

    return { message: 'User activated successfully' };
  }

  async resetPassword(id: string, resetPasswordDto: ResetPasswordDto, currentAdmin: Admin) {
    const user = await this.adminRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!this.canManageUser(currentAdmin, user.role)) {
      throw new ForbiddenException('You cannot reset password for this user');
    }

    user.password = await bcrypt.hash(resetPasswordDto.newPassword, 10);
    await this.adminRepository.save(user);

    await this.auditLogRepository.save({
      adminId: currentAdmin.id,
      action: 'RESET_PASSWORD',
      entity: 'User',
      entityId: user.id,
    });

    return { message: 'Password reset successfully' };
  }

  async delete(id: string, currentAdmin: Admin) {
    const user = await this.adminRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!this.canManageUser(currentAdmin, user.role)) {
      throw new ForbiddenException('You cannot delete this user');
    }

    if (id === currentAdmin.id) {
      throw new BadRequestException('You cannot delete your own account');
    }

    await this.adminRepository.remove(user);

    await this.auditLogRepository.save({
      adminId: currentAdmin.id,
      action: 'DELETE',
      entity: 'User',
      entityId: id,
      changes: { email: user.email, name: user.name },
    });

    return { message: 'User deleted successfully' };
  }
}

