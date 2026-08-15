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
exports.DepartmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DepartmentsService = class DepartmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.department.findMany({
            include: {
                parent: true,
                children: true,
                manager: {
                    select: { id: true, firstName: true, lastName: true, employeeCode: true, email: true },
                },
                _count: {
                    select: { employees: true, positions: true },
                },
            },
            orderBy: { name: 'asc' },
        });
    }
    async getOrgChart() {
        const roots = await this.prisma.department.findMany({
            where: { parentId: null },
            include: {
                manager: {
                    select: { id: true, firstName: true, lastName: true, position: true },
                },
                employees: {
                    select: { id: true, firstName: true, lastName: true, position: true },
                },
                children: {
                    include: {
                        manager: {
                            select: { id: true, firstName: true, lastName: true, position: true },
                        },
                        employees: {
                            select: { id: true, firstName: true, lastName: true, position: true },
                        },
                        children: true,
                    },
                },
            },
        });
        return roots;
    }
    async findOne(id) {
        const dept = await this.prisma.department.findUnique({
            where: { id },
            include: {
                parent: true,
                children: true,
                manager: true,
                positions: true,
                employees: {
                    select: {
                        id: true,
                        employeeCode: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        position: true,
                        status: true,
                    },
                },
            },
        });
        if (!dept) {
            throw new common_1.NotFoundException(`Department with ID ${id} not found`);
        }
        return dept;
    }
    async create(data) {
        const existing = await this.prisma.department.findUnique({
            where: { code: data.code },
        });
        if (existing) {
            throw new common_1.BadRequestException('Department code already exists');
        }
        return this.prisma.department.create({
            data,
            include: { parent: true, manager: true },
        });
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.department.update({
            where: { id },
            data,
            include: { parent: true, manager: true },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.department.delete({ where: { id } });
    }
};
exports.DepartmentsService = DepartmentsService;
exports.DepartmentsService = DepartmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DepartmentsService);
//# sourceMappingURL=departments.service.js.map