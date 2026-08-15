import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { RegisteredDevice } from '../types';
import { Badge } from '../components/common/Badge';
import { Smartphone, ShieldCheck, Ban, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DevicesPage: React.FC = () => {
  const { user } = useAuth();
  const [devices, setDevices] = useState<RegisteredDevice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDevices = async () => {
    try {
      const res = await api.get('/devices');
      setDevices(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'APPROVED' | 'BLOCKED') => {
    try {
      await api.patch(`/devices/${id}/status`, { status });
      fetchDevices();
    } catch (e) {
      alert('Failed to update device status');
    }
  };

  const isHr = user?.role === 'SUPER_ADMIN' || user?.role === 'HR_ADMIN';

  if (loading) return <div className="p-8 text-center text-slate-400">Loading Devices...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Smartphone className="w-6 h-6 text-indigo-400" />
          <span>Registered Corporate Devices</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">Manage approved laptops and mobile devices registered for attendance kiosk check-in</p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
              <th className="py-3 px-4">Device Name</th>
              <th className="py-3 px-4">Fingerprint ID</th>
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">OS / Browser</th>
              <th className="py-3 px-4">Status</th>
              {isHr && <th className="py-3 px-4 text-right">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {devices.map((dev) => (
              <tr key={dev.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">{dev.deviceName}</td>
                <td className="py-3.5 px-4 font-mono text-indigo-400 text-[11px]">{dev.deviceFingerprint}</td>
                <td className="py-3.5 px-4 font-semibold">{dev.employee?.firstName} {dev.employee?.lastName}</td>
                <td className="py-3.5 px-4 text-slate-400">{dev.os || 'Linux'} / {dev.browser || 'Chrome'}</td>
                <td className="py-3.5 px-4">
                  <Badge variant={dev.status === 'APPROVED' ? 'success' : dev.status === 'PENDING' ? 'warning' : 'danger'}>
                    {dev.status}
                  </Badge>
                </td>
                {isHr && (
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleUpdateStatus(dev.id, 'APPROVED')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-bold"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(dev.id, 'BLOCKED')}
                      className="px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30 font-bold"
                    >
                      Block
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
