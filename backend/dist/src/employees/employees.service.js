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
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcryptjs");
const client_1 = require("@prisma/client");
let EmployeesService = class EmployeesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(search, departmentId, status) {
        const where = {};
        if (departmentId) {
            where.departmentId = departmentId;
        }
        if (status) {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { employeeCode: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.employee.findMany({
            where,
            include: {
                department: true,
                position: true,
                manager: {
                    select: { id: true, firstName: true, lastName: true, employeeCode: true },
                },
                user: {
                    select: { id: true, email: true, role: true, isActive: true },
                },
                profile: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const employee = await this.prisma.employee.findUnique({
            where: { id },
            include: {
                department: true,
                position: true,
                manager: {
                    select: { id: true, firstName: true, lastName: true, employeeCode: true },
                },
                subordinates: {
                    select: { id: true, firstName: true, lastName: true, employeeCode: true, position: true },
                },
                user: {
                    select: { id: true, email: true, role: true, isActive: true },
                },
                profile: true,
                documents: true,
                contracts: true,
                salaryStructure: {
                    include: { components: true },
                },
                leaveBalances: {
                    include: { leaveType: true },
                },
            },
        });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID ${id} not found`);
        }
        return employee;
    }
    async create(createDto) {
        const existingCode = await this.prisma.employee.findUnique({
            where: { employeeCode: createDto.employeeCode },
        });
        if (existingCode) {
            throw new common_1.BadRequestException('Employee code already exists');
        }
        const existingEmail = await this.prisma.employee.findUnique({
            where: { email: createDto.email },
        });
        if (existingEmail) {
            throw new common_1.BadRequestException('Employee email already exists');
        }
        const employee = await this.prisma.employee.create({
            data: {
                employeeCode: createDto.employeeCode,
                firstName: createDto.firstName,
                lastName: createDto.lastName,
                email: createDto.email,
                phone: createDto.phone || null,
                gender: createDto.gender || null,
                dob: createDto.dob ? new Date(createDto.dob) : null,
                address: createDto.address || null,
                nationalId: createDto.nationalId || null,
                taxId: createDto.taxId || null,
                bankAccount: createDto.bankAccount || null,
                bankName: createDto.bankName || null,
                departmentId: createDto.departmentId || null,
                positionId: createDto.positionId || null,
                managerId: createDto.managerId || null,
                hireDate: createDto.hireDate ? new Date(createDto.hireDate) : new Date(),
                status: createDto.status || 'ACTIVE',
                profile: {
                    create: {
                        bio: `Profile of ${createDto.firstName} ${createDto.lastName}`,
                    },
                },
            },
            include: {
                department: true,
                position: true,
            },
        });
        const targetRole = createDto.role || client_1.RoleEnum.EMPLOYEE;
        const employeeRole = await this.prisma.role.findUnique({ where: { name: targetRole } });
        if (employeeRole) {
            const passwordHash = await bcrypt.hash('Password123!', 10);
            await this.prisma.user.create({
                data: {
                    email: createDto.email,
                    passwordHash,
                    roleId: employeeRole.id,
                    employeeId: employee.id,
                },
            });
        }
        const leaveTypes = await this.prisma.leaveType.findMany();
        const year = new Date().getFullYear();
        for (const lt of leaveTypes) {
            await this.prisma.leaveBalance.create({
                data: {
                    employeeId: employee.id,
                    leaveTypeId: lt.id,
                    year,
                    allocatedDays: lt.maxDaysPerYear,
                    remainingDays: lt.maxDaysPerYear,
                    usedDays: 0,
                },
            });
        }
        return employee;
    }
    async update(id, updateDto) {
        await this.findOne(id);
        const dto = updateDto;
        const data = { ...dto };
        if (dto.dob)
            data.dob = new Date(dto.dob);
        if (dto.hireDate)
            data.hireDate = new Date(dto.hireDate);
        return this.prisma.employee.update({
            where: { id },
            data,
            include: {
                department: true,
                position: true,
                manager: true,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.employee.delete({ where: { id } });
    }
    async addDocument(employeeId, docData) {
        await this.findOne(employeeId);
        return this.prisma.employeeDocument.create({
            data: {
                employeeId,
                title: docData.title,
                documentType: docData.documentType,
                fileUrl: docData.fileUrl,
            },
        });
    }
    async addContract(employeeId, contractData) {
        await this.findOne(employeeId);
        return this.prisma.contract.create({
            data: {
                employeeId,
                contractNumber: contractData.contractNumber,
                contractType: contractData.contractType,
                startDate: new Date(contractData.startDate),
                endDate: contractData.endDate ? new Date(contractData.endDate) : null,
                salary: parseFloat(contractData.salary),
                status: contractData.status || 'ACTIVE',
                documentUrl: contractData.documentUrl,
            },
        });
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map