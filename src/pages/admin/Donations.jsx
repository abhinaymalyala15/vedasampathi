import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { IndianRupee, Search, Download } from 'lucide-react';

export default function AdminDonations() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: res = {}, isLoading } = useQuery({
    queryKey: ['donations', 'admin', search, typeFilter, statusFilter],
    queryFn: () => {
      const params = new URLSearchParams({ per_page: '200' });
      if (search) params.set('search', search);
      if (typeFilter !== 'all') params.set('type', typeFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      return api.get(`/admin/donations?${params}`);
    },
  });
  const donations = res?.data ?? [];

  const totalAmount = donations.filter((d) => d.status === 'success').reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-primary mb-2">Donation Management</h1>
      <p className="text-muted-foreground mb-8">View and manage all donations</p>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-2xl shadow-vedic p-6">
          <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center mb-4">
            <IndianRupee className="w-6 h-6 text-secondary" />
          </div>
          <p className="text-2xl font-bold text-primary">₹{totalAmount.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total Successful</p>
        </div>
        <div className="bg-card rounded-2xl shadow-vedic p-6">
          <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center mb-4">
            <Download className="w-6 h-6 text-secondary" />
          </div>
          <p className="text-2xl font-bold text-primary">{donations.length}</p>
          <p className="text-sm text-muted-foreground">Total Donations</p>
        </div>
        <div className="bg-card rounded-2xl shadow-vedic p-6">
          <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center mb-4">
            <IndianRupee className="w-6 h-6 text-secondary" />
          </div>
          <p className="text-2xl font-bold text-primary">{donations.filter((d) => d.status === 'pending').length}</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by donor name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-6 py-3 rounded-full border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium">
          <option value="all">All Types</option>
          <option value="general">General</option>
          <option value="scholar_sponsorship">Scholar Sponsorship</option>
          <option value="pathasala_sponsorship">Pathasala Sponsorship</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-6 py-3 rounded-full border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium">
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl shadow-vedic overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left p-4 text-sm font-semibold text-primary">Donor</th>
                <th className="text-left p-4 text-sm font-semibold text-primary hidden sm:table-cell">Type</th>
                <th className="text-left p-4 text-sm font-semibold text-primary">Amount</th>
                <th className="text-left p-4 text-sm font-semibold text-primary hidden md:table-cell">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-primary hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="text-center p-8 text-muted-foreground">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center p-8 text-muted-foreground">No donations found.</td></tr>
              ) : (
                filtered.map((donation) => (
                  <tr key={donation.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-primary text-sm">{donation.donor_name}</p>
                      <p className="text-xs text-muted-foreground">{donation.donor_email}</p>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground capitalize">{donation.donation_type?.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-primary">₹{donation.amount?.toLocaleString()}</span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        donation.status === 'success' ? 'bg-secondary/15 text-secondary' :
                        donation.status === 'pending' ? 'bg-accent/15 text-accent-foreground' :
                        'bg-destructive/10 text-destructive'
                      }`}>
                        {donation.status}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {donation.created_date ? new Date(donation.created_date).toLocaleDateString() : '-'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}