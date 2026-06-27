import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { Plus, Trash2, Calendar, MapPin, Clock, Video, MapPinned } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function PathasalaEvents() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [eventType, setEventType] = useState('offline');
  const [registrationLink, setRegistrationLink] = useState('');
  const queryClient = useQueryClient();

  const { data: events = [] } = useQuery({
    queryKey: ['events', 'pathasala'],
    queryFn: () => api.get('/pathasala/events'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/pathasala/events', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', 'pathasala'] });
      setShowForm(false);
      setTitle(''); setDescription(''); setDate(''); setTime(''); setLocation(''); setRegistrationLink('');
      toast.success('Event created');
    },
    onError: () => toast.error('Failed to create event'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/pathasala/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', 'pathasala'] });
      toast.success('Event deleted');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date || !location) { toast.error('Title, date, and location are required'); return; }
    createMutation.mutate({
      title, description, date, time, location,
      event_type: eventType,
      created_by_role: 'pathasala',
      registration_link: registrationLink || undefined,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary mb-2">Events</h1>
          <p className="text-muted-foreground">Create and manage your institution's events</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Create Event'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-vedic p-6 mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Event Title *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Date *</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Time</label>
              <input type="text" value={time} onChange={(e) => setTime(e.target.value)} placeholder="09:00 AM" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Location *</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Event Type</label>
              <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="offline">Offline</option>
                <option value="online">Online</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Registration Link (optional)</label>
              <input type="text" value={registrationLink} onChange={(e) => setRegistrationLink(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          </div>
          <button type="submit" disabled={createMutation.isPending} className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground font-semibold px-6 py-2.5 rounded-full hover:bg-secondary/90 transition-all disabled:opacity-50">
            <Plus className="w-4 h-4" /> Publish Event
          </button>
        </form>
      )}

      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-vedic p-12 text-center">
            <Calendar className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted-foreground">No events created yet.</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="bg-card rounded-2xl shadow-vedic p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center shrink-0">
                  <p className="font-heading text-lg font-bold text-secondary">{event.date ? format(new Date(event.date), 'dd') : 'TBA'}</p>
                  <p className="text-xs text-muted-foreground">{event.date ? format(new Date(event.date), 'MMM') : ''}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-primary">{event.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
                    {event.event_type === 'online' && <span className="flex items-center gap-1"><Video className="w-3.5 h-3.5" /> Online</span>}
                  </div>
                </div>
              </div>
              <button onClick={() => deleteMutation.mutate(event.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}