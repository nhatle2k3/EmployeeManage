import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

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
    // Return root level departments with nested children
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

  async findOne(id: string) {
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
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return dept;
  }

  async create(data: { code: string; name: string; description?: string; parentId?: string; managerId?: string }) {
    const existing = await this.prisma.department.findUnique({
      where: { code: data.code },
    });
    if (existing) {
      throw new BadRequestException('Department code already exists');
    }

    return this.prisma.department.create({
      data,
      include: { parent: true, manager: true },
    });
  }

  async update(id: string, data: { name?: string; description?: string; parentId?: string; managerId?: string }) {
    await this.findOne(id);
    return this.prisma.department.update({
      where: { id },
      data,
      include: { parent: true, manager: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.department.delete({ where: { id } });
  }
}
