import React, { useState } from 'react';
import {
  RotateCw,
  Inbox,
  WifiOff,
  Check,
  ArrowRight,
} from 'lucide-react';
import { ScreenId } from '../../types/screens';

interface EmptyLoadingErrorScreenProps {
  onNavigate: (screen: ScreenId) => void;
  playClickSound?: () => void;
}

export const EmptyLoadingErrorScreen: React.FC<EmptyLoadingErrorScreenProps> = ({
  onNavigate,
  playClickSound,
}) => {
  const [activeState, setActiveState] = useState<'loading' | 'empty' | 'error'>(() => {
    if (typeof window !== 'undefined') {
      const s = new URLSearchParams(window.location.search).get('state');
      if (s === 'empty' || s === 'error') return s;
    }
    return 'loading';
  });
  const [isRetrying, setIsRetrying] = useState(false);
  const [recovered, setRecovered] = useState(false);

  const handleRetry = () => {
    playClickSound?.();
    setIsRetrying(true);
    setRecovered(false);
    setTimeout(() => {
      setIsRetrying(false);
      setRecovered(true);
      setTimeout(() => setRecovered(false), 2500);
    }, 900);
  };

  return (
    <div className="relative min-h-full flex flex-col justify-between p-4 u-canvas pb-28 select-none">
      {/* State Switcher Pills */}
      <div className="mb-4 p-1 rounded-xl u-subtle border border-slate-200/80 grid grid-cols-3 gap-1">
        {(['loading', 'empty', 'error'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              playClickSound?.();
              setActiveState(s);
            }}
            className={`py-2 text-xs font-bold rounded-lg capitalize transition-all cursor-pointer ${
              activeState === s
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {s} State
          </button>
        ))}
      </div>

      {/* Main State Canvas */}
      <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
        {activeState === 'loading' && (
          <div className="w-full max-w-xs space-y-4 animate-fade-in">
            <div className="w-full p-4 u-card space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl u-subtle animate-pulse shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 u-subtle rounded-md w-3/4 animate-pulse" />
                  <div className="h-2 u-subtle rounded-md w-1/2 animate-pulse" />
                </div>
              </div>
              <div className="h-2 u-subtle rounded-md w-full animate-pulse" />
              <div className="h-2 u-subtle rounded-md w-4/5 animate-pulse" />
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-mono">
              <RotateCw className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Syncing JAKIM Prayer API & Zakat Ledger...</span>
            </div>
          </div>
        )}

        {activeState === 'empty' && (
          <div className="w-full max-w-xs p-6 u-card space-y-3 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl u-subtle text-slate-500 mx-auto flex items-center justify-center">
              <Inbox className="w-7 h-7" />
            </div>
            <h2 className="text-sm font-bold">No Active Care Missions</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              All Asnaf grocery dispatches in your sector have been completed by Skuad Sukarelawan.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('catalog')}
              className="py-2.5 px-4 rounded-xl u-btn-primary font-bold text-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Explore Infaq Campaigns</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {activeState === 'error' && (
          <div className="w-full max-w-xs p-6 u-card space-y-3 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-600 mx-auto flex items-center justify-center">
              <WifiOff className="w-7 h-7" />
            </div>
            <h2 className="text-sm font-bold">Network Connection Interrupted</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Unable to reach MRM National Operations gateway. Offline prayer times and cached Quran chapters remain accessible.
            </p>

            {recovered ? (
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-xs text-emerald-700 font-bold flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Reconnected to KL Gateway</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleRetry}
                disabled={isRetrying}
                className="w-full py-2.5 px-4 rounded-xl u-btn-primary font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                <span>
                  {isRetrying ? 'Retrying Connection...' : 'Reconnect Gateway'}
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer Return Action */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={() => {
            playClickSound?.();
            onNavigate('home');
          }}
          className="text-xs text-emerald-600 font-semibold hover:underline cursor-pointer"
        >
          Return to MRM Operations Hub
        </button>
      </div>
    </div>
  );
};
