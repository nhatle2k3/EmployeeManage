"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PayrollService = class PayrollService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTaxConfigs() {
        return this.prisma.taxConfiguration.findMany({ orderBy: { minIncome: 'asc' } });
    }
    async getInsuranceConfigs() {
        return this.prisma.insuranceConfiguration.findMany();
    }
    async updateTaxConfig(id, data) {
        return this.prisma.taxConfiguration.update({ where: { id }, data });
    }
    async updateInsuranceConfig(id, data) {
        return this.prisma.insuranceConfiguration.update({ where: { id }, data });
    }
    async getSalaryStructure(employeeId) {
        return this.prisma.salaryStructure.findUnique({
            where: { employeeId },
            include: { components: true, employee: true },
        });
    }
    async upsertSalaryStructure(employeeId, data) {
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
    async createPayrollPeriod(data) {
        return this.prisma.payrollPeriod.create({
            data: {
                name: data.name,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                totalWorkingDays: data.totalWorkingDays || 22,
                status: client_1.StatusWorkflow.DRAFT,
            },
        });
    }
    async getPayrollPeriods() {
        return this.prisma.payrollPeriod.findMany({
            include: { _count: { select: { payrolls: true } } },
            orderBy: { startDate: 'desc' },
        });
    }
    async calculatePeriodPayroll(periodId) {
        const period = await this.prisma.payrollPeriod.findUnique({ where: { id: periodId } });
        if (!period)
            throw new common_1.NotFoundException('Payroll period not found');
        const employees = await this.prisma.employee.findMany({
            where: { status: 'ACTIVE' },
            include: {
                salaryStructure: { include: { components: true } },
                contracts: { where: { status: 'ACTIVE' } },
            },
        });
        const taxConfigs = await this.prisma.taxConfiguration.findMany({ orderBy: { minIncome: 'asc' } });
        const insuranceConfigs = await this.prisma.insuranceConfiguration.findMany();
        await this.prisma.payrollItem.deleteMany({
            where: { payroll: { periodId } },
        });
        await this.prisma.payroll.deleteMany({ where: { periodId } });
        const computedPayrolls = [];
        for (const emp of employees) {
            const baseSalary = emp.salaryStructure?.baseSalary || emp.contracts[0]?.salary || 1000;
            let allowances = 0;
            let bonuses = 0;
            let deductions = 0;
            if (emp.salaryStructure?.components) {
                for (const comp of emp.salaryStructure.components) {
                    if (comp.type === 'ALLOWANCE')
                        allowances += comp.amount;
                    else if (comp.type === 'BONUS')
                        bonuses += comp.amount;
                    else if (comp.type === 'DEDUCTION')
                        deductions += comp.amount;
                }
            }
            const approvedOvertimes = await this.prisma.overtimeRecord.findMany({
                where: {
                    employeeId: emp.id,
                    status: client_1.StatusWorkflow.APPROVED,
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
            let totalInsurance = 0;
            for (const ins of insuranceConfigs) {
                const cappedBase = ins.maxSalaryCap ? Math.min(baseSalary, ins.maxSalaryCap) : baseSalary;
                totalInsurance += cappedBase * (ins.employeeRatePercentage / 100);
            }
            totalInsurance = parseFloat(totalInsurance.toFixed(2));
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
            const netSalary = parseFloat((totalGross - deductions - totalInsurance - totalTax).toFixed(2));
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
                    status: client_1.StatusWorkflow.CALCULATED,
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
        await this.prisma.payrollPeriod.update({
            where: { id: periodId },
            data: { status: client_1.StatusWorkflow.CALCULATED },
        });
        return { message: 'Payroll calculated successfully', totalRecords: computedPayrolls.length, payrolls: computedPayrolls };
    }
    async updatePeriodStatus(periodId, status) {
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
    async getPayrolls(periodId, employeeId) {
        const where = {};
        if (periodId)
            where.periodId = periodId;
        if (employeeId)
            where.employeeId = employeeId;
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
    async getPayslip(payrollId) {
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
        if (!payslip)
            throw new common_1.NotFoundException('Payslip record not found');
        return payslip;
    }
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PayrollService);
//# sourceMappingURL=payroll.service.js.map