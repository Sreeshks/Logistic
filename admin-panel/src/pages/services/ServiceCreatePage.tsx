import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Save, ArrowLeft } from 'lucide-react';
import { serviceSchema, ServiceFormData } from '../../schemas/service.schema';
import { servicesApi } from '../../api/services.api';
import { toast } from '../../hooks/useToast';
import { slugify } from '../../utils/format';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import { ImageUploader } from '../../components/ui/ImageUploader';

export const ServiceCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [manualSlug, setManualSlug] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: '',
      slug: '',
      short_description: '',
      description: '',
      icon: 'truck',
      image: '',
      display_order: 0,
      is_featured: false,
      is_active: true,
      meta_title: '',
      meta_description: '',
      og_title: '',
      og_description: '',
      og_image: '',
    },
  });

  const titleValue = watch('title');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('title', val);
    if (!manualSlug) {
      setValue('slug', slugify(val));
    }
  };

  const createMutation = useMutation({
    mutationFn: (formData: ServiceFormData) => servicesApi.createService(formData),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Service created successfully');
        navigate('/services');
      } else {
        toast.error(res.message || 'Failed to create service');
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Error creating service');
    },
  });

  const onSubmit = (formData: ServiceFormData) => {
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Services', href: '/services' }, { label: 'Create Service' }]} />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/services" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create New Service</h1>
            <p className="text-xs text-slate-500 font-medium">Add a logistics service offering to the website</p>
          </div>
        </div>
        <Button
          onClick={handleSubmit(onSubmit)}
          isLoading={isSubmitting || createMutation.isPending}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save Service
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
              <Input
                label="Service Title *"
                error={errors.title?.message}
                {...register('title')}
                onChange={handleTitleChange}
              />
              <Input
                label="URL Slug *"
                error={errors.slug?.message}
                {...register('slug')}
                onChange={(e) => {
                  setManualSlug(true);
                  setValue('slug', e.target.value);
                }}
                helperText="Auto-generated from title. Edit manually if needed."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Icon Name" placeholder="e.g. plane, ship, truck, warehouse" error={errors.icon?.message} {...register('icon')} />
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
        <Card title="SEO & Social Sharing Metadata" subtitle="Search engine optimization and Open Graph tags">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Meta Title" placeholder="Air Cargo Services | Apex Logistics" error={errors.meta_title?.message} {...register('meta_title')} />
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
