import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Language } from '../../types';
import { LanguageToggle } from '../ui/LanguageToggle';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { communitiesAPI, mapCommunity } from '../../lib/api';
import { NotificationDropdown } from './NotificationDropdown';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  onLogin?: () => void;
  onSignup?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ lang, onToggleLang, onLogin, onSignup }) => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moderatedComms, setModeratedComms] = useState<any[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      communitiesAPI.getMyModerated().then(setModeratedComms).catch(() => {});
    } else {
      setModeratedComms([]);
    }
    communitiesAPI.getAll().then((data: any) => setCommunities(data.map(mapCommunity))).catch(() => {});
  }, [isLoggedIn]);

  return (
    <>
      <nav className="bg-[#1A0F00] h-14 px-4 flex items-center gap-4 sticky top-0 z-50">
        <button className="text-[#9C836A] hover:text-white md:hidden text-xl" onClick={() => setMenuOpen(true)}>☰</button>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/new_logo.png" alt="Medrek" className="w-14 h-14" />
          <span className="text-[#A8692A] text-base font-ethiopic leading-tight">መድረክ</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center justify-end">
          {!searchExpanded ? (
            <button 
              onClick={() => setSearchExpanded(true)} 
              className="text-[#9C836A] hover:text-white p-2 rounded-full hover:bg-[#2E1A00] transition-colors focus:outline-none flex items-center gap-1.5 text-sm"
              title={lang === 'en' ? 'Search' : 'ፈልግ'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          ) : (
            <div className="flex items-center gap-2 max-w-[200px] sm:max-w-sm w-full transition-all duration-300">
              <input 
                type="text" 
                placeholder={lang === 'en' ? 'Search...' : 'ፈልግ...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                autoFocus
                className="bg-[#2E1A00] border border-[#4A2C00] text-[#FAF4EC] rounded-full px-3 py-1 w-full text-xs focus:outline-none focus:border-[#A8692A] placeholder-[#9C836A]" 
              />
              <button 
                onClick={() => { setSearchExpanded(false); setSearchQuery(''); }} 
                className="text-[#9C836A] hover:text-white text-xs p-1 rounded-full hover:bg-[#2E1A00] transition-colors"
              >
                ✕
              </button>
            </div>
          )}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <span className="text-[10px] text-[#A8692A] hover:underline cursor-pointer" onClick={() => navigate('/guidelines')}>{lang === 'en' ? 'Guidelines' : 'መመሪያዎች'}</span>
          <LanguageToggle lang={lang} onToggle={onToggleLang} />
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <NotificationDropdown lang={lang} />
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(`/u/${user?.username}`)}>
                <div className="w-7 h-7 rounded-full bg-[#E4C49A] flex items-center justify-center text-[#4A2C00] text-xs font-bold">
                  {user?.username?.slice(0,2).toUpperCase()}
                </div>
                <span className="text-[#FAF4EC] text-xs font-semibold hidden md:block">{user?.username}</span>
              </div>
              <button onClick={logout} className="text-[#9C836A] text-xs hover:text-[#FAF4EC]">{lang === 'en' ? 'Log out' : 'ውጣ'}</button>
            </div>
          ) : (
            <>
              <button
                onClick={() => (onLogin ? onLogin() : navigate('/login'))}
                className="text-[#9C836A] text-xs font-semibold hover:text-[#FAF4EC] transition-colors bg-transparent border-none cursor-pointer"
              >
                {lang === 'en' ? 'Log in' : 'ግባ'}
              </button>
              <button
                onClick={() => (onSignup ? onSignup() : navigate('/register'))}
                className="text-[#C9904F] text-xs font-semibold hover:text-[#FAF4EC] transition-colors bg-transparent border-none cursor-pointer"
              >
                {lang === 'en' ? 'Sign up' : 'ይመዝገቡ'}
              </button>
            </>
          )}
        </div>
        <div className="flex md:hidden items-center gap-2">
          {isLoggedIn && <NotificationDropdown lang={lang} />}
          <LanguageToggle lang={lang} onToggle={onToggleLang} />
        </div>
      </nav>
      {menuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-[rgba(26,15,0,0.6)]" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#FAF4EC] shadow-lg flex flex-col">
            <div className="bg-[#1A0F00] px-4 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <img src="/new_logo.png" alt="Medrek" className="w-10 h-10" />
                <span className="text-[#FAF4EC] font-bold uppercase tracking-wider text-xs">መድረክ</span>
              </div>
              <button className="text-[#9C836A] hover:text-white text-lg" onClick={() => setMenuOpen(false)}>✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#9C836A] mb-3">{lang === 'en' ? 'NAVIGATION' : 'ዳሰሳ'}</p>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-[7px] text-[#5C4A32] hover:bg-[#F2E0C8] cursor-pointer" onClick={() => { navigate('/'); setMenuOpen(false); }}>🏠 <span className="text-sm">{lang === 'en' ? 'Home' : 'ማእከል'}</span></div>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-[7px] text-[#5C4A32] hover:bg-[#F2E0C8] cursor-pointer" onClick={() => { navigate('/guidelines'); setMenuOpen(false); }}>📋 <span className="text-sm">{lang === 'en' ? 'Guidelines' : 'መመሪያዎች'}</span></div>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-[7px] text-[#5C4A32] hover:bg-[#F2E0C8] cursor-pointer" onClick={() => { navigate('/create-post'); setMenuOpen(false); }}>✏️ <span className="text-sm">{lang === 'en' ? 'Create Post' : 'ልጥፍ ጻፍ'}</span></div>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-[7px] text-[#5C4A32] hover:bg-[#F2E0C8] cursor-pointer" onClick={() => { navigate('/create-community'); setMenuOpen(false); }}>➕ <span className="text-sm">{lang === 'en' ? 'Create Community' : 'ማህበረሰብ ፍጠር'}</span></div>
              </div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#9C836A] mb-3 mt-5">{lang === 'en' ? 'COMMUNITIES' : 'ማህበረሰቦች'}</p>
              <div className="flex flex-col gap-1">
                {communities.map(c => (
                  <div key={c.id} className="flex items-center gap-3 px-3 py-2 rounded-[7px] text-[#5C4A32] hover:bg-[#F2E0C8] cursor-pointer" onClick={() => { navigate(`/community/${c.id}`); setMenuOpen(false); }}>
                    <div className="w-5 h-5 rounded flex items-center justify-center text-[9px] flex-shrink-0" style={{ backgroundColor: c.iconBg }}>{c.icon}</div>
                    <span className="text-sm">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Bottom section — profile & logout */}
            <div className="flex-shrink-0 border-t border-[#DDD0BE] p-4">
              {isLoggedIn ? (
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => { navigate(`/u/${user?.username}`); setMenuOpen(false); }}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#E4C49A] flex items-center justify-center text-[#4A2C00] text-xs font-bold">{user?.username?.slice(0,2).toUpperCase()}</div>
                    <span className="text-sm font-semibold text-[#1A0F00]">{user?.username}</span>
                  </div>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="text-xs text-[#9C836A] hover:text-[#C0392B] transition-colors bg-transparent border-none cursor-pointer font-semibold"
                  >
                    {lang === 'en' ? 'Log out' : 'ውጣ'}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" fullWidth onClick={() => { if (onLogin) onLogin(); else navigate('/login'); setMenuOpen(false); }}>{lang === 'en' ? 'Log in' : 'ግባ'}</Button>
                  <Button variant="primary" fullWidth onClick={() => { if (onSignup) onSignup(); else navigate('/register'); setMenuOpen(false); }}>{lang === 'en' ? 'Sign up' : 'ይመዝገቡ'}</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
