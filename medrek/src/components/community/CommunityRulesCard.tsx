import React from 'react';
import type { CommunityRule, Language } from '../../types';

interface CommunityRulesCardProps {
  rules: CommunityRule[];
  lang: Language;
}

export const CommunityRulesCard: React.FC<CommunityRulesCardProps> = ({ rules, lang }) => {
  return (
    <div className="bg-white border border-[#DDD0BE] rounded-[9px] overflow-hidden">
      <div className="bg-[#2E1A00] px-3 py-2">
        <span className="text-xs font-bold text-[#FAF4EC]">{lang === 'en' ? 'Community rules' : 'የማህበረሰብ ደንቦች'}</span>
      </div>
      <div className="p-3">
        {rules.map(rule => (
          <div key={rule.id} className="flex gap-2 mb-3 last:mb-0">
            <span className="w-[17px] h-[17px] flex-shrink-0 bg-[#F2E0C8] text-[#4A2C00] text-[10px] font-bold rounded flex items-center justify-center">
              {rule.number}
            </span>
            <div>
              <p className="text-xs font-semibold text-[#1A0F00]">{rule.text}</p>
              <p className="text-[10px] text-[#9C836A] font-['Noto_Sans_Ethiopic'] mt-0.5">{rule.textAm}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
