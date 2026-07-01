import React from 'react';
import type { Comment, Language } from '../../types';
import { CommentCard } from './CommentCard';

interface CommentThreadProps {
  comments: Comment[];
  lang: Language;
  onVote: (commentId: string, value: 1 | -1 | 0) => void;
  onReply?: (parentId: string, text: string) => void;
}

export const CommentThread: React.FC<CommentThreadProps> = ({ comments, lang, onVote, onReply }) => {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-bold text-[#1A0F00] mb-3">
        {lang === 'en' ? `Comments (${comments.length})` : `አስተያየቶች (${comments.length})`}
      </h3>
      {comments.map((comment, idx) => (
        <React.Fragment key={comment.id}>
          {idx > 0 && <div className="border-t border-[#F2E0C8] my-3" />}
          <CommentCard comment={comment} lang={lang} depth={0} onVote={onVote} onReply={onReply} />
        </React.Fragment>
      ))}
    </div>
  );
};
