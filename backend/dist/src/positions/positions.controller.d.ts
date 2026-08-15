import { PositionsService } from './positions.service';
export declare class PositionsController {
    private readonly positionsService;
    constructor(positionsService: PositionsService);
    findAll(): Promise<({
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
        _count: {
            employees: number;
        };
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        title: string;
        baseSalaryMin: number;
        baseSalaryMax: number;
        departmentId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        employees: {
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
        }[];
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
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        title: string;
        baseSalaryMin: number;
        baseSalaryMax: number;
        departmentId: string | null;
    }>;
    create(data: {
        code: string;
        title: string;
        description?: string;
        baseSalaryMin?: number;
        baseSalaryMax?: number;
        departmentId?: string;
    }): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        title: string;
        baseSalaryMin: number;
        baseSalaryMax: number;
        departmentId: string | null;
    }>;
    update(id: string, data: {
        title?: string;
        description?: string;
        baseSalaryMin?: number;
        baseSalaryMax?: number;
        departmentId?: string;
    }): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        title: string;
        baseSalaryMin: number;
        baseSalaryMax: number;
        departmentId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        title: string;
        baseSalaryMin: number;
        baseSalaryMax: number;
        departmentId: string | null;
    }>;
}
