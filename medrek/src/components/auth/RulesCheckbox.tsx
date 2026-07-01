import React from 'react';
import type { Language } from '../../types';

interface RulesCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  lang: Language;
}

export const RulesCheckbox: React.FC<RulesCheckboxProps> = ({ checked, onChange, lang }) => {
  const pills = [
    lang === 'en' ? 'No hate speech' : 'ጥላቻ ንግግር የለም',
    lang === 'en' ? 'Respect religion' : 'ሃይማኖትን ያክብሩ',
    lang === 'en' ? 'No misinformation' : 'የተረጋገጠ መረጃ',
    lang === 'en' ? 'Treat with dignity' : 'በአክብሮት',
  ];

  return (
    <div className="bg-[#FAF4EC] border border-[#DDD0BE] rounded-[9px] p-4 mb-4">
      <div className="flex gap-3 items-start">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          className="w-4 h-4 mt-0.5 accent-[#6B3F00] cursor-pointer"
        />
        <div>
          <p className="text-sm text-[#1A0F00]">
            {lang === 'en' ? "I agree to Medrek's platform rules and community guidelines" : 'የመድረክን ደንቦች እና መመሪያዎች ተቀብያለሁ'}
          </p>
          <p className="text-xs text-[#5C4A32] font-['Noto_Sans_Ethiopic'] mt-0.5">
            {lang === 'en' ? '' : 'የመድረክን ደንቦች እና መመሪያዎች ተቀብያለሁ'}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {pills.map(p => (
              <span key={p} className="bg-[#F2E0C8] text-[#4A2C00] text-[10px] px-2 py-0.5 rounded font-semibold">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
