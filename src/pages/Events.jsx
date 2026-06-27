import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import { EventCardSkeleton } from '@/components/ui/skeleton';
import { staggerContainer, staggerItem } from '@/lib/motion';

export default function Events() {
  const { data: res = {}, isLoading } = useQuery({
    queryKey: ['events', 'all'],
    queryFn: () => api.get('/events?per_page=50'),
  });
  const events = res?.data ?? [];

  return (
    <div>
      <PageHeader
        badge="Gatherings"
        title="Sacred Events"
        subtitle="Join us at Vedic ceremonies, workshops, and cultural gatherings"
      />

      <div className="py-section-sm bg-background">
        <div className="container-premium">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => <EventCardSkeleton key={i} />)}
            </div>
          ) : events.length === 0 ? (
            <EmptyState
              variant="events"
              title="No Events Scheduled"
              description="Sacred gatherings and cultural events will be listed here when available."
            />
          ) : (
            <motion.div {...staggerContainer(0.06)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const eventDate = event.date ? new Date(event.date) : null;
                return (
                  <motion.div key={event.id} variants={staggerItem}>
                    <Link to={`/events/${event.id}`} className="group block premium-card overflow-hidden h-full hover:shadow-glow-gold">
                      <div className="relative h-48 overflow-hidden bg-muted">
                        {event.image ? (
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/15 to-secondary/15" />
                        )}
                        {eventDate && (
                          <div className="absolute top-4 left-4 bg-white rounded-2xl px-3 py-2 text-center shadow-premium min-w-[52px]">
                            <p className="text-xs font-bold text-primary uppercase">{format(eventDate, 'MMM')}</p>
                            <p className="text-xl font-heading font-bold">{format(eventDate, 'dd')}</p>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="font-heading text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{event.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1 text-sm text-muted-foreground">
                            {event.time && (
                              <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-secondary" /> {event.time}</p>
                            )}
                            <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary/60" /> {event.location}</p>
                          </div>
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                            Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
