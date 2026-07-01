import React from 'react';
import { Link } from 'react-router-dom';
import type { Language } from '../../types';

interface CommunityPillProps {
  name: string;
  nameAm: string;
  lang: Language;
  communityId: string;
}

export const CommunityPill: React.FC<CommunityPillProps> = ({ name, nameAm, lang, communityId }) => {
  return (
    <Link to={`/community/${communityId}`} className="no-underline">
      <span className="bg-[#F2E0C8] text-[#4A2C00] border border-[#E4C49A] text-[10px] font-bold px-2 py-0.5 rounded inline-block">
        {lang === 'en' ? name : nameAm}
      </span>
    </Link>
  );
};