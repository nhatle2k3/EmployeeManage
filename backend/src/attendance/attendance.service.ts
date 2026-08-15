import { Injectable, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IpValidatorUtil } from '../common/utils/ip-validator.util';
import { AttendanceStatus, AttendanceMethod, StatusWorkflow } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  /**
   * Validate if client IP is within an approved company CIDR network
   */
  async validateNetworkIp(req: any): Promise<{ clientIp: string; networkName: string; isAllowed: boolean }> {
    const clientIp = IpValidatorUtil.extractClientIp(req);

    // Fetch active company CIDR networks
    const activeNetworks = await this.prisma.attendanceNetwork.findMany({
      where: { isActive: true },
    });

    const allowedCidrs = activeNetworks.map((net) => net.cidr);
    const isAllowed = IpValidatorUtil.isIpInCidrList(clientIp, allowedCidrs);

    let networkName = 'Unknown External Network';
    if (isAllowed) {
      const matchedNet = activeNetworks.find((net) =>
        IpValidatorUtil.isIpInCidrList(clientIp, [net.cidr]),
      );
      if (matchedNet) {
        networkName = matchedNet.name;
      }
    }

    return { clientIp, networkName, isAllowed };
  }

  async checkIn(employeeId: string, req: any, body?: { deviceId?: string; deviceName?: string; remarks?: string }) {
    if (!employeeId) {
      throw new BadRequestException('Employee record not linked to user account');
    }

    const { clientIp, networkName, isAllowed } = await this.validateNetworkIp(req);

    // Enforce Network Restriction
    if (!isAllowed) {
      throw new ForbiddenException({
        statusCode: 403,
        errorCode: 'ATTENDANCE_NETWORK_NOT_ALLOWED',
        message: `Attendance rejected: IP address ${clientIp} is outside approved company networks.`,
        clientIp,
      });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const todayDate = new Date(todayStr);

    // Check if employee already checked in today
    const existingRecord = await this.prisma.attendanceRecord.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: todayDate,
        },
      },
    });

    if (existingRecord && existingRecord.checkInTime) {
      throw new BadRequestException('Already checked in for today');
    }

    // Get active shift
    const shiftAssignment = await this.prisma.shiftAssignment.findFirst({
      where: { employeeId, isActive: true },
      include: { shift: true },
    });
    const shift = shiftAssignment?.shift || (await this.prisma.workShift.findFirst());

    const now = new Date();

    // Determine status (LATE or PRESENT)
    let status: AttendanceStatus = AttendanceStatus.PRESENT;
    if (shift) {
      const [startHour, startMin] = shift.startTime.split(':').map(Number);
      const shiftStartTime = new Date(now);
      shiftStartTime.setHours(startHour, startMin + shift.lateToleranceMins, 0, 0);

      if (now > shiftStartTime) {
        status = AttendanceStatus.LATE;
      }
    }

    if (existingRecord) {
      return this.prisma.attendanceRecord.update({
        where: { id: existingRecord.id },
        data: {
          checkInTime: now,
          ipAddress: clientIp,
          networkName,
          deviceId: body?.deviceId,
          deviceName: body?.deviceName,
          status,
          remarks: body?.remarks,
        },
      });
    }

    return this.prisma.attendanceRecord.create({
      data: {
        employeeId,
        date: todayDate,
        checkInTime: now,
        ipAddress: clientIp,
        networkName,
        deviceId: body?.deviceId,
        deviceName: body?.deviceName,
        method: AttendanceMethod.WEB,
        status,
        remarks: body?.remarks,
      },
    });
  }

  async checkOut(employeeId: string, req: any, body?: { deviceId?: string; deviceName?: string; remarks?: string }) {
    if (!employeeId) {
      throw new BadRequestException('Employee record not linked');
    }

    const { clientIp, isAllowed } = await this.validateNetworkIp(req);

    if (!isAllowed) {
      throw new ForbiddenException({
        statusCode: 403,
        errorCode: 'ATTENDANCE_NETWORK_NOT_ALLOWED',
        message: `Attendance check-out rejected: IP address ${clientIp} is outside approved company networks.`,
        clientIp,
      });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const todayDate = new Date(todayStr);

    const record = await this.prisma.attendanceRecord.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: todayDate,
        },
      },
    });

    if (!record || !record.checkInTime) {
      throw new BadRequestException('Must check in before checking out');
    }

    if (record.checkOutTime) {
      throw new BadRequestException('Already checked out for today');
    }

    const now = new Date();

    // Calculate working hours
    const diffMs = now.getTime() - new Date(record.checkInTime).getTime();
    const workingHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));

    // Get shift to check early leave or overtime
    const shiftAssignment = await this.prisma.shiftAssignment.findFirst({
      where: { employeeId, isActive: true },
      include: { shift: true },
    });
    const shift = shiftAssignment?.shift || (await this.prisma.workShift.findFirst());

    let finalStatus = record.status;
    let overtimeHours = 0;

    if (shift) {
      const [endHour, endMin] = shift.endTime.split(':').map(Number);
      const shiftEndTime = new Date(now);
      shiftEndTime.setHours(endHour, endMin - shift.earlyLeaveToleranceMins, 0, 0);

      const exactShiftEndTime = new Date(now);
      exactShiftEndTime.setHours(endHour, endMin, 0, 0);

      if (now < shiftEndTime) {
        finalStatus = record.status === AttendanceStatus.LATE
          ? AttendanceStatus.LATE_AND_EARLY_LEAVE
          : AttendanceStatus.EARLY_LEAVE;
      } else if (now > exactShiftEndTime) {
        const otMs = now.getTime() - exactShiftEndTime.getTime();
        overtimeHours = parseFloat((otMs / (1000 * 60 * 60)).toFixed(2));
      }
    }

    return this.prisma.attendanceRecord.update({
      where: { id: record.id },
      data: {
        checkOutTime: now,
        workingHours,
        overtimeHours,
        status: finalStatus,
        remarks: body?.remarks ? `${record.remarks || ''} | ${body.remarks}` : record.remarks,
      },
    });
  }

  async getMyTodayStatus(employeeId: string, req: any) {
    const networkCheck = await this.validateNetworkIp(req);
    const todayStr = new Date().toISOString().split('T')[0];

    const record = await this.prisma.attendanceRecord.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: new Date(todayStr),
        },
      },
    });

    const shiftAssignment = await this.prisma.shiftAssignment.findFirst({
      where: { employeeId, isActive: true },
      include: { shift: true },
    });

    return {
      networkCheck,
      record,
      currentShift: shiftAssignment?.shift || null,
      currentTime: new Date().toISOString(),
    };
  }

  async getAttendanceHistory(employeeId?: string, startDate?: string, endDate?: string, status?: string) {
    const where: any = {};
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    return this.prisma.attendanceRecord.findMany({
      where,
      include: {
        employee: {
          select: { id: true, firstName: true, lastName: true, employeeCode: true, department: true },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  // HR Adjustments
  async createAdjustment(
    userId: string,
    attendanceId: string,
    data: { adjustedCheckIn?: string; adjustedCheckOut?: string; reason: string },
  ) {
    const record = await this.prisma.attendanceRecord.findUnique({ where: { id: attendanceId } });
    if (!record) throw new NotFoundException('Attendance record not found');

    const adjCheckIn = data.adjustedCheckIn ? new Date(data.adjustedCheckIn) : record.checkInTime;
    const adjCheckOut = data.adjustedCheckOut ? new Date(data.adjustedCheckOut) : record.checkOutTime;

    let workingHours = record.workingHours;
    if (adjCheckIn && adjCheckOut) {
      const diffMs = new Date(adjCheckOut).getTime() - new Date(adjCheckIn).getTime();
      workingHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
    }

    // Update Attendance record
    await this.prisma.attendanceRecord.update({
      where: { id: attendanceId },
      data: {
        checkInTime: adjCheckIn,
        checkOutTime: adjCheckOut,
        workingHours,
        remarks: `Adjusted by HR: ${data.reason}`,
      },
    });

    // Save adjustment history log
    return this.prisma.attendanceAdjustment.create({
      data: {
        attendanceId,
        employeeId: record.employeeId,
        adjustedByUserId: userId,
        originalCheckIn: record.checkInTime,
        originalCheckOut: record.checkOutTime,
        adjustedCheckIn: adjCheckIn,
        adjustedCheckOut: adjCheckOut,
        reason: data.reason,
        status: StatusWorkflow.APPROVED,
        auditNote: `Manual adjustment recorded at ${new Date().toISOString()}`,
      },
    });
  }
}
