import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Language } from '../../types';
import { CommunityItem } from '../community/CommunityItem';
import { communitiesAPI, mapCommunity } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface LeftSidebarProps {
  activeCommunityId: string;
  lang: Language;
  onSelectCommunity?: (id: string) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ activeCommunityId, lang }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [communities, setCommunities] = useState<any[]>([]);

  useEffect(() => {
    communitiesAPI.getAll().then((data: any) => setCommunities(data.map(mapCommunity)));
  }, []);

  return (
    <div className="hidden md:block w-[196px] flex-shrink-0 border-r border-[#DDD0BE] bg-[#FAF4EC] h-full overflow-y-auto py-4">
      <div className="px-5 mb-2">
        <h3 className="text-[9px] font-bold uppercase tracking-widest text-[#9C836A]">
          {isLoggedIn ? (lang === 'en' ? 'MY COMMUNITIES' : 'የእኔ ማህበረሰቦች') : (lang === 'en' ? 'COMMUNITIES' : 'ማህበረሰቦች')}
        </h3>
        {!isLoggedIn && (
          <p className="text-[9px] text-[#9C836A] mt-0.5">{lang === 'en' ? 'Join one to get started' : 'ለመጀመር ይቀላቀሉ'}</p>
        )}
      </div>
      
      <div className="flex flex-col">
        {communities.map(c => (
          <CommunityItem 
            key={c.id} 
            community={c} 
            isActive={c.id === activeCommunityId}
          />
        ))}
      </div>

      <div className="mx-3 mt-4">
        <button className="w-full border border-dashed border-[#C9904F] rounded-[7px] text-xs font-semibold text-[#6B3F00] text-center py-2 bg-[#FDF8F2] hover:bg-[#F2E0C8] transition-colors cursor-pointer" onClick={() => navigate('/create-community')}>
          + {lang === 'en' ? 'Create community' : 'ማህበረሰብ ፍጠር'}
        </button>
      </div>
    </div>
  );
};