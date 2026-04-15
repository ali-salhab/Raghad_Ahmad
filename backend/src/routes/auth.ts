import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'

const router = Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
})

router.post('/login', loginLimiter, async (req: Request, res: Response): Promise<void> => {
  const { password } = req.body as { password?: string }

  if (!password || typeof password !== 'string' || password.length > 128) {
    res.status(400).json({ message: 'Password is required' })
    return
  }

  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123'
  const secret = process.env.JWT_SECRET || 'fallback-dev-secret'

  const isValid = await bcrypt.compare(password, await bcrypt.hash(adminPassword, 10))
    || password === adminPassword

  if (!isValid) {
    res.status(401).json({ message: 'Invalid password' })
    return
  }

  const token = jwt.sign(
    { username: 'admin' },
    secret,
    { expiresIn: '24h' }
  )

  res.json({ token })
})

router.get('/verify', (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ valid: false })
    return
  }
  const token = authHeader.split(' ')[1]
  const secret = process.env.JWT_SECRET || 'fallback-dev-secret'
  try {
    jwt.verify(token, secret)
    res.json({ valid: true })
  } catch {
    res.status(401).json({ valid: false })
  }
})

export default router
