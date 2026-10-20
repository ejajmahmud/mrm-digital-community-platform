import React, { useState, useEffect } from 'react';
import {
  X,
  Compass,
  Clock,
  BookOpen,
  Hash,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  RotateCcw,
  Play,
  Pause,
  Search,
  Bookmark,
  Volume2,
  Sun,
  Moon,
  HeartHandshake,
  Check,
  Navigation,
  Calculator,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import {
  UtilityTabId,
  TAJWEED_SURAHS,
  TAJWEED_RULES_LEGEND,
  EXTENDED_DUAS,
  REVERT_SALAH_STEPS,
  EXTENDED_HARAM_CODES,
  EXTENDED_SIFAT_NAMES,
} from '../../data/islamicUtilitiesData';
import { DHIKR_LIST } from '../../data/mockData';
import {
  MRM_LOCATION_ZONES,
  getLocationSyncSnapshot,
  findNearestLocationZone,
  calculateFitrahAndFidyah,
  parse24hToMinutes,
  PrayerScheduleItem,
  format24to12,
  getKualaLumpurNow,
} from '../../utils/mrmLogic';
import { fetchPrayerTimesByCoordinates } from '../../services/prayerTimeService';
import { CatalogItem } from '../../types/screens';

interface IslamicUtilitiesSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: UtilityTabId;
  selectedZone?: string;
  onSelectZone?: (zone: string) => void;
  playClickSound?: (freq?: number) => void;
  onAddToCart?: (item: CatalogItem) => void;
}

export const IslamicUtilitiesSheet: React.FC<IslamicUtilitiesSheetProps> = ({
  isOpen,
  onClose,
  initialTab = 'waqt',
  selectedZone = 'WLY01 - Kuala Lumpur & Putrajaya',
  onSelectZone,
  playClickSound,
  onAddToCart,
}) => {
  const [activeTab, setActiveTab] = useState<UtilityTabId>(initialTab);
  const [zone, setZone] = useState<string>(selectedZone);
  const [isSyncingGps, setIsSyncingGps] = useState<boolean>(false);
  const [gpsStatusLabel, setGpsStatusLabel] = useState<string>('JAKIM / Global Zone Synced');
  const [liveApiPrayers, setLiveApiPrayers] = useState<PrayerScheduleItem[] | null>(null);

  // Sync initialTab and external selectedZone when prop changes
  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (selectedZone && selectedZone !== zone) {
      setZone(selectedZone);
      setLiveApiPrayers(null);
    }
  }, [selectedZone]);

  // Handle ESC key to dismiss sheet cleanly
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handlePronounce = (text: string) => {
    playClickSound?.(880);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
      } catch {}
    }
  };

  // 1. Waqt & Fasting State
  const [isFastingToday, setIsFastingToday] = useState<boolean>(true);
  const [fastingStreak, setFastingStreak] = useState<number>(8);

  // 2. Salah & Amal Tracker State (Persisted)
  const [completedFarz, setCompletedFarz] = useState<Record<string, boolean>>(() => {
    try {
      const s = localStorage.getItem('mrm_salah_farz');
      if (s) return JSON.parse(s);
    } catch {}
    return {
      Subuh: true,
      Zohor: true,
      Asar: true,
      Maghrib: false,
      Isyak: false,
    };
  });

  const [completedSunnah, setCompletedSunnah] = useState<Record<string, boolean>>(() => {
    try {
      const s = localStorage.getItem('mrm_salah_sunnah');
      if (s) return JSON.parse(s);
    } catch {}
    return {
      Tahajjud: true,
      Duha: true,
      Rawatib: true,
      Witr: false,
      MorningAdhkar: true,
      QuranTilawat: true,
    };
  });

  const [qazaDebtCount, setQazaDebtCount] = useState<number>(() => {
    try {
      const s = localStorage.getItem('mrm_salah_qaza');
      if (s) return Number(s);
    } catch {}
    return 4;
  });

  useEffect(() => {
    try {
      localStorage.setItem('mrm_salah_farz', JSON.stringify(completedFarz));
      localStorage.setItem('mrm_salah_sunnah', JSON.stringify(completedSunnah));
      localStorage.setItem('mrm_salah_qaza', String(qazaDebtCount));
    } catch {}
  }, [completedFarz, completedSunnah, qazaDebtCount]);

  // 3. Qibla Compass State with Real-Time Gyro / Magnetometer Orientation
  const baseSnapshot = getLocationSyncSnapshot(zone);
  const [deviceHeading, setDeviceHeading] = useState<number>(
    Math.round(baseSnapshot.qibla.bearingDegrees)
  );

  useEffect(() => {
    setDeviceHeading(Math.round(baseSnapshot.qibla.bearingDegrees));
  }, [baseSnapshot.zoneCode]);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading: number | null = null;
      if ((e as any).webkitCompassHeading) {
        // iOS Safari native compass
        heading = (e as any).webkitCompassHeading;
      } else if (e.alpha !== null) {
        // Android Chrome
        heading = 360 - e.alpha;
      }
      if (heading !== null && !isNaN(heading)) {
        setDeviceHeading(Math.round(heading));
      }
    };

    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  // 4. Tajweed Quran State
  const [selectedSurahNum, setSelectedSurahNum] = useState<number>(1);
  const [showTajweedColors, setShowTajweedColors] = useState<boolean>(true);
  const [translationLang, setTranslationLang] = useState<'en' | 'bm'>('en');
  const [selectedQari, setSelectedQari] = useState<string>('Mishary Rashid Alafasy');
  const [playingAyahKey, setPlayingAyahKey] = useState<string | null>(null);
  const [bookmarkedAyat, setBookmarkedAyat] = useState<string[]>(() => {
    try {
      const s = localStorage.getItem('mrm_bookmarked_ayat');
      if (s) return JSON.parse(s);
    } catch {}
    return ['1:1', '1:5', '112:1'];
  });

  useEffect(() => {
    try {
      localStorage.setItem('mrm_bookmarked_ayat', JSON.stringify(bookmarkedAyat));
    } catch {}
  }, [bookmarkedAyat]);

  // 5. Tasbih State (Persisted with Haptic Feedback)
  const [dhikrIdx, setDhikrIdx] = useState<number>(0);
  const [tasbihCount, setTasbihCount] = useState<number>(() => {
    try {
      const s = localStorage.getItem('mrm_tasbih_count');
      if (s) return Number(s);
    } catch {}
    return 18;
  });
  const [tasbihLaps, setTasbihLaps] = useState<number>(() => {
    try {
      const s = localStorage.getItem('mrm_tasbih_laps');
      if (s) return Number(s);
    } catch {}
    return 2;
  });
  const [lifetimeDhikr, setLifetimeDhikr] = useState<number>(() => {
    try {
      const s = localStorage.getItem('mrm_tasbih_lifetime');
      if (s) return Number(s);
    } catch {}
    return 1420;
  });

  useEffect(() => {
    try {
      localStorage.setItem('mrm_tasbih_count', String(tasbihCount));
      localStorage.setItem('mrm_tasbih_laps', String(tasbihLaps));
      localStorage.setItem('mrm_tasbih_lifetime', String(lifetimeDhikr));
    } catch {}
  }, [tasbihCount, tasbihLaps, lifetimeDhikr]);

  // 6. Dua State
  const [duaCategory, setDuaCategory] = useState<string>('All');
  const [duaQuery, setDuaQuery] = useState<string>('');
  const [duaRepCounts, setDuaRepCounts] = useState<Record<string, number>>({});

  // 7. Revert Salah Guide State
  const [activeSalahStep, setActiveSalahStep] = useState<number>(1);

  // 8. 99 Names State
  const [sifatSearch, setSifatSearch] = useState<string>('');

  // 9. Halal E-Codes & Fitrah/Fidyah State
  const [eCodeQuery, setECodeQuery] = useState<string>('');
  const [eCodeFilter, setECodeFilter] = useState<'All' | 'Halal' | 'Mushbooh' | 'Haram'>('All');
  const [fitrahDependents, setFitrahDependents] = useState<number>(3);
  const [fitrahRiceRate, setFitrahRiceRate] = useState<7 | 14 | 21>(14);
  const [missedFasts, setMissedFasts] = useState<number>(2);
  const [fitrahAddedToast, setFitrahAddedToast] = useState<boolean>(false);

  if (!isOpen) return null;

  const almanac = baseSnapshot.almanac;
  const qiblaInfo = baseSnapshot.qibla;
  const isQiblaAligned = Math.abs(deviceHeading - Math.round(qiblaInfo.bearingDegrees)) <= 5;

  const farzDoneCount = Object.values(completedFarz).filter(Boolean).length;
  const sunnahDoneCount = Object.values(completedSunnah).filter(Boolean).length;
  const totalTrackerPct = Math.round(((farzDoneCount + sunnahDoneCount) / 11) * 100);

  const currentSurah =
    TAJWEED_SURAHS.find((s) => s.number === selectedSurahNum) || TAJWEED_SURAHS[0];
  const currentDhikr = DHIKR_LIST[dhikrIdx] || DHIKR_LIST[0];
  const fitrahCalc = calculateFitrahAndFidyah(fitrahDependents, fitrahRiceRate, missedFasts, 4);

  const tabs: {
    id: UtilityTabId;
    label: string;
    icon: React.FC<{ className?: string }>;
    iconUrl?: string;
  }[] = [
    { id: 'waqt', label: 'Waqt & Fasting', icon: Clock, iconUrl: './icons/bento/waqt.png' },
    { id: 'tracker', label: 'Salah Tracker', icon: CheckCircle2, iconUrl: './icons/bento/log.png' },
    { id: 'qibla', label: 'Qibla 3D', icon: Compass, iconUrl: './icons/bento/qibla.png' },
    { id: 'quran', label: 'Tajweed Quran', icon: BookOpen, iconUrl: './icons/bento/tajweed.png' },
    { id: 'tasbih', label: 'Tasbih', icon: Hash, iconUrl: './icons/bento/tasbih.png' },
    { id: 'dua', label: 'Duas & Ruqyah', icon: Sparkles, iconUrl: './icons/bento/duas.png' },
    { id: 'salah_guide', label: 'Revert Salah', icon: Sun, iconUrl: './icons/bento/revert_salah.png' },
    { id: 'sifat', label: '99 Names', icon: Moon },
    { id: 'halal', label: 'Halal & Fitrah', icon: Calculator, iconUrl: './icons/bento/halal_fitrah.png' },
  ];

  const handleZoneChange = (newZone: string) => {
    playClickSound?.(820);
    setZone(newZone);
    setLiveApiPrayers(null);
    onSelectZone?.(newZone);
    const snap = getLocationSyncSnapshot(newZone);
    setDeviceHeading(Math.round(snap.qibla.bearingDegrees));
    setGpsStatusLabel(`Synced: ${snap.cityLabel} (${snap.zoneCode})`);
  };

  const handleSyncGpsCoordinates = async () => {
    playClickSound?.(880);
    setIsSyncingGps(true);
    setGpsStatusLabel('Acquiring GPS & Aladhan API...');

    const syncWithCoords = async (lat: number, lng: number) => {
      const nearest = findNearestLocationZone(lat, lng);
      setZone(nearest.zone.fullLabel);
      onSelectZone?.(nearest.zone.fullLabel);
      setDeviceHeading(Math.round(getLocationSyncSnapshot(nearest.zone.fullLabel).qibla.bearingDegrees));

      try {
        const apiData = await fetchPrayerTimesByCoordinates(
          lat,
          lng,
          nearest.zone.city,
          nearest.zone.methodId
        );
        if (apiData && apiData.timings) {
          const fajrM = parse24hToMinutes(apiData.timings.Fajr);
          const syurukM = parse24hToMinutes(apiData.timings.Sunrise);
          const dhuhrM = parse24hToMinutes(apiData.timings.Dhuhr);
          const asrM = parse24hToMinutes(apiData.timings.Asr);
          const maghribM = parse24hToMinutes(apiData.timings.Maghrib);
          const ishaM = parse24hToMinutes(apiData.timings.Isha);
          if (fajrM > 0 && maghribM > 0) {
            setLiveApiPrayers([
              {
                id: 'fajr',
                name: 'Subuh',
                arabicName: 'الفجر',
                time24: apiData.timings.Fajr,
                time12: format24to12(apiData.timings.Fajr),
                endTime24: apiData.timings.Sunrise,
                endTime12: format24to12(apiData.timings.Sunrise),
                rakaatSummary: '2 Sunnah · 2 Farz',
                minutesFromMidnight: fajrM,
                endMinutesFromMidnight: syurukM - 1,
              },
              {
                id: 'syuruk',
                name: 'Syuruk',
                arabicName: 'الشروق',
                time24: apiData.timings.Sunrise,
                time12: format24to12(apiData.timings.Sunrise),
                endTime24: apiData.timings.Sunrise,
                endTime12: format24to12(apiData.timings.Sunrise),
                rakaatSummary: 'Sunrise (No Salah)',
                minutesFromMidnight: syurukM,
                endMinutesFromMidnight: syurukM + 15,
              },
              {
                id: 'dhuhr',
                name: 'Zohor',
                arabicName: 'الظهر',
                time24: apiData.timings.Dhuhr,
                time12: format24to12(apiData.timings.Dhuhr),
                endTime24: apiData.timings.Asr,
                endTime12: format24to12(apiData.timings.Asr),
                rakaatSummary: '4 Sunnah · 4 Farz · 2 Sunnah',
                minutesFromMidnight: dhuhrM,
                endMinutesFromMidnight: asrM - 1,
              },
              {
                id: 'asr',
                name: 'Asar',
                arabicName: 'العصر',
                time24: apiData.timings.Asr,
                time12: format24to12(apiData.timings.Asr),
                endTime24: apiData.timings.Maghrib,
                endTime12: format24to12(apiData.timings.Maghrib),
                rakaatSummary: '4 Sunnah · 4 Farz',
                minutesFromMidnight: asrM,
                endMinutesFromMidnight: maghribM - 1,
              },
              {
                id: 'maghrib',
                name: 'Maghrib',
                arabicName: 'المغرب',
                time24: apiData.timings.Maghrib,
                time12: format24to12(apiData.timings.Maghrib),
                endTime24: apiData.timings.Isha,
                endTime12: format24to12(apiData.timings.Isha),
                rakaatSummary: '3 Farz · 2 Sunnah',
                minutesFromMidnight: maghribM,
                endMinutesFromMidnight: ishaM - 1,
              },
              {
                id: 'isha',
                name: 'Isyak',
                arabicName: 'العشاء',
                time24: apiData.timings.Isha,
                time12: format24to12(apiData.timings.Isha),
                endTime24: apiData.timings.Fajr,
                endTime12: format24to12(apiData.timings.Fajr),
                rakaatSummary: '4 Farz · 2 Sunnah · 3 Witr',
                minutesFromMidnight: ishaM,
                endMinutesFromMidnight: fajrM - 1,
              },
            ]);
          }
        }
      } catch {
        // Fallback to deterministic zone calculation
      }

      setGpsStatusLabel(
        `GPS Synced · ${nearest.zone.code} (${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E)`
      );
      setIsSyncingGps(false);
    };

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          syncWithCoords(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          syncWithCoords(baseSnapshot.lat, baseSnapshot.lng);
        },
        { timeout: 3500 }
      );
    } else {
      await syncWithCoords(baseSnapshot.lat, baseSnapshot.lng);
    }
  };

  const quranAudioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (quranAudioRef.current) {
        quranAudioRef.current.pause();
      }
    };
  }, []);

  const handlePlayAyahTone = (key: string) => {
    if (playingAyahKey === key) {
      if (quranAudioRef.current) {
        quranAudioRef.current.pause();
        quranAudioRef.current.currentTime = 0;
      }
      setPlayingAyahKey(null);
      return;
    }

    if (quranAudioRef.current) {
      quranAudioRef.current.pause();
    }

    // Mapping for Al-Fatihah, Al-Ikhlas, Al-Falaq, An-Nas
    const [surahStr, ayahStr] = key.split(':');
    const surah = parseInt(surahStr, 10);
    const ayah = parseInt(ayahStr, 10);

    const SURAH_START_AYAH: Record<number, number> = {
      1: 1,      // Al-Fatihah (1-7)
      112: 6222, // Al-Ikhlas (6222-6225)
      113: 6226, // Al-Falaq (6226-6230)
      114: 6231, // An-Nas (6231-6236)
      36: 3706,  // Yasin
    };

    const start = SURAH_START_AYAH[surah] || 1;
    const globalAyahNum = start + ayah - 1;
    const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahNum}.mp3`;

    try {
      const audio = new Audio(audioUrl);
      quranAudioRef.current = audio;
      setPlayingAyahKey(key);
      audio.play().catch(() => {
        playClickSound?.(720);
        setTimeout(() => setPlayingAyahKey((prev) => (prev === key ? null : prev)), 2500);
      });
      audio.onended = () => {
        setPlayingAyahKey((prev) => (prev === key ? null : prev));
      };
      audio.onerror = () => {
        playClickSound?.(720);
        setTimeout(() => setPlayingAyahKey((prev) => (prev === key ? null : prev)), 2500);
      };
    } catch {
      playClickSound?.(720);
      setPlayingAyahKey(key);
      setTimeout(() => setPlayingAyahKey((prev) => (prev === key ? null : prev)), 2500);
    }
  };

  const handleTasbihTap = () => {
    playClickSound?.(880);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(25);
      } catch {}
    }
    setLifetimeDhikr((prev) => prev + 1);
    setTasbihCount((prev) => {
      const next = prev + 1;
      if (next >= currentDhikr.targetCount) {
        setTasbihLaps((l) => l + 1);
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try {
            navigator.vibrate([40, 60, 40]);
          } catch {}
        }
        return 0;
      }
      return next;
    });
  };

  const getTajweedClass = (rule?: string) => {
    if (!showTajweedColors || !rule) return '';
    switch (rule) {
      case 'ghunnah':
        return 'text-emerald-600 underline decoration-emerald-500/60 underline-offset-4';
      case 'ikhfa':
        return 'text-amber-600 underline decoration-amber-500/60 underline-offset-4';
      case 'idgham':
        return 'text-sky-600 underline decoration-sky-500/60 underline-offset-4';
      case 'qalqalah':
        return 'text-rose-600 underline decoration-rose-500/60 underline-offset-4';
      case 'madd':
        return 'text-purple-600 underline decoration-purple-500/60 underline-offset-4';
      default:
        return '';
    }
  };

  const activeFarzPrayers = liveApiPrayers
    ? liveApiPrayers.filter((p) => p.id !== 'syuruk')
    : almanac.farzPrayers;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="MRM Complete Islamic Utilities Suite"
      className="fixed inset-0 max-w-md mx-auto z-50 u-canvas flex flex-col overflow-hidden animate-fade-in select-none shadow-2xl"
    >
      {/* Top Sheet Header */}
      <div className="shrink-0 px-3.5 py-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] u-surface border-b flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs font-extrabold tracking-tight truncate text-black dark:text-white">
              MRM Islamic Utilities &amp; Almanac Suite
            </h2>
            <p className="text-[10px] text-emerald-600 font-mono font-semibold truncate">
              {gpsStatusLabel}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            playClickSound?.(760);
            onClose();
          }}
          aria-label="Close Islamic Utilities Suite"
          className="w-8 h-8 rounded-xl u-btn-secondary flex items-center justify-center shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Horizontal 9-Module Tab Selector */}
      <div className="shrink-0 px-3 py-2 u-surface border-b flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                playClickSound?.(820);
                setActiveTab(tab.id);
              }}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-all border ${
                isActive
                  ? 'u-btn-primary border-transparent shadow-xs'
                  : 'u-card hover:border-emerald-500/40'
              }`}
            >
              {tab.iconUrl ? (
                <img src={tab.iconUrl} alt={tab.label} className="w-3.5 h-3.5 object-contain" />
              ) : (
                <Icon className="w-3.5 h-3.5" />
              )}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Scrollable Active Utility Body */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 pb-24 overscroll-contain">
        {/* =================================================================== */}
        {/* TAB 1: WAQT START/END, SEHRI/IFTAR & 3 PROHIBITED PRAYER WINDOWS    */}
        {/* =================================================================== */}
        {activeTab === 'waqt' && (
          <div className="space-y-3.5">
            {/* Location Zone Selector & GPS Auto-Sync Bar */}
            <div className="p-3 u-card space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    JAKIM &amp; Global Location Zone ({baseSnapshot.authority})
                  </label>
                  <select
                    aria-label="Select Prayer Calculation Zone"
                    value={baseSnapshot.fullZoneLabel}
                    onChange={(e) => handleZoneChange(e.target.value)}
                    className="w-full mt-1 text-xs font-bold bg-transparent focus:outline-hidden cursor-pointer truncate"
                  >
                    {MRM_LOCATION_ZONES.map((z) => (
                      <option key={z.code} value={z.fullLabel}>
                        {z.fullLabel}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleSyncGpsCoordinates}
                  disabled={isSyncingGps}
                  className="px-2.5 py-1.5 rounded-xl u-btn-primary text-[10px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncingGps ? 'animate-spin' : ''}`} />
                  <span>{isSyncingGps ? 'Syncing...' : 'GPS Sync'}</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>
                    {baseSnapshot.lat.toFixed(4)}°N, {baseSnapshot.lng.toFixed(4)}°E ·{' '}
                    {baseSnapshot.hubName}
                  </span>
                </span>
                <span className="text-emerald-600 font-bold shrink-0">
                  Qibla {qiblaInfo.bearingDegrees}°
                </span>
              </div>
            </div>

            {/* Sehri (Imsak) & Iftar Live Tracker Card */}
            <div className="hero-card p-4 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-emerald-100">
                <span className="font-semibold">
                  Sehri &amp; Iftar Almanac · {baseSnapshot.cityLabel}
                </span>
                <span className="font-mono">Fast: {almanac.fastingDurationLabel}</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-xl bg-black/20 border border-white/15">
                  <span className="text-[10px] text-emerald-200 block">
                    Sehri Last Time (Imsak)
                  </span>
                  <div className="text-lg font-bold font-mono text-white mt-0.5">
                    {almanac.sehriEnds12 || format24to12(almanac.sehriEnds24)}
                  </div>
                  <span className="text-[10px] text-emerald-100/80 font-mono">
                    Fajr Azan: {almanac.fajrStarts12 || format24to12(almanac.fajrStarts24)}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-black/20 border border-white/15">
                  <span className="text-[10px] text-amber-200 block">
                    Today&apos;s Iftar (Maghrib)
                  </span>
                  <div className="text-lg font-bold font-mono text-white mt-0.5">
                    {almanac.iftarMaghrib12 || format24to12(almanac.iftarMaghrib24)}
                  </div>
                  <span className="text-[10px] text-emerald-100/80 font-mono">
                    Next: {baseSnapshot.nextPrayerInfo.nextPrayer.name} in{' '}
                    {baseSnapshot.nextPrayerInfo.countdownLabel}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-2">
                <span className="text-[11px] text-emerald-50 font-medium">
                  Sunnah Fasting Streak: <strong className="font-mono">{fastingStreak} Days</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound?.(860);
                    setIsFastingToday((prev) => {
                      const next = !prev;
                      setFastingStreak((s) => (next ? s + 1 : Math.max(0, s - 1)));
                      return next;
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold cursor-pointer transition-colors"
                >
                  {isFastingToday ? 'Fasting Logged Today ✓' : 'Log Today’s Fast'}
                </button>
              </div>
            </div>

            {/* 5 Farz Waqt Start & End Ranges (12-hour AM/PM) */}
            <div className="p-3.5 u-card space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold">
                  5 Farz Waqt Windows ({baseSnapshot.zoneCode})
                </h3>
                <span className="text-[10px] font-mono text-emerald-600 font-semibold">
                  Permitted Waqt ✓
                </span>
              </div>
              <div className="divide-y divide-slate-200/70">
                {activeFarzPrayers.map((p) => (
                  <div key={p.id} className="py-2 flex items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>{p.name}</span>
                        <span className="text-slate-400 font-normal">({p.arabicName})</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{p.rakaatSummary}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-emerald-600 text-xs">
                        {p.time12 || format24to12(p.time24)} – {p.endTime12 || format24to12(p.endTime24 || '')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3 Prohibited / Forbidden Prayer Windows (12-hour AM/PM) */}
            <div className="p-3.5 u-card space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold flex items-center gap-1.5 text-rose-600">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>3 Prohibited (Haram / Tahrimi) Prayer Windows</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-500">Sahih Muslim 831</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Refrain from initiating any Salah during these 3 solar transitions (Dhikr &amp; Dua remain permitted):
              </p>
              <div className="space-y-2">
                {almanac.forbiddenWindows.map((fw) => (
                  <div
                    key={fw.id}
                    className="p-2.5 rounded-xl u-subtle border border-rose-500/20 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-rose-600">{fw.name}</div>
                      <p className="text-[10px] text-slate-500 leading-snug mt-0.5">{fw.reason}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-rose-600 whitespace-nowrap shrink-0">
                      {fw.startTime12 || format24to12(fw.startTime24)} – {fw.endTime12 || format24to12(fw.endTime24)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4 Nafl Prayer Windows (12-hour AM/PM) */}
            <div className="p-3.5 u-card space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold">Sunnah &amp; Nafl Waqt Windows</h3>
                <span className="text-[10px] font-mono text-emerald-600">Extra Rewards</span>
              </div>
              <div className="space-y-2">
                {almanac.naflPrayers.map((nf) => (
                  <div
                    key={nf.id}
                    className="p-2.5 rounded-xl u-subtle flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold">
                        {nf.name} <span className="text-[10px] text-emerald-600">· {nf.rakaat}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{nf.virtue}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-600 whitespace-nowrap shrink-0">
                      {nf.startTime12 || format24to12(nf.startTime24)} – {nf.endTime12 || format24to12(nf.endTime24)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: DAILY SALAH, SUNNAH AMAL & QAZA TRACKER                      */}
        {/* =================================================================== */}
        {activeTab === 'tracker' && (
          <div className="space-y-3.5">
            <div className="p-4 u-card flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase">
                  DAILY SPIRITUAL CONSISTENCY
                </span>
                <h3 className="text-sm font-bold mt-0.5">
                  {farzDoneCount}/5 Farz · {sunnahDoneCount}/6 Sunnah Amal
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Tap any prayer or daily sunnah deed below to update your log.
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center shrink-0">
                <span className="text-base font-bold font-mono">{totalTrackerPct}%</span>
                <span className="text-[9px] uppercase">Today</span>
              </div>
            </div>

            {/* 5 Daily Farz Prayers */}
            <div className="p-3.5 u-card space-y-2.5">
              <h4 className="text-xs font-bold">5 Daily Farz Salah Check-In</h4>
              <div className="grid grid-cols-5 gap-1.5">
                {Object.keys(completedFarz).map((pName) => {
                  const done = completedFarz[pName];
                  return (
                    <button
                      key={pName}
                      type="button"
                      onClick={() => {
                        playClickSound?.(done ? 680 : 900);
                        setCompletedFarz((prev) => ({ ...prev, [pName]: !prev[pName] }));
                      }}
                      className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                        done
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                          : 'u-subtle border-slate-200/80 text-slate-500'
                      }`}
                    >
                      <div className="text-[11px]">{pName}</div>
                      <div className="text-[10px] font-mono mt-1">{done ? 'Prayed ✓' : 'Log'}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sunnah & Daily Amal Checklist */}
            <div className="p-3.5 u-card space-y-2">
              <h4 className="text-xs font-bold">Sunnah Prayers &amp; Daily Adhkar</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'Tahajjud', label: 'Tahajjud (Qiyam)' },
                  { key: 'Duha', label: 'Salat al-Duha' },
                  { key: 'Rawatib', label: '12 Sunnah Rawatib' },
                  { key: 'Witr', label: '3 Rakaat Witr' },
                  { key: 'MorningAdhkar', label: 'Morning/Evening Adhkar' },
                  { key: 'QuranTilawat', label: 'Daily Quran Tilawat' },
                ].map((item) => {
                  const done = completedSunnah[item.key];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        playClickSound?.(840);
                        setCompletedSunnah((prev) => ({ ...prev, [item.key]: !prev[item.key] }));
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs cursor-pointer transition-all ${
                        done
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 font-bold'
                          : 'u-subtle border-slate-200/70 text-slate-600'
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                      {done && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Qaza (Missed Salah) Ledger */}
            <div className="p-3.5 u-card flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold">Qaza (Make-Up Salah) Counter</h4>
                <p className="text-[11px] text-slate-500">
                  Remaining missed Farz prayers to make up:{' '}
                  <strong className="font-mono">{qazaDebtCount}</strong>
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound?.(880);
                    setQazaDebtCount((c) => Math.max(0, c - 1));
                  }}
                  className="px-3 py-1.5 rounded-xl u-btn-primary text-xs font-bold cursor-pointer"
                >
                  Prayed 1 Qaza (-1)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound?.(720);
                    setQazaDebtCount((c) => c + 1);
                  }}
                  className="px-2.5 py-1.5 rounded-xl u-btn-secondary text-xs font-bold cursor-pointer"
                >
                  +1
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: PRECISION QIBLA COMPASS & KAABA GREAT-CIRCLE DISTANCE        */}
        {/* =================================================================== */}
        {activeTab === 'qibla' && (
          <div className="space-y-3.5">
            <div className="p-4 u-card text-center space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {baseSnapshot.cityLabel} ({baseSnapshot.zoneCode})
                  </span>
                </span>
                <span className="font-mono font-bold text-emerald-600">
                  {qiblaInfo.bearingDegrees}° {qiblaInfo.cardinalDirection}
                </span>
              </div>

              {/* Interactive Compass Dial */}
              <div className="w-40 h-40 mx-auto rounded-full u-subtle border-4 border-emerald-500/30 relative flex items-center justify-center shadow-inner">
                <span className="absolute top-2 text-[10px] font-mono font-bold text-rose-500">N</span>
                <span className="absolute bottom-2 text-[10px] font-mono font-bold text-slate-400">S</span>
                <span className="absolute left-2.5 text-[10px] font-mono font-bold text-slate-400">W</span>
                <span className="absolute right-2.5 text-[10px] font-mono font-bold text-slate-400">E</span>

                <div
                  style={{ transform: `rotate(${deviceHeading}deg)` }}
                  className="w-2 h-24 rounded-full bg-gradient-to-t from-slate-400 via-emerald-500 to-emerald-600 transition-transform duration-300 origin-center relative"
                >
                  <div className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[8px] font-bold flex items-center justify-center -top-2 -left-1 absolute shadow">
                    🕋
                  </div>
                </div>
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-700 border-2 border-white z-10" />
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold">
                  {isQiblaAligned ? (
                    <span className="text-emerald-600">Aligned with Holy Kaaba in Makkah ✓</span>
                  ) : (
                    <span className="text-amber-600">
                      Rotate device to {qiblaInfo.bearingDegrees}° ({qiblaInfo.cardinalDirection})
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  Great-Circle Distance to Kaaba: {qiblaInfo.distanceKm.toLocaleString()} km
                </p>
              </div>

              {/* Heading Calibrator */}
              <div className="pt-2 border-t border-slate-200/70 space-y-1.5 text-left">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 font-semibold">Simulate Compass Azimuth:</span>
                  <span className="font-mono font-bold">{deviceHeading}°</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={deviceHeading}
                  onChange={(e) => setDeviceHeading(Number(e.target.value))}
                  aria-label="Simulate Compass Azimuth"
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => {
                    playClickSound?.(900);
                    setDeviceHeading(Math.round(qiblaInfo.bearingDegrees));
                  }}
                  className="w-full py-2 rounded-xl u-btn-primary text-xs font-bold cursor-pointer mt-1"
                >
                  Snap Directly to Qibla ({qiblaInfo.bearingDegrees}°)
                </button>
              </div>
            </div>

            {/* Nearby Mosques & MRM Hubs Sorted by Live Distance */}
            <div className="p-3.5 u-card space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold">Nearest Mosques &amp; MRM Care Hubs</h4>
                <span className="text-[10px] font-mono text-emerald-600">GPS Sorted</span>
              </div>
              <div className="space-y-1.5">
                {baseSnapshot.nearbyFacilities.slice(0, 3).map((fac) => (
                  <div
                    key={fac.id}
                    className="p-2.5 rounded-xl u-subtle flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-bold truncate">{fac.name}</div>
                      <div className="text-[10px] text-slate-500">
                        {fac.type} · {fac.city}
                      </div>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-emerald-600 shrink-0">
                      {fac.distanceKm} km
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: AL-QURAN WITH COLOR-CODED TAJWEED, AUDIO QARI & BOOKMARKS    */}
        {/* =================================================================== */}
        {activeTab === 'quran' && (
          <div className="space-y-3.5">
            {/* Surah Selector & Tajweed Toggle */}
            <div className="p-3.5 u-card space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                  {TAJWEED_SURAHS.map((s) => (
                    <button
                      key={s.number}
                      type="button"
                      onClick={() => {
                        playClickSound?.(800);
                        setSelectedSurahNum(s.number);
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer border ${
                        selectedSurahNum === s.number
                          ? 'u-btn-primary border-transparent'
                          : 'u-subtle border-slate-200/70'
                      }`}
                    >
                      {s.number}. {s.nameEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Qari & Translation Controls */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <select
                  aria-label="Select Qari Reciter"
                  value={selectedQari}
                  onChange={(e) => setSelectedQari(e.target.value)}
                  className="p-2 rounded-xl u-subtle border border-slate-200/80 text-[11px] font-semibold"
                >
                  <option value="Mishary Rashid Alafasy">Qari: Mishary Alafasy</option>
                  <option value="Abdul Rahman Al-Sudais">Qari: Imam Al-Sudais</option>
                  <option value="Saad Al-Ghamdi">Qari: Saad Al-Ghamdi</option>
                </select>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowTajweedColors((v) => !v)}
                    className={`flex-1 py-2 px-2 rounded-xl text-[11px] font-bold border cursor-pointer ${
                      showTajweedColors
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700'
                        : 'u-subtle border-slate-200/70 text-slate-500'
                    }`}
                  >
                    Tajweed {showTajweedColors ? 'ON' : 'OFF'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTranslationLang((l) => (l === 'en' ? 'bm' : 'en'))}
                    className="py-2 px-2.5 rounded-xl u-btn-secondary text-[11px] font-bold cursor-pointer uppercase"
                  >
                    {translationLang}
                  </button>
                </div>
              </div>

              {/* Color-Coded Tajweed Rules Legend */}
              {showTajweedColors && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {TAJWEED_RULES_LEGEND.map((r) => (
                    <span
                      key={r.id}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${r.colorClass}`}
                    >
                      {r.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Ayah Cards */}
            <div className="space-y-2.5">
              {currentSurah.ayat.map((ayah) => {
                const key = `${currentSurah.number}:${ayah.ayahNumber}`;
                const isBookmarked = bookmarkedAyat.includes(key);
                const isPlaying = playingAyahKey === key;

                return (
                  <div key={key} className="p-3.5 u-card space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-emerald-600">
                        Surah {currentSurah.nameEn} · Ayah {ayah.ayahNumber}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handlePlayAyahTone(key)}
                          aria-label={`Play recitation for Ayah ${ayah.ayahNumber}`}
                          className="px-2.5 py-1 rounded-lg u-btn-secondary text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          {isPlaying ? (
                            <Pause className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Play className="w-3 h-3" />
                          )}
                          <span>{isPlaying ? 'Reciting...' : 'Listen'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            playClickSound?.(840);
                            setBookmarkedAyat((prev) =>
                              prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
                            );
                          }}
                          aria-label={`Bookmark Ayah ${ayah.ayahNumber}`}
                          className={`p-1.5 rounded-lg cursor-pointer ${
                            isBookmarked ? 'text-emerald-600 bg-emerald-500/10' : 'text-slate-400'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Color-Coded Tajweed Arabic Script */}
                    <p className="text-right text-lg font-arabic leading-loose tracking-wide">
                      {ayah.tajweedSegments.map((seg, i) => (
                        <span key={i} className={getTajweedClass(seg.rule)}>
                          {seg.text}
                        </span>
                      ))}
                    </p>

                    <p className="text-[11px] text-emerald-600 font-medium italic">
                      {ayah.transliteration}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-200/60">
                      {translationLang === 'en' ? ayah.translationEn : ayah.translationBm}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 5: DIGITAL TASBIH & DHIKR COUNTER                               */}
        {/* =================================================================== */}
        {activeTab === 'tasbih' && (
          <div className="space-y-3.5 text-center">
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {DHIKR_LIST.map((d, idx) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    playClickSound?.(780);
                    setDhikrIdx(idx);
                    setTasbihCount(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer border ${
                    dhikrIdx === idx
                      ? 'u-btn-primary border-transparent'
                      : 'u-card hover:border-emerald-500/40'
                  }`}
                >
                  {d.transliteration}
                </button>
              ))}
            </div>

            <div className="p-5 u-card space-y-4">
              <div className="text-2xl font-arabic text-emerald-600 leading-loose">
                {currentDhikr.arabic}
              </div>
              <div>
                <h3 className="text-sm font-bold">{currentDhikr.transliteration}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{currentDhikr.translation}</p>
              </div>

              <button
                type="button"
                onClick={handleTasbihTap}
                className="w-36 h-36 mx-auto rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-xl flex flex-col items-center justify-center cursor-pointer transition-transform"
              >
                <span className="text-4xl font-extrabold font-mono tabular-nums">
                  {tasbihCount}
                </span>
                <span className="text-[11px] text-emerald-100 font-mono mt-0.5">
                  / {currentDhikr.targetCount}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-emerald-200 mt-1">
                  Tap Bead
                </span>
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/70">
                <span className="font-mono">Completed Laps: {tasbihLaps}</span>
                <span className="font-mono font-bold text-emerald-600">
                  Total: {lifetimeDhikr.toLocaleString()}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound?.(640);
                    setTasbihCount(0);
                  }}
                  className="flex items-center gap-1 text-rose-500 font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 6: HISNUL MUSLIM DUAS, SEHRI/IFTAR & RUQYAH SHARIAH             */}
        {/* =================================================================== */}
        {activeTab === 'dua' && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={duaQuery}
                onChange={(e) => setDuaQuery(e.target.value)}
                placeholder="Search Sehri, Iftar, Morning Adhkar, Revert, Ruqyah..."
                className="w-full pl-9 pr-3 py-2 rounded-xl u-surface border border-slate-200/80 text-xs"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {[
                'All',
                'Sehri & Iftar',
                'Morning & Evening',
                'Salah & Wudhu',
                'Revert & Family',
                'Ruqyah & Protection',
              ].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setDuaCategory(cat)}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap cursor-pointer border ${
                    duaCategory === cat ? 'u-btn-primary border-transparent' : 'u-card'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-2.5">
              {EXTENDED_DUAS.filter((d) => {
                const matchCat = duaCategory === 'All' || d.category === duaCategory;
                const matchQ =
                  d.titleEn.toLowerCase().includes(duaQuery.toLowerCase()) ||
                  d.translationEn.toLowerCase().includes(duaQuery.toLowerCase()) ||
                  d.category.toLowerCase().includes(duaQuery.toLowerCase());
                return matchCat && matchQ;
              }).map((dua) => {
                const reps = duaRepCounts[dua.id] || 0;
                return (
                  <div key={dua.id} className="p-3.5 u-card space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="font-bold text-emerald-600">{dua.category}</span>
                      <span className="font-mono">{dua.reference}</span>
                    </div>
                    <h4 className="text-xs font-bold">{dua.titleEn}</h4>
                    <p className="text-right text-base font-arabic text-emerald-600 leading-loose">
                      {dua.arabic}
                    </p>
                    <p className="text-[11px] text-slate-500 italic">{dua.transliteration}</p>
                    <p className="text-xs leading-relaxed pt-1 border-t border-slate-200/60">
                      {dua.translationEn}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-mono text-slate-500">
                        Sunnah Target: {dua.targetReps}x
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound?.(860);
                          setDuaRepCounts((prev) => ({
                            ...prev,
                            [dua.id]: (prev[dua.id] || 0) + 1,
                          }));
                        }}
                        className="px-3 py-1 rounded-lg u-btn-primary text-[11px] font-bold cursor-pointer"
                      >
                        Recited ({reps}/{dua.targetReps})
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 7: STEP-BY-STEP REVERT SALAH & WUDHU INTERACTIVE GUIDE          */}
        {/* =================================================================== */}
        {activeTab === 'salah_guide' && (
          <div className="space-y-3.5">
            <div className="p-3.5 u-card space-y-2">
              <h3 className="text-xs font-bold">
                New Revert Step-by-Step Salah &amp; Phonetic Guide
              </h3>
              <p className="text-[11px] text-slate-500">
                Select any of the 7 postures of Salah to practice the exact Arabic recitation and meaning:
              </p>
              <div className="grid grid-cols-7 gap-1 pt-1">
                {REVERT_SALAH_STEPS.map((s) => (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => {
                      playClickSound?.(820);
                      setActiveSalahStep(s.step);
                    }}
                    className={`py-2 rounded-xl text-xs font-mono font-bold cursor-pointer border ${
                      activeSalahStep === s.step
                        ? 'u-btn-primary border-transparent'
                        : 'u-subtle border-slate-200/70'
                    }`}
                  >
                    {s.step}
                  </button>
                ))}
              </div>
            </div>

            {REVERT_SALAH_STEPS.filter((s) => s.step === activeSalahStep).map((stepObj) => (
              <div key={stepObj.step} className="p-4 u-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-emerald-600">
                    POSTURE {stepObj.step} OF 7
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePronounce(stepObj.transliteration)}
                    className="px-2.5 py-1 rounded-lg u-btn-secondary text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pronounce</span>
                  </button>
                </div>
                <h4 className="text-sm font-bold">{stepObj.title}</h4>
                <p className="text-xs text-slate-500">{stepObj.posture}</p>
                <div className="p-3 rounded-xl u-subtle text-right text-lg font-arabic text-emerald-600 leading-loose">
                  {stepObj.arabic}
                </div>
                <div className="text-xs font-bold text-emerald-600 italic">
                  &ldquo;{stepObj.transliteration}&rdquo;
                </div>
                <p className="text-xs text-slate-600 pt-1 border-t border-slate-200/70">
                  Meaning: {stepObj.meaning}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 8: 99 NAMES OF ALLAH (ASMA-UL-HUSNA)                            */}
        {/* =================================================================== */}
        {activeTab === 'sifat' && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={sifatSearch}
                onChange={(e) => setSifatSearch(e.target.value)}
                placeholder="Search Asma-ul-Husna (e.g. Ar-Rahman, Peace, Provider)..."
                className="w-full pl-9 pr-3 py-2 rounded-xl u-surface border border-slate-200/80 text-xs"
              />
            </div>

            <div className="space-y-2">
              {EXTENDED_SIFAT_NAMES.filter(
                (n) =>
                  n.transliteration.toLowerCase().includes(sifatSearch.toLowerCase()) ||
                  n.meaning.toLowerCase().includes(sifatSearch.toLowerCase())
              ).map((item) => (
                <div key={item.number} className="p-3.5 u-card space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 font-mono text-xs font-bold flex items-center justify-center">
                        {item.number}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold">{item.transliteration}</h4>
                        <span className="text-[11px] text-emerald-600 font-semibold">
                          {item.meaning}
                        </span>
                      </div>
                    </div>
                    <span className="text-lg font-arabic font-bold text-emerald-600">
                      {item.arabic}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1">{item.reflection}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 9: JAKIM HALAL E-CODES & ZAKAT FITRAH / FIDYAH CALCULATOR       */}
        {/* =================================================================== */}
        {activeTab === 'halal' && (
          <div className="space-y-4">
            {/* Zakat Fitrah & Fidyah Calculator */}
            <div className="p-3.5 u-card space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-black dark:text-white">
                    Zakat Fitrah &amp; Fidyah Calculator (MAIWP / LZS)
                  </h3>
                  <span className="text-[10px] text-slate-500">
                    Official Malaysian Rice Grade &amp; Missed Fast Assessment
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600">
                  RM {fitrahCalc.combinedObligation}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                    Household Pax (Fitrah)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={25}
                    value={fitrahDependents}
                    onChange={(e) => setFitrahDependents(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full px-2.5 py-1.5 rounded-xl u-subtle border border-slate-200/80 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                    Missed Fasts (Fidyah RM4/d)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={365}
                    value={missedFasts}
                    onChange={(e) => setMissedFasts(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-2.5 py-1.5 rounded-xl u-subtle border border-slate-200/80 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {([7, 14, 21] as const).map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setFitrahRiceRate(rate)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-mono font-bold border cursor-pointer ${
                      fitrahRiceRate === rate
                        ? 'u-btn-primary border-transparent'
                        : 'u-subtle border-slate-200/70'
                    }`}
                  >
                    RM {rate} / pax
                  </button>
                ))}
              </div>

              <div className="p-2.5 rounded-xl u-subtle text-[11px] font-mono space-y-1">
                <div className="flex justify-between">
                  <span>
                    Zakat Fitrah ({fitrahDependents} pax × RM {fitrahRiceRate}):
                  </span>
                  <span className="font-bold text-black dark:text-white">RM {fitrahCalc.fitrahTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fidyah ({missedFasts} days × RM 4):</span>
                  <span className="font-bold text-black dark:text-white">RM {fitrahCalc.fidyahTotal}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  playClickSound?.(880);
                  onAddToCart?.({
                    id: `fitrah-${Date.now()}`,
                    title: `Zakat Fitrah (${fitrahDependents} pax) & Fidyah Contribution`,
                    category: 'Zakat Fitrah & Fidyah',
                    description: fitrahCalc.riceGradeLabel,
                    price: fitrahCalc.combinedObligation,
                    imageUrl: '',
                    coordinator: 'MAIWP / LZS Amil Counter',
                    location: `${baseSnapshot.cityLabel} (${baseSnapshot.zoneCode})`,
                    rating: 5.0,
                    reviewsCount: 318,
                  });
                  setFitrahAddedToast(true);
                  setTimeout(() => setFitrahAddedToast(false), 2200);
                }}
                className="w-full py-2 rounded-xl u-btn-primary text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>
                  {fitrahAddedToast
                    ? 'Added to Infaq Basket ✓'
                    : `Add Fitrah & Fidyah (RM ${fitrahCalc.combinedObligation})`}
                </span>
              </button>
            </div>

            {/* JAKIM Halal E-Code Ingredient Checker */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold px-0.5 text-black dark:text-white">
                JAKIM Halal E-Code &amp; Food Additive Scanner
              </h3>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={eCodeQuery}
                  onChange={(e) => setECodeQuery(e.target.value)}
                  placeholder="Search E-Code or ingredient (e.g. E120, E471, Gelatine)..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl u-surface border border-slate-200/80 text-xs"
                />
              </div>

              <div className="flex gap-1.5">
                {(['All', 'Halal', 'Mushbooh', 'Haram'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setECodeFilter(status)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold cursor-pointer border ${
                      eCodeFilter === status ? 'u-btn-primary border-transparent' : 'u-card'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {EXTENDED_HARAM_CODES.filter((c) => {
                  const matchStatus = eCodeFilter === 'All' || c.status === eCodeFilter;
                  const matchQ =
                    c.code.toLowerCase().includes(eCodeQuery.toLowerCase()) ||
                    c.name.toLowerCase().includes(eCodeQuery.toLowerCase()) ||
                    c.origin.toLowerCase().includes(eCodeQuery.toLowerCase());
                  return matchStatus && matchQ;
                }).map((item) => (
                  <div key={item.code} className="p-3 u-card space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded u-subtle">
                          {item.code}
                        </span>
                        <span className="text-xs font-bold text-black dark:text-white">{item.name}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          item.status === 'Halal'
                            ? 'bg-emerald-500/15 text-emerald-600'
                            : item.status === 'Haram'
                            ? 'bg-rose-500/15 text-rose-600'
                            : 'bg-amber-500/15 text-amber-600'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-emerald-600 font-medium">
                      Origin: {item.origin}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
