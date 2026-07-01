const express = require('express')
const { prisma } = require('../lib/prisma')
const { protect, optionalAuth } = require('../middleware/auth')

const router = express.Router()

// GET /api/communities
router.get('/', optionalAuth, async (req: any, res: any) => {
  try {
    const { search } = req.query
    const communities = await prisma.community.findMany({
      where: search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { nameAm: { contains: search, mode: 'insensitive' } }
        ]
      } : {},
      include: { rules: true, _count: { select: { members: true } } },
      orderBy: { memberCount: 'desc' }
    })
    const membershipMap: Record<string, any> = {}
    if (req.user) {
      const memberships = await prisma.communityMember.findMany({
        where: { userId: req.user.id, communityId: { in: communities.map((c: any) => c.id) } }
      })
      memberships.forEach((m: any) => { membershipMap[m.communityId] = m.role })
    }
    const result = communities.map((c: any) => ({
      ...c,
      isJoined: !!membershipMap[c.id],
      userRole: membershipMap[c.id] || null
    }))
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/communities/trending
router.get('/trending', async (req: any, res: any) => {
  try {
    const communities = await prisma.community.findMany({
      where: { type: 'public' },
      orderBy: { memberCount: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        nameAm: true,
        memberCount: true,
        description: true
      }
    })
    res.json(communities)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/communities/my-moderated
router.get('/my-moderated', protect, async (req: any, res: any) => {
  try {
    const memberships = await prisma.communityMember.findMany({
      where: {
        userId: req.user.id,
        role: { in: ['moderator', 'admin'] }
      },
      include: {
        community: {
          select: { id: true, name: true, nameAm: true, memberCount: true }
        }
      }
    })
    const communities = memberships.map((m: any) => m.community)
    res.json(communities)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/communities/:id
router.get('/:id', optionalAuth, async (req: any, res: any) => {
  try {
    const community = await prisma.community.findUnique({
      where: { id: req.params.id },
      include: {
        rules: true,
        creator: { select: { id: true, username: true } },
        _count: { select: { members: true, posts: true } }
      }
    })
    if (!community) {
      return res.status(404).json({ message: 'Community not found' })
    }
    let isJoined = false
    let userRole: string | null = null
    let isMuted = false
    if (req.user) {
      const membership = await prisma.communityMember.findUnique({
        where: { userId_communityId: { userId: req.user.id, communityId: req.params.id } }
      })
      if (membership) {
        isJoined = true
        userRole = membership.role
        isMuted = membership.isMuted
      }
    }
    res.json({ ...community, isJoined, userRole, isMuted })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/communities
router.post('/', protect, async (req: any, res: any) => {
  try {
    const { name, nameAm, description, descriptionAm, type, isSensitive, rules } = req.body

    if (!name || name.length < 3 || name.length > 50) {
      return res.status(400).json({ message: 'Name is required, min 3 chars, max 50 chars' })
    }
    if (!description) {
      return res.status(400).json({ message: 'Description is required' })
    }
    if (type && !['public', 'private', 'restricted'].includes(type)) {
      return res.status(400).json({ message: 'Type must be public, private, or restricted' })
    }

    const existing = await prisma.community.findUnique({ where: { name } })
    if (existing) {
      return res.status(409).json({ message: 'Community name already taken' })
    }

    const community = await prisma.$transaction(async (tx: any) => {
      const comm = await tx.community.create({
        data: {
          name,
          nameAm: nameAm || null,
          description,
          descriptionAm: descriptionAm || null,
          type: type || 'public',
          isSensitive: isSensitive || false,
          creatorId: req.user.id
        }
      })
      await tx.communityMember.create({
        data: { userId: req.user.id, communityId: comm.id, role: 'admin' }
      })
      await tx.community.update({
        where: { id: comm.id },
        data: { memberCount: 1 }
      })
      if (rules && rules.length > 0) {
        await tx.communityRule.createMany({
          data: rules.map((r: any, i: number) => ({
            communityId: comm.id,
            number: i + 1,
            text: r.text,
            textAm: r.textAm || null
          }))
        })
      }
      return comm
    })

    res.status(201).json(community)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/communities/:id/join
router.post('/:id/join', protect, async (req: any, res: any) => {
  try {
    const community = await prisma.community.findUnique({ where: { id: req.params.id } })
    if (!community) {
      return res.status(404).json({ message: 'Community not found' })
    }

    const existingMember = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId: req.user.id, communityId: req.params.id } }
    })
    if (existingMember) {
      return res.status(400).json({ message: 'Already a member' })
    }

    await prisma.communityMember.create({
      data: { userId: req.user.id, communityId: req.params.id, role: 'member' }
    })
    await prisma.community.update({
      where: { id: req.params.id },
      data: { memberCount: { increment: 1 } }
    })

    // Send notification to the community creator if not muted
    if (community.creatorId !== req.user.id) {
      const creatorMembership = await prisma.communityMember.findUnique({
        where: { userId_communityId: { userId: community.creatorId, communityId: community.id } }
      })
      if (!creatorMembership || !creatorMembership.isMuted) {
        await prisma.notification.create({
          data: {
            type: 'join_group',
            content: `${req.user.username} joined your community ${community.name}`,
            link: `/community/${community.id}`,
            userId: community.creatorId
          }
        })
      }
    }

    res.json({ message: 'Joined successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// PATCH /api/communities/:id/mute
router.patch('/:id/mute', protect, async (req: any, res: any) => {
  try {
    const { isMuted } = req.body
    if (typeof isMuted !== 'boolean') {
      return res.status(400).json({ message: 'isMuted must be a boolean' })
    }

    const membership = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId: req.user.id, communityId: req.params.id } }
    })
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' })
    }

    const updated = await prisma.communityMember.update({
      where: { id: membership.id },
      data: { isMuted }
    })

    res.json({ message: isMuted ? 'Muted notifications' : 'Unmuted notifications', isMuted: updated.isMuted })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE /api/communities/:id/join
router.delete('/:id/join', protect, async (req: any, res: any) => {
  try {
    const membership = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId: req.user.id, communityId: req.params.id } }
    })
    if (!membership) {
      return res.status(400).json({ message: 'Not a member' })
    }
    if (membership.role === 'admin') {
      const adminCount = await prisma.communityMember.count({
        where: { communityId: req.params.id, role: 'admin' }
      })
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot leave as you are the only admin' })
      }
    }

    await prisma.communityMember.delete({
      where: { id: membership.id }
    })
    await prisma.community.update({
      where: { id: req.params.id },
      data: { memberCount: { decrement: 1 } }
    })

    res.json({ message: 'Left successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/communities/:id/promote
router.post('/:id/promote', protect, async (req: any, res: any) => {
  try {
    const { userId, role } = req.body
    if (!['moderator', 'member'].includes(role)) {
      return res.status(400).json({ message: 'Role must be moderator or member' })
    }

    const membership = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId: req.user.id, communityId: req.params.id } }
    })
    if (!membership || membership.role !== 'admin') {
      return res.status(403).json({ message: 'Only community admin can promote' })
    }

    const target = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId, communityId: req.params.id } }
    })
    if (!target) {
      return res.status(404).json({ message: 'User is not a member of this community' })
    }

    await prisma.communityMember.update({
      where: { id: target.id },
      data: { role }
    })

    res.json({ message: 'Role updated' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/communities/:id/ban
router.post('/:id/ban', protect, async (req: any, res: any) => {
  try {
    const { userId } = req.body

    const membership = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId: req.user.id, communityId: req.params.id } }
    })
    if (!membership || (membership.role !== 'moderator' && membership.role !== 'admin')) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const targetMembership = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId, communityId: req.params.id } }
    })
    if (!targetMembership) {
      return res.status(404).json({ message: 'User is not a member of this community' })
    }

    const community = await prisma.community.findUnique({ where: { id: req.params.id } })
    if (targetMembership.role === 'admin' && community?.creatorId === userId) {
      return res.status(400).json({ message: 'Cannot ban the community owner' })
    }

    await prisma.communityMember.delete({ where: { id: targetMembership.id } })
    await prisma.community.update({
      where: { id: req.params.id },
      data: { memberCount: { decrement: 1 } }
    })

    await prisma.notification.create({
      data: {
        type: 'mod_action',
        content: `You have been removed from ${community?.name || 'the community'}`,
        link: '/',
        userId
      }
    })

    res.json({ message: 'User banned from community' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/communities/:id/members
router.get('/:id/members', async (req: any, res: any) => {
  try {
    const members = await prisma.communityMember.findMany({
      where: { communityId: req.params.id },
      include: { user: { select: { id: true, username: true, avatarUrl: true, karma: true } } },
      orderBy: [
        { role: 'asc' },
        { joinedAt: 'asc' }
      ]
    })
    res.json(members)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
