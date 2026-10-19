import React, { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { ScreenId } from '../../types/screens';
import { MrmLogoBadge } from '../mobile/MrmLogo';

interface SplashScreenProps {
  onNavigate: (screen: ScreenId) => void;
  playClickSound?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onNavigate, playClickSound }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setProgress(100);
  }, []);

  return (
    <div className="relative min-h-full flex flex-col items-center justify-between p-6 u-canvas overflow-hidden select-none">
      {/* Top Status Indicator */}
      <div className="w-full pt-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-mono text-[10px] text-emerald-600 font-bold">
            VERIFIED MRM PLATFORM
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-500">v3.5.0 • KL CENTRAL</span>
      </div>

      {/* Center Official MRM Logo & Identity */}
      <div className="flex flex-col items-center justify-center my-auto text-center max-w-xs">
        <MrmLogoBadge size="lg" className="mb-5 shadow-md" />

        <span className="u-badge u-badge-brand text-[10px] mb-3">
          MULTIRACIAL REVERTED MUSLIMS
        </span>

        <h1 className="text-2xl font-extrabold tracking-tight mb-2">
          MRM Community Hub
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          Pastoral Revert Care • Direct Asnaf Relief • LHDN Audited Zakat & Infaq Ledger
        </p>

        {/* Progress Bar */}
        <div className="w-56 space-y-1.5">
          <div className="w-full h-2 u-subtle rounded-full overflow-hidden border border-slate-200/80">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>JAKIM WLY01 SYNC</span>
            <span className="text-emerald-600 font-bold">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="w-full pb-2">
        <button
          type="button"
          onClick={() => {
            playClickSound?.();
            onNavigate('onboarding');
          }}
          className="w-full min-h-[46px] py-3.5 px-4 rounded-xl u-btn-primary font-bold text-xs shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Continue to Onboarding</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
