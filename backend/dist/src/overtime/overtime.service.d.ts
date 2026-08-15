import { PrismaService } from '../prisma/prisma.service';
import { StatusWorkflow } from '@prisma/client';
import { EventsService } from '../events/events.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class OvertimeService {
    private prisma;
    private eventsService;
    private notificationsService;
    constructor(prisma: PrismaService, eventsService: EventsService, notificationsService: NotificationsService);
    submitRequest(employeeId: string, data: {
        date: string;
        startTime: string;
        endTime: string;
        hours: number;
        reason: string;
    }): Promise<{
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StatusWorkflow;
        employeeId: string;
        startTime: string;
        endTime: string;
        date: Date;
        reason: string;
        approvedByUserId: string | null;
        hours: number;
        rateMultiplier: number;
    }>;
    findAll(employeeId?: string, status?: StatusWorkflow): Promise<({
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
            employeeCode: string;
            firstName: string;
            lastName: string;
        };
        approvedByUser: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StatusWorkflow;
        employeeId: string;
        startTime: string;
        endTime: string;
        date: Date;
        reason: string;
        approvedByUserId: string | null;
        hours: number;
        rateMultiplier: number;
    })[]>;
    processRequest(userId: string, id: string, action: 'APPROVE' | 'REJECT'): Promise<{
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StatusWorkflow;
        employeeId: string;
        startTime: string;
        endTime: string;
        date: Date;
        reason: string;
        approvedByUserId: string | null;
        hours: number;
        rateMultiplier: number;
    }>;
}
