import React from 'react';
import { Link } from 'react-router-dom';
import type { Community } from '../../types';

interface CommunityItemProps {
  community: Community;
  isActive?: boolean;
}

export const CommunityItem: React.FC<CommunityItemProps> = ({ community, isActive }) => {
  return (
    <Link to={`/community/${community.id}`}
      className={`flex flex-row items-center gap-3 px-3 py-2 cursor-pointer transition-colors rounded-md mx-2 my-1 no-underline
        ${isActive ? 'bg-[#F2E0C8]' : 'hover:bg-[#F2E0C8]'}`}
    >
      <div 
        className="w-6 h-6 rounded flex items-center justify-center text-xs"
        style={{ backgroundColor: community.iconBg }}
      >
        {community.icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-[#1A0F00]">{community.name}</span>
        <span className="text-[10px] text-[#9C836A] font-ethiopic">{community.nameAm}</span>
      </div>
    </Link>
  );
};