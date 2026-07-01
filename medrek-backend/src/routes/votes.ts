const express = require('express')
const { prisma } = require('../lib/prisma')
const { protect } = require('../middleware/auth')

const router = express.Router()

// POST /api/votes
router.post('/', protect, async (req: any, res: any) => {
  try {
    const { targetId, targetType, value } = req.body

    if (!['post', 'comment'].includes(targetType)) {
      return res.status(400).json({ message: 'targetType must be post or comment' })
    }
    if (![1, -1, 0].includes(value)) {
      return res.status(400).json({ message: 'value must be 1, -1, or 0' })
    }

    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_targetId_targetType: {
          userId: req.user.id,
          targetId,
          targetType
        }
      }
    })

    let scoreDiff = 0

    if (value === 0 && existingVote) {
      scoreDiff = -existingVote.value
      await prisma.vote.delete({ where: { id: existingVote.id } })
    } else if (existingVote) {
      scoreDiff = value - existingVote.value
      await prisma.vote.update({
        where: { id: existingVote.id },
        data: { value }
      })
    } else if (value !== 0) {
      scoreDiff = value
      const voteData: any = {
        value,
        userId: req.user.id,
        targetId,
        targetType
      }
      if (targetType === 'post') voteData.postId = targetId
      if (targetType === 'comment') voteData.commentId = targetId
      await prisma.vote.create({ data: voteData })
    }

    if (scoreDiff !== 0) {
      if (targetType === 'post') {
        const post = await prisma.post.update({
          where: { id: targetId },
          data: { score: { increment: scoreDiff } }
        })
        await prisma.user.update({
          where: { id: post.authorId },
          data: { karma: { increment: scoreDiff } }
        })
        if (value === 1 && post.authorId !== req.user.id) {
          await prisma.notification.create({
            data: {
              type: 'upvote',
              content: `${req.user.username} upvoted your post`,
              link: '/post/' + targetId,
              userId: post.authorId
            }
          })
        }
        return res.json({ message: 'Vote recorded', score: post.score })
      }
      if (targetType === 'comment') {
        const comment = await prisma.comment.update({
          where: { id: targetId },
          data: { score: { increment: scoreDiff } }
        })
        await prisma.user.update({
          where: { id: comment.authorId },
          data: { karma: { increment: scoreDiff } }
        })
        if (value === 1 && comment.authorId !== req.user.id) {
          await prisma.notification.create({
            data: {
              type: 'upvote',
              content: `${req.user.username} upvoted your comment`,
              link: '/post/' + targetId,
              userId: comment.authorId
            }
          })
        }
        return res.json({ message: 'Vote recorded', score: comment.score })
      }
    }

    res.json({ message: 'Vote recorded', score: 0 })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
