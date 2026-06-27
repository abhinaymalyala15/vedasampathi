import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { ArrowLeft, FileText } from 'lucide-react';

export default function CMSPage() {
  const { slug } = useParams();

  const { data: pageData, isLoading } = useQuery({
    queryKey: ['cms-page', slug],
    queryFn: () => api.get(`/pages/${slug}`),
    enabled: !!slug,
  });

  return (
    <div>
      <div className="bg-gradient-maroon py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-secondary transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="font-heading text-4xl font-bold text-primary-foreground">
            {isLoading ? 'Loading...' : pageData?.title || 'Page Not Found'}
          </h1>
        </div>
      </div>

      <div className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto" />
            </div>
          ) : !pageData ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">This page doesn't exist yet.</p>
            </div>
          ) : (
            <div className="bg-card rounded-2xl shadow-vedic p-8 lg:p-12">
              <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-lg">
                {pageData.content}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}