import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Phone, Share2, Globe, Save } from 'lucide-react';
import { companySchema, CompanyFormData } from '../schemas/company.schema';
import { companyApi } from '../api/company.api';
import { toast } from '../hooks/useToast';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { ImageUploader } from '../components/ui/ImageUploader';
import { Skeleton } from '../components/ui/Skeleton';

export const CompanyPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: company, isLoading } = useQuery({
    queryKey: ['company-info'],
    queryFn: async () => {
      const res = await companyApi.getCompany();
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  });

  useEffect(() => {
    if (company) {
      reset({
        name: company.name || '',
        tagline: company.tagline || '',
        short_description: company.short_description || '',
        full_description: company.full_description || '',
        logo: company.logo || '',
        favicon: company.favicon || '',
        phone: company.phone || '',
        whatsapp: company.whatsapp || '',
        email: company.email || '',
        address: company.address || '',
        google_maps_url: company.google_maps_url || '',
        working_hours: company.working_hours || '',
        facebook: company.facebook || '',
        instagram: company.instagram || '',
        linkedin: company.linkedin || '',
        youtube: company.youtube || '',
        twitter: company.twitter || '',
        primary_color: company.primary_color || '#f97316',
        secondary_color: company.secondary_color || '#0f172a',
        accent_color: company.accent_color || '#06b6d4',
        theme_mode: company.theme_mode || 'dark',
      });
    }
  }, [company, reset]);

  const updateMutation = useMutation({
    mutationFn: (formData: CompanyFormData) => companyApi.updateCompany(formData),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Company information updated successfully');
        queryClient.invalidateQueries({ queryKey: ['company-info'] });
      } else {
        toast.error(res.message || 'Failed to update company info');
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Error updating company details');
    },
  });

  const onSubmit = (formData: CompanyFormData) => {
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={[{ label: 'Company Information' }]} />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Company Information' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Company Information</h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage global company profile, branding assets, and contact details
          </p>
        </div>
        <Button
          onClick={handleSubmit(onSubmit)}
          isLoading={isSubmitting || updateMutation.isPending}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save Company Profile
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Branding & Basic Info */}
        <Card title="Basic Profile & Branding" subtitle="Logo, favicon, tagline, and descriptions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Controller
              name="logo"
              control={control}
              render={({ field }) => (
                <ImageUploader
                  label="Company Logo"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.logo?.message}
                />
              )}
            />
            <Controller
              name="favicon"
              control={control}
              render={({ field }) => (
                <ImageUploader
                  label="Company Favicon"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.favicon?.message}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Company Name *" error={errors.name?.message} {...register('name')} />
            <Input label="Tagline" error={errors.tagline?.message} {...register('tagline')} />
          </div>

          <div className="mt-4 space-y-4">
            <Textarea
              label="Short Description"
              rows={2}
              error={errors.short_description?.message}
              {...register('short_description')}
            />
            <Textarea
              label="Full Description"
              rows={4}
              error={errors.full_description?.message}
              {...register('full_description')}
            />
          </div>
        </Card>

        {/* Contact Details */}
        <Card title="Contact Information" subtitle="Public phone, email, address, and operating hours">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Input label="Phone Number" leftIcon={<Phone className="w-4 h-4" />} error={errors.phone?.message} {...register('phone')} />
            <Input label="WhatsApp Number" error={errors.whatsapp?.message} {...register('whatsapp')} />
            <Input label="Support Email" type="email" error={errors.email?.message} {...register('email')} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Input label="Working Hours" placeholder="Mon - Fri: 8:00 AM - 6:00 PM" error={errors.working_hours?.message} {...register('working_hours')} />
            <Input label="Google Maps Embed / Link URL" leftIcon={<Globe className="w-4 h-4" />} error={errors.google_maps_url?.message} {...register('google_maps_url')} />
          </div>

          <div className="mt-4">
            <Textarea label="Physical Address" rows={3} error={errors.address?.message} {...register('address')} />
          </div>
        </Card>

        {/* Color Theme & Appearance Settings */}
        <Card title="Color Theme & Website Appearance" subtitle="Select a matched theme preset or customize colors for the live website">
          <div className="space-y-6">
            {/* 3 Matched Theme Presets */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                1-Click Matched Theme Presets
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Theme 1: Classic Cargo Orange */}
                <button
                  type="button"
                  onClick={() => {
                    setValue('primary_color', '#ea580c', { shouldDirty: true });
                    setValue('secondary_color', '#0f172a', { shouldDirty: true });
                    setValue('accent_color', '#0284c7', { shouldDirty: true });
                    setValue('theme_mode', 'light', { shouldDirty: true });
                  }}
                  className="p-3.5 rounded-xl border-2 border-slate-200 hover:border-orange-500 bg-white hover:bg-orange-50/40 text-left transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-orange-600">
                      Classic Cargo Orange
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#ea580c]" />
                      <span className="w-3.5 h-3.5 rounded-full bg-[#0f172a]" />
                      <span className="w-3.5 h-3.5 rounded-full bg-[#0284c7]" />
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">Vibrant cargo orange with slate & cyan highlights</span>
                </button>

                {/* Theme 2: Ocean Maritime Blue */}
                <button
                  type="button"
                  onClick={() => {
                    setValue('primary_color', '#0284c7', { shouldDirty: true });
                    setValue('secondary_color', '#0f172a', { shouldDirty: true });
                    setValue('accent_color', '#10b981', { shouldDirty: true });
                    setValue('theme_mode', 'light', { shouldDirty: true });
                  }}
                  className="p-3.5 rounded-xl border-2 border-slate-200 hover:border-sky-500 bg-white hover:bg-sky-50/40 text-left transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-sky-600">
                      Ocean Maritime Blue
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#0284c7]" />
                      <span className="w-3.5 h-3.5 rounded-full bg-[#0f172a]" />
                      <span className="w-3.5 h-3.5 rounded-full bg-[#10b981]" />
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">Deep ocean blue with emerald container green accents</span>
                </button>

                {/* Theme 3: Emerald Logistics Green */}
                <button
                  type="button"
                  onClick={() => {
                    setValue('primary_color', '#059669', { shouldDirty: true });
                    setValue('secondary_color', '#0f172a', { shouldDirty: true });
                    setValue('accent_color', '#f59e0b', { shouldDirty: true });
                    setValue('theme_mode', 'light', { shouldDirty: true });
                  }}
                  className="p-3.5 rounded-xl border-2 border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/40 text-left transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-600">
                      Emerald Express Green
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#059669]" />
                      <span className="w-3.5 h-3.5 rounded-full bg-[#0f172a]" />
                      <span className="w-3.5 h-3.5 rounded-full bg-[#f59e0b]" />
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">Sustainable eco-green with amber warm highlights</span>
                </button>
              </div>
            </div>

            {/* Custom Color Designer Controls */}
            <div className="pt-3 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Custom Theme Color Designer
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Primary Button & Brand Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white shadow-sm"
                      {...register('primary_color')}
                    />
                    <Input error={errors.primary_color?.message} {...register('primary_color')} placeholder="#ea580c" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Secondary Dark Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white shadow-sm"
                      {...register('secondary_color')}
                    />
                    <Input error={errors.secondary_color?.message} {...register('secondary_color')} placeholder="#0f172a" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Accent Highlight Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white shadow-sm"
                      {...register('accent_color')}
                    />
                    <Input error={errors.accent_color?.message} {...register('accent_color')} placeholder="#0284c7" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Website Theme Mode</label>
                  <select
                    className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    {...register('theme_mode')}
                  >
                    <option value="light">Light Theme (Clean White)</option>
                    <option value="dark">Dark Mode</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Social Media Links */}
        <Card title="Social Media Channels" subtitle="Public social profile links">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Input label="Facebook URL" leftIcon={<Share2 className="w-4 h-4" />} error={errors.facebook?.message} {...register('facebook')} />
            <Input label="Instagram URL" leftIcon={<Share2 className="w-4 h-4" />} error={errors.instagram?.message} {...register('instagram')} />
            <Input label="LinkedIn URL" leftIcon={<Share2 className="w-4 h-4" />} error={errors.linkedin?.message} {...register('linkedin')} />
            <Input label="YouTube URL" leftIcon={<Share2 className="w-4 h-4" />} error={errors.youtube?.message} {...register('youtube')} />
            <Input label="X / Twitter URL" leftIcon={<Share2 className="w-4 h-4" />} error={errors.twitter?.message} {...register('twitter')} />
          </div>
        </Card>
      </form>
    </div>
  );
};
