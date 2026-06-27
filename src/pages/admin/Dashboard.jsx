import { useQuery } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { School, Calendar, IndianRupee, Users, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardPageHeader, StatCard } from '@/components/ui/DashboardPageHeader';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const { data: dash = {} } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => api.get('/admin/dashboard'),
  });

  const pendingCount = (dash.pending_scholars ?? 0) + (dash.pending_pathasalas ?? 0);
  const recentDonations = dash.recent_donations ?? [];

  const stats = [
    { icon: Clock, label: 'Pending Approvals', value: pendingCount, color: 'text-accent', link: '/admin/approvals' },
    { icon: School, label: 'Total Events', value: dash.total_events ?? 0, color: 'text-secondary', link: '/admin/events' },
    { icon: IndianRupee, label: 'Total Donations', value: `₹${(dash.total_donations ?? 0).toLocaleString()}`, color: 'text-primary', link: '/admin/donations' },
    { icon: Users, label: 'Total Donors', value: dash.total_donation_count ?? 0, color: 'text-secondary', link: '/admin/donations' },
  ];

  return (
    <div>
      <DashboardPageHeader title="Admin Dashboard" description="Overview of portal activity" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} color={stat.color} to={stat.link} />
        ))}
      </div>

      {pendingCount > 0 && (
        <div className="premium-card p-6 mb-8 border-secondary/20 bg-secondary/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-[16px] bg-secondary/20 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-1">Pending Approvals</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {dash.pending_scholars ?? 0} scholar(s) and {dash.pending_pathasalas ?? 0} pathasala(s) awaiting review.
              </p>
              <Button asChild size="sm">
                <Link to="/admin/approvals">Review Now</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Donations */}
      <div className="bg-card rounded-2xl shadow-vedic p-6">
        <h2 className="font-heading text-xl font-bold text-primary mb-4">Recent Donations</h2>
        {recentDonations.length === 0 ? (
          <p className="text-muted-foreground text-sm">No donations yet.</p>
        ) : (
          <div className="space-y-3">
            {recentDonations.slice(0, 5).map((donation) => (
              <div key={donation.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div>
                  <p className="font-semibold text-primary">{donation.donor_name}</p>
                  <p className="text-sm text-muted-foreground">{donation.donation_type.replace(/_/g, ' ')}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">₹{donation.amount?.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground capitalize">{donation.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}