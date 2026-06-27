import { motion } from 'framer-motion';
import { StaticContentPage } from '@/components/StaticPageLayout';
import { HERITAGE, PAGE_HEROES } from '@/lib/templeAssets';
import { staggerContainer, staggerItem } from '@/lib/motion';

const labels = [
  'Temple Gopuram',
  'Sacred Corridor',
  'Deepam — Oil Lamp',
  'Palm Leaf Manuscript',
  'Stone Pillars',
  'Temple at Sunrise',
];

export default function GalleryPage() {
  return (
    <StaticContentPage
      badge="Visual Heritage"
      title="Sacred Gallery"
      subtitle="Temple architecture, rituals, and the living traditions of Vedic India"
      image={PAGE_HEROES.gallery}
      wide
    >
      <motion.div {...staggerContainer(0.06)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {HERITAGE.gallery.map((src, i) => (
          <motion.div key={src} variants={staggerItem} className="group temple-card overflow-hidden">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={src}
                alt={labels[i] || `Heritage ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
            <p className="p-4 text-sm font-medium text-temple-brown">{labels[i]}</p>
          </motion.div>
        ))}
      </motion.div>
    </StaticContentPage>
  );
}
