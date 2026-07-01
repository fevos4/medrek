import React from 'react';
import type { Language, BannedUser } from '../../types';

interface BannedUserCardProps {
  bannedUser: BannedUser;
  lang: Language;
  onUnban: (bannedUserId: string) => void;
}

const getInitials = (name: string) => name.split('_').map(s => s[0]).join('').toUpperCase().slice(0, 2);

export const BannedUserCard: React.FC<BannedUserCardProps> = ({ bannedUser, lang, onUnban }) => {
  return (
    <div className="bg-white border border-[#DDD0BE] rounded-[9px] p-4 mb-2 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#FEE2E2] flex items-center justify-center text-xs font-bold text-[#C0392B]">{getInitials(bannedUser.username)}</div>
        <div>
          <p className="text-sm font-bold text-[#1A0F00]">{bannedUser.username}</p>
          <p className="text-xs text-[#9C836A] mt-0.5">{lang === 'en' ? `Banned for: ${bannedUser.reason}` : `የታገዱት በ: ${bannedUser.reason}`}</p>
          <p className="text-[10px] text-[#9C836A] mt-0.5">{lang === 'en' ? `Banned ${bannedUser.bannedAt} by ${bannedUser.bannedBy}` : `የታገዱት ${bannedUser.bannedAt} በ ${bannedUser.bannedBy}`}</p>
        </div>
      </div>
      <button className="border border-[#5A7A2A] text-[#5A7A2A] text-xs font-semibold px-3 py-1.5 rounded-md cursor-pointer hover:bg-[#EAF3DE]" onClick={() => onUnban(bannedUser.id)}>{lang === 'en' ? 'Unban' : 'እገዳ አንሳ'}</button>
    </div>
  );
};
