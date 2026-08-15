"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const employees_module_1 = require("./employees/employees.module");
const departments_module_1 = require("./departments/departments.module");
const positions_module_1 = require("./positions/positions.module");
const networks_module_1 = require("./networks/networks.module");
const devices_module_1 = require("./devices/devices.module");
const shifts_module_1 = require("./shifts/shifts.module");
const attendance_module_1 = require("./attendance/attendance.module");
const leave_module_1 = require("./leave/leave.module");
const overtime_module_1 = require("./overtime/overtime.module");
const payroll_module_1 = require("./payroll/payroll.module");
const reports_module_1 = require("./reports/reports.module");
const notifications_module_1 = require("./notifications/notifications.module");
const audit_module_1 = require("./audit/audit.module");
const core_1 = require("@nestjs/core");
const ip_network_guard_1 = require("./common/guards/ip-network.guard");
const events_module_1 = require("./events/events.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            events_module_1.EventsModule,
            audit_module_1.AuditModule,
            auth_module_1.AuthModule,
            employees_module_1.EmployeesModule,
            departments_module_1.DepartmentsModule,
            positions_module_1.PositionsModule,
            networks_module_1.NetworksModule,
            devices_module_1.DevicesModule,
            shifts_module_1.ShiftsModule,
            attendance_module_1.AttendanceModule,
            leave_module_1.LeaveModule,
            overtime_module_1.OvertimeModule,
            payroll_module_1.PayrollModule,
            reports_module_1.ReportsModule,
            notifications_module_1.NotificationsModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: ip_network_guard_1.IpNetworkGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map