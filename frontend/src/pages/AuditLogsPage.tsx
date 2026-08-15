import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { AuditLogItem } from '../types';
import { ShieldAlert, Search, Filter } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/audit-logs');
      setLogs(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-400">Loading Audit Logs...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-indigo-400" />
          <span>System Audit Trail</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">Immutable security log of user actions, permissions, attendance adjustments, and payroll operations</p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Entity Target</th>
              <th className="py-3 px-4">Details</th>
              <th className="py-3 px-4">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200 font-mono">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="py-3 px-4 text-indigo-300 font-sans font-semibold">{log.userEmail || 'System'}</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">{log.action}</td>
                <td className="py-3 px-4 text-purple-400 font-bold">{log.entity}</td>
                <td className="py-3 px-4 max-w-sm truncate text-slate-300 font-sans" title={log.details}>
                  {log.details || 'N/A'}
                </td>
                <td className="py-3 px-4 text-slate-400">{log.ipAddress || '127.0.0.1'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
