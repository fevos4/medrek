export interface Post {
  id: string
  title: string
  titleAm: string
  author: string
  authorId?: string
  communityId: string
  communityName: string
  communityNameAm: string
  score: number
  commentCount: number
  timeAgo: string
  isAnonymous: boolean
  isSensitive: boolean
  userVote: 1 | -1 | 0
  imageUrl?: string
  type?: PostType
}

export interface PostDetail extends Post {
  content: string
  contentAm: string
}

export type PostType = 'text' | 'image' | 'link'

export interface CreatePostForm {
  title: string
  titleAm: string
  content: string
  contentAm: string
  communityId: string
  type: PostType
  url: string
  isAnonymous: boolean
}
