const express = require('express')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const app = express()

// Trust Render's reverse proxy for correct rate-limiting
app.set('trust proxy', 1)

// Disable all Helmet security headers that block cross-origin browser requests
app.use(helmet({
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}))

// Manual CORS — Express 5 uses path-to-regexp v8 which doesn't support bare '*' routes
const allowedOrigins = [
  'http://localhost:5173',
  'https://medrek.vercel.app',
  'https://medrek-five.vercel.app'
]
app.use((req: any, res: any, next: any) => {
  const origin = req.headers.origin
  if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app'))) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Credentials', 'true')
  } else if (origin) {
    res.header('Access-Control-Allow-Origin', origin)
  } else {
    res.header('Access-Control-Allow-Origin', '*')
  }
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

app.use(express.json())

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many attempts. Try again in 15 minutes.' }
})

app.use('/api/auth', authLimiter)

app.use('/api/auth', require('./routes/auth'))
app.use('/api/communities', require('./routes/communities'))
app.use('/api/posts', require('./routes/posts'))
app.use('/api/comments', require('./routes/comments'))
app.use('/api/votes', require('./routes/votes'))
app.use('/api/reports', require('./routes/reports'))
app.use('/api/notifications', require('./routes/notifications'))
app.use('/api/upload', require('./routes/upload'))
app.use('/api/stats', require('./routes/stats'))
app.use('/api/users', require('./routes/users'))
app.use('/uploads', express.static(require('path').join(__dirname, '../uploads')))

app.get('/api/health', (req: any, res: any) => {
  res.json({ status: 'Medrek API is running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Medrek server running on port ${PORT}`)
})