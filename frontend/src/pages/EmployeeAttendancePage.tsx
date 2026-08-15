import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Badge } from '../components/common/Badge';
import { Clock, Wifi, ShieldAlert, CheckCircle2, XCircle, LogIn, LogOut, Smartphone, AlertOctagon } from 'lucide-react';

export const EmployeeAttendancePage: React.FC = () => {
  const [statusData, setStatusData] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchTodayStatus = async () => {
    try {
      setErrorMsg('');
      const res = await api.get('/attendance/today');
      setStatusData(res.data);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to fetch attendance status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayStatus();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = async () => {
    setActionLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.post('/attendance/check-in', {
        deviceId: 'WEB-BROWSER-KIOSK',
        deviceName: 'Employee Web Portal',
      });
      setSuccessMsg('Check-in recorded successfully!');
      fetchTodayStatus();
    } catch (err: any) {
      if (err.response?.data?.errorCode === 'ATTENDANCE_NETWORK_NOT_ALLOWED') {
        setErrorMsg('ATTENDANCE_NETWORK_NOT_ALLOWED: You are outside an approved company network. Attendance rejected.');
      } else {
        setErrorMsg(err.response?.data?.message || 'Check-in failed');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.post('/attendance/check-out', {
        deviceId: 'WEB-BROWSER-KIOSK',
        deviceName: 'Employee Web Portal',
      });
      setSuccessMsg('Check-out recorded successfully!');
      fetchTodayStatus();
    } catch (err: any) {
      if (err.response?.data?.errorCode === 'ATTENDANCE_NETWORK_NOT_ALLOWED') {
        setErrorMsg('ATTENDANCE_NETWORK_NOT_ALLOWED: You are outside an approved company network. Attendance rejected.');
      } else {
        setErrorMsg(err.response?.data?.message || 'Check-out failed');
      }
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Attendance Kiosk...</div>;
  }

  const networkInfo = statusData?.networkCheck || {};
  const record = statusData?.record;
  const shift = statusData?.currentShift;
  const isAllowedNetwork = networkInfo.isAllowed;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 glass-panel flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-400" />
            <span>Attendance Kiosk</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Real-time IP CIDR restricted check-in & check-out</p>
        </div>

        {/* Digital Clock Widget */}
        <div className="px-6 py-3 rounded-2xl bg-slate-950/80 border border-indigo-500/30 text-center glow-indigo">
          <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">Current System Time</p>
          <p className="text-2xl font-mono font-extrabold text-white tracking-wider">
            {currentTime.toLocaleTimeString()}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">{currentTime.toLocaleDateString()}</p>
        </div>
      </div>

      {/* Network Restriction Alert */}
      {!isAllowedNetwork ? (
        <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-rose-400 uppercase tracking-wide">
                ATTENDANCE_NETWORK_NOT_ALLOWED
              </h3>
              <p className="text-xs text-rose-200">
                Your client IP <span className="font-mono font-bold">{networkInfo.clientIp}</span> is outside approved company CIDR network subnets.
              </p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 text-xs text-slate-300 border border-rose-500/20">
            <strong>Security Enforcement Notice:</strong> Attendance check-in and check-out capabilities are disabled. Please connect to company office Wi-Fi or approved VPN subnet.
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4" />
            <span>Connected to Trusted Network: <strong>{networkInfo.networkName}</strong> ({networkInfo.clientIp})</span>
          </div>
          <Badge variant="success">AUTHORIZED</Badge>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          {successMsg}
        </div>
      )}

      {/* Main Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Current Shift */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Assigned Shift</p>
          <h3 className="text-lg font-extrabold text-white mt-2">{shift?.name || 'Standard Shift (8AM - 5PM)'}</h3>
          <p className="text-xs text-indigo-400 font-mono mt-1">
            {shift?.startTime || '08:00'} - {shift?.endTime || '17:00'}
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
            <span>Late Tolerance:</span>
            <span className="font-semibold text-slate-200">{shift?.lateToleranceMins || 15} mins</span>
          </div>
        </div>

        {/* Check-In Status */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Check-In</p>
          {record?.checkInTime ? (
            <div>
              <p className="text-xl font-mono font-extrabold text-emerald-400 mt-2">
                {new Date(record.checkInTime).toLocaleTimeString()}
              </p>
              <Badge variant={record.status === 'PRESENT' ? 'success' : 'warning'} className="mt-2">
                {record.status}
              </Badge>
            </div>
          ) : (
            <div>
              <p className="text-lg font-bold text-slate-500 mt-2">Not Checked In</p>
              <Badge variant="secondary" className="mt-2">PENDING</Badge>
            </div>
          )}
        </div>

        {/* Check-Out Status */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Check-Out</p>
          {record?.checkOutTime ? (
            <div>
              <p className="text-xl font-mono font-extrabold text-purple-400 mt-2">
                {new Date(record.checkOutTime).toLocaleTimeString()}
              </p>
              <p className="text-xs text-slate-300 mt-2">
                Working Hours: <strong>{record.workingHours} hrs</strong>
              </p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-bold text-slate-500 mt-2">Not Checked Out</p>
              <Badge variant="secondary" className="mt-2">PENDING</Badge>
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 glass-panel text-center space-y-6">
        <h3 className="text-xl font-bold text-white">Attendance Operations</h3>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 max-w-md mx-auto">
          <button
            onClick={handleCheckIn}
            disabled={!isAllowedNetwork || actionLoading || !!record?.checkInTime}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-base shadow-xl glow-emerald transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            <span>CHECK IN</span>
          </button>

          <button
            onClick={handleCheckOut}
            disabled={!isAllowedNetwork || actionLoading || !record?.checkInTime || !!record?.checkOutTime}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-base shadow-xl glow-indigo transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            <span>CHECK OUT</span>
          </button>
        </div>

        {!isAllowedNetwork && (
          <p className="text-xs text-rose-400 font-semibold">
            Buttons are disabled because you are outside an approved company network.
          </p>
        )}
      </div>
    </div>
  );
};
