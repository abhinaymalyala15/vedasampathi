import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function PathasalaGallery() {
  const [uploading, setUploading] = useState(false);

  const { data: gallery = [], isLoading, refetch } = useQuery({
    queryKey: ['pathasala-gallery'],
    queryFn: () => api.get('/pathasala/gallery'),
  });

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await api.upload('/upload', formData);
        await api.post('/pathasala/gallery', {
          image_url: res.url,
          caption: file.name
        });
      }
      toast.success(`${files.length} image(s) uploaded successfully`);
      refetch();
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      await api.delete(`/pathasala/gallery/${imageId}`);
      toast.success('Image deleted');
      refetch();
    } catch (err) {
      toast.error('Failed to delete image');
    }
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-primary mb-2">Gallery Management</h1>
      <p className="text-muted-foreground mb-8">Upload and manage institution photos</p>

      <div className="bg-card rounded-2xl shadow-vedic p-6 mb-6">
        <label className="cursor-pointer inline-flex items-center gap-2 bg-secondary/15 text-secondary font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-secondary/25 transition-all">
          <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload Images'}
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading gallery...</div>
      ) : gallery.length === 0 ? (
        <div className="bg-card rounded-2xl shadow-vedic p-12 text-center">
          <ImageIcon className="w-12 h-12 text-muted mx-auto mb-4" />
          <p className="text-muted-foreground">No images uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {gallery.map((img) => (
            <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group">
              <img src={img.image_url} alt={img.caption || 'Gallery'} className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(img.id)}
                className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}