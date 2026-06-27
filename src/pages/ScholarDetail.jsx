import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { MapPin, GraduationCap, Briefcase, FileText, Award, ArrowLeft } from 'lucide-react';

export default function ScholarDetail() {
  const { id } = useParams();

  const { data: scholar, isLoading } = useQuery({
    queryKey: ['scholar', id],
    queryFn: () => api.get(`/scholars/${id}`),
    enabled: !!id,
  });

  // The Laravel API returns nested qualifications and experiences
  const qualifications = scholar?.qualifications ?? [];
  const experiences    = scholar?.experiences ?? [];
  const documents      = scholar?.documents ?? [];

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!scholar) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground text-lg mb-4">Scholar not found.</p>
        <Link to="/scholars" className="text-primary font-semibold hover:underline">Back to Scholars</Link>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Header */}
      <div className="relative bg-gradient-sacred pt-24 lg:pt-28 pb-16 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] sacred-pattern" />
        <div className="container-premium max-w-5xl relative">
          <Link to="/scholars" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-secondary transition-colors mb-8 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Scholars
          </Link>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            <div className="temple-frame w-36 h-36 shrink-0 shadow-premium-lg">
              <img
                src={scholar.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(scholar.full_name)}&background=fff&color=8B1A36&size=300`}
                alt={scholar.full_name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="font-heading text-3xl lg:text-4xl font-bold text-primary-foreground mb-2">
                {scholar.full_name}
              </h1>
              <p className="text-secondary font-medium text-lg mb-3">
                {scholar.specialisations?.join(' • ') || 'Vedic Scholar'}
              </p>
              <p className="text-primary-foreground/70 flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-4 h-4" />
                {scholar.city}{scholar.state ? `, ${scholar.state}` : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            {scholar.bio && (
              <div className="bg-card rounded-2xl shadow-vedic p-8">
                <h2 className="font-heading text-xl font-bold text-primary mb-4">About</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: scholar.bio }} />
              </div>
            )}

            {/* Qualifications */}
            {qualifications.length > 0 && (
              <div className="bg-card rounded-2xl shadow-vedic p-8">
                <h2 className="font-heading text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-secondary" /> Qualifications
                </h2>
                <div className="space-y-4">
                  {qualifications.map((q) => (
                    <div key={q.id} className="border-l-2 border-secondary/30 pl-4">
                      <h3 className="font-semibold text-primary">{q.degree}</h3>
                      <p className="text-sm text-muted-foreground">{q.institution} • {q.year}</p>
                      {q.description && <p className="text-sm text-muted-foreground mt-1">{q.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
              <div className="bg-card rounded-2xl shadow-vedic p-8">
                <h2 className="font-heading text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-secondary" /> Experience
                </h2>
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="border-l-2 border-secondary/30 pl-4">
                      <h3 className="font-semibold text-primary">{exp.role}</h3>
                      <p className="text-sm text-muted-foreground">{exp.organisation} • {exp.from_year} - {exp.to_year || 'Present'}</p>
                      {exp.description && <p className="text-sm text-muted-foreground mt-1">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Documents */}
            {documents.length > 0 && (
              <div className="bg-card rounded-2xl shadow-vedic p-6">
                <h3 className="font-heading text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-secondary" /> Documents
                </h3>
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <FileText className="w-5 h-5 text-primary shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-primary">{doc.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{doc.type}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Donate CTA */}
            <div className="bg-gradient-maroon rounded-2xl p-6 text-center">
              <GraduationCap className="w-10 h-10 text-secondary mx-auto mb-3" />
              <h3 className="font-heading text-lg font-bold text-primary-foreground mb-2">
                Support This Scholar
              </h3>
              <p className="text-sm text-primary-foreground/60 mb-4">
                Your sponsorship helps continue their sacred work
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