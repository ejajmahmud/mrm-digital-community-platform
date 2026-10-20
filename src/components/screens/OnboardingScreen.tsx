import React, { useState } from 'react';
import { ArrowRight, Check, ShieldCheck, HeartHandshake, Users } from 'lucide-react';
import { ScreenId } from '../../types/screens';
import { MrmLogoBadge } from '../mobile/MrmLogo';

interface OnboardingScreenProps {
  onNavigate: (screen: ScreenId) => void;
  playClickSound?: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onNavigate,
  playClickSound,
}) => {
  const [currentSlide, setCurrentSlide] = useState(() => {
    if (typeof window !== 'undefined') {
      const s = Number(new URLSearchParams(window.location.search).get('slide'));
      if (s === 1 || s === 2) return s;
    }
    return 0;
  });

  const slides = [
    {
      title: 'Real-Time Revert Pastoral Care',
      subtitle:
        'Instant 1-on-1 brother & sister mentorship, confidential safe shelter, and free bilingual Quran starter kits.',
      tag: 'Revert First',
      icon: <HeartHandshake className="w-7 h-7 text-emerald-600" />,
      features: [
        'Direct connection to certified revert mentors',
        'Confidential safety & family transition support',
        'Free Noble Quran & pictorial solat guide',
      ],
    },
    {
      title: 'Audited Welfare & Direct Asnaf Aid',
      subtitle:
        'Transparent halal grocery hamper dispatches and monthly stipends audited by MRM Welfare Board & LHDN.',
      tag: '100% Tax Deductible',
      icon: <ShieldCheck className="w-7 h-7 text-emerald-600" />,
      features: [
        'Official LHDN Section 44(6) tax exemption receipts',
        'Direct bank disbursement to single mother reverts',
        'Real-time food hamper GPS delivery tracking',
      ],
    },
    {
      title: 'Unified Mosque & Volunteer Squad',
      subtitle:
        'Join Skuad Sukarelawan MRM for emergency relief, soup kitchens, and compassionate dawah outreach.',
      tag: 'Field Volunteers',
      icon: <Users className="w-7 h-7 text-emerald-600" />,
      features: [
        'Accurate JAKIM prayer times & Qibla compass',
        'One-tap volunteer mission dispatch check-in',
        'Direct encrypted chat with regional coordinators',
      ],
    },
  ];

  const slide = slides[currentSlide];

  const handleNext = () => {
    playClickSound?.();
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onNavigate('welcome');
    }
  };

  return (
    <div className="relative min-h-full flex flex-col justify-between p-6 u-canvas overflow-hidden select-none">
      {/* Top Header / Skip */}
      <div className="flex items-center justify-between pt-1">
        <MrmLogoBadge size="sm" />
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-slate-500 font-semibold">
            {currentSlide + 1} / {slides.length}
          </span>
          <button
            type="button"
            onClick={() => {
              playClickSound?.();
              onNavigate('welcome');
            }}
            className="text-xs font-semibold py-1.5 px-3 rounded-xl u-btn-secondary cursor-pointer"
          >
            Skip
          </button>
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="my-auto py-4 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
          {slide.icon}
        </div>

        <span className="u-badge u-badge-brand text-[10px] mb-2.5">
          {slide.tag.toUpperCase()}
        </span>

        <h2 className="text-xl font-extrabold tracking-tight mb-2">{slide.title}</h2>

        <p className="text-xs text-slate-500 max-w-xs leading-relaxed mb-5">
          {slide.subtitle}
        </p>

        {/* Features Checklist */}
        <div className="w-full p-4 u-card space-y-2.5 mb-5 text-left">
          {slide.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs">
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[2.5]" />
              </div>
              <span className="text-xs font-medium">{feature}</span>
            </div>
          ))}
        </div>

        {/* Interactive Stepper Dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                playClickSound?.();
                setCurrentSlide(i);
              }}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === i ? 'w-7 bg-emerald-600' : 'w-2 bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Button */}
      <div className="w-full pb-20">
        <button
          type="button"
          onClick={handleNext}
          className="w-full min-h-[46px] py-3.5 px-4 rounded-xl u-btn-primary font-bold text-xs shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next Mission Pillar'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
