import { motion } from 'framer-motion'
import { MapPin, Mail, Phone, Github, Linkedin } from 'lucide-react'
import { PersonalInfo } from '../types/portfolio'
import SectionTitle, { SectionWrapper, fadeInUp, staggerContainer } from './SectionTitle'

interface AboutProps {
  personal: PersonalInfo
}

export default function About({ personal }: AboutProps) {
  const infoItems = [
    { icon: <Mail size={16} />, label: 'Email', value: personal.email, href: `mailto:${personal.email}` },
    { icon: <Phone size={16} />, label: 'Phone', value: personal.phone, href: `tel:${personal.phone}` },
    { icon: <MapPin size={16} />, label: 'Location', value: personal.location },
  ]

  const stats = [
    { value: '5+', label: 'Years Experience' },
    { value: '50+', label: 'Projects Completed' },
    { value: '20+', label: 'Happy Clients' },
    { value: '100%', label: 'Commitment' },
  ]

  return (
    <SectionWrapper id="about">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Text */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <SectionTitle badge="About Me" title="Who" highlight="I Am" subtitle="" />

          <motion.p variants={fadeInUp} className="text-white/65 text-lg leading-relaxed mb-6">
            {personal.bio}
          </motion.p>

          {/* Info items */}
          <motion.div variants={fadeInUp} className="space-y-3 mb-8">
            {infoItems.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20
                  flex items-center justify-center text-violet-400">
                  {item.icon}
                </span>
                <span className="text-white/40 text-sm w-16">{item.label}:</span>
                {item.href ? (
                  <a href={item.href} className="text-white/80 hover:text-violet-400 transition-colors text-sm">
                    {item.value}
                  </a>
                ) : (
                  <span className="text-white/80 text-sm">{item.value}</span>
                )}
              </div>
            ))}
          </motion.div>

          {/* Social buttons */}
          <motion.div variants={fadeInUp} className="flex gap-3">
            {personal.github && (
              <a href={personal.github} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-white/10
                  text-sm text-white/70 hover:text-white hover:border-violet-400/40 transition-all duration-300">
                <Github size={16} /> GitHub
              </a>
            )}
            {personal.linkedin && (
              <a href={personal.linkedin} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-white/10
                  text-sm text-white/70 hover:text-white hover:border-cyan-400/40 transition-all duration-300">
                <Linkedin size={16} /> LinkedIn
              </a>
            )}
          </motion.div>
        </motion.div>

        {/* Right: Stats */}
        <motion.div
          className="grid grid-cols-2 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              custom={i}
              className="glass-card p-6 text-center hover:border-violet-500/30 transition-all duration-300 group"
            >
              <div
                className="text-4xl font-display font-bold mb-2 group-hover:scale-110 transition-transform duration-300"
                style={{
                  background: 'linear-gradient(135deg, #a78bfa, #06b6d4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {stat.value}
              </div>
              <div className="text-white/50 text-sm font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
