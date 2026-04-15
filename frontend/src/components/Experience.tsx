import { motion } from 'framer-motion'
import { Briefcase, Calendar, MapPin } from 'lucide-react'
import { Experience } from '../types/portfolio'
import SectionTitle, { SectionWrapper, fadeInUp, staggerContainer } from './SectionTitle'

interface ExperienceProps {
  experience: Experience[]
}

function formatDate(date: string) {
  if (!date) return 'Present'
  const [year, month] = date.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[parseInt(month) - 1]} ${year}`
}

export default function ExperienceSection({ experience }: ExperienceProps) {
  return (
    <SectionWrapper id="experience">
      <SectionTitle
        badge="Work History"
        title="Professional"
        highlight="Experience"
        subtitle="My journey through building impactful products for amazing companies."
      />

      <motion.div
        className="relative"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {/* Timeline line */}
        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-violet-600 via-violet-600/40 to-transparent" />

        <div className="space-y-8">
          {experience.map((exp, i) => (
            <motion.div
              key={exp.id}
              variants={fadeInUp}
              custom={i}
              className="relative pl-16 md:pl-20"
            >
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-6 top-6 -translate-x-1/2">
                <div className="w-5 h-5 rounded-full border-2 border-violet-500 bg-dark flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-violet-500" />
                </div>
                {exp.current && (
                  <div className="absolute inset-0 rounded-full border-2 border-violet-500/50 animate-ping" />
                )}
              </div>

              {/* Card */}
              <motion.div
                className="glass-card p-6 hover:border-violet-500/30 transition-all duration-300"
                whileHover={{ x: 4 }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-display font-bold text-white">{exp.position}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Briefcase size={14} className="text-violet-400" />
                      <span className="text-violet-400 font-medium">{exp.company}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5 text-white/40 text-sm">
                      <Calendar size={13} />
                      <span>{formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                    </div>
                    {exp.current && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/25">
                        Current
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-white/60 text-sm leading-relaxed mb-4">{exp.description}</p>

                {exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  )
}
