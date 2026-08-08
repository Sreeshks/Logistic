import React, { forwardRef } from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const checkboxId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex items-start gap-2">
        <input
          id={checkboxId}
          type="checkbox"
          ref={ref}
          className={`h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5 ${className}`}
          {...props}
        />
        {label && (
          <label htmlFor={checkboxId} className="text-sm font-medium text-slate-700 select-none cursor-pointer">
            {label}
          </label>
        )}
        {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
