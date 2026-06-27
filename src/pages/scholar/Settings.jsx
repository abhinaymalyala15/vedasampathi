import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { Save, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const saveMutation = useMutation({
    mutationFn: (data) => api.put('/scholar/settings', data),
    onSuccess: () => {
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
      toast.success('Password updated');
    },
    onError: (err) => toast.error(err.message || 'Failed to update'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) { toast.error('Enter a new password'); return; }
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    saveMutation.mutate({
      current_password: currentPassword,
      password,
      password_confirmation: confirmPassword,
    });
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-primary mb-2">Settings</h1>
      <p className="text-muted-foreground mb-8">Manage your account security</p>

      <form onSubmit={handleSubmit} className="max-w-md bg-card rounded-2xl shadow-vedic p-6 space-y-4">
        <h2 className="font-heading text-lg font-bold text-primary flex items-center gap-2">
          <Lock className="w-5 h-5 text-secondary" /> Change Password
        </h2>
        {[
          ['Current Password', currentPassword, setCurrentPassword],
          ['New Password', password, setPassword],
          ['Confirm Password', confirmPassword, setConfirmPassword],
        ].map(([label, value, setter]) => (
          <div key={label}>
            <label className="block text-sm font-semibold text-primary mb-2">{label}</label>
            <input
              type="password"
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              required={label !== 'Current Password' || !!password}
            />
          </div>
        ))}
        <button type="submit" disabled={saveMutation.isPending} className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-3 rounded-full disabled:opacity-50">
          {saveMutation.isPending ? <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
          Update Password
        </button>
      </form>
    </div>
  );
}
