import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, FileText } from 'lucide-react';
import { aboutSchema, AboutFormData } from '../../schemas/about.schema';
import { aboutApi } from '../../api/about.api';
import { toast } from '../../hooks/useToast';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { Skeleton } from '../../components/ui/Skeleton';

export const AboutManagementPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: about, isLoading } = useQuery({
    queryKey: ['about-us'],
    queryFn: async () => {
      const res = await aboutApi.getAbout();
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
  });

  useEffect(() => {
    if (about) {
      reset({
        page_title: about.page_title || '',
        short_description: about.short_description || '',
        company_story: about.company_story || '',
        mission: about.mission || '',
        vision: about.vision || '',
        core_values: about.core_values || '',
        about_image: about.about_image || '',
      });
    }
  }, [about, reset]);

  const updateMutation = useMutation({
    mutationFn: (formData: AboutFormData) => aboutApi.updateAbout(formData),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('About Us page content updated successfully');
        queryClient.invalidateQueries({ queryKey: ['about-us'] });
      } else {
        toast.error(res.message || 'Failed to update About Us content');
      }
    },
  });

  const onSubmit = (formData: AboutFormData) => {
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={[{ label: 'Website CMS' }, { label: 'About Us' }]} />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Website CMS' }, { label: 'About Us' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">About Us CMS</h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage company story, mission, vision, core values, and page imagery
          </p>
        </div>
        <Button
          onClick={handleSubmit(onSubmit)}
          isLoading={isSubmitting || updateMutation.isPending}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save About Us Content
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card title="Page Header & Image" subtitle="Main About page title, summary, and banner image">
          <div className="space-y-4">
            <Controller
              name="about_image"
              control={control}
              render={({ field }) => (
                <ImageUploader
                  label="About Us Page Image"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.about_image?.message}
                />
              )}
            />
            <Input label="Page Title *" error={errors.page_title?.message} {...register('page_title')} />
            <Textarea label="Short Overview / Tagline" rows={2} error={errors.short_description?.message} {...register('short_description')} />
          </div>
        </Card>

        <Card title="Company Story & Mission" subtitle="In-depth background story, mission, and vision statements">
          <div className="space-y-4">
            <Textarea label="Company History & Story" rows={5} error={errors.company_story?.message} {...register('company_story')} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea label="Mission Statement" rows={4} error={errors.mission?.message} {...register('mission')} />
              <Textarea label="Vision Statement" rows={4} error={errors.vision?.message} {...register('vision')} />
            </div>
            <Textarea
              label="Core Values (Comma separated or summary text)"
              rows={3}
              placeholder="Integrity, Innovation, Customer Commitment, Reliability..."
              error={errors.core_values?.message}
              {...register('core_values')}
            />
          </div>
        </Card>
      </form>
    </div>
  );
};
