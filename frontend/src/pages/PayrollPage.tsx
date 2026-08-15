import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { PayrollPeriod, Payroll } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { DollarSign, Plus, Play, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

export const PayrollPage: React.FC = () => {
  const { user } = useAuth();
  const [periods, setPeriods] = useState<PayrollPeriod[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [selectedPayslip, setSelectedPayslip] = useState<Payroll | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [periodForm, setPeriodForm] = useState({
    name: `Payroll ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}`,
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
    totalWorkingDays: 22,
  });

  const fetchPeriods = async () => {
    try {
      const res = await api.get('/payroll/periods');
      setPeriods(res.data);
      if (res.data.length > 0 && !selectedPeriod) {
        setSelectedPeriod(res.data[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPayrolls = async () => {
    try {
      const params: any = {};
      if (selectedPeriod) params.periodId = selectedPeriod;
      const res = await api.get('/payroll/records', { params });
      setPayrolls(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPeriods();
  }, []);

  useEffect(() => {
    fetchPayrolls();
  }, [selectedPeriod]);

  const handleCreatePeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/payroll/periods', periodForm);
      setIsModalOpen(false);
      fetchPeriods();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Creation failed');
    }
  };

  const handleCalculatePayroll = async (periodId: string) => {
    if (!confirm('Run automated payroll calculation for all active employees for this period?')) return;
    try {
      const res = await api.post(`/payroll/periods/${periodId}/calculate`);
      alert(res.data.message);
      fetchPeriods();
      fetchPayrolls();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Calculation failed');
    }
  };

  const handleUpdateStatus = async (periodId: string, status: string) => {
    try {
      await api.patch(`/payroll/periods/${periodId}/status`, { status });
      fetchPeriods();
      fetchPayrolls();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Update status failed');
    }
  };

  const isHr = user?.role === 'SUPER_ADMIN' || user?.role === 'HR_ADMIN';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            <span>Payroll Engine & Payslips</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Automated tax, insurance, overtime calculation & payslip generation</p>
        </div>

        {isHr && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg glow-indigo flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Payroll Period</span>
          </button>
        )}
      </div>

      {/* Period Selection Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-slate-400 font-semibold">Select Payroll Period:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
          >
            {periods.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.status})
              </option>
            ))}
          </select>
        </div>

        {isHr && selectedPeriod && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleCalculatePayroll(selectedPeriod)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold flex items-center gap-2 shadow-lg glow-emerald"
            >
              <Play className="w-4 h-4" />
              <span>Run Auto Calculation</span>
            </button>

            <button
              onClick={() => handleUpdateStatus(selectedPeriod, 'APPROVED')}
              className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-bold"
            >
              Approve Period
            </button>
          </div>
        )}
      </div>

      {/* Payroll Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Base Salary</th>
              <th className="py-3 px-4">Allowances & Bonuses</th>
              <th className="py-3 px-4">Overtime Pay</th>
              <th className="py-3 px-4">Gross Salary</th>
              <th className="py-3 px-4">Insurance</th>
              <th className="py-3 px-4">Tax (PIT)</th>
              <th className="py-3 px-4">Net Salary</th>
              <th className="py-3 px-4 text-right">Payslip</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {payrolls.map((p) => (
              <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">
                  {p.employee?.firstName} {p.employee?.lastName}
                  <p className="text-[10px] text-slate-400 font-mono">{p.employee?.employeeCode}</p>
                </td>
                <td className="py-3.5 px-4 font-mono">${p.baseSalary?.toLocaleString()}</td>
                <td className="py-3.5 px-4 font-mono text-indigo-400">${((p.allowances || 0) + (p.bonuses || 0)).toLocaleString()}</td>
                <td className="py-3.5 px-4 font-mono text-purple-400">${p.overtimePay?.toLocaleString()}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-200">${p.totalGross?.toLocaleString()}</td>
                <td className="py-3.5 px-4 font-mono text-amber-400">-${p.insurance?.toLocaleString()}</td>
                <td className="py-3.5 px-4 font-mono text-rose-400">-${p.tax?.toLocaleString()}</td>
                <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-400 text-sm">${p.netSalary?.toLocaleString()}</td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => setSelectedPayslip(p)}
                    className="p-1.5 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                    title="View Payslip Breakdown"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Period Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Payroll Period">
        <form onSubmit={handleCreatePeriod} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Period Title *</label>
            <input
              type="text"
              required
              value={periodForm.name}
              onChange={(e) => setPeriodForm({ ...periodForm, name: e.target.value })}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={periodForm.startDate}
                onChange={(e) => setPeriodForm({ ...periodForm, startDate: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">End Date *</label>
              <input
                type="date"
                required
                value={periodForm.endDate}
                onChange={(e) => setPeriodForm({ ...periodForm, endDate: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Standard Working Days (per month)</label>
            <input
              type="number"
              value={periodForm.totalWorkingDays}
              onChange={(e) => setPeriodForm({ ...periodForm, totalWorkingDays: parseInt(e.target.value) })}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold glow-indigo">Create Period</button>
          </div>
        </form>
      </Modal>

      {/* Detailed Payslip Modal */}
      {selectedPayslip && (
        <Modal isOpen={!!selectedPayslip} onClose={() => setSelectedPayslip(null)} title={`Payslip: ${selectedPayslip.employee?.firstName} ${selectedPayslip.employee?.lastName}`}>
          <div className="space-y-5 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-base font-extrabold text-white">{selectedPayslip.employee?.firstName} {selectedPayslip.employee?.lastName}</p>
                <p className="text-slate-400 font-mono">{selectedPayslip.employee?.employeeCode} • {selectedPayslip.employee?.department?.name}</p>
              </div>
              <Badge variant="success">NET SALARY: ${selectedPayslip.netSalary?.toLocaleString()}</Badge>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Salary Component Breakdown</h4>

              <div className="space-y-1.5">
                {selectedPayslip.items?.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                    <span className="font-semibold text-slate-200">{item.title}</span>
                    <span className={`font-mono font-bold ${item.itemType === 'EARNING' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {item.itemType === 'EARNING' ? '+' : '-'}${item.amount?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
