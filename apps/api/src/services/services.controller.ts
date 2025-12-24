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

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async findAll(@Query('includeInactive') includeInactive?: string) {
    const services = await this.servicesService.findAll(includeInactive === 'true');
    return { success: true, data: services };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const service = await this.servicesService.findOne(id);
    return { success: true, data: service };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createServiceDto: CreateServiceDto) {
    const service = await this.servicesService.create(createServiceDto);
    return { success: true, data: service };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    const service = await this.servicesService.update(id, updateServiceDto);
    return { success: true, data: service };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    await this.servicesService.remove(id);
    return { success: true, message: 'Service deleted successfully' };
  }

  @Post('reorder')
  @UseGuards(JwtAuthGuard)
  async reorder(@Body('ids') ids: string[]) {
    await this.servicesService.reorder(ids);
    return { success: true, message: 'Services reordered successfully' };
  }
}

