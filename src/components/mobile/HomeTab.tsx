import React from 'react';
import { 
  Heart, 
  HelpCircle, 
  Clock, 
  Compass, 
  BookOpen, 
  Hash, 
  Coins, 
  ChevronRight, 
  Sparkles,
  Bell,
  ArrowUpRight
} from 'lucide-react';
import { 
  HelpRequest, 
  VolunteerProfile, 
  ActivityNotification 
} from '../../types';
import { LocationPrayerTimesWidget } from './LocationPrayerTimesWidget';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface HomeTabProps {
  userName: string;
  userRoleTitle: string;
  onRequestHelp: () => void;
  onVolunteerClick: () => void;
  onOpenUtilities: (tab?: string) => void;
  onOpenLearning: () => void;
  onSelectTab: (tab: 'home' | 'services' | 'activity' | 'account') => void;
  recentRequests: HelpRequest[];
  notifications: ActivityNotification[];
  volunteerProfile: VolunteerProfile;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  userName,
  onRequestHelp,
  onVolunteerClick,
  onOpenUtilities,
  onSelectTab,
  recentRequests,
  notifications,
  volunteerProfile
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-3.5 pb-20">
      {/* Top Header Card matching Slide 1 & 9 */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
              MRM COMMUNITY
            </p>
            <h1 className="text-xl font-bold text-slate-900 mt-1 leading-tight">
              Assalamu alaikum,<br />
              <span className="text-emerald-800">{userName}</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-normal max-w-[240px]">
              Care, service and belonging in one trusted place.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('activity')}
            className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Bismillah sub-strip */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="font-arabic text-emerald-800 text-sm font-semibold">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            14 Rabi' al-Thani 1448 AH
          </span>
        </div>
      </div>

      {/* Card 1: Need urgent help? (Page 1 & 9 Screenshot replica) */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Need urgent help?</h2>
              <p className="text-xs text-slate-500 leading-normal mt-0.5">
                If anyone is in immediate danger, contact local emergency services.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={onRequestHelp}
            className="w-full h-11 rounded-xl text-xs font-semibold text-slate-800 border-slate-300 hover:bg-slate-50 flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 text-emerald-700" />
            <span>Request help</span>
          </Button>
        </CardContent>
      </Card>

      {/* Card 2: A place to contribute (Page 1 & 9 Screenshot replica) */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-4 space-y-3">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              A place to contribute
            </p>
            <p className="text-xs text-slate-600 mt-0.5 leading-normal">
              Continue your volunteer journey or discover how to support the community.
            </p>
          </div>

          <button
            onClick={onVolunteerClick}
            className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white rounded-xl text-xs font-semibold flex items-center justify-between transition-colors shadow-xs cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>Volunteer with MRM</span>
            </span>
            <span className="text-[11px] text-emerald-100 flex items-center gap-1 font-normal">
              {volunteerProfile.status === 'approved' ? 'Active Volunteer' : 'Offer your skills'}
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </CardContent>
      </Card>

      {/* Card 3: Location-Aware Daily Prayer Times & Islamic Utilities */}
      <LocationPrayerTimesWidget onOpenQibla={() => onOpenUtilities('prayer')} />

      {/* Quick utilities strip */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { id: 'prayer', label: 'Qibla', icon: Compass },
          { id: 'tasbih', label: 'Tasbih', icon: Hash },
          { id: 'quran', label: 'Quran', icon: BookOpen },
          { id: 'zakat', label: 'Zakat', icon: Coins },
        ].map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => onOpenUtilities(tool.id)}
              className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1.5 text-center transition-colors shadow-xs cursor-pointer"
            >
              <Icon className="w-4 h-4 text-emerald-800" />
              <span className="text-[11px] font-medium text-slate-700">{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Card 4: Daily Prophetic Wisdom */}
      <Card className="border-slate-200 shadow-xs bg-slate-50/70">
        <CardContent className="p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Daily Reminder
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Sahih Bukhari</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed italic">
            "The believers in their mutual kindness, compassion and sympathy are just like one single body. When one limb suffers, the whole body responds to it with wakefulness and fever."
          </p>
        </CardContent>
      </Card>

      {/* Card 5: Recent Activity (Page 1 & 9 Screenshot replica) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Recent Activity
          </h2>
          <button 
            onClick={() => onSelectTab('activity')}
            className="text-xs text-emerald-800 hover:underline font-semibold cursor-pointer"
          >
            All services
          </button>
        </div>

        {recentRequests.length > 0 ? (
          <div className="space-y-2">
            {recentRequests.slice(0, 2).map((req) => (
              <Card 
                key={req.id}
                onClick={() => onSelectTab('activity')}
                className="cursor-pointer hover:border-slate-300 transition-colors shadow-xs"
              >
                <CardContent className="p-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 font-semibold">{req.reference}</span>
                      <span className="text-xs font-bold text-slate-900">{req.categoryLabel}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate max-w-[220px]">{req.summary}</p>
                  </div>
                  <Badge variant={req.status === 'completed' ? 'default' : 'secondary'} className="capitalize">
                    {req.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center p-6 border-dashed border-slate-200">
            <p className="text-xs font-medium text-slate-600">No activity yet</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Applications and MRM updates will appear here.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
