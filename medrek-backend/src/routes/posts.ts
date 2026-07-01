const express = require('express')
const { prisma } = require('../lib/prisma')
const { protect, optionalAuth } = require('../middleware/auth')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (_req: any, _file: any, cb: any) => {
    cb(null, path.join(__dirname, '../../uploads'))
  },
  filename: (_req: any, file: any, cb: any) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`)
  }
})
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req: any, file: any, cb: any) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp)$/i
    cb(null, allowed.test(path.extname(file.originalname)))
  }
})

const router = express.Router()

function buildTree(comments: any[], parentId: string | null = null): any[] {
  return comments
    .filter((c: any) => c.parentId === parentId)
    .map((c: any) => ({
      ...c,
      author: c.isAnonymous ? null : c.author,
      authorName: c.isAnonymous ? 'Anonymous' : c.author?.username,
      replies: buildTree(comments, c.id)
    }))
}

// GET /api/posts — public; shows all posts from public communities
router.get('/', optionalAuth, async (req: any, res: any) => {
  try {
    const sort = req.query.sort || 'hot'
    const page = parseInt(req.query.page) || 1
    const communityId = req.query.community
    const search = req.query.search

    let where: any = { isRemoved: false }

    if (communityId && communityId !== 'all') {
      where.communityId = communityId
    } else {
      where.community = { type: 'public' }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { titleAm: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { contentAm: { contains: search, mode: 'insensitive' } },
        { author: { username: { contains: search, mode: 'insensitive' } } },
        { community: { name: { contains: search, mode: 'insensitive' } } }
      ]
    }

    const orderBy: any =
      sort === 'new' ? { createdAt: 'desc' } :
      sort === 'top' ? { score: 'desc' } :
      sort === 'rising' ? [{ commentCount: 'desc' }, { createdAt: 'desc' }] :
      [{ score: 'desc' }, { createdAt: 'desc' }]

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        community: { select: { id: true, name: true, nameAm: true, type: true } }
      },
      orderBy,
      skip: (page - 1) * 20,
      take: 20
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

    res.json({
      posts: mapped,
      total: mapped.length,
      page,
      hasMore: mapped.length === 20
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/posts/:id
router.get('/:id', optionalAuth, async (req: any, res: any) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        community: { select: { id: true, name: true, nameAm: true } },
        _count: { select: { comments: true } }
      }
    })
    if (!post || post.isRemoved) {
      return res.status(404).json({ message: 'Post not found' })
    }
    let userVote = 0
    if (req.user) {
      const vote = await prisma.vote.findUnique({
        where: { userId_targetId_targetType: { userId: req.user.id, targetId: req.params.id, targetType: 'post' } }
      })
      if (vote) userVote = vote.value
    }
    res.json({
      ...post,
      author: post.isAnonymous ? null : post.author,
      authorName: post.isAnonymous ? 'Anonymous' : post.author?.username,
      userVote
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/posts
router.post('/', protect, upload.single('image'), async (req: any, res: any) => {
  try {
    const { title, titleAm, content, contentAm, communityId, type, url, isAnonymous, imageUrl: bodyImageUrl } = req.body
    const imageUrl = bodyImageUrl || (req.file ? `/uploads/${req.file.filename}` : null)

    if (!title || title.length < 3 || title.length > 300) {
      return res.status(400).json({ message: 'Title is required, min 3, max 300 chars' })
    }
    if (!communityId) {
      return res.status(400).json({ message: 'Community ID is required' })
    }
    if (type && !['text', 'link', 'image'].includes(type)) {
      return res.status(400).json({ message: 'Type must be text, link, or image' })
    }
    if (type === 'link' && !url) {
      return res.status(400).json({ message: 'URL is required for link posts' })
    }
    if (type === 'image' && !imageUrl) {
      return res.status(400).json({ message: 'Image is required for image posts' })
    }

    const membership = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId: req.user.id, communityId } }
    })
    if (!membership) {
      return res.status(403).json({ message: 'You must be a member of this community' })
    }

    const post = await prisma.post.create({
      data: {
        title,
        titleAm: titleAm || null,
        content: content || null,
        contentAm: contentAm || null,
        type: type || 'text',
        url: url || null,
        imageUrl,
        isAnonymous: isAnonymous || false,
        authorId: req.user.id,
        communityId
      },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        community: { select: { id: true, name: true, nameAm: true } }
      }
    })

    res.status(201).json(post)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE /api/posts/:id
router.delete('/:id', protect, async (req: any, res: any) => {
  try {
    const post = await prisma.post.findUnique({ where: { id: req.params.id } })
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const isAuthor = post.authorId === req.user.id
    let isMod = false
    if (!isAuthor) {
      const membership = await prisma.communityMember.findUnique({
        where: { userId_communityId: { userId: req.user.id, communityId: post.communityId } }
      })
      isMod = membership && (membership.role === 'moderator' || membership.role === 'admin')
    }

    if (!isAuthor && !isMod) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    await prisma.post.update({
      where: { id: req.params.id },
      data: { isRemoved: true }
    })

    res.json({ message: 'Post removed' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// PATCH /api/posts/:id/remove (mod action)
router.patch('/:id/remove', protect, async (req: any, res: any) => {
  try {
    const post = await prisma.post.findUnique({ where: { id: req.params.id } })
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

    await prisma.post.update({
      where: { id: req.params.id },
      data: { isRemoved: true }
    })

    const author = await prisma.user.findUnique({ where: { id: post.authorId } })
    if (author) {
      await prisma.notification.create({
        data: {
          type: 'mod_action',
          content: 'Your post was removed by a moderator',
          link: '/community/' + post.communityId,
          userId: post.authorId
        }
      })
    }

    res.json({ message: 'Post removed' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/posts/:id/comments
router.get('/:id/comments', optionalAuth, async (req: any, res: any) => {
  try {
    const post = await prisma.post.findUnique({ where: { id: req.params.id }, select: { id: true } })
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const comments = await prisma.comment.findMany({
      where: { postId: req.params.id, isRemoved: false },
      include: { author: { select: { id: true, username: true, avatarUrl: true } } },
      orderBy: { score: 'desc' }
    })

    let userVotes: Record<string, number> = {}
    if (req.user) {
      const commentIds = comments.map((c: any) => c.id)
      const votes = await prisma.vote.findMany({
        where: { userId: req.user.id, targetId: { in: commentIds }, targetType: 'comment' }
      })
      votes.forEach((v: any) => { userVotes[v.targetId] = v.value })
    }

    function injectVotes(comments: any[]): any[] {
      return comments.map((c: any) => ({
        ...c,
        userVote: userVotes[c.id] || 0,
        replies: injectVotes(c.replies || [])
      }))
    }

    const tree = buildTree(comments)
    res.json(injectVotes(tree))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/posts/:id/comments
router.post('/:id/comments', protect, async (req: any, res: any) => {
  try {
    const { content, contentAm, parentId, isAnonymous } = req.body

    if (!content || content.length < 1) {
      return res.status(400).json({ message: 'Content is required' })
    }

    const post = await prisma.post.findUnique({ where: { id: req.params.id } })
    if (!post || post.isRemoved) {
      return res.status(404).json({ message: 'Post not found' })
    }

    if (parentId) {
      const parentComment = await prisma.comment.findUnique({ where: { id: parentId } })
      if (!parentComment || parentComment.postId !== req.params.id) {
        return res.status(400).json({ message: 'Parent comment not found' })
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        contentAm: contentAm || null,
        isAnonymous: isAnonymous || false,
        authorId: req.user.id,
        postId: req.params.id,
        parentId: parentId || null
      },
      include: { author: { select: { id: true, username: true, avatarUrl: true } } }
    })

    await prisma.post.update({
      where: { id: req.params.id },
      data: { commentCount: { increment: 1 } }
    })

    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    const username = user?.username || 'Someone'

    if (parentId) {
      const parentComment = await prisma.comment.findUnique({ where: { id: parentId } })
      if (parentComment && parentComment.authorId !== req.user.id) {
        const parentAuthor = await prisma.user.findUnique({ where: { id: parentComment.authorId } })
        if (parentAuthor && !parentComment.isAnonymous) {
          await prisma.notification.create({
            data: {
              type: 'reply_comment',
              content: `${username} replied to your comment`,
              link: `/post/${req.params.id}`,
              userId: parentComment.authorId
            }
          })
        }
      }
    } else {
      if (post.authorId !== req.user.id) {
        const postAuthor = await prisma.user.findUnique({ where: { id: post.authorId } })
        if (postAuthor && !post.isAnonymous) {
          await prisma.notification.create({
            data: {
              type: 'reply_post',
              content: `${username} commented on your post`,
              link: `/post/${req.params.id}`,
              userId: post.authorId
            }
          })
        }
      }
    }

    res.status(201).json(comment)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
