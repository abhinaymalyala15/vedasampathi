import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '@/api/apiClient';
import { Calendar, MapPin, Bell } from 'lucide-react';
import { format } from 'date-fns';

export default function MyEvents() {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['scholar', 'events'],
    queryFn: () => api.get('/scholar/events'),
  });

  if (isLoading) {
    return <div className="text-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto" /></div>;
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-primary mb-2">My Events</h1>
      <p className="text-muted-foreground mb-8">Events you are subscribed to for updates</p>

      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-vedic p-12 text-center">
            <Bell className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">You have not subscribed to any events yet.</p>
            <Link to="/events" className="text-primary font-semibold hover:underline">Browse Events</Link>
          </div>
        ) : events.map((event) => (
          <Link key={event.id} to={`/events/${event.id}`} className="block bg-card rounded-2xl shadow-vedic p-5 hover:shadow-glow-gold transition-all">
            <div className="flex items-center gap-4">
              <div className="text-center shrink-0 w-14">
                <p className="font-heading text-lg font-bold text-secondary">{event.date ? format(new Date(event.date), 'dd') : 'TBA'}</p>
                <p className="text-xs text-muted-foreground">{event.date ? format(new Date(event.date), 'MMM') : ''}</p>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-primary">{event.title}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
                  {event.date && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {format(new Date(event.date), 'dd MMM yyyy')}</span>}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
