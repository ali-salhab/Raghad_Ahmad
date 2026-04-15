import { Router, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
const dataPath = path.join(__dirname, '../../data/portfolio.json')

function readData() {
  const raw = fs.readFileSync(dataPath, 'utf-8')
  return JSON.parse(raw)
}

function writeData(data: unknown) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8')
}

// GET all portfolio data (public)
router.get('/', (_req: Request, res: Response): void => {
  try {
    const data = readData()
    res.json(data)
  } catch {
    res.status(500).json({ message: 'Failed to read portfolio data' })
  }
})

// PUT update portfolio data (protected)
router.put('/', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const current = readData()
    const {
      personal,
      skills,
      experience,
      education,
      projects,
    } = req.body as Record<string, unknown>

    const updated = {
      ...current,
      ...(personal !== undefined && { personal }),
      ...(skills !== undefined && { skills }),
      ...(experience !== undefined && { experience }),
      ...(education !== undefined && { education }),
      ...(projects !== undefined && { projects }),
    }

    writeData(updated)
    res.json({ message: 'Portfolio updated successfully', data: updated })
  } catch {
    res.status(500).json({ message: 'Failed to update portfolio data' })
  }
})

export default router
