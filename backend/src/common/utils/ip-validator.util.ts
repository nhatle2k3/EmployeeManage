import * as ipaddr from 'ipaddr.js';

export class IpValidatorUtil {
  /**
   * Extract real client IP address from HTTP request object.
   * Handles reverse proxies (X-Forwarded-For, X-Real-IP) and normal request IP.
   */
  static extractClientIp(req: any): string {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
      const ips = (typeof xForwardedFor === 'string' ? xForwardedFor : xForwardedFor[0])
        .split(',')
        .map((ip) => ip.trim());
      if (ips.length > 0 && ips[0]) {
        return this.cleanIp(ips[0]);
      }
    }

    const xRealIp = req.headers['x-real-ip'];
    if (xRealIp) {
      return this.cleanIp(typeof xRealIp === 'string' ? xRealIp : xRealIp[0]);
    }

    const remoteAddr = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress;
    return this.cleanIp(remoteAddr || '127.0.0.1');
  }

  private static cleanIp(ip: string): string {
    if (!ip) return '127.0.0.1';
    // Clean IPv6 mapped IPv4 like ::ffff:192.168.10.5
    if (ip.startsWith('::ffff:')) {
      return ip.substring(7);
    }
    return ip;
  }

  /**
   * Check if a given client IP matches any of the approved CIDR ranges.
   * e.g., clientIp: "192.168.10.45", allowedCidrs: ["192.168.10.0/24", "127.0.0.1/32"]
   */
  static isIpInCidrList(clientIp: string, allowedCidrs: string[]): boolean {
    if (!clientIp || allowedCidrs.length === 0) {
      return false;
    }

    let parsedClientIp: ipaddr.IPv4 | ipaddr.IPv6;
    try {
      parsedClientIp = ipaddr.parse(clientIp);
    } catch (e) {
      return false;
    }

    for (const cidrStr of allowedCidrs) {
      try {
        const parsedCidr = ipaddr.parseCIDR(cidrStr.trim());
        // Check matching IP kind (IPv4 vs IPv6)
        if (parsedClientIp.kind() === parsedCidr[0].kind()) {
          if (parsedClientIp.match(parsedCidr)) {
            return true;
          }
        }
      } catch (err) {
        // Skip invalid CIDRs in db config
        continue;
      }
    }

    return false;
  }
}
