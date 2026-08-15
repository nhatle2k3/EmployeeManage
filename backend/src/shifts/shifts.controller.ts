import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ShiftsService } from './shifts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RoleEnum } from '@prisma/client';

@ApiTags('Work Shifts & Schedules')
@Controller('shifts')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all work shifts' })
  findAllShifts() {
    return this.shiftsService.findAllShifts();
  }

  @Get('my-shift')
  @ApiOperation({ summary: 'Get current employee active shift' })
  getMyShift(@CurrentUser('employeeId') employeeId: string) {
    return this.shiftsService.getEmployeeCurrentShift(employeeId);
  }

  @Post()
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Create new shift configuration' })
  createShift(@Body() data: any) {
    return this.shiftsService.createShift(data);
  }

  @Patch(':id')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Update shift' })
  updateShift(@Param('id') id: string, @Body() data: any) {
    return this.shiftsService.updateShift(id, data);
  }

  @Delete(':id')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Delete shift' })
  deleteShift(@Param('id') id: string) {
    return this.shiftsService.deleteShift(id);
  }

  @Post('assign')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN, RoleEnum.MANAGER)
  @ApiOperation({ summary: 'Assign shift to employee' })
  assignShift(@Body() body: { employeeId: string; shiftId: string; startDate: Date; endDate?: Date }) {
    return this.shiftsService.assignShift(body.employeeId, body.shiftId, body.startDate, body.endDate);
  }
}
