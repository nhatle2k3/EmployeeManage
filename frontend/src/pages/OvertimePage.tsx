import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { OvertimeRecord } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { Clock, Plus, CheckCircle, XCircle } from 'lucide-react';

import { useRealtime } from '../context/RealtimeContext';

export const OvertimePage: React.FC = () => {
  const { user } = useAuth();
  const { lastEvent } = useRealtime();
  const [records, setRecords] = useState<OvertimeRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otForm, setOtForm] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '17:30',
    endTime: '20:30',
    hours: 3,
    reason: '',
  });

  const fetchOvertime = async () => {
    try {
      const res = await api.get('/overtime');
      setRecords(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOvertime();
  }, []);

  useEffect(() => {
    if (lastEvent && (lastEvent.type === 'OVERTIME_REQUEST' || lastEvent.type === 'OVERTIME_PROCESSED' || lastEvent.type === 'NOTIFICATION')) {
      fetchOvertime();
    }
  }, [lastEvent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/overtime/requests', otForm);
      setIsModalOpen(false);
      fetchOvertime();
      alert('Overtime request submitted!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Submission failed');
    }
  };

  const handleProcess = async (id: string, action: 'APPROVE' | 'REJECT') => {
    try {
      await api.patch(`/overtime/${id}/process`, { action });
      fetchOvertime();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const canApprove = user?.role === 'SUPER_ADMIN' || user?.role === 'HR_ADMIN' || user?.role === 'MANAGER';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-400" />
            <span>Overtime (OT) Tracking</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Submit overtime requests and review rate multiplier approvals</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg glow-indigo flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Request Overtime</span>
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">OT Hours</th>
              <th className="py-3 px-4">Rate Multiplier</th>
              <th className="py-3 px-4">Reason</th>
              <th className="py-3 px-4">Status</th>
              {canApprove && <th className="py-3 px-4 text-right">Approval</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {records.map((ot) => (
              <tr key={ot.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-mono">{new Date(ot.date).toISOString().split('T')[0]}</td>
                <td className="py-3.5 px-4 font-bold text-white">
                  {ot.employee?.firstName} {ot.employee?.lastName} ({ot.employee?.employeeCode})
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">{ot.hours} hrs ({ot.startTime} - {ot.endTime})</td>
                <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{ot.rateMultiplier}x</td>
                <td className="py-3.5 px-4 max-w-xs truncate">{ot.reason}</td>
                <td className="py-3.5 px-4">
                  <Badge variant={ot.status === 'APPROVED' ? 'success' : ot.status === 'PENDING' ? 'warning' : 'danger'}>
                    {ot.status}
                  </Badge>
                </td>
                {canApprove && (
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {ot.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleProcess(ot.id, 'APPROVE')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 font-bold border border-emerald-500/30"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleProcess(ot.id, 'REJECT')}
                          className="px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-400 font-bold border border-rose-500/30"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit Overtime Request">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Overtime Date *</label>
            <input
              type="date"
              required
              value={otForm.date}
              onChange={(e) => setOtForm({ ...otForm, date: e.target.value })}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Start Time *</label>
              <input
                type="time"
                required
                value={otForm.startTime}
                onChange={(e) => setOtForm({ ...otForm, startTime: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">End Time *</label>
              <input
                type="time"
                required
                value={otForm.endTime}
                onChange={(e) => setOtForm({ ...otForm, endTime: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Total Hours *</label>
              <input
                type="number"
                step="0.5"
                required
                value={otForm.hours}
                onChange={(e) => setOtForm({ ...otForm, hours: parseFloat(e.target.value) })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Reason *</label>
            <textarea
              required
              value={otForm.reason}
              onChange={(e) => setOtForm({ ...otForm, reason: e.target.value })}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white h-20"
              placeholder="Overtime task description..."
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold glow-indigo">Submit OT Request</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
