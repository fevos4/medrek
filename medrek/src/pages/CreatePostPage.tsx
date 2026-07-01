import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Language, CreatePostForm } from '../types';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { PostTypeTab } from '../components/post/PostTypeTab';
import { CommunitySelector } from '../components/post/CommunitySelector';
import { PostFormField } from '../components/post/PostFormField';
import { AnonymousToggle } from '../components/post/AnonymousToggle';
import { postsAPI, communitiesAPI, uploadAPI } from '../lib/api';
import { mapCommunity } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isLoggedIn } = useAuth();
  const [lang, setLang] = useState<Language>('en');
  const [communities, setCommunities] = useState<any[]>([]);
  
  const communityIdParam = searchParams.get('communityId') || '';

  const [form, setForm] = useState<CreatePostForm>({
    title: '', titleAm: '', content: '', contentAm: '',
    communityId: communityIdParam, type: 'text', url: '', isAnonymous: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
  }, []);

  useEffect(() => {
    communitiesAPI.getAll().then((data: any) => {
      const mapped = data.map(mapCommunity);
      if (communityIdParam) {
        setCommunities(mapped);
      } else {
        setCommunities(mapped.filter((c: any) => c.isJoined));
      }
    });
  }, [communityIdParam]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const updateField = (field: keyof CreatePostForm) => (value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!form.communityId) newErrors.communityId = 'Please select a community';
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (form.type === 'link') {
      if (!form.url.trim()) newErrors.url = 'URL is required';
      else if (!form.url.startsWith('http')) newErrors.url = 'Must be a valid URL';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      let imageUrl = '';
      if (form.type === 'image' && selectedFile) {
        setUploadingImage(true);
        const uploadResult = await uploadAPI.uploadImage(selectedFile);
        imageUrl = uploadResult.imageUrl;
        setUploadingImage(false);
      }
      await postsAPI.create({
        title: form.title,
        titleAm: form.titleAm || undefined,
        content: form.content || undefined,
        contentAm: form.contentAm || undefined,
        communityId: form.communityId,
        type: form.type,
        url: form.type === 'link' ? form.url : undefined,
        imageUrl: form.type === 'image' ? imageUrl : undefined,
        isAnonymous: form.isAnonymous
      });
      navigate('/');
    } catch (err: any) {
      setErrors({ general: err.message });
    } finally {
      setIsSubmitting(false);
      setUploadingImage(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#F2E9DF] overflow-hidden">
      <Navbar lang={lang} onToggleLang={() => setLang(l => l === 'en' ? 'am' : 'en')} onLogin={() => navigate('/login')} onSignup={() => navigate('/register')} />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 flex justify-center">
          <div className="w-full max-w-[680px] pb-16">
            <div className="flex items-center mb-4">
              <h1 className="text-xl font-bold text-[#1A0F00]">{lang === 'en' ? 'Create a Post' : 'ልጥፍ ጻፍ'}</h1>
              <span className="text-sm text-[#9C836A] font-['Noto_Sans_Ethiopic'] ml-2">{lang === 'en' ? '' : 'ልጥፍ ጻፍ'}</span>
            </div>

            <PostTypeTab activeType={form.type} onTypeChange={t => setForm(prev => ({ ...prev, type: t }))} lang={lang} />

            <p className="text-xs font-bold text-[#9C836A] uppercase tracking-wide mb-2">{lang === 'en' ? 'POST TO' : 'የሚለጠፍበት'}</p>
            <CommunitySelector communities={communities} selectedId={form.communityId} onSelect={updateField('communityId')} lang={lang} />
            {errors.communityId && <p className="text-xs text-[#C0392B] mt-1">{lang === 'en' ? 'Please select a community' : 'እባክዎ ማህበረሰብ ይምረጡ'}</p>}

            <div className="bg-white border border-[#DDD0BE] rounded-[9px] p-6 mt-3 mb-4">
              <p className="text-xs font-bold text-[#9C836A] uppercase tracking-wide mb-3">{lang === 'en' ? 'POST TITLE' : 'ርዕስ'}</p>
              <PostFormField label="Title (English)" labelAm="ርዕስ (እንግሊዝኛ)" value={form.title} onChange={updateField('title')} placeholder="Enter your post title..." placeholderAm="ርዕሱን ያስገቡ..." lang={lang} maxLength={300} required />
              {errors.title && <p className="text-xs text-[#C0392B] -mt-3 mb-3">{lang === 'en' ? 'Title is required' : 'ርዕስ ያስፈልጋል'}</p>}
              <PostFormField label="Title (Amharic) — optional" labelAm="ርዕስ (አማርኛ) — አማራጭ" value={form.titleAm} onChange={updateField('titleAm')} placeholder="የልጥፍዎን ርዕስ ያስገቡ..." lang={lang} maxLength={300} />
              <div className="border-t border-[#F2E0C8] my-4" />
              {form.type === 'text' && (
                <>
                  <p className="text-xs font-bold text-[#9C836A] uppercase tracking-wide mb-3">{lang === 'en' ? 'CONTENT' : 'ይዘት'}</p>
                  <PostFormField label="Content (English)" value={form.content} onChange={updateField('content')} placeholder="Write your post content..." lang={lang} multiline maxLength={10000} />
                  <PostFormField label="Content (Amharic) — optional" labelAm="ይዘት (አማርኛ) — አማራጭ" value={form.contentAm} onChange={updateField('contentAm')} placeholder="ይዘቱን ያስገቡ..." lang={lang} multiline maxLength={10000} />
                </>
              )}
              {form.type === 'link' && (
                <PostFormField label="URL" labelAm="ሊንክ" value={form.url} onChange={updateField('url')} placeholder="https://..." lang={lang} required />
              )}
              {form.type === 'image' && (
                <div className="mb-4">
                  {!imagePreview ? (
                    <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-[#DDD0BE] rounded-lg p-8 text-center hover:border-[#A8692A] cursor-pointer transition-colors">
                      <div className="text-3xl mb-2">🖼</div>
                      <p className="text-sm text-[#9C836A]">{lang === 'en' ? 'Click to upload an image' : 'ምስል ለመጫን ጠቅ ያድርጉ'}</p>
                      <p className="text-[10px] text-[#9C836A] mt-1">JPG, PNG, GIF — max 10MB</p>
                    </div>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden border border-[#DDD0BE]">
                      <img src={imagePreview} alt="Preview" className="w-full max-h-80 object-cover" />
                      <button onClick={() => { setImagePreview(''); setSelectedFile(null); }} className="absolute top-2 right-2 bg-[#1A0F00]/70 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-[#1A0F00]">✕</button>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleFileSelect} className="hidden" />
                </div>
              )}
            </div>
            {errors.general && <p className="text-xs text-[#C0392B] mb-3 text-center">{errors.general}</p>}

            <AnonymousToggle isAnonymous={form.isAnonymous} onToggle={() => setForm(prev => ({ ...prev, isAnonymous: !prev.isAnonymous }))} lang={lang} />

            <div className="flex justify-between items-center mt-6 mb-8">
              <Button variant="ghost" onClick={() => navigate(-1)}>{lang === 'en' ? 'Cancel' : 'ሰርዝ'}</Button>
              <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (lang === 'en' ? 'Posting...' : 'እየለጠፈ...') : (lang === 'en' ? 'Post' : 'ለጥፍ')}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
