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
exports.ShiftsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shifts_service_1 = require("./shifts.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let ShiftsController = class ShiftsController {
    constructor(shiftsService) {
        this.shiftsService = shiftsService;
    }
    findAllShifts() {
        return this.shiftsService.findAllShifts();
    }
    getMyShift(employeeId) {
        return this.shiftsService.getEmployeeCurrentShift(employeeId);
    }
    createShift(data) {
        return this.shiftsService.createShift(data);
    }
    updateShift(id, data) {
        return this.shiftsService.updateShift(id, data);
    }
    deleteShift(id) {
        return this.shiftsService.deleteShift(id);
    }
    assignShift(body) {
        return this.shiftsService.assignShift(body.employeeId, body.shiftId, body.startDate, body.endDate);
    }
};
exports.ShiftsController = ShiftsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all work shifts' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "findAllShifts", null);
__decorate([
    (0, common_1.Get)('my-shift'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current employee active shift' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "getMyShift", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.RoleEnum.SUPER_ADMIN, client_1.RoleEnum.HR_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create new shift configuration' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "createShift", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.RoleEnum.SUPER_ADMIN, client_1.RoleEnum.HR_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update shift' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "updateShift", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.RoleEnum.SUPER_ADMIN, client_1.RoleEnum.HR_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete shift' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "deleteShift", null);
__decorate([
    (0, common_1.Post)('assign'),
    (0, roles_decorator_1.Roles)(client_1.RoleEnum.SUPER_ADMIN, client_1.RoleEnum.HR_ADMIN, client_1.RoleEnum.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Assign shift to employee' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "assignShift", null);
exports.ShiftsController = ShiftsController = __decorate([
    (0, swagger_1.ApiTags)('Work Shifts & Schedules'),
    (0, common_1.Controller)('shifts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [shifts_service_1.ShiftsService])
], ShiftsController);
//# sourceMappingURL=shifts.controller.js.map