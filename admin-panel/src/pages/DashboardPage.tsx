import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Truck,
  Newspaper,
  Image as ImageIcon,
  HelpCircle,
  Mail,
  ArrowRight,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { dashboardApi } from '../api/dashboard.api';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { DataTable, Column } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Skeleton } from '../components/ui/Skeleton';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { ContactMessage } from '../types/contact';
import { Blog } from '../types/blog';
import { formatDate } from '../utils/format';

export const DashboardPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const res = await dashboardApi.getSummary();
      return res.data;
    },
  });

  const messageColumns: Column<ContactMessage>[] = [
    { header: 'Sender Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Subject', accessor: (row) => <span className="font-semibold text-slate-900">{row.subject}</span> },
    { header: 'Status', accessor: (row) => <StatusBadge status={row.status} /> },
    { header: 'Date', accessor: (row) => formatDate(row.created_at) },
    {
      header: 'Actions',
      accessor: (row) => (
        <Link
          to={`/contact-messages/${row.id}`}
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Overview' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-slate-500 font-medium">
            System summary and website engagement analytics
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Services"
            value={data?.total_services || 0}
            subtitle="Active website offerings"
            icon={<Truck className="w-5 h-5" />}
            color="blue"
          />
          <StatCard
            title="Total Blogs"
            value={data?.total_blogs || 0}
            subtitle={`${data?.published_blogs || 0} Published Articles`}
            icon={<Newspaper className="w-5 h-5" />}
            color="indigo"
          />
          <StatCard
            title="Gallery Media"
            value={data?.total_gallery_items || 0}
            subtitle={`${data?.total_faqs || 0} FAQs Configured`}
            icon={<ImageIcon className="w-5 h-5" />}
            color="emerald"
          />
          <StatCard
            title="Contact Messages"
            value={data?.total_contact_messages || 0}
            subtitle={`${data?.new_contact_messages || 0} New Enquiries`}
            icon={<Mail className="w-5 h-5" />}
            color={data?.new_contact_messages ? 'rose' : 'amber'}
          />
        </div>
      )}

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Contact Messages */}
        <div className="lg:col-span-2 space-y-4">
          <Card
            title="Recent Contact Messages"
            subtitle="Latest website enquiries submitted by clients"
            action={
              <Link
                to="/contact-messages"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                View All Messages <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            <DataTable
              columns={messageColumns}
              data={data?.recent_contact_messages || []}
              isLoading={isLoading}
              keyExtractor={(row) => row.id}
              emptyTitle="No recent messages"
              emptyDescription="Enquiries submitted on the website will appear here."
            />
          </Card>
        </div>

        {/* Recent Blogs & Services Side Panel */}
        <div className="space-y-6">
          <Card
            title="Recent Blog Posts"
            action={
              <Link to="/blogs" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                Manage Blogs
              </Link>
            }
          >
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 rounded-lg" />
                <Skeleton className="h-12 rounded-lg" />
              </div>
            ) : !data?.recent_blogs || data.recent_blogs.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No blog posts found.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {data.recent_blogs.map((blog: Blog) => (
                  <div key={blog.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-slate-900 truncate">{blog.title}</span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {formatDate(blog.published_at || blog.created_at)}
                      </span>
                    </div>
                    <StatusBadge status={blog.status} />
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card
            title="Active Services"
            action={
              <Link to="/services" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                All Services
              </Link>
            }
          >
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 rounded-lg" />
                <Skeleton className="h-10 rounded-lg" />
              </div>
            ) : !data?.recent_services || data.recent_services.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No active services found.</p>
            ) : (
              <div className="space-y-2">
                {data.recent_services.map((svc) => (
                  <div
                    key={svc.id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="text-xs font-semibold text-slate-800 truncate">{svc.title}</span>
                    </div>
                    {svc.is_featured && (
                      <span className="text-[10px] bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded border border-amber-200">
                        Featured
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
