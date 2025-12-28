import { IsString, IsEmail, IsEnum, MinLength, IsOptional } from 'class-validator';
import { AdminRole } from '../../database/entities';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @IsEnum(AdminRole)
  role: AdminRole;
}

