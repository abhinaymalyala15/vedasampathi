import { motion } from 'framer-motion';
import { StaticContentPage } from '@/components/StaticPageLayout';
import { Flame } from 'lucide-react';
import { TempleDivider } from '@/components/ui/TempleMotifs';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { PAGE_HEROES } from '@/lib/templeAssets';

const mantras = [
  {
    name: 'Gayatri Mantra',
    mantra: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्',
    desc: 'The most sacred mantra from the Rigveda, invoking the divine light of the sun.',
  },
  {
    name: 'Mahamrityunjaya Mantra',
    mantra: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्',
    desc: 'A life-giving mantra dedicated to Lord Shiva for healing and liberation.',
  },
  {
    name: 'Pranava Mantra',
    mantra: 'ॐ',
    desc: 'The primordial sound, the most fundamental mantra representing the universe.',
  },
];

export default function MantrasPage() {
  return (
    <StaticContentPage
      badge="Sacred Sound"
      title="Sacred Mantras"
      subtitle="Syllables of power — purifying the mind and elevating consciousness"
      image={PAGE_HEROES.mantras}
    >
      <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-3xl text-pretty">
        Mantras are sacred syllables, words, or phrases in Sanskrit with spiritual power.
        Regular chanting of mantras purifies the mind and elevates consciousness.
      </p>
      <motion.div {...staggerContainer(0.08)} className="space-y-6">
        {mantras.map((m) => (
          <motion.div key={m.name} variants={staggerItem} className="temple-card p-8 hover:shadow-glow-gold">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 shrink-0 rounded-full bg-secondary/10 flex items-center justify-center">
                <Flame className="w-4 h-4 text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-heading text-xl font-semibold text-primary mb-3">{m.name}</h2>
                <p className="font-sanskrit text-2xl text-secondary mb-4 leading-relaxed">{m.mantra}</p>
                <TempleDivider className="mb-4 max-w-[80px]" />
                <p className="text-muted-foreground text-sm leading-relaxed">{m.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </StaticContentPage>
  );
}
