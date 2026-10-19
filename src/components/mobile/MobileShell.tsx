import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Grid, 
  Clock, 
  User, 
  Wifi, 
  Battery, 
  BatteryCharging,
  Signal, 
  Maximize2, 
  Minimize2,
  Smartphone,
  Power,
  Volume2,
  Volume1,
  VolumeX,
  RotateCw,
  Camera,
  Compass,
  Bell,
  Lock,
  Unlock,
  Sparkles,
  ChevronUp,
  Play,
  Square,
  Circle,
  Settings as SettingsIcon,
  Download,
  Layers
} from 'lucide-react';
import { 
  UserRole, 
  HelpRequest, 
  VolunteerProfile, 
  Assignment, 
  LearningItem, 
  ZakatReferral, 
  ActivityNotification 
} from '../../types';
import { HomeTab } from './HomeTab';
import { ServicesTab } from './ServicesTab';
import { ActivityTab } from './ActivityTab';
import { AccountTab } from './AccountTab';
import { HelpRequestModal } from './modals/HelpRequestModal';
import { VolunteerApplyModal } from './modals/VolunteerApplyModal';
import { AssignmentsModal } from './modals/AssignmentsModal';
import { LearningModal } from './modals/LearningModal';
import { ZakatModal } from './modals/ZakatModal';
import { UtilitiesModal } from './modals/UtilitiesModal';
import { AndroidRunModal } from './modals/AndroidRunModal';
import { AndroidOS, AndroidAppId } from './AndroidOS';
import { AppScreenContainer } from '../screens/AppScreenContainer';

type DeviceModel = 'iphone16' | 'pixel9' | 'galaxy24';

interface MobileShellProps {
  initialRole?: UserRole;
  initialHelpRequests: HelpRequest[];
  initialVolunteerProfile: VolunteerProfile;
  initialAssignments: Assignment[];
  initialLearningItems: LearningItem[];
  initialZakatReferrals: ZakatReferral[];
  initialNotifications: ActivityNotification[];
}

export const MobileShell: React.FC<MobileShellProps> = ({
  initialRole = 'staff_admin',
  initialHelpRequests,
  initialVolunteerProfile,
  initialAssignments,
  initialLearningItems,
  initialZakatReferrals,
  initialNotifications,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'activity' | 'account'>('home');
  const [currentRole, setCurrentRole] = useState<UserRole>(initialRole);
  const [serviceArea, setServiceArea] = useState<string>('Kuala Lumpur');
  
  // Emulator State
  const [deviceModel, setDeviceModel] = useState<DeviceModel>('pixel9');
  const [androidActiveApp, setAndroidActiveApp] = useState<AndroidAppId>('mrm_app');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [volumeLevel, setVolumeLevel] = useState<number>(75);
  const [showVolumeHud, setShowVolumeHud] = useState<boolean>(false);
  const [batteryLevel, setBatteryLevel] = useState<number>(94);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [isPureView, setIsPureView] = useState<boolean>(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [zoomScale, setZoomScale] = useState<number>(100);

  // Data states
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>(initialHelpRequests);
  const [volunteerProfile, setVolunteerProfile] = useState<VolunteerProfile>(initialVolunteerProfile);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [learningItems] = useState<LearningItem[]>(initialLearningItems);
  const [zakatReferrals, setZakatReferrals] = useState<ZakatReferral[]>(initialZakatReferrals);
  const [notifications, setNotifications] = useState<ActivityNotification[]>(initialNotifications);

  // Modals state
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false);
  const [isAssignmentsOpen, setIsAssignmentsOpen] = useState(false);
  const [isLearningOpen, setIsLearningOpen] = useState(false);
  const [isZakatOpen, setIsZakatOpen] = useState(false);
  const [isUtilitiesOpen, setIsUtilitiesOpen] = useState(false);
  const [utilitiesInitialTab, setUtilitiesInitialTab] = useState('prayer');
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const playClickSound = (freq = 800) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Ignored if sound is restricted
    }
  };

  const handleVolumeChange = (delta: number) => {
    setVolumeLevel(prev => {
      const next = Math.min(100, Math.max(0, prev + delta));
      return next;
    });
    setShowVolumeHud(true);
    playClickSound(delta > 0 ? 900 : 700);
    setTimeout(() => setShowVolumeHud(false), 1800);
  };

  const handlePowerToggle = () => {
    playClickSound(400);
    setIsLocked(prev => !prev);
  };

  const handleCreateHelpRequest = (newReq: Partial<HelpRequest>) => {
    const created: HelpRequest = {
      id: `req-${Date.now()}`,
      reference: newReq.reference || `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newReq.category || 'revert_support',
      categoryLabel: newReq.categoryLabel || 'Community Care',
      summary: newReq.summary || '',
      description: newReq.description || '',
      urgency: newReq.urgency || 'routine',
      area: newReq.area || serviceArea,
      contactPreference: newReq.contactPreference || 'in_app',
      contactValue: newReq.contactValue || 'In-app safe',
      isAnonymous: Boolean(newReq.isAnonymous),
      status: newReq.status || 'submitted',
      createdAt: 'Just now'
    };

    setHelpRequests([created, ...helpRequests]);

    const newNotif: ActivityNotification = {
      id: `notif-${Date.now()}`,
      title: 'Care Request Registered',
      message: `Your request ${created.reference} has been received and routed to MRM Triage.`,
      type: 'help',
      timestamp: 'Just now',
      read: false
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleUpdateVolunteerProfile = (updated: VolunteerProfile) => {
    setVolunteerProfile(updated);
    if (updated.status === 'approved') {
      setCurrentRole('approved_volunteer');
    }
  };

  const handleUpdateAssignment = (updated: Assignment) => {
    setAssignments(assignments.map(a => a.id === updated.id ? updated : a));
  };

  const handleCreateZakatReferral = (newZkt: Partial<ZakatReferral>) => {
    const created: ZakatReferral = {
      id: `zkt-${Date.now()}`,
      reference: newZkt.reference || `MY-ZKT-${Date.now()}`,
      memberName: newZkt.memberName || 'Member',
      needDescription: newZkt.needDescription || '',
      region: newZkt.region || serviceArea,
      stateAuthority: newZkt.stateAuthority || 'Lembaga Zakat',
      contactPhone: newZkt.contactPhone || '',
      status: 'submitted',
      submittedDate: 'Today',
      consentGiven: true,
      notes: newZkt.notes || 'Submitted for institutional handoff.'
    };
    setZakatReferrals([created, ...zakatReferrals]);
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const openUtilitiesTab = (tab: string = 'prayer') => {
    setUtilitiesInitialTab(tab);
    setIsUtilitiesOpen(true);
  };

  const getUserDisplayName = () => {
    switch (currentRole) {
      case 'staff_admin': return 'Admin';
      case 'approved_volunteer': return 'Ahmad Faisal';
      case 'approved_teacher': return 'Ustazah Hana';
      case 'seeker': return 'Brother Jason';
      default: return 'Member';
    }
  };

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-start p-0 sm:py-6 sm:px-4 select-none">
      
      {/* EMULATOR STUDIO CONTROL DOCK (Desktop) */}
      <div className="w-full max-w-4xl hidden sm:flex flex-col gap-2.5 mb-4 p-3 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between">
          {/* Logo & Emulator Label */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <div className="flex -space-x-1">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-800" />
                <span className="w-3.5 h-3.5 rounded-full bg-teal-400 ring-2 ring-slate-800" />
                <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 ring-2 ring-slate-800" />
              </div>
              <span className="text-sm font-extrabold tracking-tight">MRM EMULATOR</span>
            </div>

            {/* Device Model Switcher */}
            <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-700/60 text-xs">
              <button
                onClick={() => setDeviceModel('iphone16')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  deviceModel === 'iphone16' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                iPhone 16 Pro
              </button>
              <button
                onClick={() => setDeviceModel('pixel9')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  deviceModel === 'pixel9' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pixel 9 Pro
              </button>
              <button
                onClick={() => setDeviceModel('galaxy24')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  deviceModel === 'galaxy24' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Galaxy S24
              </button>
            </div>
          </div>

          {/* Quick Emulator Controls */}
          <div className="flex items-center gap-2">
            {/* Lock / Power Button */}
            <button
              onClick={handlePowerToggle}
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                isLocked 
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' 
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-750'
              }`}
              title={isLocked ? 'Wake / Unlock Screen' : 'Sleep / Lock Screen'}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isLocked ? 'Wake' : 'Lock'}</span>
            </button>

            {/* Volume Up / Down */}
            <div className="flex items-center bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
              <button
                onClick={() => handleVolumeChange(-15)}
                className="px-2.5 py-1.5 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Volume Down"
              >
                <Volume1 className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono px-1.5 text-slate-400">{volumeLevel}%</span>
              <button
                onClick={() => handleVolumeChange(15)}
                className="px-2.5 py-1.5 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Volume Up"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Battery Charging toggle */}
            <button
              onClick={() => setIsCharging(!isCharging)}
              className={`p-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                isCharging 
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Toggle Charger Cable"
            >
              {isCharging ? <BatteryCharging className="w-3.5 h-3.5" /> : <Battery className="w-3.5 h-3.5" />}
            </button>

            {/* Android Device / APK Guide */}
            <button
              onClick={() => setIsAndroidModalOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-emerald-500/50 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/70 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Run on Android Device or build APK"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Android / APK</span>
            </button>

            {/* Pure View / Bezeless Toggle */}
            <button
              onClick={() => setIsPureView(!isPureView)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                isPureView ? 'bg-teal-700 text-white border-teal-600' : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {isPureView ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isPureView ? 'Show Frame' : 'Full Width'}</span>
            </button>
          </div>
        </div>

        {/* Android OS 15 Virtualization Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-700/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white tracking-tight">Android 15 OS (Pixel 9 Pro)</span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-800/40 font-mono">
              Running API 35
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { playClickSound(); setAndroidActiveApp('mrm_app'); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                androidActiveApp === 'mrm_app' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Launch MRM Community App"
            >
              <Play className="w-3 h-3 fill-current" /> Run App
            </button>

            <button
              onClick={() => { playClickSound(); setAndroidActiveApp('launcher'); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                androidActiveApp === 'launcher' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Android Home Screen"
            >
              <Circle className="w-3 h-3 fill-current" /> Home (●)
            </button>

            <button
              onClick={() => { playClickSound(); setAndroidActiveApp('recents'); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                androidActiveApp === 'recents' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Multitasking Overview"
            >
              <Square className="w-3 h-3" /> Recents (◼)
            </button>

            <button
              onClick={() => { playClickSound(); setAndroidActiveApp('settings'); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                androidActiveApp === 'settings' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Android System Settings"
            >
              <SettingsIcon className="w-3 h-3" /> Settings
            </button>

            <button
              onClick={() => { playClickSound(); setAndroidActiveApp('files'); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                androidActiveApp === 'files' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Install or manage APKs"
            >
              <Download className="w-3 h-3" /> APK Files
            </button>
          </div>
        </div>

        {/* Precision Metal User Role Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-700/80 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider mr-1">
              SWITCH ROLE:
            </span>
            {[
              { id: 'staff_admin', label: 'Admin Ops', metalClass: 'metal-titanium text-red-300 border-red-500/40' },
              { id: 'approved_volunteer', label: 'Volunteer', metalClass: 'metal-emerald text-emerald-100 border-emerald-300/40' },
              { id: 'seeker', label: 'Seeker', metalClass: 'metal-ruby text-rose-100 border-rose-300/40' },
              { id: 'approved_teacher', label: 'Scholar/Mentor', metalClass: 'metal-gold text-amber-950 border-amber-300' },
              { id: 'volunteer_applicant', label: 'Applicant', metalClass: 'metal-gunmetal text-slate-200 border-slate-500/40' },
              { id: 'member', label: 'Member', metalClass: 'metal-steel text-slate-900 border-slate-400' },
            ].map((r) => {
              const isActive = currentRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    playClickSound(850);
                    setCurrentRole(r.id as UserRole);
                  }}
                  className={`py-1 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer select-none active:scale-95 ${
                    isActive
                      ? `${r.metalClass} shadow-md ring-2 ring-white/50 scale-105`
                      : 'bg-slate-900 text-slate-400 border border-slate-700/80 hover:text-white hover:border-slate-500'
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span>Area: <strong className="text-white">{serviceArea}</strong></span>
            <span>•</span>
            <span className="text-emerald-400">Online 5G</span>
          </div>
        </div>
      </div>

      {/* PHYSICAL SMARTPHONE EMULATOR ENCLOSURE */}
      <div className="relative flex items-center justify-center">
        
        {/* Hardware side buttons (iPhone / Pixel style) */}
        {!isPureView && (
          <>
            {/* Left side: Volume Up, Volume Down, Action button */}
            <div className="absolute -left-[14px] top-28 flex flex-col gap-3 z-0 hidden sm:flex">
              <button 
                onClick={() => handleVolumeChange(15)}
                className="w-2.5 h-10 bg-slate-700 hover:bg-slate-600 rounded-l-md shadow-md cursor-pointer transition-colors"
                title="Hardware Volume +"
              />
              <button 
                onClick={() => handleVolumeChange(-15)}
                className="w-2.5 h-10 bg-slate-700 hover:bg-slate-600 rounded-l-md shadow-md cursor-pointer transition-colors"
                title="Hardware Volume -"
              />
            </div>

            {/* Right side: Power Button */}
            <div className="absolute -right-[14px] top-32 z-0 hidden sm:flex">
              <button 
                onClick={handlePowerToggle}
                className="w-2.5 h-14 bg-slate-700 hover:bg-slate-600 rounded-r-md shadow-md cursor-pointer transition-colors"
                title="Hardware Power Button"
              />
            </div>
          </>
        )}

        {/* Physical Chassis Frame */}
        <div 
          className={`w-full ${
            isPureView 
              ? 'max-w-md' 
              : deviceModel === 'galaxy24'
              ? 'sm:max-w-[428px] sm:rounded-[36px] sm:border-[10px] sm:border-slate-800 sm:shadow-[0_25px_70px_rgba(0,0,0,0.85)] sm:ring-2 sm:ring-slate-700'
              : deviceModel === 'pixel9'
              ? 'sm:max-w-[420px] sm:rounded-[44px] sm:border-[10px] sm:border-slate-850 sm:shadow-[0_25px_70px_rgba(0,0,0,0.85)] sm:ring-2 sm:ring-slate-700'
              : 'sm:max-w-[420px] sm:rounded-[52px] sm:border-[12px] sm:border-slate-800 sm:shadow-[0_25px_70px_rgba(0,0,0,0.85)] sm:ring-2 sm:ring-slate-700'
          } bg-slate-50 min-h-screen sm:min-h-[852px] sm:max-h-[870px] flex flex-col relative overflow-hidden transition-all duration-300`}
        >
          {/* Top Speaker Ear-piece */}
          {!isPureView && (
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-1 bg-slate-800 rounded-full z-40" />
          )}

          {/* Device Top Status Bar (for iPhone or when Locked) */}
          {(deviceModel === 'iphone16' || isLocked) && (
            <div className="w-full pt-3 px-6 pb-2 flex items-center justify-between text-xs font-semibold text-slate-900 select-none z-30 shrink-0 bg-slate-50/95 backdrop-blur-xs">
              <span className="font-mono text-[13px] tracking-tight">{currentTime}</span>

              {/* Dynamic Island for iPhone */}
              <button 
                type="button"
                onClick={() => openUtilitiesTab('prayer')}
                className="w-26 h-5 bg-black hover:bg-slate-900 transition-colors rounded-full flex items-center justify-end px-2.5 gap-1.5 cursor-pointer shadow-xs"
                title="Dynamic Island (Tap for Live Prayer Times)"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </button>

              <div className="flex items-center gap-1.5 text-slate-800">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <div className="flex items-center gap-0.5 font-mono text-[11px]">
                  {isCharging ? (
                    <BatteryCharging className="w-4 h-4 text-emerald-700" />
                  ) : (
                    <Battery className="w-4 h-4 text-slate-800" />
                  )}
                  <span>{batteryLevel}%</span>
                </div>
              </div>
            </div>
          )}

          {/* On-screen Volume HUD Overlay */}
          {showVolumeHud && (
            <div className="absolute left-3 top-16 z-50 bg-slate-900/90 text-white px-3 py-2 rounded-xl shadow-lg border border-slate-800 flex items-center gap-2 text-xs animate-fade-in">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-150"
                  style={{ width: `${volumeLevel}%` }}
                />
              </div>
              <span className="font-mono text-[10px]">{volumeLevel}%</span>
            </div>
          )}

          {/* INTERACTIVE LOCK SCREEN (When locked via hardware/toolbar button) */}
          {isLocked ? (
            <div 
              onClick={() => setIsLocked(false)}
              className="flex-1 bg-gradient-to-b from-slate-900 via-emerald-950/80 to-slate-950 text-white flex flex-col justify-between p-7 cursor-pointer z-40 animate-fade-in"
            >
              {/* Top Lock status */}
              <div className="flex justify-center pt-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80">
                  <Lock className="w-4 h-4" />
                </div>
              </div>

              {/* Center Clock & Hijri Calendar */}
              <div className="text-center space-y-2">
                <p className="text-xs text-emerald-300 font-medium tracking-wide">
                  14 Rabi' al-Thani 1448 AH
                </p>
                <h2 className="text-6xl font-light tracking-tight font-mono text-white">
                  {currentTime}
                </h2>
                <p className="text-sm text-slate-300">
                  {currentDate}
                </p>

                {/* Lockscreen Prayer Card */}
                <div className="mt-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-left space-y-1">
                  <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold">
                    <span>MRM Community Prayer</span>
                    <span>Upcoming</span>
                  </div>
                  <p className="text-sm font-bold text-white">Fajr at 05:40 AM</p>
                  <p className="text-xs text-slate-300">Kuala Lumpur & Putrajaya Zone (JAKIM)</p>
                </div>
              </div>

              {/* Bottom Unlock Prompt */}
              <div className="text-center space-y-3 pb-4">
                <div className="flex flex-col items-center gap-1 text-slate-400 text-xs animate-bounce">
                  <ChevronUp className="w-4 h-4" />
                  <span>Tap anywhere to unlock emulator</span>
                </div>
                <div className="w-32 h-1 bg-white/40 rounded-full mx-auto" />
              </div>
            </div>
          ) : deviceModel === 'pixel9' || deviceModel === 'galaxy24' ? (
            /* ANDROID OS ENVIRONMENT (Google Pixel 9 Pro / Samsung Galaxy S24) */
            <AndroidOS
              deviceModel={deviceModel}
              isCharging={isCharging}
              batteryLevel={batteryLevel}
              volumeLevel={volumeLevel}
              currentTime={currentTime}
              currentDate={currentDate}
              forcedApp={androidActiveApp}
              onAppChange={setAndroidActiveApp}
            >
              <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
                <AppScreenContainer 
                  currentRole={currentRole} 
                  onRoleChange={setCurrentRole} 
                  playClickSound={playClickSound} 
                />
              </div>
            </AndroidOS>
          ) : (
            /* ACTIVE RUNNING APPLICATION VIEWPORT (iOS) */
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
              <AppScreenContainer 
                currentRole={currentRole} 
                onRoleChange={setCurrentRole} 
                playClickSound={playClickSound} 
              />
            </div>
          )}

          {/* Modals */}
          <HelpRequestModal
            isOpen={isHelpOpen}
            onClose={() => setIsHelpOpen(false)}
            onSubmit={handleCreateHelpRequest}
          />

          <VolunteerApplyModal
            isOpen={isVolunteerOpen}
            onClose={() => setIsVolunteerOpen(false)}
            profile={volunteerProfile}
            onUpdateProfile={handleUpdateVolunteerProfile}
          />

          <AssignmentsModal
            isOpen={isAssignmentsOpen}
            onClose={() => setIsAssignmentsOpen(false)}
            assignments={assignments}
            onUpdateAssignment={handleUpdateAssignment}
          />

          <LearningModal
            isOpen={isLearningOpen}
            onClose={() => setIsLearningOpen(false)}
            items={learningItems}
          />

          <ZakatModal
            isOpen={isZakatOpen}
            onClose={() => setIsZakatOpen(false)}
            onSubmitReferral={handleCreateZakatReferral}
          />

          <UtilitiesModal
            isOpen={isUtilitiesOpen}
            onClose={() => setIsUtilitiesOpen(false)}
            initialTab={utilitiesInitialTab}
          />

          <AndroidRunModal
            isOpen={isAndroidModalOpen}
            onClose={() => setIsAndroidModalOpen(false)}
            appUrl="https://ais-pre-3q4hfp6b7fjr7iquzvmzip-387879858609.asia-northeast1.run.app"
          />
        </div>
      </div>
    </div>
  );
};
