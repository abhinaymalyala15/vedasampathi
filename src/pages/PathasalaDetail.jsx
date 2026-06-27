import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { MapPin, Mail, Phone, Globe, Users, Calendar, ArrowLeft, School } from 'lucide-react';
import { format } from 'date-fns';

export default function PathasalaDetail() {
  const { id } = useParams();

  const { data: pathasala, isLoading } = useQuery({
    queryKey: ['pathasala', id],
    queryFn: () => api.get(`/pathasalas/${id}`),
    enabled: !!id,
  });

  const { data: eventsRes } = useQuery({
    queryKey: ['pathasala-events', pathasala?.user_id],
    queryFn: () => api.get(`/events?created_by_role=pathasala&created_by_id=${pathasala.user_id}`),
    enabled: !!pathasala?.user_id,
  });
  const events = eventsRes?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!pathasala) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground text-lg mb-4">Pathasala not found.</p>
        <Link to="/pathasalas" className="text-primary font-semibold hover:underline">Back to Pathasalas</Link>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Header */}
      <div className="relative h-64 lg:h-80 overflow-hidden pt-20">
        <img
          src={pathasala.photo || '/vedic_pathasala.png'}
          alt={pathasala.institution_name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <Link to="/pathasalas" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-secondary transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Pathasalas
            </Link>
            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-primary-foreground mb-2">
              {pathasala.institution_name}
            </h1>
            <p className="text-primary-foreground/70 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {pathasala.address}, {pathasala.city}, {pathasala.state} {pathasala.pincode}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {pathasala.description && (
              <div className="bg-card rounded-2xl shadow-vedic p-8">
                <h2 className="font-heading text-xl font-bold text-primary mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed">{pathasala.description}</p>
              </div>
            )}

            {/* Faculty */}
            {pathasala.faculty && pathasala.faculty.length > 0 && (
              <div className="bg-card rounded-2xl shadow-vedic p-8">
                <h2 className="font-heading text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-secondary" /> Faculty
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pathasala.faculty.map((member, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-muted/50">
                      <h3 className="font-semibold text-primary">{member.name}</h3>
                      <p className="text-sm text-secondary font-medium">{member.role}</p>
                      {member.bio && <p className="text-sm text-muted-foreground mt-1">{member.bio}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {pathasala.gallery && pathasala.gallery.length > 0 && (
              <div className="bg-card rounded-2xl shadow-vedic p-8">
                <h2 className="font-heading text-xl font-bold text-primary mb-4">Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {pathasala.gallery.map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-xl overflow-hidden">
                      <img src={img.image_url || img} alt={img.caption || `Gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Events */}
            {events.length > 0 && (
              <div className="bg-card rounded-2xl shadow-vedic p-8">
                <h2 className="font-heading text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-secondary" /> Upcoming Events
                </h2>
                <div className="space-y-3">
                  {events.map((event) => (
                    <Link
                      key={event.id}
                      to={`/events/${event.id}`}
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="text-center shrink-0">
                        <p className="font-heading text-lg font-bold text-secondary">
                          {event.date ? format(new Date(event.date), 'dd') : 'TBA'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {event.date ? format(new Date(event.date), 'MMM') : ''}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary">{event.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {event.location}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact */}
            <div className="bg-card rounded-2xl shadow-vedic p-6">
              <h3 className="font-heading text-lg font-bold text-primary mb-4">Contact</h3>
              <div className="space-y-3">
                {pathasala.contact_email && (
                  <a href={`mailto:${pathasala.contact_email}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="w-4 h-4 text-secondary" /> {pathasala.contact_email}
                  </a>
                )}
                {pathasala.contact_phone && (
                  <a href={`tel:${pathasala.contact_phone}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Phone className="w-4 h-4 text-secondary" /> {pathasala.contact_phone}
                  </a>
                )}
                {pathasala.website && (
                  <a href={pathasala.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Globe className="w-4 h-4 text-secondary" /> Visit Website
                  </a>
                )}
              </div>
            </div>

            {/* Donate CTA */}
            <div className="bg-gradient-maroon rounded-2xl p-6 text-center">
              <School className="w-10 h-10 text-secondary mx-auto mb-3" />
              <h3 className="font-heading text-lg font-bold text-primary-foreground mb-2">
                Support This Pathasala
              </h3>
              <p className="text-sm text-primary-foreground/60 mb-4">
                Help traditional learning continue
              </p>
              <Link
                to="/donate"
                className="inline-block bg-secondary text-secondary-foreground font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-secondary/90 transition-all"
              >
                Sponsor Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}