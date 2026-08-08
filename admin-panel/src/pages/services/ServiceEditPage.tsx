import React, { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Save, ArrowLeft } from 'lucide-react';
import { serviceSchema, ServiceFormData } from '../../schemas/service.schema';
import { servicesApi } from '../../api/services.api';
import { toast } from '../../hooks/useToast';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { Skeleton } from '../../components/ui/Skeleton';

export const ServiceEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const serviceId = Number(id);
  const navigate = useNavigate();

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: async () => {
      const res = await servicesApi.getServiceById(serviceId);
      return res.data;
    },
    enabled: !!serviceId,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
  });

  useEffect(() => {
    if (service) {
      reset({
        title: service.title || '',
        slug: service.slug || '',
        short_description: service.short_description || '',
        description: service.description || '',
        icon: service.icon || 'truck',
        image: service.image || '',
        display_order: service.display_order || 0,
        is_featured: service.is_featured || false,
        is_active: service.is_active ?? true,
        meta_title: service.meta_title || '',
        meta_description: service.meta_description || '',
        og_title: service.og_title || '',
        og_description: service.og_description || '',
        og_image: service.og_image || '',
      });
    }
  }, [service, reset]);

  const updateMutation = useMutation({
    mutationFn: (formData: ServiceFormData) => servicesApi.updateService(serviceId, formData),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Service updated successfully');
        navigate('/services');
      } else {
        toast.error(res.message || 'Failed to update service');
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Error updating service');
    },
  });

  const onSubmit = (formData: ServiceFormData) => {
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={[{ label: 'Services', href: '/services' }, { label: 'Edit Service' }]} />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Services', href: '/services' }, { label: `Edit: ${service?.title}` }]} />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/services" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Edit Service: {service?.title}</h1>
            <p className="text-xs text-slate-500 font-medium">Update logistics service details and SEO settings</p>
          </div>
        </div>
        <Button
          onClick={handleSubmit(onSubmit)}
          isLoading={isSubmitting || updateMutation.isPending}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save Changes
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card title="General Service Information">
          <div className="space-y-4">
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <ImageUploader
                  label="Service Featured Image"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.image?.message}
                />
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Service Title *" error={errors.title?.message} {...register('title')} />
              <Input label="URL Slug *" error={errors.slug?.message} {...register('slug')} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Icon Name" error={errors.icon?.message} {...register('icon')} />
              <Input
                label="Display Order"
                type="number"
                error={errors.display_order?.message}
                {...register('display_order', { valueAsNumber: true })}
              />
            </div>

            <Textarea label="Short Description" rows={2} error={errors.short_description?.message} {...register('short_description')} />
            <Textarea label="Full Detailed Description" rows={6} error={errors.description?.message} {...register('description')} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <Switch label="Active Status" description="Show service on public website" checked={field.value} onChange={field.onChange} />
                )}
              />
              <Controller
                name="is_featured"
                control={control}
                render={({ field }) => (
                  <Switch label="Featured Service" description="Highlight on homepage featured list" checked={field.value} onChange={field.onChange} />
                )}
              />
            </div>
          </div>
        </Card>

        {/* SEO Meta Card */}
        <Card title="SEO & Social Sharing Metadata">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Meta Title" error={errors.meta_title?.message} {...register('meta_title')} />
              <Input label="OG Title" error={errors.og_title?.message} {...register('og_title')} />
            </div>
            <Textarea label="Meta Description" rows={2} error={errors.meta_description?.message} {...register('meta_description')} />
            <Textarea label="OG Description" rows={2} error={errors.og_description?.message} {...register('og_description')} />
            <Controller
              name="og_image"
              control={control}
              render={({ field }) => (
                <ImageUploader label="OG Share Image" value={field.value} onChange={field.onChange} error={errors.og_image?.message} />
              )}
            />
          </div>
        </Card>
      </form>
    </div>
  );
};
