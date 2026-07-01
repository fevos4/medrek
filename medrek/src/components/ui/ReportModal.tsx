import React, { useState } from 'react';
import type { Language, ReportReason, ReportForm } from '../../types';
import { Button } from './Button';

interface ReportModalProps {
  isOpen: boolean;
  targetType: 'post' | 'comment';
  lang: Language;
  onSubmit: (form: ReportForm) => void;
  onClose: () => void;
}

const reasons: { value: ReportReason; labelEn: string; labelAm: string }[] = [
  { value: 'ethnic_hate', labelEn: 'Ethnic incitement or hate speech', labelAm: 'የጎሳ ጥላቻ ወይም ጥላቻ ንግግር' },
  { value: 'religious_disrespect', labelEn: 'Religious disrespect or mockery', labelAm: 'ሃይማኖትን ማቃለል ወይም መሳለቅ' },
  { value: 'misinformation', labelEn: 'Misinformation or unverified claims', labelAm: 'የተሳሳተ ወይም ያልተረጋገጠ መረጃ' },
  { value: 'harassment', labelEn: 'Harassment or personal attack', labelAm: 'ስደት ወይም የግል ጥቃት' },
  { value: 'spam', labelEn: 'Spam or irrelevant content', labelAm: 'ስፓም ወይም ያልተዛመደ ይዘት' },
  { value: 'other', labelEn: 'Other', labelAm: 'ሌላ' },
];

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, targetType, lang, onSubmit, onClose }) => {
  const [form, setForm] = useState<ReportForm>({ reasons: [], detail: '' });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const titleEn = targetType === 'post' ? 'Report Post' : 'Report Comment';
  const titleAm = targetType === 'post' ? 'ልጥፍ ሪፖርት አድርግ' : 'አስተያየት ሪፖርት አድርግ';

  const toggleReason = (v: ReportReason) => {
    setForm(prev => ({
      ...prev,
      reasons: prev.reasons.includes(v) ? prev.reasons.filter(r => r !== v) : [...prev.reasons, v],
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (form.reasons.length === 0) return;
    onSubmit(form);
    setTimeout(onClose, 1500);
  };

  if (submitted && form.reasons.length > 0) {
    return (
      <div className="fixed inset-0 z-50 bg-[rgba(26,15,0,0.6)] flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-[12px] w-full max-w-[600px] lg:max-w-[640px] flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
          <div className="bg-[#1A0F00] px-6 py-4 flex justify-between items-center flex-shrink-0">
            <div>
              <p className="text-sm font-bold text-white">{titleEn}</p>
              <p className="text-xs text-[#A8692A] font-['Noto_Sans_Ethiopic']">{titleAm}</p>
            </div>
            <span className="text-[#9C836A] hover:text-white text-lg cursor-pointer font-bold" onClick={onClose}>✕</span>
          </div>
          <div className="px-6 py-5 text-center overflow-y-auto">
            <div className="text-4xl text-[#5A7A2A] mb-3">✓</div>
            <p className="text-base font-bold text-[#1A0F00]">{lang === 'en' ? 'Report submitted' : 'ሪፖርቱ ተልኳል'}</p>
            <p className="text-sm text-[#5C4A32] font-['Noto_Sans_Ethiopic']">{lang === 'en' ? '' : 'ሪፖርቱ ተልኳል'}</p>
            <p className="text-xs text-[#9C836A] mt-2">{lang === 'en' ? 'Thank you. Our moderators will review this.' : 'አመሰግናለሁ። ሞደሬተሮቻችን ይገመግማሉ።'}</p>
          </div>
          <div className="border-t border-[#F2E0C8] px-6 py-4 flex justify-end flex-shrink-0">
            <Button variant="primary" onClick={onClose}>{lang === 'en' ? 'Report' : 'ሪፖርት'}</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(26,15,0,0.6)] flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-[12px] w-full max-w-[600px] lg:max-w-[640px] flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
          <div className="bg-[#1A0F00] px-6 py-4 flex justify-between items-center flex-shrink-0">
            <div>
              <p className="text-sm font-bold text-white">{titleEn}</p>
              <p className="text-xs text-[#A8692A] font-['Noto_Sans_Ethiopic']">{titleAm}</p>
            </div>
            <span className="text-[#9C836A] hover:text-white text-lg cursor-pointer font-bold" onClick={onClose}>✕</span>
          </div>
          <div className="px-6 py-5 overflow-y-auto">
            <p className="text-xs text-[#9C836A] mb-4">
              {lang === 'en' ? 'Select the reason that best describes the issue.' : 'ችግሩን በተሻለ የሚገልጸውን ምክንያት ይምረጡ።'}
              <span className="font-['Noto_Sans_Ethiopic']"> {lang === 'en' ? '' : 'ችግሩን በተሻለ የሚገልጸውን ምክንያት ይምረጡ።'}</span>
            </p>
            <div className="flex flex-col gap-2 mb-5">
              {reasons.map(r => {
                const selected = form.reasons.includes(r.value);
                return (
                  <div key={r.value} className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${selected ? 'border-[#6B3F00] bg-[#F2E0C8]' : 'border-[#DDD0BE] hover:border-[#A8692A] hover:bg-[#FAF4EC]'}`} onClick={() => toggleReason(r.value)}>
                    <div className={`w-4 h-4 rounded border-2 mt-0.5 flex-shrink-0 flex items-center justify-center ${selected ? 'border-[#6B3F00] bg-[#6B3F00]' : 'border-[#DDD0BE]'}`}>
                      {selected && <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1A0F00]">{r.labelEn}</p>
                      <p className="text-xs text-[#9C836A] font-['Noto_Sans_Ethiopic'] mt-0.5">{r.labelAm}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs font-bold text-[#9C836A] uppercase tracking-wide mb-1">{lang === 'en' ? 'Additional details (optional)' : 'ተጨማሪ ዝርዝር (አማራጭ)'}</p>
            <textarea rows={3} value={form.detail} onChange={e => setForm({ ...form, detail: e.target.value })} className="w-full border border-[#DDD0BE] rounded-lg px-3 py-2 text-sm placeholder:text-[#9C836A] focus:outline-none focus:border-[#A8692A] resize-none" placeholder={lang === 'en' ? 'Describe the issue in more detail...' : 'ችግሩን በዝርዝር ይግለጹ...'} />
            {submitted && form.reasons.length === 0 && (
              <p className="text-xs text-[#C0392B] mb-3">{lang === 'en' ? 'Please select a reason' : 'ምክንያት ይምረጡ'}</p>
            )}
          </div>
          <div className="border-t border-[#F2E0C8] px-6 py-4 flex gap-3 justify-end flex-shrink-0">
            <Button variant="ghost" onClick={onClose}>{lang === 'en' ? 'Cancel' : 'ሰርዝ'}</Button>
            <Button variant="primary" onClick={handleSubmit}>{lang === 'en' ? 'Report' : 'ሪፖርት'}</Button>
          </div>
        </div>
    </div>
  );
};
