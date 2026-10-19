import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Globe, 
  ShieldCheck, 
  LogOut, 
  CheckCircle2, 
  Key, 
  ChevronRight
} from 'lucide-react';
import { UserRole } from '../../types';
import { SERVICE_AREAS } from '../../data/mockData';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface AccountTabProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  serviceArea: string;
  onAreaChange: (area: string) => void;
}

export const AccountTab: React.FC<AccountTabProps> = ({
  currentRole,
  onRoleChange,
  serviceArea,
  onAreaChange
}) => {
  const [contactPref, setContactPref] = useState('In-app safe messaging');
  const [languages, setLanguages] = useState('English, Bahasa Melayu');
  const [locationConsent, setLocationConsent] = useState(true);
  const [safeNotifs, setSafeNotifs] = useState(true);
  const [genderMatchingPref, setGenderMatchingPref] = useState('Strict Same-Gender Volunteer');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'member': return 'Muslim Member';
      case 'seeker': return 'Support Seeker';
      case 'volunteer_applicant': return 'Volunteer Applicant';
      case 'approved_volunteer': return 'Approved Volunteer';
      case 'approved_teacher': return 'Approved Teacher';
      case 'staff_admin': return 'MRM Staff Coordinator';
    }
  };

  return (
    <div className="space-y-3.5 pb-20">
      {/* Top Banner matching Slide 12 */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
              MEMBERSHIP
            </span>
            <Badge variant="default" className="text-[11px] font-medium">
              Active Session
            </Badge>
          </div>

          <div className="flex items-center gap-3.5 pt-1">
            <div className="w-12 h-12 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-lg">
              {currentRole === 'staff_admin' ? 'A' : currentRole === 'approved_teacher' ? 'U' : 'M'}
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900">
                {currentRole === 'staff_admin' 
                  ? 'Admin Demo' 
                  : currentRole === 'approved_volunteer' 
                  ? 'Ahmad Faisal' 
                  : currentRole === 'approved_teacher'
                  ? 'Ustazah Hana Yusof'
                  : 'Community Member'}
              </h1>
              <p className="text-xs text-slate-500">
                {currentRole === 'staff_admin' ? 'admin@mrm.local' : 'member@mrm.community'}
              </p>
              <div className="pt-1">
                <Badge variant="secondary" className="text-[11px]">
                  {getRoleLabel(currentRole)}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Switcher Sandbox (Slide 3 & 12) */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-4 space-y-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Authorised Role Simulator
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Switch roles to experience the tailored permission levels across MRM service journeys.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'member', label: 'Muslim Member' },
              { id: 'seeker', label: 'Support Seeker' },
              { id: 'approved_volunteer', label: 'Approved Volunteer' },
              { id: 'approved_teacher', label: 'Approved Teacher' },
              { id: 'staff_admin', label: 'Staff / Admin' },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => onRoleChange(r.id as UserRole)}
                className={`p-2.5 rounded-xl text-xs font-medium text-left border transition-all cursor-pointer ${
                  currentRole === r.id
                    ? 'bg-emerald-800 text-white border-emerald-800 font-semibold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Member Preferences (Page 12 Screenshot replica) */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Member Preferences
          </h2>

          <div className="space-y-1">
            <label className="text-xs text-slate-700 font-medium">Service Area</label>
            <select
              value={serviceArea}
              onChange={(e) => onAreaChange(e.target.value)}
              className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {SERVICE_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-700 font-medium">Contact Preference</label>
            <select
              value={contactPref}
              onChange={(e) => setContactPref(e.target.value)}
              className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="In-app safe messaging">In-app safe messaging (Recommended)</option>
              <option value="WhatsApp discreet message">WhatsApp discreet message</option>
              <option value="Phone call (Daytime)">Phone call (Daytime)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-700 font-medium">Preferred Languages</label>
            <Input
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
            />
          </div>

          <Button
            onClick={handleSave}
            className="w-full mt-2"
          >
            Save Preferences
          </Button>

          {showSavedToast && (
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl text-xs text-center border border-emerald-200 font-medium">
              ✓ Preferences updated successfully.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Consent & Privacy Controls (Slide 12) */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Consent & Permissions
          </h2>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-slate-900">Manual Area Selection</p>
              <p className="text-[11px] text-slate-500">Does not track live GPS location</p>
            </div>
            <input
              type="checkbox"
              checked={locationConsent}
              onChange={(e) => setLocationConsent(e.target.checked)}
              className="w-4 h-4 accent-emerald-700 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-slate-900">Privacy-Safe Notifications</p>
              <p className="text-[11px] text-slate-500">Keeps sensitive case details private</p>
            </div>
            <input
              type="checkbox"
              checked={safeNotifs}
              onChange={(e) => setSafeNotifs(e.target.checked)}
              className="w-4 h-4 accent-emerald-700 rounded cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>

      {/* Emergency & Support lines */}
      <div className="p-4 bg-slate-100 rounded-2xl space-y-1.5 text-xs text-slate-600">
        <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
          Community Resources
        </p>
        <p>• Emergency: <strong>999</strong></p>
        <p>• Befrienders KL: <strong>+60 3-7627 2929</strong></p>
        <p>• Talian Kasih: <strong>15999</strong></p>
      </div>

      <Button
        variant="outline"
        onClick={() => alert('Signed out of demo session.')}
        className="w-full text-slate-600 hover:text-rose-600 hover:border-rose-200"
      >
        <LogOut className="w-4 h-4 mr-2" /> Sign Out
      </Button>
    </div>
  );
};
