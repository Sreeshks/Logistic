import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Plus, Edit, Trash2, Home as HomeIcon } from 'lucide-react';
import { homeHeroSchema, HomeHeroFormData, companyStatisticSchema, CompanyStatisticFormData } from '../../schemas/home.schema';
import { homeApi } from '../../api/home.api';
import { toast } from '../../hooks/useToast';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable, Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { CompanyStatistic } from '../../types/home';

export const HomeManagementPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedStat, setSelectedStat] = useState<CompanyStatistic | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteStatId, setDeleteStatId] = useState<number | null>(null);

  // Hero query
  const { data: heroData } = useQuery({
    queryKey: ['home-hero'],
    queryFn: async () => {
      const res = await homeApi.getHero();
      return res.data;
    },
  });

  // Statistics query
  const { data: statistics, isLoading: statsLoading } = useQuery({
    queryKey: ['company-statistics'],
    queryFn: async () => {
      const res = await homeApi.getStatistics();
      return res.data;
    },
  });

  // Hero form
  const {
    register: registerHero,
    handleSubmit: handleSubmitHero,
    control: controlHero,
    reset: resetHero,
    formState: { errors: heroErrors, isSubmitting: heroSubmitting },
  } = useForm<HomeHeroFormData>({
    resolver: zodResolver(homeHeroSchema),
  });

  useEffect(() => {
    if (heroData) {
      resetHero({
        title: heroData.title || '',
        subtitle: heroData.subtitle || '',
        description: heroData.description || '',
        button_text: heroData.button_text || '',
        button_url: heroData.button_url || '',
        background_image: heroData.background_image || '',
        banner_images: heroData.banner_images || '',
      });
    }
  }, [heroData, resetHero]);

  // Update Hero mutation
  const heroMutation = useMutation({
    mutationFn: (data: HomeHeroFormData) => homeApi.updateHero(data),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Hero section updated successfully');
        queryClient.invalidateQueries({ queryKey: ['home-hero'] });
      } else {
        toast.error(res.message || 'Failed to update hero');
      }
    },
  });

  const onHeroSubmit = (formData: HomeHeroFormData) => {
    heroMutation.mutate(formData);
  };

  // Statistic Modal Form
  const {
    register: registerStat,
    handleSubmit: handleSubmitStat,
    reset: resetStat,
    setValue: setStatValue,
    watch: watchStat,
    formState: { errors: statErrors, isSubmitting: statSubmitting },
  } = useForm<CompanyStatisticFormData>({
    resolver: zodResolver(companyStatisticSchema),
    defaultValues: {
      label: '',
      value: '',
      icon: 'clock',
      display_order: 0,
      is_active: true,
    },
  });

  const openAddModal = () => {
    setSelectedStat(null);
    resetStat({
      label: '',
      value: '',
      icon: 'clock',
      display_order: 0,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (stat: CompanyStatistic) => {
    setSelectedStat(stat);
    resetStat({
      label: stat.label,
      value: stat.value,
      icon: stat.icon || 'clock',
      display_order: stat.display_order,
      is_active: stat.is_active,
    });
    setIsModalOpen(true);
  };

  // Create/Update Statistic mutation
  const saveStatMutation = useMutation({
    mutationFn: (formData: CompanyStatisticFormData) => {
      if (selectedStat) {
        return homeApi.updateStatistic(selectedStat.id, formData);
      }
      return homeApi.createStatistic(formData);
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success(selectedStat ? 'Statistic updated' : 'Statistic added');
        queryClient.invalidateQueries({ queryKey: ['company-statistics'] });
        setIsModalOpen(false);
      } else {
        toast.error(res.message || 'Failed to save statistic');
      }
    },
  });

  // Delete Statistic mutation
  const deleteStatMutation = useMutation({
    mutationFn: (id: number) => homeApi.deleteStatistic(id),
    onSuccess: () => {
      toast.success('Statistic deleted');
      queryClient.invalidateQueries({ queryKey: ['company-statistics'] });
      setDeleteStatId(null);
    },
  });

  const statColumns: Column<CompanyStatistic>[] = [
    { header: 'Order', accessor: 'display_order', className: 'w-16' },
    { header: 'Label', accessor: (row) => <span className="font-semibold text-slate-900">{row.label}</span> },
    { header: 'Value', accessor: (row) => <span className="font-mono font-bold text-blue-600">{row.value}</span> },
    { header: 'Icon', accessor: (row) => <code className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">{row.icon || 'none'}</code> },
    { header: 'Status', accessor: (row) => <StatusBadge status={row.is_active} /> },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-md"
            title="Edit Statistic"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteStatId(row.id)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md"
            title="Delete Statistic"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Website CMS' }, { label: 'Home Page' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Homepage CMS Management</h1>
          <p className="text-xs text-slate-500 font-medium">
            Control the hero banner, company stats, and featured items on the public homepage
          </p>
        </div>
      </div>

      {/* Hero Section Card */}
      <form onSubmit={handleSubmitHero(onHeroSubmit)}>
        <Card
          title="Hero Banner Section"
          subtitle="Main hero header text, Call-to-Action button, and background image"
          action={
            <Button
              type="submit"
              size="sm"
              isLoading={heroSubmitting || heroMutation.isPending}
              leftIcon={<Save className="w-3.5 h-3.5" />}
            >
              Save Hero
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="background_image"
                control={controlHero}
                render={({ field }) => (
                  <ImageUploader
                    label="Primary Hero Background Image"
                    value={field.value}
                    onChange={field.onChange}
                    error={heroErrors.background_image?.message}
                  />
                )}
              />

              <div>
                <Controller
                  name="banner_images"
                  control={controlHero}
                  render={({ field }) => (
                    <div>
                      <ImageUploader
                        label="Add Hero Banner Image to Carousel"
                        value=""
                        onChange={(newUrl) => {
                          if (newUrl) {
                            const existing = field.value ? field.value.split(',').map((s) => s.trim()).filter(Boolean) : [];
                            if (!existing.includes(newUrl)) {
                              field.onChange([...existing, newUrl].join(','));
                            }
                          }
                        }}
                      />
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Banner Carousel Images Manager */}
            <Controller
              name="banner_images"
              control={controlHero}
              render={({ field }) => {
                const imageList = field.value ? field.value.split(',').map((s) => s.trim()).filter(Boolean) : [];
                return (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Hero Banner Carousel Slides ({imageList.length} images)
                      </label>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Enter comma-separated URLs or upload multiple images above
                      </span>
                    </div>

                    {imageList.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {imageList.map((imgUrl, idx) => (
                          <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 h-24 bg-slate-900">
                            <img src={imgUrl} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = imageList.filter((_, i) => i !== idx);
                                  field.onChange(updated.join(','));
                                }}
                                className="p-1.5 bg-rose-600 text-white rounded-md hover:bg-rose-700 text-xs font-bold"
                              >
                                Remove
                              </button>
                            </div>
                            <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                              #{idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <Textarea
                      rows={2}
                      placeholder="Multiple image URLs separated by commas..."
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </div>
                );
              }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Main Heading *" error={heroErrors.title?.message} {...registerHero('title')} />
              <Input label="Subtitle" error={heroErrors.subtitle?.message} {...registerHero('subtitle')} />
            </div>

            <Textarea label="Hero Description" rows={3} error={heroErrors.description?.message} {...registerHero('description')} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Button Text" placeholder="Explore Services" error={heroErrors.button_text?.message} {...registerHero('button_text')} />
              <Input label="Button URL" placeholder="/services" error={heroErrors.button_url?.message} {...registerHero('button_url')} />
            </div>
          </div>
        </Card>
      </form>

      {/* Statistics Section Card */}
      <Card
        title="Company Statistics"
        subtitle="Key figures displayed on homepage (Years Experience, Countries, Deliveries, etc.)"
        action={
          <Button size="sm" onClick={openAddModal} leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Add Statistic
          </Button>
        }
      >
        <DataTable
          columns={statColumns}
          data={statistics || []}
          isLoading={statsLoading}
          keyExtractor={(row) => row.id}
          emptyTitle="No statistics added"
          emptyDescription="Add statistics to display on the home page."
        />
      </Card>

      {/* Statistic Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedStat ? 'Edit Statistic' : 'Add New Statistic'}
      >
        <form onSubmit={handleSubmitStat((data) => saveStatMutation.mutate(data))} className="space-y-4">
          <Input label="Label *" placeholder="e.g. Years of Experience" error={statErrors.label?.message} {...registerStat('label')} />
          <Input label="Value *" placeholder="e.g. 15+ or 1M+" error={statErrors.value?.message} {...registerStat('value')} />
          <Input label="Icon Name" placeholder="e.g. clock, package, globe" error={statErrors.icon?.message} {...registerStat('icon')} />
          
          <div className="grid grid-cols-2 gap-4 items-center">
            <Input
              label="Display Order"
              type="number"
              error={statErrors.display_order?.message}
              {...registerStat('display_order', { valueAsNumber: true })}
            />
            <div className="pt-5">
              <Switch
                label="Active Status"
                checked={watchStat('is_active')}
                onChange={(val) => setStatValue('is_active', val)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={statSubmitting || saveStatMutation.isPending}>
              Save Statistic
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteStatId !== null}
        onClose={() => setDeleteStatId(null)}
        onConfirm={() => deleteStatId && deleteStatMutation.mutate(deleteStatId)}
        title="Delete Statistic"
        message="Are you sure you want to delete this statistic? This action cannot be undone."
        isLoading={deleteStatMutation.isPending}
      />
    </div>
  );
};
