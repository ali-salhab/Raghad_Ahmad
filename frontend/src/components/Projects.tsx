import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import { Project } from '../types/portfolio'
import SectionTitle, { SectionWrapper, fadeInUp, staggerContainer } from './SectionTitle'

interface ProjectsProps {
  projects: Project[]
}

export default function Projects({ projects }: ProjectsProps) {
  return (
    <SectionWrapper id="projects">
      <SectionTitle
        badge="Portfolio"
        title="Featured"
        highlight="Projects"
        subtitle="A selection of projects I've built — each one a unique challenge and learning experience."
      />

      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </motion.div>
    </SectionWrapper>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      className="glass-card overflow-hidden hover:border-violet-500/40 transition-all duration-300 group flex flex-col"
      whileHover={{ y: -6 }}
    >
      {/* Project image / gradient placeholder */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        {project.image ? (
          <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, 
                hsl(${(index * 60 + 250) % 360}, 60%, 15%) 0%, 
                hsl(${(index * 60 + 310) % 360}, 50%, 10%) 100%)`,
            }}
          >
            <span
              className="text-5xl font-display font-bold opacity-30"
              style={{
                background: 'linear-gradient(135deg, #a78bfa, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {project.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-violet-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300
          flex items-center justify-center gap-4">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20
                flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
              onClick={(e) => e.stopPropagation()}>
              <Github size={18} />
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-violet-600/80 backdrop-blur-sm border border-violet-500
                flex items-center justify-center text-white hover:bg-violet-500 transition-all duration-200"
              onClick={(e) => e.stopPropagation()}>
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-bold text-white text-lg mb-2 group-hover:text-violet-300 transition-colors">
          {project.name}
        </h3>
        <p className="text-white/55 text-sm leading-relaxed mb-4 flex-1">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span key={tech} className="tech-tag">{tech}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
