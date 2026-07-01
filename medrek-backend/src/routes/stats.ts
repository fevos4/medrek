const express = require('express')
const { prisma } = require('../lib/prisma')

const router = express.Router()

// GET /api/stats
router.get('/', async (req: any, res: any) => {
  try {
    const [userCount, communityCount, postCount] = await Promise.all([
      prisma.user.count(),
      prisma.community.count(),
      prisma.post.count()
    ])
    res.json({ userCount, communityCount, postCount })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
