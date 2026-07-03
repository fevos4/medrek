import React, { useRef } from 'react';

const EMOJI_OPTIONS = ['🌍', '🌎', '🌏', '💻', '🎮', '🎵', '📚', '🎨', '🏀', '⚽', '🍕', '☕', '🐱', '🐶', '🌸', '🌟', '🔥', '💡', '🎭', '📸'];

interface IconPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  lang: 'en' | 'am';
  onImageSelect?: (file: File) => void;
  imagePreview?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange, lang, onImageSelect, imagePreview }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div className="mb-3">
        <p className="text-xs font-bold text-[#9C836A] uppercase tracking-wide mb-2">{lang === 'en' ? 'COMMUNITY ICON' : 'የማህበረሰብ አዶ'}</p>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-16 h-16 rounded-2xl border-2 border-[#DDD0BE] flex items-center justify-center text-2xl bg-white">
            {imagePreview ? <img src={imagePreview} alt="" className="w-full h-full object-cover rounded-2xl" /> : value}
          </div>
          {onImageSelect && (
            <>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-2xl border-2 border-dashed border-[#DDD0BE] flex items-center justify-center text-2xl cursor-pointer hover:border-[#A8692A] transition-colors overflow-hidden"
              >
                📷
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f && onImageSelect) onImageSelect(f); }} className="hidden" />
              <span className="text-xs text-[#9C836A]">{lang === 'en' ? 'Upload image' : 'ምስል ጫን'}</span>
            </>
          )}
        </div>
        <p className="text-[10px] text-[#9C836A] mb-1">{lang === 'en' ? 'Pick an emoji or upload an image:' : 'ኢሞጂ ይምረጡ ወይም ምስል ይጫኑ፡'}</p>
        <div className="flex flex-wrap gap-1">
          {EMOJI_OPTIONS.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => onChange(emoji)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-colors ${
                value === emoji && !imagePreview
                  ? 'bg-[#6B3F00] bg-opacity-20 border border-[#6B3F00]'
                  : 'hover:bg-[#DDD0BE] border border-transparent'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
