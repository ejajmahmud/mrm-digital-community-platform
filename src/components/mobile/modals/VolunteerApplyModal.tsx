import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Upload, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight,
  Award
} from 'lucide-react';
import { VolunteerProfile } from '../../../types';
import { SERVICE_AREAS } from '../../../data/mockData';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';

interface VolunteerApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: VolunteerProfile;
  onUpdateProfile: (updated: VolunteerProfile) => void;
}

export const VolunteerApplyModal: React.FC<VolunteerApplyModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile
}) => {
  const [activeStep, setActiveStep] = useState<number>(profile.status === 'approved' ? 4 : 1);
  const [area, setArea] = useState(profile.area || 'Kuala Lumpur');
  const [gender, setGender] = useState<'male' | 'female'>(profile.gender || 'male');
  const [skills, setSkills] = useState<string[]>(profile.skills || ['Revert Mentorship', 'Companionship']);
  const [motivation, setMotivation] = useState(profile.motivation || '');
  const [uploadedId, setUploadedId] = useState(profile.documents.idDocument?.name || '');
  const [uploadedRef, setUploadedRef] = useState(profile.documents.referenceLetter?.name || '');
  const [selectedInterviewSlot, setSelectedInterviewSlot] = useState(profile.interview?.scheduledDate || '');

  if (!isOpen) return null;

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleSimulateIdUpload = () => {
    const filename = `mykad_verified_${gender}.pdf`;
    setUploadedId(filename);
    onUpdateProfile({
      ...profile,
      documents: {
        ...profile.documents,
        idDocument: { name: filename, verified: true, uploadedAt: 'Just now' }
      }
    });
  };

  const handleSimulateRefUpload = () => {
    const filename = `imam_recommendation_letter.pdf`;
    setUploadedRef(filename);
    onUpdateProfile({
      ...profile,
      documents: {
        ...profile.documents,
        referenceLetter: { name: filename, verified: true, uploadedAt: 'Just now' }
      }
    });
  };

  const handleScheduleInterview = (slot: string) => {
    setSelectedInterviewSlot(slot);
    onUpdateProfile({
      ...profile,
      status: 'interview',
      interview: {
        scheduledDate: slot,
        interviewer: 'Hafiz Salleh (MRM Lead Coordinator)',
        outcome: 'pending',
        notes: 'Safeguarding guidelines and active area coverage.'
      }
    });
    setActiveStep(3);
  };

  const handleCompleteApprovalSimulation = () => {
    onUpdateProfile({
      ...profile,
      status: 'approved',
      interview: {
        scheduledDate: selectedInterviewSlot || '29 Sep 2026, 15:30',
        interviewer: 'Hafiz Salleh',
        outcome: 'passed',
        notes: 'Applicant demonstrated solid understanding of confidentiality and empathy.'
      },
      verifiedHours: profile.verifiedHours || 12,
      badges: profile.badges.length ? profile.badges : ['Verified Helper', 'Safeguarding Certified']
    });
    setActiveStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-emerald-800">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Volunteer With MRM</h2>
              <p className="text-xs text-slate-500">4-Stage Verification & Safeguarding</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step progress bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
          {[
            { num: 1, label: 'Profile' },
            { num: 2, label: 'Documents' },
            { num: 3, label: 'Interview' },
            { num: 4, label: 'Approved' },
          ].map((st) => (
            <button
              key={st.num}
              onClick={() => setActiveStep(st.num)}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeStep === st.num
                  ? 'text-emerald-800 font-bold'
                  : activeStep > st.num
                  ? 'text-slate-700'
                  : 'text-slate-400'
              }`}
            >
              <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-mono ${
                activeStep === st.num
                  ? 'bg-emerald-800 text-white font-bold'
                  : activeStep > st.num
                  ? 'bg-slate-200 text-slate-700'
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {activeStep > st.num ? '✓' : st.num}
              </span>
              <span>{st.label}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* STEP 1 */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Step 1: Skills & Service Location</h3>
                <p className="text-xs text-slate-500">Tell us how you would like to help the community.</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Gender (Required for privacy guidelines)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-colors cursor-pointer ${
                      gender === 'male' ? 'bg-emerald-50 border-emerald-700 text-emerald-900 font-bold' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    Brother (Male)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-colors cursor-pointer ${
                      gender === 'female' ? 'bg-emerald-50 border-emerald-700 text-emerald-900 font-bold' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    Sister (Female)
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Service Area</label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                >
                  {SERVICE_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Skills to Offer</label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Revert Mentorship',
                    'Companionship',
                    'Halal Shopping',
                    'Driving / Transport',
                    'Basic Arabic Tutoring',
                    'Elderly Home Visit'
                  ].map(s => {
                    const has = skills.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSkill(s)}
                        className={`text-xs py-1.5 px-3 rounded-lg border transition-all cursor-pointer ${
                          has ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-semibold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {has ? '✓ ' : '+ '}{s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button
                type="button"
                onClick={() => setActiveStep(2)}
                className="w-full h-11"
              >
                Proceed to Document Verification <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}

          {/* STEP 2 */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Step 2: Evidence & ID</h3>
                <p className="text-xs text-slate-500">MRM reviews verified IDs and references to protect community members.</p>
              </div>

              <Card className="border-slate-200 shadow-xs">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Photo ID (MyKad / Passport)</span>
                    {uploadedId ? (
                      <Badge variant="default">Verified</Badge>
                    ) : (
                      <Badge variant="secondary">Required</Badge>
                    )}
                  </div>
                  {uploadedId ? (
                    <p className="text-xs text-slate-600 font-mono">{uploadedId}</p>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSimulateIdUpload}
                      className="w-full text-xs"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload ID (.pdf / .jpg)
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-xs">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Imam / Mentor Reference Letter</span>
                    {uploadedRef ? (
                      <Badge variant="default">Attached</Badge>
                    ) : (
                      <Badge variant="secondary">Recommended</Badge>
                    )}
                  </div>
                  {uploadedRef ? (
                    <p className="text-xs text-slate-600 font-mono">{uploadedRef}</p>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSimulateRefUpload}
                      className="w-full text-xs"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload Reference (.pdf)
                    </Button>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setActiveStep(1)} className="w-1/3">
                  Back
                </Button>
                <Button onClick={() => setActiveStep(3)} className="w-2/3">
                  Proceed to Interview
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Step 3: Online Volunteer Interview</h3>
                <p className="text-xs text-slate-500">A brief 20-minute video session to discuss boundaries and ethics.</p>
              </div>

              <div className="space-y-2">
                {[
                  'Tomorrow, 4:00 PM - 4:20 PM',
                  'Friday 17 Oct, 8:00 PM - 8:20 PM',
                  'Saturday 18 Oct, 11:00 AM - 11:20 AM'
                ].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => handleScheduleInterview(slot)}
                    className={`w-full p-3 rounded-xl text-xs font-medium flex items-center justify-between border transition-all cursor-pointer ${
                      selectedInterviewSlot === slot
                        ? 'bg-emerald-50 border-emerald-700 text-emerald-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-emerald-800" /> {slot}
                    </span>
                    {selectedInterviewSlot === slot && <Badge variant="default">Scheduled</Badge>}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <p className="text-xs text-slate-600">
                  Tap below to complete the onboarding simulation and grant active volunteer permissions.
                </p>
                <Button
                  onClick={handleCompleteApprovalSimulation}
                  className="w-full text-xs"
                >
                  Confirm Staff Accreditation
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {activeStep === 4 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
                <Award className="w-7 h-7" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-slate-900">Approved Volunteer</h3>
                <p className="text-xs text-slate-500">MRM Volunteer ID: <span className="font-mono font-bold text-slate-800">VOL-KL-0082</span></p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-left">
                <Card className="border-slate-200 shadow-xs">
                  <CardContent className="p-3">
                    <p className="text-[11px] text-slate-500">Verified Service</p>
                    <p className="text-base font-bold text-slate-900 font-mono">{profile.verifiedHours} hrs</p>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-xs">
                  <CardContent className="p-3">
                    <p className="text-[11px] text-slate-500">Primary Area</p>
                    <p className="text-sm font-semibold text-slate-900">{profile.area}</p>
                  </CardContent>
                </Card>
              </div>

              <Button onClick={onClose} className="w-full">
                Done
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
