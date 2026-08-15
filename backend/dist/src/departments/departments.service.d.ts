import { PrismaService } from '../prisma/prisma.service';
export declare class DepartmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        parent: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            parentId: string | null;
            managerId: string | null;
        };
        children: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            parentId: string | null;
            managerId: string | null;
        }[];
        manager: {
            id: string;
            employeeCode: string;
            firstName: string;
            lastName: string;
            email: string;
        };
        _count: {
            employees: number;
            positions: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        parentId: string | null;
        managerId: string | null;
    })[]>;
    getOrgChart(): Promise<({
        children: ({
            children: {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                parentId: string | null;
                managerId: string | null;
            }[];
            manager: {
                id: string;
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
                firstName: string;
                lastName: string;
            };
            employees: {
                id: string;
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
                firstName: string;
                lastName: string;
            }[];
        } & {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            parentId: string | null;
            managerId: string | null;
        })[];
        manager: {
            id: string;
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
            firstName: string;
            lastName: string;
        };
        employees: {
            id: string;
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
            firstName: string;
            lastName: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        parentId: string | null;
        managerId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        parent: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            parentId: string | null;
            managerId: string | null;
        };
        children: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            parentId: string | null;
            managerId: string | null;
        }[];
        manager: {
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
        employees: {
            id: string;
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
            email: string;
            status: import(".prisma/client").$Enums.EmploymentStatus;
        }[];
        positions: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            title: string;
            baseSalaryMin: number;
            baseSalaryMax: number;
            departmentId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        parentId: string | null;
        managerId: string | null;
    }>;
    create(data: {
        code: string;
        name: string;
        description?: string;
        parentId?: string;
        managerId?: string;
    }): Promise<{
        parent: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            parentId: string | null;
            managerId: string | null;
        };
        manager: {
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
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        parentId: string | null;
        managerId: string | null;
    }>;
    update(id: string, data: {
        name?: string;
        description?: string;
        parentId?: string;
        managerId?: string;
    }): Promise<{
        parent: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            parentId: string | null;
            managerId: string | null;
        };
        manager: {
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
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        parentId: string | null;
        managerId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        parentId: string | null;
        managerId: string | null;
    }>;
}
