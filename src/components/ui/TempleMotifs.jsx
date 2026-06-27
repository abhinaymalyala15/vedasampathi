/** Temple-inspired decorative UI primitives */

export function HeroOmMandala({ className = '', size = 'lg' }) {
  const dim = size === 'lg' ? 'w-44 h-44 lg:w-60 lg:h-60 xl:w-72 xl:h-72' : 'w-32 h-32';
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden>
      <svg viewBox="0 0 200 200" className={`${dim} text-secondary/30`} fill="none">
        <circle cx="100" cy="100" r="94" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="100" cy="100" r="76" stroke="currentColor" strokeWidth="0.5" opacity="0.8" />
        <circle cx="100" cy="100" r="58" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
        <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="0.4" opacity="0.5" />
        {[...Array(16)].map((_, i) => {
          const angle = (i * 22.5 * Math.PI) / 180;
          const x1 = 100 + 58 * Math.cos(angle);
          const y1 = 100 + 58 * Math.sin(angle);
          const x2 = 100 + 94 * Math.cos(angle);
          const y2 = 100 + 94 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.4" opacity="0.45" />;
        })}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const x = 100 + 76 * Math.cos(angle);
          const y = 100 + 76 * Math.sin(angle);
          return <circle key={i} cx={x} cy={y} r="2.5" fill="currentColor" opacity="0.5" />;
        })}
        <text x="100" y="114" textAnchor="middle" fill="currentColor" fontSize="42" fontFamily="serif" opacity="0.65">
          ॐ
        </text>
      </svg>
    </div>
  );
}

export function SectionFlourish({ className = '' }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden>
      {/* Left filigree */}
      <svg
        viewBox="0 0 280 400"
        className="absolute top-8 -left-4 w-56 lg:w-72 h-auto text-secondary/25"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      >
        <path d="M20 380 Q60 300 40 220 Q20 140 80 80 Q140 20 200 40" opacity="0.7" />
        <path d="M0 320 Q80 240 60 160 Q40 80 120 40" opacity="0.5" />
        <path d="M40 360 Q100 280 80 200 Q60 120 140 60" opacity="0.45" />
        <circle cx="80" cy="120" r="5" fill="currentColor" opacity="0.4" />
        <circle cx="120" cy="80" r="3" fill="currentColor" opacity="0.35" />
        <circle cx="60" cy="200" r="4" fill="currentColor" opacity="0.3" />
        <path d="M60 140 C80 120 100 100 120 90" opacity="0.5" />
        <path d="M30 260 C70 220 90 180 110 150" opacity="0.4" />
        <path d="M100 300 C130 260 150 220 170 180" opacity="0.35" />
        {/* Lotus petal motifs */}
        <path d="M140 100 Q160 80 180 100 Q160 120 140 100" fill="currentColor" opacity="0.15" stroke="none" />
        <path d="M100 160 Q120 140 140 160 Q120 180 100 160" fill="currentColor" opacity="0.12" stroke="none" />
      </svg>
      {/* Right filigree — mirrored */}
      <svg
        viewBox="0 0 280 400"
        className="absolute top-8 -right-4 w-56 lg:w-72 h-auto text-secondary/25 scale-x-[-1]"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      >
        <path d="M20 380 Q60 300 40 220 Q20 140 80 80 Q140 20 200 40" opacity="0.7" />
        <path d="M0 320 Q80 240 60 160 Q40 80 120 40" opacity="0.5" />
        <path d="M40 360 Q100 280 80 200 Q60 120 140 60" opacity="0.45" />
        <circle cx="80" cy="120" r="5" fill="currentColor" opacity="0.4" />
        <circle cx="120" cy="80" r="3" fill="currentColor" opacity="0.35" />
        <circle cx="60" cy="200" r="4" fill="currentColor" opacity="0.3" />
        <path d="M60 140 C80 120 100 100 120 90" opacity="0.5" />
        <path d="M30 260 C70 220 90 180 110 150" opacity="0.4" />
        <path d="M100 300 C130 260 150 220 170 180" opacity="0.35" />
        <path d="M140 100 Q160 80 180 100 Q160 120 140 100" fill="currentColor" opacity="0.15" stroke="none" />
        <path d="M100 160 Q120 140 140 160 Q120 180 100 160" fill="currentColor" opacity="0.12" stroke="none" />
      </svg>
    </div>
  );
}

export function TempleDivider({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-4 py-2 ${className}`} aria-hidden>
      <span className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-secondary/70 shrink-0" fill="currentColor">
        <path d="M12 2C9 6 6 8 6 12c0 3.3 2.7 6 6 6s6-2.7 6-6c0-4-3-6-6-10zm0 14c-2.2 0-4-1.8-4-4 0-2.5 1.5-4.2 4-7.5 2.5 3.3 4 5 4 7.5 0 2.2-1.8 4-4 4z" />
      </svg>
      <span className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent via-secondary/50 to-transparent" />
    </div>
  );
}

export function SectionMotif({ variant = 'mandala' }) {
  if (variant === 'lotus') {
    return (
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] temple-bg-lotus" aria-hidden />
    );
  }
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.04] temple-bg-mandala" aria-hidden />
  );
}

export function GoldCornerBorder({ children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-secondary/40 rounded-tl-lg pointer-events-none" aria-hidden />
      <span className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-secondary/40 rounded-tr-lg pointer-events-none" aria-hidden />
      <span className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-secondary/40 rounded-bl-lg pointer-events-none" aria-hidden />
      <span className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-secondary/40 rounded-br-lg pointer-events-none" aria-hidden />
      {children}
    </div>
  );
}

export function TemplePill({ icon: Icon, label, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone/60 border border-secondary/25 text-temple-brown text-xs font-medium backdrop-blur-sm ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5 text-secondary shrink-0" strokeWidth={1.5} />}
      {label}
    </span>
  );
}

export function StoneTexture({ className = '' }) {
  return <div className={`absolute inset-0 temple-bg-stone pointer-events-none ${className}`} aria-hidden />;
}
