export type ReportReason = 'ethnic_hate' | 'religious_disrespect' | 'misinformation' | 'harassment' | 'spam' | 'other'

export interface ReportForm {
  reasons: ReportReason[]
  detail: string
}

export interface Report {
  id: string
  reporterId: string
  reporterName: string
  targetId: string
  targetType: 'post' | 'comment'
  targetContent: string
  targetAuthor: string
  reason: ReportReason
  detail: string
  status: 'pending' | 'resolved' | 'dismissed'
  communityName: string
  createdAt: string
}

export interface BannedUser {
  id: string
  username: string
  reason: string
  bannedAt: string
  bannedBy: string
}

export type ModTab = 'reports' | 'removed' | 'banned'
