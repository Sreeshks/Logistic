import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load content',
  message = 'We encountered an issue connecting to the server. Please try again later.',
  onRetry,
  className,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-red-50/50 border border-red-100 rounded-xl my-6 ${className || ''}`}>
      <div className="p-3 bg-red-100 rounded-full text-red-600 mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 max-w-md mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} leftIcon={<RefreshCw className="w-4 h-4" />}>
          Try Again
        </Button>
      )}
    </div>
  );
};
