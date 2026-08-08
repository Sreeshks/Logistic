import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Trash2, Mail } from 'lucide-react';
import { contactApi } from '../../api/contact.api';
import { toast } from '../../hooks/useToast';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { SearchBar } from '../../components/ui/SearchBar';
import { FilterBar } from '../../components/ui/FilterBar';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Pagination } from '../../components/ui/Pagination';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ContactMessage, ContactStatus } from '../../types/contact';
import { formatDate } from '../../utils/format';

export const ContactListPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContactStatus | ''>('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['contact-messages', page, limit, search, statusFilter],
    queryFn: async () => {
      const res = await contactApi.getMessages({
        page,
        limit,
        search,
        status: statusFilter || undefined,
      });
      return res;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => contactApi.deleteMessage(id),
    onSuccess: () => {
      toast.success('Contact message deleted');
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      setDeleteId(null);
    },
  });

  const columns: Column<ContactMessage>[] = [
    {
      header: 'Sender Name',
      accessor: (row) => <span className="font-bold text-slate-900">{row.name}</span>,
    },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    {
      header: 'Subject',
      accessor: (row) => <span className="font-semibold text-slate-800 line-clamp-1">{row.subject}</span>,
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.status} />,
      className: 'w-28',
    },
    {
      header: 'Submitted Date',
      accessor: (row) => formatDate(row.created_at),
      className: 'w-28',
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/contact-messages/${row.id}`}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setDeleteId(row.id)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md"
            title="Delete Message"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      className: 'w-24',
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Contact Messages' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Contact Enquiries & Quotes</h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage quote requests and customer contact form submissions
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search by name, email, subject..."
        />

        <FilterBar>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as ContactStatus | '');
              setPage(1);
            }}
            className="bg-white border border-slate-300 text-slate-700 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="READ">Read</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="SPAM">Spam</option>
          </select>
        </FilterBar>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        keyExtractor={(row) => row.id}
        onRowClick={(row) => navigate(`/contact-messages/${row.id}`)}
        emptyTitle="No contact messages"
        emptyDescription="Enquiries submitted by clients through the public website will show here."
      />

      {data?.pagination && (
        <Pagination
          metadata={data.pagination}
          onPageChange={setPage}
          onLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
        />
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Message"
        message="Are you sure you want to delete this enquiry? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
