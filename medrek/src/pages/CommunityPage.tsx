import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Language, SortOption, Post } from '../types';
import { Navbar } from '../components/layout/Navbar';
import { LeftSidebar } from '../components/layout/LeftSidebar';
import { FeedSortBar } from '../components/feed/FeedSortBar';
import { PostCard } from '../components/post/PostCard';
import { CommunityBanner } from '../components/community/CommunityBanner';
import { CommunityAboutCard } from '../components/community/CommunityAboutCard';
import { CommunityRulesCard } from '../components/community/CommunityRulesCard';
import { SensitiveWarningModal } from '../components/ui/SensitiveWarningModal';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { communitiesAPI, postsAPI, votesAPI } from '../lib/api';
import { mapCommunityDetail, mapPost } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const { communityId } = useParams();
  const { isLoggedIn, user } = useAuth();
  const [lang, setLang] = useState<Language>('en');
  const [communityDetail, setCommunityDetail] = useState<any>(null);
  const [activeSort, setActiveSort] = useState<SortOption>('hot');
  const [posts, setPosts] = useState<Post[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeCommunityId, setActiveCommunityId] = useState('');

  useEffect(() => {
    if (communityId) loadCommunity();
  }, [communityId]);

  const loadCommunity = async () => {
    try {
      setLoading(true);
      const [communityData, postsData] = await Promise.all([
        communitiesAPI.getOne(communityId!),
        postsAPI.getCommunityPosts(communityId!)
      ]);
      const mapped = mapCommunityDetail(communityData);
      setCommunityDetail(mapped);
      setPosts(postsData.posts.map(mapPost));
      if (mapped.isSensitive) setShowWarning(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    setCommunityDetail((prev: any) => ({ ...prev, isJoined: true, memberCount: prev.memberCount + 1 }));
    try {
      await communitiesAPI.join(communityId!);
    } catch (err: any) {
      setCommunityDetail((prev: any) => ({ ...prev, isJoined: false, memberCount: prev.memberCount - 1 }));
    }
  };

  const handleLeave = async () => {
    setCommunityDetail((prev: any) => ({ ...prev, isJoined: false, memberCount: prev.memberCount - 1 }));
    try {
      await communitiesAPI.leave(communityId!);
    } catch (err: any) {
      setCommunityDetail((prev: any) => ({ ...prev, isJoined: true, memberCount: prev.memberCount + 1 }));
    }
  };

  const handleVote = async (postId: string, value: 1 | -1 | 0) => {
    if (!isLoggedIn) { navigate('/login'); return; }
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
      if (err.message?.toLowerCase().includes('token')) {
        navigate('/login');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen font-sans bg-[#F2E9DF] overflow-y-auto">
        <Navbar lang={lang} onToggleLang={() => setLang(l => l === 'en' ? 'am' : 'en')} />
        <LoadingSpinner text={lang === 'en' ? 'Loading...' : 'በመጫን ላይ...'} />
      </div>
    );
  }

  if (!communityDetail) {
    return (
      <div className="flex flex-col h-screen font-sans bg-[#F2E9DF] overflow-y-auto">
        <Navbar lang={lang} onToggleLang={() => setLang(l => l === 'en' ? 'am' : 'en')} />
        <div className="flex items-center justify-center py-16">
          <div className="text-[#C0392B] text-sm">{lang === 'en' ? 'Community not found' : 'ማህበረሰብ አልተገኘም'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen font-sans bg-[#F2E9DF] overflow-y-auto">
      <Navbar
        lang={lang}
        onToggleLang={() => setLang(l => l === 'en' ? 'am' : 'en')}
        onLogin={() => navigate('/login')}
        onSignup={() => navigate('/register')}
      />
      <CommunityBanner
        community={communityDetail}
        lang={lang}
        onJoin={handleJoin}
        onLeave={handleLeave}
        isOwner={user?.id === communityDetail.creatorId}
        isModOrAdmin={communityDetail.userRole === 'admin' || communityDetail.userRole === 'moderator'}
      />
      <div className="sticky top-14 z-10">
        <FeedSortBar activeSort={activeSort} onSortChange={setActiveSort} lang={lang} communityId={communityId} />
      </div>
      <div className="flex flex-1">
        <div className="hidden md:block w-[196px] flex-shrink-0 sticky top-14 self-start max-h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-[#DDD0BE] bg-[#FAF4EC]">
          <LeftSidebar
            activeCommunityId={activeCommunityId}
            lang={lang}
          />
        </div>
        <main className="flex-1 p-3 flex justify-center">
          <div className="w-full max-w-[640px]">
              {posts.length > 0 ? (
                <div className="flex flex-col gap-2 mt-3">
                  {posts.map(post => (
                    <PostCard key={post.id} post={post} lang={lang} onVote={handleVote} />
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-[#DDD0BE] rounded-[9px] p-8 text-center mt-3">
                  <p className="text-sm text-[#5C4A32] mb-4">
                    {lang === 'en' ? 'No posts yet in this community' : 'በዚህ ማህበረሰብ ውስጥ ገና ልጥፎች የሉም'}
                  </p>
                  <Button variant="primary" onClick={() => navigate(`/create-post?communityId=${communityId}`)}>
                    {lang === 'en' ? 'Create the first post' : 'የመጀመሪያውን ልጥፍ ይፍጠሩ'}
                  </Button>
                </div>
              )}
            </div>
          </main>
          <div className="hidden lg:block w-[236px] flex-shrink-0 sticky top-14 self-start max-h-[calc(100vh-3.5rem)] overflow-y-auto border-l border-[#DDD0BE] bg-[#FAF4EC] p-3">
            <CommunityAboutCard community={communityDetail} lang={lang} />
            <CommunityRulesCard rules={communityDetail.rules || []} lang={lang} />
          </div>
        </div>
      <SensitiveWarningModal
        isOpen={showWarning}
        communityName={communityDetail.name}
        communityNameAm={communityDetail.nameAm}
        lang={lang}
        onConfirm={() => setShowWarning(false)}
        onGoBack={() => navigate(-1)}
      />
    </div>
  );
};
