import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
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
}
