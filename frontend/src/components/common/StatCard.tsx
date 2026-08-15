import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'indigo' | 'emerald' | 'rose' | 'amber' | 'cyan' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, color = 'indigo' }) => {
  const colorMap = {
    indigo: 'from-indigo-600/20 to-indigo-900/10 text-indigo-400 border-indigo-500/20 glow-indigo',
    emerald: 'from-emerald-600/20 to-emerald-900/10 text-emerald-400 border-emerald-500/20 glow-emerald',
    rose: 'from-rose-600/20 to-rose-900/10 text-rose-400 border-rose-500/20 glow-rose',
    amber: 'from-amber-600/20 to-amber-900/10 text-amber-400 border-amber-500/20',
    cyan: 'from-cyan-600/20 to-cyan-900/10 text-cyan-400 border-cyan-500/20',
    purple: 'from-purple-600/20 to-purple-900/10 text-purple-400 border-purple-500/20',
  };

  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-br glass-panel border transition-all duration-300 hover:scale-[1.02] ${colorMap[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">{title}</p>
          <h3 className="text-3xl font-extrabold text-white mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
