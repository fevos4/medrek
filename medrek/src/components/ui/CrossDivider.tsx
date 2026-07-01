import React from 'react';

export const CrossDivider: React.FC = () => {
  return (
    <div className="flex items-center justify-center my-4 relative h-4">
      <div className="absolute w-full h-[1px] bg-[#C9904F] opacity-35" />
      <div className="relative flex items-center justify-center w-[12px] h-[12px]">
        <div className="absolute w-[12px] h-[2px] bg-[#C9904F] opacity-60" />
        <div className="absolute w-[2px] h-[12px] bg-[#C9904F] opacity-60" />
      </div>
    </div>
  );
};