import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Admin } from './admin.entity';

export enum MediaType {
  IMAGE = 'image',
  DOCUMENT = 'document',
  VIDEO = 'video',
}

export enum StorageProvider {
  LOCAL = 'local',
  S3 = 's3',
  CLOUDINARY = 'cloudinary',
}

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column({ name: 'original_name' })
  originalName: string;

  @Column({ name: 'mime_type' })
  mimeType: string;

  @Column({ type: 'int' })
  size: number;

  @Column()
  url: string;

  @Column({ name: 'thumbnail_url', nullable: true })
  thumbnailUrl: string;

  @Column({
    type: 'enum',
    enum: MediaType,
    default: MediaType.IMAGE,
  })
  type: MediaType;

  @Column({
    type: 'enum',
    enum: StorageProvider,
    default: StorageProvider.LOCAL,
  })
  provider: StorageProvider;

  @Column({ nullable: true })
  folder: string;

  @Column({ name: 'alt_text', nullable: true })
  altText: string;

  @Column({ name: 'uploaded_by', nullable: true })
  uploadedBy: string;

  @ManyToOne(() => Admin, { nullable: true })
  @JoinColumn({ name: 'uploaded_by' })
  admin: Admin;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

