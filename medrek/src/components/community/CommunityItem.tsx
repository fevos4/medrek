import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import type { Community } from '../../types';

interface CommunityItemProps {
  community: Community;
  isActive?: boolean;
}

export const CommunityItem = memo(
  ({ community, isActive }: CommunityItemProps) => {
    return (
      <Link
        to={`/community/${community.id}`}
        className={`flex flex-row items-center gap-3 px-3 py-2 cursor-pointer transition-colors rounded-md mx-2 my-1 no-underline
        ${isActive ? 'bg-[#F2E0C8]' : 'hover:bg-[#F2E0C8]'}`}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 overflow-hidden"
          style={{ backgroundColor: community.iconBg }}
        >
          {community.iconUrl ? (
            <img
              src={community.iconUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            community.icon
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-bold text-[#1A0F00]">
            {community.name}
          </span>

          <span className="text-[10px] text-[#9C836A] font-ethiopic">
            {community.nameAm}
          </span>
        </div>
      </Link>
    );
  }
);