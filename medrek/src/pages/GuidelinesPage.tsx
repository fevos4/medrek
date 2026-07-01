import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Language } from '../types';
import { Navbar } from '../components/layout/Navbar';

const rules = [
  { en: 'No ethnic incitement or hate speech', am: 'ጥላቻ ንግግር የለም', desc: 'Content that promotes hatred or violence based on ethnicity, religion, or region is strictly prohibited.', descAm: 'በብሔር፣ ሃይማኖት ወይም ክልል ላይ የተመሰረተ ጥላቻ ወይም ጥቃትን የሚያበረታታ ይዘት ክልክል ነው።' },
  { en: 'Respect religious beliefs and practices', am: 'ሃይማኖትን ያክብሩ', desc: 'All religious beliefs and traditions deserve respect. Disagreement is fine, mockery is not.', descAm: 'ሁሉም ሃይማኖታዊ እምነቶች እና ወጎች መከበር አለባቸው።' },
  { en: 'No misinformation or unverified claims', am: 'የተረጋገጠ መረጃ ብቻ', desc: 'Share facts, not rumors. Always verify before posting news or sensitive information.', descAm: 'እውነታዎችን ያጋሩ፣ ወሬ አይዘሩ።' },
  { en: 'Treat all members with dignity', am: 'ሁሉንም አክብሩ', desc: 'Personal attacks, harassment, and bullying will not be tolerated. Healthy debate is welcome.', descAm: 'የግል ጥቃት፣ ትንኮሳ እና ጉልበተኝነት አይታገስም።' },
  { en: 'No spam or self-promotion', am: 'ስፓም አይፈቀድም', desc: 'Repeated posting of the same content or excessive self-promotion without community participation is not allowed.', descAm: 'ያለማቋረጥ ተመሳሳይ ይዘት መለጠፍ ወይም ከመጠን በላይ ማስተዋወቅ አይፈቀድም።' },
  { en: 'Keep content legal and appropriate', am: 'ህጋዊ እና ተገቢ ይዘት ብቻ', desc: 'All content must comply with Ethiopian law. NSFW content must be marked appropriately.', descAm: 'ሁሉም ይዘት ከኢትዮጵያ ህግ ጋር የተጣጣመ መሆን አለበት።' },
];

export const GuidelinesPage: React.FC = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Language>('en');

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#F2E9DF]">
      <Navbar
        lang={lang}
        onToggleLang={() => setLang(l => l === 'en' ? 'am' : 'en')}
        onLogin={() => navigate('/login')}
        onSignup={() => navigate('/register')}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[720px] mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#1A0F00] rounded-xl flex items-center justify-center text-xl">📋</div>
            <div>
              <h1 className="text-2xl font-bold text-[#1A0F00]">{lang === 'en' ? 'Community Guidelines' : 'የማህበረሰብ መመሪያዎች'}</h1>
              <p className="text-sm text-[#9C836A] font-['Noto_Sans_Ethiopic']">{lang === 'en' ? '' : 'የማህበረሰብ መመሪያዎች'}</p>
            </div>
          </div>

          <div className="bg-white border border-[#DDD0BE] rounded-[12px] overflow-hidden mb-6">
            <div className="bg-[#1A0F00] px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="text-[#C9904F] text-lg">⚖</span>
                <span className="text-sm font-bold text-[#FAF4EC] uppercase tracking-wider">{lang === 'en' ? 'Platform Rules' : 'የመድረክ ደንቦች'}</span>
                <span className="text-[10px] text-[#A8692A] font-ethiopic">ደንቦች</span>
              </div>
            </div>
            <div className="p-6">
              {rules.map((rule, idx) => (
                <div key={idx} className={`flex gap-4 py-5 ${idx < rules.length - 1 ? 'border-b border-[#F2E0C8]' : ''}`}>
                  <div className="w-8 h-8 bg-[#F2E0C8] text-[#4A2C00] text-sm font-bold rounded-lg flex items-center justify-center flex-shrink-0">{idx + 1}</div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1A0F00]">{lang === 'en' ? rule.en : rule.am}</h3>
                    <p className="text-xs text-[#5C4A32] mt-1 leading-relaxed">{lang === 'en' ? rule.desc : rule.descAm}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};
