import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Clock,
  HeartHandshake,
  ShieldAlert,
  Trash2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { ScreenId } from '../../types/screens';

interface NotificationsScreenProps {
  onNavigate: (screen: ScreenId) => void;
  playClickSound?: () => void;
}

interface NotificationItem {
  id: string;
  type: 'urgent' | 'reminder' | 'system' | 'care';
  title: string;
  body: string;
  timeAgo: string;
  read: boolean;
  actionScreen?: ScreenId;
  actionLabel?: string;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onNavigate,
  playClickSound,
}) => {
  const [filter, setFilter] = useState<'all' | 'urgent' | 'reminders'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'urgent',
      title: 'Emergency Food Aid Request Dispatched',
      body: 'Volunteer Brother Hisham accepted REQ-8491 for Bangsar household. ETA 15 mins.',
      timeAgo: '12m ago',
      read: false,
      actionScreen: 'chat',
      actionLabel: 'Open Case Chat',
    },
    {
      id: 'notif-2',
      type: 'reminder',
      title: 'Volunteer Shift Tomorrow: Masjid Wilayah',
      body: 'You are scheduled for Food Basket Assembly at Masjid Wilayah (09:00 AM).',
      timeAgo: '1h ago',
      read: false,
      actionScreen: 'calendar_booking',
      actionLabel: 'View Shift',
    },
    {
      id: 'notif-3',
      type: 'care',
      title: 'New Revert Mentor Check-In Required',
      body: 'Brother Jason M. completed Week 3 of the Solat foundation modules.',
      timeAgo: '3h ago',
      read: false,
      actionScreen: 'chat',
      actionLabel: 'Contact Revert',
    },
    {
      id: 'notif-4',
      type: 'system',
      title: 'Official LHDN Tax Exemption Receipt Issued',
      body: 'Receipt MRM-TX-849102 for RM 120 Infaq contribution is ready for download.',
      timeAgo: '1d ago',
      read: true,
      actionScreen: 'checkout',
      actionLabel: 'View Receipt',
    },
  ]);

  const markAllRead = () => {
    playClickSound?.();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotif = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound?.();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'urgent') return n.type === 'urgent';
    if (filter === 'reminders') return n.type === 'reminder';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative min-h-full flex flex-col p-4 u-canvas pb-28 select-none space-y-3.5">
      {/* Filter Controls & Mark All Read */}
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex p-1 rounded-xl u-subtle border border-slate-200/80">
          {(['all', 'urgent', 'reminders'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                playClickSound?.();
                setFilter(tab);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={markAllRead}
          className="py-1.5 px-3 rounded-xl u-btn-secondary text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
        >
          <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{unreadCount > 0 ? `Read All (${unreadCount})` : 'All Read'}</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="p-8 text-center u-card">
            <Bell className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-xs font-bold mb-1">No Alerts in This Filter</h3>
            <p className="text-[11px] text-slate-500">All notifications are up to date.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                playClickSound?.();
                if (item.actionScreen) onNavigate(item.actionScreen);
              }}
              className={`p-3.5 u-card u-card-hover cursor-pointer flex flex-col gap-2 ${
                !item.read ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' : 'opacity-85'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      item.type === 'urgent'
                        ? 'bg-rose-500/15 text-rose-600'
                        : item.type === 'care'
                        ? 'bg-emerald-500/15 text-emerald-600'
                        : 'bg-sky-500/15 text-sky-600'
                    }`}
                  >
                    {item.type === 'urgent' ? (
                      <ShieldAlert className="w-4 h-4" />
                    ) : item.type === 'care' ? (
                      <HeartHandshake className="w-4 h-4" />
                    ) : item.type === 'reminder' ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold truncate">{item.title}</span>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      {item.body}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => deleteNotif(item.id, e)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                  title="Dismiss notification"
                  aria-label="Dismiss notification"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[10px]">
                <span className="font-mono text-slate-500">{item.timeAgo}</span>
                {item.actionLabel && (
                  <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                    {item.actionLabel} <ChevronRight className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
