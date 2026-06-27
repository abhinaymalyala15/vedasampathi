import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { Save, Upload, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function PathasalaDetails() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    institution_name: '', address: '', city: '', state: '',
    pincode: '', description: '', contact_email: '', contact_phone: '',
    website: '', photo: '',
  });
  const [uploading, setUploading] = useState(false);

  const { data: pathasala, isLoading } = useQuery({
    queryKey: ['pathasala', 'profile'],
    queryFn:  () => api.get('/pathasala/profile'),
  });

  useEffect(() => {
    if (pathasala) {
      setForm({
        institution_name: pathasala.institution_name || '',
        address:          pathasala.address || '',
        city:             pathasala.city || '',
        state:            pathasala.state || '',
        pincode:          pathasala.pincode || '',
        description:      pathasala.description || '',
        contact_email:    pathasala.contact_email || '',
        contact_phone:    pathasala.contact_phone || '',
        website:          pathasala.website || '',
        photo:            pathasala.photo || '',
      });
    }
  }, [pathasala]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const result = await api.upload('/upload', formData);
      setForm(f => ({ ...f, photo: result.url }));
      toast.success('Photo uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const saveMutation = useMutation({
    mutationFn: (data) => api.put('/pathasala/profile', data),
    onSuccess:  () => { queryClient.invalidateQueries({ queryKey: ['pathasala', 'profile'] }); toast.success('Details saved'); },
    onError:    () => toast.error('Failed to save'),
  });

  const handleSave = (e) => { e.preventDefault(); saveMutation.mutate(form); };

  if (isLoading) return <div className="text-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto" /></div>;

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-primary mb-2">Institution Details</h1>
      <p className="text-muted-foreground mb-8">Manage your pathasala information</p>

      <form onSubmit={handleSave} className="max-w-3xl space-y-6">
        <div className="bg-card rounded-2xl shadow-vedic p-6">
          <h2 className="font-heading text-lg font-bold text-primary mb-4">Institution Photo</h2>
          <div className="flex items-center gap-6">
            <div className="w-32 h-24 rounded-xl overflow-hidden ring-4 ring-muted/50 bg-muted">
              {form.photo ? <img src={form.photo} alt="Institution" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No photo</div>}
            </div>
            <label className="cursor-pointer inline-flex items-center gap-2 bg-secondary/15 text-secondary font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-secondary/25 transition-all">
              <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload Photo'}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-vedic p-6 space-y-4">
          <h2 className="font-heading text-lg font-bold text-primary">Basic Information</h2>
          {[
            { label: 'Institution Name', key: 'institution_name', type: 'text' },
            { label: 'Contact Email',    key: 'contact_email',    type: 'email' },
            { label: 'Contact Phone',    key: 'contact_phone',    type: 'tel' },
            { label: 'Website',          key: 'website',          type: 'text' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-primary mb-2">{label}</label>
              <input type={type} value={form[key]} onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Description</label>
            <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              rows={4} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['address', 'city', 'state', 'pincode'].map((key) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-primary mb-2 capitalize">{key}</label>
                <input type="text" value={form[key]} onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saveMutation.isPending}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-3.5 rounded-full hover:bg-primary/90 transition-all disabled:opacity-50">
          {saveMutation.isPending ? <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
          Save Details
        </button>
      </form>
    </div>
  );
}