import React, { useState } from 'react';
import { 
  X, 
  Coins, 
  Building2, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { ZakatReferral } from '../../../types';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';

interface ZakatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReferral: (ref: Partial<ZakatReferral>) => void;
}

export const ZakatModal: React.FC<ZakatModalProps> = ({ isOpen, onClose, onSubmitReferral }) => {
  const [region, setRegion] = useState('Selangor (Petaling Jaya)');
  const [authority, setAuthority] = useState('Lembaga Zakat Selangor (LZS)');
  const [memberName, setMemberName] = useState('');
  const [phone, setPhone] = useState('');
  const [need, setNeed] = useState('');
  const [consent, setConsent] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [refId, setRefId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent || !need.trim()) return;

    const newRef = `MY-ZKT-2026-00${Math.floor(10 + Math.random() * 90)}`;
    setRefId(newRef);

    onSubmitReferral({
      reference: newRef,
      memberName: memberName || 'Sister / Brother (Confidential)',
      needDescription: need,
      region,
      stateAuthority: authority,
      contactPhone: phone || '+60 1x-xxx xxxx',
      status: 'submitted',
      submittedDate: 'Today',
      consentGiven: true,
      notes: 'Initial institutional intake completed. Transmitted to state liaison desk.'
    });

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-emerald-800">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Zakat Referral Service</h2>
              <p className="text-xs text-slate-500">Institutional handoff, not an eligibility decision</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-slate-900">Referral Docket Registered</h3>
                <p className="text-xs text-slate-500">Case Reference: <span className="text-emerald-800 font-mono font-bold">{refId}</span></p>
              </div>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                MRM has created an official referral file for {authority}. Our institutional coordinator will confirm receipt with the state zakat office.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl text-left border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Institutional Protocol</p>
                <p className="text-[11px] text-slate-500">MRM acts solely as a referral advocate. Disbursement and eligibility assessments remain with the statutory state authority.</p>
              </div>
              <Button
                onClick={() => { setIsSubmitted(false); onClose(); }}
                className="w-full mt-2"
              >
                Back to Services
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <Building2 className="w-4 h-4 text-emerald-800" /> State Zakat Liaison
                </div>
                <p className="text-slate-500 leading-normal">
                  MRM coordinates referrals with accredited state zakat bodies (e.g. LZS, PPZ-MAIWP) to assist reverts and families with housing, medical, and basic living support.
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">State Zakat Institution</label>
                <select
                  value={authority}
                  onChange={(e) => {
                    setAuthority(e.target.value);
                    if (e.target.value.includes('Selangor')) setRegion('Selangor (Petaling Jaya)');
                    else if (e.target.value.includes('MAIWP')) setRegion('Kuala Lumpur');
                  }}
                  className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                >
                  <option value="Lembaga Zakat Selangor (LZS)">Lembaga Zakat Selangor (LZS)</option>
                  <option value="Pusat Pungutan Zakat MAIWP (Kuala Lumpur)">Pusat Pungutan Zakat MAIWP (Kuala Lumpur)</option>
                  <option value="Majlis Agama Islam Negeri (Other States)">Majlis Agama Islam Negeri (Other States)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Full Name</label>
                <Input
                  required
                  placeholder="e.g. Jason Tan Abdullah"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Safe Phone Number</label>
                <Input
                  required
                  placeholder="+60 1x-xxx xxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Nature of Assistance Needed</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Rental aid, medical rehabilitation supplies, single parent living assistance..."
                  value={need}
                  onChange={(e) => setNeed(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 resize-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="zakatConsent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-emerald-700 cursor-pointer rounded"
                />
                <label htmlFor="zakatConsent" className="text-[11px] text-slate-600 cursor-pointer leading-normal">
                  I give explicit consent for MRM to share this summary and contact information with the authorized state zakat council for formal processing.
                </label>
              </div>

              <Button
                type="submit"
                disabled={!consent}
                className="w-full h-11 mt-2"
              >
                Submit for Referral Review
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
