export declare class IpValidatorUtil {
    static extractClientIp(req: any): string;
    private static cleanIp;
    static isIpInCidrList(clientIp: string, allowedCidrs: string[]): boolean;
}
