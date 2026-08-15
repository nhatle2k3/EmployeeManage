import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { AttendanceNetwork } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Settings, Wifi, Plus, Trash2, ShieldCheck, Globe } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [networks, setNetworks] = useState<AttendanceNetwork[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [networkForm, setNetworkForm] = useState({
    name: '',
    cidr: '192.168.1.0/24',
    location: 'Headquarters Office',
    isActive: true,
    description: '',
  });

  const fetchNetworks = async () => {
    try {
      const res = await api.get('/networks');
      setNetworks(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNetworks();
  }, []);

  const handleCreateNetwork = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/networks', networkForm);
      setIsModalOpen(false);
      fetchNetworks();
      alert('Trusted network CIDR added!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add network');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this trusted network CIDR range?')) return;
    try {
      await api.delete(`/networks/${id}`);
      fetchNetworks();
    } catch (err: any) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-400" />
            <span>Network CIDR & Security Settings</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Configure internal company network subnets for enforced attendance validation</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg glow-indigo flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Trusted CIDR Subnet</span>
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-indigo-900/30 border border-indigo-500/20 glass-panel space-y-2">
        <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <span>Core CIDR Security Engine Overview</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The backend enforces strict CIDR IP checking using <code className="text-indigo-400 font-mono">ipaddr.js</code>. Client-supplied IP claims are strictly ignored. Requests are matched directly against request socket headers (<code className="text-slate-400 font-mono">x-forwarded-for</code>, <code className="text-slate-400 font-mono">x-real-ip</code>, remoteAddress) against active subnets listed below.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel overflow-x-auto">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Wifi className="w-4 h-4 text-emerald-400" />
          <span>Configured Corporate Subnets</span>
        </h3>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
              <th className="py-3 px-4">Network Name</th>
              <th className="py-3 px-4">CIDR Range</th>
              <th className="py-3 px-4">Physical Location</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {networks.map((net) => (
              <tr key={net.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">{net.name}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">{net.cidr}</td>
                <td className="py-3.5 px-4 text-slate-300">{net.location}</td>
                <td className="py-3.5 px-4">
                  <Badge variant={net.isActive ? 'success' : 'secondary'}>
                    {net.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </Badge>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => handleDelete(net.id)}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Network Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Trusted Network CIDR">
        <form onSubmit={handleCreateNetwork} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Network Identifier Name *</label>
            <input
              type="text"
              required
              value={networkForm.name}
              onChange={(e) => setNetworkForm({ ...networkForm, name: e.target.value })}
              placeholder="HQ Main Office Wi-Fi"
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">CIDR Subnet Notation *</label>
            <input
              type="text"
              required
              value={networkForm.cidr}
              onChange={(e) => setNetworkForm({ ...networkForm, cidr: e.target.value })}
              placeholder="192.168.1.0/24 or ::ffff:127.0.0.1/128"
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Location / Office Branch *</label>
            <input
              type="text"
              required
              value={networkForm.location}
              onChange={(e) => setNetworkForm({ ...networkForm, location: e.target.value })}
              placeholder="Building A - Floor 4"
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold glow-indigo">Save Subnet</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
