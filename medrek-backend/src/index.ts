const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const app = express()

// Trust Render's reverse proxy for correct rate-limiting
app.set('trust proxy', 1)

// Fix COOP issue that blocks Google sign-in popup
app.use(helmet({
  crossOriginOpenerPolicy: false
}))

const allowedOrigins = [
  'http://localhost:5173',
  'https://medrek.vercel.app',
  'https://medrek-five.vercel.app'
]

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

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