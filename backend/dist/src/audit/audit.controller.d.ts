import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
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
}
