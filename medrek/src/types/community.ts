export interface Community {
  id: string
  name: string
  nameAm: string
  icon: string
  iconBg: string
  memberCount: number
  isJoined: boolean
  isMuted?: boolean
}

export interface CommunityRule {
  id: string
  number: number
  text: string
  textAm: string
}

export interface CommunityDetail extends Community {
  bannerColor: string
  description: string
  descriptionAm: string
  rules: CommunityRule[]
  moderators: string[]
  createdAt: string
  type: 'public' | 'private' | 'restricted'
  isSensitive: boolean
  userRole?: 'admin' | 'moderator' | 'member' | null
  creatorId?: string
}

export interface CreateCommunityForm {
  name: string
  nameAm: string
  description: string
  descriptionAm: string
  type: 'public' | 'private' | 'restricted'
  isSensitive: boolean
  icon: string
  rules: string[]
}
