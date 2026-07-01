const express = require('express')
const { prisma } = require('../lib/prisma')
const { protect } = require('../middleware/auth')

const router = express.Router()

// GET /api/notifications
router.get('/', protect, async (req: any, res: any) => {
  try {
    const { unreadOnly } = req.query

    const where: any = { userId: req.user.id }
    if (unreadOnly === 'true') where.isRead = false

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 50
      }),
      prisma.notification.count({
        where: { userId: req.user.id, isRead: false }
      })
    ])

    res.json({ notifications, unreadCount })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// PATCH /api/notifications/:id/read
router.patch('/:id/read', protect, async (req: any, res: any) => {
  try {
    const notification = await prisma.notification.findUnique({ where: { id: req.params.id } })
    if (!notification || notification.userId !== req.user.id) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true }
    })

    res.json({ message: 'Marked as read' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// PATCH /api/notifications/read-all
router.patch('/read-all', protect, async (req: any, res: any) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, isRead: false },
      data: { isRead: true }
    })

    res.json({ message: 'All marked as read' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
