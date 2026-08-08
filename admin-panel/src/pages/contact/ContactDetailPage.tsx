import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Mail, Phone, User, Calendar, CheckCircle2, AlertOctagon, Trash2, Clock } from 'lucide-react';
import { contactApi } from '../../api/contact.api';
import { toast } from '../../hooks/useToast';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Skeleton } from '../../components/ui/Skeleton';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ContactStatus } from '../../types/contact';
import { formatDateTime } from '../../utils/format';

export const ContactDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const messageId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const { data: msg, isLoading } = useQuery({
    queryKey: ['contact-message', messageId],
    queryFn: async () => {
      const res = await contactApi.getMessageById(messageId);
      return res.data;
    },
    enabled: !!messageId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: ContactStatus) => contactApi.updateStatus(messageId, newStatus),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(`Status updated to ${res.data?.status}`);
        queryClient.invalidateQueries({ queryKey: ['contact-message', messageId] });
        queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => contactApi.deleteMessage(messageId),
    onSuccess: () => {
      toast.success('Message deleted');
      navigate('/contact-messages');
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={[{ label: 'Contact Messages', href: '/contact-messages' }, { label: 'Message Details' }]} />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (!msg) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <Breadcrumb
        items={[
          { label: 'Contact Messages', href: '/contact-messages' },
          { label: `Enquiry #${msg.id}` },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/contact-messages" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Enquiry #{msg.id}</h1>
              <StatusBadge status={msg.status} />
            </div>
            <p className="text-xs text-slate-500 font-medium">Received {formatDateTime(msg.created_at)}</p>
          </div>
        </div>

        <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)} leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
          Delete Enquiry
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          <Card title="Subject & Message Content">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Subject</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{msg.subject}</h3>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Message Body</span>
                <div className="mt-2 p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sender Info & Status Actions */}
        <div className="space-y-6">
          <Card title="Sender Information">
            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-500">Name</span>
                  <span className="font-bold text-slate-900">{msg.name}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-slate-500">Email</span>
                  <a href={`mailto:${msg.email}`} className="font-medium text-blue-600 hover:underline truncate">
                    {msg.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-500">Phone</span>
                  <a href={`tel:${msg.phone}`} className="font-medium text-slate-900">
                    {msg.phone}
                  </a>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Update Status">
            <div className="space-y-2">
              <Button
                variant={msg.status === 'READ' ? 'secondary' : 'outline'}
                size="sm"
                className="w-full justify-start"
                onClick={() => updateStatusMutation.mutate('READ')}
                isLoading={updateStatusMutation.isPending}
              >
                Mark as Read
              </Button>
              <Button
                variant={msg.status === 'IN_PROGRESS' ? 'secondary' : 'outline'}
                size="sm"
                className="w-full justify-start text-blue-600"
                onClick={() => updateStatusMutation.mutate('IN_PROGRESS')}
                isLoading={updateStatusMutation.isPending}
              >
                Mark as In Progress
              </Button>
              <Button
                variant={msg.status === 'RESOLVED' ? 'secondary' : 'outline'}
                size="sm"
                className="w-full justify-start text-emerald-600"
                onClick={() => updateStatusMutation.mutate('RESOLVED')}
                isLoading={updateStatusMutation.isPending}
              >
                Mark as Resolved
              </Button>
              <Button
                variant={msg.status === 'SPAM' ? 'secondary' : 'outline'}
                size="sm"
                className="w-full justify-start text-rose-600"
                onClick={() => updateStatusMutation.mutate('SPAM')}
                isLoading={updateStatusMutation.isPending}
              >
                Mark as Spam
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => deleteMutation.mutate()}
        title="Delete Enquiry"
        message="Are you sure you want to delete this contact message? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
