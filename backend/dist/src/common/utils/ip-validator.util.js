"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpValidatorUtil = void 0;
const ipaddr = require("ipaddr.js");
class IpValidatorUtil {
    static extractClientIp(req) {
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
    static cleanIp(ip) {
        if (!ip)
            return '127.0.0.1';
        if (ip.startsWith('::ffff:')) {
            return ip.substring(7);
        }
        return ip;
    }
    static isIpInCidrList(clientIp, allowedCidrs) {
        if (!clientIp || allowedCidrs.length === 0) {
            return false;
        }
        let parsedClientIp;
        try {
            parsedClientIp = ipaddr.parse(clientIp);
        }
        catch (e) {
            return false;
        }
        for (const cidrStr of allowedCidrs) {
            try {
                const parsedCidr = ipaddr.parseCIDR(cidrStr.trim());
                if (parsedClientIp.kind() === parsedCidr[0].kind()) {
                    if (parsedClientIp.match(parsedCidr)) {
                        return true;
                    }
                }
            }
            catch (err) {
                continue;
            }
        }
        return false;
    }
}
exports.IpValidatorUtil = IpValidatorUtil;
//# sourceMappingURL=ip-validator.util.js.map