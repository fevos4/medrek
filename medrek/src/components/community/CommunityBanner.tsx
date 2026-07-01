import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { CommunityDetail, Language } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface CommunityBannerProps {
  community: CommunityDetail;
  lang: Language;
  onJoin: () => void;
  onLeave: () => void;
}

export const CommunityBanner: React.FC<CommunityBannerProps> = ({ community, lang, onJoin, onLeave }) => {
  const navigate = useNavigate();
  const formatCount = (n: number) => n.toLocaleString();
  const isModOrAdmin = community.userRole === 'admin' || community.userRole === 'moderator';

  return (
    <div className="w-full">
      <div className="h-32 relative overflow-visible" style={{ backgroundColor: community.bannerColor }}>
        <div className="absolute bottom-4 left-6">
          <h1 className="text-2xl font-bold text-white">{community.name}</h1>
          <p className="text-sm text-[#A8692A] font-['Noto_Sans_Ethiopic'] mt-0.5">{community.nameAm}</p>
        </div>
      </div>
      <div className="bg-white border-b border-[#DDD0BE] px-6 py-3">
        <div className="flex items-center justify-between max-w-[1280px] mx-auto">
          <div className="flex items-end gap-4">
            <div
              className="w-16 h-16 rounded-2xl border-4 border-white -mt-8 z-10 flex items-center justify-center text-3xl shadow-md relative"
              style={{ backgroundColor: community.iconBg }}
            >
              {community.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1A0F00]">{community.name}</h2>
              <p className="text-sm text-[#9C836A] font-['Noto_Sans_Ethiopic']">{community.nameAm}</p>
              <p className="text-xs text-[#9C836A] mt-1">
                {lang === 'en' ? `${formatCount(community.memberCount)} members` : `${formatCount(community.memberCount)} አባላት`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isModOrAdmin && (
              <Button variant="ghost" onClick={() => navigate(`/mod/dashboard?community=${community.id}`)}>
                {lang === 'en' ? 'Manage' : 'አስተዳድር'}
              </Button>
            )}
            {community.isSensitive && <Badge type="sensitive" lang={lang} />}
            {community.isJoined ? (
              <Button variant="ghost" onClick={onLeave}>
                {lang === 'en' ? 'Joined ✓' : 'ተቀላቅለዋል ✓'}
              </Button>
            ) : (
              <Button variant="primary" onClick={onJoin}>
                {lang === 'en' ? 'Join community' : 'ተቀላቀሉ'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
