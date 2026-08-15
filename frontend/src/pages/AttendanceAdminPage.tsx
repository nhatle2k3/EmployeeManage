import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { AttendanceRecord } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { CalendarCheck, Search, Filter, Edit3, Wifi, AlertTriangle } from 'lucide-react';

export const AttendanceAdminPage: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [adjustForm, setAdjustForm] = useState({ adjustedCheckIn: '', adjustedCheckOut: '', reason: '' });
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (statusFilter) params.status = statusFilter;

      const res = await api.get('/attendance/history', { params });
      setRecords(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [startDate, endDate, statusFilter]);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    try {
      await api.post(`/attendance/adjust/${selectedRecord.id}`, adjustForm);
      setSelectedRecord(null);
      fetchRecords();
      alert('Attendance adjusted successfully with audit log!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to adjust attendance');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-indigo-400" />
            <span>Attendance Records & HR Adjustments</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Audit attendance logs, CIDR network validation data, and manual adjustments</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-slate-400 font-semibold">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-slate-400 font-semibold">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-slate-400 font-semibold">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
          >
            <option value="">All Statuses</option>
            <option value="PRESENT">PRESENT</option>
            <option value="LATE">LATE</option>
            <option value="EARLY_LEAVE">EARLY LEAVE</option>
            <option value="ABSENT">ABSENT</option>
            <option value="ON_LEAVE">ON LEAVE</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Check-In</th>
              <th className="py-3 px-4">Check-Out</th>
              <th className="py-3 px-4">Network / IP</th>
              <th className="py-3 px-4">Hours</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">HR Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {records.map((rec) => (
              <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-mono">{new Date(rec.date).toISOString().split('T')[0]}</td>
                <td className="py-3.5 px-4 font-bold text-white">
                  {rec.employee?.firstName} {rec.employee?.lastName} ({rec.employee?.employeeCode})
                </td>
                <td className="py-3.5 px-4">{rec.employee?.department?.name || 'N/A'}</td>
                <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">
                  {rec.checkInTime ? new Date(rec.checkInTime).toLocaleTimeString() : 'N/A'}
                </td>
                <td className="py-3.5 px-4 font-mono text-purple-400 font-semibold">
                  {rec.checkOutTime ? new Date(rec.checkOutTime).toLocaleTimeString() : 'N/A'}
                </td>
                <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                  {rec.ipAddress} ({rec.networkName || 'Internal Network'})
                </td>
                <td className="py-3.5 px-4 font-bold text-indigo-400">{rec.workingHours} hrs</td>
                <td className="py-3.5 px-4">
                  <Badge variant={rec.status === 'PRESENT' ? 'success' : rec.status === 'LATE' ? 'warning' : 'danger'}>
                    {rec.status}
                  </Badge>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => {
                      setSelectedRecord(rec);
                      setAdjustForm({
                        adjustedCheckIn: rec.checkInTime ? new Date(rec.checkInTime).toISOString().slice(0, 16) : '',
                        adjustedCheckOut: rec.checkOutTime ? new Date(rec.checkOutTime).toISOString().slice(0, 16) : '',
                        reason: '',
                      });
                    }}
                    className="p-1.5 text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                    title="Manual Adjustment"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manual Adjustment Modal */}
      {selectedRecord && (
        <Modal isOpen={!!selectedRecord} onClose={() => setSelectedRecord(null)} title="HR Manual Attendance Adjustment">
          <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <p className="font-bold text-white">{selectedRecord.employee?.firstName} {selectedRecord.employee?.lastName}</p>
              <p className="text-slate-400 font-mono">Date: {new Date(selectedRecord.date).toLocaleDateString()}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Adjusted Check-In Time</label>
                <input
                  type="datetime-local"
                  value={adjustForm.adjustedCheckIn}
                  onChange={(e) => setAdjustForm({ ...adjustForm, adjustedCheckIn: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Adjusted Check-Out Time</label>
                <input
                  type="datetime-local"
                  value={adjustForm.adjustedCheckOut}
                  onChange={(e) => setAdjustForm({ ...adjustForm, adjustedCheckOut: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Adjustment Reason (Required for Audit Trail) *</label>
              <textarea
                required
                value={adjustForm.reason}
                onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                placeholder="Manager approved late check-in due to corporate offsite meeting."
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white h-20"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setSelectedRecord(null)} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-amber-600 text-white font-bold glow-indigo">Save Adjustment</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
