import React from 'react';
import {
  Settings,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { ScreenId } from '../../types/screens';
import { UserRole } from '../../types';
import { ROLE_CONFIGS, RoleConfig } from '../../types/roleConfig';

interface ProfileScreenProps {
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
  onNavigate: (screen: ScreenId) => void;
  playClickSound?: (freq?: number) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentRole = 'staff_admin',
  onRoleChange,
  onNavigate,
  playClickSound,
}) => {
  const roleMeta: RoleConfig = ROLE_CONFIGS[currentRole] || ROLE_CONFIGS.staff_admin;

  return (
    <div className="relative min-h-full flex flex-col p-4 u-canvas pb-28 select-none space-y-4">
      {/* Profile Identity Card */}
      <div className="p-4 u-card text-center relative">
        <button
          type="button"
          onClick={() => {
            playClickSound?.();
            onNavigate('settings');
          }}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-xl u-btn-secondary flex items-center justify-center cursor-pointer"
          aria-label="Open Settings"
          title="App Settings & Theme"
        >
          <Settings className="w-4 h-4" />
        </button>

        <div className="relative w-20 h-20 mx-auto mb-3">
          <img
            src={roleMeta.avatarUrl}
            alt={roleMeta.name}
            className="w-full h-full rounded-2xl object-cover ring-2 ring-emerald-500 shadow-sm"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-2 ring-white">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>

        <h2 className="text-base font-extrabold">{roleMeta.name}</h2>
        <div className="mt-1">
          <span className="u-badge u-badge-brand text-[10px]">
            {roleMeta.badgeText}
          </span>
        </div>

        <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto">
          {roleMeta.subtitle} • ID: {roleMeta.idNumber}
        </p>

        <div className="mt-2.5 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-600" />
            Kuala Lumpur
          </span>
          <span>·</span>
          <span className="text-emerald-600 font-bold">Verified MRM Credential</span>
        </div>
      </div>

      {/* Role-Specific Metrics */}
      <div className="grid grid-cols-3 gap-2">
        {currentRole === 'staff_admin' && (
          <>
            <div className="p-3 u-card text-center">
              <span className="block text-base font-bold font-mono">1,420</span>
              <span className="text-[10px] text-slate-500 font-semibold">Cases Managed</span>
            </div>
            <div className="p-3 u-card text-center">
              <span className="block text-base font-bold text-emerald-600 font-mono">
                94.2%
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">SLA Target</span>
            </div>
            <div className="p-3 u-card text-center">
              <span className="block text-base font-bold text-amber-600 font-mono">L4</span>
              <span className="text-[10px] text-slate-500 font-semibold">Clearance</span>
            </div>
          </>
        )}
        {currentRole === 'approved_volunteer' && (
          <>
            <div className="p-3 u-card text-center">
              <span className="block text-base font-bold font-mono">64h</span>
              <span className="text-[10px] text-slate-500 font-semibold">Hours Logged</span>
            </div>
            <div className="p-3 u-card text-center">
              <span className="block text-base font-bold text-emerald-600 font-mono">48</span>
              <span className="text-[10px] text-slate-500 font-semibold">Missions</span>
            </div>
            <div className="p-3 u-card text-center">
              <span className="block text-base font-bold text-amber-600 font-mono">
                4.98★
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">Rating</span>
            </div>
          </>
        )}
        {currentRole === 'seeker' && (
          <>
            <div className="p-3 u-card text-center">
              <span className="block text-base font-bold font-mono">3</span>
              <span className="text-[10px] text-slate-500 font-semibold">Aids Received</span>
            </div>
            <div className="p-3 u-card text-center">
              <span className="block text-base font-bold text-emerald-600 font-mono">1</span>
              <span className="text-[10px] text-slate-500 font-semibold">Active Mentor</span>
            </div>
            <div className="p-3 u-card text-center">
              <span className="block text-base font-bold text-rose-600 font-mono">
                Safe
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">Privacy Tier</span>
            </div>
          </>
        )}
        {currentRole === 'approved_teacher' && (
          <>
            <div className="p-3 u-card text-center">
              <span className="block text-base font-bold font-mono">86</span>
              <span className="text-[10px] text-slate-500 font-semibold">Students</span>
            </div>
            <div className="p-3 u-card text-center">
              <span className="block text-base font-bold text-amber-600 font-mono">
                112h
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">Mentoring</span>
            </div>
            <div className="p-3 u-card text-center">
              <span className="block text-base font-bold text-emerald-600 font-mono">
                Syariah
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">Accredited</span>
            </div>
          </>
        )}
        {currentRole === 'volunteer_applicant' && (
          <>
            <div className="p-3 u-card text-center">
              <span className="block text-base font-bold text-amber-600 font-mono">
                75%
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">Vetting</span>
            </div>
            <div className="p-3 u-card text-center">
              <span className="block text-base font-bold font-mono">1/3</span>
              <span className="text-[10px] text-slate-500 font-semibold">Modules</span>
            </div>
            <div className="p-3 u-card text-center">
              <span className="block text-base font-bold text-emerald-600 font-mono">
                SKP
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">Doc Status</span>
            </div>
          </>
        )}
        {currentRole === 'member' && (
          <>
            <div className="p-3 u-card text-center">
              <span className="block text-base font-bold text-emerald-600 font-mono">
                RM 2,450
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">Total Infaq</span>
            </div>
            <div className="p-3 u-card text-center">
              <span className="block text-base font-bold font-mono">18</span>
              <span className="text-[10px] text-slate-500 font-semibold">Boxes Funded</span>
            </div>
            <div className="p-3 u-card text-center">
              <span className="block text-base font-bold text-amber-600 font-mono">
                Gold
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">Contributor</span>
            </div>
          </>
        )}
      </div>

      {/* Role Switcher Matrix */}
      <div className="p-3.5 u-card">
        <div className="flex items-center justify-between text-xs font-bold mb-2.5">
          <span>Switch Operating Role Persona</span>
          <span className="text-[10px] text-slate-500 font-mono">6 ROLES</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(ROLE_CONFIGS) as UserRole[]).map((rKey) => {
            const cfg = ROLE_CONFIGS[rKey];
            const isSelected = currentRole === rKey;
            return (
              <button
                key={rKey}
                type="button"
                onClick={() => {
                  playClickSound?.(850);
                  onRoleChange?.(rKey);
                }}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'u-btn-primary shadow-xs'
                    : 'u-subtle border-slate-200/80 hover:border-emerald-500/40'
                }`}
              >
                <img
                  src={cfg.avatarUrl}
                  alt={cfg.name}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[11px] font-bold truncate">{cfg.shortLabel}</div>
                  <div
                    className={`text-[9px] truncate ${
                      isSelected ? 'text-emerald-50' : 'text-slate-500'
                    }`}
                  >
                    {cfg.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Account Rows & Settings Shortcut */}
      <div className="u-card divide-y divide-slate-200/70 overflow-hidden">
        <div className="p-3.5 flex items-center justify-between text-xs">
          <span className="text-slate-500">Assigned Operations Sector</span>
          <span className="font-bold">Sentul / Wilayah Persekutuan</span>
        </div>
        <div className="p-3.5 flex items-center justify-between text-xs">
          <span className="text-slate-500">Security & Biometrics</span>
          <span className="font-bold text-emerald-600 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Face ID Active
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            playClickSound?.();
            onNavigate('settings');
          }}
          className="w-full p-3.5 flex items-center justify-between text-xs hover:bg-slate-500/5 cursor-pointer text-left"
        >
          <span className="font-bold text-emerald-600">
            Open Theme, JAKIM Zone & Privacy Settings
          </span>
          <ChevronRight className="w-4 h-4 text-emerald-600" />
        </button>
      </div>
    </div>
  );
};
