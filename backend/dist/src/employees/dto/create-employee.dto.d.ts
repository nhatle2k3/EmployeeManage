import { EmploymentStatus } from '@prisma/client';
export declare class CreateEmployeeDto {
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    gender?: string;
    dob?: string;
    address?: string;
    nationalId?: string;
    taxId?: string;
    bankAccount?: string;
    bankName?: string;
    departmentId?: string;
    positionId?: string;
    managerId?: string;
    hireDate?: string;
    status?: EmploymentStatus;
}
