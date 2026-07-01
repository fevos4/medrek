const express = require('express')
const multer = require('multer')
const path = require('path')
const { protect } = require('../middleware/auth')

const router = express.Router()

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads'),
  filename: (req: any, file: any, cb: any) => {
    const ext = path.extname(file.originalname)
    cb(null, `img_${Date.now()}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req: any, file: any, cb: any) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp)$/i
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true)
    } else {
      cb(new Error('Only jpg, png, gif, webp allowed'))
    }
  }
})

// POST /api/upload/image
router.post('/image', protect, (req: any, res: any) => {
  upload.single('image')(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Max 10MB.' })
      }
      return res.status(400).json({ message: err.message || 'Upload failed' })
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' })
    }
    const imageUrl = `/uploads/${req.file.filename}`
    res.json({ imageUrl })
  })
})

module.exports = router
