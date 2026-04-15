import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  admin?: { username: string }
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' })
    return
  }

  const token = authHeader.split(' ')[1]
  const secret = process.env.JWT_SECRET || 'fallback-dev-secret'

  try {
    const decoded = jwt.verify(token, secret) as { username: string }
    req.admin = decoded
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}
