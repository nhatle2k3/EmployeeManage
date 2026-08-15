import { ShiftsService } from './shifts.service';
export declare class ShiftsController {
    private readonly shiftsService;
    constructor(shiftsService: ShiftsService);
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
    getMyShift(employeeId: string): Promise<{
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
    createShift(data: any): Promise<{
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
    assignShift(body: {
        employeeId: string;
        shiftId: string;
        startDate: Date;
        endDate?: Date;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        employeeId: string;
        isActive: boolean;
        startDate: Date;
        endDate: Date | null;
        shiftId: string;
    }>;
}
