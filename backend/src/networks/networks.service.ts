import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NetworksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.attendanceNetwork.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const net = await this.prisma.attendanceNetwork.findUnique({ where: { id } });
    if (!net) throw new NotFoundException(`Network ${id} not found`);
    return net;
  }

  async create(data: { name: string; cidr: string; location: string; description?: string; isActive?: boolean }) {
    const existing = await this.prisma.attendanceNetwork.findUnique({ where: { cidr: data.cidr } });
    if (existing) throw new BadRequestException(`CIDR subnet ${data.cidr} is already registered`);
    return this.prisma.attendanceNetwork.create({ data });
  }

  async update(id: string, data: { name?: string; cidr?: string; location?: string; description?: string; isActive?: boolean }) {
    await this.findOne(id);
    return this.prisma.attendanceNetwork.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.attendanceNetwork.delete({ where: { id } });
  }
}
