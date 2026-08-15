import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PositionsService } from './positions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleEnum } from '@prisma/client';

@ApiTags('Positions')
@Controller('positions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all positions' })
  findAll() {
    return this.positionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get position by ID' })
  findOne(@Param('id') id: string) {
    return this.positionsService.findOne(id);
  }

  @Post()
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Create position' })
  create(@Body() data: { code: string; title: string; description?: string; baseSalaryMin?: number; baseSalaryMax?: number; departmentId?: string }) {
    return this.positionsService.create(data);
  }

  @Patch(':id')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Update position' })
  update(@Param('id') id: string, @Body() data: { title?: string; description?: string; baseSalaryMin?: number; baseSalaryMax?: number; departmentId?: string }) {
    return this.positionsService.update(id, data);
  }

  @Delete(':id')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Delete position' })
  remove(@Param('id') id: string) {
    return this.positionsService.remove(id);
  }
}
