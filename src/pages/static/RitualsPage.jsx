import { motion } from 'framer-motion';
import { StaticContentPage } from '@/components/StaticPageLayout';
import { TempleDivider } from '@/components/ui/TempleMotifs';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { PAGE_HEROES } from '@/lib/templeAssets';

const rituals = [
  { name: 'Agnihotra', desc: 'A daily fire ritual performed at sunrise and sunset, considered the foundation of Vedic practice.' },
  { name: 'Soma Yajna', desc: 'An elaborate ritual involving the pressing and offering of the Soma plant juice.' },
  { name: 'Ashvamedha', desc: 'A grand horse sacrifice performed by kings to assert their sovereignty.' },
  { name: 'Sandhyavandanam', desc: 'Tri-daily prayer ritual performed by initiated Hindus at dawn, noon, and dusk.' },
];

export default function RitualsPage() {
  return (
    <StaticContentPage
      badge="Daily Practice"
      title="Vedic Rituals"
      subtitle="Sacred fire ceremonies bridging the human world and the divine"
      image={PAGE_HEROES.rituals}
    >
      <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-3xl text-pretty">
        Vedic rituals (Yajna) are sacred fire ceremonies performed according to the injunctions of the Vedas.
        They serve as a bridge between the human world and the divine.
      </p>
      <motion.div {...staggerContainer(0.08)} className="space-y-5">
        {rituals.map((r) => (
          <motion.div key={r.name} variants={staggerItem} className="temple-card p-8 hover:shadow-glow-gold">
            <h2 className="font-heading text-xl font-semibold text-primary mb-2">{r.name}</h2>
            <TempleDivider className="my-4 max-w-[100px]" />
            <p className="text-muted-foreground text-sm leading-relaxed">{r.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </StaticContentPage>
  );
}
