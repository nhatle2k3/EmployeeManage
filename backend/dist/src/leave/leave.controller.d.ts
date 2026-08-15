import { LeaveService } from './leave.service';
import { StatusWorkflow } from '@prisma/client';
export declare class LeaveController {
    private readonly leaveService;
    constructor(leaveService: LeaveService);
    getLeaveTypes(): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        code: string;
        maxDaysPerYear: number;
        isPaid: boolean;
        requiresApproval: boolean;
    }[]>;
    createLeaveType(data: any): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        code: string;
        maxDaysPerYear: number;
        isPaid: boolean;
        requiresApproval: boolean;
    }>;
    getMyBalances(employeeId: string, year?: number): Promise<({
        leaveType: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            code: string;
            maxDaysPerYear: number;
            isPaid: boolean;
            requiresApproval: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        employeeId: string;
        year: number;
        allocatedDays: number;
        usedDays: number;
        pendingDays: number;
        remainingDays: number;
        leaveTypeId: string;
    })[]>;
    submitRequest(employeeId: string, data: {
        leaveTypeId: string;
        startDate: string;
        endDate: string;
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
        leaveType: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            code: string;
            maxDaysPerYear: number;
            isPaid: boolean;
            requiresApproval: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StatusWorkflow;
        employeeId: string;
        startDate: Date;
        endDate: Date;
        leaveTypeId: string;
        reason: string;
        totalDays: number;
        approvalComment: string | null;
        approvedByUserId: string | null;
    }>;
    findAllRequests(user: any, employeeId?: string, status?: StatusWorkflow): Promise<({
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
        leaveType: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            code: string;
            maxDaysPerYear: number;
            isPaid: boolean;
            requiresApproval: boolean;
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
        startDate: Date;
        endDate: Date;
        leaveTypeId: string;
        reason: string;
        totalDays: number;
        approvalComment: string | null;
        approvedByUserId: string | null;
    })[]>;
    processRequest(userId: string, requestId: string, body: {
        action: 'APPROVE' | 'REJECT';
        comment?: string;
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
        leaveType: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            code: string;
            maxDaysPerYear: number;
            isPaid: boolean;
            requiresApproval: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.StatusWorkflow;
        employeeId: string;
        startDate: Date;
        endDate: Date;
        leaveTypeId: string;
        reason: string;
        totalDays: number;
        approvalComment: string | null;
        approvedByUserId: string | null;
    }>;
}
