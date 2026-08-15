import { Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: any): Promise<{
        userId: string;
        email: string;
        role: import(".prisma/client").$Enums.RoleEnum;
        employeeId: string;
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
    }>;
}
export {};
