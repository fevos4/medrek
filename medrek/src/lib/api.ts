export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function getHeaders() {
  const token = localStorage.getItem('medrek_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

async function handleResponse(res: Response) {
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong')
  }
  return data
}

function getTimeAgo(createdAt: string): string {
  const now = Date.now()
  const then = new Date(createdAt).getTime()
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`
  return `${Math.floor(diff / 2592000)}mo ago`
}

export function mapPost(post: any) {
  return {
    id: post.id,
    title: post.title,
    titleAm: post.titleAm || '',
    author: post.isAnonymous ? 'Anonymous' : (post.author?.username || 'Unknown'),
    authorId: post.author?.id || post.authorId || '',
    communityId: post.communityId,
    communityName: post.community?.name || '',
    communityNameAm: post.community?.nameAm || '',
    score: post.score,
    commentCount: post.commentCount,
    timeAgo: getTimeAgo(post.createdAt),
    isAnonymous: post.isAnonymous,
    isSensitive: false,
    userVote: (post.userVote || 0) as 1 | -1 | 0,
    imageUrl: post.imageUrl || '',
    videoUrl: post.videoUrl || '',
    type: post.type || 'text'
  }
}

export function mapPostDetail(post: any) {
  return {
    ...mapPost(post),
    content: post.content || '',
    contentAm: post.contentAm || ''
  }
}

export function mapComment(comment: any): any {
  return {
    id: comment.id,
    content: comment.isRemoved ? '[removed]' : comment.content,
    contentAm: comment.isRemoved ? '[removed]' : (comment.contentAm || ''),
    author: comment.isAnonymous ? 'Anonymous' : (comment.author?.username || 'Unknown'),
    score: comment.score,
    userVote: (comment.userVote || 0) as 1 | -1 | 0,
    timeAgo: getTimeAgo(comment.createdAt),
    isAnonymous: comment.isAnonymous,
    isRemoved: comment.isRemoved,
    replies: (comment.replies || []).map(mapComment)
  }
}

export function mapCommunity(community: any) {
  const iconLetter = community.name?.charAt(0).toUpperCase() || '?'
  const iconColors = ['#E4C49A', '#C9904F', '#A8692A', '#8B6914', '#C49A6E', '#D4A574', '#B8865A']
  const colorIndex = community.name?.length % iconColors.length || 0
  return {
    id: community.id,
    name: community.name,
    nameAm: community.nameAm || '',
    icon: iconLetter,
    iconBg: iconColors[colorIndex],
    memberCount: community._count?.members || community.memberCount || 0,
    isJoined: community.isJoined || false,
    isMuted: community.isMuted || false,
    iconUrl: community.iconUrl || '',
    bannerUrl: community.bannerUrl || '',
    emoji: community.emoji || '',
  }
}

export function mapCommunityDetail(community: any) {
  const bannerColors = ['#2E1A00', '#4A2C00', '#1A0F00', '#3D2B1F', '#5C3D2E', '#2B1D14', '#6B3F00']
  const colorIndex = community.name?.length % bannerColors.length || 0
  const currentUserId = (() => { try { const t = localStorage.getItem('medrek_token'); if (t) { const p = JSON.parse(atob(t.split('.')[1])); return p.id; } } catch {} return null })()
  return {
    id: community.id,
    name: community.name,
    nameAm: community.nameAm || '',
    icon: community.name?.charAt(0).toUpperCase() || '?',
    iconBg: '#E4C49A',
    bannerColor: bannerColors[colorIndex],
    description: community.description || '',
    descriptionAm: community.descriptionAm || '',
    memberCount: community.memberCount || 0,
    isJoined: community.isJoined || false,
    userRole: community.userRole || null,
    creatorId: community.creatorId || community.creator?.id || null,
    isSensitive: community.isSensitive || false,
    createdAt: new Date(community.createdAt).toLocaleDateString(),
    type: community.type || 'public',
    isMuted: community.isMuted || false,
    iconUrl: community.iconUrl || '',
    bannerUrl: community.bannerUrl || '',
    emoji: community.emoji || '',
    moderators: [],
    rules: (community.rules || []).map((r: any) => ({
      id: r.id,
      number: r.number,
      text: r.text,
      textAm: r.textAm || ''
    }))
  }
}

// AUTH
export const authAPI = {
  register: async (body: { username: string; email: string; password: string }) => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST', headers: getHeaders(), body: JSON.stringify(body)
    })
    return handleResponse(res)
  },
  login: async (body: { emailOrUsername: string; password: string }) => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST', headers: getHeaders(), body: JSON.stringify(body)
    })
    return handleResponse(res)
  },
  me: async () => {
    const res = await fetch(`${BASE_URL}/api/auth/me`, { headers: getHeaders() })
    return handleResponse(res)
  },
  googleLogin: async (idToken: string) => {
    const res = await fetch(`${BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ idToken })
    })
    return handleResponse(res)
  }
}

// COMMUNITIES
export const communitiesAPI = {
  getAll: async (search?: string) => {
    const url = search
      ? `${BASE_URL}/api/communities?search=${encodeURIComponent(search)}`
      : `${BASE_URL}/api/communities`
    const res = await fetch(url, { headers: getHeaders() })
    return handleResponse(res)
  },
  getOne: async (id: string) => {
    const res = await fetch(`${BASE_URL}/api/communities/${id}`, { headers: getHeaders() })
    return handleResponse(res)
  },
  create: async (body: { name: string; nameAm?: string; description: string; descriptionAm?: string; type: string; isSensitive: boolean; rules: { text: string; textAm?: string }[]; iconUrl?: string; bannerUrl?: string; emoji?: string }) => {
    const res = await fetch(`${BASE_URL}/api/communities`, {
      method: 'POST', headers: getHeaders(), body: JSON.stringify(body)
    })
    return handleResponse(res)
  },
  join: async (id: string) => {
    const res = await fetch(`${BASE_URL}/api/communities/${id}/join`, {
      method: 'POST', headers: getHeaders()
    })
    return handleResponse(res)
  },
  leave: async (id: string) => {
    const res = await fetch(`${BASE_URL}/api/communities/${id}/join`, {
      method: 'DELETE', headers: getHeaders()
    })
    return handleResponse(res)
  },
  getMembers: async (id: string) => {
    const res = await fetch(`${BASE_URL}/api/communities/${id}/members`, { headers: getHeaders() })
    return handleResponse(res)
  },
  getTrending: async () => {
    const res = await fetch(`${BASE_URL}/api/communities/trending`, { headers: getHeaders() })
    return handleResponse(res)
  },
  getMyModerated: async () => {
    const res = await fetch(`${BASE_URL}/api/communities/my-moderated`, { headers: getHeaders() })
    return handleResponse(res)
  },
  toggleMute: async (id: string, isMuted: boolean) => {
    const res = await fetch(`${BASE_URL}/api/communities/${id}/mute`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ isMuted })
    })
    return handleResponse(res)
  },
  update: async (id: string, body: { iconUrl?: string; bannerUrl?: string; emoji?: string; description?: string; descriptionAm?: string; type?: string; isSensitive?: boolean }) => {
    const res = await fetch(`${BASE_URL}/api/communities/${id}`, {
      method: 'PATCH', headers: getHeaders(), body: JSON.stringify(body)
    })
    return handleResponse(res)
  }
}

// POSTS
export const postsAPI = {
  getFeed: async (sort = 'hot', page = 1) => {
    const res = await fetch(`${BASE_URL}/api/posts?sort=${sort}&page=${page}`, { headers: getHeaders() })
    return handleResponse(res)
  },
  getCommunityPosts: async (communityId: string, sort = 'hot', search?: string) => {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : ''
    const res = await fetch(`${BASE_URL}/api/posts?community=${communityId}&sort=${sort}${searchParam}`, { headers: getHeaders() })
    return handleResponse(res)
  },
  getOne: async (id: string) => {
    const res = await fetch(`${BASE_URL}/api/posts/${id}`, { headers: getHeaders() })
    return handleResponse(res)
  },
  create: async (body: { title: string; titleAm?: string; content?: string; contentAm?: string; communityId: string; type: string; url?: string; imageUrl?: string; isAnonymous: boolean }) => {
    const res = await fetch(`${BASE_URL}/api/posts`, {
      method: 'POST', headers: getHeaders(), body: JSON.stringify(body)
    })
    return handleResponse(res)
  },
  delete: async (id: string) => {
    const res = await fetch(`${BASE_URL}/api/posts/${id}`, {
      method: 'DELETE', headers: getHeaders()
    })
    return handleResponse(res)
  },
  getComments: async (postId: string) => {
    const res = await fetch(`${BASE_URL}/api/posts/${postId}/comments`, { headers: getHeaders() })
    return handleResponse(res)
  },
  addComment: async (postId: string, body: { content: string; contentAm?: string; parentId?: string; isAnonymous: boolean }) => {
    const res = await fetch(`${BASE_URL}/api/posts/${postId}/comments`, {
      method: 'POST', headers: getHeaders(), body: JSON.stringify(body)
    })
    return handleResponse(res)
  }
}

// VOTES
export const votesAPI = {
  vote: async (body: { targetId: string; targetType: 'post' | 'comment'; value: 1 | -1 | 0 }) => {
    const res = await fetch(`${BASE_URL}/api/votes`, {
      method: 'POST', headers: getHeaders(), body: JSON.stringify(body)
    })
    return handleResponse(res)
  }
}

// REPORTS
export const reportsAPI = {
  submit: async (body: { targetId: string; targetType: 'post' | 'comment'; reason: string; detail?: string }) => {
    const res = await fetch(`${BASE_URL}/api/reports`, {
      method: 'POST', headers: getHeaders(), body: JSON.stringify(body)
    })
    return handleResponse(res)
  },
  getForMod: async (communityId: string, status?: string) => {
    const url = status
      ? `${BASE_URL}/api/reports?communityId=${communityId}&status=${status}`
      : `${BASE_URL}/api/reports?communityId=${communityId}`
    const res = await fetch(url, { headers: getHeaders() })
    return handleResponse(res)
  },
  updateStatus: async (id: string, status: string) => {
    const res = await fetch(`${BASE_URL}/api/reports/${id}`, {
      method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ status })
    })
    return handleResponse(res)
  }
}

// USERS
export function mapProfile(profile: any, isCurrentUser: boolean) {
  const iconColors = ['#E4C49A', '#C9904F', '#A8692A', '#8B6914', '#C49A6E', '#D4A574', '#B8865A']
  const colorIndex = (profile.username?.length || 0) % iconColors.length
  return {
    id: profile.id,
    username: profile.username,
    initials: profile.username?.slice(0, 2).toUpperCase() || '??',
    avatarColor: iconColors[colorIndex],
    avatarUrl: profile.avatarUrl || '',
    bio: profile.bio || '',
    bioAm: '',
    karma: profile.karma || 0,
    postCount: profile._count?.posts || 0,
    commentCount: profile._count?.comments || 0,
    joinedDate: new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
    isCurrentUser
  }
}

export const usersAPI = {
  getProfile: async (username: string) => {
    const res = await fetch(`${BASE_URL}/api/users/${username}`, { headers: getHeaders() })
    return handleResponse(res)
  },
  getPosts: async (username: string) => {
    const res = await fetch(`${BASE_URL}/api/users/${username}/posts`, { headers: getHeaders() })
    return handleResponse(res)
  },
  getComments: async (username: string) => {
    const res = await fetch(`${BASE_URL}/api/users/${username}/comments`, { headers: getHeaders() })
    return handleResponse(res)
  },
  getCommunities: async (username: string) => {
    const res = await fetch(`${BASE_URL}/api/users/${username}/communities`, { headers: getHeaders() })
    return handleResponse(res)
  },
  updateProfile: async (body: { bio?: string; avatarUrl?: string }) => {
    const res = await fetch(`${BASE_URL}/api/users/me`, {
      method: 'PATCH', headers: getHeaders(), body: JSON.stringify(body)
    })
    return handleResponse(res)
  }
}

// UPLOAD
export const uploadAPI = {
  uploadImage: async (file: File) => {
    const token = localStorage.getItem('medrek_token')
    const formData = new FormData()
    formData.append('image', file)
    const res = await fetch(`${BASE_URL}/api/upload/image`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    })
    return handleResponse(res)
  }
}

// STATS
export const statsAPI = {
  getPlatformStats: async () => {
    const res = await fetch(`${BASE_URL}/api/stats`)
    return handleResponse(res)
  }
}

// MOD ACTIONS
export const modAPI = {
  removePost: async (postId: string) => {
    const res = await fetch(`${BASE_URL}/api/posts/${postId}/remove`, {
      method: 'PATCH', headers: getHeaders()
    })
    return handleResponse(res)
  },
  removeComment: async (commentId: string) => {
    const res = await fetch(`${BASE_URL}/api/comments/${commentId}/remove`, {
      method: 'PATCH', headers: getHeaders()
    })
    return handleResponse(res)
  },
  banUser: async (communityId: string, userId: string) => {
    const res = await fetch(`${BASE_URL}/api/communities/${communityId}/ban`, {
      method: 'POST', headers: getHeaders(), body: JSON.stringify({ userId })
    })
    return handleResponse(res)
  },
  promoteUser: async (communityId: string, userId: string, role: string) => {
    const res = await fetch(`${BASE_URL}/api/communities/${communityId}/promote`, {
      method: 'POST', headers: getHeaders(), body: JSON.stringify({ userId, role })
    })
    return handleResponse(res)
  }
}

// NOTIFICATIONS
export const notificationsAPI = {
  getAll: async () => {
    const res = await fetch(`${BASE_URL}/api/notifications`, { headers: getHeaders() })
    return handleResponse(res)
  },
  markRead: async (id: string) => {
    const res = await fetch(`${BASE_URL}/api/notifications/${id}/read`, {
      method: 'PATCH', headers: getHeaders()
    })
    return handleResponse(res)
  },
  markAllRead: async () => {
    const res = await fetch(`${BASE_URL}/api/notifications/read-all`, {
      method: 'PATCH', headers: getHeaders()
    })
    return handleResponse(res)
  }
}
