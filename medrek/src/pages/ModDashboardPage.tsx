import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Language, ModTab, BannedUser } from '../types';
import { Navbar } from '../components/layout/Navbar';
import { ModStatCard } from '../components/mod/ModStatCard';
import { ReportCard } from '../components/mod/ReportCard';
import { BannedUserCard } from '../components/mod/BannedUserCard';
import { communitiesAPI, reportsAPI } from '../lib/api';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

type StatusFilter = 'all' | 'pending' | 'resolved' | 'dismissed';

const filterOptions: { value: StatusFilter; labelEn: string; labelAm: string }[] = [
  { value: 'all', labelEn: 'All', labelAm: 'ሁሉም' },
  { value: 'pending', labelEn: 'Pending', labelAm: 'በመጠባበቅ' },
  { value: 'resolved', labelEn: 'Resolved', labelAm: 'የተፈቱ' },
  { value: 'dismissed', labelEn: 'Dismissed', labelAm: 'የተዘጉ' },
];

export const ModDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCommunity = searchParams.get('community') || '';
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<ModTab>('reports');
  const [moderatedComms, setModeratedComms] = useState<any[]>([]);
  const [selectedCommId, setSelectedCommId] = useState<string>('');
  const [reports, setReports] = useState<any[]>([]);
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    communitiesAPI.getMyModerated().then((comms: any[]) => {
      setModeratedComms(comms);
      if (comms.length > 0) {
        const preselected = preselectedCommunity && comms.find((c: any) => c.id === preselectedCommunity);
        setSelectedCommId(preselected ? preselected.id : comms[0].id);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedCommId) return;
    reportsAPI.getForMod(selectedCommId).then(setReports).catch(() => {});
  }, [selectedCommId]);

  const pendingCount = reports.filter(r => r.status === 'pending').length;

  const handleRemove = async (reportId: string) => {
    try {
      await reportsAPI.updateStatus(reportId, 'resolved');
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'resolved' } : r));
    } catch {}
  };

  const handleDismiss = async (reportId: string) => {
    try {
      await reportsAPI.updateStatus(reportId, 'dismissed');
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'dismissed' } : r));
    } catch {}
  };

  const handleBan = async (reportId: string, username: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;
    const targetId = report.targetType === 'post' ? report.target?.authorId : report.comment?.authorId;
    if (!targetId) return;
    try {
      const banned = await communitiesAPI.join(selectedCommId);
      setBannedUsers(prev => [...prev, {
        id: `b${Date.now()}`,
        username,
        reason: lang === 'en' ? 'Community guideline violation' : 'የማህበረሰብ ደንብ መጣስ',
        bannedAt: lang === 'en' ? 'Just now' : 'አሁን',
        bannedBy: 'Moderator',
      }]);
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'resolved' } : r));
    } catch {}
  };

  const handleUnban = (bannedUserId: string) => {
    setBannedUsers(prev => prev.filter(b => b.id !== bannedUserId));
  };

  const filteredReports = reports.filter(r => statusFilter === 'all' || r.status === statusFilter);

  const navItem = (tab: ModTab, icon: string, labelEn: string, labelAm: string, badge?: number) => (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-[7px] cursor-pointer ${activeTab === tab ? 'bg-[#F2E0C8] text-[#4A2C00] font-bold' : 'text-[#5C4A32] hover:bg-[#F2E0C8]'}`} onClick={() => setActiveTab(tab)}>
      <span>{icon}</span>
      <span className="text-sm">{lang === 'en' ? labelEn : labelAm}</span>
      {badge !== undefined && badge > 0 && <span className="bg-[#D97706] text-white text-[10px] font-bold px-1.5 rounded-full ml-auto">{badge}</span>}
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col h-screen font-sans bg-[#F2E9DF]">
        <Navbar lang={lang} onToggleLang={() => setLang(l => l === 'en' ? 'am' : 'en')} onLogin={() => navigate('/login')} onSignup={() => navigate('/register')} />
        <LoadingSpinner text={lang === 'en' ? 'Loading...' : 'በመጫን ላይ...'} />
      </div>
    );
  }

  if (moderatedComms.length === 0) {
    return (
      <div className="flex flex-col h-screen font-sans bg-[#F2E9DF]">
        <Navbar lang={lang} onToggleLang={() => setLang(l => l === 'en' ? 'am' : 'en')} onLogin={() => navigate('/login')} onSignup={() => navigate('/register')} />
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <p className="text-3xl mb-2 text-[#9C836A]">🛡</p>
            <p className="text-sm text-[#1A0F00]">{lang === 'en' ? 'You are not moderating any communities' : 'ማህበረሰብ እያስተዳደሩ አይደለም'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen font-sans bg-[#F2E9DF]">
      <Navbar lang={lang} onToggleLang={() => setLang(l => l === 'en' ? 'am' : 'en')} onLogin={() => navigate('/login')} onSignup={() => navigate('/register')} />
      <div className="flex md:flex-row flex-col flex-1 overflow-hidden">
        <div className="hidden md:block w-[220px] flex-shrink-0 bg-[#FAF4EC] border-r border-[#DDD0BE] p-4 overflow-y-auto">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#9C836A] mb-4">{lang === 'en' ? 'MOD DASHBOARD' : 'ሞዴሬተር ዳሽቦርድ'}</p>
          <div className="flex flex-col gap-1">
            {navItem('reports', '📋', 'Reports', 'ሪፖርቶች', pendingCount)}
            {navItem('removed', '🗑', 'Removed content', 'የተወገደ ይዘት')}
            {navItem('banned', '🚫', 'Banned users', 'የታገዱ ተጠቃሚዎች', bannedUsers.length)}
          </div>
          <div className="border-t border-[#DDD0BE] my-4" />
          <p className="text-[10px] text-[#9C836A] uppercase tracking-wide mb-2">{lang === 'en' ? 'MODERATING' : 'እያስተዳደሩ'}</p>
          <div className="flex flex-col gap-1">
            {moderatedComms.map(c => (
              <div key={c.id} className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer ${selectedCommId === c.id ? 'bg-[#F2E0C8]' : 'hover:bg-[#F2E0C8]'}`} onClick={() => setSelectedCommId(c.id)}>
                <div className="w-6 h-6 rounded bg-[#EDE9FE] flex items-center justify-center text-xs">💻</div>
                <span className="text-xs font-bold text-[#1A0F00]">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="md:hidden bg-[#FAF4EC] border-b border-[#DDD0BE] px-2 py-1 flex gap-1 overflow-x-auto">
            {navItem('reports', '📋', 'Reports', 'ሪፖርቶች', pendingCount)}
            {navItem('removed', '🗑', 'Removed', 'የተወገደ')}
            {navItem('banned', '🚫', 'Banned', 'የታገዱ', bannedUsers.length)}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="bg-[#FEF0E0] border border-[#E4C49A] rounded-[9px] p-4 mb-4">
              <p className="text-sm font-bold text-[#7A3B00] mb-2">{lang === 'en' ? 'How moderation works' : 'ሞዴሬሽን እንዴት ይሰራል'}</p>
              <div className="flex items-start gap-2 mb-1">
                <span className="text-xs">👑</span>
                <span className="text-xs text-[#7A3B00]">{lang === 'en' ? 'You (admin/mod): Remove posts, ban users manually' : 'እርስዎ (አስተዳዳሪ/ሞዴሬተር): ልጥፎችን ያስወግዱ፣ ተጠቃሚዎችን ያግዱ'}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs">🤖</span>
                <span className="text-xs text-[#7A3B00]">{lang === 'en' ? 'System: Auto-hides content that receives 5+ reports' : 'ሲስተም: 5+ ሪፖርቶችን የተቀበለ ይዘትን በራስ-ሰር ይደብቃል'}</span>
              </div>
            </div>
            {activeTab === 'reports' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <ModStatCard label="Pending" labelAm="በመጠባበቅ ላይ" value={reports.filter(r => r.status === 'pending').length} color="pending" lang={lang} />
                <ModStatCard label="Resolved" labelAm="የተፈቱ" value={reports.filter(r => r.status === 'resolved').length} color="resolved" lang={lang} />
                <ModStatCard label="Dismissed" labelAm="የተዘጉ" value={reports.filter(r => r.status === 'dismissed').length} color="dismissed" lang={lang} />
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {filterOptions.map(f => (
                  <div key={f.value} className={`text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer border ${statusFilter === f.value ? 'bg-[#F2E0C8] border-[#C9904F] text-[#4A2C00]' : 'border-[#DDD0BE] text-[#9C836A] hover:border-[#A8692A]'}`} onClick={() => setStatusFilter(f.value)}>
                    {lang === 'en' ? f.labelEn : f.labelAm}
                  </div>
                ))}
              </div>
              {filteredReports.length > 0 ? (
                filteredReports.map(report => (
                  <ReportCard key={report.id} report={report} lang={lang} onRemove={handleRemove} onDismiss={handleDismiss} onBan={handleBan} />
                ))
              ) : (
                <div className="bg-white border border-[#DDD0BE] rounded-[9px] p-8 text-center">
                  <p className="text-3xl text-[#5A7A2A] mb-2">✓</p>
                  <p className="text-sm text-[#1A0F00]">{lang === 'en' ? 'No reports in this category' : 'በዚህ ምድብ ሪፖርቶች የሉም'}</p>
                </div>
              )}
            </>
          )}
          {activeTab === 'removed' && (
            <div className="bg-white border border-[#DDD0BE] rounded-[9px] p-8 text-center">
              <p className="text-3xl mb-2 text-[#9C836A]">🗑</p>
              <p className="text-sm text-[#1A0F00]">{lang === 'en' ? 'Removed content will appear here' : 'የተወገደ ይዘት እዚህ ይታያል'}</p>
            </div>
          )}
          {activeTab === 'banned' && (
            <>
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-bold text-[#1A0F00]">{lang === 'en' ? 'Banned users' : 'የታገዱ ተጠቃሚዎች'}</p>
                <span className="text-xs text-[#9C836A]">{bannedUsers.length} {lang === 'en' ? 'users banned' : 'ተጠቃሚዎች ታግደዋል'}</span>
              </div>
              {bannedUsers.length > 0 ? (
                bannedUsers.map(user => (
                  <BannedUserCard key={user.id} bannedUser={user} lang={lang} onUnban={handleUnban} />
                ))
              ) : (
                <div className="bg-white border border-[#DDD0BE] rounded-[9px] p-8 text-center">
                  <p className="text-sm text-[#1A0F00]">{lang === 'en' ? 'No banned users' : 'የታገዱ ተጠቃሚዎች የሉም'}</p>
                </div>
              )}
            </>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};
