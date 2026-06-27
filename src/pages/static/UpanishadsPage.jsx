import { motion } from 'framer-motion';
import { StaticContentPage } from '@/components/StaticPageLayout';
import { TempleDivider } from '@/components/ui/TempleMotifs';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { PAGE_HEROES } from '@/lib/templeAssets';

export default function UpanishadsPage() {
  const upanishads = [
    { name: 'Brihadaranyaka Upanishad', desc: 'One of the oldest Upanishads, dealing with the nature of Brahman and Atman.' },
    { name: 'Chandogya Upanishad', desc: 'Among the oldest Upanishads, it includes the famous teaching "Tat Tvam Asi" (That thou art).' },
    { name: 'Taittiriya Upanishad', desc: 'Discusses the concept of Brahman and the five sheaths of the self.' },
    { name: 'Mandukya Upanishad', desc: 'A short text about the syllable Om and the four states of consciousness.' },
  ];

  return (
    <StaticContentPage
      badge="Philosophical Wisdom"
      title="The Upanishads"
      subtitle="Late Vedic texts exploring Atman, Brahman, and the eternal truth"
      image={PAGE_HEROES.upanishads}
    >
      <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-3xl text-pretty">
        The Upanishads are late Vedic Sanskrit texts that form the philosophical basis of Hinduism.
        They explore the nature of the self (Atman) and the ultimate reality (Brahman).
      </p>
      <motion.div {...staggerContainer(0.08)} className="space-y-5">
        {upanishads.map((u) => (
          <motion.div key={u.name} variants={staggerItem} className="temple-card p-8 hover:shadow-glow-gold">
            <h2 className="font-heading text-xl font-semibold text-primary mb-2">{u.name}</h2>
            <TempleDivider className="my-4 max-w-[120px]" />
            <p className="text-muted-foreground text-sm leading-relaxed">{u.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </StaticContentPage>
  );
}
