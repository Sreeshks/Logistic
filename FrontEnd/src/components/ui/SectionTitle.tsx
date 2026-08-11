import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SectionTitleProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  light?: boolean;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
  className,
  light = false,
}) => {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div className={twMerge(clsx('flex flex-col mb-12', alignClasses[align], className))}>
      {badge && (
        <span
          className={clsx(
            'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3',
            light
              ? 'bg-primary/20 text-primary border border-primary/30'
              : 'bg-primary/10 text-primary border border-primary/20'
          )}
        >
          {badge}
        </span>
      )}
      <h2
        className={clsx(
          'text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight',
          light ? 'text-white' : 'text-slate-900'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={clsx(
            'mt-4 text-base sm:text-lg max-w-3xl font-normal leading-relaxed',
            light ? 'text-slate-300' : 'text-slate-600'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
