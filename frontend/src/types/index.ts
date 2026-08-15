export type RoleEnum = 'SUPER_ADMIN' | 'HR_ADMIN' | 'MANAGER' | 'EMPLOYEE';
export type EmploymentStatus = 'ACTIVE' | 'PROBATION' | 'SUSPENDED' | 'TERMINATED';
export type ContractType = 'INDEFINITE' | 'FIXED_TERM' | 'PROBATION' | 'FREELANCE';
export type AttendanceStatus = 'PRESENT' | 'LATE' | 'EARLY_LEAVE' | 'LATE_AND_EARLY_LEAVE' | 'ABSENT' | 'ON_LEAVE';
export type StatusWorkflow = 'DRAFT' | 'CALCULATED' | 'REVIEW' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
export type DeviceStatus = 'PENDING' | 'APPROVED' | 'BLOCKED';

export interface User {
  id: string;
  email: string;
  role: RoleEnum;
  employeeId?: string;
  employee?: Employee;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  description?: string;
  parentId?: string;
  parent?: Department;
  children?: Department[];
  managerId?: string;
  manager?: Employee;
  _count?: {
    employees: number;
    positions: number;
  };
}

export interface Position {
  id: string;
  code: string;
  title: string;
  description?: string;
  baseSalaryMin: number;
  baseSalaryMax: number;
  departmentId?: string;
  department?: Department;
}

export interface EmployeeProfile {
  id: string;
  bio?: string;
  avatar?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  maritalStatus?: string;
  education?: string;
}

export interface EmployeeDocument {
  id: string;
  title: string;
  documentType: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface Contract {
  id: string;
  contractNumber: string;
  contractType: ContractType;
  startDate: string;
  endDate?: string;
  salary: number;
  status: string;
  documentUrl?: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender?: string;
  dob?: string;
  address?: string;
  nationalId?: string;
  taxId?: string;
  bankAccount?: string;
  bankName?: string;
  departmentId?: string;
  department?: Department;
  positionId?: string;
  position?: Position;
  managerId?: string;
  manager?: Partial<Employee>;
  hireDate: string;
  status: EmploymentStatus;
  user?: User;
  profile?: EmployeeProfile;
  documents?: EmployeeDocument[];
  contracts?: Contract[];
  leaveBalances?: LeaveBalance[];
}

export interface WorkShift {
  id: string;
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  breakStartTime?: string;
  breakEndTime?: string;
  lateToleranceMins: number;
  earlyLeaveToleranceMins: number;
  isOvernight: boolean;
}

export interface AttendanceNetwork {
  id: string;
  name: string;
  cidr: string;
  location: string;
  isActive: boolean;
  description?: string;
}

export interface RegisteredDevice {
  id: string;
  employeeId: string;
  employee?: Partial<Employee>;
  deviceFingerprint: string;
  deviceName: string;
  os?: string;
  browser?: string;
  status: DeviceStatus;
  registeredAt: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employee?: Partial<Employee>;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  ipAddress: string;
  networkId?: string;
  networkName?: string;
  deviceId?: string;
  deviceName?: string;
  method: string;
  status: AttendanceStatus;
  workingHours: number;
  overtimeHours: number;
  remarks?: string;
}

export interface LeaveType {
  id: string;
  code: string;
  name: string;
  description?: string;
  maxDaysPerYear: number;
  isPaid: boolean;
}

export interface LeaveBalance {
  id: string;
  leaveTypeId: string;
  leaveType?: LeaveType;
  year: number;
  allocatedDays: number;
  usedDays: number;
  pendingDays: number;
  remainingDays: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employee?: Partial<Employee>;
  leaveTypeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: StatusWorkflow;
  approvedByUser?: { id: string; email: string };
  approvalComment?: string;
  createdAt: string;
}

export interface OvertimeRecord {
  id: string;
  employeeId: string;
  employee?: Partial<Employee>;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  rateMultiplier: number;
  reason: string;
  status: StatusWorkflow;
  approvedByUser?: { id: string; email: string };
}

export interface PayrollPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  totalWorkingDays: number;
  status: StatusWorkflow;
  _count?: { payrolls: number };
}

export interface PayrollItem {
  id: string;
  title: string;
  itemType: 'EARNING' | 'DEDUCTION' | 'TAX' | 'INSURANCE';
  amount: number;
  description?: string;
}

export interface Payroll {
  id: string;
  periodId: string;
  period?: PayrollPeriod;
  employeeId: string;
  employee?: Partial<Employee>;
  baseSalary: number;
  allowances: number;
  bonuses: number;
  overtimePay: number;
  commission: number;
  totalGross: number;
  deductions: number;
  insurance: number;
  tax: number;
  netSalary: number;
  status: StatusWorkflow;
  items?: PayrollItem[];
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  userId?: string;
  userEmail?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}
