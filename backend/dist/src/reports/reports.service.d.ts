import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardSummary(): Promise<{
        metrics: {
            totalEmployees: number;
            activeEmployees: number;
            departmentsCount: number;
            presentToday: number;
            lateToday: number;
            earlyLeaveToday: number;
            absentToday: number;
            onLeaveToday: number;
            pendingLeaves: number;
            pendingOvertime: number;
        };
        employeesByDept: {
            department: string;
            count: number;
        }[];
        todayAttendanceList: ({
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
        })[];
        payrollSummary: {
            periodName: string;
            status: import(".prisma/client").$Enums.StatusWorkflow;
            totalGross: number;
            totalNet: number;
        };
    }>;
    generateCsvReport(type: 'EMPLOYEE' | 'ATTENDANCE' | 'LEAVE' | 'PAYROLL'): Promise<string>;
}
