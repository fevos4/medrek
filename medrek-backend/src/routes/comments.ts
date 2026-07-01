const express = require('express')
const { prisma } = require('../lib/prisma')
const { protect } = require('../middleware/auth')

const router = express.Router()

// DELETE /api/comments/:id
router.delete('/:id', protect, async (req: any, res: any) => {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: req.params.id } })
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }
    if (comment.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    await prisma.comment.update({
      where: { id: req.params.id },
      data: { isRemoved: true, content: '[removed]', contentAm: '[removed]' }
    })

    res.json({ message: 'Comment removed' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// PATCH /api/comments/:id
router.patch('/:id', protect, async (req: any, res: any) => {
  try {
    const { content, contentAm } = req.body
    const comment = await prisma.comment.findUnique({ where: { id: req.params.id } })
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }
    if (comment.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const updated = await prisma.comment.update({
      where: { id: req.params.id },
      data: { content, contentAm: contentAm || null },
      include: { author: { select: { id: true, username: true, avatarUrl: true } } }
    })

    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// PATCH /api/comments/:id/remove (mod action)
router.patch('/:id/remove', protect, async (req: any, res: any) => {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: req.params.id } })
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    const post = await prisma.post.findUnique({ where: { id: comment.postId } })
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const membership = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId: req.user.id, communityId: post.communityId } }
    })
    const isMod = membership && (membership.role === 'moderator' || membership.role === 'admin')
    if (!isMod) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    await prisma.comment.update({
      where: { id: req.params.id },
      data: { isRemoved: true, content: '[removed by moderator]' }
    })

    res.json({ message: 'Comment removed' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
