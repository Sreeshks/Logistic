import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';

import { Container } from '../../components/ui/Container';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { getPublicBlogs } from '../../api/blogs.api';
import { getImageUrl } from '../../utils/image';
import { SEO } from '../../components/SEO';

export const BlogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ['publicBlogs', searchTerm],
    queryFn: () => getPublicBlogs({ search: searchTerm }),
  });

  const blogs = response?.data || [];

  return (
    <div className="py-12 space-y-12">
      <SEO
        title="Logistics Insights & News"
        description="Stay updated with air freight guides, ocean shipping regulations, customs documentation, and supply chain tips."
      />
      <Container>
        <Breadcrumb items={[{ label: 'Blog' }]} />

        <SectionTitle
          badge="Logistics Knowledge Center"
          title="Insights, News & Industry Updates"
          subtitle="Stay informed with expert shipping guides, regulatory updates, and supply chain best practices."
        />

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10 relative">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search articles by keyword or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            title="Failed to Load Blog Articles"
            message="Could not fetch posts from the backend server."
            onRetry={refetch}
          />
        ) : blogs.length === 0 ? (
          <EmptyState
            title="No Blog Articles Found"
            message={searchTerm ? `No articles match "${searchTerm}".` : 'No published blog posts available.'}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Card key={blog.id} className="flex flex-col h-full">
                <div className="h-48 overflow-hidden">
                  <img
                    src={
                      (blog.featured_image_url || (blog as any).featured_image)
                        ? getImageUrl(blog.featured_image_url || (blog as any).featured_image)
                        : 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'
                    }
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="font-semibold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                      {blog.category || 'Industry News'}
                    </span>
                    {blog.published_at && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(blog.published_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug">
                    {blog.title}
                  </h3>

                  <p className="text-slate-600 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
                    {blog.summary || (blog as any).short_description}
                  </p>


                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    {blog.author_name && (
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <User className="w-3.5 h-3.5" />
                        {blog.author_name}
                      </span>
                    )}
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="inline-flex items-center text-sm font-bold text-slate-900 hover:text-primary gap-1 transition-colors ml-auto"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};
