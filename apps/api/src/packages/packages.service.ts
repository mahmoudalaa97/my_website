import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Package } from '../database/entities';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private packageRepository: Repository<Package>,
  ) {}

  async findAll(includeInactive = false) {
    const where = includeInactive ? {} : { isActive: true };
    return this.packageRepository.find({
      where,
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const pkg = await this.packageRepository.findOne({ where: { id } });
    if (!pkg) {
      throw new NotFoundException('Package not found');
    }
    return pkg;
  }

  async create(createPackageDto: CreatePackageDto) {
    const pkg = this.packageRepository.create(createPackageDto);
    return this.packageRepository.save(pkg);
  }

  async update(id: string, updatePackageDto: UpdatePackageDto) {
    const pkg = await this.findOne(id);
    Object.assign(pkg, updatePackageDto);
    return this.packageRepository.save(pkg);
  }

  async remove(id: string) {
    const pkg = await this.findOne(id);
    await this.packageRepository.remove(pkg);
    return { success: true };
  }

  async reorder(ids: string[]) {
    const updates = ids.map((id, index) =>
      this.packageRepository.update(id, { sortOrder: index }),
    );
    await Promise.all(updates);
    return { success: true };
  }
}

