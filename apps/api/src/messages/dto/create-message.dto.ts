import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  projectType?: string;

  @IsString()
  message: string;
}

