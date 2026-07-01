import React from 'react';
import type { Language } from '../../types';
import { VoteButton } from './VoteButton';

interface PostActionsProps {
  commentCount: number;
  lang: Language;
  score: number;
  userVote: 1 | -1 | 0;
  onUpvote: () => void;
  onDownvote: () => void;
  onReport?: () => void;
}

export const PostActions: React.FC<PostActionsProps> = ({
  commentCount,
  lang,
  score,
  userVote,
  onUpvote,
  onDownvote,
  onReport,
}) => {
  return (
    <div className="flex flex-row items-center gap-2 mt-2 flex-wrap">
      {/* Vote box inline */}
      <VoteButton
        score={score}
        userVote={userVote}
        onUpvote={onUpvote}
        onDownvote={onDownvote}
      />

      {/* Comments */}
      <button className="flex flex-row items-center gap-1 text-[#9C836A] text-xs hover:bg-[#FAF4EC] hover:text-[#4A2C00] rounded px-2 py-1 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>{lang === 'en' ? `${commentCount} comments` : `${commentCount} አስተያየቶች`}</span>
      </button>

      {/* Share */}
      <button className="flex flex-row items-center gap-1 text-[#9C836A] text-xs hover:bg-[#FAF4EC] hover:text-[#4A2C00] rounded px-2 py-1 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        <span>{lang === 'en' ? 'Share' : 'አጋራ'}</span>
      </button>

      {/* Report */}
      <button
        className="flex flex-row items-center gap-1 text-[#9C836A] text-xs hover:bg-[#FAF4EC] hover:text-[#4A2C00] rounded px-2 py-1 transition-colors"
        onClick={e => { e.stopPropagation(); e.preventDefault(); onReport?.(); }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
        <span>{lang === 'en' ? 'Report' : 'ሪፖርት'}</span>
      </button>
    </div>
  );
};