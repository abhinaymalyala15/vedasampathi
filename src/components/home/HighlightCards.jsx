import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, School, CalendarDays, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { HERITAGE } from '@/lib/templeAssets';
import { SectionFlourish } from '@/components/ui/TempleMotifs';
import { staggerContainer, staggerItem } from '@/lib/motion';

export default function HighlightCards() {
  const { t } = useLanguage();

  const cards = [
    {
      icon: GraduationCap,
      iconBg: 'bg-primary',
      title: t('highlights.scholarDir'),
      description: t('highlights.scholarDesc'),
      path: '/scholars',
      image: HERITAGE.cards.scholar,
      alt: 'Vedic scholars studying sacred texts',
    },
    {
      icon: School,
      iconBg: 'bg-[#8B6914]',
      title: t('highlights.pathasalaDir'),
      description: t('highlights.pathasalaDesc'),
      path: '/pathasalas',
      image: HERITAGE.cards.pathasala,
      alt: 'Students at a traditional pathasala',
    },
    {
      icon: CalendarDays,
      iconBg: 'bg-primary',
      title: t('highlights.events'),
      description: t('highlights.eventsDesc'),
      path: '/events',
      image: HERITAGE.cards.events,
      alt: 'Sacred Vedic fire ritual',
    },
  ];

  return (
    <section className="relative z-10 bg-[#FDF8F0] temple-bg-paper overflow-hidden">
      <SectionFlourish />

      <div className="container-premium relative pt-12 sm:pt-14 lg:pt-16 pb-16 lg:pb-24">
        <motion.div {...staggerContainer(0.1)} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.title} variants={staggerItem}>
                <Link
                  to={card.path}
                  className="group block bg-white rounded-[18px] overflow-hidden h-full directory-card hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="relative h-[240px] sm:h-[260px] overflow-hidden bg-muted">
                    <img
                      src={card.image}
                      alt={card.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = '/hero-temple.jpg'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-temple-brown/50 via-transparent to-transparent" />
                    <div className={`absolute top-4 left-4 w-10 h-10 rounded-full ${card.iconBg} flex items-center justify-center shadow-md ring-2 ring-white/40`}>
                      <Icon className="w-[18px] h-[18px] text-white" strokeWidth={2} />
                    </div>
                  </div>
                  <div className="px-6 py-6 sm:px-7 sm:py-7">
                    <h3 className="font-heading text-lg sm:text-xl font-semibold text-[#3E2723] mb-2 group-hover:text-primary transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-[#6B5344] leading-relaxed mb-4">{card.description}</p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:text-secondary transition-colors">
                      {t('highlights.explore')}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
