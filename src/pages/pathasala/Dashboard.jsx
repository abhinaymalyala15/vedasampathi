import { useQuery } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { School, Calendar, Users, Image, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function PathasalaDashboard() {
  const { data: profile } = useQuery({
    queryKey: ['pathasala-profile'],
    queryFn: () => api.get('/pathasala/profile'),
  });

  const { data: gallery = [] } = useQuery({
    queryKey: ['pathasala-gallery'],
    queryFn: () => api.get('/pathasala/gallery'),
  });

  const { data: events = [] } = useQuery({
    queryKey: ['events', 'pathasala'],
    queryFn: () => api.get('/pathasala/events'),
  });

  const stats = [
    { icon: School, label: 'Institution Status', value: profile?.status ? (profile.status.charAt(0).toUpperCase() + profile.status.slice(1)) : 'Pending' },
    { icon: Calendar, label: 'Total Events', value: events.length },
    { icon: Users, label: 'Faculty Members', value: profile?.faculty?.length || 0 },
    { icon: Image, label: 'Gallery Photos', value: gallery.length },
  ];

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-primary mb-2">Pathasala Dashboard</h1>
      <p className="text-muted-foreground mb-8">Manage your institution overview</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card rounded-2xl shadow-vedic p-6">
              <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-secondary" />
              </div>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-saffron rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-primary mb-1">Grow Your Presence</h3>
            <p className="text-sm text-primary/70 mb-3">
              Add faculty details, gallery photos, and create events to attract more students and supporters.
            </p>
            <Link to="/pathasala/events" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-5 py-2 rounded-full hover:bg-primary/90 transition-all">
              Create Event
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-vedic p-6">
        <h2 className="font-heading text-xl font-bold text-primary mb-4">Your Events</h2>
        {events.length === 0 ? (
          <p className="text-muted-foreground text-sm">No events created yet.</p>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                <div className="text-center shrink-0">
                  <p className="font-heading text-lg font-bold text-secondary">{event.date ? format(new Date(event.date), 'dd') : 'TBA'}</p>
                  <p className="text-xs text-muted-foreground">{event.date ? format(new Date(event.date), 'MMM') : ''}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-primary">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}