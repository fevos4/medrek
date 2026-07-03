import React, { useState } from 'react';
import type { Language } from '../../types';

interface ShareModalProps {
  isOpen: boolean;
  url: string;
  lang: Language;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, url, lang, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => { setCopied(false); onClose(); }, 1200);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(26,15,0,0.6)] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-[12px] sm:rounded-[12px] w-full max-w-[360px] sm:max-w-[400px] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="bg-[#1A0F00] px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center flex-shrink-0">
          <div>
            <p className="text-sm font-bold text-white">{lang === 'en' ? 'Share' : 'አጋራ'}</p>
          </div>
          <span className="text-[#9C836A] hover:text-white text-lg cursor-pointer font-bold" onClick={onClose}>✕</span>
        </div>
        <div className="px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center gap-3 p-3 border border-[#DDD0BE] rounded-lg cursor-pointer hover:border-[#A8692A] hover:bg-[#FAF4EC] transition-colors" onClick={handleCopy}>
            <svg className="flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B3F00" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#1A0F00]">{lang === 'en' ? 'Copy link' : 'ሊንክ ቅዳ'}</p>
              <p className="text-xs text-[#9C836A] truncate">{url}</p>
            </div>
            {copied && <span className="text-xs text-[#5A7A2A] font-semibold flex-shrink-0">{lang === 'en' ? 'Copied!' : 'ተቅዷል!'}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
