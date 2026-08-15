import { DevicesService } from './devices.service';
import { DeviceStatus } from '@prisma/client';
export declare class DevicesController {
    private readonly devicesService;
    constructor(devicesService: DevicesService);
    findAll(): Promise<({
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
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DeviceStatus;
        employeeId: string;
        deviceName: string;
        deviceFingerprint: string;
        os: string | null;
        browser: string | null;
        registeredAt: Date;
    })[]>;
    getMyDevices(employeeId: string): Promise<{
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DeviceStatus;
        employeeId: string;
        deviceName: string;
        deviceFingerprint: string;
        os: string | null;
        browser: string | null;
        registeredAt: Date;
    }[]>;
    register(employeeId: string, data: {
        deviceFingerprint: string;
        deviceName: string;
        os?: string;
        browser?: string;
    }): Promise<{
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DeviceStatus;
        employeeId: string;
        deviceName: string;
        deviceFingerprint: string;
        os: string | null;
        browser: string | null;
        registeredAt: Date;
    }>;
    updateStatus(id: string, status: DeviceStatus): Promise<{
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DeviceStatus;
        employeeId: string;
        deviceName: string;
        deviceFingerprint: string;
        os: string | null;
        browser: string | null;
        registeredAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DeviceStatus;
        employeeId: string;
        deviceName: string;
        deviceFingerprint: string;
        os: string | null;
        browser: string | null;
        registeredAt: Date;
    }>;
}
