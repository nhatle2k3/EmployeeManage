import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import {
  Users,
  Building2,
  UserCheck,
  Clock,
  UserX,
  Calendar,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/reports/dashboard');
        setData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Dashboard Metrics...</div>;
  }

  const m = data?.metrics || {};

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/50 via-purple-900/30 to-slate-900 border border-indigo-500/20 glass-panel">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">HRMS Control Center</h1>
            <p className="text-sm text-slate-300 mt-1">Real-time workforce stats, CIDR attendance control & payroll summary</p>
          </div>
          <a
            href="/my-attendance"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg glow-indigo transition-all flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Mark Attendance Kiosk</span>
          </a>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Employees" value={m.totalEmployees || 0} subtitle={`${m.activeEmployees || 0} Active`} icon={Users} color="indigo" />
        <StatCard title="Present Today" value={m.presentToday || 0} subtitle={`${m.lateToday || 0} Late Check-ins`} icon={UserCheck} color="emerald" />
        <StatCard title="Absent Today" value={m.absentToday || 0} subtitle={`${m.onLeaveToday || 0} On Leave`} icon={UserX} color="rose" />
        <StatCard title="Pending Approvals" value={(m.pendingLeaves || 0) + (m.pendingOvertime || 0)} subtitle={`${m.pendingLeaves || 0} Leave, ${m.pendingOvertime || 0} OT`} icon={Clock} color="amber" />
      </div>

      {/* Middle Section: Department Distribution & Payroll Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employees by Department */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" />
              <span>Employees by Department</span>
            </h3>
            <span className="text-xs text-slate-400 font-semibold">{data?.employeesByDept?.length || 0} Departments</span>
          </div>

          <div className="space-y-4">
            {data?.employeesByDept?.map((dept: any, idx: number) => {
              const max = Math.max(...data.employeesByDept.map((d: any) => d.count), 1);
              const pct = Math.round((dept.count / max) * 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-200">{dept.department}</span>
                    <span className="text-indigo-400 font-bold">{dept.count} Employees</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Latest Payroll Period Summary */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>Payroll Overview</span>
            </h3>
            <Badge variant="success">{data?.payrollSummary?.status || 'Active'}</Badge>
          </div>

          {data?.payrollSummary ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <p className="text-xs text-slate-400 uppercase font-semibold">Latest Period</p>
                <p className="text-base font-bold text-white mt-0.5">{data.payrollSummary.periodName}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <p className="text-[11px] text-slate-400 font-semibold">Total Gross</p>
                  <p className="text-lg font-extrabold text-indigo-400">${data.payrollSummary.totalGross?.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <p className="text-[11px] text-slate-400 font-semibold">Total Net</p>
                  <p className="text-lg font-extrabold text-emerald-400">${data.payrollSummary.totalNet?.toLocaleString()}</p>
                </div>
              </div>

              <a
                href="/payroll"
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-1 transition-colors"
              >
                <span>View All Payslips</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No payroll periods computed yet.</p>
          )}
        </div>
      </div>

      {/* Attendance Today Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" />
          <span>Today's Attendance Logs</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Check-In</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Network Subnet</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {data?.todayAttendanceList?.length > 0 ? (
                data.todayAttendanceList.map((rec: any) => (
                  <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      {rec.employee?.firstName} {rec.employee?.lastName} ({rec.employee?.employeeCode})
                    </td>
                    <td className="py-3 px-4">{rec.employee?.department?.name || 'N/A'}</td>
                    <td className="py-3 px-4 font-mono">{rec.checkInTime ? new Date(rec.checkInTime).toLocaleTimeString() : 'N/A'}</td>
                    <td className="py-3 px-4 font-mono">{rec.ipAddress}</td>
                    <td className="py-3 px-4">{rec.networkName || 'Trusted CIDR'}</td>
                    <td className="py-3 px-4">
                      <Badge variant={rec.status === 'PRESENT' ? 'success' : rec.status === 'LATE' ? 'warning' : 'danger'}>
                        {rec.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500">
                    No attendance records for today yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
