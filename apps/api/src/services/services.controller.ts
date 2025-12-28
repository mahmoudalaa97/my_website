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
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminRole } from '../database/entities';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // Public read - all users (including non-authenticated for public website)
  @Get()
  async findAll(@Query('includeInactive') includeInactive?: string) {
    const services = await this.servicesService.findAll(includeInactive === 'true');
    return { success: true, data: services };
  }

  // Public read - all users
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const service = await this.servicesService.findOne(id);
    return { success: true, data: service };
  }

  // Create - Editors and above
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR)
  async create(@Body() createServiceDto: CreateServiceDto) {
    const service = await this.servicesService.create(createServiceDto);
    return { success: true, data: service };
  }

  // Update - Editors and above
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR)
  async update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    const service = await this.servicesService.update(id, updateServiceDto);
    return { success: true, data: service };
  }

  // Delete - Admins only
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async remove(@Param('id') id: string) {
    await this.servicesService.remove(id);
    return { success: true, message: 'Service deleted successfully' };
  }

  // Reorder - Editors and above
  @Post('reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR)
  async reorder(@Body('ids') ids: string[]) {
    await this.servicesService.reorder(ids);
    return { success: true, message: 'Services reordered successfully' };
  }
}

