import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Home,
  FileText,
  Truck,
  Image,
  Newspaper,
  HelpCircle,
  Mail,
  Users,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Package,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const navigation = [
    {
      group: 'Main',
      items: [{ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }],
    },
    {
      group: 'Website CMS',
      items: [
        { name: 'Home Page', path: '/website/home', icon: Home },
        { name: 'About Us', path: '/website/about', icon: FileText },
        { name: 'Company Info', path: '/company', icon: Building2 },
      ],
    },
    {
      group: 'Content Management',
      items: [
        { name: 'Services', path: '/services', icon: Truck },
        { name: 'Gallery', path: '/gallery', icon: Image },
        { name: 'Blogs', path: '/blogs', icon: Newspaper },
        { name: 'FAQs', path: '/faqs', icon: HelpCircle },
      ],
    },
    {
      group: 'Enquiries',
      items: [{ name: 'Contact Messages', path: '/contact-messages', icon: Mail }],
    },
    {
      group: 'System',
      items: [
        ...(isSuperAdmin ? [{ name: 'Admin Users', path: '/admin-users', icon: Users }] : []),
        { name: 'Profile', path: '/profile', icon: User },
        { name: 'Settings', path: '/settings', icon: Settings },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 bg-blue-600 rounded-lg text-white font-bold shrink-0 shadow-md">
            <Package className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white tracking-wide">LOGISTICS</span>
              <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest">Admin Panel</span>
            </div>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation items */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navigation.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                {group.group}
              </h4>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                    } ${collapsed ? 'justify-center px-2' : ''}`
                  }
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Info footer */}
      {!collapsed && user && (
        <div className="p-3 m-3 border border-slate-800 rounded-xl bg-slate-950/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center text-xs shrink-0 border border-blue-500/30">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-white truncate">{user.name}</span>
            <span className="text-[10px] text-slate-500 font-mono truncate">{user.role}</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block fixed top-0 left-0 bottom-0 z-40 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <aside
        className={`md:hidden fixed top-0 left-0 bottom-0 z-50 w-64 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
