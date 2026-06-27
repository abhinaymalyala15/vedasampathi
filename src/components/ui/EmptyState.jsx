import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const illustrations = {
  scholars: (
    <svg viewBox="0 0 120 120" fill="none" className="w-28 h-28 mx-auto" aria-hidden>
      <circle cx="60" cy="60" r="56" stroke="currentColor" strokeWidth="1.5" className="text-primary/15" />
      <circle cx="60" cy="44" r="14" stroke="currentColor" strokeWidth="1.5" className="text-secondary/60" />
      <path d="M36 88c4-14 16-22 24-22s20 8 24 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary/40" />
      <path d="M28 52l8 6M92 52l-8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-accent/50" />
    </svg>
  ),
  pathasalas: (
    <svg viewBox="0 0 120 120" fill="none" className="w-28 h-28 mx-auto" aria-hidden>
      <path d="M60 20L20 48v52h80V48L60 20z" stroke="currentColor" strokeWidth="1.5" className="text-primary/30" />
      <rect x="48" y="68" width="24" height="32" rx="2" stroke="currentColor" strokeWidth="1.5" className="text-secondary/50" />
      <path d="M60 20v28" stroke="currentColor" strokeWidth="1.5" className="text-accent/40" />
    </svg>
  ),
  events: (
    <svg viewBox="0 0 120 120" fill="none" className="w-28 h-28 mx-auto" aria-hidden>
      <rect x="24" y="32" width="72" height="64" rx="8" stroke="currentColor" strokeWidth="1.5" className="text-primary/30" />
      <path d="M24 52h72" stroke="currentColor" strokeWidth="1.5" className="text-primary/20" />
      <circle cx="44" cy="72" r="6" className="fill-secondary/40" />
      <circle cx="60" cy="72" r="6" className="fill-accent/30" />
      <circle cx="76" cy="72" r="6" className="fill-primary/20" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 120 120" fill="none" className="w-28 h-28 mx-auto" aria-hidden>
      <circle cx="60" cy="60" r="40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 6" className="text-primary/25" />
      <path d="M48 60h24M60 48v24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-secondary/50" />
    </svg>
  ),
};

export default function EmptyState({
  variant = 'default',
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-[20px] bg-card/60 border border-border/60 backdrop-blur-sm"
    >
      <div className="mb-6 text-primary/80">
        {illustrations[variant] || illustrations.default}
      </div>
      <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground text-sm max-w-md leading-relaxed mb-6">{description}</p>
      )}
      {actionLabel && actionTo && (
        <Button asChild variant="default" size="lg" className="rounded-full px-8">
          <Link to={actionTo}>{actionLabel}</Link>
        </Button>
      )}
      {actionLabel && onAction && !actionTo && (
        <Button onClick={onAction} variant="default" size="lg" className="rounded-full px-8">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
