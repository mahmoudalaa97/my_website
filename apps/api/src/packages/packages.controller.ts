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

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get()
  async findAll(@Query('includeInactive') includeInactive?: string) {
    const packages = await this.packagesService.findAll(includeInactive === 'true');
    return { success: true, data: packages };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const pkg = await this.packagesService.findOne(id);
    return { success: true, data: pkg };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createPackageDto: CreatePackageDto) {
    const pkg = await this.packagesService.create(createPackageDto);
    return { success: true, data: pkg };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    const pkg = await this.packagesService.update(id, updatePackageDto);
    return { success: true, data: pkg };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    await this.packagesService.remove(id);
    return { success: true, message: 'Package deleted successfully' };
  }

  @Post('reorder')
  @UseGuards(JwtAuthGuard)
  async reorder(@Body('ids') ids: string[]) {
    await this.packagesService.reorder(ids);
    return { success: true, message: 'Packages reordered successfully' };
  }
}

