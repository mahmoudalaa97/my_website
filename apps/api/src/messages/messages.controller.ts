import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminRole } from '../database/entities';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // Public endpoint for contact form - no auth required
  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    const message = await this.messagesService.create(createMessageDto);
    return { success: true, message: 'Message sent successfully', data: { id: message.id } };
  }

  // Read - All authenticated users
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query('includeArchived') includeArchived?: string) {
    const messages = await this.messagesService.findAll(includeArchived === 'true');
    return { success: true, data: messages };
  }

  // Read - All authenticated users
  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats() {
    const stats = await this.messagesService.getStats();
    return { success: true, data: stats };
  }

  // Read - All authenticated users
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const message = await this.messagesService.findOne(id);
    return { success: true, data: message };
  }

  // Mark as read - Admins only
  @Patch(':id/read')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async markAsRead(@Param('id') id: string) {
    const message = await this.messagesService.markAsRead(id);
    return { success: true, data: message };
  }

  // Archive - Admins only
  @Patch(':id/archive')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async archive(@Param('id') id: string) {
    const message = await this.messagesService.archive(id);
    return { success: true, data: message };
  }

  // Unarchive - Admins only
  @Patch(':id/unarchive')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async unarchive(@Param('id') id: string) {
    const message = await this.messagesService.unarchive(id);
    return { success: true, data: message };
  }

  // Delete - Admins only
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async remove(@Param('id') id: string) {
    await this.messagesService.remove(id);
    return { success: true, message: 'Message deleted successfully' };
  }
}

