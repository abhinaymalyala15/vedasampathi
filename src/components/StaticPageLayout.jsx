import { motion } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import { fadeUp } from '@/lib/motion';

export default function StaticPageLayout({ badge, title, subtitle, children, image }) {
  return (
    <div>
      <PageHeader badge={badge} title={title} subtitle={subtitle} compact image={image} />
      <motion.section {...fadeUp(0.1)} className="py-section-sm bg-background temple-bg-paper">
        <div className="container-premium max-w-4xl">
          <div className="premium-card p-8 md:p-12 prose prose-neutral max-w-none">
            {children}
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export function StaticContentPage({ badge, title, subtitle, children, wide = false, image }) {
  return (
    <div>
      <PageHeader badge={badge} title={title} subtitle={subtitle} compact image={image} />
      <motion.section {...fadeUp(0.1)} className="py-section-sm bg-background temple-bg-paper">
        <div className={`container-premium ${wide ? '' : 'max-w-4xl'}`}>
          {children}
        </div>
      </motion.section>
    </div>
  );
}
