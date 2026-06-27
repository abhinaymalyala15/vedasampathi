import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { Plus, Trash2, Star, Calendar, MapPin, Edit2, X, Send } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const EMPTY_FORM = { title: '', description: '', date: '', time: '', location: '', event_type: 'offline', featured: false, registration_link: '' };

export default function AdminEvents() {
  const [showForm, setShowForm]       = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const queryClient                   = useQueryClient();

  const { data: events = [] } = useQuery({
    queryKey: ['admin', 'events'],
    queryFn:  () => api.get('/admin/events'),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'events'] });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/admin/events', data),
    onSuccess:  () => { invalidate(); setShowForm(false); setForm(EMPTY_FORM); toast.success('Event created'); },
    onError:    () => toast.error('Failed to create event'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/events/${id}`, data),
    onSuccess:  (res) => { invalidate(); setEditingEvent(null); setForm(EMPTY_FORM); toast.success(`Event updated${res?.notified > 0 ? ` · ${res.notified} subscriber(s) notified` : ''}`); },
    onError:    () => toast.error('Failed to update event'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/events/${id}`),
    onSuccess:  () => { invalidate(); toast.success('Event deleted'); },
  });

  const toggleFeatured = (event) =>
    api.put(`/admin/events/${event.id}`, { featured: !event.featured }).then(invalidate);

  const startEdit = (event) => {
    setEditingEvent(event);
    setForm({ title: event.title || '', description: event.description || '', date: event.date || '', time: event.time || '', location: event.location || '', event_type: event.event_type || 'offline', featured: event.featured || false, registration_link: event.registration_link || '' });
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.location) { toast.error('Title, date, and location are required'); return; }
    if (editingEvent) updateMutation.mutate({ id: editingEvent.id, data: form });
    else createMutation.mutate(form);
  };

  const field = (label, key, type = 'text', extra = {}) => (
    <div key={key}>
      <label className="block text-sm font-semibold text-primary mb-2">{label}</label>
      <input type={type} value={form[key]} onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))} {...extra}
        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary mb-2">Event Management</h1>
          <p className="text-muted-foreground">Create, edit, and manage all events</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingEvent(null); setForm(EMPTY_FORM); }}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Create Event'}
        </button>
      </div>

      {(showForm || editingEvent) && (
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-vedic p-6 mb-8 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-heading text-lg font-bold text-primary">{editingEvent ? 'Edit Event' : 'New Event'}</h2>
            <button type="button" onClick={() => { setShowForm(false); setEditingEvent(null); setForm(EMPTY_FORM); }} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('Event Title *', 'title')}
            {field('Date *', 'date', 'date')}
            {field('Time', 'time', 'text', { placeholder: '09:00 AM' })}
            {field('Location *', 'location')}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Event Type</label>
              <select value={form.event_type} onChange={(e) => setForm(f => ({ ...f, event_type: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="offline">Offline</option>
                <option value="online">Online</option>
              </select>
            </div>
            {field('Registration Link', 'registration_link')}
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Description</label>
            <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              rows={4} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <button type="button" onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
              className={`relative w-14 h-7 rounded-full transition-colors ${form.featured ? 'bg-secondary' : 'bg-muted'}`}>
              <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${form.featured ? 'translate-x-7' : ''}`} />
            </button>
            <span className="text-sm font-semibold text-primary">Mark as Featured</span>
          </label>
          <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground font-semibold px-6 py-2.5 rounded-full hover:bg-secondary/90 transition-all disabled:opacity-50">
            {editingEvent ? <><Send className="w-4 h-4" /> Save &amp; Notify Subscribers</> : <><Plus className="w-4 h-4" /> Publish Event</>}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-vedic p-12 text-center">
            <Calendar className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted-foreground">No events created yet.</p>
          </div>
        ) : events.map((event) => (
          <div key={event.id} className="bg-card rounded-2xl shadow-vedic p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center shrink-0">
                <p className="font-heading text-lg font-bold text-secondary">{event.date ? format(new Date(event.date), 'dd') : 'TBA'}</p>
                <p className="text-xs text-muted-foreground">{event.date ? format(new Date(event.date), 'MMM') : ''}</p>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-primary">{event.title}</h3>
                  {event.featured && <Star className="w-4 h-4 text-secondary fill-secondary" />}
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {event.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleFeatured(event)} className={`p-2 rounded-lg transition-colors ${event.featured ? 'text-secondary bg-secondary/10' : 'text-muted-foreground hover:bg-muted'}`} title="Toggle featured">
                <Star className={`w-4 h-4 ${event.featured ? 'fill-secondary' : ''}`} />
              </button>
              <button onClick={() => startEdit(event)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => deleteMutation.mutate(event.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}