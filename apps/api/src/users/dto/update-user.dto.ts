import { IsString, IsEmail, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { AdminRole } from '../../database/entities';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(AdminRole)
  @IsOptional()
  role?: AdminRole;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

