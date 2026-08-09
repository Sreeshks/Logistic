import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center text-xs font-medium text-slate-500 mb-4">
      <Link to="/dashboard" className="flex items-center hover:text-slate-800 transition">
        <Home className="w-3.5 h-3.5 mr-1 text-slate-400" />
        Dashboard
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-300 shrink-0" />
          {item.href && idx < items.length - 1 ? (
            <Link to={item.href} className="hover:text-slate-800 transition">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 font-semibold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
