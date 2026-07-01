import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Language, SortOption, Post } from '../types';
import { Navbar } from '../components/layout/Navbar';
import { LeftSidebar } from '../components/layout/LeftSidebar';
import { RightSidebar } from '../components/layout/RightSidebar';
import { CreatePostBar } from '../components/feed/CreatePostBar';
import { FeedSortBar } from '../components/feed/FeedSortBar';
import { PostCard } from '../components/post/PostCard';
import { CrossDivider } from '../components/ui/CrossDivider';
import { postsAPI, votesAPI } from '../lib/api';
import { mapPost } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { isLoggedIn, user } = useAuth();
  const [lang, setLang] = useState<Language>('en');
  const [activeSort, setActiveSort] = useState<SortOption>('hot');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCommunityId, setActiveCommunityId] = useState<string>('');

  useEffect(() => {
    loadPosts();
  }, [activeSort, searchQuery]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await postsAPI.getCommunityPosts('all', activeSort, searchQuery);
      setPosts(data.posts.map(mapPost));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (postId: string, value: 1 | -1 | 0) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    let newValue: 1 | -1 | 0 = 0;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        newValue = p.userVote === value ? 0 : value;
        const scoreDiff = newValue - (p.userVote || 0);
        return { ...p, userVote: newValue, score: p.score + scoreDiff };
      }
      return p;
    }));
    try {
      await votesAPI.vote({ targetId: postId, targetType: 'post', value: newValue });
    } catch (err: any) {
      console.error('Vote failed:', err);
      if (err.message?.includes('No token') || err.message?.includes('Invalid token')) {
        navigate('/login');
      } else {
        await loadPosts();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen font-sans bg-[#F2E9DF] overflow-hidden">
        <Navbar lang={lang} onToggleLang={() => setLang(l => l === 'en' ? 'am' : 'en')} />
        <div className="flex items-center justify-center py-16">
          <div className="text-[#9C836A] text-sm">{lang === 'en' ? 'Loading feed...' : 'በመጫን ላይ...'}</div>
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
        
        <main className="flex-1 overflow-y-auto p-3 flex justify-center">
          <div className="w-full max-w-[640px]">
            {isLoggedIn && <CreatePostBar userInitials={user?.username?.slice(0, 2).toUpperCase() || 'FV'} lang={lang} />}
            <FeedSortBar activeSort={activeSort} onSortChange={setActiveSort} lang={lang} />
            
            {error ? (
              <div className="bg-white border border-[#DDD0BE] rounded-[9px] p-8 text-center mt-3">
                <p className="text-sm text-[#C0392B]">{error}</p>
                <button onClick={loadPosts} className="mt-3 text-xs text-[#6B3F00] hover:underline">{lang === 'en' ? 'Try again' : 'እንደገና ይሞክሩ'}</button>
              </div>
            ) : (
              <div className="mt-3 flex flex-col gap-2">
                {posts.map((post, i) => (
                  <React.Fragment key={post.id}>
                    <PostCard post={post} lang={lang} onVote={handleVote} />
                    {i === 1 && <CrossDivider />}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </main>

        <RightSidebar lang={lang} onCreatePost={() => navigate('/create-post')} />
      </div>
    </div>
  );
};