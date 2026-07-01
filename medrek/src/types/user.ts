export interface User {
  id: string
  username: string
  avatarUrl?: string
  initials: string
  karma: number
}

export interface UserProfile {
  id: string
  username: string
  initials: string
  avatarColor: string
  bio: string
  bioAm: string
  karma: number
  postCount: number
  commentCount: number
  joinedDate: string
  isCurrentUser: boolean
}

export interface LoginForm {
  emailOrUsername: string
  password: string
  rememberMe: boolean
}

export interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
  agreedToRules: boolean
}
