import { Router, Request, Response } from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
const dataPath = path.join(__dirname, '../../data/portfolio.json')

function readData() {
  return JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
}

function writeData(data: unknown) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8')
}

// Store files in memory as buffer
const storage = multer.memoryStorage()

const photoUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only JPEG, PNG, or WEBP images are allowed'))
    }
  },
})

const cvUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files are allowed for CV'))
    }
  },
})

// POST upload profile photo (protected)
router.post('/photo', authMiddleware, photoUpload.single('photo'), (req: AuthRequest, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' })
    return
  }
  try {
    const base64 = req.file.buffer.toString('base64')
    const mimeType = req.file.mimetype
    const data = readData()
    data.photoBase64 = base64
    data.photoMimeType = mimeType
    writeData(data)
    res.json({ message: 'Photo uploaded successfully', photoBase64: base64, mimeType })
  } catch {
    res.status(500).json({ message: 'Failed to save photo' })
  }
})

// DELETE profile photo (protected)
router.delete('/photo', authMiddleware, (_req: AuthRequest, res: Response): void => {
  try {
    const data = readData()
    data.photoBase64 = null
    data.photoMimeType = null
    writeData(data)
    res.json({ message: 'Photo removed successfully' })
  } catch {
    res.status(500).json({ message: 'Failed to remove photo' })
  }
})

// POST upload CV (protected)
router.post('/cv', authMiddleware, cvUpload.single('cv'), (req: AuthRequest, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' })
    return
  }
  try {
    const base64 = req.file.buffer.toString('base64')
    const data = readData()
    data.cvBase64 = base64
    data.cvFileName = req.file.originalname
    writeData(data)
    res.json({ message: 'CV uploaded successfully', cvFileName: req.file.originalname })
  } catch {
    res.status(500).json({ message: 'Failed to save CV' })
  }
})

// GET download CV (public)
router.get('/cv', (_req: Request, res: Response): void => {
  try {
    const data = readData()
    if (!data.cvBase64) {
      res.status(404).json({ message: 'No CV uploaded' })
      return
    }
    const buffer = Buffer.from(data.cvBase64, 'base64')
    const filename = data.cvFileName || 'CV.pdf'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.send(buffer)
  } catch {
    res.status(500).json({ message: 'Failed to download CV' })
  }
})

// DELETE CV (protected)
router.delete('/cv', authMiddleware, (_req: AuthRequest, res: Response): void => {
  try {
    const data = readData()
    data.cvBase64 = null
    data.cvFileName = null
    writeData(data)
    res.json({ message: 'CV removed successfully' })
  } catch {
    res.status(500).json({ message: 'Failed to remove CV' })
  }
})

export default router
