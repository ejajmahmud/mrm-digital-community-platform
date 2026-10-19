import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, ScanFace, Check, ArrowRight } from 'lucide-react';
import { ScreenId } from '../../types/screens';
import { MrmLogoBadge } from '../mobile/MrmLogo';

interface LoginScreenProps {
  onNavigate: (screen: ScreenId) => void;
  playClickSound?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate, playClickSound }) => {
  const [email, setEmail] = useState('razali.admin@mrm.org.my');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isFaceScanning, setIsFaceScanning] = useState(false);
  const [faceSuccess, setFaceSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleFaceId = () => {
    playClickSound?.();
    setIsFaceScanning(true);
    setTimeout(() => {
      setIsFaceScanning(false);
      setFaceSuccess(true);
      setTimeout(() => {
        onNavigate('home');
      }, 600);
    }, 900);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound?.();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onNavigate('home');
    }, 600);
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
          MRM IDENTITY GATEWAY
        </span>
        <div className="w-9" />
      </div>

      {/* Screen Title & Official MRM Logo */}
      <div className="mb-5">
        <MrmLogoBadge size="md" className="mb-3" />
        <h1 className="text-xl font-extrabold tracking-tight">Sign In to MRM</h1>
        <p className="text-xs text-slate-500 mt-1">
          Access your verified role workspace, pastoral care notes, and duty roster.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleFormSubmit} className="space-y-3.5 mb-6">
        <div>
          <label className="text-[11px] font-semibold text-slate-500 block mb-1">
            MRM ID / Registered Email:
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl u-surface border border-slate-200/90 text-xs font-mono focus:outline-hidden focus:border-emerald-600"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-semibold text-slate-500">Password:</label>
            <button
              type="button"
              onClick={() => {
                playClickSound?.();
                setResetSent(true);
              }}
              className="text-[11px] text-emerald-600 font-semibold hover:underline cursor-pointer"
            >
              {resetSent ? 'Reset Link Sent ✓' : 'Forgot Password?'}
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl u-surface border border-slate-200/90 text-xs focus:outline-hidden focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Remember me toggle */}
        <button
          type="button"
          onClick={() => setRememberMe(!rememberMe)}
          className="flex items-center gap-2 text-xs cursor-pointer pt-1"
        >
          <div
            className={`w-4 h-4 rounded-md flex items-center justify-center border ${
              rememberMe
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'border-slate-300 u-surface'
            }`}
          >
            {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Keep session active on this device
          </span>
        </button>

        {/* Primary Sign In Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full min-h-[46px] py-3 px-4 rounded-xl u-btn-primary font-bold text-xs shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Verifying Credentials...</span>
          ) : (
            <>
              <span>Authenticate & Enter Hub</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Biometric Face ID */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleFaceId}
            disabled={isFaceScanning}
            className="w-full min-h-[42px] py-2.5 px-4 rounded-xl u-btn-secondary font-semibold text-xs active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ScanFace
              className={`w-4 h-4 ${
                isFaceScanning ? 'text-emerald-600 animate-spin' : 'text-emerald-600'
              }`}
            />
            <span>
              {isFaceScanning
                ? 'Scanning Biometrics...'
                : faceSuccess
                ? 'Biometrics Verified ✓'
                : 'Biometric Face ID Sign In'}
            </span>
          </button>
        </div>
      </form>

      {/* Bottom Switch to Register */}
      <div className="pt-2 text-center text-xs text-slate-500">
        <span>Need a new MRM membership? </span>
        <button
          type="button"
          onClick={() => {
            playClickSound?.();
            onNavigate('signup');
          }}
          className="text-emerald-600 font-bold hover:underline cursor-pointer"
        >
          Register Now
        </button>
      </div>
    </div>
  );
};
