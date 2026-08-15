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
exports.OvertimeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let OvertimeService = class OvertimeService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submitRequest(employeeId, data) {
        const otDate = new Date(data.date);
        const dayOfWeek = otDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const multiplierSetting = await this.prisma.companySetting.findUnique({
            where: { key: isWeekend ? 'OVERTIME_RATE_WEEKEND' : 'OVERTIME_RATE_NORMAL' },
        });
        const rateMultiplier = multiplierSetting ? parseFloat(multiplierSetting.value) : (isWeekend ? 2.0 : 1.5);
        return this.prisma.overtimeRecord.create({
            data: {
                employeeId,
                date: otDate,
                startTime: data.startTime,
                endTime: data.endTime,
                hours: data.hours,
                rateMultiplier,
                reason: data.reason,
                status: client_1.StatusWorkflow.PENDING,
            },
        });
    }
    async findAll(employeeId, status) {
        const where = {};
        if (employeeId)
            where.employeeId = employeeId;
        if (status)
            where.status = status;
        return this.prisma.overtimeRecord.findMany({
            where,
            include: {
                employee: { select: { id: true, firstName: true, lastName: true, employeeCode: true, department: true } },
                approvedByUser: { select: { id: true, email: true } },
            },
            orderBy: { date: 'desc' },
        });
    }
    async processRequest(userId, id, action) {
        const ot = await this.prisma.overtimeRecord.findUnique({ where: { id } });
        if (!ot)
            throw new common_1.NotFoundException('Overtime record not found');
        if (ot.status !== client_1.StatusWorkflow.PENDING) {
            throw new common_1.BadRequestException('Request already processed');
        }
        return this.prisma.overtimeRecord.update({
            where: { id },
            data: {
                status: action === 'APPROVE' ? client_1.StatusWorkflow.APPROVED : client_1.StatusWorkflow.REJECTED,
                approvedByUserId: userId,
            },
            include: { employee: true },
        });
    }
};
exports.OvertimeService = OvertimeService;
exports.OvertimeService = OvertimeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OvertimeService);
//# sourceMappingURL=overtime.service.js.map