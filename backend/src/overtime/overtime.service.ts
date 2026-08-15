import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatusWorkflow } from '@prisma/client';

@Injectable()
export class OvertimeService {
  constructor(private prisma: PrismaService) {}

  async submitRequest(
    employeeId: string,
    data: { date: string; startTime: string; endTime: string; hours: number; reason: string },
  ) {
    const otDate = new Date(data.date);
    const dayOfWeek = otDate.getDay(); // 0 is Sunday, 6 is Saturday
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
        status: StatusWorkflow.PENDING,
      },
    });
  }

  async findAll(employeeId?: string, status?: StatusWorkflow) {
    const where: any = {};
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;

    return this.prisma.overtimeRecord.findMany({
      where,
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeCode: true, department: true } },
        approvedByUser: { select: { id: true, email: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  async processRequest(userId: string, id: string, action: 'APPROVE' | 'REJECT') {
    const ot = await this.prisma.overtimeRecord.findUnique({ where: { id } });
    if (!ot) throw new NotFoundException('Overtime record not found');
    if (ot.status !== StatusWorkflow.PENDING) {
      throw new BadRequestException('Request already processed');
    }

    return this.prisma.overtimeRecord.update({
      where: { id },
      data: {
        status: action === 'APPROVE' ? StatusWorkflow.APPROVED : StatusWorkflow.REJECTED,
        approvedByUserId: userId,
      },
      include: { employee: true },
    });
  }
}
