import React, { useState } from 'react';
import type { Language } from '../../types';
import { Button } from '../ui/Button';

interface CommentInputProps {
  lang: Language;
  onSubmit: (text: string) => void;
}

export const CommentInput: React.FC<CommentInputProps> = ({ lang, onSubmit }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim());
      setText('');
    }
  };

  return (
    <div className="bg-white border border-[#DDD0BE] rounded-[9px] p-4 mt-3">
      <label className="text-sm font-semibold text-[#1A0F00] mb-2 block">
        {lang === 'en' ? 'Add a comment' : 'አስተያየት ጨምር'}
      </label>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={lang === 'en' ? 'What do you think?' : 'አስተያየትዎ? / What do you think?'}
        className="border border-[#DDD0BE] rounded-lg w-full p-3 text-sm min-h-[80px] focus:outline-none focus:border-[#A8692A]"
      />
      <div className="flex justify-end mt-2">
        <Button variant="primary" onClick={handleSubmit}>
          {lang === 'en' ? 'Post comment' : 'አስተያየት ለጥፍ'}
        </Button>
      </div>
    </div>
  );
};
