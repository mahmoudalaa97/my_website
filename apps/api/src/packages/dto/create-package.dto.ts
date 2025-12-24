import { IsString, IsArray, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreatePackageDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  price: string;

  @IsString()
  @IsOptional()
  priceNote?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @IsBoolean()
  @IsOptional()
  isPopular?: boolean;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

