import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NetworksService } from './networks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleEnum } from '@prisma/client';

@ApiTags('Trusted Attendance Networks')
@Controller('networks')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NetworksController {
  constructor(private readonly networksService: NetworksService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of trusted company networks' })
  findAll() {
    return this.networksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get network details' })
  findOne(@Param('id') id: string) {
    return this.networksService.findOne(id);
  }

  @Post()
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Create new trusted CIDR network' })
  create(@Body() data: { name: string; cidr: string; location: string; description?: string; isActive?: boolean }) {
    return this.networksService.create(data);
  }

  @Patch(':id')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Update trusted network' })
  update(@Param('id') id: string, @Body() data: { name?: string; cidr?: string; location?: string; description?: string; isActive?: boolean }) {
    return this.networksService.update(id, data);
  }

  @Delete(':id')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Remove trusted network' })
  remove(@Param('id') id: string) {
    return this.networksService.remove(id);
  }
}
