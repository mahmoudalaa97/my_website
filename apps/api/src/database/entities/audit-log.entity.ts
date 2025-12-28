import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Admin } from './admin.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'admin_id' })
  adminId: string;

  @ManyToOne(() => Admin)
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;

  @Column()
  action: string; // CREATE, UPDATE, DELETE, LOGIN, LOGOUT, etc.

  @Column()
  entity: string; // User, Service, Package, etc.

  @Column({ name: 'entity_id', nullable: true })
  entityId: string;

  @Column({ type: 'jsonb', nullable: true })
  changes: Record<string, any>;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

