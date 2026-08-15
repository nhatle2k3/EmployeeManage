import { PayrollService } from './payroll.service';
import { StatusWorkflow } from '@prisma/client';
export declare class PayrollController {
    private readonly payrollService;
    constructor(payrollService: PayrollService);
    getTaxConfigs(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bracketName: string;
        minIncome: number;
        maxIncome: number | null;
        taxRatePercentage: number;
        fixedDeduction: number;
    }[]>;
    getInsuranceConfigs(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        insuranceType: string;
        employeeRatePercentage: number;
        employerRatePercentage: number;
        maxSalaryCap: number | null;
    }[]>;
    updateTaxConfig(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bracketName: string;
        minIncome: number;
        maxIncome: number | null;
        taxRatePercentage: number;
        fixedDeduction: number;
    }>;
    updateInsuranceConfig(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        insuranceType: string;
        employeeRatePercentage: number;
        employerRatePercentage: number;
        maxSalaryCap: number | null;
    }>;
    getSalaryStructure(employeeId: string): Promise<{
        employee: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            managerId: string | null;
            departmentId: string | null;
            employeeCode: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            gender: string | null;
            dob: Date | null;
            address: string | null;
            nationalId: string | null;
            taxId: string | null;
            bankAccount: string | null;
            bankName: string | null;
            hireDate: Date;
            status: import(".prisma/client").$Enums.EmploymentStatus;
            positionId: string | null;
        };
        components: {
            id: string;
            type: string;
            componentName: string;
            amount: number;
            isTaxable: boolean;
            isInsuranceable: boolean;
            structureId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        employeeId: string;
        baseSalary: number;
        effectiveDate: Date;
    }>;
    upsertSalaryStructure(employeeId: string, data: {
        baseSalary: number;
        components?: any[];
    }): Promise<{
        components: {
            id: string;
            type: string;
            componentName: string;
            amount: number;
            isTaxable: boolean;
            isInsuranceable: boolean;
            structureId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        employeeId: string;
        baseSalary: number;
        effectiveDate: Date;
    }>;
    getPayrollPeriods(): Promise<({
        _count: {
            payrolls: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StatusWorkflow;
        startDate: Date;
        endDate: Date;
        totalWorkingDays: number;
    })[]>;
    createPayrollPeriod(data: {
        name: string;
        startDate: string;
        endDate: string;
        totalWorkingDays?: number;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StatusWorkflow;
        startDate: Date;
        endDate: Date;
        totalWorkingDays: number;
    }>;
    calculatePeriodPayroll(periodId: string): Promise<{
        message: string;
        totalRecords: number;
        payrolls: any[];
    }>;
    updatePeriodStatus(periodId: string, status: StatusWorkflow): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StatusWorkflow;
        startDate: Date;
        endDate: Date;
        totalWorkingDays: number;
    }>;
    getPayrolls(user: any, periodId?: string, employeeId?: string): Promise<({
        employee: {
            id: string;
            department: {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                parentId: string | null;
                managerId: string | null;
            };
            position: {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                title: string;
                baseSalaryMin: number;
                baseSalaryMax: number;
                departmentId: string | null;
            };
            employeeCode: string;
            firstName: string;
            lastName: string;
        };
        items: {
            id: string;
            description: string | null;
            title: string;
            amount: number;
            itemType: string;
            payrollId: string;
        }[];
        period: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.StatusWorkflow;
            startDate: Date;
            endDate: Date;
            totalWorkingDays: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StatusWorkflow;
        bonuses: number;
        employeeId: string;
        baseSalary: number;
        periodId: string;
        allowances: number;
        overtimePay: number;
        commission: number;
        totalGross: number;
        deductions: number;
        insurance: number;
        tax: number;
        netSalary: number;
        paymentDate: Date | null;
    })[]>;
    getPayslip(id: string): Promise<{
        employee: {
            department: {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                parentId: string | null;
                managerId: string | null;
            };
            position: {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                title: string;
                baseSalaryMin: number;
                baseSalaryMax: number;
                departmentId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            managerId: string | null;
            departmentId: string | null;
            employeeCode: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            gender: string | null;
            dob: Date | null;
            address: string | null;
            nationalId: string | null;
            taxId: string | null;
            bankAccount: string | null;
            bankName: string | null;
            hireDate: Date;
            status: import(".prisma/client").$Enums.EmploymentStatus;
            positionId: string | null;
        };
        items: {
            id: string;
            description: string | null;
            title: string;
            amount: number;
            itemType: string;
            payrollId: string;
        }[];
        period: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.StatusWorkflow;
            startDate: Date;
            endDate: Date;
            totalWorkingDays: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StatusWorkflow;
        bonuses: number;
        employeeId: string;
        baseSalary: number;
        periodId: string;
        allowances: number;
        overtimePay: number;
        commission: number;
        totalGross: number;
        deductions: number;
        insurance: number;
        tax: number;
        netSalary: number;
        paymentDate: Date | null;
    }>;
}
