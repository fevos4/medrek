import React, { useState } from 'react';
import type { PostDetail, Language } from '../../types';
import { formatUsername } from '../../lib/format';
import { CommunityPill } from '../community/CommunityPill';
import { Badge } from '../ui/Badge';
import { ReportModal } from '../ui/ReportModal';
import { ShareModal } from '../ui/ShareModal';

interface PostDetailCardProps {
  post: PostDetail;
  lang: Language;
  onVote: (postId: string, value: 1 | -1 | 0) => void;
}

export const PostDetailCard: React.FC<PostDetailCardProps> = ({ post, lang, onVote }) => {
  const [showReport, setShowReport] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [reported, setReported] = useState(false);
  const upColor = post.userVote === 1 ? 'text-[#5A7A2A]' : 'text-[#9C836A]';
  const downColor = post.userVote === -1 ? 'text-[#C0392B]' : 'text-[#9C836A]';
  const scoreColor = post.userVote === 1 ? 'text-[#5A7A2A]' : post.userVote === -1 ? 'text-[#C0392B]' : 'text-[#1A0F00]';
  const voteBoxBg = post.userVote === 1 ? 'bg-green-200' : post.userVote === -1 ? 'bg-red-200' : '';
  const handleUpvote = () => onVote(post.id, 1);
  const handleDownvote = () => onVote(post.id, -1);

  const formatScore = (s: number) => s >= 1000 ? (s / 1000).toFixed(1) + 'k' : s.toString();

  return (
    <div className="bg-white border border-[#DDD0BE] rounded-[9px]">
      <div className="p-4">
        <div className="flex flex-row items-center flex-wrap gap-2 mb-1">
          <CommunityPill name={post.communityName} nameAm={post.communityNameAm} lang={lang} communityId={post.communityId} />
          <span className="text-[#9C836A] text-xs">
            {lang === 'en' ? `by ${formatUsername(post.author)}` : `በ ${formatUsername(post.author)}`} · {post.timeAgo}
          </span>
          {post.isAnonymous && <Badge type="anonymous" lang={lang} />}
          {post.isSensitive && <Badge type="sensitive" lang={lang} />}
        </div>
        <h1 className="text-xl font-bold text-[#1A0F00] mt-2">{post.title}</h1>
        <h2 className="text-base text-[#5C4A32] font-normal font-['Noto_Sans_Ethiopic'] mt-1">{post.titleAm}</h2>
        <p className="text-sm text-[#1A0F00] leading-relaxed mt-3">{post.content}</p>
        <p className="text-xs text-[#5C4A32] font-['Noto_Sans_Ethiopic'] leading-relaxed mt-1">{post.contentAm}</p>
        {post.type === 'image' && post.imageUrl && (
          <div className="mt-3 rounded-lg overflow-hidden border border-[#DDD0BE]">
            <img src={post.imageUrl} alt={post.title} className="w-full max-h-96 object-contain bg-[#F2E9DF]" />
          </div>
        )}
      </div>
      <div className="border-t border-[#DDD0BE] mx-4" />
      <div className="px-4 py-[10px] flex items-center gap-2 flex-wrap">
        <div className={`flex items-center gap-1 rounded-md px-1 py-0.5 ${voteBoxBg}`}>
          <button onClick={handleUpvote} className={`hover:bg-[#E2D9CE] rounded p-1 ${upColor}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l8 16H4z" /></svg>
          </button>
          <span className={`text-sm font-bold ${scoreColor}`}>{formatScore(post.score)}</span>
          <button onClick={handleDownvote} className={`hover:bg-[#E2D9CE] rounded p-1 ${downColor}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 20L4 4h16z" /></svg>
          </button>
        </div>
        <span className="text-[#9C836A] mx-1">|</span>
        <button className="flex items-center gap-1 text-[#9C836A] text-xs hover:text-[#4A2C00] px-2 py-1 rounded transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          <span>{lang === 'en' ? `${post.commentCount} comments` : `${post.commentCount} አስተያየቶች`}</span>
        </button>
        <button className="flex items-center gap-1 text-[#9C836A] text-xs hover:text-[#4A2C00] px-2 py-1 rounded transition-colors" onClick={() => setShowShare(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
          <span>{lang === 'en' ? 'Share' : 'አጋራ'}</span>
        </button>
        {reported ? (
          <span className="text-xs text-[#5A7A2A] font-semibold">{lang === 'en' ? 'Reported' : 'ሪፖርት ተደርጓል'}</span>
        ) : (
          <button className="flex items-center gap-1 text-[#9C836A] text-xs hover:text-[#4A2C00] px-2 py-1 rounded transition-colors" onClick={() => setShowReport(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
            <span>{lang === 'en' ? 'Report' : 'ሪፖርት'}</span>
          </button>
        )}
      </div>
      <ReportModal
        isOpen={showReport}
        targetType="post"
        lang={lang}
        onSubmit={form => { console.log('Report submitted:', form); setReported(true); setShowReport(false); }}
        onClose={() => setShowReport(false)}
      />
      <ShareModal
        isOpen={showShare}
        url={window.location.origin + '/post/' + post.id}
        lang={lang}
        onClose={() => setShowShare(false)}
      />
    </div>
  );
};
