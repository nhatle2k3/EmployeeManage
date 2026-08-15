import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DeviceStatus } from '@prisma/client';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.registeredDevice.findMany({
      include: {
        employee: {
          select: { id: true, firstName: true, lastName: true, employeeCode: true, department: true },
        },
      },
      orderBy: { registeredAt: 'desc' },
    });
  }

  async findByEmployee(employeeId: string) {
    return this.prisma.registeredDevice.findMany({
      where: { employeeId },
      orderBy: { registeredAt: 'desc' },
    });
  }

  async registerDevice(employeeId: string, data: { deviceFingerprint: string; deviceName: string; os?: string; browser?: string }) {
    const existing = await this.prisma.registeredDevice.findUnique({
      where: {
        employeeId_deviceFingerprint: {
          employeeId,
          deviceFingerprint: data.deviceFingerprint,
        },
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.registeredDevice.create({
      data: {
        employeeId,
        deviceFingerprint: data.deviceFingerprint,
        deviceName: data.deviceName,
        os: data.os,
        browser: data.browser,
        status: DeviceStatus.PENDING,
      },
    });
  }

  async updateStatus(id: string, status: DeviceStatus) {
    const dev = await this.prisma.registeredDevice.findUnique({ where: { id } });
    if (!dev) throw new NotFoundException('Device not found');
    return this.prisma.registeredDevice.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string) {
    return this.prisma.registeredDevice.delete({ where: { id } });
  }
}
