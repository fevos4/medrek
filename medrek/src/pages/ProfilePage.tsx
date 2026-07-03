import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Language, ProfileTab, Post, Comment } from '../types';
import { Navbar } from '../components/layout/Navbar';
import { PostCard } from '../components/post/PostCard';
import { Button } from '../components/ui/Button';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ProfileTabs } from '../components/profile/ProfileTabs';
import { AboutTab } from '../components/profile/AboutTab';
import { CommentHistoryCard } from '../components/profile/CommentHistoryCard';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { formatUsername } from '../lib/format';
import { usersAPI, votesAPI, communitiesAPI, mapPost, mapProfile, mapCommunity } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser, isLoggedIn, loading: authLoading } = useAuth();
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (username && !authLoading) loadProfile();
  }, [username, authLoading, currentUser]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const [profileData, postsData, commentsData, communitiesData] = await Promise.all([
        usersAPI.getProfile(username!),
        usersAPI.getPosts(username!),
        usersAPI.getComments(username!),
        usersAPI.getCommunities(username!)
      ]);
      const isCurrentUser = isLoggedIn && currentUser?.username === username;
      setProfile(mapProfile(profileData, isCurrentUser));
      setPosts(postsData.map(mapPost));
      setCommunities(communitiesData.map(mapCommunity));

      const mappedComments = commentsData.map((c: any) => ({
        id: c.id,
        content: c.isRemoved ? '[removed]' : c.content,
        contentAm: c.isRemoved ? '[removed]' : (c.contentAm || ''),
        author: c.isAnonymous ? 'Anonymous' : (c.author?.username || 'Unknown'),
        score: c.score,
        userVote: 0 as 1 | -1 | 0,
        timeAgo: new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        isAnonymous: c.isAnonymous,
        isRemoved: c.isRemoved,
        replies: [],
        postTitle: c.post?.title || '',
        postTitleAm: c.post?.titleAm || '',
        communityId: c.post?.community?.id || '',
        communityName: c.post?.community?.name || '',
        communityNameAm: c.post?.community?.nameAm || ''
      }));
      setComments(mappedComments);
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMute = async (communityId: string, currentMuteStatus: boolean) => {
    try {
      const newStatus = !currentMuteStatus;
      await communitiesAPI.toggleMute(communityId, newStatus);
      setCommunities(prev => prev.map(c => c.id === communityId ? { ...c, isMuted: newStatus } : c));
    } catch (err: any) {
      console.error('Failed to toggle mute status:', err);
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
      if (err.message?.toLowerCase().includes('token')) {
        navigate('/login');
      } else {
        await loadProfile();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen font-sans bg-[#F2E9DF] overflow-y-auto">
        <Navbar lang={lang} onToggleLang={() => setLang(l => l === 'en' ? 'am' : 'en')} />
        <LoadingSpinner text={lang === 'en' ? 'Loading profile...' : 'መገለጫ በመጫን ላይ...'} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen font-sans bg-[#F2E9DF] overflow-y-auto">
        <Navbar lang={lang} onToggleLang={() => setLang(l => l === 'en' ? 'am' : 'en')} />
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <p className="text-sm text-[#C0392B]">{error}</p>
            <button onClick={loadProfile} className="mt-3 text-xs text-[#6B3F00] hover:underline">{lang === 'en' ? 'Try again' : 'እንደገና ይሞክሩ'}</button>
          </div>
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
      {profile && <ProfileHeader user={profile} lang={lang} onEditProfile={() => setShowEditModal(true)} />}
      {profile && (
        <div className="sticky top-14 z-10">
          <ProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            lang={lang}
            postCount={profile.postCount}
            communityCount={communities.length}
          />
        </div>
      )}
      <div className="flex flex-1">
        <main className="flex-1 bg-[#F2E9DF] p-4">
          <div className="max-w-[680px] mx-auto">
            {activeTab === 'posts' && (
              posts.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {posts.map(post => (
                    <PostCard key={post.id} post={post} lang={lang} onVote={handleVote} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#9C836A] text-center py-8">
                  {lang === 'en' ? 'No posts yet' : 'ገና ልጥፎች የሉም'}
                </p>
              )
            )}
            {activeTab === 'comments' && (
              comments.length > 0 ? (
                <div>
                  {comments.map(comment => (
                    <CommentHistoryCard key={comment.id} comment={comment} lang={lang} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#9C836A] text-center py-8">
                  {lang === 'en' ? 'No comments yet' : 'ገና አስተያየቶች የሉም'}
                </p>
              )
            )}
            {activeTab === 'communities' && (
              communities.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {communities.map(c => (
                    <div key={c.id} className="bg-white border border-[#DDD0BE] rounded-[9px] p-3 flex items-center gap-3 shadow-sm">
                      <div
                        className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                        onClick={() => navigate(`/community/${c.id}`)}
                      >
                        <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: c.iconBg }}>
                          {c.iconUrl ? <img src={c.iconUrl} alt="" className="w-full h-full object-cover" /> : c.icon}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-[#1A0F00] truncate">{lang === 'en' ? c.name : (c.nameAm || c.name)}</h3>
                          <p className="text-xs text-[#9C836A]">{c.memberCount} {lang === 'en' ? 'members' : 'አባላት'}</p>
                        </div>
                      </div>

                      {profile.isCurrentUser && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleToggleMute(c.id, c.isMuted); }}
                            title={c.isMuted ? (lang === 'en' ? 'Unmute notifications' : 'ማሳወቂያ ክፈት') : (lang === 'en' ? 'Mute notifications' : 'ማሳወቂያ አጥፋ')}
                            className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm transition-all border ${
                              c.isMuted
                                ? 'bg-[#F2E9DF] border-[#DDD0BE] text-[#9C836A] hover:bg-[#EDD5B8]'
                                : 'bg-[#FEF3C7] border-[#FDE68A] text-[#D97706] hover:bg-[#FDE68A]'
                            }`}
                          >
                            {c.isMuted ? '🔕' : '🔔'}
                          </button>
                          <Button
                            variant="join"
                            onClick={() => navigate(`/mod/dashboard?community=${c.id}`)}
                          >
                            {lang === 'en' ? '🛡️ Manage' : '🛡️ አስተዳድር'}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#9C836A] text-center py-8">
                  {lang === 'en' ? 'No groups created yet' : 'ገና ምንም ቡድኖች አልተፈጠሩም'}
                </p>
              )
            )}
            {activeTab === 'about' && profile && (
              <AboutTab user={profile} lang={lang} />
            )}
          </div>
        </main>
        <div className="hidden lg:block w-[280px] flex-shrink-0 sticky top-14 self-start max-h-[calc(100vh-3.5rem)] overflow-y-auto bg-[#FAF4EC] border-l border-[#DDD0BE] p-3">
          {profile && (
            <div className="bg-white border border-[#DDD0BE] rounded-[9px] overflow-hidden mb-3">
              <div className="bg-[#2E1A00] px-3 py-2">
                <span className="text-xs font-bold text-white">{formatUsername(profile.username)}</span>
              </div>
              <div className="p-3 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-[#4A2C00]" style={{ backgroundColor: profile.avatarColor }}>
                  <span className="text-sm font-bold text-[#4A2C00]">{profile.initials}</span>
                </div>
                <p className="text-xs font-bold text-[#1A0F00] mt-2">{profile.username}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[#C9904F] text-[10px]">▲</span>
                  <span className="text-xs font-bold text-[#C9904F]">{profile.karma.toLocaleString()}</span>
                </div>
                <div className="border-t border-[#F2E0C8] w-full my-3" />
                <div className="flex w-full justify-around">
                  <div className="text-center">
                    <div className="text-sm font-bold text-[#1A0F00]">{profile.postCount}</div>
                    <div className="text-[10px] text-[#9C836A]">{lang === 'en' ? 'Posts' : 'ልጥፎች'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-[#1A0F00]">{profile.commentCount}</div>
                    <div className="text-[10px] text-[#9C836A]">{lang === 'en' ? 'Comments' : 'አስተያየቶች'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {profile?.isCurrentUser && (
            <Button variant="primary" fullWidth onClick={() => navigate('/create-post')}>
              {lang === 'en' ? 'Create Post' : 'ልጥፍ ጻፍ'}
            </Button>
          )}
        </div>
      </div>
      {profile && (
        <EditProfileModal
          isOpen={showEditModal}
          currentBio={profile?.bio}
          lang={lang}
          onClose={() => setShowEditModal(false)}
          onSave={(newBio) => {
            setProfile((prev: any) => ({ ...prev, bio: newBio }));
          }}
        />
      )}
    </div>
  );
};
