import { PrismaService } from '../prisma/prisma.service';
export declare class ShiftsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllShifts(): Promise<({
        _count: {
            shiftAssignments: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        startTime: string;
        endTime: string;
        breakStartTime: string | null;
        breakEndTime: string | null;
        lateToleranceMins: number;
        earlyLeaveToleranceMins: number;
        isOvernight: boolean;
    })[]>;
    findShift(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        startTime: string;
        endTime: string;
        breakStartTime: string | null;
        breakEndTime: string | null;
        lateToleranceMins: number;
        earlyLeaveToleranceMins: number;
        isOvernight: boolean;
    }>;
    createShift(data: {
        code: string;
        name: string;
        startTime: string;
        endTime: string;
        breakStartTime?: string;
        breakEndTime?: string;
        lateToleranceMins?: number;
        earlyLeaveToleranceMins?: number;
        isOvernight?: boolean;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        startTime: string;
        endTime: string;
        breakStartTime: string | null;
        breakEndTime: string | null;
        lateToleranceMins: number;
        earlyLeaveToleranceMins: number;
        isOvernight: boolean;
    }>;
    updateShift(id: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        startTime: string;
        endTime: string;
        breakStartTime: string | null;
        breakEndTime: string | null;
        lateToleranceMins: number;
        earlyLeaveToleranceMins: number;
        isOvernight: boolean;
    }>;
    deleteShift(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        startTime: string;
        endTime: string;
        breakStartTime: string | null;
        breakEndTime: string | null;
        lateToleranceMins: number;
        earlyLeaveToleranceMins: number;
        isOvernight: boolean;
    }>;
    assignShift(employeeId: string, shiftId: string, startDate: Date, endDate?: Date): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        employeeId: string;
        isActive: boolean;
        startDate: Date;
        endDate: Date | null;
        shiftId: string;
    }>;
    getEmployeeCurrentShift(employeeId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        startTime: string;
        endTime: string;
        breakStartTime: string | null;
        breakEndTime: string | null;
        lateToleranceMins: number;
        earlyLeaveToleranceMins: number;
        isOvernight: boolean;
    }>;
}
