import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatusWorkflow } from '@prisma/client';

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  // 1. Tax & Insurance Configs
  async getTaxConfigs() {
    return this.prisma.taxConfiguration.findMany({ orderBy: { minIncome: 'asc' } });
  }

  async getInsuranceConfigs() {
    return this.prisma.insuranceConfiguration.findMany();
  }

  async updateTaxConfig(id: string, data: any) {
    return this.prisma.taxConfiguration.update({ where: { id }, data });
  }

  async updateInsuranceConfig(id: string, data: any) {
    return this.prisma.insuranceConfiguration.update({ where: { id }, data });
  }

  // 2. Salary Structures
  async getSalaryStructure(employeeId: string) {
    return this.prisma.salaryStructure.findUnique({
      where: { employeeId },
      include: { components: true, employee: true },
    });
  }

  async upsertSalaryStructure(employeeId: string, data: { baseSalary: number; components?: any[] }) {
    const existing = await this.prisma.salaryStructure.findUnique({ where: { employeeId } });

    if (existing) {
      if (data.components) {
        await this.prisma.salaryComponent.deleteMany({ where: { structureId: existing.id } });
      }
      return this.prisma.salaryStructure.update({
        where: { id: existing.id },
        data: {
          baseSalary: data.baseSalary,
          components: data.components
            ? { createMany: { data: data.components } }
            : undefined,
        },
        include: { components: true },
      });
    }

    return this.prisma.salaryStructure.create({
      data: {
        employeeId,
        baseSalary: data.baseSalary,
        components: data.components ? { createMany: { data: data.components } } : undefined,
      },
      include: { components: true },
    });
  }

  // 3. Payroll Periods & Automated Calculation Workflow
  async createPayrollPeriod(data: { name: string; startDate: string; endDate: string; totalWorkingDays?: number }) {
    return this.prisma.payrollPeriod.create({
      data: {
        name: data.name,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        totalWorkingDays: data.totalWorkingDays || 22,
        status: StatusWorkflow.DRAFT,
      },
    });
  }

  async getPayrollPeriods() {
    return this.prisma.payrollPeriod.findMany({
      include: { _count: { select: { payrolls: true } } },
      orderBy: { startDate: 'desc' },
    });
  }

  /**
   * CORE PAYROLL CALCULATION ENGINE
   * Workflow: DRAFT -> CALCULATED
   */
  async calculatePeriodPayroll(periodId: string) {
    const period = await this.prisma.payrollPeriod.findUnique({ where: { id: periodId } });
    if (!period) throw new NotFoundException('Payroll period not found');

    const employees = await this.prisma.employee.findMany({
      where: { status: 'ACTIVE' },
      include: {
        salaryStructure: { include: { components: true } },
        contracts: { where: { status: 'ACTIVE' } },
      },
    });

    const taxConfigs = await this.prisma.taxConfiguration.findMany({ orderBy: { minIncome: 'asc' } });
    const insuranceConfigs = await this.prisma.insuranceConfiguration.findMany();

    // Clear existing payroll items for period if recalculating
    await this.prisma.payrollItem.deleteMany({
      where: { payroll: { periodId } },
    });
    await this.prisma.payroll.deleteMany({ where: { periodId } });

    const computedPayrolls = [];

    for (const emp of employees) {
      const baseSalary = emp.salaryStructure?.baseSalary || emp.contracts[0]?.salary || 1000;

      // Calculate Allowances & Bonuses
      let allowances = 0;
      let bonuses = 0;
      let deductions = 0;

      if (emp.salaryStructure?.components) {
        for (const comp of emp.salaryStructure.components) {
          if (comp.type === 'ALLOWANCE') allowances += comp.amount;
          else if (comp.type === 'BONUS') bonuses += comp.amount;
          else if (comp.type === 'DEDUCTION') deductions += comp.amount;
        }
      }

      // Calculate Approved Overtime Pay for the period
      const approvedOvertimes = await this.prisma.overtimeRecord.findMany({
        where: {
          employeeId: emp.id,
          status: StatusWorkflow.APPROVED,
          date: { gte: period.startDate, lte: period.endDate },
        },
      });

      const hourlyRate = baseSalary / (period.totalWorkingDays * 8);
      let overtimePay = 0;
      for (const ot of approvedOvertimes) {
        overtimePay += ot.hours * hourlyRate * ot.rateMultiplier;
      }
      overtimePay = parseFloat(overtimePay.toFixed(2));

      const commission = 0;
      const totalGross = baseSalary + allowances + bonuses + overtimePay + commission;

      // Calculate Insurance (Employee portion based on Insurance Configurations)
      let totalInsurance = 0;
      for (const ins of insuranceConfigs) {
        const cappedBase = ins.maxSalaryCap ? Math.min(baseSalary, ins.maxSalaryCap) : baseSalary;
        totalInsurance += cappedBase * (ins.employeeRatePercentage / 100);
      }
      totalInsurance = parseFloat(totalInsurance.toFixed(2));

      // Calculate Progressive Income Tax based on TaxConfigurations
      const taxableIncome = Math.max(0, totalGross - totalInsurance - deductions);
      let totalTax = 0;

      for (const bracket of taxConfigs) {
        if (taxableIncome > bracket.minIncome) {
          const rangeMax = bracket.maxIncome ? Math.min(taxableIncome, bracket.maxIncome) : taxableIncome;
          const taxableInRange = rangeMax - bracket.minIncome;
          totalTax += taxableInRange * (bracket.taxRatePercentage / 100);
        }
      }
      totalTax = parseFloat(totalTax.toFixed(2));

      // Net Salary Formula: Base + Allowances + Bonuses + Overtime + Commission - Deductions - Insurance - Tax
      const netSalary = parseFloat(
        (totalGross - deductions - totalInsurance - totalTax).toFixed(2),
      );

      // Create Payroll Record
      const payrollRecord = await this.prisma.payroll.create({
        data: {
          periodId,
          employeeId: emp.id,
          baseSalary,
          allowances,
          bonuses,
          overtimePay,
          commission,
          totalGross,
          deductions,
          insurance: totalInsurance,
          tax: totalTax,
          netSalary,
          status: StatusWorkflow.CALCULATED,
          items: {
            create: [
              { title: 'Base Salary', itemType: 'EARNING', amount: baseSalary },
              { title: 'Allowances', itemType: 'EARNING', amount: allowances },
              { title: 'Bonuses', itemType: 'EARNING', amount: bonuses },
              { title: 'Overtime Pay', itemType: 'EARNING', amount: overtimePay },
              { title: 'Social & Health Insurance', itemType: 'INSURANCE', amount: totalInsurance },
              { title: 'Personal Income Tax', itemType: 'TAX', amount: totalTax },
              { title: 'Other Deductions', itemType: 'DEDUCTION', amount: deductions },
            ],
          },
        },
        include: { employee: true, items: true },
      });

      computedPayrolls.push(payrollRecord);
    }

    // Update period status to CALCULATED
    await this.prisma.payrollPeriod.update({
      where: { id: periodId },
      data: { status: StatusWorkflow.CALCULATED },
    });

    return { message: 'Payroll calculated successfully', totalRecords: computedPayrolls.length, payrolls: computedPayrolls };
  }

  async updatePeriodStatus(periodId: string, status: StatusWorkflow) {
    const period = await this.prisma.payrollPeriod.update({
      where: { id: periodId },
      data: { status },
    });

    await this.prisma.payroll.updateMany({
      where: { periodId },
      data: { status },
    });

    return period;
  }

  async getPayrolls(periodId?: string, employeeId?: string) {
    const where: any = {};
    if (periodId) where.periodId = periodId;
    if (employeeId) where.employeeId = employeeId;

    return this.prisma.payroll.findMany({
      where,
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeCode: true, department: true, position: true } },
        period: true,
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPayslip(payrollId: string) {
    const payslip = await this.prisma.payroll.findUnique({
      where: { id: payrollId },
      include: {
        employee: {
          include: { department: true, position: true },
        },
        period: true,
        items: true,
      },
    });

    if (!payslip) throw new NotFoundException('Payslip record not found');
    return payslip;
  }
}
