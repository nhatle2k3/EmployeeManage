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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OvertimeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const overtime_service_1 = require("./overtime.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let OvertimeController = class OvertimeController {
    constructor(overtimeService) {
        this.overtimeService = overtimeService;
    }
    submitRequest(employeeId, data) {
        return this.overtimeService.submitRequest(employeeId, data);
    }
    findAll(user, employeeId, status) {
        const filterEmployeeId = user.role === client_1.RoleEnum.EMPLOYEE ? user.employeeId : employeeId;
        return this.overtimeService.findAll(filterEmployeeId, status);
    }
    processRequest(userId, id, action) {
        return this.overtimeService.processRequest(userId, id, action);
    }
};
exports.OvertimeController = OvertimeController;
__decorate([
    (0, common_1.Post)('requests'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit overtime request' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('employeeId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OvertimeController.prototype, "submitRequest", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List overtime records' }),
    (0, swagger_1.ApiQuery)({ name: 'employeeId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('employeeId')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], OvertimeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id/process'),
    (0, roles_decorator_1.Roles)(client_1.RoleEnum.SUPER_ADMIN, client_1.RoleEnum.HR_ADMIN, client_1.RoleEnum.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Approve or Reject overtime request' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('action')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], OvertimeController.prototype, "processRequest", null);
exports.OvertimeController = OvertimeController = __decorate([
    (0, swagger_1.ApiTags)('Overtime Management'),
    (0, common_1.Controller)('overtime'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [overtime_service_1.OvertimeService])
], OvertimeController);
//# sourceMappingURL=overtime.controller.js.map