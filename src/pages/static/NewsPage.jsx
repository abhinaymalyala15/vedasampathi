import { useQuery } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { StaticContentPage } from '@/components/StaticPageLayout';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { HERITAGE, PAGE_HEROES } from '@/lib/templeAssets';

export default function NewsPage() {
  const { data: res = {}, isLoading } = useQuery({
    queryKey: ['events', 'news'],
    queryFn: () => api.get('/events'),
  });
  const events = res?.data ?? [];

  return (
    <StaticContentPage
      badge="Announcements"
      title="News & Updates"
      subtitle="Latest updates and announcements from the Vedasampatti community"
      image={PAGE_HEROES.news}
      wide
    >
      {isLoading ? (
        <div className="space-y-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-28 bg-muted/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <p className="text-muted-foreground text-center py-16">No news available at this time.</p>
      ) : (
        <motion.div {...staggerContainer(0.06)} className="space-y-4">
          {events.map((event, i) => (
            <motion.div key={event.id} variants={staggerItem}>
              <Link
                to={`/events/${event.id}`}
                className="flex gap-5 temple-card p-5 hover:shadow-glow-gold transition-all group"
              >
                <div className="w-28 h-24 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={event.image || HERITAGE.temple.gopuram}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-heading text-lg font-semibold text-primary group-hover:text-secondary transition-colors line-clamp-1 mb-1">
                    {event.title}
                  </h2>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{event.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-secondary" />
                      {event.date ? format(new Date(event.date), 'dd MMM yyyy') : 'TBA'}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-secondary" />
                      {event.location}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-secondary shrink-0 self-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </StaticContentPage>
  );
}
