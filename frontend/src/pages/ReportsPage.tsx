import React from 'react';
import { BarChart3, Download, Users, CalendarCheck, CalendarDays, DollarSign } from 'lucide-react';
import { api } from '../services/api';

export const ReportsPage: React.FC = () => {
  const handleExport = async (type: 'EMPLOYEE' | 'ATTENDANCE' | 'LEAVE' | 'PAYROLL') => {
    try {
      const response = await api.get(`/reports/export?type=${type}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `hrms_${type.toLowerCase()}_report.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      alert('Export failed');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-400" />
          <span>Reports & CSV Export Center</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">Export complete HRMS datasets for corporate compliance and external auditing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Employee Master Directory</h3>
              <p className="text-xs text-slate-400">Complete workforce census, tax IDs, bank accounts, and employment status</p>
            </div>
          </div>
          <button
            onClick={() => handleExport('EMPLOYEE')}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg glow-indigo flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Employees CSV</span>
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Attendance & CIDR Logs</h3>
              <p className="text-xs text-slate-400">Daily check-in/out timestamps, Client IP addresses, and CIDR subnet validations</p>
            </div>
          </div>
          <button
            onClick={() => handleExport('ATTENDANCE')}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg glow-emerald flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Attendance CSV</span>
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Leave Requests Audit</h3>
              <p className="text-xs text-slate-400">Leave category requests, allocated vs remaining balances, and manager approvals</p>
            </div>
          </div>
          <button
            onClick={() => handleExport('LEAVE')}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Leave CSV</span>
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Payroll & Tax Register</h3>
              <p className="text-xs text-slate-400">Base salary, gross pay, insurance deductions, progressive tax, and net salaries</p>
            </div>
          </div>
          <button
            onClick={() => handleExport('PAYROLL')}
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg glow-indigo flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Payroll Register CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
