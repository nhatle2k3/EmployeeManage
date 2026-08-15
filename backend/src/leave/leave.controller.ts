import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LeaveService } from './leave.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RoleEnum, StatusWorkflow } from '@prisma/client';

@ApiTags('Leave Management')
@Controller('leave')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get('types')
  @ApiOperation({ summary: 'Get all configured leave types' })
  getLeaveTypes() {
    return this.leaveService.getLeaveTypes();
  }

  @Post('types')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Create leave type' })
  createLeaveType(@Body() data: any) {
    return this.leaveService.createLeaveType(data);
  }

  @Get('my-balances')
  @ApiOperation({ summary: 'Get leave balances for current employee' })
  getMyBalances(@CurrentUser('employeeId') employeeId: string, @Query('year') year?: number) {
    return this.leaveService.getMyBalances(employeeId, year ? Number(year) : undefined);
  }

  @Post('requests')
  @ApiOperation({ summary: 'Submit leave request' })
  submitRequest(
    @CurrentUser('employeeId') employeeId: string,
    @Body() data: { leaveTypeId: string; startDate: string; endDate: string; reason: string },
  ) {
    return this.leaveService.submitLeaveRequest(employeeId, data);
  }

  @Get('requests')
  @ApiOperation({ summary: 'List leave requests' })
  @ApiQuery({ name: 'employeeId', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAllRequests(
    @CurrentUser() user: any,
    @Query('employeeId') employeeId?: string,
    @Query('status') status?: StatusWorkflow,
  ) {
    const filterEmployeeId = user.role === RoleEnum.EMPLOYEE ? user.employeeId : employeeId;
    return this.leaveService.findAllRequests(filterEmployeeId, status);
  }

  @Patch('requests/:id/process')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN, RoleEnum.MANAGER)
  @ApiOperation({ summary: 'Approve or Reject leave request' })
  processRequest(
    @CurrentUser('userId') userId: string,
    @Param('id') requestId: string,
    @Body() body: { action: 'APPROVE' | 'REJECT'; comment?: string },
  ) {
    return this.leaveService.processRequest(userId, requestId, body.action, body.comment);
  }
}
