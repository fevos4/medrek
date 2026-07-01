import React from 'react';
import type { CommunityDetail, Language } from '../../types';
import { formatUsername } from '../../lib/format';

interface CommunityAboutCardProps {
  community: CommunityDetail;
  lang: Language;
}

export const CommunityAboutCard: React.FC<CommunityAboutCardProps> = ({ community, lang }) => {
  const formatCount = (n: number) => {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return n.toString();
  };

  return (
    <div className="bg-white border border-[#DDD0BE] rounded-[9px] mb-3 overflow-hidden">
      <div className="bg-[#2E1A00] px-3 py-2">
        <span className="text-xs font-bold text-[#FAF4EC]">{lang === 'en' ? 'About community' : 'ማህበረሰቡ'}</span>
      </div>
      <div className="p-3">
        <p className="text-xs text-[#5C4A32] leading-relaxed">{community.description}</p>
        <p className="text-xs text-[#5C4A32] font-['Noto_Sans_Ethiopic'] leading-loose mt-2">{community.descriptionAm}</p>
        <div className="border-t border-[#F2E0C8] my-3" />
        <div className="flex gap-2">
          <div className="flex-1 bg-[#FAF4EC] rounded-md p-2 text-center">
            <div className="text-xs font-bold text-[#1A0F00]">{formatCount(community.memberCount)}</div>
            <div className="text-[10px] text-[#9C836A]">{lang === 'en' ? 'Members' : 'አባላት'}</div>
          </div>
          <div className="flex-1 bg-[#FAF4EC] rounded-md p-2 text-center">
            <div className="text-xs font-bold text-[#1A0F00]">{community.type}</div>
            <div className="text-[10px] text-[#9C836A]">{lang === 'en' ? 'Type' : 'አይነት'}</div>
          </div>
        </div>
        <div className="border-t border-[#F2E0C8] my-3" />
        <div className="text-[10px] text-[#9C836A] uppercase tracking-wide font-bold">
          {lang === 'en' ? 'Created' : 'የተፈጠረበት'}
        </div>
        <div className="text-xs text-[#1A0F00] mt-0.5">{community.createdAt}</div>
        <div className="border-t border-[#F2E0C8] my-3" />
        <div className="text-[10px] text-[#9C836A] uppercase tracking-wide font-bold">
          {lang === 'en' ? 'Moderators' : 'አስተዳዳሪዎች'}
        </div>
        {community.moderators.map(mod => (
          <div key={mod} className="text-xs text-[#6B3F00] font-semibold cursor-pointer hover:underline mt-1">
            {formatUsername(mod)}
          </div>
        ))}
      </div>
    </div>
  );
};
