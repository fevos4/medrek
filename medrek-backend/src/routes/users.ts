const express = require('express')
const { prisma } = require('../lib/prisma')
const { protect, optionalAuth } = require('../middleware/auth')

const router = express.Router()

// PATCH /api/users/me — update own profile (must be before :username routes)
router.patch('/me', protect, async (req: any, res: any) => {
  try {
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(req.body.bio !== undefined && { bio: req.body.bio }),
        ...(req.body.avatarUrl !== undefined && { avatarUrl: req.body.avatarUrl }),
        ...(req.body.preferredLang !== undefined && { preferredLang: req.body.preferredLang })
      }
    })
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/:username', async (req: any, res: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: req.params.username },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        bio: true,
        karma: true,
        preferredLang: true,
        createdAt: true
      }
    })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const [postCount, commentCount] = await Promise.all([
      prisma.post.count({ where: { authorId: user.id, isRemoved: false, isAnonymous: false } }),
      prisma.comment.count({ where: { authorId: user.id, isRemoved: false, isAnonymous: false } })
    ])

    res.json({ ...user, _count: { posts: postCount, comments: commentCount } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/:username/posts', optionalAuth, async (req: any, res: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: req.params.username },
      select: { id: true }
    })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const posts = await prisma.post.findMany({
      where: {
        authorId: user.id,
        isRemoved: false,
        isAnonymous: false
      },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        community: { select: { id: true, name: true, nameAm: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    const postIds = posts.map((p: any) => p.id)
    let userVotes: Record<string, number> = {}
    if (req.user) {
      const votes = await prisma.vote.findMany({
        where: { userId: req.user.id, targetId: { in: postIds }, targetType: 'post' }
      })
      votes.forEach((v: any) => { userVotes[v.targetId] = v.value })
    }

    const mapped = posts.map((post: any) => ({
      ...post,
      author: post.isAnonymous ? null : post.author,
      authorName: post.isAnonymous ? 'Anonymous' : post.author?.username,
      userVote: userVotes[post.id] || 0
    }))

    res.json(mapped)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/:username/comments', async (req: any, res: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: req.params.username },
      select: { id: true }
    })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const comments = await prisma.comment.findMany({
      where: {
        authorId: user.id,
        isRemoved: false,
        isAnonymous: false
      },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        post: {
          select: {
            id: true,
            title: true,
            titleAm: true,
            community: { select: { id: true, name: true, nameAm: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json(comments)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/users/:username/communities
router.get('/:username/communities', optionalAuth, async (req: any, res: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: req.params.username },
      select: { id: true }
    })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const communities = await prisma.community.findMany({
      where: { creatorId: user.id },
      include: { _count: { select: { members: true } } },
      orderBy: { createdAt: 'desc' }
    })

    const membershipMap: Record<string, any> = {}
    if (req.user) {
      const memberships = await prisma.communityMember.findMany({
        where: { userId: req.user.id, communityId: { in: communities.map((c: any) => c.id) } }
      })
      memberships.forEach((m: any) => {
        membershipMap[m.communityId] = { role: m.role, isMuted: m.isMuted }
      })
    }

    const result = communities.map((c: any) => ({
      ...c,
      isJoined: !!membershipMap[c.id],
      userRole: membershipMap[c.id]?.role || null,
      isMuted: membershipMap[c.id]?.isMuted || false
    }))

    res.json(result)
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ message: 'Server error', error: err.message || String(err) })
  }
})

module.exports = router
