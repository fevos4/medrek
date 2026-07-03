import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Language, CreateCommunityForm } from '../types';
import { Navbar } from '../components/layout/Navbar';
import { PostFormField } from '../components/post/PostFormField';
import { CommunityTypeSelector } from '../components/community/CommunityTypeSelector';
import { IconPicker } from '../components/community/IconPicker';
import { RulesBuilder } from '../components/community/RulesBuilder';
import { Button } from '../components/ui/Button';
import { communitiesAPI, uploadAPI } from '../lib/api';

export const CreateCommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Language>('en');
  const [form, setForm] = useState<CreateCommunityForm>({
    name: '', nameAm: '', description: '', descriptionAm: '',
    type: 'public', isSensitive: false, icon: '🌍', emoji: '🌍', rules: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const handleIconSelect = (file: File) => {
    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
  };

  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = lang === 'en' ? 'Community name is required' : 'የማህበረሰብ ስም ያስፈልጋል';
    else if (form.name.trim().length < 3) newErrors.name = lang === 'en' ? 'At least 3 characters' : 'ቢያንስ 3 ቁምፊዎች';
    if (!form.description.trim()) newErrors.description = lang === 'en' ? 'Description is required' : 'መግለጫ ያስፈልጋል';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      setIsSubmitting(true);
      let iconUrl = '';
      let bannerUrl = '';
      if (iconFile) {
        setUploading(true);
        const result = await uploadAPI.uploadImage(iconFile);
        iconUrl = result.imageUrl;
      }
      if (bannerFile) {
        setUploading(true);
        const result = await uploadAPI.uploadImage(bannerFile);
        bannerUrl = result.imageUrl;
      }
      setUploading(false);
      const created = await communitiesAPI.create({
        name: form.name,
        nameAm: form.nameAm || undefined,
        description: form.description,
        descriptionAm: form.descriptionAm || undefined,
        type: form.type,
        isSensitive: form.isSensitive,
        rules: form.rules.map(r => ({ text: r })),
        iconUrl: iconUrl || undefined,
        bannerUrl: bannerUrl || undefined,
        emoji: form.icon || undefined
      });
      navigate(`/community/${created.id}`);
    } catch (err: any) {
      setErrors({ general: err.message || 'Failed to create community' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#F2E9DF]">
      <Navbar lang={lang} onToggleLang={() => setLang(l => l === 'en' ? 'am' : 'en')} onLogin={() => navigate('/login')} onSignup={() => navigate('/register')} />
      <div className="flex-1 py-8 px-4">
        <div className="max-w-[640px] mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#1A0F00]">{lang === 'en' ? 'Create a Community' : 'ማህበረሰብ ፍጠር'}</h1>
            <p className="text-sm text-[#9C836A] font-['Noto_Sans_Ethiopic'] mt-1">{lang === 'en' ? '' : 'ማህበረሰብ ፍጠር'}</p>
          </div>

          <div className="bg-white border border-[#DDD0BE] rounded-[9px] p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#6B3F00] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">1</span>
              <span className="text-sm font-bold text-[#1A0F00]">{lang === 'en' ? 'Community identity' : 'ማንነት'}</span>
              <span className="text-xs text-[#9C836A] font-['Noto_Sans_Ethiopic']">{lang === 'en' ? '' : 'ማንነት'}</span>
            </div>
            <div className="mb-4">
              <IconPicker
                value={form.icon}
                onChange={(v: string) => setForm(prev => ({ ...prev, icon: v, emoji: v }))}
                lang={lang}
                onImageSelect={handleIconSelect}
                imagePreview={iconPreview}
              />
            </div>
            <PostFormField label="Community name (English)" labelAm="ማህበረሰብ ስም (እንግሊዝኛ)" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="e.g. Tech Ethiopia, Food & Culture..." lang={lang} multiline={false} maxLength={50} required />
            {errors.name && <p className="text-xs text-[#C0392B] -mt-3 mb-3">{errors.name}</p>}
            <p className="text-[10px] text-[#9C836A] mb-4">{lang === 'en' ? 'Letters, numbers, spaces allowed. 3-50 characters.' : 'ፊደላት፣ ቁጥሮች፣ ክፍተቶች ይፈቀዳሉ።'}</p>
            <PostFormField label="Community name (Amharic) — optional" labelAm="ማህበረሰብ ስም (አማርኛ) — አማራጭ" value={form.nameAm} onChange={v => setForm({ ...form, nameAm: v })} placeholder="ለምሳሌ፡ ቴክኖሎጂ፣ ምግብና ባህል..." lang={lang} multiline={false} maxLength={50} required={false} />
            <PostFormField label="Description (English)" labelAm="መግለጫ (እንግሊዝኛ)" value={form.description} onChange={v => setForm({ ...form, description: v })} placeholder="What is this community about?" lang={lang} multiline maxLength={500} required />
            {errors.description && <p className="text-xs text-[#C0392B] -mt-3 mb-3">{errors.description}</p>}
            <PostFormField label="Description (Amharic) — optional" labelAm="መግለጫ (አማርኛ) — አማራጭ" value={form.descriptionAm} onChange={v => setForm({ ...form, descriptionAm: v })} placeholder="ይህ ማህበረሰብ ስለምን ነው?" lang={lang} multiline maxLength={500} required={false} />
            <div className="mb-4">
              <p className="text-xs font-bold text-[#9C836A] uppercase tracking-wide mb-2">{lang === 'en' ? 'COVER IMAGE (optional)' : 'የሽፋን ምስል (አማራጭ)'}</p>
              {!bannerPreview ? (
                <div onClick={() => document.getElementById('banner-upload')?.click()} className="border-2 border-dashed border-[#DDD0BE] rounded-lg p-6 text-center hover:border-[#A8692A] cursor-pointer transition-colors">
                  <p className="text-sm text-[#9C836A]">{lang === 'en' ? 'Click to upload a cover image' : 'የሽፋን ምስል ለመጫን ጠቅ ያድርጉ'}</p>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border border-[#DDD0BE] h-32">
                  <img src={bannerPreview} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => { setBannerPreview(''); setBannerFile(null); }} className="absolute top-2 right-2 bg-[#1A0F00]/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
                </div>
              )}
              <input id="banner-upload" type="file" accept="image/*" onChange={handleBannerSelect} className="hidden" />
            </div>
          </div>

          <div className="bg-white border border-[#DDD0BE] rounded-[9px] p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#6B3F00] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">2</span>
              <span className="text-sm font-bold text-[#1A0F00]">{lang === 'en' ? 'Community type' : 'አይነት'}</span>
              <span className="text-xs text-[#9C836A] font-['Noto_Sans_Ethiopic']">{lang === 'en' ? '' : 'አይነት'}</span>
            </div>
            <CommunityTypeSelector selected={form.type} onChange={type => setForm({ ...form, type })} lang={lang} />
          </div>

          <div className="bg-white border border-[#DDD0BE] rounded-[9px] p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#6B3F00] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">3</span>
              <span className="text-sm font-bold text-[#1A0F00]">{lang === 'en' ? 'Settings' : 'ቅንብሮች'}</span>
              <span className="text-xs text-[#9C836A] font-['Noto_Sans_Ethiopic']">{lang === 'en' ? '' : 'ቅንብሮች'}</span>
            </div>
            <div className="bg-white border border-[#DDD0BE] rounded-[9px] px-4 py-3 flex items-center justify-between">
              <div className="flex items-start gap-3">
                <span className="text-[#9C836A] mt-0.5">⚠</span>
                <div>
                  <p className="text-sm font-semibold text-[#1A0F00]">{lang === 'en' ? 'Mark as sensitive community' : 'እንደ ሚስጥራዊ ማህበረሰብ ምልክት አድርግ'}</p>
                  <p className="text-xs text-[#9C836A] font-['Noto_Sans_Ethiopic']">{lang === 'en' ? '' : 'እንደ ሚስጥራዊ ማህበረሰብ ምልክት አድርግ'}</p>
                  <p className="text-[10px] text-[#9C836A] mt-0.5">{lang === 'en' ? 'Members will see a warning before entering' : 'አባላት ከመግባታቸው በፊት ማስጠንቀቂያ ያያሉ'}</p>
                </div>
              </div>
              <div onClick={() => setForm({ ...form, isSensitive: !form.isSensitive })} className={`w-10 h-6 rounded-full cursor-pointer transition-colors duration-200 relative flex-shrink-0 ${form.isSensitive ? 'bg-[#6B3F00]' : 'bg-[#DDD0BE]'}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform duration-200 ${form.isSensitive ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#DDD0BE] rounded-[9px] p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#6B3F00] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">4</span>
              <span className="text-sm font-bold text-[#1A0F00]">{lang === 'en' ? 'Community rules' : 'ደንቦች'}</span>
              <span className="text-xs text-[#9C836A] font-['Noto_Sans_Ethiopic']">{lang === 'en' ? '' : 'ደንቦች'}</span>
            </div>
            <RulesBuilder rules={form.rules} onChange={rules => setForm({ ...form, rules })} lang={lang} />
          </div>

          {errors.general && <p className="text-xs text-[#C0392B] mb-3 text-center">{errors.general}</p>}
          <div className="flex justify-between items-center pb-8">
            <Button variant="ghost" onClick={() => navigate(-1)}>{lang === 'en' ? 'Cancel' : 'ሰርዝ'}</Button>
            <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? (lang === 'en' ? 'Creating...' : 'እየፈጠሩ...') : (lang === 'en' ? 'Create community' : 'ማህበረሰብ ፍጠር')}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
