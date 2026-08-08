import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Star, Newspaper } from 'lucide-react';
import { blogsApi } from '../../api/blogs.api';
import { toast } from '../../hooks/useToast';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Button } from '../../components/ui/Button';
import { SearchBar } from '../../components/ui/SearchBar';
import { FilterBar } from '../../components/ui/FilterBar';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Pagination } from '../../components/ui/Pagination';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ImagePreview } from '../../components/ui/ImagePreview';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Blog, BlogStatus } from '../../types/blog';
import { formatDate } from '../../utils/format';

export const BlogsListPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BlogStatus | ''>('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', page, limit, search, statusFilter],
    queryFn: async () => {
      const res = await blogsApi.getBlogs({
        page,
        limit,
        search,
        status: statusFilter || undefined,
      });
      return res;
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: (blog: Blog) =>
      blogsApi.updateBlog(blog.id, { is_featured: !blog.is_featured }),
    onSuccess: () => {
      toast.success('Blog featured status updated');
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => blogsApi.deleteBlog(id),
    onSuccess: () => {
      toast.success('Blog post deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      setDeleteId(null);
    },
  });

  const columns: Column<Blog>[] = [
    {
      header: 'Image',
      accessor: (row) => <ImagePreview src={row.featured_image} alt={row.title} className="w-12 h-12" />,
      className: 'w-16',
    },
    {
      header: 'Blog Title',
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.title}</span>
          <span className="text-[11px] text-slate-400 font-mono">/{row.slug}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: (row) => <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">{row.category || 'General'}</span>,
      className: 'w-28',
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.status} />,
      className: 'w-24',
    },
    {
      header: 'Featured',
      accessor: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFeaturedMutation.mutate(row);
          }}
          className={`p-1.5 rounded-lg transition ${
            row.is_featured ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' : 'text-slate-300 hover:text-amber-400'
          }`}
          title={row.is_featured ? 'Featured on Home' : 'Not Featured'}
        >
          <Star className="w-4 h-4 fill-current" />
        </button>
      ),
      className: 'w-20 text-center',
    },
    {
      header: 'Published Date',
      accessor: (row) => formatDate(row.published_at || row.created_at),
      className: 'w-28',
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/blogs/${row.id}/edit`)}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-md"
            title="Edit Blog"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteId(row.id)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md"
            title="Delete Blog"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      className: 'w-24',
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Blog Management' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Blog CMS Management</h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage industry news, logistics articles, drafting, and publishing
          </p>
        </div>
        <Link to="/blogs/create">
          <Button leftIcon={<Plus className="w-4 h-4" />}>Create Blog Post</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search blogs by title or content..."
        />

        <FilterBar>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as BlogStatus | '');
              setPage(1);
            }}
            className="bg-white border border-slate-300 text-slate-700 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </FilterBar>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        keyExtractor={(row) => row.id}
        emptyTitle="No blog posts found"
        emptyDescription="Create your first blog article to publish on the website."
      />

      {data?.pagination && (
        <Pagination
          metadata={data.pagination}
          onPageChange={setPage}
          onLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
        />
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
