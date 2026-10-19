import React, { useState } from 'react';
import { 
  Check, 
  ChevronRight,
  Shield, 
  Clock, 
  Calendar, 
  UserCheck 
} from 'lucide-react';
import { 
  ActivityNotification, 
  HelpRequest, 
  VolunteerProfile, 
  ZakatReferral 
} from '../../types';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface ActivityTabProps {
  notifications: ActivityNotification[];
  helpRequests: HelpRequest[];
  volunteerProfile: VolunteerProfile;
  zakatReferrals: ZakatReferral[];
  onMarkAllRead: () => void;
  onOpenHelpModal: () => void;
  onOpenVolunteerModal: () => void;
  onOpenLearningModal: () => void;
}

export const ActivityTab: React.FC<ActivityTabProps> = ({
  notifications,
  helpRequests,
  volunteerProfile,
  zakatReferrals,
  onMarkAllRead,
  onOpenHelpModal,
  onOpenVolunteerModal,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'requests' | 'volunteer'>('all');

  return (
    <div className="space-y-3.5 pb-20">
      {/* Top Header matching Slide 11 */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            PERSONAL TIMELINE
          </p>
          <button
            onClick={onMarkAllRead}
            className="text-xs text-emerald-800 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" /> Mark all read
          </button>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Your activity
        </h1>
        <p className="text-xs text-slate-500 leading-normal">
          Applications and MRM updates in one calm timeline.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 text-xs">
        {[
          { id: 'all', label: 'All Updates' },
          { id: 'requests', label: 'Care Requests' },
          { id: 'volunteer', label: 'Volunteering' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id as any)}
            className={`py-1.5 px-3.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === f.id
                ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Service timeline cards */}
      <div className="space-y-2.5">
        {(activeFilter === 'all' || activeFilter === 'requests') && helpRequests.map((req) => (
          <Card 
            key={req.id}
            onClick={onOpenHelpModal}
            className="cursor-pointer hover:border-slate-300 transition-colors shadow-xs"
          >
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-slate-500">
                  {req.reference}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">{req.createdAt}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{req.categoryLabel}</h3>
                <p className="text-xs text-slate-600 leading-normal mt-0.5 line-clamp-2">{req.summary}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500">Area: {req.area}</span>
                <Badge variant={req.status === 'completed' ? 'default' : 'secondary'} className="capitalize">
                  {req.status === 'active' ? 'Volunteer Matched' : req.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Volunteer Application Tracker */}
        {(activeFilter === 'all' || activeFilter === 'volunteer') && (
          <Card 
            onClick={onOpenVolunteerModal}
            className="cursor-pointer hover:border-slate-300 transition-colors shadow-xs"
          >
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-emerald-800">
                  VOLUNTEER APPLICATION
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Standing</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">Volunteer Verification Pipeline</h3>
                <p className="text-xs text-slate-600 mt-0.5 leading-normal">
                  {volunteerProfile.status === 'approved' 
                    ? 'Accreditation verified. Eligible for active community cases.' 
                    : 'Documents submitted. Pending online interview slot.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500">
                  Verified: <strong className="text-slate-900 font-mono">{volunteerProfile.verifiedHours} hrs</strong>
                </span>
                <Badge variant="default" className="capitalize">
                  {volunteerProfile.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Zakat Referrals */}
        {(activeFilter === 'all' || activeFilter === 'requests') && zakatReferrals.map((zkt) => (
          <Card key={zkt.id} className="shadow-xs">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-slate-500">
                  {zkt.reference}
                </span>
                <span className="text-[10px] text-slate-400">{zkt.submittedDate}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">State Zakat Referral Docket</h3>
                <p className="text-xs text-slate-600 mt-0.5">{zkt.stateAuthority}</p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                Note: {zkt.notes}
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-slate-500">{zkt.region}</span>
                <Badge variant="secondary" className="capitalize">
                  {zkt.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Controlled Notifications */}
        <div className="pt-2 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Notifications
          </p>

          {notifications.map((notif) => (
            <Card key={notif.id} className="shadow-xs">
              <CardContent className="p-3.5 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    {!notif.read && <span className="w-2 h-2 rounded-full bg-emerald-700" />}
                    <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-normal">{notif.message}</p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.timestamp}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
