import React from 'react';
import type { ProfileTab, Language } from '../../types';

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  lang: Language;
  postCount: number;
  communityCount?: number;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange, lang, postCount, communityCount }) => {
  const tabs: { id: ProfileTab; en: string; am: string; count?: number }[] = [
    { id: 'posts', en: 'Posts', am: 'ልጥፎች', count: postCount },
    { id: 'communities', en: 'Groups', am: 'ቡድኖች', count: communityCount },
    { id: 'about', en: 'About', am: 'ስለ' },
  ];

  return (
    <div className="bg-white border-b border-[#DDD0BE] px-6">
      <div className="flex gap-0 max-w-[1280px] mx-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-[#6B3F00] text-[#1A0F00] font-bold'
                : 'text-[#9C836A] font-medium hover:text-[#4A2C00]'
            }`}
          >
            {lang === 'en' ? tab.en : tab.am}
            {tab.count !== undefined && (
              <span className="bg-[#F2E0C8] text-[#4A2C00] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
