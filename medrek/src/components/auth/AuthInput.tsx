import React, { useState } from 'react';
import type { Language } from '../../types';

interface AuthInputProps {
  label: string;
  labelAm: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  placeholderAm?: string;
  lang: Language;
  error?: string;
  required?: boolean;
  hint?: string;
  hintAm?: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label, labelAm, type, value, onChange, placeholder, placeholderAm,
  lang, error, required, hint, hintAm
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;
  const displayPlaceholder = lang === 'en' && placeholder ? placeholder : placeholderAm || placeholder || '';

  return (
    <div className="mb-4">
      <div className="flex items-center gap-1 mb-1">
        <label className="text-sm font-bold text-[#1A0F00]">{lang === 'en' ? label : labelAm}</label>
        {required && <span className="text-[#C0392B] text-xs">*</span>}
      </div>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={displayPlaceholder}
          className={`w-full border rounded-lg px-4 py-3 text-sm text-[#1A0F00] placeholder:text-[#9C836A] focus:outline-none focus:border-[#A8692A] focus:ring-2 focus:ring-[#C9904F]/10 transition-colors ${
            error ? 'border-[#C0392B] bg-[#FEF2F2]' : 'border-[#DDD0BE]'
          }`}
        />
        {type === 'password' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C836A] cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? '👁' : '👁‍🗨'}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-[#C0392B] mt-1 flex items-center gap-1">⚠ {error}</p>}
      {!error && hint && (
        <p className="text-xs text-[#9C836A] mt-1">
          {lang === 'en' ? hint : hintAm} <span className="font-['Noto_Sans_Ethiopic']">{lang === 'en' ? '' : hintAm}</span>
        </p>
      )}
    </div>
  );
};
