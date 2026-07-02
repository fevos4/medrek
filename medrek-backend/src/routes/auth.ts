const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { prisma } = require('../lib/prisma')
const { getAdmin } = require('../lib/firebaseAdmin')

const router = express.Router()

// POST /api/auth/register
router.post('/register', async (req: any, res: any) => {
  try {
    const { email, password, preferredLang } = req.body
    const username = req.body.username.toLowerCase().trim()

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required' })
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    })
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already taken' })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { username, email, passwordHash, preferredLang: preferredLang || 'en' }
    })

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        karma: user.karma,
        preferredLang: user.preferredLang
      }
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/auth/login
router.post('/login', async (req: any, res: any) => {
  try {
    const { emailOrUsername, password } = req.body

    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: 'Email/username and password are required' })
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername }
        ]
      }
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        karma: user.karma,
        preferredLang: user.preferredLang
      }
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/auth/me
router.get('/me', require('../middleware/auth').protect, async (req: any, res: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        karma: true,
        avatarUrl: true,
        bio: true,
        preferredLang: true,
        createdAt: true
      }
    })
    return res.json(user)
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/auth/google — Firebase Google Sign-In
router.post('/google', async (req: any, res: any) => {
  try {
    const { idToken } = req.body

    if (!idToken) {
      return res.status(400).json({ message: 'No token provided' })
    }

    const firebaseAdmin = getAdmin()
    if (!firebaseAdmin) {
      return res.status(503).json({ message: 'Google sign-in temporarily unavailable' })
    }

    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken)
    const { email, name, picture, uid } = decodedToken

    if (!email) {
      return res.status(400).json({ message: 'Google account has no email' })
    }

    let user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      let baseUsername = (name || email.split('@')[0])
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '')
        .slice(0, 20)

      if (baseUsername.length < 3) {
        baseUsername = 'user' + Math.floor(Math.random() * 10000)
      }

      let username = baseUsername
      let suffix = 0
      while (await prisma.user.findUnique({ where: { username } })) {
        suffix++
        username = `${baseUsername}${suffix}`
      }

      const randomPassword = await bcrypt.hash(uid + Date.now().toString(), 12)

      user = await prisma.user.create({
        data: {
          username,
          email,
          passwordHash: randomPassword,
          avatarUrl: picture || null,
          preferredLang: 'en'
        }
      })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        karma: user.karma,
        preferredLang: user.preferredLang,
        avatarUrl: user.avatarUrl
      }
    })
  } catch (err: any) {
    console.error('Firebase Google auth error:', err)
    return res.status(401).json({ message: 'Google authentication failed' })
  }
})

// GET /api/auth/google — OAuth flow (legacy, kept for reference)
router.get('/google', (req: any, res: any) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(500).json({ message: 'Google OAuth is not configured' })
  }
  const state = crypto.randomBytes(16).toString('hex')
  const redirectUri = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'
  const url = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent('openid email profile')}` +
    `&state=${state}`
  return res.redirect(url)
})

// GET /api/auth/google/callback
router.get('/google/callback', async (req: any, res: any) => {
  const { code, error: googleError } = req.query
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

  if (googleError || !code) {
    return res.redirect(`${frontendUrl}/login?error=google_auth_failed`)
  }

  try {
    const redirectUri = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: code as string,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    })

    const tokens: any = await tokenRes.json()

    if (!tokens.access_token) {
      console.error('Google token error:', tokens)
      return res.redirect(`${frontendUrl}/login?error=google_auth_failed`)
    }

    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    })
    const userInfo: any = await userInfoRes.json()

    if (!userInfo.email) {
      return res.redirect(`${frontendUrl}/login?error=google_no_email`)
    }

    let user = await prisma.user.findUnique({ where: { email: userInfo.email } })

    if (!user) {
      let username = userInfo.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '')
      const existing = await prisma.user.findUnique({ where: { username } })
      if (existing) {
        username = `${username}${Math.floor(Math.random() * 10000)}`
      }

      user = await prisma.user.create({
        data: {
          username,
          email: userInfo.email,
          passwordHash: '',
          avatarUrl: userInfo.picture || null,
          preferredLang: 'en'
        }
      })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      karma: user.karma,
      preferredLang: user.preferredLang,
      avatarUrl: user.avatarUrl
    }

    return res.send(`
      <html><body>
      <script>
        window.opener.postMessage({ token: "${token}", user: ${JSON.stringify(userData)} }, "${frontendUrl}");
        window.close();
      </script>
      </body></html>
    `)
  } catch (err) {
    console.error('Google callback error:', err)
    return res.redirect(`${frontendUrl}/login?error=google_auth_failed`)
  }
})

module.exports = router