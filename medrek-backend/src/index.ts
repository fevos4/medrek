const express = require('express')
const cors = require('cors')
const path = require('path')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use(helmet())

// Rate limit auth routes — prevents brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many attempts. Try again in 15 minutes.' }
})

app.use('/api/auth', authLimiter)

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/users', require('./routes/users'))
app.use('/api/communities', require('./routes/communities'))
app.use('/api/posts', require('./routes/posts'))
app.use('/api/comments', require('./routes/comments'))
app.use('/api/votes', require('./routes/votes'))
app.use('/api/reports', require('./routes/reports'))
app.use('/api/notifications', require('./routes/notifications'))
app.use('/api/stats', require('./routes/stats'))
app.use('/api/upload', require('./routes/upload'))

// Health check
app.get('/api/health', (req: any, res: any) => {
  res.json({ status: 'Medrek API is running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Medrek server running on port ${PORT}`)
})