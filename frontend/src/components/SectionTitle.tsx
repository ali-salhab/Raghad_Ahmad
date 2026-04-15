import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SectionTitleProps {
  badge?: string
  title: string
  highlight?: string
  subtitle?: string
  center?: boolean
}

export const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
  }),
}

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export function SectionWrapper({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`section-padding ${className}`}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  )
}

export default function SectionTitle({ badge, title, highlight, subtitle, center = false }: SectionTitleProps) {
  return (
    <motion.div
      className={`mb-16 ${center ? 'text-center' : ''}`}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {badge && (
        <motion.div variants={fadeInUp} className={`flex ${center ? 'justify-center' : ''} mb-4`}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase
            bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            {badge}
          </span>
        </motion.div>
      )}
      <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
        {title}{' '}
        {highlight && (
          <span style={{
            background: 'linear-gradient(135deg, #a78bfa, #7c3aed, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {highlight}
          </span>
        )}
      </motion.h2>
      {subtitle && (
        <motion.p variants={fadeInUp} className="text-white/50 text-lg max-w-2xl leading-relaxed">
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}
