import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Media, MediaType, StorageProvider } from '../database/entities';

export interface UploadedFile {
  id: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
}

@Injectable()
export class UploadService {
  private uploadDir: string;
  private baseUrl: string;

  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    private configService: ConfigService,
  ) {
    this.uploadDir = join(process.cwd(), 'uploads');
    this.baseUrl = this.configService.get('API_URL', 'http://localhost:4000');
    
    // Ensure upload directory exists
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'general',
    adminId?: string,
  ): Promise<UploadedFile> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed`,
      );
    }

    // Create folder if it doesn't exist
    const folderPath = join(this.uploadDir, folder);
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, { recursive: true });
    }

    // Generate unique filename
    const ext = file.originalname.split('.').pop();
    const filename = `${uuidv4()}.${ext}`;
    const filePath = join(folderPath, filename);

    // Write file to disk
    writeFileSync(filePath, file.buffer);

    // Determine media type
    const type = file.mimetype.startsWith('image/')
      ? MediaType.IMAGE
      : MediaType.DOCUMENT;

    const url = `${this.baseUrl}/uploads/${folder}/${filename}`;

    // Save to database
    const media = this.mediaRepository.create({
      filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url,
      type,
      provider: StorageProvider.LOCAL,
      folder,
      uploadedBy: adminId,
    });

    const savedMedia = await this.mediaRepository.save(media);

    return {
      id: savedMedia.id,
      filename: savedMedia.filename,
      originalname: savedMedia.originalName,
      mimetype: savedMedia.mimeType,
      size: savedMedia.size,
      url: savedMedia.url,
    };
  }

  async uploadMultiple(
    files: Express.Multer.File[],
    folder: string = 'general',
    adminId?: string,
  ): Promise<UploadedFile[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    return Promise.all(
      files.map((file) => this.uploadFile(file, folder, adminId)),
    );
  }

  async findAll(folder?: string, type?: MediaType) {
    const queryBuilder = this.mediaRepository
      .createQueryBuilder('media')
      .orderBy('media.createdAt', 'DESC');

    if (folder) {
      queryBuilder.andWhere('media.folder = :folder', { folder });
    }

    if (type) {
      queryBuilder.andWhere('media.type = :type', { type });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string) {
    const media = await this.mediaRepository.findOne({ where: { id } });
    if (!media) {
      throw new NotFoundException('Media not found');
    }
    return media;
  }

  async update(id: string, altText: string) {
    const media = await this.findOne(id);
    media.altText = altText;
    return this.mediaRepository.save(media);
  }

  async deleteFile(id: string): Promise<void> {
    const media = await this.findOne(id);
    const filePath = join(this.uploadDir, media.folder || '', media.filename);
    
    try {
      await unlink(filePath);
    } catch (error) {
      console.warn(`Could not delete file: ${media.filename}`);
    }

    await this.mediaRepository.remove(media);
  }

  async deleteByFilename(filename: string): Promise<void> {
    const media = await this.mediaRepository.findOne({ where: { filename } });
    if (media) {
      await this.deleteFile(media.id);
    } else {
      // Just try to delete the physical file
      const filePath = join(this.uploadDir, filename);
      try {
        await unlink(filePath);
      } catch (error) {
        console.warn(`Could not delete file: ${filename}`);
      }
    }
  }

  async getFolders(): Promise<string[]> {
    const result = await this.mediaRepository
      .createQueryBuilder('media')
      .select('DISTINCT media.folder', 'folder')
      .where('media.folder IS NOT NULL')
      .getRawMany();

    return result.map((r) => r.folder).filter(Boolean);
  }

  // Extract filename from URL
  getFilenameFromUrl(url: string): string | null {
    if (!url) return null;
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
}

