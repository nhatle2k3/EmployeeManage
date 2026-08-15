import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './employees/employees.module';
import { DepartmentsModule } from './departments/departments.module';
import { PositionsModule } from './positions/positions.module';
import { NetworksModule } from './networks/networks.module';
import { DevicesModule } from './devices/devices.module';
import { ShiftsModule } from './shifts/shifts.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LeaveModule } from './leave/leave.module';
import { OvertimeModule } from './overtime/overtime.module';
import { PayrollModule } from './payroll/payroll.module';
import { ReportsModule } from './reports/reports.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditModule } from './audit/audit.module';

import { APP_GUARD } from '@nestjs/core';
import { IpNetworkGuard } from './common/guards/ip-network.guard';

import { EventsModule } from './events/events.module';

@Module({
  imports: [
    PrismaModule,
    EventsModule,
    AuditModule,
    AuthModule,
    EmployeesModule,
    DepartmentsModule,
    PositionsModule,
    NetworksModule,
    DevicesModule,
    ShiftsModule,
    AttendanceModule,
    LeaveModule,
    OvertimeModule,
    PayrollModule,
    ReportsModule,
    NotificationsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: IpNetworkGuard,
    },
  ],
})
export class AppModule {}
