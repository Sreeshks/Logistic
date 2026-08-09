import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  color?: 'blue' | 'indigo' | 'emerald' | 'amber' | 'purple' | 'rose';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'blue',
}) => {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-start justify-between">
      <div className="flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</span>
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        {subtitle && <span className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</span>}
        {trend && <span className="text-xs text-emerald-600 font-semibold mt-1">{trend}</span>}
      </div>
      <div className={`p-3 rounded-xl border ${colorStyles[color]}`}>
        {icon}
      </div>
    </div>
  );
};
