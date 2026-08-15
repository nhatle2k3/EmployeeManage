import React, { useState, useEffect } from 'react';
import { Sun, Moon, LogOut, Bell, ShieldCheck, Wifi, Menu, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useRealtime } from '../../context/RealtimeContext';
import { api } from '../../services/api';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isConnected, lastEvent } = useRealtime();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n: any) => !n.isRead).length);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  useEffect(() => {
    if (lastEvent && (lastEvent.type === 'NOTIFICATION' || lastEvent.type === 'LEAVE_REQUEST' || lastEvent.type === 'LEAVE_PROCESSED' || lastEvent.type === 'OVERTIME_REQUEST' || lastEvent.type === 'OVERTIME_PROCESSED')) {
      fetchNotifications();
    }
  }, [lastEvent]);

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="h-16 bg-slate-900/60 border-b border-slate-800 backdrop-blur-xl sticky top-0 z-10 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-400 hover:text-white bg-slate-800/60 rounded-xl border border-slate-700/50 md:hidden"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Wifi className="w-3.5 h-3.5" />
          <span>Internal Network Enforced</span>
        </div>

        {/* Real-time Status Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <Zap className={`w-3.5 h-3.5 ${isConnected ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
          <span>{isConnected ? 'Real-Time SSE Live' : 'Real-Time Reconnecting...'}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-white bg-slate-800/60 rounded-xl border border-slate-700/50 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="relative p-2 text-slate-400 hover:text-white bg-slate-800/60 rounded-xl border border-slate-700/50 transition-colors focus:outline-none"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden text-xs">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                <span className="font-extrabold text-white tracking-wide flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-400" />
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-mono text-[10px]">
                      {unreadCount} unread
                    </span>
                  )}
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.length > 0 ? (
                  notifications.slice(0, 8).map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 transition-colors ${n.isRead ? 'opacity-60 bg-transparent' : 'bg-indigo-950/20'}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-white tracking-tight">{n.title}</p>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-500">No notifications yet.</div>
                )}
              </div>

              <div className="p-2 border-t border-slate-800 bg-slate-950/60 text-center">
                <a
                  href="/notifications"
                  onClick={() => setIsDropdownOpen(false)}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold block py-1"
                >
                  View All Notifications →
                </a>
              </div>
            </div>
          )}
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="text-right">
            <p className="text-xs font-bold text-white">
              {user?.employee ? `${user.employee.firstName} ${user.employee.lastName}` : user?.email}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl border border-rose-500/20 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
