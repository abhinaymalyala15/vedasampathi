import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { Plus, Trash2, Award } from 'lucide-react';
import { toast } from 'sonner';

export default function Qualifications() {
  const queryClient = useQueryClient();
  const [degree, setDegree] = useState('');
  const [institution, setInstitution] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['scholar', 'qualifications'],
    queryFn: () => api.get('/scholar/qualifications'),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['scholar', 'qualifications'] });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/scholar/qualifications', data),
    onSuccess: () => { invalidate(); setDegree(''); setInstitution(''); setYear(''); setDescription(''); toast.success('Added'); },
    onError: () => toast.error('Failed to add'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/scholar/qualifications/${id}`),
    onSuccess: () => { invalidate(); toast.success('Removed'); },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!degree.trim()) { toast.error('Degree is required'); return; }
    createMutation.mutate({ degree, institution, year, description });
  };

  if (isLoading) return <div className="text-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto" /></div>;

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-primary mb-2">Qualifications</h1>
      <p className="text-muted-foreground mb-8">Add your academic and Vedic qualifications</p>

      <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-vedic p-6 mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Degree / Title *</label>
            <input value={degree} onChange={(e) => setDegree(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Institution</label>
            <input value={institution} onChange={(e) => setInstitution(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Year</label>
            <input value={year} onChange={(e) => setYear(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <button type="submit" disabled={createMutation.isPending} className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-full">
          <Plus className="w-4 h-4" /> Add Qualification
        </button>
      </form>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-vedic p-12 text-center">
            <Award className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted-foreground">No qualifications added yet.</p>
          </div>
        ) : items.map((q) => (
          <div key={q.id} className="bg-card rounded-2xl shadow-vedic p-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-primary">{q.degree}</h3>
              <p className="text-sm text-muted-foreground">{q.institution}{q.year ? ` • ${q.year}` : ''}</p>
              {q.description && <p className="text-sm text-muted-foreground mt-1">{q.description}</p>}
            </div>
            <button onClick={() => deleteMutation.mutate(q.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
