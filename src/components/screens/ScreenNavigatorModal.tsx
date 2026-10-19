import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  Search,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { ScreenId, ALL_SCREENS_META } from '../../types/screens';

interface ScreenNavigatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  playClickSound?: () => void;
}

export const ScreenNavigatorModal: React.FC<ScreenNavigatorModalProps> = ({
  isOpen,
  onClose,
  currentScreen,
  onSelectScreen,
  playClickSound,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = [
    'All',
    'Onboarding & Auth',
    'Core Operations & Hub',
    'Welfare, Infaq & Relief',
    'Mentorship, Dawah & System',
  ];

  const filteredScreens = ALL_SCREENS_META.filter((screen) => {
    const matchesQuery =
      screen.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      screen.description.toLowerCase().includes(filterQuery.toLowerCase()) ||
      screen.number.toString().includes(filterQuery);

    const matchesCategory = activeCategory === 'All' || screen.category === activeCategory;

    return matchesQuery && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 select-none animate-fade-in">
      <div className="w-full h-[88%] sm:h-[82%] max-w-md u-card rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-4 u-surface border-b flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-extrabold leading-tight uppercase tracking-wider">
                MRM 20-Screen Master Directory
              </h2>
              <span className="text-[10px] text-emerald-600 font-mono font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Complete NGO Architecture
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound?.();
              onClose();
            }}
            className="w-8 h-8 rounded-xl u-btn-secondary flex items-center justify-center cursor-pointer"
            aria-label="Close navigator"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2.5 border-b border-slate-200/70 u-subtle">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search screen name, number or description..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl u-surface border border-slate-200/90 focus:border-emerald-600 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="px-4 py-2 flex gap-1.5 overflow-x-auto border-b border-slate-200/70 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                playClickSound?.();
                setActiveCategory(cat);
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
                activeCategory === cat
                  ? 'u-btn-primary shadow-xs'
                  : 'u-subtle border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Screens List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {filteredScreens.map((screen) => {
            const isCurrent = screen.id === currentScreen;
            return (
              <button
                key={screen.id}
                type="button"
                onClick={() => {
                  playClickSound?.();
                  onSelectScreen(screen.id);
                  onClose();
                }}
                className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer border ${
                  isCurrent
                    ? 'u-card border-emerald-600 ring-1 ring-emerald-500/30'
                    : 'u-surface border-transparent hover:border-slate-200/80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                      isCurrent
                        ? 'bg-emerald-600 text-white'
                        : 'u-subtle text-slate-600'
                    }`}
                  >
                    {screen.number}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold truncate">{screen.title}</span>
                      {isCurrent && (
                        <span className="u-badge u-badge-brand text-[9px]">ACTIVE</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {screen.description}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
              </button>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t u-surface flex items-center justify-between text-[11px] text-slate-500">
          <span>
            Showing {filteredScreens.length} of {ALL_SCREENS_META.length} screens
          </span>
          <button
            type="button"
            onClick={() => {
              playClickSound?.();
              onClose();
            }}
            className="py-1.5 px-3.5 rounded-xl u-btn-secondary font-bold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
