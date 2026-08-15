import { AttendanceService } from './attendance.service';
import { CheckInOutDto } from './dto/check-in-out.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    getMyTodayStatus(employeeId: string, req: any): Promise<{
        networkCheck: {
            clientIp: string;
            networkName: string;
            isAllowed: boolean;
        };
        record: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.AttendanceStatus;
            employeeId: string;
            date: Date;
            checkInTime: Date | null;
            checkOutTime: Date | null;
            ipAddress: string;
            networkId: string | null;
            networkName: string | null;
            deviceId: string | null;
            deviceName: string | null;
            method: import(".prisma/client").$Enums.AttendanceMethod;
            workingHours: number;
            overtimeHours: number;
            remarks: string | null;
        };
        currentShift: {
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
        };
        currentTime: string;
    }>;
    checkIn(employeeId: string, req: any, body: CheckInOutDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        employeeId: string;
        date: Date;
        checkInTime: Date | null;
        checkOutTime: Date | null;
        ipAddress: string;
        networkId: string | null;
        networkName: string | null;
        deviceId: string | null;
        deviceName: string | null;
        method: import(".prisma/client").$Enums.AttendanceMethod;
        workingHours: number;
        overtimeHours: number;
        remarks: string | null;
    }>;
    checkOut(employeeId: string, req: any, body: CheckInOutDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        employeeId: string;
        date: Date;
        checkInTime: Date | null;
        checkOutTime: Date | null;
        ipAddress: string;
        networkId: string | null;
        networkName: string | null;
        deviceId: string | null;
        deviceName: string | null;
        method: import(".prisma/client").$Enums.AttendanceMethod;
        workingHours: number;
        overtimeHours: number;
        remarks: string | null;
    }>;
    getAttendanceHistory(user: any, employeeId?: string, startDate?: string, endDate?: string, status?: string): Promise<({
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        employeeId: string;
        date: Date;
        checkInTime: Date | null;
        checkOutTime: Date | null;
        ipAddress: string;
        networkId: string | null;
        networkName: string | null;
        deviceId: string | null;
        deviceName: string | null;
        method: import(".prisma/client").$Enums.AttendanceMethod;
        workingHours: number;
        overtimeHours: number;
        remarks: string | null;
    })[]>;
    createAdjustment(userId: string, attendanceId: string, body: {
        adjustedCheckIn?: string;
        adjustedCheckOut?: string;
        reason: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.StatusWorkflow;
        employeeId: string;
        originalCheckIn: Date | null;
        originalCheckOut: Date | null;
        adjustedCheckIn: Date | null;
        adjustedCheckOut: Date | null;
        reason: string;
        auditNote: string | null;
        attendanceId: string;
        adjustedByUserId: string;
    }>;
}
