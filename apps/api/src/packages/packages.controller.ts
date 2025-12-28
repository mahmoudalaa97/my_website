import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminRole } from '../database/entities';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  // Public read - all users
  @Get()
  async findAll(@Query('includeInactive') includeInactive?: string) {
    const packages = await this.packagesService.findAll(includeInactive === 'true');
    return { success: true, data: packages };
  }

  // Public read - all users
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const pkg = await this.packagesService.findOne(id);
    return { success: true, data: pkg };
  }

  // Create - Editors and above
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR)
  async create(@Body() createPackageDto: CreatePackageDto) {
    const pkg = await this.packagesService.create(createPackageDto);
    return { success: true, data: pkg };
  }

  // Update - Editors and above
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR)
  async update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    const pkg = await this.packagesService.update(id, updatePackageDto);
    return { success: true, data: pkg };
  }

  // Delete - Admins only
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async remove(@Param('id') id: string) {
    await this.packagesService.remove(id);
    return { success: true, message: 'Package deleted successfully' };
  }

  // Reorder - Editors and above
  @Post('reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR)
  async reorder(@Body('ids') ids: string[]) {
    await this.packagesService.reorder(ids);
    return { success: true, message: 'Packages reordered successfully' };
  }
}

