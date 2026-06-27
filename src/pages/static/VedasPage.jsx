import { motion } from 'framer-motion';
import { StaticContentPage } from '@/components/StaticPageLayout';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { PAGE_HEROES } from '@/lib/templeAssets';

export default function VedasPage() {
  const vedas = [
    { name: 'Rigveda', desc: 'The oldest of the four Vedas, consisting of 1,028 hymns (suktas) composed in praise of the gods.' },
    { name: 'Samaveda', desc: 'A liturgical text derived from the Rigveda, used as a source of melodies for chanting.' },
    { name: 'Yajurveda', desc: 'Contains prose mantras for use in sacrificial rites and religious ceremonies.' },
    { name: 'Atharvaveda', desc: 'A collection of spells, incantations, and philosophical speculations.' },
  ];

  return (
    <StaticContentPage
      badge="Sacred Texts"
      title="The Four Vedas"
      subtitle="The oldest sacred scriptures of Hinduism — the foundation of Vedic tradition"
      image={PAGE_HEROES.vedas}
    >
      <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-3xl text-pretty">
        The Vedas are composed in Vedic Sanskrit and are considered apauruṣeya — not of human origin.
        They form the eternal foundation upon which all Vedic knowledge rests.
      </p>
      <motion.div {...staggerContainer(0.08)} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {vedas.map((v) => (
          <motion.div key={v.name} variants={staggerItem} className="premium-card p-8 hover:shadow-glow-gold">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">{v.name}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </StaticContentPage>
  );
}
