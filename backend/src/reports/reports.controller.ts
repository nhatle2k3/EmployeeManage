import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Response } from 'express';

@ApiTags('Dashboard & Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get main HRMS dashboard metrics & statistics' })
  getDashboardSummary() {
    return this.reportsService.getDashboardSummary();
  }

  @Get('export')
  @ApiOperation({ summary: 'Export HRMS reports to CSV' })
  @ApiQuery({ name: 'type', enum: ['EMPLOYEE', 'ATTENDANCE', 'LEAVE', 'PAYROLL'] })
  async exportReport(@Query('type') type: 'EMPLOYEE' | 'ATTENDANCE' | 'LEAVE' | 'PAYROLL', @Res() res: Response) {
    const csvContent = await this.reportsService.generateCsvReport(type || 'EMPLOYEE');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="hrms_${type.toLowerCase()}_report.csv"`);
    return res.status(200).send(csvContent);
  }
}
