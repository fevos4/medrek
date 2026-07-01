import React from 'react';
import type { Language } from '../../types';
import { Button } from './Button';

interface SensitiveWarningModalProps {
  isOpen: boolean;
  communityName: string;
  communityNameAm: string;
  lang: Language;
  onConfirm: () => void;
  onGoBack: () => void;
}

export const SensitiveWarningModal: React.FC<SensitiveWarningModalProps> = ({
  isOpen, communityName, communityNameAm, lang, onConfirm, onGoBack
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(26,15,0,0.6)] flex items-center justify-center p-4">
      <div className="bg-white rounded-[12px] w-full max-w-[420px] overflow-hidden">
        <div className="bg-[#1A0F00] px-6 py-4 text-center">
          <div className="text-3xl mb-1">⚠</div>
          <p className="text-base font-bold text-white">{lang === 'en' ? 'Sensitive Community' : 'ሚስጥራዊ ማህበረሰብ'}</p>
          <p className="text-xs text-[#A8692A] font-['Noto_Sans_Ethiopic'] mt-0.5">{lang === 'en' ? '' : 'ሚስጥራዊ ማህበረሰብ'}</p>
        </div>
        <div className="px-6 py-5 text-center">
          <div className="bg-[#F2E0C8] rounded-lg px-4 py-2 inline-block mb-4">
            <span className="text-sm font-bold text-[#4A2C00]">{communityName}</span>
            <span className="text-sm text-[#4A2C00]"> / </span>
            <span className="text-sm text-[#6B3F00] font-['Noto_Sans_Ethiopic']">{communityNameAm}</span>
          </div>
          <p className="text-sm text-[#1A0F00] leading-relaxed mb-2">
            {lang === 'en' ? 'This community discusses sensitive topics including politics, religion, or other challenging subjects.' : ''}
          </p>
          <p className="text-xs text-[#5C4A32] font-['Noto_Sans_Ethiopic'] leading-relaxed mb-5">
            {lang === 'en' ? '' : 'ይህ ማህበረሰብ ፖለቲካን፣ ሃይማኖትን ወይም ሌሎች ሚስጥራዊ ጉዳዮችን ይወያያል።'}
          </p>
          <div className="bg-[#FEF0E0] border border-[#E4C49A] rounded-lg px-4 py-3 mb-5 text-left">
            <div className="flex items-start gap-2 mb-1 last:mb-0">
              <div className="w-1.5 h-1.5 rounded-full bg-[#A8692A] mt-[5px] flex-shrink-0" />
              <p className="text-xs text-[#7A3B00]">{lang === 'en' ? 'Engage respectfully with all viewpoints' : 'ከሁሉም አመለካከት ጋር በአክብሮት ይሳተፉ'}</p>
            </div>
            <div className="flex items-start gap-2 mb-1 last:mb-0">
              <div className="w-1.5 h-1.5 rounded-full bg-[#A8692A] mt-[5px] flex-shrink-0" />
              <p className="text-xs text-[#7A3B00]">{lang === 'en' ? 'No ethnic incitement or hate speech' : 'ብሔረተኝነት ወይም ጥላቻ ንግግር አይፈቀድም'}</p>
            </div>
            <div className="flex items-start gap-2 mb-1 last:mb-0">
              <div className="w-1.5 h-1.5 rounded-full bg-[#A8692A] mt-[5px] flex-shrink-0" />
              <p className="text-xs text-[#7A3B00]">{lang === 'en' ? 'Verify claims before sharing' : 'ከማጋራትዎ በፊት መረጃውን ያረጋግጡ'}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" fullWidth onClick={onGoBack}>{lang === 'en' ? 'Go back' : 'ተመለስ'}</Button>
            <Button variant="primary" fullWidth onClick={onConfirm}>{lang === 'en' ? 'I understand, enter' : 'ገባኝ፣ ግባ'}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
