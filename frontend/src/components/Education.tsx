import { motion } from 'framer-motion'
import { GraduationCap, Calendar } from 'lucide-react'
import { Education } from '../types/portfolio'
import SectionTitle, { SectionWrapper, fadeInUp, staggerContainer } from './SectionTitle'

interface EducationProps {
  education: Education[]
}

function formatDate(date: string) {
  if (!date) return 'Present'
  const [year, month] = date.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[parseInt(month) - 1]} ${year}`
}

export default function EducationSection({ education }: EducationProps) {
  return (
    <SectionWrapper id="education" className="bg-white/[0.02]">
      <SectionTitle
        badge="Education"
        title="Academic"
        highlight="Background"
        subtitle="The foundation of knowledge that drives my passion for technology."
      />

      <motion.div
        className="grid md:grid-cols-2 gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {education.map((edu, i) => (
          <motion.div
            key={edu.id}
            variants={fadeInUp}
            custom={i}
            className="glass-card p-6 hover:border-violet-500/30 transition-all duration-300"
            whileHover={{ y: -4 }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20
                flex items-center justify-center">
                <GraduationCap className="text-violet-400" size={22} />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-white">{edu.degree}</h3>
                <p className="text-violet-400 font-medium text-sm">{edu.field}</p>
              </div>
            </div>

            <p className="font-semibold text-white/80 mb-2">{edu.institution}</p>

            <div className="flex items-center gap-1.5 text-white/40 text-sm mb-3">
              <Calendar size={13} />
              <span>{formatDate(edu.startDate)} — {formatDate(edu.endDate)}</span>
            </div>

            {edu.description && (
              <p className="text-white/55 text-sm leading-relaxed">{edu.description}</p>
            )}
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  )
}
