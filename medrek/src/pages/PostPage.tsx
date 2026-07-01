import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Language, PostDetail, Comment } from '../types';
import { Navbar } from '../components/layout/Navbar';
import { LeftSidebar } from '../components/layout/LeftSidebar';
import { RightSidebar } from '../components/layout/RightSidebar';
import { PostDetailCard } from '../components/post/PostDetailCard';
import { CommentInput } from '../components/comment/CommentInput';
import { CommentThread } from '../components/comment/CommentThread';
import { postsAPI, votesAPI } from '../lib/api';
import { mapPostDetail, mapComment } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const updateCommentVote = (comments: Comment[], id: string, newValue: 1 | -1 | 0, scoreDiff: number): Comment[] =>
  comments.map(c => {
    if (c.id === id) {
      return { ...c, userVote: newValue, score: c.score + scoreDiff };
    }
    if (c.replies.length > 0) {
      return { ...c, replies: updateCommentVote(c.replies, id, newValue, scoreDiff) };
    }
    return c;
  });

export const PostPage: React.FC = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { isLoggedIn } = useAuth();
  const [lang, setLang] = useState<Language>('en');
  const [postDetail, setPostDetail] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCommunityId] = useState<string>('');

  useEffect(() => {
    if (postId) loadPost();
  }, [postId]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const [postData, commentsData] = await Promise.all([
        postsAPI.getOne(postId!),
        postsAPI.getComments(postId!)
      ]);
      setPostDetail(mapPostDetail(postData));
      setComments(commentsData.map(mapComment));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostVote = async (_id: string, value: 1 | -1 | 0) => {
    if (!isLoggedIn) { navigate('/login'); return; }
    let newValue: 1 | -1 | 0 = 0;
    setPostDetail(prev => {
      if (!prev) return prev;
      newValue = prev.userVote === value ? 0 : value;
      const scoreDiff = newValue - prev.userVote;
      return { ...prev, userVote: newValue, score: prev.score + scoreDiff };
    });
    try {
      await votesAPI.vote({ targetId: postId!, targetType: 'post', value: newValue });
    } catch (err: any) {
      console.error('Post vote failed:', err);
      if (err.message?.toLowerCase().includes('token')) {
        navigate('/login');
      }
    }
  };

  const handleCommentVote = async (commentId: string, value: 1 | -1 | 0) => {
    if (!isLoggedIn) { navigate('/login'); return; }
    let newValue: 1 | -1 | 0 = 0;
    let scoreDiff = 0;
    const walk = (cs: Comment[]): boolean => {
      for (const c of cs) {
        if (c.id === commentId) { newValue = c.userVote === value ? 0 : value; scoreDiff = newValue - c.userVote; return true; }
        if (c.replies.length > 0 && walk(c.replies)) return true;
      }
      return false;
    };
    walk(comments);
    setComments(prev => updateCommentVote(prev, commentId, newValue, scoreDiff));
    try {
      await votesAPI.vote({ targetId: commentId, targetType: 'comment', value: newValue });
    } catch (err: any) {
      console.error('Comment vote failed:', err);
      if (err.message?.toLowerCase().includes('token')) {
        navigate('/login');
      } else if (postId) {
        await loadPost();
      }
    }
  };

  const handleCommentSubmit = async (text: string) => {
    if (!isLoggedIn) { navigate('/login'); return; }
    try {
      const newComment = await postsAPI.addComment(postId!, { content: text, isAnonymous: false });
      setComments(prev => [mapComment(newComment), ...prev]);
      setPostDetail(prev => prev ? { ...prev, commentCount: prev.commentCount + 1 } : prev);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReply = async (parentId: string, text: string) => {
    if (!isLoggedIn) { navigate('/login'); return; }
    try {
      const newReply = await postsAPI.addComment(postId!, { content: text, parentId, isAnonymous: false });
      const mapped = mapComment(newReply);
      setComments(prev => {
        const addToTree = (comments: Comment[]): Comment[] =>
          comments.map(c => {
            if (c.id === parentId) return { ...c, replies: [...c.replies, mapped] };
            if (c.replies.length > 0) return { ...c, replies: addToTree(c.replies) };
            return c;
          });
        return addToTree(prev);
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen font-sans bg-[#F2E9DF] overflow-hidden">
        <Navbar lang={lang} onToggleLang={() => setLang(l => l === 'en' ? 'am' : 'en')} />
        <div className="flex items-center justify-center py-16">
          <div className="text-[#9C836A] text-sm">{lang === 'en' ? 'Loading...' : 'በመጫን ላይ...'}</div>
        </div>
      </div>
    );
  }

  if (!postDetail) {
    return (
      <div className="flex flex-col h-screen font-sans bg-[#F2E9DF] overflow-hidden">
        <Navbar lang={lang} onToggleLang={() => setLang(l => l === 'en' ? 'am' : 'en')} />
        <div className="flex items-center justify-center py-16">
          <div className="text-[#C0392B] text-sm">{lang === 'en' ? 'Post not found' : 'ልጥፍ አልተገኘም'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen font-sans bg-[#F2E9DF] overflow-hidden">
      <Navbar
        lang={lang}
        onToggleLang={() => setLang(l => l === 'en' ? 'am' : 'en')}
        onLogin={() => navigate('/login')}
        onSignup={() => navigate('/register')}
      />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar
          activeCommunityId={activeCommunityId}
          lang={lang}
        />
        <main className="flex-1 overflow-y-auto p-4 flex justify-center">
          <div className="w-full max-w-[680px]">
            <PostDetailCard post={postDetail} lang={lang} onVote={handlePostVote} />
            <CommentInput lang={lang} onSubmit={handleCommentSubmit} />
            <CommentThread comments={comments} lang={lang} onVote={handleCommentVote} onReply={handleReply} />
          </div>
        </main>
        <RightSidebar lang={lang} onCreatePost={() => navigate(`/create-post?communityId=${postDetail.communityId}`)} />
      </div>
    </div>
  );
};
