import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileText,
  Clock,
  CalendarCheck,
  CalendarDays,
  DollarSign,
  BarChart3,
  Bell,
  Settings,
  ShieldAlert,
  UserCheck,
  Smartphone,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role;

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { name: 'Check-in / Check-out', path: '/my-attendance', icon: UserCheck, roles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { name: 'Lịch sử Điểm danh', path: '/attendance', icon: CalendarCheck, roles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { name: 'Xin nghỉ phép', path: '/leave', icon: CalendarDays, roles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { name: 'Quản lý Nhân sự', path: '/employees', icon: Users, roles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER'] },
    { name: 'Phòng ban & Cơ cấu', path: '/departments', icon: Building2, roles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER'] },
    { name: 'Chức danh', path: '/positions', icon: Briefcase, roles: ['SUPER_ADMIN', 'HR_ADMIN'] },
    { name: 'Hợp đồng Lao động', path: '/contracts', icon: FileText, roles: ['SUPER_ADMIN', 'HR_ADMIN'] },
    { name: 'Ca làm việc', path: '/shifts', icon: Clock, roles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER'] },
    { name: 'Đăng ký Tăng ca', path: '/overtime', icon: Clock, roles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER'] },
    { name: 'Bảng lương & Phiếu lương', path: '/payroll', icon: DollarSign, roles: ['SUPER_ADMIN', 'HR_ADMIN'] },
    { name: 'Thiết bị chấm công', path: '/devices', icon: Smartphone, roles: ['SUPER_ADMIN', 'HR_ADMIN'] },
    { name: 'Báo cáo & Xuất dữ liệu', path: '/reports', icon: BarChart3, roles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER'] },
    { name: 'Thông báo', path: '/notifications', icon: Bell, roles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { name: 'Cấu hình Hệ thống', path: '/settings', icon: Settings, roles: ['SUPER_ADMIN', 'HR_ADMIN'] },
    { name: 'Nhật ký Truy cập (Audit)', path: '/audit-logs', icon: ShieldAlert, roles: ['SUPER_ADMIN', 'HR_ADMIN'] },
  ];

  const filteredNav = navigation.filter((item) => !role || item.roles.includes(role));

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col h-screen sticky top-0 backdrop-blur-xl z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-black text-white shadow-lg glow-indigo">
          HR
        </div>
        <div>
          <h1 className="font-extrabold text-white text-base tracking-tight">Enterprise HRMS</h1>
          <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold">Pro Suite 2026</p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold glow-indigo'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-900/80 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-300">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-200 truncate">{user?.email}</p>
            <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
