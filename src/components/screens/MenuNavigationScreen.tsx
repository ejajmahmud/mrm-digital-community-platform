import React from 'react';
import {
  Home,
  Search,
  Calendar,
  TrendingUp,
  MessageSquare,
  Send,
  Bell,
  Settings,
  ChevronRight,
  ShieldCheck,
  Radio,
  FileText,
  AlertTriangle,
  BookOpen,
  HeartHandshake,
  Sun,
  Moon,
  Layers,
  LogIn,
  Sparkles,
  Download,
  Compass,
  Clock,
  Hash,
  Calculator,
  CheckCircle2,
} from 'lucide-react';
import { ScreenId, ALL_SCREENS_META } from '../../types/screens';
import { UserRole } from '../../types';
import { ROLE_CONFIGS, RoleConfig } from '../../types/roleConfig';
import { MrmLogoBadge } from '../mobile/MrmLogo';
import { UtilityTabId } from '../../data/islamicUtilitiesData';
import { getLocationSyncSnapshot } from '../../utils/mrmLogic';

interface MenuNavigationScreenProps {
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
  onNavigate: (screen: ScreenId) => void;
  onOpenUtility?: (tab: UtilityTabId) => void;
  selectedZone?: string;
  playClickSound?: (freq?: number) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onOpenNavigator?: () => void;
}

export const MenuNavigationScreen: React.FC<MenuNavigationScreenProps> = ({
  currentRole = 'staff_admin',
  onNavigate,
  onOpenUtility,
  selectedZone = 'WLY01 - Kuala Lumpur & Putrajaya',
  playClickSound,
  theme = 'light',
  onToggleTheme,
  onOpenNavigator,
}) => {
  const roleMeta: RoleConfig = ROLE_CONFIGS[currentRole] || ROLE_CONFIGS.staff_admin;
  const locationSnap = getLocationSyncSnapshot(selectedZone);

  const utilityShortcuts: {
    id: UtilityTabId;
    label: string;
    icon: React.FC<{ className?: string }>;
    iconUrl?: string;
  }[] = [
    { id: 'waqt', label: `Waqt & Sehri (${locationSnap.zoneCode})`, icon: Clock, iconUrl: './icons/bento/waqt.png' },
    { id: 'tracker', label: '5-Waqt Salah & Qaza Log', icon: CheckCircle2, iconUrl: './icons/bento/log.png' },
    { id: 'qibla', label: `Qibla 3D Compass (${locationSnap.qibla.bearingDegrees}°)`, icon: Compass, iconUrl: './icons/bento/qibla.png' },
    { id: 'quran', label: 'Color-Coded Tajweed Quran', icon: BookOpen, iconUrl: './icons/bento/tajweed.png' },
    { id: 'tasbih', label: 'Digital Tasbih Counter', icon: Hash, iconUrl: './icons/bento/tasbih.png' },
    { id: 'dua', label: 'Hisnul Muslim & Ruqyah', icon: Sparkles, iconUrl: './icons/bento/duas.png' },
    { id: 'salah_guide', label: 'Revert 7-Posture Salah Guide', icon: Sun, iconUrl: './icons/bento/revert_salah.png' },
    { id: 'halal', label: 'Halal E-Codes & Fitrah Calc', icon: Calculator, iconUrl: './icons/bento/halal_fitrah.png' },
  ];

  return (
    <div className="min-h-full flex flex-col p-4 u-canvas pb-28 select-none space-y-4">
      {/* Brand Identity & Active Role Card */}
      <div className="p-4 u-card flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <MrmLogoBadge size="md" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold truncate">Multiracial Reverted Muslims</h2>
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              Official Revert Care, Islamic Utilities &amp; Zakat Hub
            </p>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* MRM COMPLETE ISLAMIC UTILITIES HUB (9 MODULES)                      */}
      {/* =================================================================== */}
      <div>
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1 flex items-center justify-between">
          <span>MRM Islamic Utilities (9 Modules · {locationSnap.zoneCode})</span>
          <button
            type="button"
            onClick={() => onOpenUtility?.('waqt')}
            className="text-emerald-600 hover:underline cursor-pointer"
          >
            Open Suite
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {utilityShortcuts.map((u) => {
            const Icon = u.icon;
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  playClickSound?.(840);
                  onOpenUtility?.(u.id);
                }}
                className="p-2.5 u-card u-card-hover flex items-center gap-2 text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                  {u.iconUrl ? (
                    <img src={u.iconUrl} alt={u.label} className="w-6 h-6 object-contain" />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-bold leading-tight truncate">{u.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* APPEARANCE (THEME SWITCHER) & 20-SCREEN DIRECTORY CONTROLS          */}
      {/* =================================================================== */}
      <div className="p-3.5 u-card space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold block">Appearance &amp; Theme</span>
            <span className="text-[11px] text-slate-500">
              Switch between crisp Daylight and OLED Night mode
            </span>
          </div>
          <div className="inline-flex p-1 rounded-xl u-subtle border border-slate-200/80">
            <button
              type="button"
              onClick={() => {
                if (theme !== 'light') {
                  playClickSound?.(820);
                  onToggleTheme?.();
                }
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (theme !== 'dark') {
                  playClickSound?.(740);
                  onToggleTheme?.();
                }
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-200/70 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold block">20-Screen Architecture Directory</span>
            <span className="text-[11px] text-slate-500">
              Jump directly to any of the {ALL_SCREENS_META.length} mobile screens
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              playClickSound?.(860);
              onOpenNavigator?.();
            }}
            className="min-h-[38px] px-3.5 py-2 rounded-xl u-btn-primary text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All 20 Screens</span>
          </button>
        </div>

        {/* Full Project Bundle Download */}
        <div className="pt-2.5 border-t border-slate-200/70 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold block text-emerald-700 dark:text-emerald-400">
              ⚡ Full Production Bundle
            </span>
            <span className="text-[11px] text-slate-500">
              React SPA + Android Studio Kotlin + 48 Screens (54.8 MB)
            </span>
          </div>
          <a
            href="./MRM-Care-Full-Production-Bundle.zip"
            download="MRM-Care-Full-Production-Bundle.zip"
            onClick={() => playClickSound?.(880)}
            className="min-h-[38px] px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Full .ZIP</span>
          </a>
        </div>

        <div className="pt-2.5 border-t border-slate-200/70 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold block">Pure Android Studio Project</span>
            <span className="text-[11px] text-slate-500">
              Kotlin 2.0 + Jetpack Compose Material 3 (225 KB)
            </span>
          </div>
          <a
            href="./MRM_Care_Android_Studio_Project.zip"
            download="MRM_Care_Android_Studio_Project.zip"
            onClick={() => playClickSound?.(880)}
            className="min-h-[38px] px-3.5 py-2 rounded-xl u-btn-secondary text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Android .ZIP</span>
          </a>
        </div>

        <div className="pt-2.5 border-t border-slate-200/70 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold block">iPhone 17 Pro Max Screenshots</span>
            <span className="text-[11px] text-slate-500">
              All 48 screens &amp; hidden views in bezel.fit White (53.1 MB)
            </span>
          </div>
          <a
            href="./MRM-Care-iPhone-17-Pro-Max-White-48Screens.zip"
            download="MRM-Care-iPhone-17-Pro-Max-White-48Screens.zip"
            onClick={() => playClickSound?.(880)}
            className="min-h-[38px] px-3.5 py-2 rounded-xl u-btn-secondary text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>48 Screens .ZIP</span>
          </a>
        </div>
      </div>

      {/* Active Role Profile Summary */}
      <button
        type="button"
        onClick={() => {
          playClickSound?.();
          onNavigate('profile');
        }}
        className="w-full p-3.5 u-card u-card-hover flex items-center justify-between text-left cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={roleMeta.avatarUrl}
            alt={roleMeta.name}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/30 shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold truncate">{roleMeta.name}</span>
              <span className="text-[10px] font-mono font-bold text-emerald-600">{roleMeta.shortLabel}</span>
            </div>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">{roleMeta.subtitle}</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
      </button>

      {/* Role-Specific Mission Tools */}
      <div>
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
          {roleMeta.shortLabel} Workspace Tools
        </div>
        <div className="u-card divide-y divide-slate-200/70 overflow-hidden">
          {currentRole === 'staff_admin' && (
            <>
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-500/5 cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold">Crisis Operations Command Metrics</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('search')}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-500/5 cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-sky-600" />
                  <span className="text-xs font-semibold">Search Volunteers, Mosques &amp; Cases</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </>
          )}

          {currentRole === 'approved_volunteer' && (
            <>
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-500/5 cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold">Live Field Callout Dispatch Radar</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('calendar_booking')}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-500/5 cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  <span className="text-xs font-semibold">Register Volunteer Duty Shift</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </>
          )}

          {currentRole === 'seeker' && (
            <>
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-500/5 cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-semibold">Request Emergency Halal Food Aid</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('chat')}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-500/5 cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Send className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold">Chat Confidential Caseworker</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </>
          )}

          {currentRole === 'approved_teacher' && (
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="w-full p-3.5 flex items-center justify-between hover:bg-slate-500/5 cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold">Revert 1-on-1 Counseling Console</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          )}

          {currentRole === 'volunteer_applicant' && (
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="w-full p-3.5 flex items-center justify-between hover:bg-slate-500/5 cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold">Vetting Milestones &amp; SKP Upload</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          )}

          {currentRole === 'member' && (
            <button
              type="button"
              onClick={() => onNavigate('catalog')}
              className="w-full p-3.5 flex items-center justify-between hover:bg-slate-500/5 cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <HeartHandshake className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold">Sponsor Food Hamper or Revert Kit</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Core Platform Navigation */}
      <div>
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
          Platform Modules &amp; Screens
        </div>
        <div className="u-card divide-y divide-slate-200/70 overflow-hidden">
          {[
            { id: 'home' as ScreenId, label: 'Home Operations Hub', icon: Home, color: 'text-emerald-600' },
            { id: 'catalog' as ScreenId, label: 'Welfare & Infaq Campaigns', icon: HeartHandshake, color: 'text-teal-600' },
            { id: 'calendar_booking' as ScreenId, label: 'Prayer, Halaqa & Shift Calendar', icon: Calendar, color: 'text-sky-600' },
            { id: 'dashboard' as ScreenId, label: 'Impact & Zakat Analytics', icon: TrendingUp, color: 'text-emerald-600' },
            { id: 'feed' as ScreenId, label: 'Dawah & Community Feed', icon: MessageSquare, color: 'text-indigo-600' },
            { id: 'chat' as ScreenId, label: 'Encrypted Caseworker Chat', icon: Send, color: 'text-emerald-600' },
            { id: 'search' as ScreenId, label: 'Mosque & Care Hub Finder', icon: Search, color: 'text-amber-600' },
            { id: 'notifications' as ScreenId, label: 'Dispatch Alerts & Reminders', icon: Bell, color: 'text-rose-600' },
            { id: 'cart' as ScreenId, label: 'Sadaqah & Infaq Basket', icon: HeartHandshake, color: 'text-emerald-600' },
            { id: 'settings' as ScreenId, label: 'App Settings, Theme & Privacy', icon: Settings, color: 'text-slate-600' },
            { id: 'empty_loading_error' as ScreenId, label: 'Offline & Network Resilience', icon: Sparkles, color: 'text-amber-600' },
            { id: 'welcome' as ScreenId, label: 'Welcome & Auth Gateway', icon: LogIn, color: 'text-slate-600' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  playClickSound?.();
                  onNavigate(item.id);
                }}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-500/5 cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-xs font-semibold">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
