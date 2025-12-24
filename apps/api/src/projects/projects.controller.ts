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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll(@Query('includeInactive') includeInactive?: string) {
    const projects = await this.projectsService.findAll(includeInactive === 'true');
    return { success: true, data: projects };
  }

  @Get('featured')
  async findFeatured() {
    const projects = await this.projectsService.findFeatured();
    return { success: true, data: projects };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const project = await this.projectsService.findOne(id);
    return { success: true, data: project };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createProjectDto: CreateProjectDto) {
    const project = await this.projectsService.create(createProjectDto);
    return { success: true, data: project };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    const project = await this.projectsService.update(id, updateProjectDto);
    return { success: true, data: project };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    await this.projectsService.remove(id);
    return { success: true, message: 'Project deleted successfully' };
  }

  @Post('reorder')
  @UseGuards(JwtAuthGuard)
  async reorder(@Body('ids') ids: string[]) {
    await this.projectsService.reorder(ids);
    return { success: true, message: 'Projects reordered successfully' };
  }
}

