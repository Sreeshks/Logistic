import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  message = 'There is currently no data to display in this section.',
  icon,
  action,
  className,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl my-6 ${className || ''}`}>
      <div className="p-4 bg-white rounded-full text-slate-400 shadow-sm mb-4">
        {icon || <Inbox className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{message}</p>
      {action}
    </div>
  );
};
