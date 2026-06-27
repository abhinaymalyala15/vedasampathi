import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import { DashboardPageHeader, StatCard } from '@/components/ui/DashboardPageHeader';
import { Award, Briefcase, FileText, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ['scholar', 'dashboard'],
    queryFn: () => api.get('/scholar/dashboard'),
  });

  const cards = [
    { icon: User, label: 'Profile Status', value: stats.profile_complete ? 'Complete' : 'Incomplete', color: 'text-secondary', to: '/profile' },
    { icon: Award, label: 'Qualifications', value: stats.qualifications_count ?? 0, color: 'text-primary', to: '/profile/qualifications' },
    { icon: Briefcase, label: 'Experience', value: stats.experiences_count ?? 0, color: 'text-secondary', to: '/profile/experience' },
    { icon: FileText, label: 'Documents', value: stats.documents_count ?? 0, color: 'text-primary', to: '/profile/documents' },
    { icon: Calendar, label: 'My Events', value: stats.events_count ?? 0, color: 'text-secondary', to: '/my-events' },
  ];

  return (
    <div>
      <DashboardPageHeader
        title="Scholar Dashboard"
        description={`Welcome back${user?.name ? `, ${user.name}` : ''}!`}
      />

      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <>
          {stats.status === 'approved' && !stats.profile_complete && (
            <div className="premium-card p-6 mb-8 border-secondary/20 bg-secondary/5">
              <p className="text-sm text-muted-foreground mb-4">
                Complete your profile with a bio and photo to appear prominently in the directory.
              </p>
              <Button asChild size="sm"><Link to="/profile">Complete Profile</Link></Button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
