/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppScreenContainer } from './components/screens/AppScreenContainer';
import { UserRole } from './types';
import { ROLE_CONFIGS } from './types/roleConfig';
import { ScreenId, ALL_SCREENS_META } from './types/screens';
import {
  MRM_LOCATION_ZONES,
  getLocationSyncSnapshot,
  findNearestLocationZone,
} from './utils/mrmLogic';
import { UtilityTabId } from './data/islamicUtilitiesData';
import { MrmLogo } from './components/mobile/MrmLogo';
import { AndroidStudioBundleModal } from './components/mobile/AndroidStudioBundleModal';
import {
  ScreenshotsPackModal,
  BezelFinish,
  BEZEL_FINISH_META,
} from './components/mobile/ScreenshotsPackModal';
import {
  Sun,
  Moon,
  Compass,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  User,
  Settings,
  Check,
  Download,
  Smartphone,
  Image as ImageIcon,
  Sparkles,
  BookOpen,
  Clock,
  Hash,
  Calculator,
  HeartHandshake,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';

function getInitialQueryParams(): {
  screen: ScreenId;
  theme: 'light' | 'dark';
  capture: boolean;
  finish: BezelFinish;
  role: UserRole;
  utility: UtilityTabId | null;
  pure: boolean;
} {
  if (typeof window === 'undefined') {
    return {
      screen: 'home',
      theme: 'light',
      capture: false,
      finish: 'silver',
      role: 'staff_admin',
      utility: null,
      pure: false,
    };
  }
  const params = new URLSearchParams(window.location.search);
  const screenParam = params.get('screen') as ScreenId | null;
  const isValidScreen =
    screenParam && ALL_SCREENS_META.some((s) => s.id === screenParam);
  const themeParam = params.get('theme') === 'dark' ? 'dark' : 'light';
  const captureParam = params.get('capture') === '1';
  const pureParam =
    params.get('pure') === '1' ||
    params.get('mvp') === '1' ||
    params.get('mode') === 'mvp' ||
    params.get('mode') === 'pure';

  const roleParam = params.get('role') as UserRole | null;
  const isValidRole =
    roleParam && Object.prototype.hasOwnProperty.call(ROLE_CONFIGS, roleParam);

  const utilParam = params.get('utility') as UtilityTabId | null;
  const validUtils: UtilityTabId[] = [
    'waqt',
    'tracker',
    'qibla',
    'quran',
    'tasbih',
    'dua',
    'salah_guide',
    'sifat',
    'halal',
  ];
  const isValidUtil = utilParam && validUtils.includes(utilParam);

  return {
    screen: isValidScreen ? screenParam : 'home',
    theme: themeParam,
    capture: captureParam,
    finish: 'silver',
    role: isValidRole ? roleParam : 'staff_admin',
    utility: isValidUtil ? utilParam : null,
    pure: pureParam,
  };
}

export default function App() {
  const initialParams = getInitialQueryParams();
  const [theme, setTheme] = useState<'light' | 'dark'>(initialParams.theme);
  const [currentRole, setCurrentRole] = useState<UserRole>(initialParams.role);
  const [activeScreen, setActiveScreen] = useState<ScreenId>(initialParams.screen);
  const [activeUtilityTab, setActiveUtilityTab] = useState<UtilityTabId | null>(
    initialParams.utility
  );
  const [selectedZone, setSelectedZone] = useState<string>(
    'WLY01 - Kuala Lumpur & Putrajaya'
  );
  const [isSyncingGps, setIsSyncingGps] = useState<boolean>(false);
  const [isDesktopRoleOpen, setIsDesktopRoleOpen] = useState(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);
  const [isScreenshotsModalOpen, setIsScreenshotsModalOpen] = useState(false);
  const [isPureAndroidMode, setIsPureAndroidMode] = useState<boolean>(
    initialParams.pure
  );
  const [bezelFinish, setBezelFinish] = useState<BezelFinish>('silver');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Expose window helpers for deterministic navigation and location verification
  useEffect(() => {
    (window as any).__setMrmScreen = (scr: ScreenId) => {
      setActiveUtilityTab(null);
      setActiveScreen(scr);
    };
    (window as any).__openMrmUtility = (tab: UtilityTabId | null) => {
      setActiveUtilityTab(tab);
    };
    (window as any).__setMrmZone = (zone: string) => {
      setSelectedZone(zone);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const playClickSound = (freq = 800) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // AudioContext restricted prior to user interaction
    }
  };

  const handleSyncGpsLocation = () => {
    playClickSound(880);
    setIsSyncingGps(true);
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const nearest = findNearestLocationZone(
            pos.coords.latitude,
            pos.coords.longitude
          );
          setSelectedZone(nearest.zone.fullLabel);
          setIsSyncingGps(false);
        },
        () => {
          setIsSyncingGps(false);
        },
        { timeout: 3500 }
      );
    } else {
      setTimeout(() => setIsSyncingGps(false), 500);
    }
  };

  // Pure full-bleed viewport mode when ?capture=1 is passed (for 1320x2868 bezel.fit raw screen capture)
  if (initialParams.capture) {
    return (
      <div
        id="mrm-capture-viewport"
        data-theme={theme}
        style={{
          width: '440px',
          height: '956px',
        }}
        className="u-canvas overflow-hidden select-none"
      >
        <AppScreenContainer
          activeScreen={activeScreen}
          onScreenChange={setActiveScreen}
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          theme={theme}
          onToggleTheme={toggleTheme}
          playClickSound={playClickSound}
          activeUtilityTab={activeUtilityTab}
          onUtilityTabChange={setActiveUtilityTab}
          selectedZone={selectedZone}
          onSelectZone={setSelectedZone}
          onSyncGpsLocation={handleSyncGpsLocation}
          isSyncingGps={isSyncingGps}
        />
      </div>
    );
  }

  const roleMeta = ROLE_CONFIGS[currentRole] || ROLE_CONFIGS.staff_admin;
  const currentMeta =
    ALL_SCREENS_META.find((s) => s.id === activeScreen) || ALL_SCREENS_META[5];
  const locationSnap = getLocationSyncSnapshot(selectedZone);
  const prayerInfo = locationSnap.nextPrayerInfo;
  const waqtAlmanac = locationSnap.almanac;
  const activeBezelMeta = BEZEL_FINISH_META[bezelFinish];

  return (
    <div
      data-theme={theme}
      className="w-full h-screen u-canvas flex flex-col overflow-hidden select-none"
    >
      {/* ========================================================================= */}
      {/* DESKTOP 3-ZONE TOP BAR CONTRACT (Hidden in Pure Android App Mode)         */}
      {/* ========================================================================= */}
      {!isPureAndroidMode && (
        <header className="hidden lg:flex w-full shrink-0 h-15 u-surface border-b px-6 items-center justify-between gap-4 z-40">
          {/* Zone 1: Official MRM Logo + Wordmark */}
          <button
            type="button"
            onClick={() => {
              setActiveUtilityTab(null);
              setActiveScreen('home');
            }}
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <MrmLogo height={24} />
            <span className="text-base font-extrabold tracking-tight">
              MRM Community Platform
            </span>
          </button>

          {/* Zone 2: 5 Concise Single-Line Navigation Links */}
          <nav
            aria-label="Primary Workspace Navigation"
            className="flex items-center gap-4 xl:gap-5 text-xs xl:text-sm font-medium"
          >
            {[
              { id: 'home' as ScreenId, label: 'Home Hub' },
              { id: 'catalog' as ScreenId, label: 'Relief & Infaq' },
              { id: 'calendar_booking' as ScreenId, label: 'Halaqa & Shifts' },
              { id: 'dashboard' as ScreenId, label: 'Impact Analytics' },
              { id: 'feed' as ScreenId, label: 'Community Feed' },
            ].map((navItem) => {
              const isActive = activeScreen === navItem.id && !activeUtilityTab;
              return (
                <button
                  key={navItem.id}
                  type="button"
                  onClick={() => {
                    playClickSound(840);
                    setActiveUtilityTab(null);
                    setActiveScreen(navItem.id);
                  }}
                  className={`whitespace-nowrap shrink-0 py-1 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-emerald-600 font-semibold underline underline-offset-8 decoration-2'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {navItem.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Human Icon Role Switcher + Screenshots .ZIP + Android Bundle + Direct Zakat */}
          <div className="flex items-center gap-2 shrink-0 relative">
            <button
              type="button"
              onClick={() => {
                playClickSound(820);
                setIsDesktopRoleOpen((prev) => !prev);
              }}
              className="min-h-[38px] px-2.5 py-1.5 rounded-xl u-btn-secondary text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              aria-label="Switch Operating Role"
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>{roleMeta.shortLabel}</span>
            </button>

            {isDesktopRoleOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 u-card p-2 shadow-2xl z-50">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/70 mb-1">
                  Select Operating Role
                </div>
                {(Object.keys(ROLE_CONFIGS) as UserRole[]).map((rKey) => {
                  const cfg = ROLE_CONFIGS[rKey];
                  const active = currentRole === rKey;
                  return (
                    <button
                      key={rKey}
                      type="button"
                      onClick={() => {
                        playClickSound(860);
                        setCurrentRole(rKey);
                        setIsDesktopRoleOpen(false);
                      }}
                      className={`w-full p-2 rounded-xl flex items-center justify-between text-xs font-semibold cursor-pointer ${
                        active
                          ? 'bg-emerald-600 text-white'
                          : 'hover:bg-slate-500/10'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img
                          src={cfg.avatarUrl}
                          alt={cfg.name}
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                        />
                        <span className="truncate">{cfg.shortLabel}</span>
                      </div>
                      {active && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Direct Full Project ZIP Download */}
            <a
              href="./MRM-Care-Full-Production-Bundle.zip"
              download="MRM-Care-Full-Production-Bundle.zip"
              onClick={() => playClickSound(880)}
              title="Download Full Project: React App + Android Studio Kotlin + All 48 Screenshots (54.8 MB)"
              className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-emerald-700/25 whitespace-nowrap shrink-0 cursor-pointer transition-all"
            >
              <Download className="w-4 h-4 text-emerald-200" />
              <span>Full Project .ZIP</span>
            </a>

            <button
              type="button"
              onClick={() => {
                playClickSound(860);
                setIsScreenshotsModalOpen(true);
              }}
              aria-label="iPhone 17 Pro Max .ZIP"
              className="min-h-[38px] px-2.5 py-1.5 rounded-xl u-btn-secondary text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>Screenshots .ZIP</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound(860);
                setIsAndroidModalOpen(true);
              }}
              aria-label="Pure Android Studio Project"
              className="min-h-[38px] px-2.5 py-1.5 rounded-xl u-btn-secondary text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Android .ZIP</span>
            </button>

            {/* Pure Real MVP Direct Switcher */}
            <button
              type="button"
              onClick={() => {
                playClickSound(890);
                setIsPureAndroidMode(true);
              }}
              title="Launch Pure Real MVP Mobile App (Full Screen Native Experience)"
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-800 dark:text-amber-200 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-all"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Pure Real MVP</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound(880);
                setActiveUtilityTab(null);
                setActiveScreen('checkout');
              }}
              className="min-h-[38px] px-3 py-1.5 rounded-xl u-btn-primary text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Direct Zakat</span>
            </button>
          </div>
        </header>
      )}

      {/* ========================================================================= */}
      {/* MAIN WORKSPACE CANVAS: 3-Column Studio or Pure Android App Mode           */}
      {/* ========================================================================= */}
      <main
        className={`flex-1 w-full mx-auto flex items-center justify-center overflow-hidden ${
          isPureAndroidMode
            ? 'max-w-[440px] p-0'
            : 'max-w-[1440px] lg:gap-7 lg:px-8 lg:py-4'
        }`}
      >
        {/* LEFT COLUMN (Desktop lg+): Sidebar Controls (Theme, Bezel Finish, Role & 20-Screen Directory) */}
        {!isPureAndroidMode && (
          <aside
            aria-label="Sidebar Settings, Role Persona and Screen Architecture"
            className="hidden lg:flex flex-col w-[300px] h-full max-h-[820px] gap-3.5 shrink-0"
          >
            {/* Appearance, Bezel Finish & Role Persona Switcher Card */}
            <div className="u-card p-3.5 shrink-0 space-y-2.5">
              {/* Theme Switcher inside Sidebar */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/70">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider">
                    Appearance Theme
                  </h2>
                  <span className="text-[11px] text-slate-500">
                    Daylight default / Night
                  </span>
                </div>
                <div className="inline-flex p-1 rounded-xl u-subtle border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => {
                      if (theme !== 'light') {
                        playClickSound(820);
                        toggleTheme();
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                      theme === 'light'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-500'
                    }`}
                  >
                    <Sun className="w-3 h-3" />
                    <span>Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (theme !== 'dark') {
                        playClickSound(760);
                        toggleTheme();
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                      theme === 'dark'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-500'
                    }`}
                  >
                    <Moon className="w-3 h-3" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>

              {/* bezel.fit iPhone 17 Pro Max White Finish (Locked) */}
              <div className="pb-2.5 border-b border-slate-200/70">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>iPhone 17 Pro Max (bezel.fit)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsScreenshotsModalOpen(true)}
                    className="text-[10px] font-mono font-bold text-emerald-600 hover:underline cursor-pointer"
                  >
                    48-Screen .ZIP
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setIsScreenshotsModalOpen(true)}
                  className="w-full px-3 py-1.5 rounded-xl border bg-emerald-500/10 border-emerald-500/40 text-emerald-700 text-[11px] font-bold flex items-center justify-between gap-2 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full border border-slate-400 shrink-0"
                      style={{ backgroundColor: '#F8FAFC' }}
                    />
                    <span className="truncate">White Only (1472×3002)</span>
                  </div>
                  <span className="text-[10px] font-mono">48 PNGs</span>
                </button>
              </div>

              {/* Role Persona Grid */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Operating Role Persona</span>
                  </h2>
                  <span className="text-[10px] font-mono text-slate-500">6 ROLES</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {(Object.keys(ROLE_CONFIGS) as UserRole[]).map((roleKey) => {
                    const cfg = ROLE_CONFIGS[roleKey];
                    const isSelected = currentRole === roleKey;
                    return (
                      <button
                        key={roleKey}
                        type="button"
                        onClick={() => {
                          playClickSound(850);
                          setCurrentRole(roleKey);
                        }}
                        className={`px-2.5 py-1.5 rounded-xl text-left transition-all cursor-pointer border ${
                          isSelected
                            ? 'u-btn-primary border-transparent shadow-xs'
                            : 'u-surface hover:border-emerald-500/50 border'
                        }`}
                      >
                        <div className="text-xs font-bold truncate">{cfg.shortLabel}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 20-Screen Architecture Directory inside Sidebar */}
            <div className="u-card p-3.5 flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex items-center justify-between mb-2 shrink-0">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider">
                    20-Screen Mobile System
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Active: #{currentMeta.number} {currentMeta.title}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600">
                  {currentMeta.number}/20
                </span>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 space-y-1">
                {ALL_SCREENS_META.map((scr) => {
                  const isCurrent = scr.id === activeScreen;
                  return (
                    <button
                      key={scr.id}
                      type="button"
                      onClick={() => {
                        playClickSound(780);
                        setActiveUtilityTab(null);
                        setActiveScreen(scr.id);
                      }}
                      className={`w-full px-3 py-1.5 rounded-xl text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-emerald-500/10 text-emerald-700 font-semibold border border-emerald-500/30'
                          : 'hover:bg-slate-500/5 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-[11px] font-mono text-slate-400 w-5 shrink-0">
                          {String(scr.number).padStart(2, '0')}
                        </span>
                        <span className="text-xs truncate">{scr.title}</span>
                      </div>
                      {isCurrent && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        )}

        {/* ===================================================================== */}
        {/* CENTER COLUMN: Original iPhone 17 Pro Max Frame from https://bezel.fit */}
        {/* Exact bezel.fit specs: Frame 1472×3002, Screen offset x:76, y:67,      */}
        {/* Screen size 1320×2868 (3x Retina of 440×956)                          */}
        {/* ===================================================================== */}
        <section
          aria-label="Interactive Mobile Application Viewport in Original iPhone 17 Pro Max Frame"
          className="h-full w-full flex items-center justify-center lg:w-auto shrink-0"
        >
          {isPureAndroidMode ? (
            <div className="w-full h-full flex flex-col relative overflow-hidden shadow-2xl border-x border-slate-200/70">
              <AppScreenContainer
                activeScreen={activeScreen}
                onScreenChange={setActiveScreen}
                currentRole={currentRole}
                onRoleChange={setCurrentRole}
                theme={theme}
                onToggleTheme={toggleTheme}
                playClickSound={playClickSound}
                activeUtilityTab={activeUtilityTab}
                onUtilityTabChange={setActiveUtilityTab}
                selectedZone={selectedZone}
                onSelectZone={setSelectedZone}
                onSyncGpsLocation={handleSyncGpsLocation}
                isSyncingGps={isSyncingGps}
              />
            </div>
          ) : (
            <div className="w-full h-full lg:w-[402px] lg:h-[820px] relative flex items-center justify-center shrink-0">
              {/* Inner Screen Viewport aligned to bezel.fit iPhone 17 Pro Max (x:76/1472, y:67/3002, w:1320/1472, h:2868/3002) */}
              <div className="w-full h-full lg:absolute lg:left-[5.163%] lg:top-[2.232%] lg:w-[89.674%] lg:h-[95.536%] lg:rounded-[44px] overflow-hidden z-10 shadow-2xl">
                <div className="w-full h-full lg:w-[440px] lg:h-[956px] lg:origin-top-left lg:scale-[0.8194] flex flex-col">
                  <AppScreenContainer
                    activeScreen={activeScreen}
                    onScreenChange={setActiveScreen}
                    currentRole={currentRole}
                    onRoleChange={setCurrentRole}
                    theme={theme}
                    onToggleTheme={toggleTheme}
                    playClickSound={playClickSound}
                    activeUtilityTab={activeUtilityTab}
                    onUtilityTabChange={setActiveUtilityTab}
                    selectedZone={selectedZone}
                    onSelectZone={setSelectedZone}
                    onSyncGpsLocation={handleSyncGpsLocation}
                    isSyncingGps={isSyncingGps}
                  />
                </div>
              </div>

              {/* Original iPhone 17 Pro Max Bezel Overlay from https://bezel.fit */}
              <img
                src={activeBezelMeta.file}
                alt={`Original iPhone 17 Pro Max (${activeBezelMeta.label}) Frame from bezel.fit`}
                className="hidden lg:block pointer-events-none absolute inset-0 w-full h-full z-40 select-none drop-shadow-2xl"
              />
            </div>
          )}
        </section>

        {/* RIGHT COLUMN (Desktop xl+): Live Location-Synced JAKIM Prayer Schedule, Waqt Almanac & MRM Islamic Suite */}
        {!isPureAndroidMode && (
          <aside
            aria-label="JAKIM Prayer Schedule and MRM Islamic Utilities"
            className="hidden xl:flex flex-col w-[340px] h-full max-h-[820px] gap-3.5 shrink-0"
          >
            {/* Live Location-Synced JAKIM Prayer & Sehri/Iftar Waqt Card */}
            <div className="u-card p-4 shrink-0">
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="min-w-0 flex-1">
                  <div className="relative inline-flex items-center gap-1 min-w-0 max-w-[165px] px-2 py-0.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-700 transition-colors">
                    <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="font-bold text-[11px] truncate">
                      {locationSnap.cityLabel} · {locationSnap.zoneCode}
                    </span>
                    <ChevronDown className="w-3 h-3 text-emerald-600 shrink-0" />
                    <select
                      aria-label="Desktop Location Zone Switcher"
                      value={locationSnap.fullZoneLabel}
                      onChange={(e) => {
                        playClickSound(820);
                        setSelectedZone(e.target.value);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    >
                      {MRM_LOCATION_ZONES.map((z) => (
                        <option key={z.code} value={z.fullLabel} className="text-slate-900">
                          {z.city} · {z.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <h2 className="text-sm font-bold mt-1 whitespace-nowrap truncate">
                    JAKIM Waqt &amp; Sehri/Iftar
                  </h2>
                </div>
                <div className="text-right shrink-0 whitespace-nowrap">
                  <span className="text-xs font-mono font-bold text-emerald-600 block">
                    {prayerInfo.nextPrayer.name} in {prayerInfo.countdownLabel}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono flex items-center justify-end gap-1 mt-1">
                    <Compass className="w-3 h-3 text-amber-500 shrink-0" /> Qibla{' '}
                    {locationSnap.qibla.bearingDegrees}° {locationSnap.qibla.cardinalDirection}
                  </span>
                </div>
              </div>

              {/*Sehri & Iftar + GPS Sync Status Bar */}
              <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                <button
                  type="button"
                  onClick={() => setActiveUtilityTab('waqt')}
                  className="p-2 rounded-xl u-subtle text-left cursor-pointer hover:border-emerald-500/40 border border-transparent transition-all"
                >
                  <div className="text-[9px] font-bold uppercase text-slate-400">
                    Sehri Ends
                  </div>
                  <div className="text-xs font-mono font-extrabold text-emerald-600">
                    {waqtAlmanac.sehriEnds24}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveUtilityTab('waqt')}
                  className="p-2 rounded-xl u-subtle text-left cursor-pointer hover:border-emerald-500/40 border border-transparent transition-all"
                >
                  <div className="text-[9px] font-bold uppercase text-slate-400">
                    Iftar Starts
                  </div>
                  <div className="text-xs font-mono font-extrabold text-amber-600">
                    {waqtAlmanac.iftarMaghrib24}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={handleSyncGpsLocation}
                  className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-left cursor-pointer transition-all"
                >
                  <div className="text-[9px] font-bold uppercase text-emerald-700 flex items-center gap-1">
                    <RefreshCw className={`w-2.5 h-2.5 ${isSyncingGps ? 'animate-spin' : ''}`} />
                    <span>Location</span>
                  </div>
                  <div className="text-[11px] font-extrabold text-emerald-700 truncate">
                    {locationSnap.zoneCode} Synced
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {locationSnap.prayers.map((prayer) => {
                  const isNext = prayer.id === prayerInfo.nextPrayer.id;
                  return (
                    <button
                      key={prayer.id}
                      type="button"
                      onClick={() => setActiveUtilityTab('waqt')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        isNext
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 font-bold'
                          : 'u-subtle border-transparent hover:border-emerald-500/30'
                      }`}
                    >
                      <div className="text-[10px] font-medium opacity-80">
                        {prayer.name}
                      </div>
                      <div className="text-xs font-mono font-bold mt-0.5">
                        {prayer.time24}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MRM 9-Module Islamic Utilities Launcher & Welfare Summary */}
            <div className="u-card p-4 flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto pr-0.5">
                <div className="flex items-center justify-between mb-2.5">
                  <div>
                    <h2 className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>MRM Islamic Utilities Suite</span>
                    </h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Synced to {locationSnap.cityLabel} ({locationSnap.zoneCode})
                    </p>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>

                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  {[
                    {
                      id: 'waqt' as UtilityTabId,
                      title: 'Waqt & Forbidden',
                      sub: `Sehri ${waqtAlmanac.sehriEnds24} · Iftar ${waqtAlmanac.iftarMaghrib24}`,
                      icon: Clock,
                    },
                    {
                      id: 'quran' as UtilityTabId,
                      title: 'Tajweed Quran',
                      sub: 'Color Rules & Audio',
                      icon: BookOpen,
                    },
                    {
                      id: 'qibla' as UtilityTabId,
                      title: `Qibla ${locationSnap.qibla.bearingDegrees}° ${locationSnap.qibla.cardinalDirection}`,
                      sub: `${locationSnap.qibla.distanceKm.toLocaleString()} km to Makkah`,
                      icon: Compass,
                    },
                    {
                      id: 'tasbih' as UtilityTabId,
                      title: 'Digital Tasbih',
                      sub: '33 / 99 / 100 Counter',
                      icon: Hash,
                    },
                    {
                      id: 'dua' as UtilityTabId,
                      title: 'Hisnul Muslim',
                      sub: 'Sehri · Iftar · Ruqyah',
                      icon: Sparkles,
                    },
                    {
                      id: 'salah_guide' as UtilityTabId,
                      title: 'Revert Solat Guide',
                      sub: 'Wudhu & Rakaat Steps',
                      icon: HeartHandshake,
                    },
                    {
                      id: 'halal' as UtilityTabId,
                      title: 'Halal & Fitrah',
                      sub: 'E-Codes & Fidyah Calc',
                      icon: Calculator,
                    },
                    {
                      id: 'sifat' as UtilityTabId,
                      title: 'Asma-ul-Husna',
                      sub: '99 Names & Audio',
                      icon: Sun,
                    },
                  ].map((u) => {
                    const Icon = u.icon;
                    const active = activeUtilityTab === u.id;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => {
                          playClickSound(850);
                          setActiveUtilityTab(active ? null : u.id);
                        }}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2 ${
                          active
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'u-subtle border-transparent hover:border-emerald-500/40'
                        }`}
                      >
                        <Icon
                          className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            active ? 'text-white' : 'text-emerald-600'
                          }`}
                        />
                        <div className="min-w-0">
                          <div className="text-[11px] font-extrabold truncate">
                            {u.title}
                          </div>
                          <div
                            className={`text-[9px] truncate ${
                              active ? 'text-emerald-100' : 'text-slate-500'
                            }`}
                          >
                            {u.sub}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 pt-2.5 border-t border-slate-200/70 shrink-0">
                <a
                  href="./MRM-Care-Full-Production-Bundle.zip"
                  download="MRM-Care-Full-Production-Bundle.zip"
                  title="Full Project: React App + Android Studio Kotlin + All 48 Screenshots"
                  className="w-full min-h-[40px] px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
                >
                  <Download className="w-4 h-4 text-emerald-200" />
                  <span>Download Full Project (.ZIP)</span>
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="./MRM-Care-iPhone-17-Pro-Max-White-48Screens.zip"
                    download="MRM-Care-iPhone-17-Pro-Max-White-48Screens.zip"
                    className="min-h-[36px] px-2 py-1.5 rounded-xl u-btn-secondary text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer truncate"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">48 Screens .ZIP</span>
                  </a>

                  <a
                    href="./MRM_Care_Android_Studio_Project.zip"
                    download="MRM_Care_Android_Studio_Project.zip"
                    className="min-h-[36px] px-2 py-1.5 rounded-xl u-btn-secondary text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer truncate"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">Android .ZIP</span>
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound(800);
                      setIsScreenshotsModalOpen(true);
                    }}
                    className="min-h-[34px] px-2 py-1 rounded-xl u-subtle hover:border-emerald-500/40 border border-slate-200/70 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ImageIcon className="w-3 h-3 text-emerald-600" />
                    <span>View 48 Gallery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound(800);
                      setActiveUtilityTab(null);
                      setActiveScreen('settings');
                    }}
                    className="min-h-[34px] px-2 py-1 rounded-xl u-subtle hover:border-emerald-500/40 border border-slate-200/70 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Theme &amp; Zone</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        )}
      </main>

      {/* Floating Control when in Pure Android / Pure Real MVP App Mode */}
      {isPureAndroidMode && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
          <a
            href="./MRM-Care-Full-Production-Bundle.zip"
            download="MRM-Care-Full-Production-Bundle.zip"
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg cursor-pointer"
            title="Download Full Project Bundle"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Full .ZIP</span>
          </a>
          <a
            href="./MRM_Care_Android_Studio_Project.zip"
            download="MRM_Care_Android_Studio_Project.zip"
            className="px-3.5 py-2 rounded-xl u-btn-primary text-xs font-bold flex items-center gap-1.5 shadow-lg cursor-pointer"
            title="Download Pure Android Studio Project"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Android .ZIP</span>
          </a>
          <button
            type="button"
            onClick={() => setIsPureAndroidMode(false)}
            className="px-3.5 py-2 rounded-xl u-surface border shadow-lg text-xs font-bold cursor-pointer hover:bg-slate-500/10 transition-colors"
          >
            Exit Pure MVP
          </button>
        </div>
      )}

      {/* Android Studio Bundle & Pure Android App Modal */}
      <AndroidStudioBundleModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
        isPureAndroidMode={isPureAndroidMode}
        onTogglePureAndroidMode={() => setIsPureAndroidMode((prev) => !prev)}
      />

      {/* Original iPhone 17 Pro Max White (bezel.fit) 48-Screen Screenshots Pack Modal */}
      <ScreenshotsPackModal
        isOpen={isScreenshotsModalOpen}
        onClose={() => setIsScreenshotsModalOpen(false)}
        bezelFinish={bezelFinish}
        onChangeFinish={setBezelFinish}
        onSelectScreen={(scr) => {
          setActiveUtilityTab(null);
          setActiveScreen(scr);
        }}
        onSelectRole={setCurrentRole}
        onSelectUtility={setActiveUtilityTab}
      />
    </div>
  );
}
