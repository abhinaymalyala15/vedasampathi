import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { Calendar, MapPin, Clock, ArrowLeft, Video, MapPinned, ExternalLink, Bell, BellOff, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { HERITAGE } from '@/lib/templeAssets';
import { TempleDivider } from '@/components/ui/TempleMotifs';

export default function EventDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    api.get('/auth/me').then(setCurrentUser).catch(() => setCurrentUser(null));
  }, []);

  const { data: event, isLoading, refetch } = useQuery({
    queryKey: ['event', id],
    queryFn: () => api.get(`/events/${id}`),
    enabled: !!id,
  });

  const isSubscribed = event?.is_subscribed;

  const subscribeMutation = useMutation({
    mutationFn: () => api.post(`/events/${id}/subscribe`),
    onSuccess: () => {
      refetch();
      toast({ title: 'Subscribed!', description: 'You will be notified when this event is updated.' });
    },
  });

  const unsubscribeMutation = useMutation({
    mutationFn: () => api.delete(`/events/${id}/unsubscribe`),
    onSuccess: () => {
      refetch();
      toast({ title: 'Unsubscribed', description: 'You will no longer receive updates for this event.' });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-20 text-center bg-background">
        <p className="text-muted-foreground text-lg mb-4">Event not found.</p>
        <Link to="/events" className="text-primary font-semibold hover:underline">Back to Events</Link>
      </div>
    );
  }

  const headerImage = event.image || HERITAGE.temple.sunrise;

  return (
    <div className="bg-background min-h-screen">
      {/* Temple-style header */}
      <div className="relative min-h-[320px] lg:min-h-[380px] overflow-hidden">
        <img
          src={headerImage}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/75 to-primary/40" />
        <div className="absolute inset-0 opacity-[0.06] sacred-pattern" />

        <div className="relative container-premium max-w-4xl pt-24 lg:pt-28 pb-12 lg:pb-16">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-white/70 hover:text-secondary transition-colors mb-8 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-secondary/20 text-secondary border border-secondary/30 mb-4">
                {event.event_type === 'online' ? (
                  <><Video className="w-3.5 h-3.5" /> Online Event</>
                ) : (
                  <><MapPinned className="w-3.5 h-3.5" /> In Person</>
                )}
              </span>
              <h1 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight text-balance">
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-5 text-white/75 text-sm">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-secondary" />
                  {event.date ? format(new Date(event.date), 'dd MMM yyyy') : 'TBA'}
                </span>
                {event.time && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-secondary" />
                    {event.time}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-secondary" />
                  {event.location}
                </span>
              </div>
            </div>

            {currentUser ? (
              <button
                onClick={() => isSubscribed ? unsubscribeMutation.mutate() : subscribeMutation.mutate()}
                disabled={subscribeMutation.isPending || unsubscribeMutation.isPending}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all shrink-0 ${
                  isSubscribed
                    ? 'bg-white/15 hover:bg-white/10 text-white border border-white/25'
                    : 'btn-temple-gold'
                }`}
              >
                {isSubscribed ? (
                  <><BellOff className="w-4 h-4" /> Unsubscribe</>
                ) : (
                  <><Bell className="w-4 h-4" /> Subscribe for Updates</>
                )}
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm bg-white/15 hover:bg-white/25 text-white border border-white/25 transition-all shrink-0"
              >
                <Bell className="w-4 h-4" /> Login to Subscribe
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-premium max-w-4xl py-12">
        <div className="temple-card p-8 lg:p-10">
          <h2 className="font-heading text-xl font-semibold text-primary mb-2">About This Event</h2>
          <TempleDivider className="mb-6 max-w-[120px]" />
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-base">
            {event.description || 'No description available.'}
          </p>

          {isSubscribed && (
            <div className="mt-6 flex items-center gap-2 text-sm text-olive">
              <Check className="w-4 h-4" />
              You are subscribed — you'll receive notifications when this event is updated.
            </div>
          )}

          {event.registration_link && (
            <div className="mt-8 pt-6 border-t border-border/60">
              <a
                href={event.registration_link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-temple-gold inline-flex items-center gap-2"
              >
                Register for Event <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
