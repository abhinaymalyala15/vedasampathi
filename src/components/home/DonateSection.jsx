import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, GraduationCap, School, Flame, Utensils, Landmark, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/PageHeader';
import { SectionMotif, TempleDivider } from '@/components/ui/TempleMotifs';
import { HERITAGE } from '@/lib/templeAssets';
import { staggerContainer, staggerItem } from '@/lib/motion';

export default function DonateSection() {
  const { t } = useLanguage();

  const tiles = [
    {
      icon: Heart,
      title: t('donate.general'),
      description: t('donate.generalDesc'),
      path: '/donate',
      image: HERITAGE.donate.general,
      progress: 72,
      raised: '₹18L',
      goal: '₹25L',
    },
    {
      icon: GraduationCap,
      title: t('donate.scholarSponsor'),
      description: t('donate.scholarSponsorDesc'),
      path: '/donate',
      image: HERITAGE.donate.scholar,
      progress: 58,
      raised: '₹8.7L',
      goal: '₹15L',
    },
    {
      icon: School,
      title: t('donate.pathasalaSponsor'),
      description: t('donate.pathasalaSponsorDesc'),
      path: '/donate',
      image: HERITAGE.donate.pathasala,
      progress: 45,
      raised: '₹6.8L',
      goal: '₹15L',
    },
    {
      icon: Utensils,
      title: 'Annadanam',
      description: 'Feed scholars and devotees — the highest form of seva in our tradition.',
      path: '/donate',
      image: HERITAGE.donate.annadanam,
      progress: 65,
      raised: '₹5.2L',
      goal: '₹8L',
    },
    {
      icon: Flame,
      title: 'Yagnam & Homam',
      description: 'Support sacred fire rituals that preserve Vedic ceremonies for generations.',
      path: '/donate',
      image: HERITAGE.donate.yagnam,
      progress: 40,
      raised: '₹3.1L',
      goal: '₹8L',
    },
    {
      icon: Landmark,
      title: 'Temple Restoration',
      description: 'Preserve ancient temple architecture and sacred learning spaces.',
      path: '/donate',
      image: HERITAGE.donate.temple,
      progress: 55,
      raised: '₹12L',
      goal: '₹20L',
    },
  ];

  return (
    <section className="relative py-section overflow-hidden bg-muted/20">
      <SectionMotif variant="mandala" />
      <div className="container-premium relative">
        <SectionHeader align="center" eyebrow="Seva — Selfless Service" title={t('donate.title')} description={t('donate.subtitle')} />
        <TempleDivider className="mb-14 -mt-6" />

        <motion.div {...staggerContainer(0.08)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <motion.div key={tile.title} variants={staggerItem} className="temple-card overflow-hidden flex flex-col h-full group">
                <div className="relative h-36 overflow-hidden">
                  <img src={tile.image} alt={tile.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" onError={(e) => { e.currentTarget.src = '/hero-temple.jpg'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-temple-brown/80 to-transparent" />
                  <div className="absolute bottom-3 left-4 w-11 h-11 rounded-full bg-ivory/95 flex items-center justify-center border border-secondary/30">
                    <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-heading text-lg font-semibold text-temple-brown mb-2">{tile.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{tile.description}</p>
                  <div className="mb-5">
                    <div className="flex justify-between text-xs font-medium mb-2">
                      <span className="text-secondary">{tile.raised}</span>
                      <span className="text-muted-foreground">Goal {tile.goal}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${tile.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-secondary to-accent"
                      />
                    </div>
                  </div>
                  <Button asChild className="w-full btn-temple-gold text-temple-brown">
                    <Link to={tile.path}>{t('donate.donateNow')} <ArrowRight className="w-4 h-4" /></Link>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
