import React, { useState } from 'react';
import { 
  X, 
  HeartHandshake, 
  ShieldAlert, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Lock 
} from 'lucide-react';
import { HelpRequest, HelpCategory, HelpUrgency } from '../../../types';
import { SERVICE_AREAS } from '../../../data/mockData';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

interface HelpRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Partial<HelpRequest>) => void;
}

export const HelpRequestModal: React.FC<HelpRequestModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [category, setCategory] = useState<HelpCategory>('revert_support');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<HelpUrgency>('routine');
  const [area, setArea] = useState('Kuala Lumpur');
  const [contactPreference, setContactPreference] = useState<'in_app' | 'whatsapp' | 'phone'>('in_app');
  const [contactValue, setContactValue] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedRef, setGeneratedRef] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !summary.trim()) return;

    const ref = `REQ-2026-${Math.floor(100 + Math.random() * 900)}`;
    setGeneratedRef(ref);

    onSubmit({
      reference: ref,
      category,
      categoryLabel: getCategoryLabel(category),
      summary,
      description,
      urgency,
      area,
      contactPreference,
      contactValue: contactPreference === 'in_app' ? 'In-app safe channel' : (contactValue || 'Provided to coordinator'),
      isAnonymous,
      status: urgency === 'immediate_danger' ? 'safeguarding' : 'submitted',
      createdAt: 'Just now'
    });

    setIsSubmitted(true);
  };

  const getCategoryLabel = (cat: HelpCategory) => {
    switch (cat) {
      case 'revert_support': return 'Revert Support & Mentorship';
      case 'wellbeing': return 'Wellbeing & Listening Ear';
      case 'companionship': return 'Companionship & Visit';
      case 'groceries_shopping': return 'Groceries & Halal Shopping';
      case 'transport': return 'Mosque / Hospital Transport';
      case 'family_advice': return 'Family & Revert Advice';
      case 'urgent_safeguarding': return 'Safeguarding / Urgent Care';
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSummary('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-emerald-800">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Request Community Care</h2>
              <p className="text-xs text-slate-500">Confidential, verified member support</p>
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
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Request Received</h3>
                <p className="text-xs text-slate-500">Reference: <span className="text-emerald-800 font-mono font-bold">{generatedRef}</span></p>
              </div>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Your request has been routed to the MRM Triage Coordinator. Our team will review your preferences and assign an approved volunteer within your service area.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 text-left space-y-1">
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <Lock className="w-3.5 h-3.5 text-emerald-700" /> Safe Contact Guarantee
                </div>
                <p>Your contact details remain confidential and will only be shared with your matched volunteer once you confirm.</p>
              </div>
              <Button
                onClick={handleReset}
                className="w-full mt-2"
              >
                Return to Home
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Emergency Banner */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5 text-slate-700">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-slate-900">Immediate Danger?</p>
                  <p className="text-slate-500 leading-normal">
                    If you are in medical emergency or immediate danger, please call <strong>999</strong> directly.
                  </p>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Select Support Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'revert_support', label: 'Revert Support' },
                    { id: 'wellbeing', label: 'Wellbeing' },
                    { id: 'companionship', label: 'Companionship' },
                    { id: 'groceries_shopping', label: 'Halal Groceries' },
                    { id: 'transport', label: 'Mosque Transport' },
                    { id: 'urgent_safeguarding', label: 'Safeguarding' },
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategory(cat.id as HelpCategory)}
                      className={`p-2.5 rounded-xl font-medium text-left border transition-all cursor-pointer ${
                        category === cat.id
                          ? 'bg-emerald-50 border-emerald-700 text-emerald-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Short summary */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Brief Summary</label>
                <Input
                  required
                  placeholder="e.g. Need assistance learning prayer basics"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Description of Need</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe what kind of support would be helpful. Keep sensitive identifiers minimal."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 resize-none"
                />
              </div>

              {/* Service Area & Urgency */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Area</label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    {SERVICE_AREAS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Urgency</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as HelpUrgency)}
                    className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="routine">Routine (This week)</option>
                    <option value="moderate">Moderate (1-2 days)</option>
                    <option value="urgent">Urgent (Within 24h)</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                className="w-full h-11 mt-2"
              >
                Submit Care Request
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
