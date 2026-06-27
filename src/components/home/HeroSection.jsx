import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight, Shield, Award, Landmark, ChevronDown, Leaf, Heart,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import HeroSubtleEffects from '@/components/home/HeroSubtleEffects';
import { HERITAGE } from '@/lib/templeAssets';

const trustIndicators = [
  { icon: Shield, label: 'Verified Scholars' },
  { icon: Award, label: 'Trusted Platform' },
  { icon: Landmark, label: 'Sacred Heritage' },
];

const EASE = [0.25, 0.1, 0.25, 1];

const fadeUp = (delay, reduced) =>
  reduced
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, delay, ease: EASE },
      };

export default function HeroSection() {
  const { t } = useLanguage();
  const reduced = useReducedMotion();

  return (
    <section className="hero-section relative flex flex-col overflow-hidden bg-[#120a08]">
      {/* Temple image — sharp, no blur filters */}
      <div className="hero-bg-wrap absolute inset-0 z-0">
        <div className={`hero-ken-burns absolute inset-0 ${reduced ? '' : 'hero-ken-burns-active'}`}>
          <img
            src={`${HERITAGE.hero.main}?v=3`}
            alt="Ancient stone temple at golden hour"
            className="hero-bg-image"
            loading="eager"
            fetchPriority="high"
            draggable={false}
            decoding="sync"
            onError={(e) => { e.currentTarget.src = HERITAGE.hero.fallback; }}
          />
        </div>
      </div>

      {/* Left-side text contrast only — temple stays vivid */}
      <div className="absolute inset-0 hero-gradient-overlay z-[1]" aria-hidden />

      {/* Cinematic divine light layers */}
      <div className="absolute inset-0 z-[2]">
        <HeroSubtleEffects animate={!reduced} />
      </div>

      {/* Sacred OM watermark */}
      <div className="hero-om-watermark absolute z-[3] pointer-events-none" aria-hidden>
        ॐ
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-1 items-center">
        <div className="hero-content-wrap w-full pt-28 pb-24 lg:pb-28">
          <motion.div {...fadeUp(0, reduced)} className="mb-7">
            <span className="hero-badge inline-flex items-center gap-2">
              <Leaf className="w-3.5 h-3.5 text-secondary" strokeWidth={1.5} />
              Preserving Vedic Wisdom
            </span>
            <div className="hero-gold-rule mt-5" aria-hidden />
          </motion.div>

          <motion.h1 {...fadeUp(0.1, reduced)} className="hero-main-heading mb-7">
            Preserving the Sacred
            <br />
            <span className="hero-gold-accent">Vedic Tradition</span>
          </motion.h1>

          <motion.p {...fadeUp(0.2, reduced)} className="hero-description mb-10">
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            {...fadeUp(0.32, reduced)}
            className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 mb-10"
          >
            <Link to="/scholars" className="hero-btn-primary">
              {t('hero.explore')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/donate" className="hero-btn-gold">
              <Heart className="w-4 h-4 fill-current" />
              {t('hero.donate')}
            </Link>
          </motion.div>

          <motion.div {...fadeUp(0.42, reduced)} className="flex flex-wrap gap-3">
            {trustIndicators.map(({ icon: Icon, label }) => (
              <span key={label} className="hero-trust-pill">
                <Icon className="w-4 h-4 text-secondary shrink-0" strokeWidth={1.5} />
                {label}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {!reduced && (
        <div className="hero-scroll-indicator absolute left-1/2 bottom-10 z-[15]">
          <span className="hero-scroll-label">Scroll</span>
          <ChevronDown className="w-5 h-5 text-white/80 mx-auto mt-1" strokeWidth={1.5} />
        </div>
      )}

      <div className="hero-bottom-fade absolute bottom-0 left-0 right-0 z-[4]" aria-hidden />
    </section>
  );
}
