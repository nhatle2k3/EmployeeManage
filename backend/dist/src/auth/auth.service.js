"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email },
            include: {
                role: true,
                employee: {
                    include: {
                        department: true,
                        position: true,
                    },
                },
            },
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Invalid credentials or inactive account');
        }
        const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const tokens = await this.generateTokens(user.id, user.email, user.role.name, user.employeeId);
        const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: refreshTokenHash },
        });
        await this.prisma.auditLog.create({
            data: {
                userId: user.id,
                userEmail: user.email,
                action: 'LOGIN',
                entity: 'User',
                entityId: user.id,
                details: `User ${user.email} logged in successfully`,
            },
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role.name,
                employeeId: user.employeeId,
                employee: user.employee,
            },
            tokens,
        };
    }
    async refreshToken(refreshTokenDto) {
        try {
            const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key-hrms-2026',
            });
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                include: { role: true },
            });
            if (!user || !user.refreshToken) {
                throw new common_1.UnauthorizedException('Access Denied');
            }
            const isMatch = await bcrypt.compare(refreshTokenDto.refreshToken, user.refreshToken);
            if (!isMatch) {
                throw new common_1.UnauthorizedException('Access Denied');
            }
            const tokens = await this.generateTokens(user.id, user.email, user.role.name, user.employeeId);
            const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
            await this.prisma.user.update({
                where: { id: user.id },
                data: { refreshToken: refreshTokenHash },
            });
            return tokens;
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async logout(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
        return { message: 'Logged out successfully' };
    }
    async generateTokens(userId, email, role, employeeId) {
        const payload = { sub: userId, email, role, employeeId };
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET || 'super-secret-jwt-key-hrms-2026',
            expiresIn: process.env.JWT_EXPIRATION || '1d',
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key-hrms-2026',
            expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
        });
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map