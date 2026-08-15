import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DevicesService } from './devices.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RoleEnum, DeviceStatus } from '@prisma/client';

@ApiTags('Device Management')
@Controller('devices')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get()
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Get all registered devices' })
  findAll() {
    return this.devicesService.findAll();
  }

  @Get('my-devices')
  @ApiOperation({ summary: 'Get current user registered devices' })
  getMyDevices(@CurrentUser('employeeId') employeeId: string) {
    return this.devicesService.findByEmployee(employeeId);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new device' })
  register(@CurrentUser('employeeId') employeeId: string, @Body() data: { deviceFingerprint: string; deviceName: string; os?: string; browser?: string }) {
    return this.devicesService.registerDevice(employeeId, data);
  }

  @Patch(':id/status')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Approve or block device' })
  updateStatus(@Param('id') id: string, @Body('status') status: DeviceStatus) {
    return this.devicesService.updateStatus(id, status);
  }

  @Delete(':id')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Remove device' })
  remove(@Param('id') id: string) {
    return this.devicesService.remove(id);
  }
}
