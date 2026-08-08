import React, { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Save, ArrowLeft } from 'lucide-react';
import { blogSchema, BlogFormData } from '../../schemas/blog.schema';
import { blogsApi } from '../../api/blogs.api';
import { toast } from '../../hooks/useToast';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { Skeleton } from '../../components/ui/Skeleton';

export const BlogEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const blogId = Number(id);
  const navigate = useNavigate();

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', blogId],
    queryFn: async () => {
      const res = await blogsApi.getBlogById(blogId);
      return res.data;
    },
    enabled: !!blogId,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
  });

  useEffect(() => {
    if (blog) {
      reset({
        title: blog.title || '',
        slug: blog.slug || '',
        short_description: blog.short_description || '',
        content: blog.content || '',
        featured_image: blog.featured_image || '',
        author: blog.author || 'Admin',
        category: blog.category || 'Industry News',
        tags: blog.tags || '',
        status: blog.status || 'DRAFT',
        is_featured: blog.is_featured || false,
        published_at: blog.published_at || '',
        meta_title: blog.meta_title || '',
        meta_description: blog.meta_description || '',
        og_title: blog.og_title || '',
        og_description: blog.og_description || '',
        og_image: blog.og_image || '',
      });
    }
  }, [blog, reset]);

  const updateMutation = useMutation({
    mutationFn: (formData: BlogFormData) => blogsApi.updateBlog(blogId, formData),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Blog post updated successfully');
        navigate('/blogs');
      } else {
        toast.error(res.message || 'Failed to update blog post');
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Error updating blog post');
    },
  });

  const onSubmit = (formData: BlogFormData) => {
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={[{ label: 'Blog Management', href: '/blogs' }, { label: 'Edit Blog' }]} />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Blog Management', href: '/blogs' }, { label: `Edit: ${blog?.title}` }]} />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/blogs" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Edit Blog: {blog?.title}</h1>
            <p className="text-xs text-slate-500 font-medium">Update blog article content, status, and metadata</p>
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
              <Input label="Article Title *" error={errors.title?.message} {...register('title')} />
              <Input label="URL Slug *" error={errors.slug?.message} {...register('slug')} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="Author Name" error={errors.author?.message} {...register('author')} />
              <Input label="Category" error={errors.category?.message} {...register('category')} />
              <Input label="Tags (comma separated)" error={errors.tags?.message} {...register('tags')} />
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
