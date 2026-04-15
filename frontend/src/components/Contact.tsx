import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Github, Linkedin } from 'lucide-react'
import { PersonalInfo } from '../types/portfolio'
import SectionTitle, { SectionWrapper, fadeInUp, staggerContainer } from './SectionTitle'

interface ContactProps {
  personal: PersonalInfo
}

export default function Contact({ personal }: ContactProps) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    // Simulate sending (portfolio contact forms typically use a third-party service)
    await new Promise((res) => setTimeout(res, 1500))
    setSending(false)
    setSent(true)
    setForm({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setSent(false), 5000)
  }

  const contactItems = [
    { icon: <Mail size={20} />, label: 'Email', value: personal.email, href: `mailto:${personal.email}` },
    { icon: <Phone size={20} />, label: 'Phone', value: personal.phone, href: `tel:${personal.phone}` },
    { icon: <MapPin size={20} />, label: 'Location', value: personal.location },
  ]

  return (
    <SectionWrapper id="contact" className="bg-white/[0.02]">
      <SectionTitle
        badge="Contact"
        title="Get In"
        highlight="Touch"
        subtitle="Have a project in mind? I'd love to hear about it. Let's create something amazing together."
        center
      />

      <div className="grid lg:grid-cols-5 gap-10">
        {/* Contact info (left) */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {contactItems.map((item, i) => (
            <motion.div
              key={item.label}
              variants={fadeInUp}
              custom={i}
              className="flex items-center gap-4 p-4 glass-card hover:border-violet-500/30 transition-all duration-300"
            >
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20
                flex items-center justify-center text-violet-400">
                {item.icon}
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="text-white/80 hover:text-violet-400 transition-colors text-sm font-medium">
                    {item.value}
                  </a>
                ) : (
                  <p className="text-white/80 text-sm font-medium">{item.value}</p>
                )}
              </div>
            </motion.div>
          ))}

          {/* Social links */}
          <motion.div variants={fadeInUp} className="flex gap-3 pt-2">
            {personal.github && (
              <a href={personal.github} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl glass border border-white/10
                  text-sm text-white/60 hover:text-white hover:border-violet-400/40 transition-all duration-300">
                <Github size={18} /> GitHub
              </a>
            )}
            {personal.linkedin && (
              <a href={personal.linkedin} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl glass border border-white/10
                  text-sm text-white/60 hover:text-white hover:border-cyan-400/40 transition-all duration-300">
                <Linkedin size={18} /> LinkedIn
              </a>
            )}
          </motion.div>
        </motion.div>

        {/* Contact form (right) */}
        <motion.form
          className="lg:col-span-3 glass-card p-8"
          onSubmit={handleSubmit}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <motion.div variants={fadeInUp}>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                maxLength={100}
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                maxLength={100}
              />
            </motion.div>
          </div>
          <motion.div variants={fadeInUp} className="mb-4">
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Subject</label>
            <input
              type="text"
              className="input-field"
              placeholder="Project inquiry..."
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              required
              maxLength={200}
            />
          </motion.div>
          <motion.div variants={fadeInUp} className="mb-6">
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Message</label>
            <textarea
              className="input-field resize-none h-36"
              placeholder="Tell me about your project..."
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              required
              maxLength={2000}
            />
          </motion.div>

          <motion.button
            variants={fadeInUp}
            type="submit"
            disabled={sending || sent}
            className={`btn-primary w-full flex items-center justify-center gap-2 ${
              (sending || sent) ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            whileHover={!sending && !sent ? { scale: 1.01 } : {}}
            whileTap={!sending && !sent ? { scale: 0.99 } : {}}
          >
            {sent ? (
              '✓ Message Sent!'
            ) : sending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={16} /> Send Message
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </SectionWrapper>
  )
}
