import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IpValidatorUtil } from '../utils/ip-validator.util';

@Injectable()
export class IpNetworkGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const clientIp = IpValidatorUtil.extractClientIp(req);

    // Check if network restriction setting is enabled
    const enforceSetting = await this.prisma.companySetting.findUnique({
      where: { key: 'ENFORCE_NETWORK_RESTRICTION' },
    });

    if (enforceSetting && enforceSetting.value === 'false') {
      return true;
    }

    // Fetch active company CIDR networks
    const activeNetworks = await this.prisma.attendanceNetwork.findMany({
      where: { isActive: true },
    });

    const allowedCidrs = activeNetworks.map((net) => net.cidr);
    const isAllowed = IpValidatorUtil.isIpInCidrList(clientIp, allowedCidrs);

    if (!isAllowed) {
      throw new ForbiddenException({
        statusCode: 403,
        errorCode: 'WIFI_NETWORK_ACCESS_DENIED',
        message: `Chỉ truy cập được hệ thống khi kết nối mạng Wi-Fi nội bộ công ty. IP hiện tại (${clientIp}) không hợp lệ.`,
        clientIp,
      });
    }

    return true;
  }
}
