import { motion } from 'framer-motion';
import { Target, Eye, Heart, BookOpen, Users, Award } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { SectionHeader } from '@/components/ui/PageHeader';
import { staggerContainer, staggerItem, fadeUp } from '@/lib/motion';

const values = [
  { icon: BookOpen, title: 'Authentic Knowledge', desc: 'Preserving the unbroken oral tradition of Vedic learning' },
  { icon: Users, title: 'Community', desc: 'Building bridges between scholars, students, and supporters' },
  { icon: Award, title: 'Excellence', desc: 'Upholding the highest standards of Vedic scholarship' },
  { icon: Heart, title: 'Service', desc: 'Dedicated to the welfare of scholars and pathasalas' },
];

export default function About() {
  return (
    <div>
      <PageHeader
        badge="Our Story"
        title="About Vedasampatti"
        subtitle="Preserving the sacred Vedic tradition for generations to come"
      />

      <section className="py-section bg-background">
        <div className="container-premium">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            <motion.div {...fadeUp(0)} className="premium-card p-8 md:p-10">
              <div className="w-14 h-14 rounded-[20px] bg-secondary/15 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-secondary" />
              </div>
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                To preserve and promote the timeless wisdom of the Vedas by creating a digital bridge
                between Vedic scholars, traditional pathasalas, and the global community of devotees
                and supporters. We strive to ensure that the sacred knowledge of the Vedas continues
                to flourish and reach all sincere seekers.
              </p>
            </motion.div>
            <motion.div {...fadeUp(0.1)} className="premium-card p-8 md:p-10">
              <div className="w-14 h-14 rounded-[20px] bg-primary/10 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-primary" />
              </div>
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                We envision a world where the sacred knowledge of the Vedas is accessible to all
                seekers, where scholars are honored and supported, and where traditional pathasalas
                thrive as centers of authentic learning for generations to come.
              </p>
            </motion.div>
          </div>

          <SectionHeader
            align="center"
            eyebrow="Principles"
            title="Our Core Values"
            description="The principles that guide everything we do"
          />

          <motion.div {...staggerContainer(0.08)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <motion.div key={value.title} variants={staggerItem} className="premium-card p-8 text-center hover:shadow-glow-gold">
                  <div className="w-14 h-14 rounded-full bg-secondary/15 flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-section-sm bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 sacred-pattern opacity-50" />
        <div className="container-premium relative">
          <motion.div {...fadeUp(0)} className="max-w-3xl mx-auto text-center premium-card p-10 md:p-14">
            <p className="font-sanskrit text-2xl md:text-3xl text-primary mb-6 leading-relaxed">
              गावो विश्वस्य मातरः ।<br />धर्मो विश्वस्य जगतः प्रतिष्ठा ॥
            </p>
            <p className="text-sm text-muted-foreground italic">
              &ldquo;Cows are the mothers of the universe. Dharma is the foundation of the world.&rdquo;
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
