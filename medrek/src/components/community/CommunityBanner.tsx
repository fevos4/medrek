import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CommunityDetail, Language } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { uploadAPI, communitiesAPI } from '../../lib/api';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
function toFullUrl(path: string) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path}`;
}

interface CommunityBannerProps {
  community: CommunityDetail;
  lang: Language;
  onJoin: () => void;
  onLeave: () => void;
  isOwner?: boolean;
  isModOrAdmin?: boolean;
}

export const CommunityBanner: React.FC<CommunityBannerProps> = ({ community, lang, onJoin, onLeave, isOwner, isModOrAdmin }) => {
  const navigate = useNavigate();
  const [iconUrl, setIconUrl] = useState(community.iconUrl || '');
  const [bannerUrl, setBannerUrl] = useState(community.bannerUrl || '');
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIconUrl(community.iconUrl || '');
    setBannerUrl(community.bannerUrl || '');
  }, [community.iconUrl, community.bannerUrl]);

  const formatCount = (n: number) => n.toLocaleString();

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    setUploading(true);
    try {
      const result = await uploadAPI.uploadImage(file);
      await communitiesAPI.update(community.id, { iconUrl: result.imageUrl });
      setIconUrl(result.imageUrl);
    } catch (err: any) {
      console.error('Icon upload failed', err);
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    setUploading(true);
    try {
      const result = await uploadAPI.uploadImage(file);
      await communitiesAPI.update(community.id, { bannerUrl: result.imageUrl });
      setBannerUrl(result.imageUrl);
    } catch (err: any) {
      console.error('Banner upload failed', err);
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const displayIcon = iconUrl
    ? <img src={toFullUrl(iconUrl)} alt="" className="w-full h-full object-cover" />
    : (community.emoji || community.icon);

  return (
    <div className="w-full">
      <div className="h-48 relative overflow-visible" style={{ backgroundColor: bannerUrl ? 'transparent' : community.bannerColor }}>
        {bannerUrl && (
          <img src={toFullUrl(bannerUrl)} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        {(isModOrAdmin || isOwner) && (
          <>
            <button onClick={(e) => { e.stopPropagation(); bannerInputRef.current?.click(); }} className="absolute bottom-2 right-2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full w-7 h-7 flex items-center justify-center transition-colors" type="button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <input ref={bannerInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleBannerUpload} className="hidden" />
          </>
        )}
        {uploadError && <div className="absolute top-2 left-2 z-20 bg-[#C0392B] text-white text-xs px-2 py-1 rounded">{uploadError}</div>}
        {uploading && (
          <div className="absolute inset-0 z-30 bg-black/40 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
        <div className="absolute -bottom-6 left-4 z-10">
          <div className="relative w-16 h-16 rounded-2xl border-4 border-white shadow-md overflow-hidden flex items-center justify-center text-3xl" style={{ backgroundColor: community.iconBg }}>
            {displayIcon}
            {(isModOrAdmin || isOwner) && (
              <>
                <button onClick={(e) => { e.stopPropagation(); iconInputRef.current?.click(); }} className="absolute bottom-0 right-0 bg-black/50 hover:bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center transition-colors" type="button">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <input ref={iconInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleIconUpload} className="hidden" />
              </>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white border-b border-[#DDD0BE] px-6 py-3 pt-8">
        <div className="flex items-center justify-between max-w-[1280px] mx-auto">
          <div className="flex items-end gap-4">
            <div className="ml-0">
              <h2 className="text-xl font-bold text-[#1A0F00]">{community.name}</h2>
              <p className="text-sm text-[#9C836A] font-['Noto_Sans_Ethiopic']">{community.nameAm}</p>
              <p className="text-xs text-[#9C836A] mt-1">
                {lang === 'en' ? `${formatCount(community.memberCount)} members` : `${formatCount(community.memberCount)} አባላት`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-3">
            {isModOrAdmin && (
              <Button variant="ghost" onClick={() => navigate(`/mod/dashboard?community=${community.id}`)} className="border-0 text-xs px-1 md:px-2 py-1">
                <span className="md:hidden">⚙️</span>
                <span className="hidden md:inline">{lang === 'en' ? 'Manage' : 'አስተዳድር'}</span>
              </Button>
            )}
            {community.isSensitive && <Badge type="sensitive" lang={lang} />}
            {isOwner ? null : community.isJoined ? (
              <Button variant="ghost" onClick={onLeave}>
                <span className="md:hidden">✓</span>
                <span className="hidden md:inline">{lang === 'en' ? 'Joined ✓' : 'ተቀላቅለዋል ✓'}</span>
              </Button>
            ) : (
              <Button variant="primary" onClick={onJoin}>
                <span className="md:hidden">+</span>
                <span className="hidden md:inline">{lang === 'en' ? 'Join community' : 'ተቀላቀሉ'}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
