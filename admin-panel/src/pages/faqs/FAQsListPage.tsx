import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Edit, Trash2, HelpCircle } from 'lucide-react';
import { faqSchema, FAQFormData } from '../../schemas/faq.schema';
import { faqApi } from '../../api/faq.api';
import { toast } from '../../hooks/useToast';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { SearchBar } from '../../components/ui/SearchBar';
import { Switch } from '../../components/ui/Switch';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable, Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Pagination } from '../../components/ui/Pagination';
import { FAQ } from '../../types/faq';

export const FAQsListPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['faqs', page, limit, search],
    queryFn: async () => {
      const res = await faqApi.getFAQs({ page, limit, search });
      return res;
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FAQFormData>({
    resolver: zodResolver(faqSchema),
  });

  const openAddModal = () => {
    setSelectedFAQ(null);
    reset({
      question: '',
      answer: '',
      category: 'General',
      display_order: 0,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (faqItem: FAQ) => {
    setSelectedFAQ(faqItem);
    reset({
      question: faqItem.question,
      answer: faqItem.answer,
      category: faqItem.category || 'General',
      display_order: faqItem.display_order,
      is_active: faqItem.is_active,
    });
    setIsModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: (formData: FAQFormData) => {
      if (selectedFAQ) {
        return faqApi.updateFAQ(selectedFAQ.id, formData);
      }
      return faqApi.createFAQ(formData);
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success(selectedFAQ ? 'FAQ updated' : 'FAQ created');
        queryClient.invalidateQueries({ queryKey: ['faqs'] });
        setIsModalOpen(false);
      } else {
        toast.error(res.message || 'Failed to save FAQ');
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => faqApi.deleteFAQ(id),
    onSuccess: () => {
      toast.success('FAQ deleted');
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      setDeleteId(null);
    },
  });

  const columns: Column<FAQ>[] = [
    { header: 'Order', accessor: 'display_order', className: 'w-16' },
    {
      header: 'Question & Answer',
      accessor: (row) => (
        <div className="flex flex-col max-w-lg">
          <span className="font-bold text-slate-900">{row.question}</span>
          <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">{row.answer}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: (row) => <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">{row.category || 'General'}</span>,
      className: 'w-28',
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.is_active} />,
      className: 'w-24',
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-md"
            title="Edit FAQ"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteId(row.id)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md"
            title="Delete FAQ"
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
      <Breadcrumb items={[{ label: 'FAQ Management' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">FAQ Management</h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage frequently asked questions, answers, and categories
          </p>
        </div>
        <Button onClick={openAddModal} leftIcon={<Plus className="w-4 h-4" />}>
          Add FAQ
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search FAQs by question or answer..."
        />
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        keyExtractor={(row) => row.id}
        emptyTitle="No FAQs found"
        emptyDescription="Add common questions to help clients understand your logistics services."
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

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedFAQ ? 'Edit FAQ' : 'Add New FAQ'}
      >
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
          <Input label="Question *" error={errors.question?.message} {...register('question')} />
          <Textarea label="Answer *" rows={4} error={errors.answer?.message} {...register('answer')} />
          <Input label="Category" placeholder="e.g. Quotes, Customs, Services" error={errors.category?.message} {...register('category')} />

          <div className="grid grid-cols-2 gap-4 items-center">
            <Input label="Display Order" type="number" error={errors.display_order?.message} {...register('display_order', { valueAsNumber: true })} />
            <div className="pt-4">
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <Switch label="Active Status" checked={field.value} onChange={field.onChange} />
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting || saveMutation.isPending}>
              Save FAQ
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete FAQ"
        message="Are you sure you want to delete this FAQ item? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
