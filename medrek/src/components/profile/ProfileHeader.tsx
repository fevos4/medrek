import React from 'react';
import type { UserProfile, Language } from '../../types';
import { formatUsername } from '../../lib/format';
import { Button } from '../ui/Button';

interface ProfileHeaderProps {
  user: UserProfile;
  lang: Language;
  onEditProfile?: () => void;
}

const formatKarma = (n: number) => n.toLocaleString();

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, lang, onEditProfile }) => {
  return (
    <div className="w-full bg-[#1A0F00] px-6 py-6">
      <div className="max-w-[1280px] mx-auto relative">
        {user.isCurrentUser && (
          <div className="absolute top-0 right-0">
            <Button variant="ghost" onClick={onEditProfile}>
              {lang === 'en' ? 'Edit profile' : 'መገለጫ አርትዕ'}
            </Button>
          </div>
        )}
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-full flex items-center justify-center border-[3px] border-[#4A2C00] flex-shrink-0" style={{ backgroundColor: user.avatarColor }}>
            <span className="text-2xl font-bold text-[#4A2C00]">{user.initials}</span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white font-['Montserrat']">{user.username}</h1>
            <p className="text-xs text-[#9C836A] mt-0.5">{formatUsername(user.username)}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[#C9904F] text-sm">▲</span>
              <span className="text-sm font-bold text-[#C9904F]">{formatKarma(user.karma)}</span>
              <span className="text-xs text-[#9C836A]">{lang === 'en' ? 'karma' : 'ካርማ'}</span>
            </div>
            <p className="text-sm text-[#C9904F] mt-2 leading-relaxed">{user.bio}</p>
            <p className="text-xs text-[#A8692A] font-['Noto_Sans_Ethiopic'] leading-relaxed mt-1">{user.bioAm}</p>
          </div>
        </div>
        <div className="flex gap-4 mt-5 pt-4 border-t border-[#2E1A00]">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-white">{formatKarma(user.karma)}</span>
            <span className="text-[10px] text-[#9C836A] uppercase tracking-wide">{lang === 'en' ? 'Karma' : 'ካርማ'}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-white">{user.postCount}</span>
            <span className="text-[10px] text-[#9C836A] uppercase tracking-wide">{lang === 'en' ? 'Posts' : 'ልጥፎች'}</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-white">{user.joinedDate}</span>
            <span className="text-[10px] text-[#9C836A] uppercase tracking-wide">{lang === 'en' ? 'Joined' : 'የተቀላቀለበት'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
