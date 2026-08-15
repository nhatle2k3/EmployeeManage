import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Department } from '../types';
import { Modal } from '../components/common/Modal';
import { Building2, Plus, Network, ChevronRight, User } from 'lucide-react';

export const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ code: '', name: '', description: '', parentId: '' });
  const [loading, setLoading] = useState(true);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/departments', formData);
      setIsModalOpen(false);
      fetchDepartments();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create department');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading Departments...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-400" />
            <span>Departments & Organizational Structure</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Hierarchical department tree and manager assignments</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg glow-indigo flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Organizational Hierarchy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept) => (
          <div key={dept.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold border border-indigo-500/20">
                {dept.code}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{dept._count?.employees || 0} Employees</span>
            </div>

            <h3 className="text-lg font-extrabold text-white">{dept.name}</h3>
            {dept.description && <p className="text-xs text-slate-400">{dept.description}</p>}

            {dept.parent && (
              <div className="p-2 rounded-lg bg-slate-950/60 text-[11px] text-slate-400 flex items-center gap-1.5 border border-slate-800">
                <Network className="w-3.5 h-3.5 text-purple-400" />
                <span>Parent: <strong className="text-slate-200">{dept.parent.name}</strong></span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                Manager:
              </span>
              <span className="font-semibold text-white">
                {dept.manager ? `${dept.manager.firstName} ${dept.manager.lastName}` : 'Unassigned'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Department Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Department">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Department Code *</label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="ENG"
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Department Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Engineering & Tech"
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white h-20"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Parent Department (Optional)</label>
            <select
              value={formData.parentId}
              onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
            >
              <option value="">None (Top-Level)</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold glow-indigo"
            >
              Save Department
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
