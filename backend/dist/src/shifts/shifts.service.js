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
exports.ShiftsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ShiftsService = class ShiftsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllShifts() {
        return this.prisma.workShift.findMany({
            include: { _count: { select: { shiftAssignments: true } } },
            orderBy: { name: 'asc' },
        });
    }
    async findShift(id) {
        const shift = await this.prisma.workShift.findUnique({ where: { id } });
        if (!shift)
            throw new common_1.NotFoundException(`Shift ${id} not found`);
        return shift;
    }
    async createShift(data) {
        return this.prisma.workShift.create({ data });
    }
    async updateShift(id, data) {
        await this.findShift(id);
        return this.prisma.workShift.update({ where: { id }, data });
    }
    async deleteShift(id) {
        await this.findShift(id);
        return this.prisma.workShift.delete({ where: { id } });
    }
    async assignShift(employeeId, shiftId, startDate, endDate) {
        await this.prisma.shiftAssignment.updateMany({
            where: { employeeId, isActive: true },
            data: { isActive: false },
        });
        return this.prisma.shiftAssignment.create({
            data: {
                employeeId,
                shiftId,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                isActive: true,
            },
        });
    }
    async getEmployeeCurrentShift(employeeId) {
        const assignment = await this.prisma.shiftAssignment.findFirst({
            where: { employeeId, isActive: true },
            include: { shift: true },
        });
        if (!assignment) {
            return this.prisma.workShift.findFirst({ where: { code: 'SHIFT_STD' } });
        }
        return assignment.shift;
    }
};
exports.ShiftsService = ShiftsService;
exports.ShiftsService = ShiftsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShiftsService);
//# sourceMappingURL=shifts.service.js.map