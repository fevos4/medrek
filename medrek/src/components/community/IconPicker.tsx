import React, { useRef } from 'react';

interface IconPickerProps {
  lang: 'en' | 'am';
  onImageSelect?: (file: File) => void;
  imagePreview?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({ lang, onImageSelect, imagePreview }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      {onImageSelect && (
        <div className="mb-3">
          <p className="text-xs font-bold text-[#9C836A] uppercase tracking-wide mb-2">{lang === 'en' ? 'PROFILE PICTURE' : 'የመገለጫ ምስል'}</p>
          <div className="flex items-center gap-3">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 rounded-2xl border-2 border-dashed border-[#DDD0BE] flex items-center justify-center text-2xl cursor-pointer hover:border-[#A8692A] transition-colors overflow-hidden"
            >
              {imagePreview ? <img src={imagePreview} alt="" className="w-full h-full object-cover" /> : '📷'}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f && onImageSelect) onImageSelect(f); }} className="hidden" />
            <span className="text-xs text-[#9C836A]">{lang === 'en' ? 'Upload an image' : 'ምስል ጫን'}</span>
          </div>
        </div>
      )}
    </div>
  );
};
