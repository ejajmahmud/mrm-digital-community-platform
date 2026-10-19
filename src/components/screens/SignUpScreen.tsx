import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Lock, Phone, Check } from 'lucide-react';
import { ScreenId } from '../../types/screens';
import { MrmLogoBadge } from '../mobile/MrmLogo';

interface SignUpScreenProps {
  onNavigate: (screen: ScreenId) => void;
  playClickSound?: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ onNavigate, playClickSound }) => {
  const [role, setRole] = useState<'community' | 'volunteer' | 'seeker' | 'scholar'>('seeker');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound?.();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onNavigate('home');
    }, 800);
  };

  return (
    <div className="relative min-h-full flex flex-col justify-between p-6 u-canvas overflow-y-auto select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between pt-1 pb-3">
        <button
          type="button"
          onClick={() => {
            playClickSound?.();
            onNavigate('welcome');
          }}
          className="w-9 h-9 rounded-xl u-btn-secondary flex items-center justify-center cursor-pointer"
          aria-label="Back to welcome"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-[11px] font-mono font-bold text-slate-500">
          MRM REGISTRATION
        </span>
        <div className="w-9" />
      </div>

      {/* Screen Title & Official MRM Logo */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <MrmLogoBadge size="sm" />
          <div>
            <h1 className="text-lg font-extrabold tracking-tight">Create MRM Account</h1>
            <p className="text-[11px] text-slate-500">
              Join the multiracial revert network for care & dawah.
            </p>
          </div>
        </div>
      </div>

      {/* Role Picker */}
      <div className="mb-4">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
          Select Your Participation Track:
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'seeker', title: 'New Revert / Seeker', desc: 'Pastoral Care & Mentors' },
            { id: 'volunteer', title: 'Volunteer Responder', desc: 'Field Squad & Dispatches' },
            { id: 'community', title: 'Community Member', desc: 'Prayer, Infaq & Events' },
            { id: 'scholar', title: 'Scholar / Mentor', desc: 'Counseling & Teaching' },
          ].map((opt) => {
            const isSelected = role === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  playClickSound?.();
                  setRole(opt.id as any);
                }}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'u-btn-primary shadow-xs'
                    : 'u-card hover:border-emerald-500/40'
                }`}
              >
                <div className="text-xs font-bold">{opt.title}</div>
                <div
                  className={`text-[10px] mt-0.5 ${
                    isSelected ? 'text-emerald-50' : 'text-slate-500'
                  }`}
                >
                  {opt.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-4">
        <div>
          <label className="text-[11px] font-semibold text-slate-500 block mb-1">
            Full Legal Name (as per NRIC / Passport):
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Brother Jason M. / Muhammad Daniel"
              className="w-full pl-9 pr-3 py-2 rounded-xl u-surface border border-slate-200/90 text-xs focus:outline-hidden focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">
              Email Address:
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                className="w-full pl-8 pr-2.5 py-2 rounded-xl u-surface border border-slate-200/90 text-xs focus:outline-hidden focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">
              WhatsApp / Mobile:
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+60 12-345 6789"
                className="w-full pl-8 pr-2.5 py-2 rounded-xl u-surface border border-slate-200/90 text-xs font-mono focus:outline-hidden focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-500 block mb-1">
            Password:
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-3 py-2 rounded-xl u-surface border border-slate-200/90 text-xs focus:outline-hidden focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Confidentiality Commitment */}
        <button
          type="button"
          onClick={() => setAgreed(!agreed)}
          className="w-full p-3 u-card flex items-start gap-2.5 text-left cursor-pointer"
        >
          <div
            className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
              agreed
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'border-slate-300 u-surface'
            }`}
          >
            {agreed && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <span className="text-[11px] text-slate-500 leading-snug">
            I agree to the MRM Pastoral Code of Conduct & PDPA Malaysian Confidentiality Charter.
          </span>
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !agreed}
          className="w-full min-h-[46px] py-3 px-4 rounded-xl u-btn-primary font-bold text-xs shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>
            {isSubmitting ? 'Securing Credentials...' : 'Complete Registration'}
          </span>
        </button>
      </form>

      {/* Bottom Switch to Login */}
      <div className="pt-1 text-center text-xs text-slate-500">
        <span>Already have an MRM profile? </span>
        <button
          type="button"
          onClick={() => {
            playClickSound?.();
            onNavigate('login');
          }}
          className="text-emerald-600 font-bold hover:underline cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};
