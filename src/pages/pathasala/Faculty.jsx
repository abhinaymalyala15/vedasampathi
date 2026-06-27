import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { Plus, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function PathasalaFaculty() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio]   = useState('');

  const { data: faculty = [], isLoading } = useQuery({
    queryKey: ['pathasala', 'faculty'],
    queryFn:  () => api.get('/pathasala/faculty'),
  });

  const [localFaculty, setLocalFaculty] = useState(null);
  const displayFaculty = localFaculty ?? faculty;

  const addMember = (e) => {
    e.preventDefault();
    if (!name || !role) { toast.error('Name and role are required'); return; }
    setLocalFaculty([...(localFaculty ?? faculty), { name, role, bio }]);
    setName(''); setRole(''); setBio('');
  };

  const removeMember = (idx) => {
    setLocalFaculty(displayFaculty.filter((_, i) => i !== idx));
  };

  const saveMutation = useMutation({
    mutationFn: () => api.put('/pathasala/faculty', { faculty: displayFaculty }),
    onSuccess:  () => {
      queryClient.invalidateQueries({ queryKey: ['pathasala', 'faculty'] });
      setLocalFaculty(null);
      toast.success('Faculty saved');
    },
    onError: () => toast.error('Failed to save'),
  });

  if (isLoading) return <div className="text-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto" /></div>;

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-primary mb-2">Faculty Information</h1>
      <p className="text-muted-foreground mb-8">Manage your teaching faculty</p>

      <form onSubmit={addMember} className="bg-card rounded-2xl shadow-vedic p-6 mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Role *</label>
            <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Senior Guru"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">Bio</label>
          <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Brief bio"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <button type="submit" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-full hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" /> Add Faculty Member
        </button>
      </form>

      <div className="space-y-3 mb-6">
        {displayFaculty.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-vedic p-12 text-center">
            <Users className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted-foreground">No faculty members added yet.</p>
          </div>
        ) : displayFaculty.map((member, idx) => (
          <div key={idx} className="bg-card rounded-2xl shadow-vedic p-5 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-primary">{member.name}</h3>
              <p className="text-sm text-secondary font-medium">{member.role}</p>
              {member.bio && <p className="text-sm text-muted-foreground mt-1">{member.bio}</p>}
            </div>
            <button onClick={() => removeMember(idx)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {displayFaculty.length > 0 && (
        <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}
          className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground font-bold px-8 py-3.5 rounded-full hover:bg-secondary/90 transition-all disabled:opacity-50">
          {saveMutation.isPending && <span className="w-5 h-5 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin" />}
          Save Faculty
        </button>
      )}
    </div>
  );
}