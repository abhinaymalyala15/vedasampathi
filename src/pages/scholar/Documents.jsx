import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { Upload, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function Documents() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['scholar', 'documents'],
    queryFn: () => api.get('/scholar/documents'),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['scholar', 'documents'] });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/scholar/documents/${id}`),
    onSuccess: () => { invalidate(); toast.success('Removed'); },
  });

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title || file.name);
      formData.append('type', file.type.includes('pdf') ? 'certificate' : 'document');
      await api.upload('/scholar/documents', formData);
      setTitle('');
      invalidate();
      toast.success('Document uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) return <div className="text-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto" /></div>;

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-primary mb-2">Documents</h1>
      <p className="text-muted-foreground mb-8">Certificates, IDs, and supporting documents</p>

      <div className="bg-card rounded-2xl shadow-vedic p-6 mb-8 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">Document Title (optional)</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <label className="cursor-pointer inline-flex items-center gap-2 bg-secondary/15 text-secondary font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-secondary/25 transition-all">
          <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload Document'}
          <input type="file" accept=".pdf,image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-vedic p-12 text-center">
            <FileText className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted-foreground">No documents uploaded yet.</p>
          </div>
        ) : items.map((doc) => (
          <div key={doc.id} className="bg-card rounded-2xl shadow-vedic p-5 flex items-center justify-between gap-4">
            <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 min-w-0 hover:text-primary">
              <FileText className="w-5 h-5 text-secondary shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold truncate">{doc.title}</p>
                <p className="text-xs text-muted-foreground capitalize">{doc.type}</p>
              </div>
            </a>
            <button onClick={() => deleteMutation.mutate(doc.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
