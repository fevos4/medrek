import React, { useState, useEffect } from 'react';
import type { Language } from '../../types';

const phrases = [
  { en: 'A place for your thoughts.', am: 'ሀሳብዎን የሚያጋሩበት ቦታ።' },
  { en: "Ethiopia's community forum.", am: 'የኢትዮጵያ ማህበረሰብ መድረክ።' },
  { en: 'Speak freely. Respect all.', am: 'በነፃነት ይናገሩ። ሁሉንም ያክብሩ።' },
  { en: 'Your voice matters here.', am: 'ድምፅዎ እዚህ ይሰማል።' },
  { en: 'Connect with Ethiopians.', am: 'ከኢትዮጵያውያን ጋር ይገናኙ።' }
];

const stats = [
  { value: '7', labelEn: 'Communities', labelAm: 'ማህበረሰቦች' },
  { value: '100%', labelEn: 'Ethiopian', labelAm: 'ኢትዮጵያዊ' },
  { value: 'Free', labelEn: 'Forever', labelAm: 'ለዘላለም' }
];

interface AuthBrandPanelProps {
  lang: Language;
}

export const AuthBrandPanel: React.FC<AuthBrandPanelProps> = ({ lang }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex(i => (i + 1) % phrases.length);
        setVisible(true);
      }, 700);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="hidden md:flex flex-col items-center justify-center w-1/2 h-screen relative overflow-hidden p-12"
      style={{
        background: `
          radial-gradient(circle at 20% 20%, rgba(74,44,0,0.6) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(107,63,0,0.4) 0%, transparent 50%),
          linear-gradient(160deg, #1A0F00 0%, #2E1A00 45%, #1A0F00 100%)
        `
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 15v10M15 20h10' stroke='%23C9904F' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}
      />
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full"
        style={{
          border: '1px solid transparent',
          background: 'radial-gradient(circle, transparent 60%, rgba(201,144,79,0.08) 100%)',
        }}
      />
      <div
        className="absolute top-1/3 -right-20 w-72 h-72 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(201,144,79,0.06) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(90,122,42,0.05) 0%, transparent 70%)',
        }}
      />
      <div className="z-10 relative flex flex-col items-center">
        <div className="relative mb-0">
          <div
            className="absolute inset-0 blur-xl opacity-40"
            style={{ background: 'radial-gradient(circle, #C9904F 0%, transparent 70%)' }}
          />
          <img src="/new_logo.png" alt="Medrek" className="relative w-64 h-64 object-contain" />
        </div>
        <div className="text-center min-h-[100px] flex flex-col items-center justify-center mt-2">
          <div className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <p className="text-2xl font-bold text-white leading-snug text-center max-w-xs mx-auto">{phrases[currentIndex].en}</p>
            <p className="text-base text-[#C9904F]/80 mt-2 text-center font-['Noto_Sans_Ethiopic']">{phrases[currentIndex].am}</p>
          </div>
        </div>
        <div className="flex gap-1.5 justify-center mt-6">
          {phrases.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-6 bg-[#C9904F]' : 'w-1 bg-[#4A2C00]'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-6 mt-12">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#C9904F]">{stat.value}</div>
                <div className="text-[10px] text-[#9C836A] uppercase tracking-wide mt-1">{lang === 'en' ? stat.labelEn : stat.labelAm}</div>
              </div>
              {i < stats.length - 1 && <div className="w-px h-8 bg-[#4A2C00]" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
