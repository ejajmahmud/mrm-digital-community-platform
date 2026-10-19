export type UserRole = 
  | 'member' 
  | 'seeker' 
  | 'volunteer_applicant' 
  | 'approved_volunteer' 
  | 'approved_teacher' 
  | 'staff_admin';

export type HelpCategory = 
  | 'revert_support' 
  | 'wellbeing' 
  | 'companionship' 
  | 'groceries_shopping' 
  | 'transport' 
  | 'family_advice' 
  | 'urgent_safeguarding';

export type HelpUrgency = 'routine' | 'moderate' | 'urgent' | 'immediate_danger';

export type HelpStatus = 'submitted' | 'triaged' | 'active' | 'safeguarding' | 'closed' | 'completed';

export interface HelpRequest {
  id: string;
  reference: string;
  category: HelpCategory;
  categoryLabel: string;
  summary: string;
  description: string;
  urgency: HelpUrgency;
  area: string;
  contactPreference: 'in_app' | 'whatsapp' | 'phone';
  contactValue: string;
  isAnonymous: boolean;
  status: HelpStatus;
  createdAt: string;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  adminNote?: string;
}

export interface VolunteerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  area: string;
  gender: 'male' | 'female';
  skills: string[];
  languages: string[];
  availability: string;
  motivation: string;
  status: 'submitted' | 'docs_review' | 'interview' | 'approved' | 'info_requested' | 'rejected' | 'suspended';
  documents: {
    idDocument?: { name: string; verified: boolean; uploadedAt: string };
    referenceLetter?: { name: string; verified: boolean; uploadedAt: string };
  };
  interview?: {
    scheduledDate: string;
    interviewer: string;
    outcome?: 'pending' | 'passed' | 'review';
    notes?: string;
  };
  verifiedHours: number;
  badges: string[];
}

export interface Assignment {
  id: string;
  requestId: string;
  title: string;
  category: string;
  beneficiaryName: string; // Restricted if not assigned
  area: string;
  urgency: string;
  status: 'offered' | 'assigned' | 'in_progress' | 'completed';
  assignedDate: string;
  instructions: string;
  notes: string[];
}

export interface LearningItem {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  category: 'foundations' | 'revert' | 'quran' | 'ramadan' | 'lifestyle';
  status: 'published' | 'draft';
  language: string;
  duration: string;
  isLive?: boolean;
  liveTime?: string;
  summary: string;
  content: string;
  meetingLink?: string;
}

export interface ZakatReferral {
  id: string;
  reference: string;
  memberName: string;
  needDescription: string;
  region: string;
  stateAuthority: string;
  contactPhone: string;
  status: 'submitted' | 'contacted' | 'documents_requested' | 'referred' | 'closed';
  submittedDate: string;
  consentGiven: boolean;
  notes: string;
}

export interface ActivityNotification {
  id: string;
  title: string;
  message: string;
  type: 'help' | 'volunteer' | 'learning' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface PrayerTimeData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  imsak?: string;
  midnight?: string;
}

export interface LocationPrayerTimes {
  locationName: string;
  country: string;
  latitude: number;
  longitude: number;
  dateStr: string;
  hijriDateStr: string;
  hijriYear: string;
  hijriMonthEn: string;
  hijriMonthAr: string;
  timings: {
    Imsak: string;
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    Midnight?: string;
  };
  methodName: string;
  methodId: number;
  source: 'api' | 'fallback';
}

export interface DuaItem {
  id: string;
  shortNameEn: string;
  shortNameAr: string;
  arabic: string;
  transliteration: string;
  translation: string;
  category: string;
  reference: string;
}

export interface DhikrItem {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  targetCount: number;
  benefits: string;
}

export interface SifatNameItem {
  number: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  benefits: string;
}

export interface HaramCodeItem {
  code: string;
  name: string;
  status: 'Halal' | 'Mushbooh' | 'Haram';
  description: string;
  source: string;
}
