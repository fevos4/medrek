import React from 'react';
import type { PostType, Language } from '../../types';

interface PostTypeTabProps {
  activeType: PostType;
  onTypeChange: (type: PostType) => void;
  lang: Language;
}

const types: { id: PostType; icon: string; en: string; am: string }[] = [
  { id: 'text', icon: '📝', en: 'Text', am: 'ጽሑፍ' },
  { id: 'image', icon: '🖼', en: 'Image', am: 'ምስል' },
  { id: 'link', icon: '🔗', en: 'Link', am: 'ሊንክ' },
];

export const PostTypeTab: React.FC<PostTypeTabProps> = ({ activeType, onTypeChange, lang }) => {
  return (
    <div className="bg-white border border-[#DDD0BE] rounded-[9px] p-1 mb-4 flex flex-row">
      {types.map(t => (
        <div
          key={t.id}
          onClick={() => onTypeChange(t.id)}
          className={`flex-1 py-2 text-center text-sm cursor-pointer transition-colors duration-150 rounded-[7px] ${
            activeType === t.id
              ? 'bg-[#F2E0C8] text-[#4A2C00] font-bold'
              : 'text-[#9C836A] hover:text-[#4A2C00]'
          }`}
        >
          {t.icon} {lang === 'en' ? t.en : t.am}
        </div>
      ))}
    </div>
  );
};
