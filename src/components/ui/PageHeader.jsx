import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '@/lib/motion';

export default function PageHeader({ title, subtitle, badge, children, compact = false, image }) {
  const reduced = useReducedMotion();

  return (
    <section className={`relative overflow-hidden pt-24 lg:pt-28 ${compact ? 'pb-12 lg:pb-16' : 'pb-section'}`}>
      {image ? (
        <>
          <img
            src={image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a0f0c]/92 via-[#2a1810]/78 to-[#3d2218]/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0c]/40 to-transparent" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-[#4a1419]" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A017' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />
        </>
      )}

      <div className="container-premium relative z-10 text-center">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          {badge && (
            <span className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-white/10 text-secondary border border-white/20">
              {badge}
            </span>
          )}
          <h1 className="font-heading text-display text-white text-balance mb-4 drop-shadow-sm">{title}</h1>
          {subtitle && (
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed font-body">{subtitle}</p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </motion.div>
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, description, action, align = 'left' }) {
  const isCenter = align === 'center';
  return (
    <div
      className={`mb-10 md:mb-12 ${
        isCenter
          ? 'flex flex-col gap-4 text-center items-center'
          : 'flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8'
      }`}
    >
      <div className={isCenter ? 'max-w-2xl' : 'max-w-2xl flex-1 min-w-0'}>
        {eyebrow && (
          <p className="text-secondary font-semibold text-xs tracking-[0.2em] uppercase mb-3">{eyebrow}</p>
        )}
        <h2 className="font-heading text-section text-foreground text-balance">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-3 leading-relaxed max-w-xl">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0 self-start sm:self-end">{action}</div>}
    </div>
  );
}
