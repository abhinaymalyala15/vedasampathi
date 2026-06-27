import { useMemo } from 'react';

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function MandalaOutline({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" aria-hidden>
      <circle cx="100" cy="100" r="92" stroke="#E8C547" strokeWidth="0.8" />
      <circle cx="100" cy="100" r="72" stroke="#D4A017" strokeWidth="0.65" />
      <circle cx="100" cy="100" r="52" stroke="#D4A017" strokeWidth="0.55" />
      <circle cx="100" cy="100" r="32" stroke="#B8860B" strokeWidth="0.5" />
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 100 + 32 * Math.cos(angle);
        const y1 = 100 + 32 * Math.sin(angle);
        const x2 = 100 + 92 * Math.cos(angle);
        const y2 = 100 + 92 * Math.sin(angle);
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D4A017" strokeWidth="0.5" />
        );
      })}
    </svg>
  );
}

const RAY_ANGLES = [-18, -10, -4, 2, 8, 16];

/** Premium cinematic atmosphere — clearly visible divine light */
export default function HeroSubtleEffects({ animate = true }) {
  const embers = useMemo(() => {
    const rand = seededRandom(42);
    return Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: `${35 + rand() * 62}%`,
      bottom: `${rand() * 40}%`,
      size: 3 + rand() * 5,
      delay: rand() * 14,
      duration: 10 + rand() * 12,
      drift: -20 + rand() * 40,
      opacity: 0.55 + rand() * 0.45,
    }));
  }, []);

  const dust = useMemo(() => {
    const rand = seededRandom(99);
    return Array.from({ length: 45 }, (_, i) => ({
      id: i,
      left: `${rand() * 100}%`,
      top: `${10 + rand() * 80}%`,
      size: 2 + rand() * 4,
      duration: 18 + rand() * 22,
      delay: rand() * 12,
      dx: -14 + rand() * 28,
      dy: -16 + rand() * 20,
      opacity: 0.4 + rand() * 0.5,
    }));
  }, []);

  const sparkles = useMemo(() => {
    const rand = seededRandom(77);
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${45 + rand() * 50}%`,
      top: `${15 + rand() * 55}%`,
      size: 3 + rand() * 4,
      delay: rand() * 8,
      duration: 3 + rand() * 4,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {/* Golden sun disc — clearly visible behind temple */}
      <div className={`hero-sun-disc ${animate ? 'hero-sun-disc-animate' : ''}`} />

      {/* Divine sunlight bloom */}
      <div className={`absolute inset-0 hero-divine-sunlight ${animate ? 'hero-divine-sunlight-animate' : ''}`} />

      {/* Temple rim light */}
      <div className="absolute inset-0 hero-temple-edge-glow" />

      {/* Wide SVG god rays */}
      <svg className="absolute inset-0 w-full h-full hero-rays-svg" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="heroRayFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,235,180,0.95)" />
            <stop offset="45%" stopColor="rgba(255,210,120,0.35)" />
            <stop offset="100%" stopColor="rgba(255,200,100,0)" />
          </linearGradient>
        </defs>
        {RAY_ANGLES.map((angle, i) => {
          const spread = 4.5 + i * 0.3;
          const cx = 62;
          const rad = ((angle - 90) * Math.PI) / 180;
          const x1 = cx + Math.cos(rad - spread * 0.02) * 70;
          const y1 = 100;
          const x2 = cx + Math.cos(rad + spread * 0.02) * 70;
          const y2 = 100;
          return (
            <polygon
              key={angle}
              points={`${cx},0 ${x1},${y1} ${x2},${y2}`}
              fill="url(#heroRayFill)"
              className={animate ? 'hero-ray-polygon-animate' : ''}
              style={{
                animationDuration: `${14 + i * 1.5}s`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          );
        })}
      </svg>

      {/* Light sweep across temple */}
      {animate && <div className="hero-light-sweep" />}

      {/* Warm atmospheric haze */}
      <div className="absolute inset-0 hero-atmospheric-haze" />

      {/* Golden dust motes */}
      <div className="absolute inset-0">
        {dust.map((d) => (
          <span
            key={d.id}
            className={`hero-dust-particle absolute rounded-full ${animate ? 'hero-dust-animate' : ''}`}
            style={{
              left: d.left,
              top: d.top,
              width: d.size,
              height: d.size,
              opacity: d.opacity,
              animationDuration: `${d.duration}s`,
              animationDelay: `${d.delay}s`,
              ['--dx']: `${d.dx}px`,
              ['--dy']: `${d.dy}px`,
            }}
          />
        ))}
      </div>

      {/* Bright sparkles near sun */}
      <div className="absolute inset-0">
        {sparkles.map((s) => (
          <span
            key={s.id}
            className={`hero-sparkle ${animate ? 'hero-sparkle-animate' : ''}`}
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Rising embers with glow */}
      <div className="absolute inset-0 overflow-hidden">
        {embers.map((e) => (
          <span
            key={e.id}
            className={`hero-ember-particle absolute rounded-full ${animate ? 'hero-ember-animate' : ''}`}
            style={{
              left: e.left,
              bottom: e.bottom,
              width: e.size,
              height: e.size,
              ['--ember-opacity']: e.opacity,
              animationDuration: `${e.duration}s`,
              animationDelay: `${e.delay}s`,
              ['--drift']: `${e.drift}px`,
            }}
          />
        ))}
      </div>

      {/* Sacred mandalas — visible gold outlines */}
      <MandalaOutline className={`hero-mandala hero-mandala-left w-48 lg:w-64 h-48 lg:h-64 ${animate ? 'hero-mandala-animate' : ''}`} />
      <MandalaOutline className={`hero-mandala hero-mandala-right w-44 lg:w-60 h-44 lg:h-60 ${animate ? 'hero-mandala-animate-reverse' : ''}`} />

      {/* Subtle film grain */}
      <div className="absolute inset-0 hero-film-grain" />
    </div>
  );
}
