import React from 'react';
import type { Language } from '../../types';

interface IconPickerProps {
  selected: string;
  onChange: (icon: string) => void;
  lang: Language;
}

const icons = ['🏛', '🌍', '⚽', '💻', '🍛', '📚', '💼', '🎵', '🏥', '✈️', '🌿', '🎨', '📰', '🏗', '💬', '🙏', '⚖️', '🎓', '🌙', '❤️'];

export const IconPicker: React.FC<IconPickerProps> = ({ selected, onChange, lang }) => {
  return (
    <div className="mb-4">
      <p className="text-xs font-bold text-[#9C836A] uppercase tracking-wide mb-2">{lang === 'en' ? 'Community icon' : 'አዶ'}</p>
      <div className="grid grid-cols-10 gap-2 mb-1">
        {icons.map(icon => (
          <button key={icon} type="button" className={`w-9 h-9 rounded-lg flex items-center justify-center text-xl cursor-pointer border transition-colors ${selected === icon ? 'border-[#6B3F00] bg-[#F2E0C8]' : 'border-transparent hover:bg-[#F2E0C8]'}`} onClick={() => onChange(icon)}>
            {icon}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-3 p-3 bg-[#FAF4EC] rounded-lg border border-[#DDD0BE]">
        <div className="w-10 h-10 rounded-lg bg-[#F2E0C8] flex items-center justify-center text-2xl">{selected}</div>
        <div>
          <p className="text-[10px] text-[#9C836A] uppercase tracking-wide">{lang === 'en' ? 'Preview' : 'ቅድመ-እይታ'}</p>
          <p className="text-sm text-[#1A0F00] font-semibold">{selected}</p>
        </div>
      </div>
    </div>
  );
};
