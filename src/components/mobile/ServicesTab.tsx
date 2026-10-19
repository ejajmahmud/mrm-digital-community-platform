import React from 'react';
import { 
  HeartHandshake, 
  Heart, 
  Briefcase, 
  GraduationCap, 
  Coins, 
  Sparkles, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { VolunteerProfile, Assignment } from '../../types';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

interface ServicesTabProps {
  onOpenHelp: () => void;
  onOpenVolunteer: () => void;
  onOpenAssignments: () => void;
  onOpenLearning: () => void;
  onOpenZakat: () => void;
  onOpenUtilities: (tab?: string) => void;
  volunteerProfile: VolunteerProfile;
  assignments: Assignment[];
}

export const ServicesTab: React.FC<ServicesTabProps> = ({
  onOpenHelp,
  onOpenVolunteer,
  onOpenAssignments,
  onOpenLearning,
  onOpenZakat,
  onOpenUtilities,
  volunteerProfile,
  assignments
}) => {
  const activeAssignmentsCount = assignments.filter(a => a.status !== 'completed').length;

  const services = [
    {
      id: 'help',
      title: 'Help & Support',
      desc: 'Request confidential member support',
      status: 'Available',
      icon: HeartHandshake,
      action: onOpenHelp,
    },
    {
      id: 'volunteer',
      title: 'Volunteer',
      desc: 'Apply and follow your volunteer journey',
      status: volunteerProfile.status === 'approved' ? 'Approved' : 'Available',
      icon: Heart,
      action: onOpenVolunteer,
    },
    {
      id: 'assignments',
      title: 'My Assignments',
      desc: 'Manage current community assignments',
      status: activeAssignmentsCount > 0 ? `${activeAssignmentsCount} Active` : 'Available',
      icon: Briefcase,
      action: onOpenAssignments,
    },
    {
      id: 'learning',
      title: 'Learning & Events',
      desc: 'Training, workshops and member events',
      status: 'Available',
      icon: GraduationCap,
      action: onOpenLearning,
    },
    {
      id: 'zakat',
      title: 'Zakat Referrals',
      desc: 'Institutional handoff to state authorities',
      status: 'Available',
      icon: Coins,
      action: onOpenZakat,
    },
    {
      id: 'utilities',
      title: 'Daily Islamic Utilities',
      desc: 'Prayer times, Qibla, Quran, Duas, Tasbih & E-Codes',
      status: 'Available',
      icon: Sparkles,
      action: () => onOpenUtilities('prayer'),
    },
  ];

  return (
    <div className="space-y-3.5 pb-20">
      {/* Header section matching Slides 1 & 10 */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-1">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Ways we can help
        </h1>
        <p className="text-xs text-slate-500 leading-normal">
          Member support and opportunities, gathered with care.
        </p>
      </div>

      {/* Services List matching the screenshot on Page 1 & 10 */}
      <div className="space-y-2.5">
        {services.map((svc) => {
          const Icon = svc.icon;
          return (
            <Card
              key={svc.id}
              onClick={svc.action}
              className="cursor-pointer hover:border-slate-300 hover:shadow-xs transition-all border-slate-200"
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                    <Icon className="w-5 h-5 text-emerald-800" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-slate-900">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-normal">
                      {svc.desc}
                    </p>
                    <div className="pt-0.5">
                      <Badge variant="secondary" className="text-[10px] py-0 px-2 font-medium">
                        {svc.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Safeguarding & Care Notice */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5 text-xs text-slate-600">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
        <p className="text-[11px] leading-relaxed">
          All member cases are handled with strict privacy and care under MRM governance.
        </p>
      </div>
    </div>
  );
};
