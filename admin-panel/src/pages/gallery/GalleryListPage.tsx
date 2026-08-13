import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Edit, Trash2, Star, Image as ImageIcon } from 'lucide-react';
import { gallerySchema, GalleryFormData } from '../../schemas/gallery.schema';
import { galleryApi } from '../../api/gallery.api';
import { toast } from '../../hooks/useToast';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Switch } from '../../components/ui/Switch';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Pagination } from '../../components/ui/Pagination';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { GalleryItem } from '../../types/gallery';
import { getImageUrl } from '../../utils/image';

export const GalleryListPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [category, setCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['gallery', page, limit, category],
    queryFn: async () => {
      const res = await galleryApi.getGallery({ page, limit, category });
      return res;
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema),
  });

  const openAddModal = () => {
    setSelectedItem(null);
    reset({
      title: '',
      description: '',
      image_url: '',
      category: 'General',
      display_order: 0,
      is_featured: false,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setSelectedItem(item);
    reset({
      title: item.title,
      description: item.description || '',
      image_url: item.image_url,
      category: item.category || 'General',
      display_order: item.display_order,
      is_featured: item.is_featured,
      is_active: item.is_active,
    });
    setIsModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: (formData: GalleryFormData) => {
      if (selectedItem) {
        return galleryApi.updateGalleryItem(selectedItem.id, formData);
      }
      return galleryApi.createGalleryItem(formData);
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success(selectedItem ? 'Gallery item updated' : 'Gallery item added');
        queryClient.invalidateQueries({ queryKey: ['gallery'] });
        setIsModalOpen(false);
      } else {
        toast.error(res.message || 'Failed to save gallery item');
      }
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: (item: GalleryItem) =>
      galleryApi.updateGalleryItem(item.id, { is_featured: !item.is_featured }),
    onSuccess: () => {
      toast.success('Gallery item featured status updated');
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => galleryApi.deleteGalleryItem(id),
    onSuccess: () => {
      toast.success('Gallery item deleted');
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      setDeleteId(null);
    },
  });



  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Gallery Management' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Gallery Media Management</h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage photo gallery items, categories, and homepage featured media
          </p>
        </div>
        <Button onClick={openAddModal} leftIcon={<Plus className="w-4 h-4" />}>
          Add Gallery Media
        </Button>
      </div>

      {/* Grid Display */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : !data?.data || data.data.length === 0 ? (
        <EmptyState
          title="No gallery items found"
          description="Upload media to show company operations and facilities."
          actionLabel="Upload Media"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.data.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs group flex flex-col justify-between"
            >
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img
                  src={getImageUrl(item.image_url)}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                  <button
                    onClick={() => toggleFeaturedMutation.mutate(item)}
                    className={`p-1.5 rounded-full shadow-md backdrop-blur-xs transition ${
                      item.is_featured ? 'bg-amber-500 text-white' : 'bg-white/80 text-slate-400 hover:text-amber-500'
                    }`}
                    title={item.is_featured ? 'Featured on Home' : 'Not Featured'}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className="text-[10px] font-bold bg-slate-900/80 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                    {item.category || 'General'}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.description}</p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                  <StatusBadge status={item.is_active} />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-md"
                      title="Edit Item"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
        title={selectedItem ? 'Edit Gallery Item' : 'Add Gallery Item'}
      >
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
          <Controller
            name="image_url"
            control={control}
            render={({ field }) => (
              <ImageUploader
                label="Gallery Image *"
                value={field.value}
                onChange={field.onChange}
                error={errors.image_url?.message}
              />
            )}
          />

          <Input label="Title *" error={errors.title?.message} {...register('title')} />
          <Input label="Category" placeholder="e.g. Air Freight, Warehousing, Ocean Port" error={errors.category?.message} {...register('category')} />
          <Textarea label="Description" rows={2} error={errors.description?.message} {...register('description')} />

          <div className="grid grid-cols-2 gap-4 items-center">
            <Input label="Display Order" type="number" error={errors.display_order?.message} {...register('display_order', { valueAsNumber: true })} />
            <div className="pt-4 space-y-2">
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <Switch label="Active Status" checked={field.value} onChange={field.onChange} />
                )}
              />
              <Controller
                name="is_featured"
                control={control}
                render={({ field }) => (
                  <Switch label="Featured on Home" checked={field.value} onChange={field.onChange} />
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting || saveMutation.isPending}>
              Save Item
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Gallery Item"
        message="Are you sure you want to delete this gallery media? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
