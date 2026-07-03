import React, { useState, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Post, Language } from '../../types';
import { CommunityPill } from '../community/CommunityPill';
import { Badge } from '../ui/Badge';
import { ReportModal } from '../ui/ReportModal';
import { PostActions } from './PostActions';
import { ShareModal } from '../ui/ShareModal';
import { formatUsername } from '../../lib/format';
import { modAPI } from '../../lib/api';


interface PostCardProps {
  post: Post;
  lang: Language;
  isMod?: boolean;
  onVote: (postId: string, value: 1 | -1 | 0) => void;
}

export const PostCard: React.FC<PostCardProps> = memo(({ post, lang, isMod, onVote }) => {
  const navigate = useNavigate();
  const [showReport, setShowReport] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [reported, setReported] = useState(false);
  const [showModMenu, setShowModMenu] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [modMessage, setModMessage] = useState('');

  if (reported || removed) return null;

  const handleModAction = async (action: () => Promise<any>, successMsg: string) => {
    try {
      await action();
      setModMessage(successMsg);
      setTimeout(() => setRemoved(true), 1000);
    } catch (err: any) {
      setModMessage(err.message || 'Action failed');
    }
    setShowModMenu(false);
  };

  return (
    <>
      <div
        onClick={() => navigate(`/post/${post.id}`)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/post/${post.id}`); }}}
        role="button"
        tabIndex={0}
        className="bg-white border border-[#DDD0BE] rounded-[9px] hover:border-[#A8692A] transition-colors cursor-pointer no-underline relative"
      >
        {isMod && (
          <div className="absolute top-2 right-2 z-10" onClick={e => e.stopPropagation()}>
            <button className="text-[#9C836A] hover:text-[#4A2C00] text-lg leading-none px-1" onClick={() => setShowModMenu(!showModMenu)}>⋯</button>
            {showModMenu && (
              <div className="absolute right-0 top-6 w-36 bg-white border border-[#DDD0BE] rounded-lg shadow-sm z-20">
                <div className="text-xs text-[#C0392B] px-3 py-2 hover:bg-[#FEF2F2] cursor-pointer" onClick={() => handleModAction(() => modAPI.removePost(post.id), 'Post removed')}>
                  Remove post
                </div>
                {!post.isAnonymous && post.authorId && (
                  <div className="text-xs text-[#C0392B] px-3 py-2 hover:bg-[#FEF2F2] cursor-pointer" onClick={() => handleModAction(() => modAPI.banUser(post.communityId, post.authorId!), 'User banned')}>
                    Ban author
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="p-3 px-4 flex-1 w-full">
          {modMessage && (
            <div className="text-xs text-[#C0392B] mb-1">{modMessage}</div>
          )}
          <div className="flex flex-row items-center flex-wrap gap-2 mb-1">
            <span onClick={e => e.stopPropagation()}><CommunityPill name={post.communityName} nameAm={post.communityNameAm} lang={lang} communityId={post.communityId} /></span>
            <span className="text-[#9C836A] text-xs">
              {lang === 'en' ? 'by ' : 'በ '}<Link to={`/u/${post.author}`} onClick={e => e.stopPropagation()} className="hover:underline text-[#6B3F00]">{formatUsername(post.author)}</Link> · {post.timeAgo}
            </span>
            {post.isAnonymous && <Badge type="anonymous" lang={lang} />}
            {post.isSensitive && <Badge type="sensitive" lang={lang} />}
          </div>
          {post.type === 'image' && post.imageUrl && (
            <div className="mt-2 rounded-lg overflow-hidden border border-[#DDD0BE]">
              <img src={post.imageUrl} alt={post.title} className="w-full max-h-64 object-contain bg-[#F2E9DF]" />
            </div>
          )}
          <h2 className="text-sm font-semibold text-[#1A0F00]">
            {post.title}
          </h2>
          <h3 className="text-xs text-[#5C4A32] font-normal font-ethiopic mt-0.5">
            {post.titleAm}
          </h3>
          <PostActions
            commentCount={post.commentCount}
            lang={lang}
            score={post.score}
            userVote={post.userVote}
            onUpvote={() => onVote(post.id, 1)}
            onDownvote={() => onVote(post.id, -1)}
            onShare={() => setShowShare(true)}
            onReport={() => setShowReport(true)}
          />
        </div>
      </div>
      <ReportModal
        isOpen={showReport}
        targetType="post"
        lang={lang}
        onSubmit={form => { console.log('Report submitted:', form); setReported(true); }}
        onClose={() => setShowReport(false)}
      />
      <ShareModal
        isOpen={showShare}
        url={window.location.origin + '/post/' + post.id}
        lang={lang}
        onClose={() => setShowShare(false)}
      />
    </>
  );
});