import React, { useState, useEffect, useRef } from 'react';
import type { Community, Language } from '../../types';

interface CommunitySelectorProps {
  communities: Community[];
  selectedId: string;
  onSelect: (id: string) => void;
  lang: Language;
}

export const CommunitySelector: React.FC<CommunitySelectorProps> = ({ communities, selectedId, onSelect, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = communities.find(c => c.id === selectedId);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border border-[#DDD0BE] rounded-[9px] px-4 py-3 flex items-center justify-between cursor-pointer hover:border-[#A8692A] transition-colors"
      >
        <div className="flex items-center gap-3">
          {selected ? (
            <>
              <div className="w-6 h-6 rounded flex items-center justify-center text-xs" style={{ backgroundColor: selected.iconBg }}>
                {selected.icon}
              </div>
              <div>
                <span className="text-sm font-semibold text-[#1A0F00]">{selected.name}</span>
                <span className="text-[10px] text-[#9C836A] font-['Noto_Sans_Ethiopic'] ml-1">{selected.nameAm}</span>
              </div>
            </>
          ) : (
            <span className="text-sm text-[#9C836A]">{lang === 'en' ? 'Choose a community' : 'ማህበረሰብ ይምረጡ'}</span>
          )}
        </div>
        <span className={`text-[#9C836A] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-10 bg-white border border-[#DDD0BE] rounded-[9px] shadow-md mt-1 max-h-48 overflow-y-auto">
          {communities.map(c => (
            <div
              key={c.id}
              onClick={() => { onSelect(c.id); setIsOpen(false); }}
              className="px-3 py-2 flex items-center gap-3 cursor-pointer hover:bg-[#F2E0C8]"
            >
              <div className="w-6 h-6 rounded flex items-center justify-center text-xs flex-shrink-0" style={{ backgroundColor: c.iconBg }}>
                {c.icon}
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold text-[#1A0F00]">{c.name}</span>
                <span className="text-[10px] text-[#9C836A] font-['Noto_Sans_Ethiopic'] ml-1">{c.nameAm}</span>
              </div>
              {c.id === selectedId && <span className="text-[#6B3F00] text-sm">✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
