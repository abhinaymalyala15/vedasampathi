import { useQuery } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

export default function NewsPage() {
  const { data: res = {}, isLoading } = useQuery({
    queryKey: ['events', 'news'],
    queryFn: () => api.get('/events'),
  });
  const events = res?.data ?? [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-heading text-4xl font-bold text-primary mb-2">News & Announcements</h1>
      <p className="text-muted-foreground text-lg mb-10">Latest updates and announcements from Vedasampatti.</p>
      {isLoading ? (
        <div className="space-y-4">{Array(4).fill(0).map((_, i) => <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse" />)}</div>
      ) : events.length === 0 ? (
        <p className="text-muted-foreground text-center py-16">No news available at this time.</p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <Link key={event.id} to={`/events/${event.id}`} className="flex gap-4 bg-card rounded-2xl p-5 shadow-vedic hover:shadow-vedic-lg transition-all hover:-translate-y-0.5 border border-border group">
              {event.image && (
                <img src={event.image} alt={event.title} className="w-24 h-20 rounded-xl object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h2 className="font-heading text-lg font-bold text-primary group-hover:text-secondary transition-colors line-clamp-1">{event.title}</h2>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{event.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{event.date ? format(new Date(event.date), 'dd MMM yyyy') : 'TBA'}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}