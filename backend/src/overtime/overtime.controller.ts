import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OvertimeService } from './overtime.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RoleEnum, StatusWorkflow } from '@prisma/client';

@ApiTags('Overtime Management')
@Controller('overtime')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OvertimeController {
  constructor(private readonly overtimeService: OvertimeService) {}

  @Post('requests')
  @ApiOperation({ summary: 'Submit overtime request' })
  submitRequest(
    @CurrentUser('employeeId') employeeId: string,
    @Body() data: { date: string; startTime: string; endTime: string; hours: number; reason: string },
  ) {
    return this.overtimeService.submitRequest(employeeId, data);
  }

  @Get()
  @ApiOperation({ summary: 'List overtime records' })
  @ApiQuery({ name: 'employeeId', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(
    @CurrentUser() user: any,
    @Query('employeeId') employeeId?: string,
    @Query('status') status?: StatusWorkflow,
  ) {
    const filterEmployeeId = user.role === RoleEnum.EMPLOYEE ? user.employeeId : employeeId;
    return this.overtimeService.findAll(filterEmployeeId, status);
  }

  @Patch(':id/process')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN, RoleEnum.MANAGER)
  @ApiOperation({ summary: 'Approve or Reject overtime request' })
  processRequest(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body('action') action: 'APPROVE' | 'REJECT',
  ) {
    return this.overtimeService.processRequest(userId, id, action);
  }
}
