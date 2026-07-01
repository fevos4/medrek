import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Comment, Language } from '../../types';
import { formatUsername } from '../../lib/format';
import { Badge } from '../ui/Badge';
import { ReportModal } from '../ui/ReportModal';

interface CommentCardProps {
  comment: Comment;
  lang: Language;
  depth: number;
  onVote: (commentId: string, value: 1 | -1 | 0) => void;
  onReply?: (parentId: string, text: string) => void;
}

const getInitials = (name: string) => {
  if (name === 'Anonymous') return '?';
  return name.split('_').map(s => s[0]).join('').toUpperCase().slice(0, 2);
};

export const CommentCard: React.FC<CommentCardProps> = ({ comment, lang, depth, onVote, onReply }) => {
  const [showReport, setShowReport] = useState(false);
  const [reported, setReported] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  if (reported) return null;
  const upColor = comment.userVote === 1 ? 'text-[#5A7A2A]' : 'text-[#9C836A]';
  const downColor = comment.userVote === -1 ? 'text-[#C0392B]' : 'text-[#9C836A]';
  const scoreColor = comment.userVote === 1 ? 'text-[#5A7A2A]' : comment.userVote === -1 ? 'text-[#C0392B]' : 'text-[#1A0F00]';
  const voteBoxBg = comment.userVote === 1 ? 'bg-green-200' : comment.userVote === -1 ? 'bg-red-200' : '';

  const formatScore = (s: number) => s >= 1000 ? (s / 1000).toFixed(1) + 'k' : s.toString();

  const handleUpvote = () => onVote(comment.id, 1);
  const handleDownvote = () => onVote(comment.id, -1);

  const handleReplySubmit = () => {
    if (replyText.trim() && onReply) {
      onReply(comment.id, replyText.trim());
      setReplyText('');
      setShowReply(false);
    }
  };

  const initials = getInitials(comment.author);
  const avatarBg = comment.isAnonymous ? 'bg-[#F2E9DF]' : 'bg-[#E4C49A]';
  const avatarText = comment.isAnonymous ? 'text-[#9C836A]' : 'text-[#4A2C00]';

  return (
    <div>
      <div className={depth > 0 ? 'ml-6 border-l-2 border-[#F2E0C8] pl-3' : ''}>
        <div className="flex gap-3">
          <div className={`w-7 h-7 rounded-full ${avatarBg} flex items-center justify-center flex-shrink-0`}>
            <span className={`${avatarText} text-xs font-bold`}>{initials}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link to={`/u/${comment.author}`} className="text-xs font-bold text-[#1A0F00] hover:underline">{formatUsername(comment.author)}</Link>
              {comment.isAnonymous && <Badge type="anonymous" lang={lang} />}
              <span className="text-xs text-[#9C836A]">· {comment.timeAgo}</span>
            </div>
            <p className="text-sm text-[#1A0F00] leading-relaxed mt-1">{comment.content}</p>
            <p className="text-xs text-[#5C4A32] font-['Noto_Sans_Ethiopic'] leading-relaxed">{comment.contentAm}</p>
            <div className="flex items-center gap-3 mt-2">
              <div className={`flex items-center gap-1 rounded px-1 py-0.5 ${voteBoxBg}`}>
                <button onClick={handleUpvote} className={`hover:bg-[#E2D9CE] rounded p-0.5 ${upColor}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l8 16H4z" /></svg>
                </button>
                <span className={`text-xs font-bold ${scoreColor}`}>{formatScore(comment.score)}</span>
                <button onClick={handleDownvote} className={`hover:bg-[#E2D9CE] rounded p-0.5 ${downColor}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 20L4 4h16z" /></svg>
                </button>
              </div>
              <button className="text-xs text-[#9C836A] hover:text-[#4A2C00]" onClick={() => setShowReply(!showReply)}>
                {lang === 'en' ? 'Reply' : 'መልስ'}
              </button>
              <button className="text-xs text-[#9C836A] hover:text-[#4A2C00]" onClick={() => setShowReport(true)}>
                {lang === 'en' ? 'Report' : 'ሪፖርት'}
              </button>
            </div>
            {showReply && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder={lang === 'en' ? 'Write a reply...' : 'መልስ ጻፍ...'}
                  onKeyDown={e => { if (e.key === 'Enter') handleReplySubmit(); }}
                  className="flex-1 border-0 border-b border-[#DDD0BE] pb-1 text-sm focus:outline-none focus:border-[#A8692A] bg-transparent"
                />
                <button onClick={handleReplySubmit} disabled={!replyText.trim()} className="text-xs font-semibold text-[#6B3F00] hover:underline disabled:text-[#DDD0BE] disabled:no-underline">{lang === 'en' ? 'Reply' : 'መልስ'}</button>
                <button onClick={() => { setShowReply(false); setReplyText(''); }} className="text-xs text-[#9C836A] hover:text-[#5C4A32]">{lang === 'en' ? 'Cancel' : 'ሰርዝ'}</button>
              </div>
            )}
            <ReportModal
              isOpen={showReport}
              targetType="comment"
              lang={lang}
              onSubmit={form => { console.log('Report submitted:', form); setReported(true); }}
              onClose={() => setShowReport(false)}
            />
          </div>
        </div>
      </div>
      {comment.replies.length > 0 && depth < 2 && (
        <div className="mt-2">
          {comment.replies.map(reply => (
            <CommentCard key={reply.id} comment={reply} lang={lang} depth={depth + 1} onVote={onVote} onReply={onReply} />
          ))}
        </div>
      )}
      {comment.replies.length > 0 && depth >= 2 && (
        <div className="ml-6 pl-3 mt-2">
          <button className="text-xs text-[#9C836A] hover:text-[#4A2C00]">
            {lang === 'en' ? 'View more replies' : 'ተጨማሪ መልሶች'}
          </button>
        </div>
      )}
    </div>
  );
};
