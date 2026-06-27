import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { Plus, Trash2, FileText, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCMS() {
  const [editingPage, setEditingPage] = useState(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [body, setBody] = useState('');
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: pages = [] } = useQuery({
    queryKey: ['cms-pages'],
    queryFn: () => api.get('/admin/cms'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/admin/cms', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-pages'] });
      resetForm();
      toast.success('Page created');
    },
    onError: () => toast.error('Failed to create page'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/cms/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-pages'] });
      resetForm();
      toast.success('Page updated');
    },
    onError: () => toast.error('Failed to update page'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/cms/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-pages'] });
      toast.success('Page deleted');
    },
  });

  const resetForm = () => {
    setEditingPage(null);
    setTitle('');
    setSlug('');
    setBody('');
    setShowForm(false);
  };

  const handleEdit = (page) => {
    setEditingPage(page.id);
    setTitle(page.title);
    setSlug(page.slug);
    setBody(page.content || '');
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !slug) { toast.error('Title and slug are required'); return; }
    const data = { title, slug, content: body, is_published: true };
    if (editingPage) {
      updateMutation.mutate({ id: editingPage, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary mb-2">CMS Management</h1>
          <p className="text-muted-foreground">Manage static pages and content</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'New Page'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-vedic p-6 mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Page Title *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Privacy Policy" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">URL Slug *</label>
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. privacy-policy" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Page Content</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10} placeholder="Write the page content here..." className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          </div>
          <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground font-semibold px-6 py-2.5 rounded-full hover:bg-secondary/90 transition-all disabled:opacity-50">
            <Save className="w-4 h-4" /> {editingPage ? 'Update Page' : 'Create Page'}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {pages.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-vedic p-12 text-center">
            <FileText className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted-foreground">No CMS pages created yet.</p>
          </div>
        ) : (
          pages.map((page) => (
            <div key={page.id} className="bg-card rounded-2xl shadow-vedic p-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-primary">{page.title}</h3>
                <p className="text-sm text-muted-foreground">/pages/{page.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(page)} className="px-4 py-2 text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-full transition-colors">
                  Edit
                </button>
                <button onClick={() => deleteMutation.mutate(page.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}