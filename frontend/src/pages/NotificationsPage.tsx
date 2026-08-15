import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { NotificationItem } from '../types';
import { Bell, Check, CheckCheck } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading Notifications...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-400" />
            <span>In-App Notifications</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Alerts for leave approvals, attendance updates, and payslips</p>
        </div>

        <button
          onClick={markAllRead}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2"
        >
          <CheckCheck className="w-4 h-4 text-emerald-400" />
          <span>Mark All as Read</span>
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all ${
                n.isRead
                  ? 'bg-slate-900/40 border-slate-800/60 opacity-70'
                  : 'bg-slate-900 border-indigo-500/30 glass-panel glow-indigo'
              } flex items-center justify-between`}
            >
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{n.title}</span>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  )}
                </h4>
                <p className="text-xs text-slate-300">{n.message}</p>
                <p className="text-[10px] text-slate-500 font-mono">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-colors"
                  title="Mark as Read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-500 bg-slate-900/60 rounded-2xl border border-slate-800">
            No notifications available.
          </div>
        )}
      </div>
    </div>
  );
};
