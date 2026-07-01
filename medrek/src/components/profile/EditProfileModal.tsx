import React, { useState } from 'react';
import type { Language } from '../../types';
import { usersAPI } from '../../lib/api';
import { Button } from '../ui/Button';

interface EditProfileModalProps {
  isOpen: boolean;
  currentBio: string;
  lang: Language;
  onClose: () => void;
  onSave: (newBio: string) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, currentBio, lang, onClose, onSave }) => {
  const [bioInput, setBioInput] = useState(currentBio || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await usersAPI.updateProfile({ bio: bioInput });
      onSave(bioInput);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(26,15,0,0.6)] flex items-center justify-center p-4">
      <div className="bg-white rounded-[12px] w-full max-w-[440px] overflow-hidden">
        <div className="bg-[#1A0F00] px-6 py-4 flex justify-between items-center">
          <span className="text-sm font-bold text-white">
            {lang === 'en' ? 'Edit profile' : 'መገለጫ አርትዕ'}
          </span>
          <button onClick={onClose} className="text-[#9C836A] hover:text-white text-lg leading-none">&times;</button>
        </div>
        <div className="px-6 py-5">
          <label className="text-sm font-bold text-[#1A0F00] mb-1 block">
            {lang === 'en' ? 'Bio' : 'ስለ እርስዎ'}
          </label>
          <textarea
            rows={4}
            maxLength={200}
            value={bioInput}
            onChange={e => setBioInput(e.target.value)}
            className="w-full border border-[#DDD0BE] rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#A8692A]"
            placeholder={lang === 'en' ? 'Tell the community about yourself...' : 'ስለ እራስዎ ይንገሩ...'}
          />
          <p className="text-xs text-[#9C836A] text-right mt-1">{bioInput.length} / 200</p>
        </div>
        <div className="border-t border-[#F2E0C8] px-6 py-4 flex gap-3 justify-end">
          <Button variant="ghost" onClick={onClose}>
            {lang === 'en' ? 'Cancel' : 'ሰርዝ'}
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {lang === 'en' ? 'Save changes' : 'ለውጦችን አስቀምጥ'}
          </Button>
        </div>
      </div>
    </div>
  );
};
