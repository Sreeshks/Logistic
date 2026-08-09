import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Save, ArrowLeft } from 'lucide-react';
import { blogSchema, BlogFormData } from '../../schemas/blog.schema';
import { blogsApi } from '../../api/blogs.api';
import { toast } from '../../hooks/useToast';
import { slugify } from '../../utils/format';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import { ImageUploader } from '../../components/ui/ImageUploader';

export const BlogCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [manualSlug, setManualSlug] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      slug: '',
      short_description: '',
      content: '',
      featured_image: '',
      author: 'Admin',
      category: 'Industry News',
      tags: '',
      status: 'DRAFT',
      is_featured: false,
      meta_title: '',
      meta_description: '',
      og_title: '',
      og_description: '',
      og_image: '',
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('title', val);
    if (!manualSlug) {
      setValue('slug', slugify(val));
    }
  };

  const createMutation = useMutation({
    mutationFn: (formData: BlogFormData) => blogsApi.createBlog(formData),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Blog post created successfully');
        navigate('/blogs');
      } else {
        toast.error(res.message || 'Failed to create blog post');
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Error creating blog post');
    },
  });

  const onSubmit = (formData: BlogFormData) => {
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Blog Management', href: '/blogs' }, { label: 'Create Blog Post' }]} />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/blogs" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create New Blog Article</h1>
            <p className="text-xs text-slate-500 font-medium">Write and publish logistics news, guides, and trends</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setValue('status', 'DRAFT');
              handleSubmit(onSubmit)();
            }}
            isLoading={isSubmitting || createMutation.isPending}
          >
            Save as Draft
          </Button>
          <Button
            onClick={() => {
              setValue('status', 'PUBLISHED');
              handleSubmit(onSubmit)();
            }}
            isLoading={isSubmitting || createMutation.isPending}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Publish Article
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card title="Article Content">
          <div className="space-y-4">
            <Controller
              name="featured_image"
              control={control}
              render={({ field }) => (
                <ImageUploader
                  label="Featured Blog Image"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.featured_image?.message}
                />
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Article Title *"
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
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="Author Name" error={errors.author?.message} {...register('author')} />
              <Input label="Category" placeholder="e.g. Industry News, Best Practices" error={errors.category?.message} {...register('category')} />
              <Input label="Tags (comma separated)" placeholder="e.g. freight, 2026, tech" error={errors.tags?.message} {...register('tags')} />
            </div>

            <Textarea label="Short Summary / Excerpt" rows={2} error={errors.short_description?.message} {...register('short_description')} />
            <Textarea label="Article Body Content *" rows={10} error={errors.content?.message} {...register('content')} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 items-center">
              <Select
                label="Publication Status"
                options={[
                  { label: 'Draft', value: 'DRAFT' },
                  { label: 'Published', value: 'PUBLISHED' },
                  { label: 'Archived', value: 'ARCHIVED' },
                ]}
                error={errors.status?.message}
                {...register('status')}
              />

              <div className="pt-5">
                <Controller
                  name="is_featured"
                  control={control}
                  render={({ field }) => (
                    <Switch label="Featured Post" description="Highlight post on homepage" checked={field.value} onChange={field.onChange} />
                  )}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card title="SEO & Open Graph Metadata">
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
