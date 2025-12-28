import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentAdmin } from '../common/decorators/current-admin.decorator';
import { Admin, AdminRole } from '../database/entities';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async findAll(
    @CurrentAdmin() admin: Admin,
    @Query('role') role?: AdminRole,
  ) {
    return {
      success: true,
      data: await this.usersService.findAll(admin, role),
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async findOne(@Param('id') id: string, @CurrentAdmin() admin: Admin) {
    return {
      success: true,
      data: await this.usersService.findOne(id, admin),
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async create(
    @Body() createUserDto: CreateUserDto,
    @CurrentAdmin() admin: Admin,
  ) {
    return {
      success: true,
      data: await this.usersService.create(createUserDto, admin),
    };
  }

  @Post('invite')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async invite(
    @Body() inviteUserDto: InviteUserDto,
    @CurrentAdmin() admin: Admin,
  ) {
    return {
      success: true,
      data: await this.usersService.invite(inviteUserDto, admin),
    };
  }

  @Post('accept-invite')
  async acceptInvite(@Body() acceptInviteDto: AcceptInviteDto) {
    return {
      success: true,
      data: await this.usersService.acceptInvite(acceptInviteDto),
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentAdmin() admin: Admin,
  ) {
    return {
      success: true,
      data: await this.usersService.update(id, updateUserDto, admin),
    };
  }

  @Put(':id/suspend')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async suspend(@Param('id') id: string, @CurrentAdmin() admin: Admin) {
    return {
      success: true,
      data: await this.usersService.suspend(id, admin),
    };
  }

  @Put(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async activate(@Param('id') id: string, @CurrentAdmin() admin: Admin) {
    return {
      success: true,
      data: await this.usersService.activate(id, admin),
    };
  }

  @Put(':id/reset-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async resetPassword(
    @Param('id') id: string,
    @Body() resetPasswordDto: ResetPasswordDto,
    @CurrentAdmin() admin: Admin,
  ) {
    return {
      success: true,
      data: await this.usersService.resetPassword(id, resetPasswordDto, admin),
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async delete(@Param('id') id: string, @CurrentAdmin() admin: Admin) {
    return {
      success: true,
      data: await this.usersService.delete(id, admin),
    };
  }
}

