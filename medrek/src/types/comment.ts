export interface Comment {
  id: string
  content: string
  contentAm: string
  author: string
  score: number
  userVote: 1 | -1 | 0
  timeAgo: string
  isAnonymous: boolean
  isRemoved: boolean
  replies: Comment[]
  postTitle?: string
  postTitleAm?: string
  communityId?: string
  communityName?: string
  communityNameAm?: string
}
