import { PrismaService } from '../prisma/prisma.service';
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(action?: string, entity?: string): Promise<({
        user: {
            id: string;
            role: {
                id: string;
                name: import(".prisma/client").$Enums.RoleEnum;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        ipAddress: string | null;
        userEmail: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        details: string | null;
        userAgent: string | null;
        userId: string | null;
    })[]>;
    logAction(data: {
        userId?: string;
        userEmail?: string;
        action: string;
        entity: string;
        entityId?: string;
        details?: string;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        ipAddress: string | null;
        userEmail: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        details: string | null;
        userAgent: string | null;
        userId: string | null;
    }>;
}
