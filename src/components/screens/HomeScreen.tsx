import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  Calendar,
  ArrowRight,
  Clock,
  MapPin,
  PhoneCall,
  CheckCircle2,
  Navigation,
  Lock,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Video,
  Upload,
  Compass,
  MessageSquare,
  Sparkles,
  FileCheck,
  Hash,
  ShieldAlert,
  Sun,
  Calculator,
  RefreshCw,
} from 'lucide-react';
import { ScreenId } from '../../types/screens';
import { UserRole } from '../../types';
import { ROLE_CONFIGS, RoleConfig } from '../../types/roleConfig';
import { ASSETS } from '../../data/assets';
import {
  MRM_LOCATION_ZONES,
  getLocationSyncSnapshot,
  calculateCampaignProgress,
  formatLiveHijriDate,
  getKualaLumpurNow,
  getKualaLumpurTimeParts,
  format24to12,
} from '../../utils/mrmLogic';
import { UtilityTabId } from '../../data/islamicUtilitiesData';

interface HomeScreenProps {
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
  onNavigate: (screen: ScreenId) => void;
  onOpenUtility?: (tab: UtilityTabId) => void;
  selectedZone?: string;
  onSelectZone?: (zone: string) => void;
  onSyncGpsLocation?: () => void;
  isSyncingGps?: boolean;
  playClickSound?: (freq?: number) => void;
  unreadCount?: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentRole = 'staff_admin',
  onNavigate,
  onOpenUtility,
  selectedZone = 'WLY01 - Kuala Lumpur & Putrajaya',
  onSelectZone,
  onSyncGpsLocation,
  isSyncingGps = false,
  playClickSound,
}) => {
  const [isOnDuty, setIsOnDuty] = useState(() => {
    return localStorage.getItem('mrm_on_duty') !== 'false';
  });
  const [panicMode, setPanicMode] = useState(false);
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcStored, setCalcStored] = useState<number | null>(null);
  const [calcOp, setCalcOp] = useState<string | null>(null);
  const [calcResetOnNext, setCalcResetOnNext] = useState(false);

  const [missionAccepted, setMissionAccepted] = useState(() => {
    return localStorage.getItem('mrm_mission_accepted') === 'true';
  });
  const [assignedSquadIds, setAssignedSquadIds] = useState<string[]>([]);
  const [skpUploaded, setSkpUploaded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live real-time seconds ticking strictly synced to Kuala Lumpur (MYT, UTC+8)
  const [klTime, setKlTime] = useState(() => getKualaLumpurTimeParts());
  const [currentTime, setCurrentTime] = useState<Date>(() => getKualaLumpurNow());

  useEffect(() => {
    const timer = setInterval(() => {
      setKlTime(getKualaLumpurTimeParts());
      setCurrentTime(getKualaLumpurNow());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentMinutesFromMidnight = klTime.minutesFromMidnight;
  const currentSecondsFromMidnight = klTime.secondsFromMidnight;

  const roleMeta: RoleConfig = ROLE_CONFIGS[currentRole] || ROLE_CONFIGS.staff_admin;
  const locationSnap = getLocationSyncSnapshot(
    selectedZone,
    currentMinutesFromMidnight,
    undefined,
    currentSecondsFromMidnight
  );
  const prayerInfo = locationSnap.nextPrayerInfo;
  const almanac = locationSnap.almanac;
  const featuredProgress = calculateCampaignProgress(26400, 30000);
  const liveHijri = formatLiveHijriDate(currentTime);

  const showToast = (msg: string) => {
    playClickSound?.(850);
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleDutyToggle = () => {
    playClickSound?.();
    setIsOnDuty((prev) => {
      const next = !prev;
      localStorage.setItem('mrm_on_duty', String(next));
      showToast(next ? 'Status updated: ACTIVE ON DUTY' : 'Status updated: OFF DUTY');
      return next;
    });
  };

  const handleCalcButton = (b: string) => {
    playClickSound?.(620);
    if (b === 'C') {
      setCalcDisplay('0');
      setCalcStored(null);
      setCalcOp(null);
      setCalcResetOnNext(false);
      return;
    }
    if (b === '⌫') {
      setCalcDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      return;
    }
    if (b === '±') {
      setCalcDisplay((prev) => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
      return;
    }
    if (b === '%') {
      setCalcDisplay((prev) => String(parseFloat(prev) / 100));
      return;
    }
    if (['+', '-', '×', '÷'].includes(b)) {
      setCalcStored(parseFloat(calcDisplay));
      setCalcOp(b);
      setCalcResetOnNext(true);
      return;
    }
    if (b === '=') {
      if (calcStored !== null && calcOp) {
        const cur = parseFloat(calcDisplay);
        let res = cur;
        if (calcOp === '+') res = calcStored + cur;
        if (calcOp === '-') res = calcStored - cur;
        if (calcOp === '×') res = calcStored * cur;
        if (calcOp === '÷') res = cur !== 0 ? calcStored / cur : 0;
        setCalcDisplay(String(res));
        setCalcStored(null);
        setCalcOp(null);
        setCalcResetOnNext(true);
      }
      return;
    }
    // Digit or dot
    if (calcResetOnNext) {
      setCalcDisplay(b === '.' ? '0.' : b);
      setCalcResetOnNext(false);
    } else {
      if (b === '.' && calcDisplay.includes('.')) return;
      setCalcDisplay((prev) => (prev === '0' && b !== '.' ? b : prev + b));
    }
  };

  if (panicMode) {
    return (
      <div className="min-h-full u-canvas p-6 flex flex-col justify-between select-none font-mono">
        <div className="text-right py-6 border-b border-slate-200">
          <span className="text-xs text-slate-400 block mb-1">STANDARD CALCULATOR</span>
          <span className="text-4xl font-bold truncate block">{calcDisplay}</span>
        </div>
        <div className="grid grid-cols-4 gap-2.5 text-lg font-bold my-4">
          {[
            'C', '±', '%', '÷',
            '7', '8', '9', '×',
            '4', '5', '6', '-',
            '1', '2', '3', '+',
            '0', '.', '⌫', '='
          ].map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => handleCalcButton(b)}
              className={`min-h-[50px] p-3 rounded-xl text-center cursor-pointer active:scale-95 transition-transform border ${
                ['÷', '×', '-', '+', '='].includes(b)
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : 'u-card border-slate-200'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPanicMode(false)}
          className="min-h-[44px] text-xs text-slate-500 py-3 text-center cursor-pointer hover:underline"
        >
          Return to MRM Care Platform
        </button>
      </div>
    );
  }

  const islamicUtilitiesGrid: {
    id: UtilityTabId;
    label: string;
    sub: string;
    iconUrl: string;
  }[] = [
    {
      id: 'waqt',
      label: 'Waqt & Fast',
      sub: `Sehri ${almanac.sehriEnds12 || format24to12(almanac.sehriEnds24)}`,
      iconUrl: './icons/bento/waqt.png',
    },
    {
      id: 'tracker',
      label: 'Salah Log',
      sub: '5 Waqt · Qaza',
      iconUrl: './icons/bento/log.png',
    },
    {
      id: 'qibla',
      label: 'Qibla 3D',
      sub: `${locationSnap.qibla.bearingDegrees}° ${locationSnap.qibla.cardinalDirection}`,
      iconUrl: './icons/bento/qibla.png',
    },
    {
      id: 'quran',
      label: 'Tajweed',
      sub: 'Audio Quran',
      iconUrl: './icons/bento/tajweed.png',
    },
    {
      id: 'tasbih',
      label: 'Tasbih',
      sub: '33x / 100x',
      iconUrl: './icons/bento/tasbih.png',
    },
    {
      id: 'dua',
      label: 'Duas',
      sub: 'Adhkar · Ruqyah',
      iconUrl: './icons/bento/duas.png',
    },
    {
      id: 'salah_guide',
      label: 'Revert Salah',
      sub: '7 Postures',
      iconUrl: './icons/bento/revert_salah.png',
    },
    {
      id: 'halal',
      label: 'Halal & Fitrah',
      sub: 'E-Codes · Fidyah',
      iconUrl: './icons/bento/halal_fitrah.png',
    },
  ];

  const quickActions = [
    {
      id: 'revert-care',
      label: 'Revert Care',
      sub: 'Kit & Mentor',
      iconUrl: './icons/bento/revert_care.png',
      screen: 'product_detail' as ScreenId,
    },
    {
      id: 'food-aid',
      label: 'Halal Aid',
      sub: 'Asnaf Box',
      iconUrl: './icons/bento/halal_aid.png',
      screen: 'catalog' as ScreenId,
    },
    {
      id: 'halaqa-shifts',
      label: 'Schedule',
      sub: 'Halaqa & Duty',
      iconUrl: './icons/bento/schedule.png',
      screen: 'calendar_booking' as ScreenId,
    },
    {
      id: 'caseworker-chat',
      label: 'Care Chat',
      sub: '24/7 Support',
      iconUrl: './icons/bento/chat.png',
      screen: 'chat' as ScreenId,
    },
  ];

  return (
    <div className="relative min-h-full flex flex-col u-canvas pb-28 overflow-y-auto select-none">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          role="status"
          className="fixed top-16 inset-x-4 z-50 p-3.5 rounded-2xl u-card border-emerald-500/60 text-xs font-semibold shadow-xl flex items-center justify-between animate-fade-in max-w-md mx-auto"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Close notification"
            className="min-w-[32px] min-h-[32px] text-slate-400 hover:text-slate-700 text-xs font-bold px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* ========================================================================= */}
        {/* 1. SIGNATURE EMERALD ARCHITECTURAL HERO CARD WITH LOCATION SYNC & WAQT    */}
        {/* ========================================================================= */}
        <section className="hero-card p-4 relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            {/* Top Location & Qibla Sync Row */}
            <div className="flex items-center justify-between gap-2 text-[11px] text-emerald-100/95 font-medium whitespace-nowrap">
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <div className="relative inline-flex items-center gap-1 min-w-0 max-w-[150px] px-1.5 py-0.5 rounded-md bg-white/10 hover:bg-white/15 transition-colors">
                  <span className="text-emerald-50 font-semibold text-[11px] truncate">
                    {locationSnap.cityLabel} · {locationSnap.zoneCode}
                  </span>
                  <ChevronDown className="w-3 h-3 text-emerald-200 shrink-0" />
                  <select
                    aria-label="Active Location Zone"
                    value={locationSnap.fullZoneLabel}
                    onChange={(e) => {
                      playClickSound?.(820);
                      onSelectZone?.(e.target.value);
                      const nextSnap = getLocationSyncSnapshot(e.target.value);
                      showToast(
                        `Location synced to ${nextSnap.cityLabel} (${nextSnap.zoneCode}) · Qibla ${nextSnap.qibla.bearingDegrees}°`
                      );
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
                <button
                  type="button"
                  onClick={() => {
                    playClickSound?.(880);
                    onSyncGpsLocation?.();
                    showToast(
                      `GPS synced: ${locationSnap.cityLabel} (${locationSnap.lat.toFixed(2)}°N, ${locationSnap.lng.toFixed(2)}°E)`
                    );
                  }}
                  title="Sync exact GPS location"
                  aria-label="Sync GPS location"
                  className="px-1.5 py-0.5 rounded-md bg-white/15 hover:bg-white/25 text-[10px] font-mono text-white flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <RefreshCw className={`w-2.5 h-2.5 ${isSyncingGps ? 'animate-spin' : ''}`} />
                  <span>GPS</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => onOpenUtility?.('qibla')}
                className="flex items-center gap-1 font-mono text-emerald-200 hover:text-white shrink-0 cursor-pointer pl-1"
              >
                <Compass className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>
                  {locationSnap.qibla.bearingDegrees}° {locationSnap.qibla.cardinalDirection}
                </span>
              </button>
            </div>

            {/* Live Kuala Lumpur Clock & Upcoming Prayer Focal Anchor */}
            <div className="p-3 rounded-2xl bg-black/25 border border-white/15 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-200 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>Kuala Lumpur Time (MYT)</span>
                </div>
                <div className="text-2xl font-black font-mono text-white tracking-tight mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-5 h-5 text-emerald-300 shrink-0" />
                  <span>{klTime.formatted12}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  playClickSound?.();
                  onOpenUtility?.('waqt');
                }}
                className="text-right cursor-pointer group shrink-0 pl-3 border-l border-white/15"
              >
                <span className="text-[10px] text-emerald-200 font-medium block">
                  Next: {prayerInfo.nextPrayer.name} ({prayerInfo.nextPrayer.time12 || format24to12(prayerInfo.nextPrayer.time24)})
                </span>
                <span className="text-xs font-bold font-mono text-white bg-white/15 px-2 py-0.5 rounded-lg inline-block mt-1 group-hover:bg-white/25 transition-colors">
                  in {prayerInfo.countdownLabel}
                </span>
              </button>
            </div>

            {/* 5-Prayer Compact Schedule Strip Synced to Location (12-hour AM/PM) */}
            <div className="grid grid-cols-5 gap-1.5 pt-0.5">
              {almanac.farzPrayers.map((p) => {
                const isNext = p.id === prayerInfo.nextPrayer.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onOpenUtility?.('waqt')}
                    className={`py-1.5 px-1 rounded-xl text-center transition-all cursor-pointer ${
                      isNext
                        ? 'bg-white/20 border border-white/40 shadow-xs'
                        : 'bg-black/15 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <div className="text-[10px] text-emerald-100 font-medium">{p.name}</div>
                    <div className="text-[11px] font-mono font-bold text-white mt-0.5 whitespace-nowrap">
                      {p.time12 || format24to12(p.time24)}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* MRM Sehri / Iftar & Prohibited Waqt Bar (12-hour AM/PM) */}
            <div className="pt-2.5 border-t border-white/15 flex items-center justify-between gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => onOpenUtility?.('waqt')}
                className="text-emerald-50 font-mono truncate hover:underline text-left cursor-pointer"
              >
                Sehri {almanac.sehriEnds12 || format24to12(almanac.sehriEnds24)} · Iftar {almanac.iftarMaghrib12 || format24to12(almanac.iftarMaghrib24)}
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound?.();
                  onOpenUtility?.('waqt');
                }}
                className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold text-[10px] whitespace-nowrap shrink-0 cursor-pointer transition-colors flex items-center gap-1"
              >
                <ShieldAlert className="w-3 h-3 text-amber-300" />
                <span>Waqt &amp; Haram Times</span>
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. MRM COMPLETE ISLAMIC UTILITIES BENTO DOCK (8 MODULES)                  */}
        {/* ========================================================================= */}
        <section aria-label="MRM Daily Islamic Utilities" className="space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <div>
              <h2 className="text-xs font-extrabold tracking-tight flex items-center gap-1.5 text-black dark:text-white">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Daily Islamic Utilities · {locationSnap.zoneCode}</span>
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onOpenUtility?.('waqt')}
              className="text-[11px] font-semibold text-emerald-600 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>All 9 Tools</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {islamicUtilitiesGrid.map((util) => (
              <button
                key={util.id}
                type="button"
                onClick={() => {
                  playClickSound?.(840);
                  onOpenUtility?.(util.id);
                }}
                className="u-card u-card-hover p-2 flex flex-col items-center text-center cursor-pointer min-h-[82px] justify-center transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <img
                  src={util.iconUrl}
                  alt={util.label}
                  className="w-10 h-10 object-contain mb-1 transition-transform group-hover:scale-105 pointer-events-none"
                  loading="lazy"
                />
                <span className="text-[11px] font-bold leading-tight whitespace-nowrap text-[#1FA2E8] pointer-events-none">
                  {util.label}
                </span>
                <span className="text-[9.5px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5 whitespace-nowrap pointer-events-none">
                  {util.sub}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. MRM CARE & COMMUNITY QUICK ACTIONS                                     */}
        {/* ========================================================================= */}
        <section aria-label="MRM Care Quick Actions" className="space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-xs font-extrabold tracking-tight flex items-center gap-1.5 text-black dark:text-white">
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
              <span>MRM Care Operations</span>
            </h2>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map((act) => (
              <button
                key={act.id}
                type="button"
                onClick={() => {
                  playClickSound?.();
                  onNavigate(act.screen);
                }}
                className="u-card u-card-hover p-2 flex flex-col items-center text-center cursor-pointer min-h-[82px] justify-center transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <img
                  src={act.iconUrl}
                  alt={act.label}
                  className="w-9 h-9 object-contain mb-1 transition-transform group-hover:scale-105 pointer-events-none"
                  loading="lazy"
                />
                <span className="text-[11px] font-bold leading-tight whitespace-nowrap text-[#1FA2E8] pointer-events-none">
                  {act.label}
                </span>
                <span className="text-[9.5px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5 whitespace-nowrap pointer-events-none">
                  {act.sub}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. ROLE-ADAPTIVE PRIMARY OPERATIONS & CARE WORKSPACE                      */}
        {/* ========================================================================= */}

        {/* ROLE 1: STAFF ADMIN / CRISIS OPERATIONS COMMANDER */}
        {currentRole === 'staff_admin' && (
          <div className="space-y-4">
            {/* 4-KPI Untitled UI Metric Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3.5 rounded-2xl u-card">
                <div className="text-xs font-medium text-slate-400">Active Field Units</div>
                <div className="text-xl font-bold font-mono mt-1">18 Squads</div>
                <div className="text-[11px] text-emerald-600 mt-0.5 font-medium">
                  {locationSnap.cityLabel} · +2 on duty
                </div>
              </div>

              <div className="p-3.5 rounded-2xl u-card">
                <div className="text-xs font-medium text-slate-400">Audited Zakat Pool</div>
                <div className="text-xl font-bold font-mono text-emerald-600 mt-1">RM 184.5K</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  LHDN Sec 44(6) verified
                </div>
              </div>

              <div className="p-3.5 rounded-2xl u-card">
                <div className="text-xs font-medium text-slate-400">Median Response SLA</div>
                <div className="text-xl font-bold font-mono mt-1">14.2 min</div>
                <div className="text-[11px] text-emerald-600 mt-0.5 font-medium">
                  Within 15m national target
                </div>
              </div>

              <div className="p-3.5 rounded-2xl u-card">
                <div className="text-xs font-medium text-slate-400">Volunteer Vetting</div>
                <div className="text-xl font-bold font-mono text-amber-600 mt-1">12 Pending</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  3 SKP clearances ready
                </div>
              </div>
            </div>

            {/* Priority Emergency Dispatches */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-0.5">
                <h2 className="text-sm font-bold tracking-tight">Priority Relief Dispatches</h2>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="text-xs font-semibold text-emerald-600 hover:underline cursor-pointer"
                >
                  Full Analytics
                </button>
              </div>

              {/* Ticket 1 */}
              <div className="p-3.5 rounded-2xl u-card flex items-start gap-3">
                <img
                  src={ASSETS.catalog.foodHamper}
                  alt="Halal Grocery Hamper"
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium mb-0.5">
                    <span className="text-red-500 font-semibold">Urgent Triage</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">SOS-8492</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {locationSnap.cityLabel} ({locationSnap.nearbyFacilities[0]?.distanceKm ?? 1.2} km)
                    </span>
                  </div>
                  <h3 className="text-xs font-bold leading-snug">
                    Infant Formula &amp; Emergency Halal Grocery Box
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Single mother with 3 infants near {locationSnap.hubName}; pantry stocks depleted.
                  </p>
                  <div className="flex items-center gap-2 mt-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setAssignedSquadIds((prev) => [...prev, 'SOS-8492']);
                        showToast(
                          `Assigned Responder Ahmad Faisal (#VOL-4190) to ${locationSnap.cityLabel} · ETA 12 mins`
                        );
                      }}
                      className="min-h-[38px] py-1.5 px-3 rounded-xl u-btn-primary text-xs cursor-pointer whitespace-nowrap"
                    >
                      {assignedSquadIds.includes('SOS-8492') ? 'Squad Dispatched ✓' : 'Assign Nearest Squad'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('chat')}
                      className="min-h-[38px] py-1.5 px-3 rounded-xl u-btn-secondary text-xs cursor-pointer whitespace-nowrap"
                    >
                      Open Case Chat
                    </button>
                  </div>
                </div>
              </div>

              {/* Ticket 2 */}
              <div className="p-3.5 rounded-2xl u-card flex items-start gap-3">
                <img
                  src={ASSETS.catalog.revertKit}
                  alt="Revert Safe Haven"
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium mb-0.5">
                    <span className="text-amber-600 font-semibold">Safeguarding</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">SAFE-104</span>
                    <span aria-hidden="true">·</span>
                    <span>{locationSnap.zoneCode} Sector</span>
                  </div>
                  <h3 className="text-xs font-bold leading-snug">
                    Revert Sister Safe Shelter &amp; Mentor Escort
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    New convert requires verified female caseworker escort to transit home.
                  </p>
                  <div className="flex items-center gap-2 mt-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setAssignedSquadIds((prev) => [...prev, 'SAFE-104']);
                        showToast('Deployed Ustazah Hana & Female Protection Escort');
                      }}
                      className="min-h-[38px] py-1.5 px-3 rounded-xl u-btn-primary text-xs cursor-pointer whitespace-nowrap"
                    >
                      {assignedSquadIds.includes('SAFE-104') ? 'Escort Deployed ✓' : 'Deploy Female Escort'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ROLE 2: APPROVED VOLUNTEER (FIELD FIRST RESPONDER) */}
        {currentRole === 'approved_volunteer' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl u-card flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold">
                  {isOnDuty ? 'On Duty · Dispatch Ready' : 'Off Duty · Standby Mode'}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Squad {locationSnap.zoneCode} #VOL-4190 · GPS Verified
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  playClickSound?.(isOnDuty ? 500 : 900);
                  setIsOnDuty(!isOnDuty);
                  showToast(
                    isOnDuty
                      ? 'Switched to Standby Mode'
                      : `Active on ${locationSnap.cityLabel} Dispatch Grid`
                  );
                }}
                className={`min-h-[40px] py-1.5 px-3.5 rounded-xl text-xs font-semibold cursor-pointer ${
                  isOnDuty ? 'u-btn-secondary' : 'u-btn-primary'
                }`}
              >
                {isOnDuty ? 'Pause Duty' : 'Go On Duty'}
              </button>
            </div>

            <div className="rounded-2xl u-card overflow-hidden">
              <img
                src={ASSETS.banners.gpsMap}
                alt="Field Dispatch Route"
                className="w-full h-36 object-cover"
              />
              <div className="p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="text-emerald-600 font-semibold">
                    ACTIVE CALLOUT · {locationSnap.nearbyFacilities[0]?.distanceKm ?? 1.4} KM
                  </span>
                  <span>ETA 8 MINS</span>
                </div>
                <h2 className="text-sm font-bold leading-snug">
                  SOS-918: Emergency Halal Groceries &amp; Elder Check-In
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Beneficiary: Sister Amina (78yo, reduced mobility). Near {locationSnap.hubName},{' '}
                  {locationSnap.cityLabel}.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound?.(950);
                      setMissionAccepted(true);
                      showToast(`Turn-by-turn route locked to ${locationSnap.hubName}`);
                    }}
                    className="min-h-[42px] flex-1 py-2 px-3.5 rounded-xl u-btn-primary text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{missionAccepted ? 'Navigating to Beneficiary ✓' : 'Accept & Navigate'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('chat')}
                    className="min-h-[42px] py-2 px-3 rounded-xl u-btn-secondary text-xs cursor-pointer"
                  >
                    Contact Ops
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ROLE 3: SEEKER / NEW REVERT CARE RECIPIENT */}
        {currentRole === 'seeker' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl u-card space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-emerald-600 font-semibold">
                    CONFIDENTIAL CARE · #REC-7721
                  </span>
                  <h2 className="text-sm font-bold mt-0.5">
                    Welcome Home to the MRM Brotherhood
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setPanicMode(true)}
                  className="min-h-[38px] py-1.5 px-3 rounded-xl u-btn-secondary text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Privacy Cover</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every new Muslim receives a complimentary Bilingual Quran &amp; Prayer Starter Kit, 1-on-1 mentor guidance, and confidential welfare support.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    showToast('Emergency Welfare & Safe Haven Coordinator alerted');
                    onNavigate('chat');
                  }}
                  className="min-h-[42px] py-2 px-3 rounded-xl u-btn-primary text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>24/7 Care Line</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('product_detail')}
                  className="min-h-[42px] py-2 px-3 rounded-xl u-btn-secondary text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Claim Free Kit</span>
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl u-card flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={ASSETS.avatars.volunteer}
                  alt="Brother Hisham"
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <span className="text-[11px] text-emerald-600 font-semibold">Assigned Revert Buddy</span>
                  <h3 className="text-xs font-bold">Brother Hisham Al-Faruq</h3>
                  <p className="text-[11px] text-slate-500">English, Mandarin &amp; BM · 8 yrs Mentor</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('chat')}
                className="min-h-[40px] py-1.5 px-3 rounded-xl u-btn-primary text-xs cursor-pointer whitespace-nowrap"
              >
                Message
              </button>
            </div>
          </div>
        )}

        {/* ROLE 4: APPROVED TEACHER / SCHOLAR MENTOR */}
        {currentRole === 'approved_teacher' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl u-card space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-600 font-semibold">
                    TAULIAH CERTIFIED · #TCH-204
                  </span>
                  <h2 className="text-sm font-bold mt-0.5">Today&apos;s Revert Mentoring Roster</h2>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Launched encrypted 1-on-1 counseling room')}
                  className="min-h-[38px] py-1.5 px-3 rounded-xl u-btn-primary text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Start Room</span>
                </button>
              </div>

              <div className="space-y-2 pt-1">
                <div className="p-3 rounded-xl u-subtle flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img src={ASSETS.avatars.sarah} alt="Sister Sarah Wong" className="w-9 h-9 rounded-full" />
                    <div>
                      <div className="text-xs font-bold">Sister Sarah Wong</div>
                      <div className="text-[11px] text-slate-500">Week 3: Wudhu &amp; Daily Salah Postures</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-emerald-600">15:00</span>
                </div>

                <div className="p-3 rounded-xl u-subtle flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img src={ASSETS.avatars.david} alt="Brother David Tan" className="w-9 h-9 rounded-full" />
                    <div>
                      <div className="text-xs font-bold">Brother David Tan</div>
                      <div className="text-[11px] text-slate-500">Harmonious Non-Muslim Family Ties</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-500">17:30</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ROLE 5: VOLUNTEER APPLICANT */}
        {currentRole === 'volunteer_applicant' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl u-card space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold block">Volunteer Accreditation Progress</span>
                  <span className="text-[11px] text-amber-600 font-mono">
                    {skpUploaded ? 'Stage 3 of 4: Safeguarding Ethics' : 'Stage 2 of 4: Police Clearance'}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600">
                  {skpUploaded ? '75%' : '50%'}
                </span>
              </div>

              <div className="w-full u-subtle h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{ width: skpUploaded ? '75%' : '50%' }}
                />
              </div>

              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center gap-2 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>1. Identity &amp; Role Application (Completed)</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    2. PDRM SKP Clearance ({skpUploaded ? 'Uploaded & Verified ✓' : 'Action Required'})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <FileCheck className="w-4 h-4 shrink-0" />
                  <span>3. Revert Empathy &amp; Safeguarding Video</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSkpUploaded(true);
                  showToast('SKP Clearance uploaded and verified by MRM Registry');
                }}
                className="min-h-[42px] w-full py-2 px-3 rounded-xl u-btn-primary text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{skpUploaded ? 'SKP Document Submitted ✓' : 'Submit Police Clearance (SKP)'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ROLE 6: COMMUNITY MEMBER / DONOR */}
        {currentRole === 'member' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl u-card space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-600 font-semibold">
                    LHDN SEC 44(6) TAX DEDUCTIBLE
                  </span>
                  <h2 className="text-sm font-bold mt-0.5">
                    Sponsor a New Revert (Muallaf) Starter Kit
                  </h2>
                </div>
                <span className="text-sm font-mono font-bold text-emerald-600">RM 85</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Includes Hardcover Bilingual Quran, prayer mat, pictorial Salah guide, and 6 months 1-on-1 brother/sister mentor pairing.
              </p>
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-500">
                    Raised <strong className="font-mono">RM 26,400</strong> of RM 30,000
                  </span>
                  <span className="font-mono font-bold text-emerald-600">{featuredProgress.percentage}%</span>
                </div>
                <div className="w-full h-2 u-subtle rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${featuredProgress.percentage}%` }}
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('product_detail')}
                  className="min-h-[42px] flex-1 py-2 px-3 rounded-xl u-btn-primary text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Sponsor 1 Kit (RM 85)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('catalog')}
                  className="min-h-[42px] py-2 px-3 rounded-xl u-btn-secondary text-xs cursor-pointer"
                >
                  All Campaigns
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. UNIVERSAL COMMUNITY WELFARE & UPCOMING HALAQA SECTION                  */}
        {/* ========================================================================= */}
        <section className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-sm font-bold tracking-tight">Active Welfare &amp; Revert Programs</h2>
            <button
              type="button"
              onClick={() => onNavigate('catalog')}
              className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>See All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('catalog')}
              className="u-card u-card-hover overflow-hidden text-left cursor-pointer flex flex-col justify-between"
            >
              <div>
                <img
                  src={ASSETS.catalog.foodHamper}
                  alt="Halal Grocery Box"
                  className="w-full h-24 object-cover border-b border-slate-200"
                />
                <div className="p-3">
                  <div className="text-[10px] text-emerald-600 font-semibold">Food Relief · 82% Funded</div>
                  <h3 className="text-xs font-bold mt-0.5 line-clamp-1">Asnaf Halal Grocery Box</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    Rice, oil, dates &amp; staples for 4 pax
                  </p>
                </div>
              </div>
              <div className="px-3 pb-3 pt-1 flex items-center justify-between text-xs border-t border-slate-100">
                <span className="font-mono font-bold text-emerald-600">RM 120 / Free</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('product_detail')}
              className="u-card u-card-hover overflow-hidden text-left cursor-pointer flex flex-col justify-between"
            >
              <div>
                <img
                  src={ASSETS.catalog.revertKit}
                  alt="Revert Welcome Kit"
                  className="w-full h-24 object-cover border-b border-slate-200"
                />
                <div className="p-3">
                  <div className="text-[10px] text-emerald-600 font-semibold">Revert Care · Free for Reverts</div>
                  <h3 className="text-xs font-bold mt-0.5 line-clamp-1">Muallaf Starter Kit</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    Bilingual Quran &amp; 1-on-1 Mentor
                  </p>
                </div>
              </div>
              <div className="px-3 pb-3 pt-1 flex items-center justify-between text-xs border-t border-slate-100">
                <span className="font-mono font-bold text-emerald-600">RM 85 / Free</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
