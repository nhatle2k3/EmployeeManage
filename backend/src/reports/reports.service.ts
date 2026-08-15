import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardSummary() {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayDate = new Date(todayStr);

    const [
      totalEmployees,
      activeEmployees,
      departmentsCount,
      employeesByDept,
      todayAttendance,
      pendingLeaves,
      pendingOvertime,
      latestPayrollPeriod,
    ] = await Promise.all([
      this.prisma.employee.count(),
      this.prisma.employee.count({ where: { status: 'ACTIVE' } }),
      this.prisma.department.count(),
      this.prisma.department.findMany({
        select: {
          id: true,
          name: true,
          _count: { select: { employees: true } },
        },
      }),
      this.prisma.attendanceRecord.findMany({
        where: { date: todayDate },
        include: {
          employee: {
            select: { id: true, firstName: true, lastName: true, employeeCode: true, department: true },
          },
        },
      }),
      this.prisma.leaveRequest.count({ where: { status: 'PENDING' } }),
      this.prisma.overtimeRecord.count({ where: { status: 'PENDING' } }),
      this.prisma.payrollPeriod.findFirst({
        orderBy: { createdAt: 'desc' },
        include: { payrolls: true },
      }),
    ]);

    const presentCount = todayAttendance.filter((a) => a.status === 'PRESENT').length;
    const lateCount = todayAttendance.filter((a) => a.status === 'LATE').length;
    const earlyLeaveCount = todayAttendance.filter((a) => a.status === 'EARLY_LEAVE' || a.status === 'LATE_AND_EARLY_LEAVE').length;
    const onLeaveCount = todayAttendance.filter((a) => a.status === 'ON_LEAVE').length;
    const absentCount = Math.max(0, activeEmployees - todayAttendance.length);

    const payrollSummary = latestPayrollPeriod
      ? {
          periodName: latestPayrollPeriod.name,
          status: latestPayrollPeriod.status,
          totalGross: latestPayrollPeriod.payrolls.reduce((acc, curr) => acc + curr.totalGross, 0),
          totalNet: latestPayrollPeriod.payrolls.reduce((acc, curr) => acc + curr.netSalary, 0),
        }
      : null;

    return {
      metrics: {
        totalEmployees,
        activeEmployees,
        departmentsCount,
        presentToday: presentCount + lateCount,
        lateToday: lateCount,
        earlyLeaveToday: earlyLeaveCount,
        absentToday: absentCount,
        onLeaveToday: onLeaveCount,
        pendingLeaves,
        pendingOvertime,
      },
      employeesByDept: employeesByDept.map((d) => ({ department: d.name, count: d._count.employees })),
      todayAttendanceList: todayAttendance,
      payrollSummary,
    };
  }

  async generateCsvReport(type: 'EMPLOYEE' | 'ATTENDANCE' | 'LEAVE' | 'PAYROLL') {
    let rows: any[] = [];
    let headers: string[] = [];

    if (type === 'EMPLOYEE') {
      const data = await this.prisma.employee.findMany({ include: { department: true, position: true } });
      headers = ['Employee Code', 'First Name', 'Last Name', 'Email', 'Phone', 'Department', 'Position', 'Status', 'Hire Date'];
      rows = data.map((e) => [
        e.employeeCode,
        e.firstName,
        e.lastName,
        e.email,
        e.phone || '',
        e.department?.name || '',
        e.position?.title || '',
        e.status,
        e.hireDate.toISOString().split('T')[0],
      ]);
    } else if (type === 'ATTENDANCE') {
      const data = await this.prisma.attendanceRecord.findMany({ include: { employee: true } });
      headers = ['Date', 'Employee Code', 'Employee Name', 'Check-In', 'Check-Out', 'IP Address', 'Network', 'Status', 'Hours'];
      rows = data.map((a) => [
        a.date.toISOString().split('T')[0],
        a.employee.employeeCode,
        `${a.employee.firstName} ${a.employee.lastName}`,
        a.checkInTime ? new Date(a.checkInTime).toLocaleTimeString() : '',
        a.checkOutTime ? new Date(a.checkOutTime).toLocaleTimeString() : '',
        a.ipAddress,
        a.networkName || '',
        a.status,
        a.workingHours,
      ]);
    } else if (type === 'LEAVE') {
      const data = await this.prisma.leaveRequest.findMany({ include: { employee: true, leaveType: true } });
      headers = ['Employee Code', 'Employee Name', 'Leave Type', 'Start Date', 'End Date', 'Total Days', 'Status', 'Reason'];
      rows = data.map((l) => [
        l.employee.employeeCode,
        `${l.employee.firstName} ${l.employee.lastName}`,
        l.leaveType.name,
        l.startDate.toISOString().split('T')[0],
        l.endDate.toISOString().split('T')[0],
        l.totalDays,
        l.status,
        l.reason,
      ]);
    } else if (type === 'PAYROLL') {
      const data = await this.prisma.payroll.findMany({ include: { employee: true, period: true } });
      headers = ['Period', 'Employee Code', 'Employee Name', 'Base Salary', 'Allowances', 'Bonuses', 'Overtime Pay', 'Total Gross', 'Insurance', 'Tax', 'Net Salary', 'Status'];
      rows = data.map((p) => [
        p.period.name,
        p.employee.employeeCode,
        `${p.employee.firstName} ${p.employee.lastName}`,
        p.baseSalary,
        p.allowances,
        p.bonuses,
        p.overtimePay,
        p.totalGross,
        p.insurance,
        p.tax,
        p.netSalary,
        p.status,
      ]);
    }

    const csvLines = [headers.join(','), ...rows.map((row) => row.map((val) => `"${val}"`).join(','))];
    return csvLines.join('\n');
  }
}
