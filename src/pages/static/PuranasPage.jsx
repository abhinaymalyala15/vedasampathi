import { motion } from 'framer-motion';
import { StaticContentPage } from '@/components/StaticPageLayout';
import { BookMarked } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { PAGE_HEROES } from '@/lib/templeAssets';

const puranas = [
  'Vishnu Purana', 'Bhagavata Purana', 'Shiva Purana',
  'Brahma Purana', 'Markandeya Purana', 'Skanda Purana',
];

export default function PuranasPage() {
  return (
    <StaticContentPage
      badge="Sacred Narratives"
      title="The Puranas"
      subtitle="Ancient texts of cosmology, mythology, legend, and ritual tradition"
      image={PAGE_HEROES.puranas}
    >
      <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-3xl text-pretty">
        The Puranas are a genre of ancient and medieval texts in Hinduism, Jainism and Buddhism.
        They typically cover cosmology, mythology, legend, and ritual.
      </p>
      <motion.div {...staggerContainer(0.06)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {puranas.map((p) => (
          <motion.div
            key={p}
            variants={staggerItem}
            className="temple-card p-6 text-center hover:shadow-glow-gold group"
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
              <BookMarked className="w-5 h-5 text-secondary" />
            </div>
            <h2 className="font-heading text-base font-semibold text-primary">{p}</h2>
          </motion.div>
        ))}
      </motion.div>
    </StaticContentPage>
  );
}
