"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let DevicesService = class DevicesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.registeredDevice.findMany({
            include: {
                employee: {
                    select: { id: true, firstName: true, lastName: true, employeeCode: true, department: true },
                },
            },
            orderBy: { registeredAt: 'desc' },
        });
    }
    async findByEmployee(employeeId) {
        return this.prisma.registeredDevice.findMany({
            where: { employeeId },
            orderBy: { registeredAt: 'desc' },
        });
    }
    async registerDevice(employeeId, data) {
        const existing = await this.prisma.registeredDevice.findUnique({
            where: {
                employeeId_deviceFingerprint: {
                    employeeId,
                    deviceFingerprint: data.deviceFingerprint,
                },
            },
        });
        if (existing) {
            return existing;
        }
        return this.prisma.registeredDevice.create({
            data: {
                employeeId,
                deviceFingerprint: data.deviceFingerprint,
                deviceName: data.deviceName,
                os: data.os,
                browser: data.browser,
                status: client_1.DeviceStatus.PENDING,
            },
        });
    }
    async updateStatus(id, status) {
        const dev = await this.prisma.registeredDevice.findUnique({ where: { id } });
        if (!dev)
            throw new common_1.NotFoundException('Device not found');
        return this.prisma.registeredDevice.update({
            where: { id },
            data: { status },
        });
    }
    async remove(id) {
        return this.prisma.registeredDevice.delete({ where: { id } });
    }
};
exports.DevicesService = DevicesService;
exports.DevicesService = DevicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DevicesService);
//# sourceMappingURL=devices.service.js.map