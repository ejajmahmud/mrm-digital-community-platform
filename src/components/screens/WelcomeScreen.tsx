import React, { useState } from 'react';
import { ArrowRight, Globe, ShieldCheck } from 'lucide-react';
import { ScreenId } from '../../types/screens';
import { MrmLogoBadge } from '../mobile/MrmLogo';

interface WelcomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  playClickSound?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onNavigate,
  playClickSound,
}) => {
  const [lang, setLang] = useState<'EN' | 'BM'>('EN');

  const copy = {
    EN: {
      title: 'Welcome to MRM',
      subtitle:
        'The official digital home for Multiracial Reverted Muslims — connecting new reverts with mentors, emergency halal aid, and audited Zakat.',
      volunteers: 'Volunteers',
      hampers: 'Aid Boxes',
      audited: 'LHDN Audited',
      createBtn: 'Create MRM Community Account',
      signInBtn: 'Sign In with Existing ID / IC',
      guestBtn: 'Explore Public Care & Prayer Hub as Guest',
    },
    BM: {
      title: 'Selamat Datang ke MRM',
      subtitle:
        'Platform digital rasmi Multiracial Reverted Muslims — menghubungkan saudara baru dengan mentor, bantuan asnaf halal, dan Zakat diaudit.',
      volunteers: 'Sukarelawan',
      hampers: 'Kotak Rezeki',
      audited: 'Audit LHDN',
      createBtn: 'Daftar Akaun Komuniti MRM',
      signInBtn: 'Log Masuk dengan ID / Kad Pengenalan',
      guestBtn: 'Teroka Hab Kebajikan & Waktu Solat',
    },
  }[lang];

  return (
    <div className="relative min-h-full flex flex-col justify-between p-6 u-canvas overflow-hidden select-none">
      {/* Top Bar with Working Language Switcher & Status */}
      <div className="pt-1 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => {
            playClickSound?.();
            setLang((prev) => (prev === 'EN' ? 'BM' : 'EN'));
          }}
          className="px-2.5 py-1.5 rounded-xl u-btn-secondary flex items-center gap-1.5 font-mono text-[11px] font-semibold cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-600" />
          <span>{lang === 'EN' ? 'EN / BM' : 'BM / EN'}</span>
        </button>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-600 font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>OFFICIAL MRM APP</span>
        </div>
      </div>

      {/* Hero Presentation */}
      <div className="my-auto py-4 flex flex-col items-center text-center">
        <MrmLogoBadge size="lg" className="mb-4 shadow-md" />

        <span className="u-badge u-badge-brand text-[10px] mb-2.5">
          KUALA LUMPUR • SELANGOR • PENANG
        </span>

        <h1 className="text-2xl font-extrabold tracking-tight mb-2">{copy.title}</h1>

        <p className="text-xs text-slate-500 max-w-xs leading-relaxed mb-5">
          {copy.subtitle}
        </p>

        {/* Feature quick stats */}
        <div className="w-full grid grid-cols-3 gap-2 p-3.5 u-card mb-4">
          <div className="text-center">
            <span className="block text-base font-bold font-mono">2,840+</span>
            <span className="text-[10px] text-slate-500 font-medium">
              {copy.volunteers}
            </span>
          </div>
          <div className="text-center border-x border-slate-200/70">
            <span className="block text-base font-bold text-emerald-600 font-mono">
              14,200
            </span>
            <span className="text-[10px] text-slate-500 font-medium">{copy.hampers}</span>
          </div>
          <div className="text-center">
            <span className="block text-base font-bold font-mono">100%</span>
            <span className="text-[10px] text-slate-500 font-medium">{copy.audited}</span>
          </div>
        </div>
      </div>

      {/* Bottom Auth Flow */}
      <div className="w-full space-y-2.5 pb-2">
        <button
          type="button"
          onClick={() => {
            playClickSound?.();
            onNavigate('signup');
          }}
          className="w-full min-h-[46px] py-3 px-4 rounded-xl u-btn-primary font-bold text-xs shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{copy.createBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            playClickSound?.();
            onNavigate('login');
          }}
          className="w-full min-h-[44px] py-2.5 px-4 rounded-xl u-btn-secondary font-semibold text-xs active:scale-98 transition-all cursor-pointer text-center"
        >
          {copy.signInBtn}
        </button>

        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={() => {
              playClickSound?.();
              onNavigate('home');
            }}
            className="text-xs text-emerald-600 font-semibold hover:underline cursor-pointer"
          >
            {copy.guestBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
