import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Star, Truck } from 'lucide-react';
import { servicesApi } from '../../api/services.api';
import { toast } from '../../hooks/useToast';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Button } from '../../components/ui/Button';
import { SearchBar } from '../../components/ui/SearchBar';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Pagination } from '../../components/ui/Pagination';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ImagePreview } from '../../components/ui/ImagePreview';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Service } from '../../types/service';
import { formatDate } from '../../utils/format';

export const ServicesListPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['services', page, limit, search],
    queryFn: async () => {
      const res = await servicesApi.getServices({ page, limit, search });
      return res;
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: (service: Service) =>
      servicesApi.updateService(service.id, { is_featured: !service.is_featured }),
    onSuccess: () => {
      toast.success('Service featured status updated');
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => servicesApi.deleteService(id),
    onSuccess: () => {
      toast.success('Service deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setDeleteId(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete service');
    },
  });

  const columns: Column<Service>[] = [
    {
      header: 'Image',
      accessor: (row) => <ImagePreview src={row.image} alt={row.title} className="w-12 h-12" />,
      className: 'w-16',
    },
    {
      header: 'Service Name',
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.title}</span>
          <span className="text-[11px] text-slate-400 font-mono">/{row.slug}</span>
        </div>
      ),
    },
    {
      header: 'Featured',
      accessor: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFeaturedMutation.mutate(row);
          }}
          className={`p-1.5 rounded-lg transition ${
            row.is_featured ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' : 'text-slate-300 hover:text-amber-400'
          }`}
          title={row.is_featured ? 'Remove from Featured' : 'Mark as Featured'}
        >
          <Star className="w-4 h-4 fill-current" />
        </button>
      ),
      className: 'w-20 text-center',
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.is_active} />,
      className: 'w-24',
    },
    {
      header: 'Order',
      accessor: 'display_order',
      className: 'w-16',
    },
    {
      header: 'Updated',
      accessor: (row) => formatDate(row.updated_at),
      className: 'w-28',
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/services/${row.id}/edit`)}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-md"
            title="Edit Service"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteId(row.id)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md"
            title="Delete Service"
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
      <Breadcrumb items={[{ label: 'Services' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Services Management</h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage company logistics services, descriptions, order, and SEO settings
          </p>
        </div>
        <Link to="/services/create">
          <Button leftIcon={<Plus className="w-4 h-4" />}>Add Service</Button>
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search services by title or description..."
        />
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        keyExtractor={(row) => row.id}
        emptyTitle="No services found"
        emptyDescription="Create your first logistics service to display on the website."
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
        title="Delete Service"
        message="Are you sure you want to delete this service? It will no longer appear on the website."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
