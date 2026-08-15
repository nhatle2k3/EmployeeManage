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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ip_validator_util_1 = require("../common/utils/ip-validator.util");
const client_1 = require("@prisma/client");
let AttendanceService = class AttendanceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateNetworkIp(req) {
        const clientIp = ip_validator_util_1.IpValidatorUtil.extractClientIp(req);
        const activeNetworks = await this.prisma.attendanceNetwork.findMany({
            where: { isActive: true },
        });
        const allowedCidrs = activeNetworks.map((net) => net.cidr);
        const isAllowed = ip_validator_util_1.IpValidatorUtil.isIpInCidrList(clientIp, allowedCidrs);
        let networkName = 'Unknown External Network';
        if (isAllowed) {
            const matchedNet = activeNetworks.find((net) => ip_validator_util_1.IpValidatorUtil.isIpInCidrList(clientIp, [net.cidr]));
            if (matchedNet) {
                networkName = matchedNet.name;
            }
        }
        return { clientIp, networkName, isAllowed };
    }
    async checkIn(employeeId, req, body) {
        if (!employeeId) {
            throw new common_1.BadRequestException('Employee record not linked to user account');
        }
        const { clientIp, networkName, isAllowed } = await this.validateNetworkIp(req);
        if (!isAllowed) {
            throw new common_1.ForbiddenException({
                statusCode: 403,
                errorCode: 'ATTENDANCE_NETWORK_NOT_ALLOWED',
                message: `Attendance rejected: IP address ${clientIp} is outside approved company networks.`,
                clientIp,
            });
        }
        const todayStr = new Date().toISOString().split('T')[0];
        const todayDate = new Date(todayStr);
        const existingRecord = await this.prisma.attendanceRecord.findUnique({
            where: {
                employeeId_date: {
                    employeeId,
                    date: todayDate,
                },
            },
        });
        if (existingRecord && existingRecord.checkInTime) {
            throw new common_1.BadRequestException('Already checked in for today');
        }
        const shiftAssignment = await this.prisma.shiftAssignment.findFirst({
            where: { employeeId, isActive: true },
            include: { shift: true },
        });
        const shift = shiftAssignment?.shift || (await this.prisma.workShift.findFirst());
        const now = new Date();
        let status = client_1.AttendanceStatus.PRESENT;
        if (shift) {
            const [startHour, startMin] = shift.startTime.split(':').map(Number);
            const shiftStartTime = new Date(now);
            shiftStartTime.setHours(startHour, startMin + shift.lateToleranceMins, 0, 0);
            if (now > shiftStartTime) {
                status = client_1.AttendanceStatus.LATE;
            }
        }
        if (existingRecord) {
            return this.prisma.attendanceRecord.update({
                where: { id: existingRecord.id },
                data: {
                    checkInTime: now,
                    ipAddress: clientIp,
                    networkName,
                    deviceId: body?.deviceId,
                    deviceName: body?.deviceName,
                    status,
                    remarks: body?.remarks,
                },
            });
        }
        return this.prisma.attendanceRecord.create({
            data: {
                employeeId,
                date: todayDate,
                checkInTime: now,
                ipAddress: clientIp,
                networkName,
                deviceId: body?.deviceId,
                deviceName: body?.deviceName,
                method: client_1.AttendanceMethod.WEB,
                status,
                remarks: body?.remarks,
            },
        });
    }
    async checkOut(employeeId, req, body) {
        if (!employeeId) {
            throw new common_1.BadRequestException('Employee record not linked');
        }
        const { clientIp, isAllowed } = await this.validateNetworkIp(req);
        if (!isAllowed) {
            throw new common_1.ForbiddenException({
                statusCode: 403,
                errorCode: 'ATTENDANCE_NETWORK_NOT_ALLOWED',
                message: `Attendance check-out rejected: IP address ${clientIp} is outside approved company networks.`,
                clientIp,
            });
        }
        const todayStr = new Date().toISOString().split('T')[0];
        const todayDate = new Date(todayStr);
        const record = await this.prisma.attendanceRecord.findUnique({
            where: {
                employeeId_date: {
                    employeeId,
                    date: todayDate,
                },
            },
        });
        if (!record || !record.checkInTime) {
            throw new common_1.BadRequestException('Must check in before checking out');
        }
        if (record.checkOutTime) {
            throw new common_1.BadRequestException('Already checked out for today');
        }
        const now = new Date();
        const diffMs = now.getTime() - new Date(record.checkInTime).getTime();
        const workingHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
        const shiftAssignment = await this.prisma.shiftAssignment.findFirst({
            where: { employeeId, isActive: true },
            include: { shift: true },
        });
        const shift = shiftAssignment?.shift || (await this.prisma.workShift.findFirst());
        let finalStatus = record.status;
        let overtimeHours = 0;
        if (shift) {
            const [endHour, endMin] = shift.endTime.split(':').map(Number);
            const shiftEndTime = new Date(now);
            shiftEndTime.setHours(endHour, endMin - shift.earlyLeaveToleranceMins, 0, 0);
            const exactShiftEndTime = new Date(now);
            exactShiftEndTime.setHours(endHour, endMin, 0, 0);
            if (now < shiftEndTime) {
                finalStatus = record.status === client_1.AttendanceStatus.LATE
                    ? client_1.AttendanceStatus.LATE_AND_EARLY_LEAVE
                    : client_1.AttendanceStatus.EARLY_LEAVE;
            }
            else if (now > exactShiftEndTime) {
                const otMs = now.getTime() - exactShiftEndTime.getTime();
                overtimeHours = parseFloat((otMs / (1000 * 60 * 60)).toFixed(2));
            }
        }
        return this.prisma.attendanceRecord.update({
            where: { id: record.id },
            data: {
                checkOutTime: now,
                workingHours,
                overtimeHours,
                status: finalStatus,
                remarks: body?.remarks ? `${record.remarks || ''} | ${body.remarks}` : record.remarks,
            },
        });
    }
    async getMyTodayStatus(employeeId, req) {
        const networkCheck = await this.validateNetworkIp(req);
        const todayStr = new Date().toISOString().split('T')[0];
        const record = await this.prisma.attendanceRecord.findUnique({
            where: {
                employeeId_date: {
                    employeeId,
                    date: new Date(todayStr),
                },
            },
        });
        const shiftAssignment = await this.prisma.shiftAssignment.findFirst({
            where: { employeeId, isActive: true },
            include: { shift: true },
        });
        return {
            networkCheck,
            record,
            currentShift: shiftAssignment?.shift || null,
            currentTime: new Date().toISOString(),
        };
    }
    async getAttendanceHistory(employeeId, startDate, endDate, status) {
        const where = {};
        if (employeeId)
            where.employeeId = employeeId;
        if (status)
            where.status = status;
        if (startDate || endDate) {
            where.date = {};
            if (startDate)
                where.date.gte = new Date(startDate);
            if (endDate)
                where.date.lte = new Date(endDate);
        }
        return this.prisma.attendanceRecord.findMany({
            where,
            include: {
                employee: {
                    select: { id: true, firstName: true, lastName: true, employeeCode: true, department: true },
                },
            },
            orderBy: { date: 'desc' },
        });
    }
    async createAdjustment(userId, attendanceId, data) {
        const record = await this.prisma.attendanceRecord.findUnique({ where: { id: attendanceId } });
        if (!record)
            throw new common_1.NotFoundException('Attendance record not found');
        const adjCheckIn = data.adjustedCheckIn ? new Date(data.adjustedCheckIn) : record.checkInTime;
        const adjCheckOut = data.adjustedCheckOut ? new Date(data.adjustedCheckOut) : record.checkOutTime;
        let workingHours = record.workingHours;
        if (adjCheckIn && adjCheckOut) {
            const diffMs = new Date(adjCheckOut).getTime() - new Date(adjCheckIn).getTime();
            workingHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
        }
        await this.prisma.attendanceRecord.update({
            where: { id: attendanceId },
            data: {
                checkInTime: adjCheckIn,
                checkOutTime: adjCheckOut,
                workingHours,
                remarks: `Adjusted by HR: ${data.reason}`,
            },
        });
        return this.prisma.attendanceAdjustment.create({
            data: {
                attendanceId,
                employeeId: record.employeeId,
                adjustedByUserId: userId,
                originalCheckIn: record.checkInTime,
                originalCheckOut: record.checkOutTime,
                adjustedCheckIn: adjCheckIn,
                adjustedCheckOut: adjCheckOut,
                reason: data.reason,
                status: client_1.StatusWorkflow.APPROVED,
                auditNote: `Manual adjustment recorded at ${new Date().toISOString()}`,
            },
        });
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map