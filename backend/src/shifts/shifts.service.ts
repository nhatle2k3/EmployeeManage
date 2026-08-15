import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ShiftsService {
  constructor(private prisma: PrismaService) {}

  async findAllShifts() {
    return this.prisma.workShift.findMany({
      include: { _count: { select: { shiftAssignments: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findShift(id: string) {
    const shift = await this.prisma.workShift.findUnique({ where: { id } });
    if (!shift) throw new NotFoundException(`Shift ${id} not found`);
    return shift;
  }

  async createShift(data: {
    code: string;
    name: string;
    startTime: string;
    endTime: string;
    breakStartTime?: string;
    breakEndTime?: string;
    lateToleranceMins?: number;
    earlyLeaveToleranceMins?: number;
    isOvernight?: boolean;
  }) {
    return this.prisma.workShift.create({ data });
  }

  async updateShift(id: string, data: any) {
    await this.findShift(id);
    return this.prisma.workShift.update({ where: { id }, data });
  }

  async deleteShift(id: string) {
    await this.findShift(id);
    return this.prisma.workShift.delete({ where: { id } });
  }

  // Shift Assignments
  async assignShift(employeeId: string, shiftId: string, startDate: Date, endDate?: Date) {
    // Deactivate active shifts
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

  async getEmployeeCurrentShift(employeeId: string) {
    const assignment = await this.prisma.shiftAssignment.findFirst({
      where: { employeeId, isActive: true },
      include: { shift: true },
    });

    if (!assignment) {
      // Fallback to standard shift
      return this.prisma.workShift.findFirst({ where: { code: 'SHIFT_STD' } });
    }

    return assignment.shift;
  }
}
