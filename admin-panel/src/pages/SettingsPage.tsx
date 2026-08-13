import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, User, Lock, Server, Terminal, ExternalLink, BookOpen, ArrowRight } from 'lucide-react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Card } from '../components/ui/Card';

export const SettingsPage: React.FC = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

  return (
    <div className="space-y-6 max-w-3xl">
      <Breadcrumb items={[{ label: 'Settings' }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Settings & Application Info</h1>
          <p className="text-xs text-slate-500 font-medium">Global platform parameters and API connection status</p>
        </div>
      </div>

      {/* User Documentation Guide Banner Card */}
      <Card title="Platform Documentation & User Guide" subtitle="Non-technical administrator manual for managing the website & admin panel">
        <Link
          to="/docs"
          className="p-5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/70 transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                Open Administrator & User Guide
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Learn how to edit website pages, manage Air/Sea services, upload images, set SEO tags, and track orders.
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform shrink-0 ml-3" />
        </Link>
      </Card>

      <Card title="Quick Security & Profile Shortcuts">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/profile"
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg">
                <User className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">Admin Profile</span>
                <span className="text-[11px] text-slate-500">View role & update name</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
          </Link>

          <Link
            to="/profile"
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-lg">
                <Lock className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">Change Password</span>
                <span className="text-[11px] text-slate-500">Update security credentials</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
          </Link>
        </div>
      </Card>

      <Card title="Application & Server Information">
        <div className="space-y-3 text-xs font-medium">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Frontend Environment</span>
            <span className="font-bold text-slate-900">React + Vite + TypeScript</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Backend API URL</span>
            <span className="font-mono text-blue-600">{apiBaseUrl}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Backend Server</span>
            <span className="font-bold text-slate-900">FastAPI + Uvicorn</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Database Engine</span>
            <span className="font-bold text-slate-900">SQLAlchemy 2.0 (SQLite / PostgreSQL-ready)</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-500">API Documentation</span>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
            >
              Swagger UI Docs <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
};
