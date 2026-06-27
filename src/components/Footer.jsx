import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Mail, ArrowRight, Send } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { TempleDivider } from '@/components/ui/TempleMotifs';
import { LOGO_URL } from '@/lib/templeAssets';
import { fadeUp } from '@/lib/motion';

const socialLinks = [
  { label: 'Facebook', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'YouTube', href: '#' },
];

export default function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');

  const quickLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.scholars'), path: '/scholars' },
    { label: t('nav.pathasalas'), path: '/pathasalas' },
    { label: t('nav.events'), path: '/events' },
    { label: 'About', path: '/about' },
    { label: t('nav.donate'), path: '/donate' },
    { label: 'Contact', path: '/contact' },
  ];

  const resources = [
    { label: 'Vedas', path: '/pages/vedas' },
    { label: 'Upanishads', path: '/pages/upanishads' },
    { label: 'Mantras', path: '/pages/mantras' },
    { label: 'Puranas', path: '/pages/puranas' },
    { label: 'Gallery', path: '/pages/gallery' },
    { label: 'News', path: '/pages/news' },
  ];

  return (
    <footer className="relative bg-[#1a0f0c] text-ivory overflow-hidden">
      {/* Temple skyline silhouette */}
      <div className="absolute top-0 left-0 right-0 h-24 opacity-[0.08] pointer-events-none" aria-hidden>
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="w-full h-full fill-ivory">
          <path d="M0 80V50 L80 20 L120 35 L160 15 L200 40 L240 25 L280 45 L320 20 L360 38 L400 18 L440 42 L480 22 L520 35 L560 12 L600 30 L640 15 L680 38 L720 20 L760 42 L800 18 L840 35 L880 22 L920 40 L960 15 L1000 32 L1040 20 L1080 38 L1120 25 L1200 45 V80Z" />
        </svg>
      </div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />

      <div className="container-premium relative z-10 pt-20 pb-12 lg:pt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-14">
          <motion.div {...fadeUp(0)}>
            <div className="flex items-center gap-3 mb-6">
              <img src={LOGO_URL} alt="Vedasampatti" className="w-14 h-14 rounded-full ring-2 ring-secondary/50 object-cover" />
              <span className="font-heading text-2xl font-bold text-ivory">Vedasampatti</span>
            </div>
            <p className="text-sm text-ivory/55 leading-relaxed mb-6 max-w-xs">{t('footer.desc')}</p>
            <p className="font-sanskrit text-lg text-secondary/80 mb-1">धर्मो रक्षति रक्षितः</p>
            <p className="text-xs text-ivory/40 italic">Dharma protects those who protect it</p>
          </motion.div>

          <motion.div {...fadeUp(0.08)}>
            <h3 className="font-heading text-lg text-secondary mb-5">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-ivory/55 hover:text-secondary transition-colors inline-flex items-center gap-1 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...fadeUp(0.12)}>
            <h3 className="font-heading text-lg text-secondary mb-5">Sacred Resources</h3>
            <ul className="space-y-2.5 mb-8">
              {resources.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-ivory/55 hover:text-secondary transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
            <div className="space-y-2 text-sm text-ivory/50">
              <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-secondary transition-colors"><Phone className="w-4 h-4 text-secondary" /> +91 98765 43210</a>
              <a href="mailto:info@vedasampatti.org" className="flex items-center gap-2 hover:text-secondary transition-colors"><Mail className="w-4 h-4 text-secondary" /> info@vedasampatti.org</a>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.16)}>
            <h3 className="font-heading text-lg text-secondary mb-5">Newsletter</h3>
            <p className="text-sm text-ivory/55 mb-4 leading-relaxed">Receive updates on festivals, scholars, and sacred teachings.</p>
            <form onSubmit={(e) => { e.preventDefault(); setEmail(''); }} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-2xl bg-ivory/8 border border-ivory/15 text-sm text-ivory placeholder:text-ivory/35 focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
              <Button type="submit" className="w-full btn-temple-gold text-temple-brown">
                <Send className="w-4 h-4" /> Subscribe
              </Button>
            </form>
          </motion.div>
        </div>

        <TempleDivider className="my-12 opacity-40" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ivory/40">
          <p>{t('footer.copyright')}</p>
          <div className="flex gap-4">
            {socialLinks.map((s) => (
              <a key={s.label} href={s.href} className="hover:text-secondary transition-colors">{s.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
