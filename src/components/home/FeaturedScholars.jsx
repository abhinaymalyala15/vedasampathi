import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Languages, Award, BadgeCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { SectionHeader } from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import { ScholarCardSkeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { SectionMotif } from '@/components/ui/TempleMotifs';
import { staggerContainer, staggerItem } from '@/lib/motion';

export default function FeaturedScholars({ scholars = [], isLoading = false }) {
  const { t } = useLanguage();
  const display = scholars.slice(0, 6);

  return (
    <section className="relative py-section bg-muted/30 overflow-hidden">
      <SectionMotif variant="lotus" />
      <div className="container-premium relative">
        <SectionHeader
          eyebrow="Guru-Shishya Parampara"
          title={t('featured.scholarsTitle')}
          description={t('featured.scholarsDesc')}
          action={
            <Button asChild variant="outline" className="border-secondary/30">
              <Link to="/scholars">{t('featured.viewAll')} <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          }
        />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <ScholarCardSkeleton key={i} />)}
          </div>
        ) : display.length === 0 ? (
          <EmptyState
            variant="scholars"
            title="Scholars Being Verified"
            description="Our gurus and Vedic experts are being registered with care. Return soon to discover verified scholars."
            actionLabel="Explore Pathasalas"
            actionTo="/pathasalas"
          />
        ) : (
          <motion.div {...staggerContainer(0.07)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {display.map((scholar) => (
              <motion.div key={scholar.id} variants={staggerItem}>
                <div className="temple-card p-6 text-center h-full group">
                  <div className="temple-frame w-28 h-28 mx-auto mb-5 rounded-full">
                    <div className="w-full h-full rounded-full overflow-hidden bg-card p-0.5">
                      <img
                        src={scholar.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(scholar.full_name)}&background=6E1F27&color=fff&size=200`}
                        alt={scholar.full_name}
                        className="w-full h-full object-cover rounded-full"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <h3 className="font-heading text-xl font-semibold text-temple-brown mb-1">{scholar.full_name}</h3>
                  <p className="text-sm text-secondary font-medium mb-2 flex items-center justify-center gap-1">
                    <Award className="w-3.5 h-3.5" strokeWidth={1.5} />
                    {scholar.specialisations?.[0] || 'Vedic Scholar'}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mb-3">
                    <MapPin className="w-3.5 h-3.5" /> {scholar.city || 'India'}
                  </p>
                  {scholar.languages?.length > 0 && (
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mb-3">
                      <Languages className="w-3 h-3" /> {scholar.languages.slice(0, 2).join(' · ')}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs text-secondary mb-4">
                    <BadgeCheck className="w-3.5 h-3.5" /> Verified Scholar
                  </span>
                  <Button asChild variant="outline" size="sm" className="w-full border-secondary/30 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                    <Link to={`/scholars/${scholar.id}`}>View Profile</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
