import { motion } from 'framer-motion';
import { StaticContentPage } from '@/components/StaticPageLayout';
import { HERITAGE, PAGE_HEROES } from '@/lib/templeAssets';
import { staggerContainer, staggerItem } from '@/lib/motion';

const yagas = [
  { name: 'Rudra Yaga', desc: 'Performed to invoke blessings from Lord Rudra for protection and well-being.' },
  { name: 'Sudarshana Homa', desc: 'A fire ritual dedicated to Sudarshana Chakra for removal of obstacles.' },
  { name: 'Ganapathi Homa', desc: 'Performed before major undertakings to seek the blessings of Ganesha.' },
  { name: 'Maha Mrityunjaya Homa', desc: 'A powerful ritual for health, longevity, and liberation from the cycle of death.' },
];

export default function YagasPage() {
  return (
    <StaticContentPage
      badge="Sacred Fire"
      title="Yagas & Havans"
      subtitle="Elaborate Vedic fire sacrifices for spiritual, worldly, and cosmic purposes"
      image={PAGE_HEROES.yagas}
    >
      <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-3xl text-pretty">
        Yagas are elaborate fire sacrifices described in the Vedas, undertaken for specific
        spiritual, worldly, or cosmic purposes.
      </p>
      <motion.div {...staggerContainer(0.08)} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {yagas.map((y) => (
          <motion.div key={y.name} variants={staggerItem} className="temple-card overflow-hidden hover:shadow-glow-gold group">
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={HERITAGE.ritual.deepam}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                loading="lazy"
              />
            </div>
            <div className="p-8">
              <h2 className="font-heading text-lg font-semibold text-primary mb-2">{y.name}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{y.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </StaticContentPage>
  );
}
