import React from 'react';
import type { Comment, Language } from '../../types';
import { CommunityPill } from '../community/CommunityPill';

interface CommentHistoryCardProps {
  comment: Comment;
  lang: Language;
}

export const CommentHistoryCard: React.FC<CommentHistoryCardProps> = ({ comment, lang }) => {
  const formatScore = (s: number) => s >= 1000 ? (s / 1000).toFixed(1) + 'k' : s.toString();

  return (
    <div className="bg-white border border-[#DDD0BE] rounded-[9px] p-4 mb-2">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-[#9C836A] uppercase tracking-wide">
            {lang === 'en' ? 'Commented on' : 'አስተያየት ሰጠ'}
          </span>
          {comment.communityId && (
            <CommunityPill name={comment.communityName || ''} nameAm={comment.communityNameAm || ''} lang={lang} communityId={comment.communityId} />
          )}
          <span className="text-xs text-[#9C836A]">· {comment.timeAgo}</span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-[#5A7A2A] text-xs">▲</span>
          <span className="text-sm font-bold text-[#1A0F00]">{formatScore(comment.score)}</span>
        </div>
      </div>
      {comment.postTitle && (
        <p className="text-xs text-[#9C836A] mb-1 font-medium truncate">{comment.postTitle}</p>
      )}
      <p className="text-sm text-[#1A0F00] leading-relaxed">{comment.content}</p>
      <p className="text-xs text-[#5C4A32] font-['Noto_Sans_Ethiopic'] mt-1">{comment.contentAm}</p>
    </div>
  );
};
