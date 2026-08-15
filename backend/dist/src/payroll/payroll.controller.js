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
exports.PayrollController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payroll_service_1 = require("./payroll.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let PayrollController = class PayrollController {
    constructor(payrollService) {
        this.payrollService = payrollService;
    }
    getTaxConfigs() {
        return this.payrollService.getTaxConfigs();
    }
    getInsuranceConfigs() {
        return this.payrollService.getInsuranceConfigs();
    }
    updateTaxConfig(id, data) {
        return this.payrollService.updateTaxConfig(id, data);
    }
    updateInsuranceConfig(id, data) {
        return this.payrollService.updateInsuranceConfig(id, data);
    }
    getSalaryStructure(employeeId) {
        return this.payrollService.getSalaryStructure(employeeId);
    }
    upsertSalaryStructure(employeeId, data) {
        return this.payrollService.upsertSalaryStructure(employeeId, data);
    }
    getPayrollPeriods() {
        return this.payrollService.getPayrollPeriods();
    }
    createPayrollPeriod(data) {
        return this.payrollService.createPayrollPeriod(data);
    }
    calculatePeriodPayroll(periodId) {
        return this.payrollService.calculatePeriodPayroll(periodId);
    }
    updatePeriodStatus(periodId, status) {
        return this.payrollService.updatePeriodStatus(periodId, status);
    }
    getPayrolls(user, periodId, employeeId) {
        const filterEmp = user.role === client_1.RoleEnum.EMPLOYEE ? user.employeeId : employeeId;
        return this.payrollService.getPayrolls(periodId, filterEmp);
    }
    getPayslip(id) {
        return this.payrollService.getPayslip(id);
    }
};
exports.PayrollController = PayrollController;
__decorate([
    (0, common_1.Get)('tax-config'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tax configuration brackets' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "getTaxConfigs", null);
__decorate([
    (0, common_1.Get)('insurance-config'),
    (0, swagger_1.ApiOperation)({ summary: 'Get insurance configuration rates' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "getInsuranceConfigs", null);
__decorate([
    (0, common_1.Patch)('tax-config/:id'),
    (0, roles_decorator_1.Roles)(client_1.RoleEnum.SUPER_ADMIN, client_1.RoleEnum.HR_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update tax bracket configuration' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "updateTaxConfig", null);
__decorate([
    (0, common_1.Patch)('insurance-config/:id'),
    (0, roles_decorator_1.Roles)(client_1.RoleEnum.SUPER_ADMIN, client_1.RoleEnum.HR_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update insurance rate configuration' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "updateInsuranceConfig", null);
__decorate([
    (0, common_1.Get)('structure/:employeeId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get employee salary structure' }),
    __param(0, (0, common_1.Param)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "getSalaryStructure", null);
__decorate([
    (0, common_1.Post)('structure/:employeeId'),
    (0, roles_decorator_1.Roles)(client_1.RoleEnum.SUPER_ADMIN, client_1.RoleEnum.HR_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Upsert employee salary structure' }),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "upsertSalaryStructure", null);
__decorate([
    (0, common_1.Get)('periods'),
    (0, swagger_1.ApiOperation)({ summary: 'List payroll periods' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "getPayrollPeriods", null);
__decorate([
    (0, common_1.Post)('periods'),
    (0, roles_decorator_1.Roles)(client_1.RoleEnum.SUPER_ADMIN, client_1.RoleEnum.HR_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create new payroll period' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "createPayrollPeriod", null);
__decorate([
    (0, common_1.Post)('periods/:id/calculate'),
    (0, roles_decorator_1.Roles)(client_1.RoleEnum.SUPER_ADMIN, client_1.RoleEnum.HR_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate payroll for all active employees for given period' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "calculatePeriodPayroll", null);
__decorate([
    (0, common_1.Patch)('periods/:id/status'),
    (0, roles_decorator_1.Roles)(client_1.RoleEnum.SUPER_ADMIN, client_1.RoleEnum.HR_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update payroll period status (REVIEW -> APPROVED -> PAID)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "updatePeriodStatus", null);
__decorate([
    (0, common_1.Get)('records'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payroll records' }),
    (0, swagger_1.ApiQuery)({ name: 'periodId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'employeeId', required: false }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('periodId')),
    __param(2, (0, common_1.Query)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "getPayrolls", null);
__decorate([
    (0, common_1.Get)('payslip/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed employee payslip' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "getPayslip", null);
exports.PayrollController = PayrollController = __decorate([
    (0, swagger_1.ApiTags)('Payroll System'),
    (0, common_1.Controller)('payroll'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [payroll_service_1.PayrollService])
], PayrollController);
//# sourceMappingURL=payroll.controller.js.map