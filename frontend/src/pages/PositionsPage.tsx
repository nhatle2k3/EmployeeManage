import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Position, Department } from '../types';
import { Modal } from '../components/common/Modal';
import { Briefcase, Plus, Building2, DollarSign } from 'lucide-react';

export const PositionsPage: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ code: '', title: '', description: '', baseSalaryMin: 1000, baseSalaryMax: 3000, departmentId: '' });

  const fetchData = async () => {
    try {
      const [posRes, deptRes] = await Promise.all([api.get('/positions'), api.get('/departments')]);
      setPositions(posRes.data);
      setDepartments(deptRes.data);
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
      await api.post('/positions', formData);
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create position');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-400" />
            <span>Job Positions & Salary Bands</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Configure corporate job titles and min/max pay bands</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg glow-indigo flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Position</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {positions.map((pos) => (
          <div key={pos.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold border border-indigo-500/20">
                {pos.code}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{pos.department?.name || 'Cross-Dept'}</span>
            </div>

            <h3 className="text-lg font-extrabold text-white">{pos.title}</h3>
            {pos.description && <p className="text-xs text-slate-400">{pos.description}</p>}

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Base Pay Range:
              </span>
              <span className="font-bold font-mono text-emerald-400">
                ${pos.baseSalaryMin?.toLocaleString()} - ${pos.baseSalaryMax?.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Job Position">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Code *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Min Base Salary ($)</label>
              <input
                type="number"
                value={formData.baseSalaryMin}
                onChange={(e) => setFormData({ ...formData, baseSalaryMin: parseFloat(e.target.value) })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Max Base Salary ($)</label>
              <input
                type="number"
                value={formData.baseSalaryMax}
                onChange={(e) => setFormData({ ...formData, baseSalaryMax: parseFloat(e.target.value) })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Department</label>
            <select
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
            >
              <option value="">Cross-Departmental</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold glow-indigo">Save Position</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
