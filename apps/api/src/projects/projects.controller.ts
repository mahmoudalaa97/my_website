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
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminRole } from '../database/entities';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // Public read - all users
  @Get()
  async findAll(@Query('includeInactive') includeInactive?: string) {
    const projects = await this.projectsService.findAll(includeInactive === 'true');
    return { success: true, data: projects };
  }

  // Public read - all users
  @Get('featured')
  async findFeatured() {
    const projects = await this.projectsService.findFeatured();
    return { success: true, data: projects };
  }

  // Public read - all users
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const project = await this.projectsService.findOne(id);
    return { success: true, data: project };
  }

  // Create - Editors and above
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR)
  async create(@Body() createProjectDto: CreateProjectDto) {
    const project = await this.projectsService.create(createProjectDto);
    return { success: true, data: project };
  }

  // Update - Editors and above
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR)
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    const project = await this.projectsService.update(id, updateProjectDto);
    return { success: true, data: project };
  }

  // Delete - Admins only
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
  async remove(@Param('id') id: string) {
    await this.projectsService.remove(id);
    return { success: true, message: 'Project deleted successfully' };
  }

  // Reorder - Editors and above
  @Post('reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR)
  async reorder(@Body('ids') ids: string[]) {
    await this.projectsService.reorder(ids);
    return { success: true, message: 'Projects reordered successfully' };
  }
}

