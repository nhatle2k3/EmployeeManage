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
exports.LeaveService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const events_service_1 = require("../events/events.service");
const notifications_service_1 = require("../notifications/notifications.service");
let LeaveService = class LeaveService {
    constructor(prisma, eventsService, notificationsService) {
        this.prisma = prisma;
        this.eventsService = eventsService;
        this.notificationsService = notificationsService;
    }
    async getLeaveTypes() {
        return this.prisma.leaveType.findMany({ orderBy: { code: 'asc' } });
    }
    async createLeaveType(data) {
        return this.prisma.leaveType.create({ data });
    }
    async getMyBalances(employeeId, year = new Date().getFullYear()) {
        return this.prisma.leaveBalance.findMany({
            where: { employeeId, year },
            include: { leaveType: true },
        });
    }
    async submitLeaveRequest(employeeId, data) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        if (end < start) {
            throw new common_1.BadRequestException('End date cannot be prior to start date');
        }
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        const year = start.getFullYear();
        const balance = await this.prisma.leaveBalance.findUnique({
            where: {
                employeeId_leaveTypeId_year: {
                    employeeId,
                    leaveTypeId: data.leaveTypeId,
                    year,
                },
            },
        });
        if (balance && balance.remainingDays < totalDays) {
            throw new common_1.BadRequestException(`Insufficient leave balance. Requested: ${totalDays} days, Remaining: ${balance.remainingDays} days`);
        }
        const request = await this.prisma.leaveRequest.create({
            data: {
                employeeId,
                leaveTypeId: data.leaveTypeId,
                startDate: start,
                endDate: end,
                totalDays,
                reason: data.reason,
                status: client_1.StatusWorkflow.PENDING,
            },
            include: { leaveType: true, employee: true },
        });
        if (balance) {
            await this.prisma.leaveBalance.update({
                where: { id: balance.id },
                data: { pendingDays: balance.pendingDays + totalDays },
            });
        }
        this.eventsService.emit('LEAVE_REQUEST', { request });
        try {
            const adminUsers = await this.prisma.user.findMany({
                where: { role: { name: { in: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER'] } } },
            });
            for (const admin of adminUsers) {
                await this.notificationsService.create({
                    userId: admin.id,
                    title: 'Đề xuất nghỉ phép mới',
                    message: `Nhân viên ${request.employee?.firstName} ${request.employee?.lastName} đã gửi đơn xin nghỉ phép ${request.totalDays} ngày.`,
                    type: 'LEAVE_REQUEST',
                    linkUrl: '/leave',
                });
            }
        }
        catch (e) {
        }
        return request;
    }
    async findAllRequests(employeeId, status) {
        const where = {};
        if (employeeId)
            where.employeeId = employeeId;
        if (status)
            where.status = status;
        return this.prisma.leaveRequest.findMany({
            where,
            include: {
                employee: { select: { id: true, firstName: true, lastName: true, employeeCode: true, department: true } },
                leaveType: true,
                approvedByUser: { select: { id: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async processRequest(userId, requestId, action, comment) {
        const request = await this.prisma.leaveRequest.findUnique({
            where: { id: requestId },
            include: { leaveType: true, employee: { include: { user: true } } },
        });
        if (!request)
            throw new common_1.NotFoundException('Leave request not found');
        if (request.status !== client_1.StatusWorkflow.PENDING) {
            throw new common_1.BadRequestException('Request is already processed');
        }
        const year = request.startDate.getFullYear();
        const balance = await this.prisma.leaveBalance.findUnique({
            where: {
                employeeId_leaveTypeId_year: {
                    employeeId: request.employeeId,
                    leaveTypeId: request.leaveTypeId,
                    year,
                },
            },
        });
        const newStatus = action === 'APPROVE' ? client_1.StatusWorkflow.APPROVED : client_1.StatusWorkflow.REJECTED;
        if (balance) {
            if (action === 'APPROVE') {
                await this.prisma.leaveBalance.update({
                    where: { id: balance.id },
                    data: {
                        pendingDays: Math.max(0, balance.pendingDays - request.totalDays),
                        usedDays: balance.usedDays + request.totalDays,
                        remainingDays: Math.max(0, balance.remainingDays - request.totalDays),
                    },
                });
            }
            else {
                await this.prisma.leaveBalance.update({
                    where: { id: balance.id },
                    data: {
                        pendingDays: Math.max(0, balance.pendingDays - request.totalDays),
                    },
                });
            }
        }
        const updated = await this.prisma.leaveRequest.update({
            where: { id: requestId },
            data: {
                status: newStatus,
                approvedByUserId: userId,
                approvalComment: comment,
            },
            include: { leaveType: true, employee: true },
        });
        this.eventsService.emit('LEAVE_PROCESSED', { request: updated });
        if (request.employee?.user?.id) {
            try {
                const actionStr = action === 'APPROVE' ? 'ĐÃ ĐƯỢC DUYỆT' : 'ĐÃ BỊ TỪ CHỐI';
                await this.notificationsService.create({
                    userId: request.employee.user.id,
                    title: `Đơn xin nghỉ phép ${actionStr}`,
                    message: `Yêu cầu nghỉ phép ${request.leaveType.name} (${request.totalDays} ngày) của bạn ${actionStr.toLowerCase()}.`,
                    type: 'LEAVE_PROCESSED',
                    linkUrl: '/leave',
                });
            }
            catch (e) {
            }
        }
        return updated;
    }
};
exports.LeaveService = LeaveService;
exports.LeaveService = LeaveService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        events_service_1.EventsService,
        notifications_service_1.NotificationsService])
], LeaveService);
//# sourceMappingURL=leave.service.js.map