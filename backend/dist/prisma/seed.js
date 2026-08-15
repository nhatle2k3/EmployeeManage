"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting HRMS database seeding...');
    await prisma.auditLog.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.payrollItem.deleteMany();
    await prisma.payroll.deleteMany();
    await prisma.payrollPeriod.deleteMany();
    await prisma.salaryComponent.deleteMany();
    await prisma.salaryStructure.deleteMany();
    await prisma.leaveRequest.deleteMany();
    await prisma.leaveBalance.deleteMany();
    await prisma.leaveType.deleteMany();
    await prisma.overtimeRecord.deleteMany();
    await prisma.attendanceAdjustment.deleteMany();
    await prisma.attendanceRecord.deleteMany();
    await prisma.workDay.deleteMany();
    await prisma.workSchedule.deleteMany();
    await prisma.shiftAssignment.deleteMany();
    await prisma.workShift.deleteMany();
    await prisma.contract.deleteMany();
    await prisma.employeeDocument.deleteMany();
    await prisma.employeeProfile.deleteMany();
    await prisma.registeredDevice.deleteMany();
    await prisma.user.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.position.deleteMany();
    await prisma.department.deleteMany();
    await prisma.rolePermission.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.role.deleteMany();
    await prisma.attendanceNetwork.deleteMany();
    await prisma.taxConfiguration.deleteMany();
    await prisma.insuranceConfiguration.deleteMany();
    await prisma.companySetting.deleteMany();
    const rolesMap = new Map();
    for (const roleName of [client_1.RoleEnum.SUPER_ADMIN, client_1.RoleEnum.HR_ADMIN, client_1.RoleEnum.MANAGER, client_1.RoleEnum.EMPLOYEE]) {
        const role = await prisma.role.create({
            data: {
                name: roleName,
                description: `Role for ${roleName.toLowerCase().replace('_', ' ')}`,
            },
        });
        rolesMap.set(roleName, role);
    }
    const permissionsData = [
        { code: 'employee:read', name: 'Read Employees', module: 'EMPLOYEES' },
        { code: 'employee:write', name: 'Manage Employees', module: 'EMPLOYEES' },
        { code: 'department:read', name: 'Read Departments', module: 'DEPARTMENTS' },
        { code: 'department:write', name: 'Manage Departments', module: 'DEPARTMENTS' },
        { code: 'attendance:read', name: 'Read Attendance', module: 'ATTENDANCE' },
        { code: 'attendance:write', name: 'Check-in/Out & Manage Attendance', module: 'ATTENDANCE' },
        { code: 'attendance:network_manage', name: 'Manage Trusted Networks', module: 'ATTENDANCE' },
        { code: 'leave:read', name: 'Read Leave Requests', module: 'LEAVE' },
        { code: 'leave:submit', name: 'Submit Leave Request', module: 'LEAVE' },
        { code: 'leave:approve', name: 'Approve Leave Requests', module: 'LEAVE' },
        { code: 'overtime:read', name: 'Read Overtime', module: 'OVERTIME' },
        { code: 'overtime:submit', name: 'Submit Overtime', module: 'OVERTIME' },
        { code: 'overtime:approve', name: 'Approve Overtime', module: 'OVERTIME' },
        { code: 'payroll:read', name: 'Read Payroll', module: 'PAYROLL' },
        { code: 'payroll:write', name: 'Calculate & Approve Payroll', module: 'PAYROLL' },
        { code: 'settings:write', name: 'Manage Company Settings', module: 'SETTINGS' },
    ];
    for (const perm of permissionsData) {
        const createdPerm = await prisma.permission.create({ data: perm });
        await prisma.rolePermission.create({
            data: {
                roleId: rolesMap.get(client_1.RoleEnum.SUPER_ADMIN).id,
                permissionId: createdPerm.id,
            },
        });
    }
    const deptExec = await prisma.department.create({
        data: { code: 'EXEC', name: 'Executive Board', description: 'Executive leadership' },
    });
    const deptHR = await prisma.department.create({
        data: { code: 'HR', name: 'Human Resources', description: 'HR and Talent Acquisition', parentId: deptExec.id },
    });
    const deptTech = await prisma.department.create({
        data: { code: 'TECH', name: 'Engineering & IT', description: 'Software Development and Systems', parentId: deptExec.id },
    });
    const deptFin = await prisma.department.create({
        data: { code: 'FIN', name: 'Finance & Accounting', description: 'Financial planning & payroll', parentId: deptExec.id },
    });
    const posCEO = await prisma.position.create({
        data: { code: 'CEO', title: 'Chief Executive Officer', baseSalaryMin: 8000, baseSalaryMax: 15000, departmentId: deptExec.id },
    });
    const posHRDir = await prisma.position.create({
        data: { code: 'HR_DIR', title: 'HR Director', baseSalaryMin: 3500, baseSalaryMax: 6000, departmentId: deptHR.id },
    });
    const posLeadDev = await prisma.position.create({
        data: { code: 'LEAD_DEV', title: 'Engineering Lead', baseSalaryMin: 3000, baseSalaryMax: 5500, departmentId: deptTech.id },
    });
    const posDev = await prisma.position.create({
        data: { code: 'DEV', title: 'Software Engineer', baseSalaryMin: 1500, baseSalaryMax: 3000, departmentId: deptTech.id },
    });
    const passwordHash = await bcrypt.hash('Password123!', 10);
    const empAdmin = await prisma.employee.create({
        data: {
            employeeCode: 'EMP001',
            firstName: 'Alexander',
            lastName: 'Pierce',
            email: 'admin@hrms.com',
            phone: '+84901234567',
            gender: 'Male',
            dob: new Date('1988-04-12'),
            address: '742 Evergreen Terrace, HCM City',
            nationalId: '001088123456',
            taxId: '8019283741',
            bankAccount: '190345678910',
            bankName: 'Techcombank',
            departmentId: deptExec.id,
            positionId: posCEO.id,
            hireDate: new Date('2020-01-15'),
            status: client_1.EmploymentStatus.ACTIVE,
            profile: {
                create: {
                    bio: 'System Administrator and Chief Executive',
                    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
                    emergencyContactName: 'Sarah Pierce',
                    emergencyContactPhone: '+84901234568',
                    maritalStatus: 'Married',
                    education: 'Master of Computer Science',
                },
            },
        },
    });
    const userAdmin = await prisma.user.create({
        data: {
            email: 'admin@hrms.com',
            passwordHash,
            roleId: rolesMap.get(client_1.RoleEnum.SUPER_ADMIN).id,
            employeeId: empAdmin.id,
            isActive: true,
        },
    });
    const empHR = await prisma.employee.create({
        data: {
            employeeCode: 'EMP002',
            firstName: 'Emma',
            lastName: 'Watson',
            email: 'hr@hrms.com',
            phone: '+84902345678',
            gender: 'Female',
            dob: new Date('1992-08-23'),
            address: '123 District 1, HCM City',
            nationalId: '001092234567',
            taxId: '8019283742',
            bankAccount: '190345678911',
            bankName: 'Vietcombank',
            departmentId: deptHR.id,
            positionId: posHRDir.id,
            hireDate: new Date('2021-03-01'),
            status: client_1.EmploymentStatus.ACTIVE,
            profile: {
                create: {
                    bio: 'HR Lead managing talent and payroll',
                    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
                    emergencyContactName: 'John Watson',
                    emergencyContactPhone: '+84902345679',
                    maritalStatus: 'Single',
                    education: 'Bachelor of Human Resource Management',
                },
            },
        },
    });
    await prisma.user.create({
        data: {
            email: 'hr@hrms.com',
            passwordHash,
            roleId: rolesMap.get(client_1.RoleEnum.HR_ADMIN).id,
            employeeId: empHR.id,
            isActive: true,
        },
    });
    const empManager = await prisma.employee.create({
        data: {
            employeeCode: 'EMP003',
            firstName: 'David',
            lastName: 'Miller',
            email: 'manager@hrms.com',
            phone: '+84903456789',
            gender: 'Male',
            dob: new Date('1990-11-05'),
            address: '456 District 3, HCM City',
            nationalId: '001090345678',
            taxId: '8019283743',
            bankAccount: '190345678912',
            bankName: 'MB Bank',
            departmentId: deptTech.id,
            positionId: posLeadDev.id,
            hireDate: new Date('2021-06-15'),
            status: client_1.EmploymentStatus.ACTIVE,
            profile: {
                create: {
                    bio: 'Tech Manager leading software engineering team',
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                    emergencyContactName: 'Claire Miller',
                    emergencyContactPhone: '+84903456790',
                    maritalStatus: 'Married',
                    education: 'Bachelor of Science in Software Engineering',
                },
            },
        },
    });
    await prisma.user.create({
        data: {
            email: 'manager@hrms.com',
            passwordHash,
            roleId: rolesMap.get(client_1.RoleEnum.MANAGER).id,
            employeeId: empManager.id,
            isActive: true,
        },
    });
    const empEmployee = await prisma.employee.create({
        data: {
            employeeCode: 'EMP004',
            firstName: 'Sophia',
            lastName: 'Nguyen',
            email: 'employee@hrms.com',
            phone: '+84904567890',
            gender: 'Female',
            dob: new Date('1995-02-18'),
            address: '789 Binh Thanh District, HCM City',
            nationalId: '001095456789',
            taxId: '8019283744',
            bankAccount: '190345678913',
            bankName: 'ACB Bank',
            departmentId: deptTech.id,
            positionId: posDev.id,
            managerId: empManager.id,
            hireDate: new Date('2022-09-01'),
            status: client_1.EmploymentStatus.ACTIVE,
            profile: {
                create: {
                    bio: 'Fullstack Developer specializing in React and NestJS',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                    emergencyContactName: 'Minh Nguyen',
                    emergencyContactPhone: '+84904567891',
                    maritalStatus: 'Single',
                    education: 'Bachelor of Computer Science',
                },
            },
        },
    });
    await prisma.user.create({
        data: {
            email: 'employee@hrms.com',
            passwordHash,
            roleId: rolesMap.get(client_1.RoleEnum.EMPLOYEE).id,
            employeeId: empEmployee.id,
            isActive: true,
        },
    });
    await prisma.department.update({
        where: { id: deptTech.id },
        data: { managerId: empManager.id },
    });
    await prisma.contract.create({
        data: {
            contractNumber: 'HD-2022-004',
            employeeId: empEmployee.id,
            contractType: client_1.ContractType.INDEFINITE,
            startDate: new Date('2022-09-01'),
            salary: 2500,
            status: 'ACTIVE',
        },
    });
    await prisma.contract.create({
        data: {
            contractNumber: 'HD-2021-003',
            employeeId: empManager.id,
            contractType: client_1.ContractType.INDEFINITE,
            startDate: new Date('2021-06-15'),
            salary: 4200,
            status: 'ACTIVE',
        },
    });
    const shiftStandard = await prisma.workShift.create({
        data: {
            code: 'SHIFT_STD',
            name: 'Standard Office Shift (8AM - 5PM)',
            startTime: '08:00',
            endTime: '17:00',
            breakStartTime: '12:00',
            breakEndTime: '13:00',
            lateToleranceMins: 15,
            earlyLeaveToleranceMins: 15,
        },
    });
    await prisma.workShift.create({
        data: {
            code: 'SHIFT_MORNING',
            name: 'Morning Shift (7AM - 3PM)',
            startTime: '07:00',
            endTime: '15:00',
            lateToleranceMins: 10,
            earlyLeaveToleranceMins: 10,
        },
    });
    for (const emp of [empAdmin, empHR, empManager, empEmployee]) {
        await prisma.shiftAssignment.create({
            data: {
                employeeId: emp.id,
                shiftId: shiftStandard.id,
                startDate: new Date('2026-01-01'),
                isActive: true,
            },
        });
    }
    await prisma.attendanceNetwork.createMany({
        data: [
            {
                name: 'Office HCM City (Main Wi-Fi)',
                cidr: '192.168.1.0/24',
                location: 'Ho Chi Minh City HQ',
                description: 'Main corporate Wi-Fi and ethernet subnet',
            },
            {
                name: 'Office LAN 192.168.x.x Subnet',
                cidr: '192.168.0.0/16',
                location: 'Corporate Internal LAN',
                description: 'Company internal LAN network range',
            },
            {
                name: 'Office Hanoi Branch',
                cidr: '192.168.20.0/24',
                location: 'Hanoi Branch Office',
                description: 'Hanoi branch network subnet',
            },
            {
                name: 'Localhost IPv4 (Testing)',
                cidr: '127.0.0.1/32',
                location: 'Local Workstation',
                description: 'Localhost loopback IPv4',
            },
            {
                name: 'Localhost IPv6 (Testing)',
                cidr: '::1/128',
                location: 'Local Workstation IPv6',
                description: 'Localhost loopback IPv6',
            },
            {
                name: 'Corporate VPN',
                cidr: '10.0.0.0/8',
                location: 'Secure Remote VPN',
                description: 'Internal VPN network range',
            },
        ],
    });
    const ltAnnual = await prisma.leaveType.create({
        data: { code: 'ANNUAL', name: 'Annual Paid Leave', maxDaysPerYear: 12, isPaid: true },
    });
    const ltSick = await prisma.leaveType.create({
        data: { code: 'SICK', name: 'Sick Leave', maxDaysPerYear: 10, isPaid: true },
    });
    const ltUnpaid = await prisma.leaveType.create({
        data: { code: 'UNPAID', name: 'Unpaid Leave', maxDaysPerYear: 30, isPaid: false },
    });
    for (const emp of [empAdmin, empHR, empManager, empEmployee]) {
        await prisma.leaveBalance.createMany({
            data: [
                { employeeId: emp.id, leaveTypeId: ltAnnual.id, year: 2026, allocatedDays: 12, remainingDays: 10, usedDays: 2 },
                { employeeId: emp.id, leaveTypeId: ltSick.id, year: 2026, allocatedDays: 10, remainingDays: 9, usedDays: 1 },
                { employeeId: emp.id, leaveTypeId: ltUnpaid.id, year: 2026, allocatedDays: 30, remainingDays: 30, usedDays: 0 },
            ],
        });
    }
    const todayStr = new Date().toISOString().split('T')[0];
    await prisma.attendanceRecord.create({
        data: {
            employeeId: empEmployee.id,
            date: new Date(todayStr),
            checkInTime: new Date(`${todayStr}T08:02:00Z`),
            ipAddress: '127.0.0.1',
            networkName: 'Localhost IPv4 (Testing)',
            method: client_1.AttendanceMethod.WEB,
            status: client_1.AttendanceStatus.PRESENT,
            remarks: 'Punctual check-in',
        },
    });
    await prisma.taxConfiguration.createMany({
        data: [
            { bracketName: 'Level 1 (Up to $500)', minIncome: 0, maxIncome: 500, taxRatePercentage: 5, fixedDeduction: 0 },
            { bracketName: 'Level 2 ($500 - $1,500)', minIncome: 500, maxIncome: 1500, taxRatePercentage: 10, fixedDeduction: 25 },
            { bracketName: 'Level 3 ($1,500 - $3,000)', minIncome: 1500, maxIncome: 3000, taxRatePercentage: 15, fixedDeduction: 100 },
            { bracketName: 'Level 4 (Above $3,000)', minIncome: 3000, maxIncome: null, taxRatePercentage: 20, fixedDeduction: 250 },
        ],
    });
    await prisma.insuranceConfiguration.createMany({
        data: [
            { insuranceType: 'SOCIAL', employeeRatePercentage: 8.0, employerRatePercentage: 17.5, maxSalaryCap: 2000 },
            { insuranceType: 'HEALTH', employeeRatePercentage: 1.5, employerRatePercentage: 3.0, maxSalaryCap: 2000 },
            { insuranceType: 'UNEMPLOYMENT', employeeRatePercentage: 1.0, employerRatePercentage: 1.0, maxSalaryCap: 2000 },
        ],
    });
    await prisma.companySetting.createMany({
        data: [
            { key: 'COMPANY_NAME', value: 'Enterprise HRMS Systems Inc.', description: 'Official company name' },
            { key: 'WORK_HOURS_PER_DAY', value: '8', description: 'Standard working hours per day' },
            { key: 'OVERTIME_RATE_NORMAL', value: '1.5', description: 'Overtime multiplier for weekdays' },
            { key: 'OVERTIME_RATE_WEEKEND', value: '2.0', description: 'Overtime multiplier for weekends' },
            { key: 'ENFORCE_NETWORK_RESTRICTION', value: 'true', description: 'Enforce CIDR attendance check-in/out' },
        ],
    });
    console.log('✅ HRMS Seeding Completed Successfully!');
    console.log('================================================');
    console.log('Credentials created:');
    console.log('1. SUPER_ADMIN: admin@hrms.com / Password123!');
    console.log('2. HR_ADMIN:    hr@hrms.com / Password123!');
    console.log('3. MANAGER:     manager@hrms.com / Password123!');
    console.log('4. EMPLOYEE:    employee@hrms.com / Password123!');
    console.log('================================================');
}
main()
    .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map