import { motion } from 'framer-motion'

interface FloatingPhotoProps {
  photoBase64: string | null
  photoMimeType?: string | null
  name: string
}

export default function FloatingPhoto({ photoBase64, photoMimeType, name }: FloatingPhotoProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const imgSrc = photoBase64
    ? `data:${photoMimeType || 'image/jpeg'};base64,${photoBase64}`
    : null

  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={{ y: [0, -18, 0] }}
      transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
    >
      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-3xl scale-150 animate-pulse-glow" />

      {/* Second glow ring (cyan) */}
      <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-2xl scale-125 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Rotating gradient border ring (outer) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 'calc(100% + 24px)',
          height: 'calc(100% + 24px)',
          top: '-12px',
          left: '-12px',
          background: 'conic-gradient(from 0deg, #7c3aed, #06b6d4, #a78bfa, #7c3aed)',
          opacity: 0.35,
          filter: 'blur(8px)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, ease: 'linear', repeat: Infinity }}
      />

      {/* Medium spinning ring */}
      <motion.div
        className="absolute rounded-full border-2 border-violet-400/30"
        style={{ width: 'calc(100% + 40px)', height: 'calc(100% + 40px)', top: '-20px', left: '-20px' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 14, ease: 'linear', repeat: Infinity }}
      >
        {/* Orbiting dot */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -right-2 w-3 h-3 rounded-full bg-violet-400"
          style={{ boxShadow: '0 0 10px #7c3aed, 0 0 20px #7c3aed' }}
        />
      </motion.div>

      {/* Outer spinning ring */}
      <motion.div
        className="absolute rounded-full border border-cyan-400/20"
        style={{ width: 'calc(100% + 60px)', height: 'calc(100% + 60px)', top: '-30px', left: '-30px' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
      >
        {/* Orbiting dot 2 */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 rounded-full bg-cyan-400"
          style={{ boxShadow: '0 0 8px #06b6d4, 0 0 16px #06b6d4' }}
        />
      </motion.div>

      {/* Main photo container */}
      <div
        className="relative w-64 h-64 md:w-80 md:h-80 rounded-full p-0.5 photo-glow"
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4, #a78bfa, #7c3aed)',
          backgroundSize: '300% 300%',
          animation: 'rotating-border 4s ease infinite, glowPulse 3s ease-in-out infinite',
        }}
      >
        {/* Glass inner ring */}
        <div
          className="w-full h-full rounded-full overflow-hidden"
          style={{
            background: 'rgba(10, 10, 20, 0.5)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={name}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-violet-900/80 via-purple-900/60 to-cyan-900/40">
              <span
                className="text-6xl md:text-7xl font-bold font-display"
                style={{
                  background: 'linear-gradient(135deg, #a78bfa, #06b6d4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {initials}
              </span>
              <span className="text-white/30 text-xs mt-1 font-mono">Upload Photo</span>
            </div>
          )}
        </div>
      </div>

      {/* Floating particles around photo */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: i % 2 === 0 ? '#7c3aed' : '#06b6d4',
            boxShadow: `0 0 6px ${i % 2 === 0 ? '#7c3aed' : '#06b6d4'}`,
          }}
          animate={{
            x: [
              Math.cos((i * Math.PI) / 2) * 160,
              Math.cos((i * Math.PI) / 2 + Math.PI) * 160,
              Math.cos((i * Math.PI) / 2) * 160,
            ],
            y: [
              Math.sin((i * Math.PI) / 2) * 160,
              Math.sin((i * Math.PI) / 2 + Math.PI) * 160,
              Math.sin((i * Math.PI) / 2) * 160,
            ],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{ duration: 6 + i * 1.5, ease: 'easeInOut', repeat: Infinity }}
        />
      ))}
    </motion.div>
  )
}
