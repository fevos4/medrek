import type { Community, Post, PostDetail, Comment, CommunityDetail, UserProfile, Report, BannedUser } from '../types'

export const communities: Community[] = [
  { id: 'c1', name: 'Politics', nameAm: 'ፖለቲካ', icon: '🏛', iconBg: '#F2E0C8', memberCount: 15400, isJoined: true },
  { id: 'c2', name: 'Sports', nameAm: 'ስፖርት', icon: '⚽', iconBg: '#EAF4E0', memberCount: 12100, isJoined: false },
  { id: 'c3', name: 'Tech Ethiopia', nameAm: 'ቴክኖሎጂ', icon: '💻', iconBg: '#EDE9FE', memberCount: 8900, isJoined: true },
  { id: 'c4', name: 'Food & Culture', nameAm: 'ምግብና ባህል', icon: '🍛', iconBg: '#FEE2E2', memberCount: 11200, isJoined: false },
  { id: 'c5', name: 'Education', nameAm: 'ትምህርት', icon: '📚', iconBg: '#E0F2FE', memberCount: 9500, isJoined: true },
]

export const mockPosts: Post[] = [
  {
    id: 'p1',
    title: "Ethiopia's first satellite internet provider is now available in 12 cities",
    titleAm: "የኢትዮጵያ የሳተላይት ኢንተርኔት አቅራቢ በ12 ከተሞች ይገኛል",
    author: "Dawit_T",
    communityId: 'c3',
    communityName: "Tech Ethiopia",
    communityNameAm: "ቴክኖሎጂ",
    score: 2400,
    commentCount: 284,
    timeAgo: "3 hrs ago",
    isAnonymous: false,
    isSensitive: false,
    userVote: 1
  },
  {
    id: 'p2',
    title: "The new land reform proposal and what it means for small farmers in Oromia",
    titleAm: "አዲሱ የመሬት ማሻሻያ ሐሳብ ለኦሮሚያ ትናንሽ አርሶ አደሮች ምን ይሆናል",
    author: "Anonymous",
    communityId: 'c1',
    communityName: "Politics",
    communityNameAm: "ፖለቲካ",
    score: 891,
    commentCount: 512,
    timeAgo: "1 hr ago",
    isAnonymous: true,
  isSensitive: false,
    userVote: 0
  },
  {
    id: 'p3',
    title: "My grandmother's injera recipe — the one she's been making in Gondar for 60 years",
    titleAm: "የአያቴ ኢንጀራ ምግብ ዓሰራር — በጎንደር ለ60 ዓመት ሲሰሩ የቆየ",
    author: "Selam_H",
    communityId: 'c4',
    communityName: "Food & Culture",
    communityNameAm: "ምግብና ባህል",
    score: 347,
    commentCount: 156,
    timeAgo: "5 hrs ago",
    isAnonymous: false,
    isSensitive: false,
    userVote: 0
  },
  {
    id: 'p4',
    title: "Addis Ababa University opens applications for free online engineering courses",
    titleAm: "አዲስ አበባ ዩኒቨርሲቲ ለነፃ የምህንድስና ኮርሶች ምዝገባ ከፈተ",
    author: "Biruk_A",
    communityId: 'c5',
    communityName: "Education",
    communityNameAm: "ትምህርት",
    score: 219,
    commentCount: 88,
    timeAgo: "8 hrs ago",
    isAnonymous: false,
    isSensitive: false,
    userVote: 0
  }
]

export const postDetailComments: Comment[] = [
  {
    id: 'cm1',
    author: 'Tigist_M',
    content: "This is amazing news! Finally proper internet in Gondar. My family will be so happy.",
    contentAm: "ይህ አስደናቂ ዜና ነው! በጎንደር በመጨረሻ ትክክለኛ ኢንተርኔት።",
    score: 142,
    userVote: 0,
    timeAgo: '2 hrs ago',
    isAnonymous: false,
    isRemoved: false,
    replies: [
      {
        id: 'cm1r1',
        author: 'Dawit_T',
        content: "Same! My parents are in Bahir Dar, this changes everything for video calls.",
        contentAm: "ወላጆቼ ባህር ዳር ናቸው፣ ይህ ሁሉን ይቀይረዋል።",
        score: 67,
        userVote: 0,
        timeAgo: '1 hr ago',
        isAnonymous: false,
        isRemoved: false,
        replies: []
      },
      {
        id: 'cm1r2',
        author: 'Hana_B',
        content: "500 ETB per month is still expensive for most families though.",
        contentAm: "500 ብር በወር አሁንም ለብዙ ቤተሰቦች ውድ ነው።",
        score: 88,
        userVote: 0,
        timeAgo: '45 min ago',
        isAnonymous: false,
        isRemoved: false,
        replies: []
      }
    ]
  },
  {
    id: 'cm2',
    author: 'Samuel_G',
    content: "Does anyone know if this works during the rainy season? Satellite signals can drop.",
    contentAm: "በዝናብ ወቅት ይሰራ እንደሆን ማንም ያውቃል?",
    score: 54,
    userVote: 0,
    timeAgo: '1 hr ago',
    isAnonymous: false,
    isRemoved: false,
    replies: [
      {
        id: 'cm2r1',
        author: 'Yonas_K',
        content: "Good point. Starlink has the same issue during heavy rain. We will have to wait and see.",
        contentAm: "ጥሩ ነጥብ። ስታርሊንክም ተመሳሳይ ችግር አለው።",
        score: 31,
        userVote: 0,
        timeAgo: '30 min ago',
        isAnonymous: false,
        isRemoved: false,
        replies: []
      }
    ]
  },
  {
    id: 'cm3',
    author: 'Anonymous',
    content: "The pricing model is not sustainable. This will only benefit urban elites.",
    contentAm: "የዋጋ አወጣጡ ዘላቂ አይደለም። ለከተሜ ልሂቃን ብቻ ይጠቅማል።",
    score: 23,
    userVote: 0,
    timeAgo: '20 min ago',
    isAnonymous: true,
    isRemoved: false,
    replies: []
  }
]

export const postDetail: PostDetail = {
  id: 'p1',
  title: "Ethiopia's first satellite internet provider is now available in 12 cities",
  titleAm: "የኢትዮጵያ የሳተላይት ኢንተርኔት አቅራቢ በ12 ከተሞች ይገኛል",
  author: 'Dawit_T',
  communityId: 'c3',
  communityName: 'Tech Ethiopia',
  communityNameAm: 'ቴክኖሎጂ',
  score: 2400,
  commentCount: 284,
  timeAgo: '3 hrs ago',
  isAnonymous: false,
  isSensitive: false,
  userVote: 1,
  content: "Ethio Telecom has announced the availability of its new satellite internet service in 12 major Ethiopian cities including Addis Ababa, Dire Dawa, Mekelle, Gondar, Bahir Dar, Hawassa, Adama, Jimma, Dessie, Shashamane, Arba Minch, and Nekemte. The service promises speeds of up to 100 Mbps with no land infrastructure required. Pricing starts at 500 ETB per month.",
  contentAm: "ኢትዮ ቴሌኮም በ12 ዋና ዋና የኢትዮጵያ ከተሞች አዲስ የሳተላይት ኢንተርኔት አገልግሎቱን ማቅረቡን አስታወቀ።"
}

export const communityDetail: CommunityDetail = {
  id: 'c3',
  name: 'Tech Ethiopia',
  nameAm: 'ቴክኖሎጂ',
  icon: '💻',
  iconBg: '#EDE9FE',
  bannerColor: '#1A0F00',
  memberCount: 12400,
  isJoined: false,
  isSensitive: true,
  type: 'public',
  description: 'A community for Ethiopian tech enthusiasts, developers, startups, and anyone passionate about technology in Ethiopia.',
  descriptionAm: 'ለኢትዮጵያ የቴክኖሎጂ አፍቃሪዎች፣ ገንቢዎች፣ እና ስታርትአፕ ባለቤቶች ማህበረሰብ።',
  createdAt: 'March 2024',
  moderators: ['Dawit_T', 'Tigist_M', 'Yonas_K'],
  rules: [
    { id: 'r1', number: 1, text: 'Post only tech-related content', textAm: 'የቴክኖሎጂ ይዘት ብቻ ይለጥፉ' },
    { id: 'r2', number: 2, text: 'No spam or self-promotion without context', textAm: 'ያለ አውድ ማስታወቂያ አይፈቀድም' },
    { id: 'r3', number: 3, text: 'Be respectful and constructive', textAm: 'አክባሪ እና ገንቢ ይሁኑ' },
    { id: 'r4', number: 4, text: 'Share sources for all claims', textAm: 'ለሁሉም 주장 ምንጭ ያቅርቡ' }
  ]
}

export const userProfile: UserProfile = {
  id: 'dawit-t',
  username: 'Dawit_T',
  initials: 'DT',
  avatarColor: '#E4C49A',
  bio: 'Software developer based in Addis Ababa. Passionate about Ethiopian tech and open source.',
  bioAm: 'በአዲስ አበባ የሚኖር የሶፍትዌር ገንቢ። ስለ ኢትዮጵያ ቴክ እና ክፍት ምንጭ ፍቅር አለኝ።',
  karma: 2847,
  postCount: 34,
  commentCount: 156,
  joinedDate: 'March 2024',
  isCurrentUser: false
}

export const userPosts: Post[] = mockPosts.filter(p => p.author === 'Dawit_T')

export const userComments: Comment[] = [
  {
    id: 'cm1r1',
    author: 'Dawit_T',
    content: "Same! My parents are in Bahir Dar, this changes everything for video calls.",
    contentAm: "ወላጆቼ ባህር ዳር ናቸው፣ ይህ ሁሉን ይቀይረዋል።",
    score: 67,
    userVote: 0,
    timeAgo: '1 hr ago',
    isAnonymous: false,
    isRemoved: false,
    replies: []
  }
]

export const modReports: Report[] = [
  {
    id: 'r1',
    reporterId: 'user1',
    reporterName: 'Tigist_M',
    targetId: 'post2',
    targetType: 'post',
    targetContent: "The new land reform proposal and what it means for small farmers in Oromia",
    targetAuthor: 'Anonymous',
    reason: 'ethnic_hate',
    detail: 'This post seems to be inciting ethnic tension',
    status: 'pending',
    communityName: 'Politics',
    createdAt: '2 hrs ago'
  },
  {
    id: 'r2',
    reporterId: 'user2',
    reporterName: 'Samuel_G',
    targetId: 'comment3',
    targetType: 'comment',
    targetContent: 'The pricing model is not sustainable. This will only benefit urban elites.',
    targetAuthor: 'Anonymous',
    reason: 'harassment',
    detail: '',
    status: 'pending',
    communityName: 'Tech Ethiopia',
    createdAt: '5 hrs ago'
  },
  {
    id: 'r3',
    reporterId: 'user3',
    reporterName: 'Hana_B',
    targetId: 'post1',
    targetType: 'post',
    targetContent: "Ethiopia's first satellite internet provider is now available in 12 cities",
    targetAuthor: 'Dawit_T',
    reason: 'misinformation',
    detail: 'Source not verified',
    status: 'resolved',
    communityName: 'Tech Ethiopia',
    createdAt: '1 day ago'
  }
]

export const bannedUsers: BannedUser[] = [
  {
    id: 'b1',
    username: 'SpamUser123',
    reason: 'Repeated spam and self-promotion',
    bannedAt: '3 days ago',
    bannedBy: 'Dawit_T'
  }
]