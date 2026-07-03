import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Language } from '../../types';
import { notificationsAPI } from '../../lib/api';

interface Notification {
  id: string;
  type: string;
  content: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationDropdownProps {
  lang: Language;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ lang }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifications = () => {
    notificationsAPI.getAll().then(data => {
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    }).catch(() => {});
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  const handleNotificationClick = async (n: Notification) => {
    if (!n.isRead) {
      try {
        await notificationsAPI.markRead(n.id);
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, isRead: true } : x));
      } catch {}
    }
    setOpen(false);
    navigate(n.link);
  };

  return (
    <div ref={ref} className="relative">
      <div className="relative cursor-pointer" onClick={() => setOpen(!open)}>
        <span className="text-[#9C836A] text-xs">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-[#D97706] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[320px] bg-white border border-[#DDD0BE] rounded-[9px] shadow-lg z-50 max-h-[400px] flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#DDD0BE]">
            <span className="text-xs font-bold text-[#1A0F00]">{lang === 'en' ? 'Notifications' : 'ማሳወቂያዎች'}</span>
            {unreadCount > 0 && (
              <span className="text-[10px] text-[#A8692A] cursor-pointer hover:underline" onClick={handleMarkAllRead}>
                {lang === 'en' ? 'Mark all read' : 'ሁሉንም አንብብ'}
              </span>
            )}
          </div>
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-xs text-[#9C836A]">{lang === 'en' ? 'No notifications yet' : 'ማሳወቂያ የለም'}</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={`flex items-start gap-2 px-3 py-2.5 border-b border-[#F2E0C8] last:border-0 cursor-pointer hover:bg-[#FAF4EC] ${n.isRead ? '' : 'bg-[#FFF8F0]'}`}
                  onClick={() => handleNotificationClick(n)}
                >
                  <span className="text-sm mt-0.5">
                    {n.type === 'join_group' ? '👥' : 
                     n.type === 'reply_post' || n.type === 'reply_comment' ? '💬' : 
                     n.type === 'mod_action' ? '🛡️' : 
                     n.type === 'report' ? '🚩' : '🔔'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs ${n.isRead ? 'text-[#5C4A32]' : 'text-[#1A0F00] font-semibold'}`}>{n.content}</p>
                    <p className="text-[10px] text-[#9C836A] mt-0.5">{new Date(n.createdAt).toLocaleDateString()}</p>
                  </div>
                  {!n.isRead && <div className="w-2 h-2 rounded-full bg-[#D97706] mt-1.5 flex-shrink-0" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
