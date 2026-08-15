import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CheckInOutDto } from './dto/check-in-out.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RoleEnum } from '@prisma/client';

@ApiTags('Attendance')
@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('today')
  @ApiOperation({ summary: 'Get employee attendance status for today including network & shift info' })
  getMyTodayStatus(@CurrentUser('employeeId') employeeId: string, @Req() req: any) {
    return this.attendanceService.getMyTodayStatus(employeeId, req);
  }

  @Post('check-in')
  @ApiOperation({ summary: 'Employee Check-in (Validates internal IP subnet)' })
  checkIn(@CurrentUser('employeeId') employeeId: string, @Req() req: any, @Body() body: CheckInOutDto) {
    return this.attendanceService.checkIn(employeeId, req, body);
  }

  @Post('check-out')
  @ApiOperation({ summary: 'Employee Check-out (Validates internal IP subnet)' })
  checkOut(@CurrentUser('employeeId') employeeId: string, @Req() req: any, @Body() body: CheckInOutDto) {
    return this.attendanceService.checkOut(employeeId, req, body);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get attendance history' })
  @ApiQuery({ name: 'employeeId', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'status', required: false })
  getAttendanceHistory(
    @CurrentUser() user: any,
    @Query('employeeId') employeeId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
  ) {
    // If EMPLOYEE role, restrict to own records only
    const filterEmployeeId = user.role === RoleEnum.EMPLOYEE ? user.employeeId : employeeId;
    return this.attendanceService.getAttendanceHistory(filterEmployeeId, startDate, endDate, status);
  }

  @Post('adjust/:attendanceId')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'HR Manual Attendance Adjustment' })
  createAdjustment(
    @CurrentUser('userId') userId: string,
    @Param('attendanceId') attendanceId: string,
    @Body() body: { adjustedCheckIn?: string; adjustedCheckOut?: string; reason: string },
  ) {
    return this.attendanceService.createAdjustment(userId, attendanceId, body);
  }
}
