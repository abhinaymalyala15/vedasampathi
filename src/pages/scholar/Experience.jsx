import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { Plus, Trash2, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

export default function Experience() {
  const queryClient = useQueryClient();
  const [role, setRole] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [fromYear, setFromYear] = useState('');
  const [toYear, setToYear] = useState('');
  const [description, setDescription] = useState('');

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['scholar', 'experiences'],
    queryFn: () => api.get('/scholar/experiences'),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['scholar', 'experiences'] });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/scholar/experiences', data),
    onSuccess: () => {
      invalidate();
      setRole(''); setOrganisation(''); setFromYear(''); setToYear(''); setDescription('');
      toast.success('Added');
    },
    onError: () => toast.error('Failed to add'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/scholar/experiences/${id}`),
    onSuccess: () => { invalidate(); toast.success('Removed'); },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!role.trim()) { toast.error('Role is required'); return; }
    createMutation.mutate({ role, organisation, from_year: fromYear, to_year: toYear, description });
  };

  if (isLoading) return <div className="text-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto" /></div>;

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-primary mb-2">Experience</h1>
      <p className="text-muted-foreground mb-8">Teaching, ritual service, and scholarly work</p>

      <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-vedic p-6 mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Role *</label>
            <input value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Organisation</label>
            <input value={organisation} onChange={(e) => setOrganisation(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">From Year</label>
            <input value={fromYear} onChange={(e) => setFromYear(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">To Year</label>
            <input value={toYear} onChange={(e) => setToYear(e.target.value)} placeholder="Present" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <button type="submit" disabled={createMutation.isPending} className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-full">
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </form>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-vedic p-12 text-center">
            <Briefcase className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted-foreground">No experience entries yet.</p>
          </div>
        ) : items.map((exp) => (
          <div key={exp.id} className="bg-card rounded-2xl shadow-vedic p-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-primary">{exp.role}</h3>
              <p className="text-sm text-muted-foreground">{exp.organisation} • {exp.from_year || '—'} - {exp.to_year || 'Present'}</p>
              {exp.description && <p className="text-sm text-muted-foreground mt-1">{exp.description}</p>}
            </div>
            <button onClick={() => deleteMutation.mutate(exp.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
