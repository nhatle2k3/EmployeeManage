import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PayrollService } from './payroll.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RoleEnum, StatusWorkflow } from '@prisma/client';

@ApiTags('Payroll System')
@Controller('payroll')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get('tax-config')
  @ApiOperation({ summary: 'Get tax configuration brackets' })
  getTaxConfigs() {
    return this.payrollService.getTaxConfigs();
  }

  @Get('insurance-config')
  @ApiOperation({ summary: 'Get insurance configuration rates' })
  getInsuranceConfigs() {
    return this.payrollService.getInsuranceConfigs();
  }

  @Patch('tax-config/:id')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Update tax bracket configuration' })
  updateTaxConfig(@Param('id') id: string, @Body() data: any) {
    return this.payrollService.updateTaxConfig(id, data);
  }

  @Patch('insurance-config/:id')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Update insurance rate configuration' })
  updateInsuranceConfig(@Param('id') id: string, @Body() data: any) {
    return this.payrollService.updateInsuranceConfig(id, data);
  }

  @Get('structure/:employeeId')
  @ApiOperation({ summary: 'Get employee salary structure' })
  getSalaryStructure(@Param('employeeId') employeeId: string) {
    return this.payrollService.getSalaryStructure(employeeId);
  }

  @Post('structure/:employeeId')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Upsert employee salary structure' })
  upsertSalaryStructure(
    @Param('employeeId') employeeId: string,
    @Body() data: { baseSalary: number; components?: any[] },
  ) {
    return this.payrollService.upsertSalaryStructure(employeeId, data);
  }

  @Get('periods')
  @ApiOperation({ summary: 'List payroll periods' })
  getPayrollPeriods() {
    return this.payrollService.getPayrollPeriods();
  }

  @Post('periods')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Create new payroll period' })
  createPayrollPeriod(@Body() data: { name: string; startDate: string; endDate: string; totalWorkingDays?: number }) {
    return this.payrollService.createPayrollPeriod(data);
  }

  @Post('periods/:id/calculate')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Calculate payroll for all active employees for given period' })
  calculatePeriodPayroll(@Param('id') periodId: string) {
    return this.payrollService.calculatePeriodPayroll(periodId);
  }

  @Patch('periods/:id/status')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Update payroll period status (REVIEW -> APPROVED -> PAID)' })
  updatePeriodStatus(@Param('id') periodId: string, @Body('status') status: StatusWorkflow) {
    return this.payrollService.updatePeriodStatus(periodId, status);
  }

  @Get('records')
  @ApiOperation({ summary: 'Get payroll records' })
  @ApiQuery({ name: 'periodId', required: false })
  @ApiQuery({ name: 'employeeId', required: false })
  getPayrolls(
    @CurrentUser() user: any,
    @Query('periodId') periodId?: string,
    @Query('employeeId') employeeId?: string,
  ) {
    const filterEmp = user.role === RoleEnum.EMPLOYEE ? user.employeeId : employeeId;
    return this.payrollService.getPayrolls(periodId, filterEmp);
  }

  @Get('payslip/:id')
  @ApiOperation({ summary: 'Get detailed employee payslip' })
  getPayslip(@Param('id') id: string) {
    return this.payrollService.getPayslip(id);
  }
}
