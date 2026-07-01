import React from 'react';
import type { UserProfile, Language } from '../../types';

interface AboutTabProps {
  user: UserProfile;
  lang: Language;
}

const formatKarma = (n: number) => n.toLocaleString();

export const AboutTab: React.FC<AboutTabProps> = ({ user, lang }) => {
  const rows: { en: string; am: string; value: string }[] = [
    { en: 'Username', am: 'የተጠቃሚ ስም', value: user.username },
    { en: 'Joined', am: 'የተቀላቀሉበት', value: user.joinedDate },
    { en: 'Total karma', am: 'ጠቅላላ ካርማ', value: formatKarma(user.karma) },
    { en: 'Posts', am: 'ልጥፎች', value: String(user.postCount) },
    { en: 'Comments', am: 'አስተያየቶች', value: String(user.commentCount) },
  ];

  return (
    <div className="bg-white border border-[#DDD0BE] rounded-[9px] p-5">
      <h3 className="text-sm font-bold text-[#1A0F00] mb-3">{lang === 'en' ? 'About' : 'ስለ'}</h3>
      <p className="text-sm text-[#1A0F00] leading-relaxed">{user.bio}</p>
      <p className="text-xs text-[#5C4A32] font-['Noto_Sans_Ethiopic'] leading-relaxed mt-2">{user.bioAm}</p>
      <div className="border-t border-[#F2E0C8] my-4" />
      <h3 className="text-sm font-bold text-[#1A0F00] mb-3">{lang === 'en' ? 'Account info' : 'የመለያ መረጃ'}</h3>
      {rows.map(row => (
        <div key={row.en} className="flex justify-between py-2 border-b border-[#F2E0C8] last:border-0">
          <span className="text-xs text-[#9C836A] uppercase tracking-wide font-bold">
            {lang === 'en' ? row.en : row.am}
          </span>
          <span className="text-xs text-[#1A0F00] font-semibold">{row.value}</span>
        </div>
      ))}
    </div>
  );
};
