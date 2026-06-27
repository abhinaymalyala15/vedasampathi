import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, Scroll, Library, Flame, Sparkles, Image, Newspaper, ArrowRight,
} from 'lucide-react';
import { SectionMotif, TempleDivider } from '@/components/ui/TempleMotifs';
import { HERITAGE } from '@/lib/templeAssets';
import { staggerContainer, staggerItem, fadeUp } from '@/lib/motion';

const FALLBACK = '/hero-temple.jpg';

const categories = [
  {
    title: 'Vedas',
    path: '/pages/vedas',
    icon: BookOpen,
    image: HERITAGE.knowledge.vedas,
    alt: 'Ancient Vedic palm leaf manuscripts',
  },
  {
    title: 'Upanishads',
    path: '/pages/upanishads',
    icon: Scroll,
    image: HERITAGE.knowledge.upanishads,
    alt: 'Upanishad scriptures on palm leaves',
  },
  {
    title: 'Puranas',
    path: '/pages/puranas',
    icon: Library,
    image: HERITAGE.knowledge.puranas,
    alt: 'Sacred Purana texts in a temple library',
  },
  {
    title: 'Mantras',
    path: '/pages/mantras',
    icon: Sparkles,
    image: HERITAGE.knowledge.mantras,
    alt: 'Sacred mantra bells and divine symbols',
  },
  {
    title: 'Yagnas',
    path: '/pages/yagas',
    icon: Flame,
    image: HERITAGE.knowledge.yagnas,
    alt: 'Vedic fire ritual yagna homam',
  },
  {
    title: 'Rituals',
    path: '/pages/rituals',
    icon: Flame,
    image: HERITAGE.knowledge.rituals,
    alt: 'Traditional temple lamps and flower offerings',
  },
  {
    title: 'Gallery',
    path: '/pages/gallery',
    icon: Image,
    image: HERITAGE.knowledge.gallery,
    alt: 'Ornate South Indian temple architecture',
  },
  {
    title: 'News',
    path: '/pages/news',
    icon: Newspaper,
    image: HERITAGE.knowledge.news,
    alt: 'Vedic scholars and community gatherings',
  },
];

export default function VedicKnowledgeSection() {
  return (
    <section className="relative py-section temple-bg-paper overflow-hidden">
      <SectionMotif variant="mandala" />

      <div className="container-premium relative">
        <motion.div {...fadeUp(0)} className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-secondary text-xs font-bold tracking-[0.25em] uppercase mb-3">Sacred Library</p>
          <h2 className="font-heading text-section text-temple-brown text-balance">Vedic Knowledge</h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Explore the timeless scriptures, rituals, and wisdom passed down through generations of gurus and disciples.
          </p>
          <TempleDivider className="mt-6" />
        </motion.div>

        <motion.div
          {...staggerContainer(0.06)}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div key={cat.title} variants={staggerItem}>
                <Link to={cat.path} className="group block temple-card overflow-hidden h-full">
                  <div className="relative h-32 sm:h-36 overflow-hidden bg-muted">
                    <img
                      src={cat.image}
                      alt={cat.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = FALLBACK; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-temple-brown/75 via-temple-brown/15 to-transparent" />
                    <div className="absolute bottom-3 left-3 w-9 h-9 rounded-full bg-ivory/95 flex items-center justify-center border border-secondary/30 shadow-sm">
                      <Icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <span className="font-heading text-base font-semibold text-temple-brown group-hover:text-primary transition-colors">
                      {cat.title}
                    </span>
                    <ArrowRight className="w-4 h-4 text-secondary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
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
