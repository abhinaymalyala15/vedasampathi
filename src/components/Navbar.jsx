import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Menu, X, Heart, Languages, ChevronDown, BookOpen, GraduationCap, School,
  UserCircle, LogIn, UserPlus, Search, Sun, Flame, BookMarked, Image, Newspaper,
  ArrowRight, LogOut, LayoutDashboard,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { getPortalPath } from '@/components/RoleRoute';
import { Button } from '@/components/ui/button';
import { EASE_OUT } from '@/lib/motion';

import { LOGO_URL } from '@/lib/templeAssets';

const contentLinks = [
  { label: 'Vedas', path: '/pages/vedas', icon: BookOpen },
  { label: 'Mantras', path: '/pages/mantras', icon: Flame },
  { label: 'Puranas', path: '/pages/puranas', icon: BookMarked },
  { label: 'Gallery', path: '/pages/gallery', icon: Image },
  { label: 'News', path: '/pages/news', icon: Newspaper },
];

export default function Navbar() {
  const { t, language, toggleLanguage } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const megaRef = useRef(null);
  const profileRef = useRef(null);
  const location = useLocation();
  const reduced = useReducedMotion();

  const navLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.events'), path: '/events' },
    { label: 'About', path: '/about' },
    { label: t('nav.donate'), path: '/donate' },
  ];

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (megaRef.current && !megaRef.current.contains(e.target)) setMegaOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const isHome = location.pathname === '/';
  const onHero = isHome && !scrolled;

  const linkClass = (path) => {
    const active = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
    return `nav-link-underline px-4 py-2 text-sm font-medium transition-colors ${
      active ? 'active' : ''
    } ${onHero ? 'text-white hover:text-secondary nav-hero-text' : 'text-temple-brown/80 hover:text-primary'}`;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        onHero ? 'glass-nav-hero' : scrolled ? 'glass-nav-scrolled' : isHome ? 'glass-nav-hero' : 'glass-nav-scrolled'
      }`}
    >
      <div className="container-premium">
        <div className="relative flex items-center justify-between h-[68px] lg:h-[76px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 z-10 group">
            <img
              src={LOGO_URL}
              alt="Vedasampatti"
              className="w-10 h-10 lg:w-11 lg:h-11 rounded-full object-cover ring-2 ring-secondary/50 group-hover:ring-secondary/80 transition-all duration-300"
            />
            <span className={`font-heading text-lg lg:text-xl font-semibold tracking-wide hidden sm:block transition-colors ${onHero ? 'text-white nav-hero-text' : 'text-primary'}`}>
              Vedasampatti
            </span>
          </Link>

          {/* Center nav — matches mockup */}
          <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-0.5">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className={linkClass(link.path)}>
                {link.label}
              </Link>
            ))}

            <div ref={megaRef} className="relative">
              <button
                onClick={() => setMegaOpen(!megaOpen)}
                aria-expanded={megaOpen}
                aria-haspopup="true"
                className={`nav-link-underline flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors ${
                  megaOpen || isActive('/scholars') || isActive('/pathasalas') ? 'active' : ''
                } ${onHero ? 'text-white hover:text-secondary nav-hero-text' : 'text-temple-brown/80 hover:text-primary'}`}
              >
                Directory
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${megaOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25, ease: EASE_OUT }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[520px] bg-white/95 backdrop-blur-2xl rounded-[20px] border border-border/50 shadow-premium-lg overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-0">
                      <div className="p-6 border-r border-border/40">
                        <p className="text-xs font-semibold tracking-widest uppercase text-secondary mb-4">Community</p>
                        <Link
                          to="/scholars"
                          className="group flex items-start gap-3 p-3 rounded-xl hover:bg-muted/60 transition-colors mb-2"
                        >
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <GraduationCap className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">All Scholars</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Verified Vedic experts</p>
                          </div>
                        </Link>
                        <Link
                          to="/pathasalas"
                          className="group flex items-start gap-3 p-3 rounded-xl hover:bg-muted/60 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center shrink-0">
                            <School className="w-5 h-5 text-secondary" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">All Pathasalas</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Vedic institutions</p>
                          </div>
                        </Link>
                      </div>
                      <div className="p-6">
                        <p className="text-xs font-semibold tracking-widest uppercase text-secondary mb-4">Sacred Knowledge</p>
                        <div className="space-y-1">
                          {contentLinks.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.path}
                                to={item.path}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground/80 hover:text-primary hover:bg-muted/60 transition-colors"
                              >
                                <Icon className="w-4 h-4 text-primary/60" />
                                {item.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 z-10">
            <button
              className={`hidden md:flex w-10 h-10 items-center justify-center rounded-full transition-all ${
                onHero ? 'text-white hover:text-secondary hover:bg-white/12 nav-hero-icon' : 'text-foreground/60 hover:text-primary hover:bg-muted/80'
              }`}
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            <button
              onClick={toggleLanguage}
              className={`inline-flex items-center gap-1.5 h-10 px-3.5 rounded-full border text-xs font-bold tracking-widest uppercase transition-all ${
                onHero
                  ? 'border-secondary/50 bg-black/35 text-secondary backdrop-blur-sm nav-hero-text'
                  : 'border-secondary/30 bg-card text-temple-brown hover:border-secondary/50'
              }`}
              aria-label="Switch language"
            >
              <Languages className="w-3.5 h-3.5" />
              {language === 'en' ? 'EN' : 'TE'}
            </button>

            <button
              className={`hidden md:flex w-10 h-10 items-center justify-center rounded-full transition-all ${
                onHero ? 'text-white hover:text-secondary hover:bg-white/12 nav-hero-icon' : 'text-foreground/60 hover:text-primary hover:bg-muted/80'
              }`}
              aria-label="Toggle theme"
            >
              <Sun className="w-[18px] h-[18px]" />
            </button>

            <Button asChild size="sm" className="hidden sm:inline-flex btn-temple-gold text-[#3d1018] border-0 shadow-glow rounded-full px-4 h-9 text-xs font-bold">
              <Link to="/donate">
                <Heart className="w-3.5 h-3.5 fill-current" />
                {t('nav.donateNow')}
              </Link>
            </Button>

            <div ref={profileRef} className="hidden sm:block relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                  profileOpen
                    ? 'bg-primary text-primary-foreground shadow-premium'
                    : onHero
                      ? 'border border-white/35 bg-black/30 hover:bg-black/45 text-white nav-hero-text'
                      : 'border border-border/60 bg-card hover:bg-muted/80 text-foreground/70'
                }`}
              >
                <UserCircle className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={reduced ? false : { opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-52 bg-white/95 backdrop-blur-xl rounded-2xl shadow-premium-lg border border-border/50 overflow-hidden"
                  >
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-3 border-b border-border/40">
                          <p className="text-sm font-semibold text-foreground truncate">{user?.name || user?.full_name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{user?.role} portal</p>
                        </div>
                        <Link to={getPortalPath(user?.role)} className="flex items-center gap-3 px-4 py-3.5 text-sm hover:bg-muted/60 transition-colors">
                          <LayoutDashboard className="w-4 h-4 text-primary" /> My Portal
                        </Link>
                        <button
                          type="button"
                          onClick={() => { setProfileOpen(false); logout(); }}
                          className="flex w-full items-center gap-3 px-4 py-3.5 text-sm hover:bg-muted/60 transition-colors border-t border-border/40 text-destructive"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="flex items-center gap-3 px-4 py-3.5 text-sm hover:bg-muted/60 transition-colors">
                          <LogIn className="w-4 h-4 text-primary" /> Login
                        </Link>
                        <Link to="/register" className="flex items-center gap-3 px-4 py-3.5 text-sm hover:bg-muted/60 transition-colors border-t border-border/40">
                          <UserPlus className="w-4 h-4 text-primary" /> Sign Up
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                onHero ? 'text-white hover:bg-white/12 nav-hero-icon' : 'hover:bg-muted/80 text-foreground'
              }`}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={reduced ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border/40 bg-white/95 backdrop-blur-xl overflow-hidden"
          >
            <nav className="container-premium py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block py-3 text-base font-medium transition-colors ${
                    isActive(link.path) ? 'text-primary' : 'text-foreground/70'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-border/40">
                <p className="text-xs font-semibold tracking-widest uppercase text-secondary mb-3">Directory</p>
                <Link to="/scholars" className="flex items-center gap-3 py-2.5 text-foreground/80">
                  <GraduationCap className="w-4 h-4 text-primary" /> All Scholars
                </Link>
                <Link to="/pathasalas" className="flex items-center gap-3 py-2.5 text-foreground/80">
                  <School className="w-4 h-4 text-primary" /> All Pathasalas
                </Link>
              </div>
              <div className="pt-4 flex flex-col gap-3">
                <Link to="/login" className="flex items-center gap-2 py-2 text-foreground/80">
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Button asChild variant="secondary" className="w-full">
                  <Link to="/donate">
                    <Heart className="w-4 h-4" /> {t('nav.donateNow')}
                  </Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
