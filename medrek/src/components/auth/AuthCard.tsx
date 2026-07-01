import React from 'react';
import type { Language } from '../../types';
import { Navbar } from '../layout/Navbar';

interface AuthCardProps {
  title: string;
  titleAm: string;
  subtitle?: string;
  subtitleAm?: string;
  children: React.ReactNode;
  lang: Language;
  onToggleLang: () => void;
  footer?: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  title, titleAm, subtitle, subtitleAm, children, lang, onToggleLang, footer
}) => {
  return (
    <div className="min-h-screen bg-[#F2E9DF] flex flex-col">
      <Navbar lang={lang} onToggleLang={onToggleLang} onLogin={() => {}} onSignup={() => {}} />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white border border-[#DDD0BE] rounded-[12px] w-full max-w-[440px] overflow-hidden shadow-sm">
          <div className="bg-[#1A0F00] px-8 py-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#4A2C00] rounded-lg text-[#C9904F] font-bold text-base flex items-center justify-center">M</div>
              <span className="text-white font-bold text-sm tracking-wider">MEDREK</span>
              <span className="text-[#A8692A] text-xs font-['Noto_Sans_Ethiopic'] ml-0.5">መድረክ</span>
            </div>
            <h1 className="text-xl font-bold text-white">{lang === 'en' ? title : titleAm}</h1>
            <p className="text-sm text-[#A8692A] font-['Noto_Sans_Ethiopic'] mt-0.5">{lang === 'en' ? '' : titleAm}</p>
            {subtitle && (
              <p className="text-xs text-[#9C836A] mt-2">{lang === 'en' ? subtitle : subtitleAm}</p>
            )}
          </div>
          <div className="px-8 py-6">{children}</div>
          {footer && (
            <div className="border-t border-[#F2E0C8] px-8 py-4 bg-[#FAF4EC]">{footer}</div>
          )}
        </div>
      </div>
    </div>
  );
};
