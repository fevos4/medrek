const express = require('express')
const { prisma } = require('../lib/prisma')
const { protect } = require('../middleware/auth')

const router = express.Router()

// POST /api/reports
router.post('/', protect, async (req: any, res: any) => {
  try {
    const { targetId, targetType, reason, detail } = req.body

    if (!['post', 'comment'].includes(targetType)) {
      return res.status(400).json({ message: 'targetType must be post or comment' })
    }
    const validReasons = ['ethnic_hate', 'religious_disrespect', 'misinformation', 'harassment', 'spam', 'other']
    if (!validReasons.includes(reason)) {
      return res.status(400).json({ message: `Reason must be one of: ${validReasons.join(', ')}` })
    }

    const existing = await prisma.report.findFirst({
      where: { targetId, targetType, reporterId: req.user.id }
    })
    if (existing) {
      return res.status(400).json({ message: 'Already reported' })
    }

    await prisma.report.create({
      data: {
        targetId,
        targetType,
        reason,
        detail: detail || null,
        status: 'pending',
        reporterId: req.user.id
      }
    })

    const reportCount = await prisma.report.count({
      where: { targetId, targetType, status: 'pending' }
    })

    if (reportCount >= 5) {
      if (targetType === 'post') {
        const post = await prisma.post.findUnique({ where: { id: targetId } })
        await prisma.post.update({
          where: { id: targetId },
          data: { isRemoved: true }
        })
        if (post?.authorId) {
          await prisma.notification.create({
            data: {
              type: 'mod_action',
              content: 'Your post was automatically hidden due to multiple reports',
              link: '/post/' + targetId,
              userId: post.authorId
            }
          })
        }
      } else if (targetType === 'comment') {
        await prisma.comment.update({
          where: { id: targetId },
          data: {
            isRemoved: true,
            content: '[automatically removed — reported multiple times]'
          }
        })
      }
    }

    // Notify target creator about the report
    if (targetType === 'post') {
      const post = await prisma.post.findUnique({ where: { id: targetId }, select: { authorId: true, communityId: true } })
      if (post && post.authorId !== req.user.id) {
        await prisma.notification.create({
          data: {
            type: 'report',
            content: 'Your post has been reported',
            link: '/post/' + targetId,
            userId: post.authorId
          }
        })
        // Also notify community moderators/admins
        const mods = await prisma.communityMember.findMany({
          where: { communityId: post.communityId, role: { in: ['moderator', 'admin'] } }
        })
        for (const mod of mods) {
          if (mod.userId !== req.user.id) {
            await prisma.notification.create({
              data: {
                type: 'report',
                content: 'A new report was submitted in your community',
                link: '/mod/dashboard?community=' + post.communityId,
                userId: mod.userId
              }
            })
          }
        }
      }
    }

    res.status(201).json({ message: 'Report submitted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/reports
router.get('/', protect, async (req: any, res: any) => {
  try {
    const { communityId, status } = req.query

    const membership = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId: req.user.id, communityId } }
    })
    if (!membership || (membership.role !== 'moderator' && membership.role !== 'admin')) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const postsInCommunity = await prisma.post.findMany({
      where: { communityId },
      include: {
        community: { select: { name: true } },
        author: { select: { username: true } }
      }
    })
    const postsMap = new Map(postsInCommunity.map((p: any) => [p.id, p]))
    const postIds = postsInCommunity.map((p: any) => p.id)

    const commentsInPost = await prisma.comment.findMany({
      where: { postId: { in: postIds } },
      include: {
        author: { select: { username: true } }
      }
    })
    const commentsMap = new Map(commentsInPost.map((c: any) => [c.id, c]))
    const commentIds = commentsInPost.map((c: any) => c.id)

    const where: any = {
      OR: [
        { targetType: 'post', targetId: { in: postIds } },
        { targetType: 'comment', targetId: { in: commentIds } }
      ]
    }
    if (status) where.status = status

    const reports = await prisma.report.findMany({
      where,
      include: { reporter: { select: { username: true } } },
      orderBy: { createdAt: 'desc' }
    })

    const mappedReports = reports.map((r: any) => {
      let targetContent = ''
      let targetAuthor = 'Unknown'
      let communityName = ''

      if (r.targetType === 'post') {
        const post: any = postsMap.get(r.targetId)
        if (post) {
          targetContent = post.title + (post.content ? ` - ${post.content}` : '')
          targetAuthor = post.isAnonymous ? 'Anonymous' : (post.author?.username || 'Unknown')
          communityName = post.community?.name || ''
        }
      } else if (r.targetType === 'comment') {
        const comment: any = commentsMap.get(r.targetId)
        if (comment) {
          targetContent = comment.content
          targetAuthor = comment.isAnonymous ? 'Anonymous' : (comment.author?.username || 'Unknown')
          const post: any = postsMap.get(comment.postId)
          communityName = post?.community?.name || ''
        }
      }

      return {
        id: r.id,
        reporterId: r.reporterId,
        reporterName: r.reporter?.username || 'Unknown',
        targetId: r.targetId,
        targetType: r.targetType,
        targetContent,
        targetAuthor,
        reason: r.reason,
        detail: r.detail || '',
        status: r.status,
        communityName,
        createdAt: new Date(r.createdAt).toLocaleDateString()
      }
    })

    res.json(mappedReports)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// PATCH /api/reports/:id
router.patch('/:id', protect, async (req: any, res: any) => {
  try {
    const { status } = req.body
    const report = await prisma.report.findUnique({ where: { id: req.params.id } })
    if (!report) {
      return res.status(404).json({ message: 'Report not found' })
    }

    let targetCommunityId: string | null = null
    if (report.targetType === 'post') {
      const post = await prisma.post.findUnique({ where: { id: report.targetId } })
      targetCommunityId = post?.communityId || null
    } else {
      const comment = await prisma.comment.findUnique({ where: { id: report.targetId } })
      if (comment) {
        const post = await prisma.post.findUnique({ where: { id: comment.postId } })
        targetCommunityId = post?.communityId || null
      }
    }

    if (targetCommunityId) {
      const membership = await prisma.communityMember.findUnique({
        where: { userId_communityId: { userId: req.user.id, communityId: targetCommunityId } }
      })
      if (!membership || (membership.role !== 'moderator' && membership.role !== 'admin')) {
        return res.status(403).json({ message: 'Not authorized' })
      }
    }

    const updated = await prisma.report.update({
      where: { id: req.params.id },
      data: { status }
    })

    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/reports/:id/ban
router.post('/:id/ban', protect, async (req: any, res: any) => {
  try {
    const { communityId, userId } = req.body

    const membership = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId: req.user.id, communityId } }
    })
    if (!membership || (membership.role !== 'moderator' && membership.role !== 'admin')) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const targetMembership = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId, communityId } }
    })
    if (targetMembership) {
      await prisma.communityMember.delete({ where: { id: targetMembership.id } })
      await prisma.community.update({
        where: { id: communityId },
        data: { memberCount: { decrement: 1 } }
      })
    }

    await prisma.report.update({
      where: { id: req.params.id },
      data: { status: 'resolved' }
    })

    res.json({ message: 'User banned from community' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
