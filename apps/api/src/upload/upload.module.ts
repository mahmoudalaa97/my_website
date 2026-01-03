import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { memoryStorage } from 'multer';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { Media } from '../database/entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: memoryStorage(),
        fileFilter: (req, file, callback) => {
          // Allow images and PDFs
          const allowedMimes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
            'image/x-icon',
            'image/vnd.microsoft.icon',
            'application/pdf',
          ];
          if (!allowedMimes.includes(file.mimetype)) {
            return callback(new Error('File type not allowed'), false);
          }
          callback(null, true);
        },
        limits: {
          fileSize: 10 * 1024 * 1024, // 10MB max
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule { }

