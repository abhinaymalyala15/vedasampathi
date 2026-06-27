import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { Search, Users, Shield, UserCheck, UserX } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: res = {}, isLoading } = useQuery({
    queryKey: ['users', 'admin'],
    queryFn: () => api.get('/admin/users'),
  });
  const allUsers = res?.data ?? [];

  const filtered = useMemo(() =>
    allUsers.filter((u) =>
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    ),
  [allUsers, search]);

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }) => api.patch(`/admin/users/${id}`, { is_active }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['users', 'admin'] }); toast.success('User updated'); },
    onError: () => toast.error('Update failed'),
  });

  const roleColors = {
    admin:     'bg-primary text-primary-foreground',
    scholar:   'bg-muted text-foreground',
    pathasala: 'bg-secondary/20 text-secondary',
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-primary mb-2">User Management</h1>
      <p className="text-muted-foreground mb-8">View and manage portal users</p>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-full border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* User List */}
      <div className="bg-card rounded-2xl shadow-vedic overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading users...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted-foreground">No users found.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center">
                    <span className="font-heading text-sm font-bold text-secondary">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-primary text-sm">{user.name || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${roleColors[user.role] || 'bg-muted text-foreground'}`}>
                    {user.role || 'user'}
                  </span>
                  <button
                    onClick={() => toggleMutation.mutate({ id: user.id, is_active: !user.is_active })}
                    className={`p-1.5 rounded-lg transition-colors ${user.is_active ? 'text-secondary hover:bg-secondary/10' : 'text-destructive hover:bg-destructive/10'}`}
                    title={user.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {user.is_active ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}