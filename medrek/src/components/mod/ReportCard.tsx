import React from 'react';
import type { Language, Report } from '../../types';

interface ReportCardProps {
  report: Report;
  lang: Language;
  reportCount?: number;
  onRemove: (reportId: string) => void;
  onDismiss: (reportId: string) => void;
  onBan: (reportId: string, username: string) => void;
}

const reasonLabel: Record<string, string> = {
  ethnic_hate: 'Ethnic hate speech',
  religious_disrespect: 'Religious disrespect',
  misinformation: 'Misinformation',
  harassment: 'Harassment',
  spam: 'Spam',
  other: 'Other',
};

const statusStyles: Record<string, string> = {
  pending: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
  resolved: 'bg-[#EAF3DE] text-[#3B6D11] border-[#C0DD97]',
  dismissed: 'bg-[#F2E9DF] text-[#9C836A] border-[#DDD0BE]',
};

const getInitials = (name: string) => {
  if (name === 'Anonymous') return '?';
  return name.split('_').map(s => s[0]).join('').toUpperCase().slice(0, 2);
};

const truncate = (text: string, max: number) => text.length > max ? text.slice(0, max) + '...' : text;

export const ReportCard: React.FC<ReportCardProps> = ({ report, lang, reportCount, onRemove, onDismiss, onBan }) => {
  return (
    <div className="bg-white border border-[#DDD0BE] rounded-[9px] p-4 mb-3">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-1 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${statusStyles[report.status]}`}>{report.status}</span>
          <span className="text-xs text-[#9C836A]">{report.targetType === 'post' ? (lang === 'en' ? 'Post report' : 'የልጥፍ ሪፖርት') : (lang === 'en' ? 'Comment report' : 'የአስተያየት ሪፖርት')}</span>
          <span className="bg-[#F2E0C8] text-[#4A2C00] border border-[#E4C49A] text-[10px] font-bold px-2 py-0.5 rounded">{report.communityName}</span>
          {reportCount !== undefined && reportCount >= 5 && (
            <span className="bg-[#FEE2E2] text-[#991B1B] text-[10px] font-bold px-2 py-0.5 rounded border border-[#FECACA]">Auto-removed</span>
          )}
        </div>
        <span className="text-xs text-[#9C836A]">{report.createdAt}</span>
      </div>
      <div className="bg-[#FAF4EC] border border-[#DDD0BE] rounded-lg p-3 mb-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-full bg-[#E4C49A] flex items-center justify-center text-[10px] font-bold text-[#4A2C00]">{getInitials(report.targetAuthor)}</div>
          <span className="text-xs font-semibold text-[#1A0F00]">{report.targetAuthor}</span>
        </div>
        <p className="text-sm text-[#1A0F00] leading-relaxed">{truncate(report.targetContent, 120)}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-[10px] font-bold text-[#9C836A] uppercase tracking-wide">{lang === 'en' ? 'Reason:' : 'ምክንያት:'}</span>
        <span className="text-xs font-semibold text-[#4A2C00] bg-[#F2E0C8] px-2 py-0.5 rounded">{reasonLabel[report.reason]}</span>
        {report.detail && <span className="text-xs text-[#5C4A32] italic">— {report.detail}</span>}
      </div>
      <p className="text-xs text-[#9C836A] mb-3">{lang === 'en' ? `Reported by ${report.reporterName}` : `የሪፖርቱ ምንጭ: ${report.reporterName}`}</p>
      {report.status === 'pending' && (
        <div className="flex flex-wrap gap-2">
          <button className="bg-[#C0392B] text-white text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer hover:bg-[#991B1B]" onClick={() => onRemove(report.id)}>{lang === 'en' ? 'Remove content' : 'ይዘት አስወግድ'}</button>
          <button className="border border-[#DDD0BE] text-[#9C836A] text-xs font-semibold px-3 py-1.5 rounded-md cursor-pointer hover:bg-[#FAF4EC]" onClick={() => onDismiss(report.id)}>{lang === 'en' ? 'Dismiss' : 'ዝናጋ'}</button>
          {report.targetAuthor !== 'Anonymous' && (
            <button className="border border-[#C0392B] text-[#C0392B] text-xs font-semibold px-3 py-1.5 rounded-md cursor-pointer hover:bg-[#FEF2F2]" onClick={() => onBan(report.id, report.targetAuthor)}>{lang === 'en' ? 'Ban user' : 'ተጠቃሚ አግድ'}</button>
          )}
        </div>
      )}
    </div>
  );
};
