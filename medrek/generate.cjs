const fs = require('fs');
const path = require('path');

const files = {
  'src/types/index.ts': `export interface User {
  id: string
  username: string
  avatarUrl?: string
  initials: string
  karma: number
}

export interface Community {
  id: string
  name: string
  nameAm: string
  icon: string
  iconBg: string
  memberCount: number
  isJoined: boolean
}

export interface Post {
  id: string
  title: string
  titleAm: string
  author: string
  communityId: string
  communityName: string
  communityNameAm: string
  score: number
  commentCount: number
  timeAgo: string
  isAnonymous: boolean
  isSensitive: boolean
  userVote: 1 | -1 | 0
}

export type SortOption = 'hot' | 'new' | 'top' | 'rising'
export type Language = 'en' | 'am'`,

  'src/data/mockData.ts': `import { Community, Post } from '../types'

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
    isSensitive: true,
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
]`,

  'src/components/ui/Button.tsx': `import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'join';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', fullWidth, className = '', children, ...props }) => {
  let baseClass = 'rounded-md transition-colors';
  
  if (variant === 'primary') {
    baseClass += ' bg-[#4A2C00] text-[#FAF4EC] font-bold px-4 py-2 hover:bg-[#2E1A00]';
  } else if (variant === 'ghost') {
    baseClass += ' border border-[#6B3F00] text-[#C9904F] bg-transparent font-bold px-4 py-2 hover:bg-[#FAF4EC]';
  } else if (variant === 'join') {
    baseClass += ' bg-[#6B3F00] text-[#FAF4EC] text-xs font-bold px-3 py-1';
  }

  if (fullWidth) {
    baseClass += ' w-full';
  }

  return (
    <button className={\`\${baseClass} \${className}\`} {...props}>
      {children}
    </button>
  );
};`,

  'src/components/ui/Badge.tsx': `import React from 'react';
import { Language } from '../../types';

interface BadgeProps {
  type: 'anonymous' | 'sensitive';
  lang: Language;
}

export const Badge: React.FC<BadgeProps> = ({ type, lang }) => {
  if (type === 'anonymous') {
    return (
      <span className="bg-[#F2E9DF] text-[#5C4A32] border border-[#C9904F] text-[10px] font-semibold px-2 py-0.5 rounded">
        {lang === 'en' ? 'Anonymous' : 'ስም-አልባ'}
      </span>
    );
  }
  
  return (
    <span className="bg-[#FEF0E0] text-[#7A3B00] border border-[#E4C49A] text-[10px] font-semibold px-2 py-0.5 rounded">
      {lang === 'en' ? 'Sensitive' : 'ሚስጥራዊ'}
    </span>
  );
};`,

  'src/components/ui/CrossDivider.tsx': `import React from 'react';

export const CrossDivider: React.FC = () => {
  return (
    <div className="flex items-center justify-center my-4 relative h-4">
      <div className="absolute w-full h-[1px] bg-[#C9904F] opacity-35" />
      <div className="relative flex items-center justify-center w-[12px] h-[12px]">
        <div className="absolute w-[12px] h-[2px] bg-[#C9904F] opacity-60" />
        <div className="absolute w-[2px] h-[12px] bg-[#C9904F] opacity-60" />
      </div>
    </div>
  );
};`,

  'src/components/ui/LanguageToggle.tsx': `import React from 'react';
import { Language } from '../../types';

interface LanguageToggleProps {
  lang: Language;
  onToggle: () => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ lang, onToggle }) => {
  return (
    <button 
      onClick={onToggle}
      className="border border-[#4A2C00] text-[#A8692A] text-xs font-semibold px-3 py-1 rounded bg-transparent hover:bg-[#2E1A00] transition-colors cursor-pointer"
    >
      {lang === 'en' ? 'EN / አማ' : 'አማ / EN'}
    </button>
  );
};`,

  'src/components/community/CommunityPill.tsx': `import React from 'react';
import { Language } from '../../types';

interface CommunityPillProps {
  name: string;
  nameAm: string;
  lang: Language;
}

export const CommunityPill: React.FC<CommunityPillProps> = ({ name, nameAm, lang }) => {
  return (
    <span className="bg-[#F2E0C8] text-[#4A2C00] border border-[#E4C49A] text-[10px] font-bold px-2 py-0.5 rounded inline-block">
      {lang === 'en' ? name : nameAm}
    </span>
  );
};`,

  'src/components/community/CommunityItem.tsx': `import React from 'react';
import { Community, Language } from '../../types';

interface CommunityItemProps {
  community: Community;
  lang: Language;
  isActive?: boolean;
  onClick?: () => void;
}

export const CommunityItem: React.FC<CommunityItemProps> = ({ community, lang, isActive, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={\`flex flex-row items-center gap-3 px-3 py-2 cursor-pointer transition-colors rounded-md mx-2 my-1
        \${isActive ? 'bg-[#F2E0C8]' : 'hover:bg-[#F2E0C8]'}\`}
    >
      <div 
        className="w-6 h-6 rounded flex items-center justify-center text-xs"
        style={{ backgroundColor: community.iconBg }}
      >
        {community.icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-[#1A0F00]">{community.name}</span>
        <span className="text-[10px] text-[#9C836A] font-ethiopic">{community.nameAm}</span>
      </div>
    </div>
  );
};`,

  'src/components/post/VoteButton.tsx': `import React from 'react';

interface VoteButtonProps {
  score: number;
  userVote: 1 | -1 | 0;
  onUpvote: () => void;
  onDownvote: () => void;
}

export const VoteButton: React.FC<VoteButtonProps> = ({ score, userVote, onUpvote, onDownvote }) => {
  const formatScore = (s: number) => {
    return s >= 1000 ? (s / 1000).toFixed(1) + 'k' : s.toString();
  };

  const upColor = userVote === 1 ? 'text-[#5A7A2A]' : 'text-[#9C836A]';
  const downColor = userVote === -1 ? 'text-[#C0392B]' : 'text-[#9C836A]';
  const scoreColor = userVote === 1 ? 'text-[#5A7A2A]' : userVote === -1 ? 'text-[#C0392B]' : 'text-[#1A0F00]';

  return (
    <div className="bg-[#FAF4EC] border-r border-[#DDD0BE] w-10 flex-shrink-0 flex flex-col items-center py-2 rounded-l-[9px]">
      <button onClick={(e) => { e.stopPropagation(); onUpvote(); }} className={\`hover:bg-[#E2D9CE] rounded p-1 \${upColor}\`}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4l8 16H4z" />
        </svg>
      </button>
      <span className={\`text-xs font-bold my-1 \${scoreColor}\`}>
        {formatScore(score)}
      </span>
      <button onClick={(e) => { e.stopPropagation(); onDownvote(); }} className={\`hover:bg-[#E2D9CE] rounded p-1 \${downColor}\`}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 20L4 4h16z" />
        </svg>
      </button>
    </div>
  );
};`,

  'src/components/post/PostActions.tsx': `import React from 'react';
import { Language } from '../../types';

interface PostActionsProps {
  commentCount: number;
  lang: Language;
}

export const PostActions: React.FC<PostActionsProps> = ({ commentCount, lang }) => {
  return (
    <div className="flex flex-row gap-2 mt-2">
      <button className="flex flex-row items-center gap-1 text-[#9C836A] text-xs hover:bg-[#FAF4EC] hover:text-[#4A2C00] rounded px-2 py-1 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        <span>{lang === 'en' ? \`\${commentCount} comments\` : \`\${commentCount} አስተያየቶች\`}</span>
      </button>
      <button className="flex flex-row items-center gap-1 text-[#9C836A] text-xs hover:bg-[#FAF4EC] hover:text-[#4A2C00] rounded px-2 py-1 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
        <span>{lang === 'en' ? 'Share' : 'አጋራ'}</span>
      </button>
      <button className="flex flex-row items-center gap-1 text-[#9C836A] text-xs hover:bg-[#FAF4EC] hover:text-[#4A2C00] rounded px-2 py-1 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
        <span>{lang === 'en' ? 'Report' : 'ሪፖርት'}</span>
      </button>
    </div>
  );
};`,

  'src/components/post/PostCard.tsx': `import React from 'react';
import { Post, Language } from '../../types';
import { VoteButton } from './VoteButton';
import { CommunityPill } from '../community/CommunityPill';
import { Badge } from '../ui/Badge';
import { PostActions } from './PostActions';

interface PostCardProps {
  post: Post;
  lang: Language;
  onVote: (postId: string, value: 1 | -1 | 0) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, lang, onVote }) => {
  return (
    <div className="bg-white border border-[#DDD0BE] rounded-[9px] hover:border-[#A8692A] transition-colors cursor-pointer flex flex-row">
      <VoteButton 
        score={post.score} 
        userVote={post.userVote} 
        onUpvote={() => onVote(post.id, 1)} 
        onDownvote={() => onVote(post.id, -1)} 
      />
      <div className="p-[10px] px-[13px] flex-1">
        <div className="flex flex-row items-center flex-wrap gap-2 mb-1">
          <CommunityPill name={post.communityName} nameAm={post.communityNameAm} lang={lang} />
          <span className="text-[#9C836A] text-xs">
            by {post.author} · {post.timeAgo}
          </span>
          {post.isAnonymous && <Badge type="anonymous" lang={lang} />}
          {post.isSensitive && <Badge type="sensitive" lang={lang} />}
        </div>
        <h2 className="text-sm font-semibold text-[#1A0F00]">
          {post.title}
        </h2>
        <h3 className="text-xs text-[#5C4A32] font-normal font-ethiopic mt-0.5">
          {post.titleAm}
        </h3>
        <PostActions commentCount={post.commentCount} lang={lang} />
      </div>
    </div>
  );
};`,

  'src/components/feed/FeedSortBar.tsx': `import React from 'react';
import { SortOption, Language } from '../../types';

interface FeedSortBarProps {
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  lang: Language;
}

export const FeedSortBar: React.FC<FeedSortBarProps> = ({ activeSort, onSortChange, lang }) => {
  const options: { id: SortOption; en: string; am: string; icon: string }[] = [
    { id: 'hot', en: 'Hot', am: 'ሞቃት', icon: '🔥' },
    { id: 'new', en: 'New', am: 'አዲስ', icon: '✨' },
    { id: 'top', en: 'Top', am: 'ምርጥ', icon: '⬆️' },
    { id: 'rising', en: 'Rising', am: 'እያደገ', icon: '📈' },
  ];

  return (
    <div className="bg-white border border-[#DDD0BE] rounded-[9px] p-2 flex items-center gap-1 mb-2">
      {options.map((opt, idx) => (
        <React.Fragment key={opt.id}>
          <button
            onClick={() => onSortChange(opt.id)}
            className={\`text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1 transition-colors \${
              activeSort === opt.id ? 'bg-[#F2E0C8] text-[#4A2C00]' : 'text-[#9C836A] hover:bg-[#FAF4EC]'
            }\`}
          >
            {opt.icon} {lang === 'en' ? opt.en : opt.am}
          </button>
          {idx < options.length - 1 && (
            <div className="w-[0.5px] h-4 bg-[#DDD0BE] mx-1" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};`,

  'src/components/feed/CreatePostBar.tsx': `import React from 'react';
import { Language } from '../../types';

interface CreatePostBarProps {
  userInitials: string;
  lang: Language;
}

export const CreatePostBar: React.FC<CreatePostBarProps> = ({ userInitials, lang }) => {
  const placeholder = lang === 'en' ? 'Share something with Ethiopia...' : 'ከኢትዮጵያ ጋር አጋሩ...';

  return (
    <div className="bg-white border border-[#DDD0BE] rounded-[9px] p-3 flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded-full bg-[#E4C49A] text-[#4A2C00] flex items-center justify-center font-bold text-sm">
        {userInitials}
      </div>
      <input 
        type="text" 
        placeholder={placeholder}
        className="flex-1 bg-[#FAF4EC] border border-[#DDD0BE] rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#A8692A]"
      />
    </div>
  );
};`,

  'src/components/layout/Navbar.tsx': `import React from 'react';
import { Language } from '../../types';
import { LanguageToggle } from '../ui/LanguageToggle';
import { Button } from '../ui/Button';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  onLogin: () => void;
  onSignup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ lang, onToggleLang, onLogin, onSignup }) => {
  return (
    <nav className="bg-[#1A0F00] h-14 px-4 flex items-center gap-4 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#4A2C00] text-[#C9904F] flex items-center justify-center rounded font-bold text-lg">
          M
        </div>
        <div className="flex flex-col">
          <span className="text-[#FAF4EC] font-bold uppercase tracking-wider text-sm leading-tight">MEDREK</span>
          <span className="text-[#A8692A] text-[10px] font-ethiopic leading-tight">መድረክ</span>
        </div>
      </div>
      
      <div className="flex-1 flex justify-center">
        <input 
          type="text" 
          placeholder="Search communities..."
          className="bg-[#2E1A00] border border-[#4A2C00] text-[#FAF4EC] rounded-full px-4 py-1.5 max-w-sm w-full text-sm focus:outline-none focus:border-[#A8692A] placeholder-[#9C836A]"
        />
      </div>

      <div className="flex items-center gap-3">
        <LanguageToggle lang={lang} onToggle={onToggleLang} />
        <Button variant="ghost" onClick={onLogin}>Log in</Button>
        <Button variant="primary" onClick={onSignup}>Sign up</Button>
      </div>
    </nav>
  );
};`,

  'src/components/layout/LeftSidebar.tsx': `import React from 'react';
import { Community, Language } from '../../types';
import { CommunityItem } from '../community/CommunityItem';

interface LeftSidebarProps {
  communities: Community[];
  activeCommunityId: string;
  lang: Language;
  onSelectCommunity: (id: string) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ communities, activeCommunityId, lang, onSelectCommunity }) => {
  return (
    <div className="w-[196px] flex-shrink-0 border-r border-[#DDD0BE] bg-[#FAF4EC] h-full overflow-y-auto py-4">
      <div className="px-5 mb-2">
        <h3 className="text-[9px] font-bold uppercase tracking-widest text-[#9C836A]">
          {lang === 'en' ? 'MY COMMUNITIES' : 'የእኔ ማህበረሰቦች'}
        </h3>
      </div>
      
      <div className="flex flex-col">
        {communities.map(c => (
          <CommunityItem 
            key={c.id} 
            community={c} 
            lang={lang} 
            isActive={c.id === activeCommunityId}
            onClick={() => onSelectCommunity(c.id)}
          />
        ))}
      </div>

      <div className="mx-3 mt-4">
        <button className="w-full border border-dashed border-[#C9904F] rounded-[7px] text-xs font-semibold text-[#6B3F00] text-center py-2 bg-[#FDF8F2] hover:bg-[#F2E0C8] transition-colors cursor-pointer">
          + {lang === 'en' ? 'Create community' : 'ማህበረሰብ ፍጠር'}
        </button>
      </div>
    </div>
  );
};`,

  'src/components/layout/RightSidebar.tsx': `import React from 'react';
import { Language } from '../../types';
import { Button } from '../ui/Button';

interface RightSidebarProps {
  lang: Language;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ lang }) => {
  const trending = [
    { name: 'Business Ethiopia', members: '8,240' },
    { name: 'Diaspora', members: '5,110' },
    { name: 'Health & Wellbeing', members: '3,892' }
  ];

  const rules = [
    { en: 'No ethnic incitement or hate speech', am: 'ጥላቻ ንግግር የለም' },
    { en: 'Respect religious beliefs and practices', am: 'ሃይማኖትን ያክብሩ' },
    { en: 'No misinformation or unverified claims', am: 'የተረጋገጠ መረጃ ብቻ' },
    { en: 'Treat all members with dignity', am: 'ሁሉንም አክብሩ' }
  ];

  return (
    <div className="w-[236px] flex-shrink-0 border-l border-[#DDD0BE] bg-[#FAF4EC] h-full overflow-y-auto p-3">
      <div className="bg-white border border-[#DDD0BE] rounded-[9px] mb-3 overflow-hidden">
        <div className="bg-[#2E1A00] px-3 py-2 flex justify-between items-center">
          <span className="text-xs font-bold text-[#FAF4EC]">Medrek Community</span>
          <span className="text-[10px] text-[#A8692A] font-ethiopic">መድረክ</span>
        </div>
        <div className="p-3">
          <p className="text-xs text-[#5C4A32] mb-3 leading-relaxed">
            {lang === 'en' ? 'The Ethiopian community forum. Speak freely. Respectfully.' : 'የኢትዮጵያ ማህበረሰብ መድረክ። ነፃነት። አክብሮት።'}
          </p>
          <div className="flex gap-2 mb-3">
            <div className="flex-1 bg-[#FAF4EC] rounded-md p-2 text-center">
              <div className="text-xs font-bold text-[#1A0F00]">24.8k</div>
              <div className="text-[10px] text-[#9C836A]">{lang === 'en' ? 'Members' : 'አባላት'}</div>
            </div>
            <div className="flex-1 bg-[#FAF4EC] rounded-md p-2 text-center">
              <div className="text-xs font-bold text-[#1A0F00]">1.2k</div>
              <div className="text-[10px] text-[#9C836A]">{lang === 'en' ? 'Online' : 'መስመር ላይ'}</div>
            </div>
          </div>
          <Button fullWidth variant="primary">+ {lang === 'en' ? 'Create Post' : 'ልጥፍ ፍጠር'}</Button>
        </div>
      </div>

      <div className="bg-white border border-[#DDD0BE] rounded-[9px] mb-3 overflow-hidden">
        <div className="bg-[#2E1A00] px-3 py-2 flex justify-between items-center">
          <span className="text-xs font-bold text-[#FAF4EC]">{lang === 'en' ? 'Platform rules' : 'ደንቦች'}</span>
          <span className="text-[10px] text-[#A8692A] font-ethiopic">ደንቦች</span>
        </div>
        <div className="p-3 flex flex-col gap-3">
          {rules.map((rule, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <span className="w-[17px] h-[17px] flex-shrink-0 bg-[#F2E0C8] text-[#4A2C00] text-[10px] font-bold rounded flex items-center justify-center">
                {idx + 1}
              </span>
              <span className="text-xs text-[#1A0F00]">{lang === 'en' ? rule.en : rule.am}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#DDD0BE] rounded-[9px] mb-3 overflow-hidden">
        <div className="bg-[#2E1A00] px-3 py-2 flex justify-between items-center">
          <span className="text-xs font-bold text-[#FAF4EC]">{lang === 'en' ? 'Trending' : 'ታዋቂ'}</span>
          <span className="text-[10px] text-[#A8692A] font-ethiopic">ታዋቂ</span>
        </div>
        <div className="p-3 flex flex-col">
          {trending.map((t, idx) => (
            <div key={idx} className="flex justify-between items-center py-1.5 border-b border-[#F2E0C8] last:border-0">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#1A0F00]">{t.name}</span>
                <span className="text-[10px] text-[#9C836A]">{t.members} members</span>
              </div>
              <Button variant="join">Join</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};`,

  'src/pages/HomePage.tsx': `import React, { useState } from 'react';
import { Language, SortOption, Post } from '../types';
import { communities, mockPosts } from '../data/mockData';
import { Navbar } from '../components/layout/Navbar';
import { LeftSidebar } from '../components/layout/LeftSidebar';
import { RightSidebar } from '../components/layout/RightSidebar';
import { CreatePostBar } from '../components/feed/CreatePostBar';
import { FeedSortBar } from '../components/feed/FeedSortBar';
import { PostCard } from '../components/post/PostCard';
import { CrossDivider } from '../components/ui/CrossDivider';

export const HomePage: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [activeSort, setActiveSort] = useState<SortOption>('hot');
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [activeCommunityId, setActiveCommunityId] = useState<string>('');

  const handleVote = (postId: string, value: 1 | -1 | 0) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const newValue = p.userVote === value ? 0 : value;
        const scoreDiff = newValue - p.userVote;
        return { ...p, userVote: newValue, score: p.score + scoreDiff };
      }
      return p;
    }));
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-[#F2E9DF] overflow-hidden">
      <Navbar 
        lang={lang} 
        onToggleLang={() => setLang(l => l === 'en' ? 'am' : 'en')}
        onLogin={() => {}}
        onSignup={() => {}}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar 
          communities={communities}
          activeCommunityId={activeCommunityId}
          onSelectCommunity={setActiveCommunityId}
          lang={lang}
        />
        
        <main className="flex-1 overflow-y-auto p-3 flex justify-center">
          <div className="w-full max-w-[640px]">
            <CreatePostBar userInitials="FV" lang={lang} />
            <FeedSortBar activeSort={activeSort} onSortChange={setActiveSort} lang={lang} />
            
            <div className="mt-3 flex flex-col gap-2">
              {posts.map((post, i) => (
                <React.Fragment key={post.id}>
                  <PostCard post={post} lang={lang} onVote={handleVote} />
                  {i === 1 && <CrossDivider />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </main>

        <RightSidebar lang={lang} />
      </div>
    </div>
  );
};`,

  'src/App.tsx': `import { HomePage } from './pages/HomePage';

function App() {
  return <HomePage />;
}

export default App;`,

  'src/index.css': `@import "tailwindcss";

@theme {
  --font-sans: "Montserrat", sans-serif;
  --font-ethiopic: "Noto Sans Ethiopic", sans-serif;
}

body {
  margin: 0;
  padding: 0;
}`,

  'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Medrek - Ethiopian Community Forum</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Noto+Sans+Ethiopic:wght@400;500&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filepath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
}
console.log('All files generated successfully.');
