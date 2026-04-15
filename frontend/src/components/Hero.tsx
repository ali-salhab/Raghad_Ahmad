import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Github, Linkedin, Twitter, Mail, Download } from 'lucide-react'
import Scene3D from './Scene3D'
import FloatingPhoto from './FloatingPhoto'
import { PortfolioData } from '../types/portfolio'

interface HeroProps {
  data: PortfolioData
}

const TYPING_TITLES = ['Full Stack Developer', 'UI/UX Enthusiast', 'Problem Solver', 'Open Source Contributor']

export default function Hero({ data }: HeroProps) {
  const [titleIndex, setTitleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = data.personal.title || TYPING_TITLES[titleIndex]
    const titles = [data.personal.title, ...TYPING_TITLES.filter(t => t !== data.personal.title)]

    const timeout = setTimeout(() => {
      const target = titles[titleIndex % titles.length]
      if (!isDeleting) {
        setDisplayed(target.slice(0, displayed.length + 1))
        if (displayed.length + 1 === target.length) {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        setDisplayed(target.slice(0, displayed.length - 1))
        if (displayed.length === 0) {
          setIsDeleting(false)
          setTitleIndex((i) => (i + 1) % titles.length)
        }
      }
    }, isDeleting ? 40 : 80)

    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, titleIndex, data.personal.title])

  const { personal } = data

  return (
    <section id="home" className="relative h-screen min-h-[700px] flex items-start lg:items-center pt-28 lg:pt-0" style={{ overflow: 'clip' }}>
      {/* 3D Background */}
      <Scene3D />

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(10,10,15,0.85) 0%, rgba(10,10,15,0.4) 50%, rgba(10,10,15,0.7) 100%)' }}
      />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0a0a0f, transparent)' }}
      />

      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16">

          {/* Text Content */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-violet-500/30 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-white/70 font-medium">Available for opportunities</span>
            </motion.div>

            {/* Name */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              Hi, I'm{' '}
              <span
                className="block"
                style={{
                  background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 40%, #06b6d4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {personal.name}
              </span>
            </motion.h1>

            {/* Typing title */}
            <motion.div
              className="h-12 flex items-center justify-center lg:justify-start mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-xl md:text-2xl text-white/80 font-medium font-mono">
                {displayed}
                <span className="animate-pulse text-violet-400">|</span>
              </span>
            </motion.div>

            {/* Bio */}
            <motion.p
              className="text-white/60 text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {personal.subtitle}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <a href="#contact" className="btn-primary flex items-center gap-2">
                <Mail size={18} /> Get in Touch
              </a>
              {data.cvBase64 && (
                <a href="/api/upload/cv" download className="btn-outline flex items-center gap-2">
                  <Download size={18} /> Download CV
                </a>
              )}
              <a href="#projects" className="btn-outline">View Work</a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="flex gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              {personal.github && (
                <a href={personal.github} target="_blank" rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl glass border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-violet-400/50 hover:bg-violet-500/10 transition-all duration-300">
                  <Github size={20} />
                </a>
              )}
              {personal.linkedin && (
                <a href={personal.linkedin} target="_blank" rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl glass border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all duration-300">
                  <Linkedin size={20} />
                </a>
              )}
              {personal.twitter && (
                <a href={personal.twitter} target="_blank" rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl glass border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-sky-400/50 hover:bg-sky-500/10 transition-all duration-300">
                  <Twitter size={20} />
                </a>
              )}
              <a href={`mailto:${personal.email}`}
                className="w-11 h-11 rounded-xl glass border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-violet-400/50 hover:bg-violet-500/10 transition-all duration-300">
                <Mail size={20} />
              </a>
            </motion.div>
          </motion.div>

          {/* Floating Photo */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <FloatingPhoto
              photoBase64={data.photoBase64}
              photoMimeType={data.photoMimeType}
              name={personal.name}
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/40"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <ChevronDown size={18} />
      </motion.div>
    </section>
  )
}
