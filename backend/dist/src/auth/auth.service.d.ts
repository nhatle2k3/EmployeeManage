import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
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
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    private generateTokens;
}
