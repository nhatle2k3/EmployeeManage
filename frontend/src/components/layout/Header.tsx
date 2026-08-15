import React, { useState, useEffect } from 'react';
import { Sun, Moon, LogOut, Bell, ShieldCheck, Wifi } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        setUnreadCount(res.data.filter((n: any) => !n.isRead).length);
      } catch (e) {
        // ignore
      }
    };
    if (user) fetchNotifications();
  }, [user]);

  return (
    <header className="h-16 bg-slate-900/60 border-b border-slate-800 backdrop-blur-xl sticky top-0 z-10 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Wifi className="w-3.5 h-3.5" />
          <span>Internal Network Enforced</span>
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

        {/* Notifications Icon */}
        <a
          href="/notifications"
          className="relative p-2 text-slate-400 hover:text-white bg-slate-800/60 rounded-xl border border-slate-700/50 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </a>

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
