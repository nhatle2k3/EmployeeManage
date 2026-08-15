import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsService } from '../events/events.service';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private eventsService: EventsService,
  ) {}

  async findMyNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async create(data: { userId: string; title: string; message: string; type: string; linkUrl?: string }) {
    const notif = await this.prisma.notification.create({ data });
    this.eventsService.emit('NOTIFICATION', notif);
    return notif;
  }
}
