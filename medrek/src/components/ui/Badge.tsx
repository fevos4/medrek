import React from 'react';
import type { Language } from '../../types';

interface BadgeProps {
  type: 'anonymous' | 'sensitive';
  lang: Language;
}

export const Badge: React.FC<BadgeProps> = ({ type, lang }) => {
  if (type === 'anonymous') {
    return (
      <span className="bg-[#F2E9DF] text-[#5C4A32] border border-[#C9904F] text-[10px] font-semibold px-2 py-0.5 rounded">
        {lang === 'en' ? 'Anonymous' : 'ስም-አልባ'}
      </span>
    );
  }
  
  return (
    <span className="bg-[#FEF0E0] text-[#7A3B00] border border-[#E4C49A] text-[10px] font-semibold px-2 py-0.5 rounded">
      {lang === 'en' ? 'Sensitive' : 'ሚስጥራዊ'}
    </span>
  );
};