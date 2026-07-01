import React from 'react';

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

  const boxBg =
    userVote === 1
      ? 'bg-[#EAF3DE] border-[#A3C97A]'
      : userVote === -1
      ? 'bg-[#FEE9E7] border-[#F5A49B]'
      : 'bg-[#F2E9DF] border-[#DDD0BE]';

  const upColor = userVote === 1 ? 'text-[#5A7A2A]' : 'text-[#9C836A] hover:text-[#5A7A2A]';
  const downColor = userVote === -1 ? 'text-[#C0392B]' : 'text-[#9C836A] hover:text-[#C0392B]';
  const scoreColor =
    userVote === 1 ? 'text-[#5A7A2A]' : userVote === -1 ? 'text-[#C0392B]' : 'text-[#4A2C00]';

  return (
    <div
      className={`inline-flex items-center gap-1 border rounded-full px-1.5 py-0.5 transition-colors ${boxBg}`}
      onClick={e => e.stopPropagation()}
    >
      <button
        onClick={e => { e.stopPropagation(); onUpvote(); }}
        className={`flex items-center justify-center rounded-full w-5 h-5 transition-colors ${upColor}`}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4l8 16H4z" />
        </svg>
      </button>
      <span className={`text-xs font-bold min-w-[14px] text-center ${scoreColor}`}>
        {formatScore(score)}
      </span>
      <button
        onClick={e => { e.stopPropagation(); onDownvote(); }}
        className={`flex items-center justify-center rounded-full w-5 h-5 transition-colors ${downColor}`}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 20L4 4h16z" />
        </svg>
      </button>
    </div>
  );
};