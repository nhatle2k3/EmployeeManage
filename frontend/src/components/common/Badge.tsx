import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'secondary';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'info', className = '' }) => {
  const styles = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    info: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    secondary: 'bg-slate-700/50 text-slate-300 border-slate-600/30',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border inline-flex items-center gap-1 ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};
