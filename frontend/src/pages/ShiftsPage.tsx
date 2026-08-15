import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { WorkShift, Employee } from '../types';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { Clock, Plus, UserCheck, Calendar } from 'lucide-react';

export const ShiftsPage: React.FC = () => {
  const [shifts, setShifts] = useState<WorkShift[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<WorkShift | null>(null);

  const [shiftForm, setShiftForm] = useState({
    code: '',
    name: '',
    startTime: '08:00',
    endTime: '17:00',
    breakStartTime: '12:00',
    breakEndTime: '13:00',
    lateToleranceMins: 15,
    earlyLeaveToleranceMins: 15,
    isOvernight: false,
  });

  const [assignForm, setAssignForm] = useState({
    employeeId: '',
    shiftId: '',
    startDate: new Date().toISOString().split('T')[0],
  });

  const fetchData = async () => {
    try {
      const [shiftRes, empRes] = await Promise.all([api.get('/shifts'), api.get('/employees')]);
      setShifts(shiftRes.data);
      setEmployees(empRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateShift = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/shifts', shiftForm);
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create shift');
    }
  };

  const handleAssignShift = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/shifts/assign', assignForm);
      setIsAssignModalOpen(false);
      alert('Shift assigned successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to assign shift');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-400" />
            <span>Work Shift Management</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Configure work hours, tolerances & employee shift scheduling</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg glow-indigo flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Assign Shift to Employee</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg glow-indigo flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Shift</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {shifts.map((shift) => (
          <div key={shift.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold border border-indigo-500/20">
                {shift.code}
              </span>
              {shift.isOvernight && <Badge variant="warning">Night Shift</Badge>}
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-white">{shift.name}</h3>
              <p className="text-xl font-mono font-bold text-indigo-400 mt-1">
                {shift.startTime} - {shift.endTime}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Break Hours:</span>
                <span className="text-slate-200 font-mono">{shift.breakStartTime || 'N/A'} - {shift.breakEndTime || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Late Grace Period:</span>
                <span className="text-emerald-400 font-bold">{shift.lateToleranceMins} mins</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Early Leave Grace:</span>
                <span className="text-purple-400 font-bold">{shift.earlyLeaveToleranceMins} mins</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Shift Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Custom Work Shift">
        <form onSubmit={handleCreateShift} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Shift Code *</label>
              <input
                type="text"
                required
                value={shiftForm.code}
                onChange={(e) => setShiftForm({ ...shiftForm, code: e.target.value })}
                placeholder="FLEX-01"
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Shift Name *</label>
              <input
                type="text"
                required
                value={shiftForm.name}
                onChange={(e) => setShiftForm({ ...shiftForm, name: e.target.value })}
                placeholder="Morning Flexible Shift"
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Start Time *</label>
              <input
                type="time"
                required
                value={shiftForm.startTime}
                onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">End Time *</label>
              <input
                type="time"
                required
                value={shiftForm.endTime}
                onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Late Tolerance (mins)</label>
              <input
                type="number"
                value={shiftForm.lateToleranceMins}
                onChange={(e) => setShiftForm({ ...shiftForm, lateToleranceMins: parseInt(e.target.value) })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Early Leave Tolerance (mins)</label>
              <input
                type="number"
                value={shiftForm.earlyLeaveToleranceMins}
                onChange={(e) => setShiftForm({ ...shiftForm, earlyLeaveToleranceMins: parseInt(e.target.value) })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold glow-indigo">Create Shift</button>
          </div>
        </form>
      </Modal>

      {/* Assign Shift Modal */}
      <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title="Assign Shift to Employee">
        <form onSubmit={handleAssignShift} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Select Employee *</label>
            <select
              required
              value={assignForm.employeeId}
              onChange={(e) => setAssignForm({ ...assignForm, employeeId: e.target.value })}
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

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Select Shift *</label>
            <select
              required
              value={assignForm.shiftId}
              onChange={(e) => setAssignForm({ ...assignForm, shiftId: e.target.value })}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
            >
              <option value="">Choose Work Shift</option>
              {shifts.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.startTime} - {s.endTime})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Effective Start Date *</label>
            <input
              type="date"
              required
              value={assignForm.startDate}
              onChange={(e) => setAssignForm({ ...assignForm, startDate: e.target.value })}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAssignModalOpen(false)} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-purple-600 text-white font-bold glow-indigo">Assign Shift</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
