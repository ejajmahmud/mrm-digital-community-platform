import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Signal, 
  Battery, 
  BatteryCharging,
  Search, 
  Mic, 
  Camera, 
  Chrome, 
  Settings as SettingsIcon, 
  FolderDown, 
  Play, 
  Clock, 
  Calendar, 
  CloudSun, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  X, 
  RotateCcw, 
  ChevronLeft, 
  Circle, 
  Square, 
  ChevronDown, 
  ChevronUp, 
  Bluetooth, 
  Moon, 
  Flashlight, 
  Plane, 
  Volume2, 
  Info, 
  ShieldCheck, 
  Smartphone,
  ExternalLink,
  Sliders,
  Bell,
  Trash2,
  HardDrive
} from 'lucide-react';

export type AndroidAppId = 'launcher' | 'mrm_app' | 'settings' | 'files' | 'recents';

interface AndroidOSProps {
  deviceModel: 'iphone16' | 'pixel9' | 'galaxy24';
  isCharging: boolean;
  batteryLevel: number;
  volumeLevel: number;
  currentTime: string;
  currentDate: string;
  onOpenApp?: (appId: AndroidAppId) => void;
  // When MRM Community app is running, render its contents here
  children: React.ReactNode;
  // External control triggers
  forcedApp?: AndroidAppId | null;
  onAppChange?: (appId: AndroidAppId) => void;
}

export const AndroidOS: React.FC<AndroidOSProps> = ({
  deviceModel,
  isCharging,
  batteryLevel,
  volumeLevel,
  currentTime,
  currentDate,
  children,
  forcedApp,
  onAppChange
}) => {
  const [currentApp, setCurrentApp] = useState<AndroidAppId>('mrm_app');
  const [isApkInstalled, setIsApkInstalled] = useState<boolean>(true);
  const [installModalOpen, setInstallModalOpen] = useState<boolean>(false);
  const [installStep, setInstallStep] = useState<'idle' | 'staging' | 'installing' | 'finished'>('idle');
  const [installProgress, setInstallProgress] = useState<number>(0);
  
  // Navigation & UI state
  const [navStyle, setNavStyle] = useState<'buttons' | 'gestures'>('buttons');
  const [isShadeOpen, setIsShadeOpen] = useState<boolean>(false);
  const [quickSettings, setQuickSettings] = useState({
    internet: true,
    bluetooth: true,
    flashlight: false,
    dnd: false,
    autoRotate: true,
    darkMode: true
  });

  // Recent apps stack
  const [recentApps, setRecentApps] = useState<Array<{ id: AndroidAppId; title: string; subtitle: string; icon: string }>>([
    { id: 'mrm_app', title: 'MRM Community', subtitle: 'Faith & Care Platform', icon: 'mrm' },
    { id: 'settings', title: 'Settings', subtitle: 'System & About Phone', icon: 'settings' },
    { id: 'files', title: 'Files / APKs', subtitle: 'mrm-community.apk', icon: 'files' },
  ]);

  useEffect(() => {
    if (forcedApp) {
      setCurrentApp(forcedApp);
    }
  }, [forcedApp]);

  const switchApp = (app: AndroidAppId) => {
    setCurrentApp(app);
    if (onAppChange) onAppChange(app);
    setIsShadeOpen(false);
  };

  const handleStartApkInstall = () => {
    setInstallModalOpen(true);
    setInstallStep('staging');
    setInstallProgress(15);

    setTimeout(() => {
      setInstallStep('installing');
      setInstallProgress(45);
    }, 900);

    setTimeout(() => {
      setInstallProgress(85);
    }, 1800);

    setTimeout(() => {
      setInstallStep('finished');
      setInstallProgress(100);
      setIsApkInstalled(true);
    }, 2600);
  };

  const handleUninstallApk = () => {
    setIsApkInstalled(false);
    if (currentApp === 'mrm_app') {
      setCurrentApp('launcher');
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full h-full bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      
      {/* 1. ANDROID 15 MATERIAL YOU STATUS BAR */}
      <div 
        onClick={() => setIsShadeOpen(!isShadeOpen)}
        className="w-full pt-2.5 px-4 pb-1.5 flex items-center justify-between text-xs font-medium z-40 bg-slate-950/80 backdrop-blur-md cursor-pointer hover:bg-slate-900/60 transition-colors"
        title="Tap to pull down Android Notification & Quick Settings Shade"
      >
        {/* Left: Current Time & Notification Icons */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[13px] text-slate-200 tracking-tight font-mono">
            {currentTime}
          </span>

          {/* Android Notification Icons */}
          <div className="flex items-center gap-1.5 text-slate-400">
            {isApkInstalled && (
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-600/90 text-[8px] font-bold text-white flex items-center justify-center ring-1 ring-emerald-400/40" title="MRM Community active">
                M
              </span>
            )}
            <span title="System up to date"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /></span>
            <Bell className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        {/* Center: Device Camera Punch-hole (Pixel / Galaxy style) */}
        <div className="w-3.5 h-3.5 bg-black rounded-full border border-slate-800 shadow-inner -translate-y-0.5" />

        {/* Right: Network, Wi-Fi, Battery */}
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="text-[10px] font-bold tracking-tight text-emerald-400">5G</span>
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <div className="flex items-center gap-1 font-mono text-[11px] ml-0.5">
            {isCharging ? (
              <BatteryCharging className="w-4 h-4 text-emerald-400" />
            ) : (
              <Battery className="w-4 h-4 text-slate-200" />
            )}
            <span>{batteryLevel}%</span>
          </div>
        </div>
      </div>

      {/* 2. ANDROID NOTIFICATION & QUICK SETTINGS SHADE (Slide-down) */}
      {isShadeOpen && (
        <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col p-4 animate-fade-in text-slate-100">
          {/* Shade Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-2xl font-light font-mono">{currentTime}</span>
              <p className="text-xs text-slate-400">{currentDate}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { switchApp('settings'); setIsShadeOpen(false); }}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Android Settings"
              >
                <SettingsIcon className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsShadeOpen(false)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Close Shade"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Settings Grid (Android 15 Pill Style) */}
          <div className="grid grid-cols-2 gap-2.5 my-4">
            <button
              onClick={() => setQuickSettings(p => ({ ...p, internet: !p.internet }))}
              className={`p-3 rounded-2xl flex items-center gap-3 transition-colors cursor-pointer ${
                quickSettings.internet ? 'bg-emerald-700 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400'
              }`}
            >
              <Wifi className="w-5 h-5 shrink-0" />
              <div className="text-left leading-tight">
                <p className="text-xs font-semibold">Internet</p>
                <p className="text-[10px] opacity-80">{quickSettings.internet ? 'MRM-Fiber-5G' : 'Off'}</p>
              </div>
            </button>

            <button
              onClick={() => setQuickSettings(p => ({ ...p, bluetooth: !p.bluetooth }))}
              className={`p-3 rounded-2xl flex items-center gap-3 transition-colors cursor-pointer ${
                quickSettings.bluetooth ? 'bg-emerald-700 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400'
              }`}
            >
              <Bluetooth className="w-5 h-5 shrink-0" />
              <div className="text-left leading-tight">
                <p className="text-xs font-semibold">Bluetooth</p>
                <p className="text-[10px] opacity-80">{quickSettings.bluetooth ? 'Connected' : 'Off'}</p>
              </div>
            </button>

            <button
              onClick={() => setQuickSettings(p => ({ ...p, flashlight: !p.flashlight }))}
              className={`p-3 rounded-2xl flex items-center gap-3 transition-colors cursor-pointer ${
                quickSettings.flashlight ? 'bg-emerald-700 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400'
              }`}
            >
              <Flashlight className="w-5 h-5 shrink-0" />
              <div className="text-left leading-tight">
                <p className="text-xs font-semibold">Flashlight</p>
                <p className="text-[10px] opacity-80">{quickSettings.flashlight ? 'On' : 'Off'}</p>
              </div>
            </button>

            <button
              onClick={() => setQuickSettings(p => ({ ...p, dnd: !p.dnd }))}
              className={`p-3 rounded-2xl flex items-center gap-3 transition-colors cursor-pointer ${
                quickSettings.dnd ? 'bg-emerald-700 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400'
              }`}
            >
              <Moon className="w-5 h-5 shrink-0" />
              <div className="text-left leading-tight">
                <p className="text-xs font-semibold">Do Not Disturb</p>
                <p className="text-[10px] opacity-80">{quickSettings.dnd ? 'Prayer Mode' : 'Off'}</p>
              </div>
            </button>
          </div>

          {/* Notifications Section */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-semibold uppercase tracking-wider">
              <span>Notifications</span>
              <button 
                onClick={() => {}}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Clear all
              </button>
            </div>

            {/* Notification 1: MRM Community */}
            <div 
              onClick={() => { switchApp('mrm_app'); setIsShadeOpen(false); }}
              className="p-3 bg-slate-900 border border-emerald-900/40 rounded-2xl cursor-pointer hover:bg-slate-850 transition-colors"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> MRM Community
                </span>
                <span className="text-[10px] text-slate-500">42m ago</span>
              </div>
              <p className="text-xs font-bold text-slate-200">Daily Prayer Reminder: Fajr 05:40 AM</p>
              <p className="text-[11px] text-slate-400">JAKIM Malaysia Zone • In-app prayer compass and Azan enabled</p>
            </div>

            {/* Notification 2: Package Installer */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-teal-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Android Package Installer
                </span>
                <span className="text-[10px] text-slate-500">System</span>
              </div>
              <p className="text-xs font-bold text-slate-200">
                {isApkInstalled ? 'org.mrm.community (2.4.0) installed' : 'mrm_community.apk ready to install'}
              </p>
              <p className="text-[11px] text-slate-400">Verified by Google Play Protect • Android 15 Ready</p>
            </div>
          </div>

          {/* Close Shade button */}
          <div className="pt-2 text-center">
            <button
              onClick={() => setIsShadeOpen(false)}
              className="w-24 h-1 bg-slate-700 rounded-full mx-auto cursor-pointer hover:bg-slate-500 transition-colors"
            />
          </div>
        </div>
      )}

      {/* 3. MAIN ANDROID DISPLAY VIEWPORT */}
      <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-900">
        
        {/* CASE A: ANDROID HOME SCREEN (Launcher) */}
        {currentApp === 'launcher' && (
          <div className="flex-1 flex flex-col justify-between p-5 bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
            
            {/* Top At a Glance Widget */}
            <div className="space-y-1 pt-4">
              <p className="text-xs text-emerald-300 font-semibold tracking-wide flex items-center gap-1.5">
                <CloudSun className="w-4 h-4 text-amber-300" />
                <span>Kuala Lumpur • 29°C</span>
              </p>
              <h1 className="text-4xl font-light tracking-tight font-mono text-slate-100">
                {currentTime}
              </h1>
              <p className="text-sm text-slate-300 font-medium">
                {currentDate}
              </p>

              {/* Islamic Date & Next Prayer Pill */}
              <div 
                onClick={() => { switchApp('mrm_app'); }}
                className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-emerald-900/60 border border-emerald-500/30 rounded-xl text-xs text-emerald-200 cursor-pointer hover:bg-emerald-800/60 transition-colors"
              >
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Next Prayer: <strong>Fajr 05:40 AM</strong></span>
              </div>
            </div>

            {/* Middle Grid: Installed Apps & APK Status */}
            <div className="my-auto py-4">
              <div className="grid grid-cols-4 gap-4 text-center">
                
                {/* App 1: MRM Community (The App!) */}
                {isApkInstalled ? (
                  <button
                    onClick={() => switchApp('mrm_app')}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-700 via-teal-600 to-emerald-500 p-2.5 shadow-lg shadow-emerald-950/60 ring-2 ring-emerald-400/40 group-hover:scale-105 transition-transform flex items-center justify-center relative">
                      <div className="w-full h-full rounded-xl bg-emerald-950/40 flex items-center justify-center text-white font-extrabold text-lg">
                        M
                      </div>
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-slate-900" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-200 tracking-tight line-clamp-1">
                      MRM App
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={handleStartApkInstall}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 border-2 border-dashed border-emerald-500 p-2.5 group-hover:scale-105 transition-transform flex flex-col items-center justify-center text-emerald-400">
                      <Download className="w-5 h-5 animate-pulse" />
                      <span className="text-[8px] font-bold uppercase mt-0.5">Install</span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-400 tracking-tight line-clamp-1">
                      Install APK
                    </span>
                  </button>
                )}

                {/* App 2: Android Settings */}
                <button
                  onClick={() => switchApp('settings')}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 p-2.5 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center text-slate-300">
                    <SettingsIcon className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300 tracking-tight">
                    Settings
                  </span>
                </button>

                {/* App 3: Package Files & APKs */}
                <button
                  onClick={() => switchApp('files')}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-amber-600/20 border border-amber-500/40 p-2.5 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center text-amber-400">
                    <FolderDown className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300 tracking-tight">
                    Files / APK
                  </span>
                </button>

                {/* App 4: Google Chrome */}
                <div className="flex flex-col items-center gap-1.5 opacity-80">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 p-2.5 shadow-md flex items-center justify-center text-blue-400">
                    <Chrome className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300 tracking-tight">
                    Chrome
                  </span>
                </div>
              </div>

              {/* Android Banner: App Install Status Card */}
              {!isApkInstalled && (
                <div className="mt-6 p-4 bg-emerald-950/70 border border-emerald-500/50 rounded-2xl flex items-center justify-between shadow-xl">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-emerald-400" /> mrm-community.apk
                    </p>
                    <p className="text-[11px] text-emerald-300">Package ready to install on Android OS</p>
                  </div>
                  <button
                    onClick={handleStartApkInstall}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
                  >
                    Install Now
                  </button>
                </div>
              )}
            </div>

            {/* Bottom: Google Search Bar Widget & Dock */}
            <div className="space-y-4 pb-2">
              {/* Google Search Bar Pill */}
              <div className="w-full bg-slate-900/90 border border-slate-700/80 rounded-full px-4 py-2.5 flex items-center justify-between text-xs text-slate-400 shadow-md">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-extrabold text-sm">G</span>
                  <span>Search apps, web, prayer...</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-400">
                  <Mic className="w-4 h-4 hover:text-white cursor-pointer" />
                  <Camera className="w-4 h-4 hover:text-white cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CASE B: RUNNING MRM COMMUNITY APPLICATION */}
        {currentApp === 'mrm_app' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
            {!isApkInstalled ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-800 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Download className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">App Not Installed on Android OS</h3>
                  <p className="text-xs text-slate-600 max-w-xs">
                    Please install <strong>MRM Community</strong> APK onto the Android OS system first.
                  </p>
                </div>
                <button
                  onClick={handleStartApkInstall}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  Install MRM Community APK
                </button>
              </div>
            ) : (
              children
            )}
          </div>
        )}

        {/* CASE C: ANDROID SETTINGS (About Phone, Version 15) */}
        {currentApp === 'settings' && (
          <div className="flex-1 overflow-y-auto p-4 bg-slate-950 text-slate-100 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-emerald-400" /> Android Settings
              </h2>
              <button 
                onClick={() => switchApp('launcher')}
                className="text-xs text-emerald-400 hover:underline cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Device Info Card */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Google Pixel 9 Pro</h3>
                  <p className="text-[11px] text-slate-400">Android 15 (Vanilla Ice Cream)</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-500/40 text-emerald-300 rounded-full text-[10px] font-bold">
                  Running OS
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-500">Android Version:</span>
                  <p className="font-mono font-semibold text-slate-200">15.0.0 (API 35)</p>
                </div>
                <div>
                  <span className="text-slate-500">Build Number:</span>
                  <p className="font-mono font-semibold text-slate-200">AP3A.241005.015</p>
                </div>
                <div>
                  <span className="text-slate-500">Security Patch:</span>
                  <p className="font-mono font-semibold text-slate-200">October 5, 2026</p>
                </div>
                <div>
                  <span className="text-slate-500">Kernel:</span>
                  <p className="font-mono font-semibold text-slate-200">Linux 6.1.75-android15</p>
                </div>
              </div>
            </div>

            {/* Installed Apps Management */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center justify-between">
                <span>Installed Applications</span>
                <span className="text-slate-400 font-normal">Package Manager</span>
              </h4>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white font-extrabold flex items-center justify-center text-sm">
                    M
                  </div>
                  <div>
                    <p className="font-bold text-slate-200">MRM Community</p>
                    <p className="text-[10px] text-slate-500 font-mono">org.mrm.community • 28.4 MB</p>
                  </div>
                </div>

                {isApkInstalled ? (
                  <button
                    onClick={handleUninstallApk}
                    className="px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Uninstall
                  </button>
                ) : (
                  <button
                    onClick={handleStartApkInstall}
                    className="px-2.5 py-1 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Install
                  </button>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => switchApp('mrm_app')}
                className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors cursor-pointer text-center"
              >
                Launch MRM App
              </button>
              <button
                onClick={() => switchApp('launcher')}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition-colors cursor-pointer text-center"
              >
                Go to Home Screen
              </button>
            </div>
          </div>
        )}

        {/* CASE D: FILES / APK MANAGER */}
        {currentApp === 'files' && (
          <div className="flex-1 overflow-y-auto p-4 bg-slate-950 text-slate-100 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FolderDown className="w-5 h-5 text-amber-400" /> Files & Downloaded APKs
              </h2>
              <button 
                onClick={() => switchApp('launcher')}
                className="text-xs text-emerald-400 hover:underline cursor-pointer"
              >
                Home
              </button>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">Downloads Directory</span>
                <span className="text-[10px] text-slate-500 font-mono">/sdcard/Download/</span>
              </div>

              {/* APK File Item */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-900/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-200">mrm_community_v2.4.0.apk</p>
                    <p className="text-[10px] text-slate-400 font-mono">28.4 MB • Package APK</p>
                  </div>
                </div>

                <button
                  onClick={handleStartApkInstall}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  {isApkInstalled ? 'Reinstall' : 'Install APK'}
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-start gap-2.5 text-slate-400 text-[11px]">
              <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p>
                This APK contains the full MRM Digital Community Platform with prayer times calculations, audio Qur'an, verified volunteer assignments, and safe intake forms.
              </p>
            </div>
          </div>
        )}

        {/* CASE E: ANDROID RECENTS / APP OVERVIEW SWITCHER */}
        {currentApp === 'recents' && (
          <div className="flex-1 flex flex-col justify-between p-4 bg-slate-950 text-white animate-fade-in">
            <div className="pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Running Applications</h3>
            </div>

            {/* Recents Carousel */}
            <div className="my-auto flex items-center gap-4 overflow-x-auto py-4 px-2 snap-x snap-mandatory">
              {recentApps.map((app) => (
                <div 
                  key={app.id}
                  onClick={() => switchApp(app.id)}
                  className="min-w-[220px] max-w-[240px] bg-slate-900 border border-slate-700/80 rounded-2xl p-4 shadow-xl cursor-pointer hover:border-emerald-500 transition-all hover:scale-[1.02] snap-center flex flex-col justify-between h-[300px]"
                >
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                    <div className="w-6 h-6 rounded-md bg-emerald-700 flex items-center justify-center text-xs font-bold">
                      {app.title.charAt(0)}
                    </div>
                    <span className="text-xs font-bold truncate">{app.title}</span>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center text-center p-3">
                    <p className="text-xs text-slate-300 font-medium">{app.subtitle}</p>
                    <p className="text-[10px] text-slate-500 mt-1">Tap card to switch to this app</p>
                  </div>

                  <button 
                    onClick={(e) => { e.stopPropagation(); switchApp(app.id); }}
                    className="w-full py-1.5 bg-emerald-800 hover:bg-emerald-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Switch to {app.title}
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center pb-2">
              <button
                onClick={() => switchApp('launcher')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium cursor-pointer transition-colors"
              >
                Clear all apps
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. ANDROID 15 PACKAGE INSTALLER MODAL (Authentic Android Flow) */}
      {installModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in text-slate-900">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4 border border-slate-200">
            {/* Package Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-500 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                M
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900">MRM Digital Community</h3>
                <p className="text-[11px] text-slate-500 font-mono">org.mrm.community • v2.4.0</p>
              </div>
            </div>

            {/* Dialog Body */}
            {installStep === 'staging' && (
              <div className="space-y-2 py-2">
                <p className="text-xs text-slate-600">Staging package and verifying integrity with Google Play Protect...</p>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full transition-all duration-300" style={{ width: `${installProgress}%` }} />
                </div>
              </div>
            )}

            {installStep === 'installing' && (
              <div className="space-y-2 py-2">
                <p className="text-xs text-slate-600 font-medium">Installing application on Android 15...</p>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full transition-all duration-300" style={{ width: `${installProgress}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 font-mono text-right">{installProgress}%</p>
              </div>
            )}

            {installStep === 'finished' && (
              <div className="space-y-2 py-1 text-emerald-900">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>App installed successfully.</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  MRM Digital Community has been added to your Android Home Screen and is ready to run.
                </p>
              </div>
            )}

            {/* Dialog Footer Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              {installStep !== 'finished' ? (
                <button
                  onClick={() => setInstallModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                >
                  Cancel
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { setInstallModalOpen(false); switchApp('launcher'); }}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => { setInstallModalOpen(false); switchApp('mrm_app'); }}
                    className="px-4 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    Open App
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. ANDROID SYSTEM NAVIGATION BAR (3-Button or Gestures) */}
      <div className="w-full bg-slate-950 py-2 px-6 flex items-center justify-around text-slate-400 border-t border-slate-900 select-none z-30 shrink-0">
        {navStyle === 'buttons' ? (
          <div className="w-full flex items-center justify-around max-w-[280px] mx-auto">
            {/* ◀ Back Button */}
            <button
              onClick={() => {
                if (currentApp !== 'launcher') {
                  switchApp('launcher');
                }
              }}
              className="p-2 hover:text-white transition-colors cursor-pointer"
              title="Android Back Button"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* ● Home Button */}
            <button
              onClick={() => switchApp('launcher')}
              className="p-2 hover:text-white transition-colors cursor-pointer"
              title="Android Home Button"
            >
              <Circle className="w-4 h-4 fill-current stroke-[2.5]" />
            </button>

            {/* ◼ Recents / Overview Button */}
            <button
              onClick={() => switchApp(currentApp === 'recents' ? 'mrm_app' : 'recents')}
              className="p-2 hover:text-white transition-colors cursor-pointer"
              title="Android Recents (Multitasking Overview)"
            >
              <Square className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        ) : (
          /* Gesture Bar */
          <div 
            onClick={() => switchApp('launcher')}
            className="w-32 h-1 bg-slate-400 hover:bg-white rounded-full mx-auto cursor-pointer transition-colors"
            title="Android Gesture Bar (Tap to go Home)"
          />
        )}
      </div>

    </div>
  );
};
