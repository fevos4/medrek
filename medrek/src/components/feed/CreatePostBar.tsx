import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Language } from '../../types';

interface CreatePostBarProps {
  userInitials: string;
  lang: Language;
  communityId?: string;
}

export const CreatePostBar: React.FC<CreatePostBarProps> = ({ userInitials, lang, communityId }) => {
  const navigate = useNavigate();
  const placeholder = lang === 'en' ? 'Share something with Ethiopia...' : 'ከኢትዮጵያ ጋር አጋሩ...';

  const handleClick = () => {
    if (communityId) {
      navigate(`/create-post?communityId=${communityId}`);
    } else {
      navigate('/create-post');
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white border border-[#DDD0BE] rounded-[9px] p-3 flex items-center gap-3 mb-2 cursor-pointer hover:border-[#A8692A] transition-colors"
    >
      <div className="w-8 h-8 rounded-full bg-[#E4C49A] text-[#4A2C00] flex items-center justify-center font-bold text-sm">
        {userInitials}
      </div>
      <input 
        type="text" 
        placeholder={placeholder}
        readOnly
        className="flex-1 bg-[#FAF4EC] border border-[#DDD0BE] rounded-full px-4 py-2 text-sm cursor-pointer focus:outline-none"
      />
    </div>
  );
};