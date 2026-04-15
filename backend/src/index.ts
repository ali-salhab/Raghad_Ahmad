import express from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/auth'
import portfolioRoutes from './routes/portfolio'
import uploadRoutes from './routes/upload'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const isProd = process.env.NODE_ENV === 'production'

// Rate limiting for API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
})

// CORS
const allowedOrigins = isProd
  ? [process.env.FRONTEND_URL || ''].filter(Boolean)
  : ['http://localhost:5173', 'http://localhost:4173']

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))

app.use(express.json({ limit: '15mb' }))
app.use(express.urlencoded({ extended: true, limit: '15mb' }))

// Security headers
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  next()
})

// API routes
app.use('/api', apiLimiter)
app.use('/api/auth', authRoutes)
app.use('/api/portfolio', portfolioRoutes)
app.use('/api/upload', uploadRoutes)

// Serve frontend in production
if (isProd) {
  const frontendDist = path.join(__dirname, '../../frontend/dist')
  app.use(express.static(frontendDist))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'))
  })
}

app.listen(PORT, () => {
  const adminPw = process.env.ADMIN_PASSWORD
  if (!adminPw) {
    console.log('\x1b[33m⚠ ADMIN_PASSWORD not set - using default: Admin@123\x1b[0m')
  }
  console.log(`\x1b[32m✓ Server running on port ${PORT}\x1b[0m`)
  if (!isProd) {
    console.log(`  API: http://localhost:${PORT}/api`)
  }
})

export default app
