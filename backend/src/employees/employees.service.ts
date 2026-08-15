import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import * as bcrypt from 'bcryptjs';
import { RoleEnum } from '@prisma/client';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string, departmentId?: string, status?: string) {
    const where: any = {};

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

  async findOne(id: string) {
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
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async create(createDto: CreateEmployeeDto) {
    const existingCode = await this.prisma.employee.findUnique({
      where: { employeeCode: createDto.employeeCode },
    });
    if (existingCode) {
      throw new BadRequestException('Employee code already exists');
    }

    const existingEmail = await this.prisma.employee.findUnique({
      where: { email: createDto.email },
    });
    if (existingEmail) {
      throw new BadRequestException('Employee email already exists');
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

    // Automatically create User account with selected role (default EMPLOYEE)
    const targetRole = createDto.role || RoleEnum.EMPLOYEE;
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

    // Automatically allocate leave balances
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

  async update(id: string, updateDto: UpdateEmployeeDto) {
    await this.findOne(id);

    const dto = updateDto as Record<string, any>;
    const data: any = { ...dto };
    if (dto.dob) data.dob = new Date(dto.dob);
    if (dto.hireDate) data.hireDate = new Date(dto.hireDate);

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

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.employee.delete({ where: { id } });
  }

  // Documents management
  async addDocument(employeeId: string, docData: { title: string; documentType: string; fileUrl: string }) {
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

  // Contracts management
  async addContract(employeeId: string, contractData: any) {
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
}
