import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DepartmentsService } from './departments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleEnum } from '@prisma/client';

@ApiTags('Departments & Organization')
@Controller('departments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) { }

  @Get()
  @ApiOperation({ summary: 'Get list of departments' })
  findAll() {
    return this.departmentsService.findAll();
  }

  @Get('org-chart')
  @ApiOperation({ summary: 'Get organization chart tree' })
  getOrgChart() {
    return this.departmentsService.getOrgChart();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get department by ID' })
  findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(id);
  }

  @Post()
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Create department' })
  create(@Body() data: { code: string; name: string; description?: string; parentId?: string; managerId?: string }) {
    return this.departmentsService.create(data);
  }

  @Patch(':id')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Update department' })
  update(@Param('id') id: string, @Body() data: { name?: string; description?: string; parentId?: string; managerId?: string }) {
    return this.departmentsService.update(id, data);
  }

  @Delete(':id')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Delete department' })
  remove(@Param('id') id: string) {
    return this.departmentsService.remove(id);
  }
}
