import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Language } from '../../types';
import { Button } from '../ui/Button';
import { statsAPI, communitiesAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface TrendingComm {
  id: string;
  name: string;
  memberCount: number;
}

interface RightSidebarProps {
  lang: Language;
  onCreatePost?: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ lang, onCreatePost }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [stats, setStats] = useState({ userCount: 0, communityCount: 0, postCount: 0 });
  const [trending, setTrending] = useState<TrendingComm[]>([]);

  useEffect(() => {
    statsAPI.getPlatformStats().then(setStats);
    communitiesAPI.getTrending().then(setTrending);
  }, []);

  const handleJoin = async (communityId: string) => {
    if (!isLoggedIn) {
      navigate('/login');
      return
    }
    try {
      await communitiesAPI.join(communityId)
    } catch { }
  };

  const formatStat = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n.toString();

  return (
    <div className="hidden lg:block w-[236px] flex-shrink-0 border-l border-[#DDD0BE] bg-[#FAF4EC] h-full overflow-y-auto p-3">
      <div className="bg-white border border-[#DDD0BE] rounded-[9px] mb-3 overflow-hidden">
        <div className="bg-[#2E1A00] px-3 py-2 flex justify-between items-center">
          <span className="text-xs font-bold text-[#FAF4EC]">Medrek Community</span>
          <span className="text-[10px] text-[#A8692A] font-ethiopic">መድረክ</span>
        </div>
        <div className="p-3">
          <p className="text-xs text-[#5C4A32] mb-3 leading-relaxed">
            {lang === 'en' ? 'The Ethiopian community forum. Speak freely. Respectfully.' : 'የኢትዮጵያ ማህበረሰብ መድረክ። ነፃነት። አክብሮት።'}
          </p>
          <div className="flex gap-2 mb-3">
            <div className="flex-1 bg-[#FAF4EC] rounded-md p-2 text-center">
              <div className="text-xs font-bold text-[#1A0F00]">{formatStat(stats.userCount)}</div>
              <div className="text-[10px] text-[#9C836A]">{lang === 'en' ? 'Members' : 'አባላት'}</div>
            </div>
            <div className="flex-1 bg-[#FAF4EC] rounded-md p-2 text-center">
              <div className="text-xs font-bold text-[#1A0F00]">{formatStat(stats.communityCount)}</div>
              <div className="text-[10px] text-[#9C836A]">{lang === 'en' ? 'Communities' : 'ማህበረሰቦች'}</div>
            </div>
          </div>
          <Button fullWidth variant="primary" onClick={onCreatePost}>+ {lang === 'en' ? 'Create Post' : 'ልጥፍ ፍጠር'}</Button>
        </div>
      </div>

      <div className="bg-white border border-[#DDD0BE] rounded-[9px] mb-3 overflow-hidden">
        <div className="bg-[#2E1A00] px-3 py-2 flex justify-between items-center">
          <span className="text-xs font-bold text-[#FAF4EC]">{lang === 'en' ? 'Trending' : 'ታዋቂ'}</span>
          <span className="text-[10px] text-[#A8692A] font-ethiopic">ታዋቂ</span>
        </div>
        <div className="p-3 flex flex-col">
          {trending.map((t) => (
            <div key={t.id} className="flex justify-between items-center py-1.5 border-b border-[#F2E0C8] last:border-0">
              <div className="flex flex-col cursor-pointer" onClick={() => navigate(`/community/${t.id}`)}>
                <span className="text-xs font-semibold text-[#1A0F00]">m/{t.name}</span>
                <span className="text-[10px] text-[#9C836A]">{formatStat(t.memberCount)} members</span>
              </div>
              <Button variant="join" onClick={() => handleJoin(t.id)}>{lang === 'en' ? 'Join' : 'ተቀላቀል'}</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};