import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface NavbarProps {
  name: string
}

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

export default function Navbar({ name }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      // Detect active section
      for (const section of [...SECTIONS].reverse()) {
        const el = document.getElementById(section.id)
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(section.id)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const initials = (name || '').split(' ').map(n => n[0] ?? '').join('').slice(0, 2).toUpperCase() || '?'

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3 glass border-b border-white/5 shadow-xl shadow-black/20' : 'py-5'
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm font-display
            bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30
            group-hover:shadow-violet-500/60 transition-all duration-300">
            {initials}
          </div>
          <span className="font-display font-semibold text-white/90 hidden sm:block">{name}</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                active === s.id ? 'text-white' : 'text-white/50 hover:text-white/80'
              }`}
            >
              {active === s.id && (
                <motion.span
                  layoutId="activeSection"
                  className="absolute inset-0 rounded-lg bg-white/8 border border-white/10"
                />
              )}
              <span className="relative z-10">{s.label}</span>
            </a>
          ))}
          <a
            href="/admin"
            className="ml-4 px-4 py-2 rounded-lg text-xs font-medium text-white/40 hover:text-white/70
              border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            Admin
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl glass border border-white/10"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          className="md:hidden mt-2 mx-4 rounded-2xl glass border border-white/10 overflow-hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setMenuOpen(false)}
              className={`block px-6 py-3 text-sm font-medium border-b border-white/5 last:border-0 ${
                active === s.id ? 'text-violet-400 bg-violet-500/10' : 'text-white/60 hover:text-white hover:bg-white/5'
              } transition-all duration-200`}
            >
              {s.label}
            </a>
          ))}
          <a href="/admin" onClick={() => setMenuOpen(false)}
            className="block px-6 py-3 text-sm text-white/40 hover:text-white/70 transition-colors">
            Admin Panel
          </a>
        </motion.div>
      )}
    </motion.nav>
  )
}
