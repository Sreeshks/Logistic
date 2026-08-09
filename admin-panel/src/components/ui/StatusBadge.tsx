import React from 'react';

interface StatusBadgeProps {
  status: string | boolean;
  type?: 'status' | 'role' | 'boolean' | 'contact';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'status' }) => {
  const normalize = String(status).toUpperCase();

  const getStyles = () => {
    switch (normalize) {
      case 'PUBLISHED':
      case 'RESOLVED':
      case 'ACTIVE':
      case 'TRUE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'DRAFT':
      case 'READ':
      case 'ADMIN':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'IN_PROGRESS':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'NEW':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold';
      case 'ARCHIVED':
      case 'SPAM':
      case 'INACTIVE':
      case 'FALSE':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'SUPER_ADMIN':
        return 'bg-purple-50 text-purple-700 border-purple-200 font-semibold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getLabel = () => {
    if (typeof status === 'boolean') {
      return status ? 'Active' : 'Inactive';
    }
    return String(status).replace(/_/g, ' ');
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles()}`}
    >
      {getLabel()}
    </span>
  );
};
