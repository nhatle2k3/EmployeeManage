import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { LeaveType, LeaveBalance, LeaveRequest } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { CalendarDays, Plus, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

import { useRealtime } from '../context/RealtimeContext';

export const LeavePage: React.FC = () => {
  const { user } = useAuth();
  const { lastEvent } = useRealtime();
  const [types, setTypes] = useState<LeaveType[]>([]);
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    leaveTypeId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: '',
  });

  const fetchData = async () => {
    try {
      const [typeRes, balRes, reqRes] = await Promise.all([
        api.get('/leave/types'),
        api.get('/leave/my-balances'),
        api.get('/leave/requests'),
      ]);
      setTypes(typeRes.data);
      setBalances(balRes.data);
      setRequests(reqRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (lastEvent && (lastEvent.type === 'LEAVE_REQUEST' || lastEvent.type === 'LEAVE_PROCESSED' || lastEvent.type === 'NOTIFICATION')) {
      fetchData();
    }
  }, [lastEvent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/leave/requests', requestForm);
      setIsModalOpen(false);
      fetchData();
      alert('Leave request submitted successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit leave request');
    }
  };

  const handleProcess = async (id: string, action: 'APPROVE' | 'REJECT') => {
    const comment = prompt(`Enter ${action} comment (optional):`);
    try {
      await api.patch(`/leave/requests/${id}/process`, { action, comment });
      fetchData();
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
            <CalendarDays className="w-6 h-6 text-indigo-400" />
            <span>Leave Management System</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Leave balance tracking, request submissions & approval workflow</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg glow-indigo flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leave Balances Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {balances.map((b) => (
          <div key={b.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel">
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{b.leaveType?.name}</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{b.remainingDays} Days</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Allocated: <strong>{b.allocatedDays}</strong> | Used: <strong>{b.usedDays}</strong> | Pending: <strong>{b.pendingDays}</strong>
            </p>
          </div>
        ))}
      </div>

      {/* Requests Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel overflow-x-auto">
        <h3 className="text-lg font-bold text-white mb-4">Leave Requests Workflow</h3>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Leave Type</th>
              <th className="py-3 px-4">Date Range</th>
              <th className="py-3 px-4">Days</th>
              <th className="py-3 px-4">Reason</th>
              <th className="py-3 px-4">Status</th>
              {canApprove && <th className="py-3 px-4 text-right">Approval Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">
                  {req.employee?.firstName} {req.employee?.lastName} ({req.employee?.employeeCode})
                </td>
                <td className="py-3.5 px-4 font-semibold text-indigo-300">{req.leaveType?.name}</td>
                <td className="py-3.5 px-4 font-mono">
                  {new Date(req.startDate).toISOString().split('T')[0]} to {new Date(req.endDate).toISOString().split('T')[0]}
                </td>
                <td className="py-3.5 px-4 font-bold text-indigo-400">{req.totalDays} days</td>
                <td className="py-3.5 px-4 max-w-xs truncate">{req.reason}</td>
                <td className="py-3.5 px-4">
                  <Badge variant={req.status === 'APPROVED' ? 'success' : req.status === 'PENDING' ? 'warning' : 'danger'}>
                    {req.status}
                  </Badge>
                </td>
                {canApprove && (
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {req.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleProcess(req.id, 'APPROVE')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 font-bold"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleProcess(req.id, 'REJECT')}
                          className="px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 border border-rose-500/30 font-bold"
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

      {/* Apply Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit Leave Request">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Leave Type *</label>
            <select
              required
              value={requestForm.leaveTypeId}
              onChange={(e) => setRequestForm({ ...requestForm, leaveTypeId: e.target.value })}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
            >
              <option value="">Select Leave Category</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>{t.name} (Max {t.maxDaysPerYear} Days/yr)</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={requestForm.startDate}
                onChange={(e) => setRequestForm({ ...requestForm, startDate: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">End Date *</label>
              <input
                type="date"
                required
                value={requestForm.endDate}
                onChange={(e) => setRequestForm({ ...requestForm, endDate: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Reason *</label>
            <textarea
              required
              value={requestForm.reason}
              onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white h-20"
              placeholder="Reason for taking leave..."
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold glow-indigo">Submit Request</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
