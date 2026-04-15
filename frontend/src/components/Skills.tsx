import { useState } from 'react'
import { motion } from 'framer-motion'
import { Skill } from '../types/portfolio'
import SectionTitle, { SectionWrapper, fadeInUp, staggerContainer } from './SectionTitle'

interface SkillsProps {
  skills: Skill[]
}

export default function Skills({ skills }: SkillsProps) {
  const categories = ['All', ...Array.from(new Set(skills.map((s) => s.category)))]
  const [active, setActive] = useState('All')

  const filtered = active === 'All' ? skills : skills.filter((s) => s.category === active)

  return (
    <SectionWrapper id="skills" className="bg-white/[0.02]">
      <SectionTitle
        badge="Expertise"
        title="Skills &"
        highlight="Technologies"
        subtitle="A curated set of tools and technologies I use to build modern, scalable applications."
      />

      {/* Category filter */}
      <motion.div
        className="flex flex-wrap gap-2 mb-10"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {categories.map((cat) => (
          <motion.button
            key={cat}
            variants={fadeInUp}
            onClick={() => setActive(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              active === cat
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                : 'glass border border-white/10 text-white/50 hover:text-white hover:border-white/20'
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </motion.div>

      {/* Skills grid */}
      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {filtered.map((skill, i) => (
          <SkillCard key={skill.id} skill={skill} index={i} />
        ))}
      </motion.div>
    </SectionWrapper>
  )
}

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      className="glass-card p-5 hover:border-violet-500/30 transition-all duration-300 group"
      whileHover={{ y: -4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-label={skill.name}>{skill.icon}</span>
          <div>
            <p className="font-semibold text-white text-sm">{skill.name}</p>
            <span className="text-xs text-white/30">{skill.category}</span>
          </div>
        </div>
        <span
          className="text-sm font-bold font-mono"
          style={{
            background: 'linear-gradient(135deg, #a78bfa, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {skill.level}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
            boxShadow: '0 0 8px rgba(124,58,237,0.5)',
          }}
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: index * 0.04, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  )
}
