import React, { useEffect, useState } from 'react';
import { useRealtime } from '../../context/RealtimeContext';
import { Bell, CheckCircle2, AlertCircle, Clock, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  timestamp?: string;
}

export const ToastContainer: React.FC = () => {
  const { lastEvent } = useRealtime();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    if (!lastEvent) return;

    let title = 'Thông báo hệ thống';
    let message = 'Có cập nhật mới trên hệ thống.';
    let type: ToastItem['type'] = 'info';

    switch (lastEvent.type) {
      case 'LEAVE_REQUEST':
        title = '📋 Đề xuất xin nghỉ phép mới';
        message = lastEvent.payload?.message || `${lastEvent.payload?.employeeName || 'Nhân viên'} vừa gửi đơn xin nghỉ phép.`;
        type = 'info';
        break;
      case 'LEAVE_PROCESSED':
        title = '✅ Kết quả đơn xin nghỉ phép';
        message = lastEvent.payload?.message || `Đơn xin nghỉ phép đã được xử lý.`;
        type = lastEvent.payload?.status === 'APPROVED' ? 'success' : 'error';
        break;
      case 'OVERTIME_REQUEST':
        title = '⏰ Đề xuất làm tăng ca (OT)';
        message = lastEvent.payload?.message || `${lastEvent.payload?.employeeName || 'Nhân viên'} vừa đăng ký làm tăng ca.`;
        type = 'warning';
        break;
      case 'OVERTIME_PROCESSED':
        title = '⚡ Kết quả đơn đăng ký tăng ca';
        message = lastEvent.payload?.message || `Đơn đăng ký tăng ca (OT) đã được xử lý.`;
        type = lastEvent.payload?.status === 'APPROVED' ? 'success' : 'error';
        break;
      case 'ATTENDANCE_CHECKIN':
        title = '🟢 Điểm danh Check-in';
        message = `${lastEvent.payload?.employeeName || 'Nhân viên'} vừa thực hiện Check-in thành công.`;
        type = 'success';
        break;
      case 'ATTENDANCE_CHECKOUT':
        title = '🔴 Điểm danh Check-out';
        message = `${lastEvent.payload?.employeeName || 'Nhân viên'} vừa thực hiện Check-out thành công.`;
        type = 'info';
        break;
      case 'NOTIFICATION':
        title = lastEvent.payload?.title || '🔔 Thông báo mới';
        message = lastEvent.payload?.message || 'Bạn có thông báo mới từ hệ thống HRMS.';
        type = 'info';
        break;
      default:
        return;
    }

    const newToast: ToastItem = {
      id: `${Date.now()}-${Math.random()}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setToasts((prev) => [newToast, ...prev].slice(0, 4));

    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 6000);

    return () => clearTimeout(timer);
  }, [lastEvent]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto p-4 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-indigo-500/30 shadow-2xl shadow-indigo-950/50 text-white flex items-start gap-3 transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-top-4"
        >
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : toast.type === 'warning' ? (
              <Clock className="w-5 h-5 text-amber-400" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            ) : (
              <Bell className="w-5 h-5 text-indigo-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-extrabold text-white truncate tracking-wide">{toast.title}</h4>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">{toast.timestamp}</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">{toast.message}</p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
