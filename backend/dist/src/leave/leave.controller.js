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
exports.LeaveController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const leave_service_1 = require("./leave.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let LeaveController = class LeaveController {
    constructor(leaveService) {
        this.leaveService = leaveService;
    }
    getLeaveTypes() {
        return this.leaveService.getLeaveTypes();
    }
    createLeaveType(data) {
        return this.leaveService.createLeaveType(data);
    }
    getMyBalances(employeeId, year) {
        return this.leaveService.getMyBalances(employeeId, year ? Number(year) : undefined);
    }
    submitRequest(employeeId, data) {
        return this.leaveService.submitLeaveRequest(employeeId, data);
    }
    findAllRequests(user, employeeId, status) {
        const filterEmployeeId = user.role === client_1.RoleEnum.EMPLOYEE ? user.employeeId : employeeId;
        return this.leaveService.findAllRequests(filterEmployeeId, status);
    }
    processRequest(userId, requestId, body) {
        return this.leaveService.processRequest(userId, requestId, body.action, body.comment);
    }
};
exports.LeaveController = LeaveController;
__decorate([
    (0, common_1.Get)('types'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all configured leave types' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "getLeaveTypes", null);
__decorate([
    (0, common_1.Post)('types'),
    (0, roles_decorator_1.Roles)(client_1.RoleEnum.SUPER_ADMIN, client_1.RoleEnum.HR_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create leave type' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "createLeaveType", null);
__decorate([
    (0, common_1.Get)('my-balances'),
    (0, swagger_1.ApiOperation)({ summary: 'Get leave balances for current employee' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('employeeId')),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "getMyBalances", null);
__decorate([
    (0, common_1.Post)('requests'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit leave request' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('employeeId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "submitRequest", null);
__decorate([
    (0, common_1.Get)('requests'),
    (0, swagger_1.ApiOperation)({ summary: 'List leave requests' }),
    (0, swagger_1.ApiQuery)({ name: 'employeeId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('employeeId')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "findAllRequests", null);
__decorate([
    (0, common_1.Patch)('requests/:id/process'),
    (0, roles_decorator_1.Roles)(client_1.RoleEnum.SUPER_ADMIN, client_1.RoleEnum.HR_ADMIN, client_1.RoleEnum.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Approve or Reject leave request' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "processRequest", null);
exports.LeaveController = LeaveController = __decorate([
    (0, swagger_1.ApiTags)('Leave Management'),
    (0, common_1.Controller)('leave'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [leave_service_1.LeaveService])
], LeaveController);
//# sourceMappingURL=leave.controller.js.map