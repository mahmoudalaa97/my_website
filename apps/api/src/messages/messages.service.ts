import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage } from '../database/entities';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(ContactMessage)
    private messageRepository: Repository<ContactMessage>,
  ) {}

  async findAll(includeArchived = false) {
    const where = includeArchived ? {} : { isArchived: false };
    return this.messageRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const message = await this.messageRepository.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }

  async create(createMessageDto: CreateMessageDto) {
    const message = this.messageRepository.create(createMessageDto);
    return this.messageRepository.save(message);
  }

  async markAsRead(id: string) {
    const message = await this.findOne(id);
    message.isRead = true;
    return this.messageRepository.save(message);
  }

  async archive(id: string) {
    const message = await this.findOne(id);
    message.isArchived = true;
    return this.messageRepository.save(message);
  }

  async unarchive(id: string) {
    const message = await this.findOne(id);
    message.isArchived = false;
    return this.messageRepository.save(message);
  }

  async remove(id: string) {
    const message = await this.findOne(id);
    await this.messageRepository.remove(message);
    return { success: true };
  }

  async getStats() {
    const total = await this.messageRepository.count();
    const unread = await this.messageRepository.count({ where: { isRead: false } });
    const archived = await this.messageRepository.count({ where: { isArchived: true } });
    return { total, unread, archived };
  }
}

