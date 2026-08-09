import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = true,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300',
          hoverEffect && 'hover:shadow-xl hover:-translate-y-1 hover:border-slate-300',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
