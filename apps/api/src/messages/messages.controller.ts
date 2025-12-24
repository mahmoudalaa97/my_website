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

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // Public endpoint for contact form
  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    const message = await this.messagesService.create(createMessageDto);
    return { success: true, message: 'Message sent successfully', data: { id: message.id } };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query('includeArchived') includeArchived?: string) {
    const messages = await this.messagesService.findAll(includeArchived === 'true');
    return { success: true, data: messages };
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats() {
    const stats = await this.messagesService.getStats();
    return { success: true, data: stats };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const message = await this.messagesService.findOne(id);
    return { success: true, data: message };
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  async markAsRead(@Param('id') id: string) {
    const message = await this.messagesService.markAsRead(id);
    return { success: true, data: message };
  }

  @Patch(':id/archive')
  @UseGuards(JwtAuthGuard)
  async archive(@Param('id') id: string) {
    const message = await this.messagesService.archive(id);
    return { success: true, data: message };
  }

  @Patch(':id/unarchive')
  @UseGuards(JwtAuthGuard)
  async unarchive(@Param('id') id: string) {
    const message = await this.messagesService.unarchive(id);
    return { success: true, data: message };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    await this.messagesService.remove(id);
    return { success: true, message: 'Message deleted successfully' };
  }
}

