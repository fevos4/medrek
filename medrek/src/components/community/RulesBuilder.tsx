import React, { useState } from 'react';
import type { Language } from '../../types';

interface RulesBuilderProps {
  rules: string[];
  onChange: (rules: string[]) => void;
  lang: Language;
}

export const RulesBuilder: React.FC<RulesBuilderProps> = ({ rules, onChange, lang }) => {
  const [newRule, setNewRule] = useState('');

  const addRule = () => {
    if (newRule.trim() && rules.length < 10) {
      onChange([...rules, newRule.trim()]);
      setNewRule('');
    }
  };

  const removeRule = (index: number) => {
    onChange(rules.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-5">
      <p className="text-xs font-bold text-[#9C836A] uppercase tracking-wide mb-2">{lang === 'en' ? 'Community rules (optional)' : 'ደንቦች (አማራጭ)'}</p>
      {rules.map((rule, i) => (
        <div key={i} className="flex items-center gap-2 mb-2">
          <span className="bg-[#F2E0C8] text-[#4A2C00] text-[10px] font-bold px-2 py-0.5 rounded">{i + 1}</span>
          <span className="text-sm text-[#1A0F00] flex-1">{rule}</span>
          <button type="button" className="text-[#C0392B] text-xs hover:underline" onClick={() => removeRule(i)}>{lang === 'en' ? 'Remove' : 'አስወግድ'}</button>
        </div>
      ))}
      {rules.length < 10 ? (
        <div className="flex gap-2 mt-3">
          <input type="text" value={newRule} onChange={e => setNewRule(e.target.value)} onKeyDown={e => e.key === 'Enter' && addRule()} className="flex-1 border border-[#DDD0BE] rounded-lg px-3 py-2 text-sm placeholder:text-[#9C836A] focus:outline-none focus:border-[#A8692A]" placeholder={lang === 'en' ? 'Add a community rule...' : 'ደንብ ያክሉ...'} />
          <button type="button" className="border border-[#6B3F00] text-[#C9904F] bg-transparent font-bold px-4 py-2 hover:bg-[#FAF4EC] rounded-md transition-colors text-sm" onClick={addRule}>{lang === 'en' ? '+ Add' : '+ ጨምር'}</button>
        </div>
      ) : (
        <p className="text-xs text-[#9C836A]">{lang === 'en' ? 'Maximum 10 rules reached' : 'ከፍተኛ 10 ደንቦች ደርሷል'}</p>
      )}
    </div>
  );
};
