import React, { useState } from 'react';
import {
  Search,
  X,
  Mic,
  Clock,
  MapPin,
  Building2,
  HeartHandshake,
  ChevronRight,
  BookOpen,
  Sparkles,
  Calculator,
} from 'lucide-react';
import { ScreenId } from '../../types/screens';
import { UtilityTabId } from '../../data/islamicUtilitiesData';
import { getLocationSyncSnapshot } from '../../utils/mrmLogic';

interface SearchScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenUtility?: (tab: UtilityTabId) => void;
  selectedZone?: string;
  playClickSound?: () => void;
}

interface SearchResultItem {
  id: string;
  title: string;
  category: string;
  location: string;
  type: 'mosque' | 'service' | 'revert' | 'quran' | 'dua' | 'halal';
  meta: string;
  targetScreen?: ScreenId;
  targetUtility?: UtilityTabId;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  onNavigate,
  onOpenUtility,
  selectedZone = 'WLY01 - Kuala Lumpur & Putrajaya',
  playClickSound,
}) => {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [recentSearches, setRecentSearches] = useState([
    'Surah Al-Fatihah Tajweed',
    'Sehri & Iftar Duas',
    'E471 Halal Status',
    'Masjid Wilayah Persekutuan',
  ]);
  const [isListening, setIsListening] = useState(false);

  const locationSnap = getLocationSyncSnapshot(selectedZone);
  const nearestMosque = locationSnap.nearbyFacilities[0];

  const sampleItems: SearchResultItem[] = [
    {
      id: 'item-1',
      title: locationSnap.hubName,
      category: `Verified Mosque Hub · ${locationSnap.zoneCode}`,
      location: `${locationSnap.cityLabel} (${nearestMosque?.distanceKm ?? 1.2} km away)`,
      type: 'mosque',
      meta: `Next: ${locationSnap.nextPrayerInfo.nextPrayer.name} ${locationSnap.nextPrayerInfo.nextPrayer.time24} · Qibla ${locationSnap.qibla.bearingDegrees}° ${locationSnap.qibla.cardinalDirection}`,
      targetScreen: 'calendar_booking',
    },
    {
      id: 'item-quran-1',
      title: 'Surah Al-Fatihah & Al-Mulk (Color-Coded Tajweed)',
      category: 'Tajweed Quran & Audio',
      location: 'Qari Mishary Rashid Alafasy · EN & BM',
      type: 'quran',
      meta: 'Ghunnah, Ikhfa, Idgham, Qalqalah & Madd rules highlighted',
      targetUtility: 'quran',
    },
    {
      id: 'item-dua-1',
      title: 'Sehri Niyyah, Iftar Dua & Sayyidul Istighfar',
      category: 'Hisnul Muslim & Ruqyah',
      location: 'Arabic · Transliteration · Sahih Hadith',
      type: 'dua',
      meta: 'Includes Morning/Evening Protection Shield & Revert Duas',
      targetUtility: 'dua',
    },
    {
      id: 'item-halal-1',
      title: 'JAKIM E-Code Scanner (E120 Carmine, E471, E441 Gelatine)',
      category: 'Halal Additive Verifier',
      location: 'MS 1500:2019 · Fitrah & Fidyah Calc',
      type: 'halal',
      meta: 'Instant Halal, Mushbooh & Haram ingredient verification',
      targetUtility: 'halal',
    },
    {
      id: 'item-2',
      title: 'Emergency Asnaf Halal Grocery Care Box',
      category: 'Food Aid & Essentials',
      location: `${locationSnap.cityLabel} & Regional Dispatch`,
      type: 'service',
      meta: 'Dispatched in 2-4 hours · Free for eligible asnaf',
      targetScreen: 'catalog',
    },
    {
      id: 'item-3',
      title: 'Step-by-Step Revert Salah & 7 Posture Phonetic Guide',
      category: 'Revert Education',
      location: 'Takbir, Qiyam, Ruku, Sujud & Tashahhud',
      type: 'revert',
      meta: 'Interactive audio pronunciation & 1-on-1 mentor pairing',
      targetUtility: 'salah_guide',
    },
  ];

  const categories = ['All', 'Mosques', 'Quran & Tajweed', 'Duas & Ruqyah', 'Halal E-Codes', 'Revert Care'];

  const filteredItems = sampleItems.filter((item) => {
    const matchesQuery =
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      item.location.toLowerCase().includes(query.toLowerCase()) ||
      item.meta.toLowerCase().includes(query.toLowerCase());

    const matchesCategory =
      categoryFilter === 'All' ||
      (categoryFilter === 'Mosques' && item.type === 'mosque') ||
      (categoryFilter === 'Quran & Tajweed' && item.type === 'quran') ||
      (categoryFilter === 'Duas & Ruqyah' && item.type === 'dua') ||
      (categoryFilter === 'Halal E-Codes' && item.type === 'halal') ||
      (categoryFilter === 'Revert Care' && (item.type === 'revert' || item.type === 'service'));

    return matchesQuery && matchesCategory;
  });

  const handleVoiceSim = () => {
    playClickSound?.();
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setQuery('Tajweed');
    }, 900);
  };

  const clearRecent = (search: string) => {
    playClickSound?.();
    setRecentSearches((prev) => prev.filter((s) => s !== search));
  };

  return (
    <div className="relative min-h-full flex flex-col p-4 u-canvas pb-28 select-none space-y-3.5">
      {/* Search Input Box */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Quran, Duas, E-Codes, Mosques, Revert Care..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl u-surface border border-slate-200/90 text-xs focus:outline-hidden focus:border-emerald-600 shadow-2xs"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              playClickSound?.();
              setQuery('');
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleVoiceSim}
            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer ${
              isListening ? 'text-emerald-600 animate-pulse' : 'text-slate-400'
            }`}
            title="Voice Search"
            aria-label="Voice Search"
          >
            <Mic className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Categories */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = categoryFilter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                playClickSound?.();
                setCategoryFilter(cat);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                isSelected
                  ? 'u-btn-primary shadow-xs'
                  : 'u-card hover:border-emerald-500/40'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Recent Searches */}
      {!query && recentSearches.length > 0 && (
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
            <span>Recent Searches</span>
            <button
              type="button"
              onClick={() => {
                playClickSound?.();
                setRecentSearches([]);
              }}
              className="text-emerald-600 hover:underline font-semibold cursor-pointer"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-1.5">
            {recentSearches.map((term) => (
              <div
                key={term}
                onClick={() => {
                  playClickSound?.();
                  setQuery(term);
                }}
                className="p-2.5 u-card flex items-center justify-between cursor-pointer hover:border-emerald-500/40 transition-all text-xs"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium">{term}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearRecent(term);
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                  aria-label={`Remove ${term}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Verified Directory ({filteredItems.length})
          </span>
          <span className="text-[10px] font-mono text-emerald-600 font-semibold">
            Synced: {locationSnap.zoneCode}
          </span>
        </div>

        <div className="space-y-2.5">
          {filteredItems.map((item) => {
            const IconComponent =
              item.type === 'mosque'
                ? Building2
                : item.type === 'quran'
                ? BookOpen
                : item.type === 'dua'
                ? Sparkles
                : item.type === 'halal'
                ? Calculator
                : item.type === 'service'
                ? HeartHandshake
                : BookOpen;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  playClickSound?.();
                  if (item.targetUtility && onOpenUtility) {
                    onOpenUtility(item.targetUtility);
                  } else if (item.targetScreen) {
                    onNavigate(item.targetScreen);
                  }
                }}
                className="w-full p-3.5 u-card u-card-hover flex items-start gap-3 text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>
                  <h3 className="text-xs font-bold mt-0.5 leading-snug">{item.title}</h3>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-1">{item.meta}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
