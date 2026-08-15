import { PrismaService } from '../prisma/prisma.service';
import { EventsService } from '../events/events.service';
export declare class NotificationsService {
    private prisma;
    private eventsService;
    constructor(prisma: PrismaService, eventsService: EventsService);
    findMyNotifications(userId: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        type: string;
        userId: string;
        message: string;
        isRead: boolean;
        linkUrl: string | null;
    }[]>;
    markAsRead(id: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    create(data: {
        userId: string;
        title: string;
        message: string;
        type: string;
        linkUrl?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        type: string;
        userId: string;
        message: string;
        isRead: boolean;
        linkUrl: string | null;
    }>;
}
