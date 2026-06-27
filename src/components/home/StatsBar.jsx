import { motion } from 'framer-motion';
import { GraduationCap, School, CalendarDays, IndianRupee, Flame } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { SectionMotif, StoneTexture, TempleDivider, GoldCornerBorder } from '@/components/ui/TempleMotifs';
import { staggerContainer, staggerItem } from '@/lib/motion';

export default function StatsBar() {
  const { t } = useLanguage();

  const stats = [
    { icon: GraduationCap, value: '500+', label: t('stats.scholars') },
    { icon: School, value: '120+', label: t('stats.pathasalas') },
    { icon: CalendarDays, value: '80+', label: t('stats.events') },
    { icon: IndianRupee, value: '₹25L+', label: t('stats.donations') },
  ];

  return (
    <section className="relative py-section-sm overflow-hidden bg-sandstone/40">
      <StoneTexture />
      <SectionMotif variant="lotus" />

      <div className="container-premium relative">
        <div className="text-center mb-12">
          <Flame className="w-6 h-6 text-secondary mx-auto mb-3" strokeWidth={1.5} />
          <h2 className="font-heading text-2xl sm:text-3xl text-temple-brown">Sacred Impact</h2>
          <TempleDivider className="mt-4" />
        </div>

        <motion.div {...staggerContainer(0.08)} className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} variants={staggerItem}>
                <GoldCornerBorder className="temple-card p-7 lg:p-8 text-center bg-card/90">
                  <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-5 border border-secondary/20">
                    <Icon className="w-7 h-7 text-secondary" strokeWidth={1.5} />
                  </div>
                  <p className="font-heading text-3xl lg:text-4xl font-bold text-temple-brown mb-2">
                    <AnimatedCounter value={stat.value} duration={1.5 + i * 0.1} />
                  </p>
                  <p className="text-xs font-semibold text-muted-foreground tracking-[0.15em] uppercase">{stat.label}</p>
                </GoldCornerBorder>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
