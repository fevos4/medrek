import React from 'react';
import type { Language } from '../../types';

interface PostFormFieldProps {
  label?: string;
  labelAm?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  placeholderAm?: string;
  lang: Language;
  multiline?: boolean;
  maxLength?: number;
  required?: boolean;
}

export const PostFormField: React.FC<PostFormFieldProps> = ({
  label, labelAm, value, onChange, placeholder, placeholderAm,
  lang, multiline, maxLength, required
}) => {
  const displayLabel = lang === 'en' && label ? label : labelAm || label || '';
  const displayPlaceholder = lang === 'en' && placeholder ? placeholder : placeholderAm || placeholder || '';
  const pct = maxLength ? value.length / maxLength : 0;
  const countColor = pct > 0.8 ? 'text-[#C0392B]' : 'text-[#9C836A]';

  return (
    <div className="mb-4">
      {(displayLabel || maxLength) && (
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-bold text-[#1A0F00]">
            {displayLabel}
            {required && <span className="text-[#C0392B] text-xs ml-1">*</span>}
          </label>
          {maxLength && (
            <span className={`text-xs ${countColor}`}>{value.length} / {maxLength}</span>
          )}
        </div>
      )}
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={displayPlaceholder}
          className="w-full border border-[#DDD0BE] rounded-lg px-4 py-3 text-sm text-[#1A0F00] placeholder:text-[#9C836A] focus:outline-none focus:border-[#A8692A] transition-colors resize-none min-h-[120px]"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={displayPlaceholder}
          className="w-full border border-[#DDD0BE] rounded-lg px-4 py-3 text-sm text-[#1A0F00] placeholder:text-[#9C836A] focus:outline-none focus:border-[#A8692A] transition-colors"
        />
      )}
      {lang === 'am' && placeholderAm && (
        <p className="text-[10px] text-[#9C836A] mt-1">አማርኛም መጻፍ ይችላሉ</p>
      )}
    </div>
  );
};
