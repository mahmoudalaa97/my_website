import { IsString, IsEmail, IsEnum } from 'class-validator';
import { AdminRole } from '../../database/entities';

export class InviteUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(AdminRole)
  role: AdminRole;
}

