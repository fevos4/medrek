import React from 'react';
import type { Language } from '../../types';

interface SocialDividerProps {
  lang: Language;
}

export const SocialDivider: React.FC<SocialDividerProps> = ({ lang }) => {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-[#DDD0BE]" />
      <span className="text-xs text-[#9C836A] font-semibold">{lang === 'en' ? 'OR' : 'ወይም'}</span>
      <div className="flex-1 h-px bg-[#DDD0BE]" />
    </div>
  );
};
