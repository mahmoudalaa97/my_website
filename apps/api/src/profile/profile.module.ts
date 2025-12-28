import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../database/entities';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}

