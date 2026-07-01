import React from 'react';
import type { Language } from '../../types';

interface ModStatCardProps {
  label: string;
  labelAm: string;
  value: number;
  color: 'pending' | 'resolved' | 'dismissed' | 'default';
  lang: Language;
}

const colorMap: Record<string, string> = {
  pending: 'text-[#D97706]',
  resolved: 'text-[#5A7A2A]',
  dismissed: 'text-[#9C836A]',
  default: 'text-[#1A0F00]',
};

export const ModStatCard: React.FC<ModStatCardProps> = ({ label, labelAm, value, color, lang }) => {
  return (
    <div className="bg-white border border-[#DDD0BE] rounded-[9px] p-4">
      <p className={`text-2xl font-bold ${colorMap[color]}`}>{value}</p>
      <p className="text-xs text-[#9C836A] uppercase tracking-wide font-bold mt-1">{lang === 'en' ? label : labelAm}</p>
    </div>
  );
};
