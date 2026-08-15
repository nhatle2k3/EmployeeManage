import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async findAll(action?: string, entity?: string) {
    const where: any = {};
    if (action) where.action = action;
    if (entity) where.entity = entity;

    return this.prisma.auditLog.findMany({
      where,
      include: {
        user: { select: { id: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async logAction(data: {
    userId?: string;
    userEmail?: string;
    action: string;
    entity: string;
    entityId?: string;
    details?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    // Ensure no passwords or secrets are recorded
    let sanitizedDetails = data.details;
    if (sanitizedDetails && typeof sanitizedDetails === 'string') {
      sanitizedDetails = sanitizedDetails.replace(/("password"|"secret"|"refreshToken")\s*:\s*"[^"]+"/gi, '$1: "***"');
    }

    return this.prisma.auditLog.create({
      data: {
        userId: data.userId,
        userEmail: data.userEmail,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        details: sanitizedDetails,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  }
}
