import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  const { data: authData, isFetched } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const data = await api.get('/auth/me');
        return { user: data?.user, isAuthenticated: !!data?.user };
      } catch {
        return { user: null, isAuthenticated: false };
      }
    },
  });

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center premium-card p-10 md:p-14">
        <p className="font-heading text-8xl font-bold text-primary/15 mb-2">404</p>
        <h1 className="font-heading text-2xl font-semibold text-foreground mb-3">Page Not Found</h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          The page <span className="font-medium text-foreground">&ldquo;{pageName || 'unknown'}&rdquo;</span> could not be found.
        </p>

        {isFetched && authData?.isAuthenticated && authData.user?.role === 'admin' && (
          <div className="mb-8 p-4 rounded-2xl bg-muted/60 border border-border/60 text-left">
            <p className="text-sm font-semibold text-foreground mb-1">Admin Note</p>
            <p className="text-sm text-muted-foreground">
              This page may not be implemented yet. Check the CMS or routing configuration.
            </p>
          </div>
        )}

        <Button asChild size="lg">
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
