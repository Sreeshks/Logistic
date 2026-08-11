import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';

import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { getBlogBySlug } from '../../api/blogs.api';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ['blogDetail', slug],
    queryFn: () => getBlogBySlug(slug!),
    enabled: !!slug,
  });

  const blog = response?.data;

  if (isLoading) {
    return (
      <Container className="py-12 max-w-4xl space-y-6">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-[400px] w-full rounded-2xl mb-8" />
        <Skeleton className="h-40 w-full" />
      </Container>
    );
  }

  if (isError || !blog) {
    return (
      <Container className="py-16 text-center">
        <ErrorState
          title="Article Not Found"
          message={`The requested blog post "${slug}" could not be located.`}
          onRetry={refetch}
        />
        <div className="mt-6">
          <Link to="/blog">
            <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Blog
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <div className="py-12 space-y-8">
      <Container size="md">
        <Breadcrumb items={[{ label: 'Blog', href: '/blog' }, { label: blog.title }]} />

        {/* Header */}
        <div className="space-y-4 my-6">
          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase rounded-full tracking-wider border border-primary/20">
            {blog.category || 'Logistics'}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-2 border-b border-slate-200 pb-6">
            {blog.author_name && (
              <span className="flex items-center gap-1">
                <User className="w-4 h-4 text-primary" />
                {blog.author_name}
              </span>
            )}
            {blog.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-primary" />
                {new Date(blog.published_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {blog.featured_image_url && (
          <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 mb-8">
            <img
              src={blog.featured_image_url}
              alt={blog.title}
              className="w-full h-[400px] object-cover"
            />
          </div>
        )}

        {/* Article Body Content */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <p className="text-lg font-semibold text-slate-800 leading-relaxed italic border-l-4 border-primary pl-4 bg-primary/5 py-3 rounded-r-lg">
            {blog.summary}
          </p>

          <div
            className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base space-y-4"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {blog.tags && (
            <div className="pt-6 border-t border-slate-100 flex items-center gap-2">
              <Tag className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-500 uppercase">Tags:</span>
              <div className="flex flex-wrap gap-1.5">
                {blog.tags.split(',').map((tag, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-6">
          <Link to="/blog">
            <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Blog Articles
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};
