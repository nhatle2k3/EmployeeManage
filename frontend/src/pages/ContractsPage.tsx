import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Contract, Employee } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { FileText, Plus, Calendar, DollarSign } from 'lucide-react';

export const ContractsPage: React.FC = () => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contractForm, setContractForm] = useState({
    employeeId: '',
    contractNumber: `CTR-${Math.floor(1000 + Math.random() * 9000)}`,
    contractType: 'INDEFINITE',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    salary: 2000,
  });

  const fetchData = async () => {
    try {
      const [empRes] = await Promise.all([api.get('/employees')]);
      setEmployees(empRes.data);
      // Collect contracts from employees
      const allContracts: any[] = [];
      empRes.data.forEach((e: any) => {
        if (e.contracts) {
          e.contracts.forEach((c: any) => allContracts.push({ ...c, employee: e }));
        }
      });
      setContracts(allContracts);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/employees/${contractForm.employeeId}/contracts`, contractForm);
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create contract');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            <span>Employment Contracts</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Manage legal contracts, terms, base salaries, and expiry dates</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg glow-indigo flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Contract</span>
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
              <th className="py-3 px-4">Contract #</th>
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Salary</th>
              <th className="py-3 px-4">Start Date</th>
              <th className="py-3 px-4">End Date</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {contracts.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">{c.contractNumber}</td>
                <td className="py-3.5 px-4 font-semibold text-white">
                  {c.employee?.firstName} {c.employee?.lastName} ({c.employee?.employeeCode})
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-300">{c.contractType}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">${c.salary?.toLocaleString()}</td>
                <td className="py-3.5 px-4 font-mono">{new Date(c.startDate).toISOString().split('T')[0]}</td>
                <td className="py-3.5 px-4 font-mono">{c.endDate ? new Date(c.endDate).toISOString().split('T')[0] : 'Indefinite'}</td>
                <td className="py-3.5 px-4">
                  <Badge variant={c.status === 'ACTIVE' ? 'success' : 'secondary'}>{c.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Issue Employment Contract">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Select Employee *</label>
            <select
              required
              value={contractForm.employeeId}
              onChange={(e) => setContractForm({ ...contractForm, employeeId: e.target.value })}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
            >
              <option value="">Choose Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.employeeCode})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Contract Number *</label>
              <input
                type="text"
                required
                value={contractForm.contractNumber}
                onChange={(e) => setContractForm({ ...contractForm, contractNumber: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Contract Type *</label>
              <select
                value={contractForm.contractType}
                onChange={(e) => setContractForm({ ...contractForm, contractType: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              >
                <option value="INDEFINITE">INDEFINITE</option>
                <option value="FIXED_TERM">FIXED_TERM</option>
                <option value="PROBATION">PROBATION</option>
                <option value="FREELANCE">FREELANCE</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={contractForm.startDate}
                onChange={(e) => setContractForm({ ...contractForm, startDate: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">End Date (Optional)</label>
              <input
                type="date"
                value={contractForm.endDate}
                onChange={(e) => setContractForm({ ...contractForm, endDate: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Agreed Base Monthly Salary ($) *</label>
            <input
              type="number"
              required
              value={contractForm.salary}
              onChange={(e) => setContractForm({ ...contractForm, salary: parseFloat(e.target.value) })}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold glow-indigo">Save Contract</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
