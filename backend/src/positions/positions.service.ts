import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PositionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.position.findMany({
      include: {
        department: true,
        _count: { select: { employees: true } },
      },
      orderBy: { title: 'asc' },
    });
  }

  async findOne(id: string) {
    const pos = await this.prisma.position.findUnique({
      where: { id },
      include: { department: true, employees: true },
    });
    if (!pos) throw new NotFoundException(`Position ${id} not found`);
    return pos;
  }

  async create(data: { code: string; title: string; description?: string; baseSalaryMin?: number; baseSalaryMax?: number; departmentId?: string }) {
    return this.prisma.position.create({ data });
  }

  async update(id: string, data: { title?: string; description?: string; baseSalaryMin?: number; baseSalaryMax?: number; departmentId?: string }) {
    await this.findOne(id);
    return this.prisma.position.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.position.delete({ where: { id } });
  }
}
