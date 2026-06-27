import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { Save, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    full_name: '', bio: '', city: '', state: '', primary_veda: '', shakha: '',
    current_level: '', guru_name: '', sampradaya: '', languages: '', specialisations: '', photo: '',
  });
  const [uploading, setUploading] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['scholar', 'profile'],
    queryFn: () => api.get('/scholar/profile'),
  });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        city: profile.city || '',
        state: profile.state || '',
        primary_veda: profile.primary_veda || '',
        shakha: profile.shakha || '',
        current_level: profile.current_level || '',
        guru_name: profile.guru_name || '',
        sampradaya: profile.sampradaya || '',
        languages: (profile.languages || []).join(', '),
        specialisations: (profile.specialisations || []).join(', '),
        photo: profile.photo || profile.profile_photo_url || '',
      });
    }
  }, [profile]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const result = await api.upload('/upload', formData);
      setForm((f) => ({ ...f, photo: result.url }));
      toast.success('Photo uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const saveMutation = useMutation({
    mutationFn: (data) => api.put('/scholar/profile', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scholar', 'profile'] });
      toast.success('Profile saved');
    },
    onError: () => toast.error('Failed to save'),
  });

  const handleSave = (e) => {
    e.preventDefault();
    saveMutation.mutate({
      full_name: form.full_name,
      bio: form.bio,
      city: form.city,
      state: form.state,
      primary_veda: form.primary_veda,
      shakha: form.shakha,
      current_level: form.current_level,
      guru_name: form.guru_name,
      sampradaya: form.sampradaya,
      photo: form.photo,
      profile_photo_url: form.photo,
      languages: form.languages.split(',').map((s) => s.trim()).filter(Boolean),
      specialisations: form.specialisations.split(',').map((s) => s.trim()).filter(Boolean),
    });
  };

  if (isLoading) {
    return <div className="text-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto" /></div>;
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-primary mb-2">My Profile</h1>
      <p className="text-muted-foreground mb-8">Update your public scholar profile</p>

      <form onSubmit={handleSave} className="max-w-3xl space-y-6">
        <div className="bg-card rounded-2xl shadow-vedic p-6">
          <h2 className="font-heading text-lg font-bold text-primary mb-4">Profile Photo</h2>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-muted/50 bg-muted">
              {form.photo ? (
                <img src={form.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No photo</div>
              )}
            </div>
            <label className="cursor-pointer inline-flex items-center gap-2 bg-secondary/15 text-secondary font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-secondary/25 transition-all">
              <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload Photo'}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-vedic p-6 space-y-4">
          {[
            ['Full Name', 'full_name'], ['City', 'city'], ['State', 'state'],
            ['Primary Veda', 'primary_veda'], ['Shakha', 'shakha'], ['Current Level', 'current_level'],
            ['Guru Name', 'guru_name'], ['Sampradaya', 'sampradaya'],
            ['Languages (comma-separated)', 'languages'], ['Specialisations (comma-separated)', 'specialisations'],
          ].map(([label, key]) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-primary mb-2">{label}</label>
              <input
                type="text"
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>
        </div>

        <button type="submit" disabled={saveMutation.isPending} className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-3.5 rounded-full hover:bg-primary/90 transition-all disabled:opacity-50">
          {saveMutation.isPending ? <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
          Save Profile
        </button>
      </form>
    </div>
  );
}
