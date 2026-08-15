import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatusWorkflow } from '@prisma/client';
import { EventsService } from '../events/events.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OvertimeService {
  constructor(
    private prisma: PrismaService,
    private eventsService: EventsService,
    private notificationsService: NotificationsService,
  ) {}

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

    const record = await this.prisma.overtimeRecord.create({
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
      include: { employee: true },
    });

    // Emit real-time event
    this.eventsService.emit('OVERTIME_REQUEST', { record });

    // Notify Managers & HR
    try {
      const adminUsers = await this.prisma.user.findMany({
        where: { role: { name: { in: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER'] } } },
      });
      for (const admin of adminUsers) {
        await this.notificationsService.create({
          userId: admin.id,
          title: 'Đề xuất tăng ca mới',
          message: `Nhân viên ${record.employee?.firstName} ${record.employee?.lastName} đã đăng ký tăng ca ${record.hours} giờ.`,
          type: 'OVERTIME_REQUEST',
          linkUrl: '/overtime',
        });
      }
    } catch (e) {
      // ignore
    }

    return record;
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
    const ot = await this.prisma.overtimeRecord.findUnique({
      where: { id },
      include: { employee: { include: { user: true } } },
    });
    if (!ot) throw new NotFoundException('Overtime record not found');
    if (ot.status !== StatusWorkflow.PENDING) {
      throw new BadRequestException('Request already processed');
    }

    const updated = await this.prisma.overtimeRecord.update({
      where: { id },
      data: {
        status: action === 'APPROVE' ? StatusWorkflow.APPROVED : StatusWorkflow.REJECTED,
        approvedByUserId: userId,
      },
      include: { employee: true },
    });

    // Emit real-time event
    this.eventsService.emit('OVERTIME_PROCESSED', { record: updated });

    // Notify employee user
    if (ot.employee?.user?.id) {
      try {
        const actionStr = action === 'APPROVE' ? 'ĐÃ ĐƯỢC DUYỆT' : 'ĐÃ BỊ TỪ CHỐI';
        await this.notificationsService.create({
          userId: ot.employee.user.id,
          title: `Đơn đăng ký tăng ca ${actionStr}`,
          message: `Yêu cầu tăng ca ${ot.hours} giờ ngày ${new Date(ot.date).toISOString().split('T')[0]} của bạn ${actionStr.toLowerCase()}.`,
          type: 'OVERTIME_PROCESSED',
          linkUrl: '/overtime',
        });
      } catch (e) {
        // ignore
      }
    }

    return updated;
  }
}
