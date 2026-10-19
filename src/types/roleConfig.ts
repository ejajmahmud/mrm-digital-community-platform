import { UserRole } from './index';
import { ASSETS } from '../data/assets';

export interface RoleConfig {
  id: UserRole;
  label: string;
  shortLabel: string;
  name: string;
  subtitle: string;
  avatarText: string;
  avatarUrl: string;
  badgeText: string;
  badgeMetalClass: string;
  dotColor: string;
  themeColor: string;
  description: string;
  idNumber: string;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  staff_admin: {
    id: 'staff_admin',
    label: 'Crisis Ops Director (Admin)',
    shortLabel: 'Admin Ops',
    name: 'Capt. Razali Noor',
    subtitle: 'Crisis Operations Center · National HQ',
    avatarText: 'RN',
    avatarUrl: ASSETS.avatars.admin,
    badgeText: 'HQ Command · Clearance L4',
    badgeMetalClass: 'u-badge u-badge-red',
    dotColor: 'bg-red-400',
    themeColor: '#ef4444',
    description: 'Direct crisis dispatches, assign responders, oversee Zakat ledger & verify incoming volunteer credentials.',
    idNumber: 'MRM-DIR-001'
  },
  approved_volunteer: {
    id: 'approved_volunteer',
    label: 'Field First Responder',
    shortLabel: 'Volunteer',
    name: 'Ahmad Faisal',
    subtitle: 'Squad Sentul · Rapid Care Unit',
    avatarText: 'AF',
    avatarUrl: ASSETS.avatars.volunteer,
    badgeText: 'Verified Responder · On Duty',
    badgeMetalClass: 'u-badge u-badge-emerald',
    dotColor: 'bg-emerald-400',
    themeColor: '#10b981',
    description: 'Receive emergency callouts, execute relief missions, log volunteer hours & navigate to beneficiaries.',
    idNumber: 'VOL-MY-4190'
  },
  seeker: {
    id: 'seeker',
    label: 'Care Recipient (Help Seeker)',
    shortLabel: 'Seeker',
    name: 'Brother Jason M.',
    subtitle: 'Confidential Support Zone · Sentul',
    avatarText: 'JM',
    avatarUrl: ASSETS.avatars.seeker,
    badgeText: 'Active Care Recipient · Safe Mode',
    badgeMetalClass: 'u-badge u-badge-red',
    dotColor: 'bg-rose-400',
    themeColor: '#f43f5e',
    description: 'One-tap emergency grocery aid, safe revert companion, live volunteer ETA tracker & confidential hotline.',
    idNumber: 'AID-REC-7721'
  },
  approved_teacher: {
    id: 'approved_teacher',
    label: 'Islamic Scholar & Revert Mentor',
    shortLabel: 'Scholar/Mentor',
    name: 'Ustazah Hana Al-Idrus',
    subtitle: 'Syariah Advisory Board & Revert Academy',
    avatarText: 'HA',
    avatarUrl: ASSETS.avatars.teacher,
    badgeText: 'Certified Scholar Mentor',
    badgeMetalClass: 'u-badge u-badge-amber',
    dotColor: 'bg-amber-400',
    themeColor: '#eab308',
    description: 'Conduct 1-on-1 revert mentoring, answer theological questions, manage curriculum & book counseling.',
    idNumber: 'SCH-MY-8012'
  },
  volunteer_applicant: {
    id: 'volunteer_applicant',
    label: 'Volunteer Candidate',
    shortLabel: 'Applicant',
    name: 'Zaid bin Mansur',
    subtitle: 'Applicant Track · Background & Police Check',
    avatarText: 'ZM',
    avatarUrl: ASSETS.avatars.applicant,
    badgeText: 'Vetting in Progress · Step 2/4',
    badgeMetalClass: 'u-badge u-badge-gray',
    dotColor: 'bg-slate-400',
    themeColor: '#64748b',
    description: 'Track vetting milestones, upload criminal clearance records & complete crisis safeguarding training modules.',
    idNumber: 'APP-REG-3914'
  },
  member: {
    id: 'member',
    label: 'Community Member & Donor',
    shortLabel: 'Member',
    name: 'Nurul Aini',
    subtitle: 'Wilayah Persekutuan Sustaining Donor',
    avatarText: 'NA',
    avatarUrl: ASSETS.avatars.member,
    badgeText: 'Sustaining Community Member',
    badgeMetalClass: 'u-badge u-badge-blue',
    dotColor: 'bg-sky-400',
    themeColor: '#0ea5e9',
    description: 'Access prayer times, fund emergency grocery hampers, calculate Zakat & participate in community feed.',
    idNumber: 'MEM-MY-8821'
  }
};
