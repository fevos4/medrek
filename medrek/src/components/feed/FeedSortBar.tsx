import React from 'react';
import type { SortOption, Language } from '../../types';

interface FeedSortBarProps {
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  lang: Language;
}

export const FeedSortBar: React.FC<FeedSortBarProps> = ({ activeSort, onSortChange, lang }) => {
  const options: { id: SortOption; en: string; am: string; icon: string }[] = [
    { id: 'hot', en: 'Hot', am: 'ሞቃት', icon: '🔥' },
    { id: 'new', en: 'New', am: 'አዲስ', icon: '✨' },
    { id: 'top', en: 'Top', am: 'ምርጥ', icon: '⬆️' },
    { id: 'rising', en: 'Rising', am: 'እያደገ', icon: '📈' },
  ];

  return (
    <div className="bg-white border border-[#DDD0BE] rounded-[9px] p-2 flex items-center gap-1 mb-2">
      {options.map((opt, idx) => (
        <React.Fragment key={opt.id}>
          <button
            onClick={() => onSortChange(opt.id)}
            className={`text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1 transition-colors ${
              activeSort === opt.id ? 'bg-[#F2E0C8] text-[#4A2C00]' : 'text-[#9C836A] hover:bg-[#FAF4EC]'
            }`}
          >
            {opt.icon} {lang === 'en' ? opt.en : opt.am}
          </button>
          {idx < options.length - 1 && (
            <div className="w-[0.5px] h-4 bg-[#DDD0BE] mx-1" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};