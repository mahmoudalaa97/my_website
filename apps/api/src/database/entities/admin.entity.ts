import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: AdminRole,
    default: AdminRole.VIEWER,
  })
  role: AdminRole;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', name: 'invite_token', nullable: true })
  inviteToken: string | null;

  @Column({ type: 'timestamp', name: 'invite_expires_at', nullable: true })
  inviteExpiresAt: Date | null;

  @Column({ type: 'timestamp', name: 'last_login_at', nullable: true })
  lastLoginAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

