import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Clock, Users, Calendar } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { format } from 'date-fns';
import { SectionHeader } from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import { EventCardSkeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { SectionMotif } from '@/components/ui/TempleMotifs';
import { HERITAGE } from '@/lib/templeAssets';
import { staggerContainer, staggerItem } from '@/lib/motion';

export default function UpcomingEvents({ events = [], isLoading = false }) {
  const { t } = useLanguage();
  const display = events.slice(0, 4);

  return (
    <section className="relative py-section bg-sandstone/30 overflow-hidden">
      <SectionMotif variant="lotus" />
      <div className="container-premium relative">
        <SectionHeader
          eyebrow="Temple Calendar"
          title={t('featured.eventsTitle')}
          description={t('featured.eventsDesc')}
          action={
            <Button asChild variant="outline" className="hidden sm:inline-flex border-secondary/30">
              <Link to="/events">{t('featured.viewAll')} <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          }
        />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
        ) : display.length === 0 ? (
          <EmptyState variant="events" title="Upcoming Gatherings" description="Sacred events and festivals will appear on our temple calendar soon." actionLabel="View Calendar" actionTo="/events" />
        ) : (
          <motion.div {...staggerContainer(0.07)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {display.map((event) => {
              const eventDate = event.date ? new Date(event.date) : null;
              return (
                <motion.div key={event.id} variants={staggerItem}>
                  <Link to={`/events/${event.id}`} className="group block temple-card overflow-hidden h-full">
                    <div className="relative h-44 overflow-hidden bg-muted">
                      <img
                        src={event.image || HERITAGE.knowledge.yagnas}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      {eventDate && (
                        <div className="absolute top-3 left-3 bg-ivory rounded-2xl px-3 py-2 text-center shadow-premium border border-secondary/20 min-w-[52px]">
                          <p className="text-[10px] font-bold text-secondary uppercase">{format(eventDate, 'MMM')}</p>
                          <p className="text-xl font-heading font-bold text-temple-brown">{format(eventDate, 'dd')}</p>
                        </div>
                      )}
                      {event.category && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-primary/90 text-ivory text-[10px] font-bold tracking-wide uppercase">
                          {event.category}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading text-lg font-semibold text-temple-brown mb-3 line-clamp-2 group-hover:text-primary transition-colors">{event.title}</h3>
                      <div className="space-y-1.5 text-sm text-muted-foreground mb-4">
                        {event.time && <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-secondary" /> {event.time}</p>}
                        <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-secondary" /> <span className="line-clamp-1">{event.location}</span></p>
                        {event.seats && <p className="flex items-center gap-2"><Users className="w-3.5 h-3.5" /> {event.seats} seats</p>}
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-secondary">
                        Register <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
