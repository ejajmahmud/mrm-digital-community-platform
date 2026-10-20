import React, { useState } from 'react';
import {
  ScanFace,
  EyeOff,
  Clock,
  Sun,
  Moon,
  Layers,
  ShieldCheck,
  MapPin,
  RefreshCw,
  Compass,
} from 'lucide-react';
import { ScreenId, ALL_SCREENS_META } from '../../types/screens';
import { MRM_LOCATION_ZONES, getLocationSyncSnapshot } from '../../utils/mrmLogic';

interface SettingsScreenProps {
  onNavigate: (screen: ScreenId) => void;
  playClickSound?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onOpenNavigator?: () => void;
  selectedZone?: string;
  onSelectZone?: (zone: string) => void;
  onSyncGpsLocation?: () => void;
  isSyncingGps?: boolean;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  playClickSound,
  theme = 'light',
  onToggleTheme,
  onOpenNavigator,
  selectedZone: externalZone,
  onSelectZone,
  onSyncGpsLocation,
  isSyncingGps = false,
}) => {
  const [internalZone, setInternalZone] = useState('WLY01 - Kuala Lumpur & Putrajaya');
  const selectedZone = externalZone ?? internalZone;

  const [pushEnabled, setPushEnabled] = useState(true);
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const [disguiseMode, setDisguiseMode] = useState(false);
  const [cacheSize, setCacheSize] = useState('24.8 MB');
  const [clearing, setClearing] = useState(false);

  const locationSnap = getLocationSyncSnapshot(selectedZone);
  const zonePrayers = locationSnap.prayers;

  const handleZoneChange = (newZone: string) => {
    playClickSound?.();
    setInternalZone(newZone);
    onSelectZone?.(newZone);
  };

  const handleClearCache = () => {
    playClickSound?.();
    setClearing(true);
    setTimeout(() => {
      setCacheSize('0 KB');
      setClearing(false);
    }, 600);
  };

  return (
    <div className="min-h-full flex flex-col p-4 u-canvas pb-28 select-none space-y-4">
      {/* Group 0: Appearance & Screen Directory */}
      <div>
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">
          Display, Theme &amp; Screen Directory
        </span>
        <div className="p-3.5 u-card space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold block">Application Theme</span>
              <span className="text-[11px] text-slate-500">
                Default Daylight mode or OLED Dark mode
              </span>
            </div>
            <div className="inline-flex p-1 rounded-xl u-subtle border border-slate-200/80">
              <button
                type="button"
                onClick={() => {
                  if (theme !== 'light') {
                    playClickSound?.();
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
                    playClickSound?.();
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
              <span className="text-xs font-bold block">20-Screen Master Directory</span>
              <span className="text-[11px] text-slate-500">
                Inspect all {ALL_SCREENS_META.length} production screens
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                playClickSound?.();
                onOpenNavigator?.();
              }}
              className="min-h-[36px] px-3 py-1.5 rounded-xl u-btn-primary text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Open Directory</span>
            </button>
          </div>
        </div>
      </div>

      {/* Group 1: Location & JAKIM Prayer Sync */}
      <div>
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">
          Location &amp; JAKIM Prayer Sync
        </span>
        <div className="p-3.5 u-card space-y-3">
          <div className="flex items-center justify-between gap-2">
            <label className="text-[11px] font-semibold text-slate-500 block">
              JAKIM Malaysia &amp; Global Zone ({locationSnap.authority}):
            </label>
            <button
              type="button"
              onClick={() => {
                playClickSound?.();
                onSyncGpsLocation?.();
              }}
              className="px-2.5 py-1 rounded-lg u-btn-primary text-[10px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncingGps ? 'animate-spin' : ''}`} />
              <span>{isSyncingGps ? 'Syncing...' : 'Sync GPS'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl u-subtle border border-slate-200/80 text-xs">
            <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
            <select
              aria-label="Select JAKIM Prayer Zone"
              value={locationSnap.fullZoneLabel}
              onChange={(e) => handleZoneChange(e.target.value)}
              className="bg-transparent w-full text-xs font-semibold focus:outline-hidden cursor-pointer"
            >
              {MRM_LOCATION_ZONES.map((z) => (
                <option key={z.code} value={z.fullLabel}>
                  {z.fullLabel}
                </option>
              ))}
            </select>
          </div>

          {/* Synced Coordinates & Qibla Metadata */}
          <div className="p-2.5 rounded-xl u-subtle flex items-center justify-between text-[10px] font-mono text-slate-600">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>
                {locationSnap.lat.toFixed(4)}°N, {locationSnap.lng.toFixed(4)}°E ·{' '}
                {locationSnap.hubName}
              </span>
            </span>
            <span className="flex items-center gap-1 text-emerald-600 font-bold shrink-0">
              <Compass className="w-3 h-3" />
              <span>
                {locationSnap.qibla.bearingDegrees}° ({locationSnap.qibla.distanceKm} km)
              </span>
            </span>
          </div>

          {/* Live Zone Prayer Preview */}
          <div className="grid grid-cols-6 gap-1 pt-1">
            {zonePrayers.map((p) => (
              <div
                key={p.id}
                className="p-1.5 rounded-lg u-subtle text-center border border-slate-200/60"
              >
                <span className="block text-[9px] text-slate-500 font-semibold">{p.name}</span>
                <span className="block text-[10px] font-mono font-bold text-emerald-600 mt-0.5">
                  {p.time24}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/70">
            <div>
              <span className="text-xs font-bold block">Adhan Audio Call to Prayer</span>
              <span className="text-[11px] text-slate-500">
                Play full recitation at each Waqt
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                playClickSound?.();
                setPushEnabled(!pushEnabled);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                pushEnabled ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
              aria-label="Toggle Adhan Audio"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 shadow-xs ${
                  pushEnabled ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Group 2: Revert Protection & Safety */}
      <div>
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">
          Revert Confidentiality &amp; Safeguarding
        </span>
        <div className="p-3.5 u-card space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold flex items-center gap-1.5">
                <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                <span>Panic Disguise Mode (Calculator Cover)</span>
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Instantly masks app as a standard calculator for revert safety
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                playClickSound?.();
                setDisguiseMode(!disguiseMode);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                disguiseMode ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
              aria-label="Toggle Panic Disguise Mode"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 shadow-xs ${
                  disguiseMode ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/70">
            <div>
              <span className="text-xs font-bold flex items-center gap-1.5">
                <ScanFace className="w-3.5 h-3.5 text-emerald-600" />
                <span>Biometric App Lock (Face ID)</span>
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Require biometric verification upon wake
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                playClickSound?.();
                setFaceIdEnabled(!faceIdEnabled);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                faceIdEnabled ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
              aria-label="Toggle Biometric Lock"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 shadow-xs ${
                  faceIdEnabled ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Group 3: Storage & System Maintenance */}
      <div>
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">
          Offline Quran &amp; Map Cache
        </span>
        <div className="p-3.5 u-card flex items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold block">Offline Quran &amp; JAKIM Audio Cache</span>
            <span className="text-[11px] text-slate-500 font-mono">
              Current storage: {cacheSize}
            </span>
          </div>

          <button
            type="button"
            onClick={handleClearCache}
            disabled={clearing || cacheSize === '0 KB'}
            className="min-h-[36px] py-1.5 px-3 rounded-xl u-btn-secondary text-xs font-semibold active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {clearing ? 'Clearing...' : cacheSize === '0 KB' ? 'Cleared ✓' : 'Clear Cache'}
          </button>
        </div>
      </div>

      {/* Compliance Footer */}
      <div className="p-3 rounded-xl u-subtle border border-slate-200/70 text-center text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Multiracial Reverted Muslims (MRM) • PPM-022-14-11072014</span>
      </div>
    </div>
  );
};
