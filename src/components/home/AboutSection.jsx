import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { HERITAGE } from '@/lib/templeAssets';
import { SectionMotif, GoldCornerBorder } from '@/components/ui/TempleMotifs';
import { fadeUp } from '@/lib/motion';

const FALLBACK_IMAGE = '/hero-temple.jpg';

const timeline = [
  { year: '2018', event: 'Foundation laid to preserve oral Vedic traditions' },
  { year: '2021', event: 'First hundred scholars registered across South India' },
  { year: '2024', event: 'Digital platform connecting pathasalas nationwide' },
];

const collage = [
  { id: 'temple', src: HERITAGE.about.temple, alt: 'Ornate South Indian temple gopuram', span: 'sm:row-span-2' },
  { id: 'manuscript', src: HERITAGE.about.manuscript, alt: 'Ancient Upanishad palm leaf manuscripts', span: '' },
  { id: 'guru', src: HERITAGE.about.guru, alt: 'Guru teaching shishya in sacred tradition', span: '' },
];

export default function AboutSection() {
  const { t } = useLanguage();

  const stats = [
    { value: '500+', label: t('about.scholars') },
    { value: '120+', label: t('about.pathasalas') },
  ];

  return (
    <section className="relative py-section temple-bg-paper overflow-hidden">
      <SectionMotif variant="mandala" />

      <div className="container-premium relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
          <motion.div {...fadeUp(0.05)} className="order-2 lg:order-1">
            <p className="text-secondary text-xs font-bold tracking-[0.25em] uppercase mb-3">
              Our Sacred Mission
            </p>
            <h2 className="temple-inscription text-balance mb-8">{t('about.title')}</h2>

            <h3 className="font-heading text-2xl text-primary mb-4">{t('about.mission')}</h3>
            <p className="text-muted-foreground leading-relaxed mb-4 text-pretty">{t('about.missionText')}</p>
            <p className="text-muted-foreground leading-relaxed mb-8 text-pretty">{t('about.visionText')}</p>

            <div className="space-y-5 mb-10 border-l-2 border-secondary/30 pl-6">
              {timeline.map((item) => (
                <div key={item.year}>
                  <span className="text-secondary font-heading text-lg font-semibold">{item.year}</span>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.event}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              {stats.map((s) => (
                <GoldCornerBorder key={s.label} className="temple-card p-5">
                  <p className="font-heading text-3xl font-bold text-primary">
                    <AnimatedCounter value={s.value} />
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                </GoldCornerBorder>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="btn-temple-gold text-temple-brown">
                <Link to="/about">Our Story <ArrowRight className="w-4 h-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/scholars">Meet the Scholars</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.12)} className="order-1 lg:order-2 relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-4 sm:h-[480px] lg:h-[540px]">
              {collage.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`relative rounded-[20px] overflow-hidden temple-card min-h-[220px] sm:min-h-0 ${img.span}`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                  />
                  {img.id === 'temple' && (
                    <div className="absolute top-4 right-4 temple-card px-4 py-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-secondary shrink-0" />
                      <span className="text-xs font-medium text-temple-brown whitespace-nowrap">
                        Guru-Shishya Parampara
                      </span>
                    </div>
                  )}
                  {img.id === 'guru' && (
                    <div className="absolute inset-0 bg-gradient-to-t from-temple-brown/30 to-transparent pointer-events-none" />
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-3 left-4 lg:left-0 temple-card p-5 max-w-[200px] hidden sm:block z-10"
            >
              <BookOpen className="w-5 h-5 text-secondary mb-2" strokeWidth={1.5} />
              <p className="font-sanskrit text-lg text-primary leading-snug">सत्यमेव जयते</p>
              <p className="text-[11px] text-muted-foreground mt-1">Truth alone triumphs</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
