import React from 'react';
import type { Language } from '../../types';

interface AnonymousToggleProps {
  isAnonymous: boolean;
  onToggle: () => void;
  lang: Language;
}

export const AnonymousToggle: React.FC<AnonymousToggleProps> = ({ isAnonymous, onToggle, lang }) => {
  return (
    <div className="bg-white border border-[#DDD0BE] rounded-[9px] px-4 py-3 flex items-center justify-between mb-6">
      <div>
        <div className="flex items-center">
          <span className="text-[#9C836A] mr-2">👤</span>
          <div>
            <p className="text-sm font-semibold text-[#1A0F00]">{lang === 'en' ? 'Post anonymously' : 'ስም-አልባ ይለጥፉ'}</p>
            <p className="text-xs text-[#9C836A] font-['Noto_Sans_Ethiopic']">{lang === 'en' ? '' : 'ስም-አልባ ይለጥፉ'}</p>
            <p className="text-[10px] text-[#9C836A] mt-0.5">
              {lang === 'en' ? 'Your username will be hidden. Mods can still see it.' : 'የተጠቃሚ ስምዎ ይደበቃል። ሞዴሬተሮች ይመለከቱታል።'}
            </p>
          </div>
        </div>
      </div>
      <div
        onClick={onToggle}
        className={`w-10 h-6 rounded-full cursor-pointer transition-colors duration-200 relative ${
          isAnonymous ? 'bg-[#6B3F00]' : 'bg-[#DDD0BE]'
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform duration-200 ${
            isAnonymous ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </div>
    </div>
  );
};
