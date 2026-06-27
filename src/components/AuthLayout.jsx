import React from 'react';
import { motion } from 'framer-motion';
import { EASE_OUT } from '@/lib/motion';

const LOGO_URL = 'https://media.base44.com/images/public/user_6a0f22d640b2c359109c75b9/7254333b3_ChatGPTImageJun15202608_36_50PM.png';

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-sacred">
        <div className="absolute inset-0 opacity-10 sacred-pattern" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[100px]" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-primary-foreground">
          <img src={LOGO_URL} alt="" className="w-16 h-16 rounded-full ring-2 ring-secondary/40 mb-8" />
          <h2 className="font-heading text-4xl font-bold mb-4 text-balance">Preserving Vedic Heritage</h2>
          <p className="text-primary-foreground/65 leading-relaxed max-w-md text-pretty">
            Join a sacred community dedicated to connecting scholars, pathasalas, and seekers of ancient wisdom.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-background px-5 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            {Icon && (
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-[20px] bg-primary/10 mb-5">
                <Icon className="w-7 h-7 text-primary" aria-hidden="true" />
              </div>
            )}
            <h1 className="font-heading text-3xl font-bold text-foreground">{title}</h1>
            {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
          </div>
          <div className="premium-card p-8 md:p-10">
            {children}
          </div>
          {footer && (
            <p className="text-center text-sm text-muted-foreground mt-6">{footer}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
