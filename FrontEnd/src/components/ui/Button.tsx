import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer rounded-md';

  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900 shadow-md hover:shadow-lg',
    secondary: 'bg-blue-900 text-white hover:bg-blue-950 focus:ring-blue-900 shadow-md',
    accent: 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500 shadow-md hover:shadow-lg',
    outline: 'border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white focus:ring-slate-900',
    ghost: 'text-slate-700 hover:bg-slate-100 focus:ring-slate-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-semibold gap-1.5',
    md: 'px-5 py-2.5 text-sm font-semibold gap-2',
    lg: 'px-7 py-3.5 text-base font-semibold gap-2.5',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
