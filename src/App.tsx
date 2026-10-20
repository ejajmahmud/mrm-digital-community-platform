/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppScreenContainer } from './components/screens/AppScreenContainer';
import { UserRole } from './types';
import { ROLE_CONFIGS } from './types/roleConfig';
import { ScreenId, ALL_SCREENS_META } from './types/screens';
import { findNearestLocationZone } from './utils/mrmLogic';
import { UtilityTabId } from './data/islamicUtilitiesData';
import { Download, X } from 'lucide-react';

function getInitialQueryParams(): {
  screen: ScreenId;
  theme: 'light' | 'dark';
  role: UserRole;
  utility: UtilityTabId | null;
} {
  if (typeof window === 'undefined') {
    return {
      screen: 'home',
      theme: 'light',
      role: 'staff_admin',
      utility: null,
    };
  }
  const params = new URLSearchParams(window.location.search);
  const screenParam = params.get('screen') as ScreenId | null;
  const isValidScreen =
    screenParam && ALL_SCREENS_META.some((s) => s.id === screenParam);
  const themeParam = params.get('theme') === 'dark' ? 'dark' : 'light';

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
    role: isValidRole ? roleParam : 'staff_admin',
    utility: isValidUtil ? utilParam : null,
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
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Handle PWA installation prompt
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Expose window helpers for screen navigation
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

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

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
      // AudioContext restricted prior to interaction
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

  return (
    <div
      data-theme={theme}
      className="h-[100dvh] w-full bg-slate-900/95 flex flex-col items-center justify-start antialiased overflow-hidden"
    >
      {/* Pure PWA App Shell - 100% width on mobile, centered max-w-md on desktop */}
      <div className="w-full max-w-md h-full flex flex-col bg-white dark:bg-slate-950 shadow-2xl relative overflow-hidden">
        {/* PWA One-Click Install Banner (if installable on device) */}
        {showInstallBanner && (
          <aside
            aria-label="Install MRM Care app"
            className="w-full bg-emerald-700 text-white px-3.5 py-2 flex items-center justify-between text-xs shadow-md z-50 shrink-0"
          >
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-200" />
              <span>Install MRM Care on your home screen</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleInstallClick}
                className="px-2.5 py-1 bg-white text-emerald-800 font-bold rounded-lg text-[11px] hover:bg-emerald-50 transition-colors"
              >
                Install
              </button>
              <button
                type="button"
                onClick={() => setShowInstallBanner(false)}
                className="p-1 text-emerald-200 hover:text-white"
                aria-label="Dismiss installation prompt"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </aside>
        )}

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
  );
}
