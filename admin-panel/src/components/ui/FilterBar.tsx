import React from 'react';
import { Filter } from 'lucide-react';

interface FilterBarProps {
  children: React.ReactNode;
}

export const FilterBar: React.FC<FilterBarProps> = ({ children }) => {
  return (
    <div className="flex flex-wrap items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl mb-4 shadow-xs">
      <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1">
        <Filter className="w-3.5 h-3.5 mr-1" />
        Filters:
      </div>
      {children}
    </div>
  );
};
