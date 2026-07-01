import React from 'react';
import type { Language } from '../../types';

interface LanguageToggleProps {
  lang: Language;
  onToggle: () => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ lang, onToggle }) => {
  return (
    <button 
      onClick={onToggle}
      className="border border-[#4A2C00] text-[#A8692A] text-xs font-semibold px-3 py-1 rounded bg-transparent hover:bg-[#2E1A00] transition-colors cursor-pointer"
    >
      {lang === 'en' ? 'EN / አማ' : 'አማ / EN'}
    </button>
  );
};