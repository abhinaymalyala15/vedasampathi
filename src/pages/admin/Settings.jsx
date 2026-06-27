import { useState } from 'react';
import { Save, Settings as SettingsIcon, Bell, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Settings saved');
    }, 500);
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-primary mb-2">System Settings</h1>
      <p className="text-muted-foreground mb-8">Configure portal-wide settings</p>

      <div className="max-w-2xl space-y-6">
        <div className="bg-card rounded-2xl shadow-vedic p-6">
          <h2 className="font-heading text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-secondary" /> Notification Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Email Notifications</label>
              <p className="text-sm text-muted-foreground mb-2">Send email notifications for approvals and donations</p>
              <button className="relative w-14 h-7 rounded-full bg-secondary">
                <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white translate-x-7" />
              </button>
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">SMS Notifications</label>
              <p className="text-sm text-muted-foreground mb-2">Send SMS for OTP and important alerts</p>
              <button className="relative w-14 h-7 rounded-full bg-muted">
                <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-vedic p-6">
          <h2 className="font-heading text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-secondary" /> Payment Settings
          </h2>
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Razorpay Key ID</label>
            <input type="text" placeholder="rzp_live_xxxxxxxx" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 mb-4" />
            <label className="block text-sm font-semibold text-primary mb-2">Razorpay Key Secret</label>
            <input type="password" placeholder="••••••••••••" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-3.5 rounded-full hover:bg-primary/90 transition-all disabled:opacity-50">
          {saving ? <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
          Save Settings
        </button>
      </div>
    </div>
  );
}