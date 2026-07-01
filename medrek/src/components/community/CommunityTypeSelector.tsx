import React from 'react';
import type { Language } from '../../types';

interface CommunityTypeSelectorProps {
  selected: 'public' | 'private' | 'restricted';
  onChange: (type: 'public' | 'private' | 'restricted') => void;
  lang: Language;
}

const types: { value: 'public' | 'private' | 'restricted'; icon: string; nameEn: string; nameAm: string; descEn: string; descAm: string }[] = [
  { value: 'public', icon: '🌍', nameEn: 'Public', nameAm: 'ይፋዊ', descEn: 'Anyone can view and post. Best for open discussions.', descAm: 'ሁሉም ማየት እና መለጠፍ ይችላል።' },
  { value: 'private', icon: '🔒', nameEn: 'Private', nameAm: 'የግል', descEn: 'Only approved members can view and post.', descAm: 'የተፈቀደላቸው አባላት ብቻ ማየት ይችላሉ።' },
  { value: 'restricted', icon: '🛡', nameEn: 'Restricted', nameAm: 'የተገደበ', descEn: 'Anyone can view but only approved members can post.', descAm: 'ሁሉም ማየት ይችላል፤ የተፈቀደላቸው ብቻ ይለጥፋሉ።' },
];

export const CommunityTypeSelector: React.FC<CommunityTypeSelectorProps> = ({ selected, onChange, lang }) => {
  return (
    <div className="flex flex-col gap-3 mb-5">
      {types.map(t => {
        const isSelected = selected === t.value;
        return (
          <div key={t.value} className={`flex items-start gap-4 p-4 border rounded-[9px] cursor-pointer transition-colors ${isSelected ? 'border-[#6B3F00] bg-[#F2E0C8]' : 'border-[#DDD0BE] hover:border-[#A8692A]'}`} onClick={() => onChange(t.value)}>
            <div className={`w-4 h-4 rounded-full border-2 mt-1 flex-shrink-0 flex items-center justify-center ${isSelected ? 'border-[#6B3F00]' : 'border-[#DDD0BE]'}`}>
              {isSelected && <div className="w-2 h-2 rounded-full bg-[#6B3F00]" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>{t.icon}</span>
                <span className="text-sm font-bold text-[#1A0F00]">{t.nameEn}</span>
                <span className="text-xs text-[#9C836A] font-['Noto_Sans_Ethiopic']">{t.nameAm}</span>
              </div>
              <p className="text-xs text-[#5C4A32] mt-1 leading-relaxed">{lang === 'en' ? t.descEn : t.descEn}</p>
              <p className="text-[10px] text-[#9C836A] font-['Noto_Sans_Ethiopic']">{lang === 'en' ? '' : t.descAm}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
