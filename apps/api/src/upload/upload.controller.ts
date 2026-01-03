import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentAdmin } from '../common/decorators/current-admin.decorator';
import { AdminRole, MediaType } from '../database/entities';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  // Get all media - All authenticated users
  @Get()
  async findAll(
    @Query('folder') folder?: string,
    @Query('type') type?: MediaType,
  ) {
    const media = await this.uploadService.findAll(folder, type);
    return { success: true, data: media };
  }

  // Get folders - All authenticated users
  @Get('folders')
  async getFolders() {
    const folders = await this.uploadService.getFolders();
    return { success: true, data: folders };
  }

  // Get single media - All authenticated users
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const media = await this.uploadService.findOne(id);
    return { success: true, data: media };
  }

  // Upload single file - Editors and above
  @Post()
  @UseGuards(RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder: string = 'general',
    @CurrentAdmin() admin: { id: string },
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const result = await this.uploadService.uploadFile(file, folder, admin?.id);
    return { success: true, data: result };
  }

  // Upload multiple files - Editors and above
  @Post('multiple')
  @UseGuards(RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR)
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder: string = 'general',
    @CurrentAdmin() admin: { id: string },
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }
    const result = await this.uploadService.uploadMultiple(files, folder, admin?.id);
    return { success: true, data: result };
  }

  // Update media alt text - Editors and above
  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR)
  async update(@Param('id') id: string, @Body('altText') altText: string) {
    const media = await this.uploadService.update(id, altText);
    return { success: true, data: media };
  }

  // Delete file by ID - Admins only
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async deleteFile(@Param('id') id: string) {
    await this.uploadService.deleteFile(id);
    return { success: true, message: 'File deleted successfully' };
  }
}

