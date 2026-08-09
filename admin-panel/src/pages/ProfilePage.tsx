import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { User, Lock, Save, ShieldCheck } from 'lucide-react';
import { changePasswordSchema, ChangePasswordFormData } from '../schemas/auth.schema';
import { authApi } from '../api/auth.api';
import { useAuth } from '../hooks/useAuth';
import { toast } from '../hooks/useToast';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  const {
    register: registerPwd,
    handleSubmit: handleSubmitPwd,
    reset: resetPwd,
    formState: { errors: pwdErrors, isSubmitting: pwdSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const passwordMutation = useMutation({
    mutationFn: (data: ChangePasswordFormData) =>
      authApi.changePassword(data.current_password, data.new_password),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Password changed successfully!');
        resetPwd();
      } else {
        toast.error(res.message || 'Failed to change password');
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Error changing password');
    },
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <Breadcrumb items={[{ label: 'Admin Profile' }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Admin Profile & Security</h1>
          <p className="text-xs text-slate-500 font-medium">View account status and update authentication credentials</p>
        </div>
      </div>

      <Card title="Profile Details">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 mb-6">
          <div className="w-14 h-14 rounded-full bg-slate-900 text-white font-bold text-xl flex items-center justify-center border-2 border-blue-500 shadow-md">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-bold text-slate-900">{user?.name}</h3>
            <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <StatusBadge status={user?.role || 'ADMIN'} type="role" />
              <StatusBadge status={user?.is_active ?? true} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" value={user?.name || ''} readOnly className="bg-slate-50 text-slate-500 cursor-not-allowed" />
          <Input label="Email Address" value={user?.email || ''} readOnly className="bg-slate-50 text-slate-500 cursor-not-allowed" />
        </div>
      </Card>

      <Card title="Change Password" subtitle="Update your account login password">
        <form onSubmit={handleSubmitPwd((d) => passwordMutation.mutate(d))} className="space-y-4">
          <Input
            label="Current Password *"
            type="password"
            leftIcon={<Lock className="w-4 h-4" />}
            error={pwdErrors.current_password?.message}
            {...registerPwd('current_password')}
          />
          <Input
            label="New Password *"
            type="password"
            leftIcon={<Lock className="w-4 h-4" />}
            error={pwdErrors.new_password?.message}
            {...registerPwd('new_password')}
          />
          <Input
            label="Confirm New Password *"
            type="password"
            leftIcon={<Lock className="w-4 h-4" />}
            error={pwdErrors.confirm_password?.message}
            {...registerPwd('confirm_password')}
          />

          <div className="flex justify-end pt-2">
            <Button type="submit" isLoading={pwdSubmitting || passwordMutation.isPending} leftIcon={<Save className="w-4 h-4" />}>
              Update Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
