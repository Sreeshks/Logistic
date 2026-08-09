import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, ShieldCheck, UserCheck } from 'lucide-react';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Card } from '../../components/ui/Card';
import { DataTable, Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { authApi } from '../../api/auth.api';
import { AdminUser } from '../../types/auth';
import { formatDate } from '../../utils/format';

export const AdminUsersPage: React.FC = () => {
  const { data: currentAdmin, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await authApi.getMe();
      return res.data;
    },
  });

  const columns: Column<AdminUser>[] = [
    {
      header: 'Admin Name',
      accessor: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900">{row.name}</span>
            <span className="text-[11px] text-slate-400 font-mono">ID #{row.id}</span>
          </div>
        </div>
      ),
    },
    { header: 'Email Address', accessor: 'email' },
    {
      header: 'Role',
      accessor: (row) => <StatusBadge status={row.role} type="role" />,
      className: 'w-32',
    },
    {
      header: 'Account Status',
      accessor: (row) => <StatusBadge status={row.is_active} />,
      className: 'w-28',
    },
    {
      header: 'Created Date',
      accessor: (row) => formatDate(row.created_at),
      className: 'w-28',
    },
  ];

  const adminList: AdminUser[] = currentAdmin ? [currentAdmin] : [];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'System' }, { label: 'Admin Users' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Admin User Management</h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage system administrators and role-based permissions (Super Admin privileges required)
          </p>
        </div>
      </div>

      <Card title="System Administrators">
        <DataTable
          columns={columns}
          data={adminList}
          isLoading={isLoading}
          keyExtractor={(row) => row.id}
          emptyTitle="No admin users found"
        />
      </Card>
    </div>
  );
};
