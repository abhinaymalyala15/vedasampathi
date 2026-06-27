import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Users, GraduationCap, Landmark } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { SectionHeader } from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import { PathasalaCardSkeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { SectionMotif } from '@/components/ui/TempleMotifs';
import { HERITAGE } from '@/lib/templeAssets';
import { staggerContainer, staggerItem } from '@/lib/motion';

export default function FeaturedPathasalas({ pathasalas = [], isLoading = false }) {
  const { t } = useLanguage();
  const display = pathasalas.slice(0, 6);

  return (
    <section className="relative py-section temple-bg-paper overflow-hidden">
      <SectionMotif variant="mandala" />
      <div className="container-premium relative">
        <SectionHeader
          eyebrow="Centres of Learning"
          title={t('featured.pathasalasTitle')}
          description={t('featured.pathasalasDesc')}
          action={
            <Button asChild variant="outline" className="border-secondary/30">
              <Link to="/pathasalas">{t('featured.viewAll')} <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          }
        />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <PathasalaCardSkeleton key={i} />)}
          </div>
        ) : display.length === 0 ? (
          <EmptyState
            variant="pathasalas"
            title="Pathasalas Coming Soon"
            description="Traditional Vedic institutions are being verified and welcomed into our sacred directory."
            actionLabel="Explore Scholars"
            actionTo="/scholars"
          />
        ) : (
          <motion.div {...staggerContainer(0.07)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {display.map((p) => (
              <motion.div key={p.id} variants={staggerItem}>
                <Link to={`/pathasalas/${p.id}`} className="group block temple-card overflow-hidden h-full">
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={p.photo || HERITAGE.community.pathasala}
                      alt={p.institution_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-temple-brown/75 to-transparent" />
                    {p.established_year && (
                      <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-ivory/95 text-xs font-semibold text-temple-brown border border-secondary/25 flex items-center gap-1">
                        <Landmark className="w-3 h-3" /> Est. {p.established_year}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-semibold text-temple-brown mb-2 group-hover:text-primary transition-colors line-clamp-1">
                      {p.institution_name}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-4">
                      <MapPin className="w-3.5 h-3.5 text-secondary" /> {p.city}, {p.state}
                    </p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      {p.student_count && (
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {p.student_count} students</span>
                      )}
                      {p.teacher_count && (
                        <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> {p.teacher_count} faculty</span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
