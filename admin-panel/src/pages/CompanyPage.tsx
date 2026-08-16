import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller, Control, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Phone, Share2, Globe, Save, Palette, Sparkles, Check, ArrowRight } from 'lucide-react';
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

// 8 Professional Theme Presets
const THEME_PRESETS = [
  {
    id: 'ocean-blue',
    name: 'Ocean Maritime Blue',
    tag: 'Maritime & Sea Cargo',
    primary: '#0284c7',
    secondary: '#0f172a',
    accent: '#10b981',
    mode: 'light',
  },
  {
    id: 'cargo-orange',
    name: 'Classic Cargo Orange',
    tag: 'Express Cargo & Logistics',
    primary: '#ea580c',
    secondary: '#0f172a',
    accent: '#0284c7',
    mode: 'light',
  },
  {
    id: 'royal-navy',
    name: 'Royal Navy & Gold',
    tag: 'Global Freight & Corporate',
    primary: '#1d4ed8',
    secondary: '#0b1329',
    accent: '#f59e0b',
    mode: 'light',
  },
  {
    id: 'emerald-green',
    name: 'Emerald Eco-Express',
    tag: 'Sustainable Transport',
    primary: '#059669',
    secondary: '#064e3b',
    accent: '#f59e0b',
    mode: 'light',
  },
  {
    id: 'aviation-cyan',
    name: 'Aviation Sky Cyan',
    tag: 'Air Cargo & Charter',
    primary: '#0891b2',
    secondary: '#0f172a',
    accent: '#3b82f6',
    mode: 'light',
  },
  {
    id: 'desert-amber',
    name: 'Desert Amber & Stone',
    tag: 'GCC & Middle East',
    primary: '#d97706',
    secondary: '#1c1917',
    accent: '#0284c7',
    mode: 'light',
  },
  {
    id: 'speed-crimson',
    name: 'Speed Crimson Red',
    tag: 'Priority Express Delivery',
    primary: '#dc2626',
    secondary: '#18181b',
    accent: '#f97316',
    mode: 'light',
  },
  {
    id: 'deep-indigo',
    name: 'Deep Indigo & Teal',
    tag: 'Modern Supply Chain',
    primary: '#4f46e5',
    secondary: '#0f172a',
    accent: '#06b6d4',
    mode: 'light',
  },
];

interface ColorPickerFieldProps {
  label: string;
  name: 'primary_color' | 'secondary_color' | 'accent_color';
  control: Control<CompanyFormData>;
  error?: string;
  defaultValue: string;
  description: string;
}

const ColorPickerField: React.FC<ColorPickerFieldProps> = ({
  label,
  name,
  control,
  error,
  defaultValue,
  description,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const rawHex = field.value || defaultValue;
        const isValidHex = /^#[0-9A-Fa-f]{6}$/i.test(rawHex);
        const pickerColor = isValidHex ? rawHex : defaultValue;

        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                {label}
              </label>
              <span className="text-[11px] text-slate-400 font-medium">{description}</span>
            </div>

            <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
              {/* Color Swatch & Native Color Trigger */}
              <div
                className="relative w-11 h-11 rounded-lg border border-slate-300 shadow-inner flex items-center justify-center shrink-0 cursor-pointer overflow-hidden transition-transform hover:scale-105"
                style={{ backgroundColor: pickerColor }}
              >
                <input
                  type="color"
                  value={pickerColor}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  title="Click to choose custom color"
                />
              </div>

              {/* Text Hex Code Input */}
              <div className="flex-1">
                <input
                  type="text"
                  value={field.value || ''}
                  onChange={(e) => {
                    let val = e.target.value.trim();
                    if (val && !val.startsWith('#')) {
                      val = '#' + val;
                    }
                    field.onChange(val);
                  }}
                  placeholder={defaultValue}
                  className="w-full h-9 px-3 font-mono text-xs uppercase font-semibold rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-slate-800"
                />
              </div>
            </div>
            {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
          </div>
        );
      }}
    />
  );
};

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

  const watchedPrimary = useWatch({ control, name: 'primary_color' }) || '#0284c7';
  const watchedSecondary = useWatch({ control, name: 'secondary_color' }) || '#0f172a';
  const watchedAccent = useWatch({ control, name: 'accent_color' }) || '#10b981';
  const watchedName = useWatch({ control, name: 'name' }) || 'White Star Cargo';
  const watchedArabic = useWatch({ control, name: 'arabic_name' }) || 'النجم الأبيض للشحن';
  const watchedTagline = useWatch({ control, name: 'tagline' }) || 'Door to Door Service';

  useEffect(() => {
    if (company) {
      reset({
        name: company.name || '',
        arabic_name: company.arabic_name || '',
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
        primary_color: company.primary_color || '#0284c7',
        secondary_color: company.secondary_color || '#0f172a',
        accent_color: company.accent_color || '#10b981',
        theme_mode: company.theme_mode || 'light',
      });
    }
  }, [company, reset]);

  const updateMutation = useMutation({
    mutationFn: (formData: CompanyFormData) => companyApi.updateCompany(formData),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Company information and theme updated successfully');
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
            Manage global company profile, branding assets, color themes, and contact details
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
        {/* Color Theme & Appearance Settings */}
        <Card
          title="Color Theme & Website Appearance"
          subtitle="Choose an instant 1-click theme template or craft your custom color palette"
        >
          <div className="space-y-6">
            {/* 8 Theme Presets */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <Palette className="w-4 h-4 text-blue-600" />
                  <span>1-Click Theme Templates ({THEME_PRESETS.length} Presets)</span>
                </label>
                <span className="text-xs text-slate-500 font-medium">Click any template to apply instantly</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {THEME_PRESETS.map((preset) => {
                  const isSelected =
                    watchedPrimary.toLowerCase() === preset.primary.toLowerCase() &&
                    watchedSecondary.toLowerCase() === preset.secondary.toLowerCase();

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setValue('primary_color', preset.primary, { shouldDirty: true });
                        setValue('secondary_color', preset.secondary, { shouldDirty: true });
                        setValue('accent_color', preset.accent, { shouldDirty: true });
                        setValue('theme_mode', preset.mode, { shouldDirty: true });
                      }}
                      className={`p-3.5 rounded-xl border-2 text-left transition-all relative group flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 shadow-sm ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 block">
                            {preset.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium block">
                            {preset.tag}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                        <span
                          className="w-4 h-4 rounded-full shadow-xs border border-white"
                          style={{ backgroundColor: preset.primary }}
                          title={`Primary: ${preset.primary}`}
                        />
                        <span
                          className="w-4 h-4 rounded-full shadow-xs border border-white"
                          style={{ backgroundColor: preset.secondary }}
                          title={`Secondary: ${preset.secondary}`}
                        />
                        <span
                          className="w-4 h-4 rounded-full shadow-xs border border-white"
                          style={{ backgroundColor: preset.accent }}
                          title={`Accent: ${preset.accent}`}
                        />
                        <span className="text-[10px] font-mono text-slate-400 font-semibold ml-auto">
                          {preset.primary}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Color Designer Controls */}
            <div className="pt-4 border-t border-slate-200">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Custom Color Designer (Pick Any Custom Hex)</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <ColorPickerField
                  label="Primary Brand Color"
                  name="primary_color"
                  control={control}
                  defaultValue="#0284c7"
                  description="Buttons, accents, active links"
                  error={errors.primary_color?.message}
                />

                <ColorPickerField
                  label="Secondary Dark Color"
                  name="secondary_color"
                  control={control}
                  defaultValue="#0f172a"
                  description="Navbar topbar & dark cards"
                  error={errors.secondary_color?.message}
                />

                <ColorPickerField
                  label="Accent Highlight Color"
                  name="accent_color"
                  control={control}
                  defaultValue="#10b981"
                  description="Badges, glows & features"
                  error={errors.accent_color?.message}
                />

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Website Theme Mode
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium block">Default site appearance</span>
                  <select
                    className="w-full h-11 rounded-xl border border-slate-200 px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 shadow-xs"
                    {...register('theme_mode')}
                  >
                    <option value="light">Light Theme (Crisp Modern White)</option>
                    <option value="dark">Dark Theme (Deep Slate)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Real-time Interactive Live Theme Preview */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-slate-950 text-white">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Header & Color Preview
                </span>
                <span className="text-[11px] text-slate-400">Updates live with your selected colors</span>
              </div>

              {/* Mini Mock Header Topbar */}
              <div style={{ backgroundColor: watchedSecondary }} className="px-4 py-2 border-b border-white/10 flex justify-between items-center text-[11px]">
                <div className="flex items-center gap-3 text-slate-300 font-mono">
                  <span>📞 +968 95807130</span>
                  <span>✉️ wstarcargo@rediffmail.com</span>
                </div>
                <div>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                    style={{
                      borderColor: `${watchedAccent}40`,
                      backgroundColor: `${watchedAccent}20`,
                      color: watchedAccent,
                    }}
                  >
                    {watchedArabic}
                  </span>
                </div>
              </div>

              {/* Mini Mock Header Navbar */}
              <div className="bg-white text-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm"
                    style={{ backgroundColor: watchedPrimary }}
                  >
                    ★
                  </div>
                  <div>
                    <span className="text-sm font-extrabold uppercase tracking-tight text-slate-900 block leading-tight">
                      {watchedName}
                    </span>
                    <span
                      className="text-[9px] font-bold tracking-wide uppercase block leading-tight"
                      style={{ color: watchedPrimary }}
                    >
                      {watchedTagline}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-3 text-xs font-bold text-slate-700">
                    <span style={{ color: watchedPrimary }}>Home</span>
                    <span>About</span>
                    <span>Services</span>
                    <span>Tracking</span>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1 hover:opacity-90 transition-opacity cursor-default"
                    style={{ backgroundColor: watchedPrimary }}
                  >
                    <span>Get a Quote</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Branding & Basic Info */}
        <Card title="Basic Profile & Branding" subtitle="Logo, favicon, Arabic company name, tagline, and descriptions">
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Company Name (English) *" error={errors.name?.message} {...register('name')} />
            <Input label="Company Name (Arabic)" placeholder="النجم الأبيض للشحن" error={errors.arabic_name?.message} {...register('arabic_name')} />
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
            <Input label="Working Hours" placeholder="Sat - Thu: 8:00 AM - 9:00 PM" error={errors.working_hours?.message} {...register('working_hours')} />
            <Input label="Google Maps Embed / Link URL" leftIcon={<Globe className="w-4 h-4" />} error={errors.google_maps_url?.message} {...register('google_maps_url')} />
          </div>

          <div className="mt-4">
            <Textarea label="Physical Address" rows={3} error={errors.address?.message} {...register('address')} />
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
