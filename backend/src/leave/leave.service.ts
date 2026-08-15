import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatusWorkflow } from '@prisma/client';

@Injectable()
export class LeaveService {
  constructor(private prisma: PrismaService) {}

  // Leave Types
  async getLeaveTypes() {
    return this.prisma.leaveType.findMany({ orderBy: { code: 'asc' } });
  }

  async createLeaveType(data: { code: string; name: string; description?: string; maxDaysPerYear: number; isPaid: boolean }) {
    return this.prisma.leaveType.create({ data });
  }

  // Leave Balances
  async getMyBalances(employeeId: string, year = new Date().getFullYear()) {
    return this.prisma.leaveBalance.findMany({
      where: { employeeId, year },
      include: { leaveType: true },
    });
  }

  // Leave Requests Workflow
  async submitLeaveRequest(
    employeeId: string,
    data: { leaveTypeId: string; startDate: string; endDate: string; reason: string },
  ) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (end < start) {
      throw new BadRequestException('End date cannot be prior to start date');
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const year = start.getFullYear();
    const balance = await this.prisma.leaveBalance.findUnique({
      where: {
        employeeId_leaveTypeId_year: {
          employeeId,
          leaveTypeId: data.leaveTypeId,
          year,
        },
      },
    });

    if (balance && balance.remainingDays < totalDays) {
      throw new BadRequestException(`Insufficient leave balance. Requested: ${totalDays} days, Remaining: ${balance.remainingDays} days`);
    }

    // Create Leave Request
    const request = await this.prisma.leaveRequest.create({
      data: {
        employeeId,
        leaveTypeId: data.leaveTypeId,
        startDate: start,
        endDate: end,
        totalDays,
        reason: data.reason,
        status: StatusWorkflow.PENDING,
      },
      include: { leaveType: true, employee: true },
    });

    // Update pending days in balance
    if (balance) {
      await this.prisma.leaveBalance.update({
        where: { id: balance.id },
        data: { pendingDays: balance.pendingDays + totalDays },
      });
    }

    return request;
  }

  async findAllRequests(employeeId?: string, status?: StatusWorkflow) {
    const where: any = {};
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;

    return this.prisma.leaveRequest.findMany({
      where,
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeCode: true, department: true } },
        leaveType: true,
        approvedByUser: { select: { id: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async processRequest(
    userId: string,
    requestId: string,
    action: 'APPROVE' | 'REJECT',
    comment?: string,
  ) {
    const request = await this.prisma.leaveRequest.findUnique({
      where: { id: requestId },
      include: { leaveType: true },
    });

    if (!request) throw new NotFoundException('Leave request not found');
    if (request.status !== StatusWorkflow.PENDING) {
      throw new BadRequestException('Request is already processed');
    }

    const year = request.startDate.getFullYear();
    const balance = await this.prisma.leaveBalance.findUnique({
      where: {
        employeeId_leaveTypeId_year: {
          employeeId: request.employeeId,
          leaveTypeId: request.leaveTypeId,
          year,
        },
      },
    });

    const newStatus = action === 'APPROVE' ? StatusWorkflow.APPROVED : StatusWorkflow.REJECTED;

    // Update balance
    if (balance) {
      if (action === 'APPROVE') {
        await this.prisma.leaveBalance.update({
          where: { id: balance.id },
          data: {
            pendingDays: Math.max(0, balance.pendingDays - request.totalDays),
            usedDays: balance.usedDays + request.totalDays,
            remainingDays: Math.max(0, balance.remainingDays - request.totalDays),
          },
        });
      } else {
        await this.prisma.leaveBalance.update({
          where: { id: balance.id },
          data: {
            pendingDays: Math.max(0, balance.pendingDays - request.totalDays),
          },
        });
      }
    }

    return this.prisma.leaveRequest.update({
      where: { id: requestId },
      data: {
        status: newStatus,
        approvedByUserId: userId,
        approvalComment: comment,
      },
      include: { leaveType: true, employee: true },
    });
  }
}
