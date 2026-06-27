import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

function parseStatValue(value) {
  const str = String(value);
  const prefix = str.match(/^[^\d]*/)?.[0] || '';
  const suffix = str.match(/[^\d]*$/)?.[0] || '';
  const num = parseFloat(str.replace(/[^\d.]/g, '')) || 0;
  return { prefix, suffix, num };
}

export default function AnimatedCounter({ value, className = '', duration = 1.8 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduced = useReducedMotion();
  const { prefix, suffix, num } = parseStatValue(value);
  const [display, setDisplay] = useState(reduced ? num : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(num);
      return;
    }
    let start = 0;
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(num * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => { start = 1; };
  }, [inView, num, duration, reduced]);

  return (
    <motion.span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </motion.span>
  );
}
