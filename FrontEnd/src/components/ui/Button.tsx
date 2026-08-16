import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<'button'>>, HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'accent',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  style,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-extrabold tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer rounded-2xl overflow-hidden group shadow-md hover:shadow-xl active:scale-95';

  const variants = {
    accent:
      'bg-primary text-white hover:brightness-110 focus:ring-primary border border-white/20 shadow-md hover:shadow-primary/30',
    primary:
      'bg-secondary text-white hover:brightness-125 focus:ring-secondary border border-slate-700/50',
    secondary:
      'bg-slate-800 text-slate-100 hover:bg-slate-700 focus:ring-slate-800 border border-slate-700',
    outline:
      'border-2 border-slate-300 text-slate-800 bg-white/90 backdrop-blur-md hover:bg-primary hover:text-white hover:border-primary focus:ring-primary',
    ghost:
      'text-slate-700 hover:bg-slate-100 focus:ring-slate-400',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs font-bold gap-1.5',
    md: 'px-6 py-3 text-sm font-bold gap-2',
    lg: 'px-8 py-4 text-base font-extrabold gap-2.5',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={disabled || isLoading}
      style={style}
      {...props}
    >
      {/* Animated Shine Highlight Effect */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0 group-hover:-translate-x-0.5 transition-transform">{leftIcon}</span>
      )}
      <span className="relative z-10">{children}</span>
      {!isLoading && rightIcon && (
        <span className="shrink-0 group-hover:translate-x-1 transition-transform duration-300">{rightIcon}</span>
      )}
    </motion.button>
  );
};
