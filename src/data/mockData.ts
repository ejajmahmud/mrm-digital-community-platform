import { 
  HelpRequest, 
  VolunteerProfile, 
  Assignment, 
  LearningItem, 
  ZakatReferral, 
  ActivityNotification, 
  PrayerTimeData,
  DuaItem, 
  DhikrItem, 
  SifatNameItem, 
  HaramCodeItem 
} from '../types';

export const INITIAL_PRAYER_TIMES: PrayerTimeData = {
  fajr: '05:48',
  sunrise: '06:58',
  dhuhr: '13:08',
  asr: '16:22',
  maghrib: '19:12',
  isha: '20:21',
};

export const INITIAL_HELP_REQUESTS: HelpRequest[] = [
  {
    id: 'req-1',
    reference: 'REQ-2026-084',
    category: 'revert_support',
    categoryLabel: 'Revert Support & Mentorship',
    summary: 'New Muslim looking for a gentle study buddy for prayer basics',
    description: 'Assalamu alaikum. I took my Shahada 2 months ago and feel a bit overwhelmed learning the recitation and movements of Salah. Looking for a patient brother or sister in KL/PJ area to practice with once a week.',
    urgency: 'routine',
    area: 'Petaling Jaya',
    contactPreference: 'in_app',
    contactValue: 'In-app safe chat',
    isAnonymous: false,
    status: 'active',
    createdAt: 'Today, 10:15 AM',
    assignedVolunteerId: 'vol-1',
    assignedVolunteerName: 'Ahmad Faisal',
    adminNote: 'Matched with Brother Ahmad (verified revert mentor). Safeguarding check passed.'
  },
  {
    id: 'req-2',
    reference: 'REQ-2026-082',
    category: 'groceries_shopping',
    categoryLabel: 'Shopping & Groceries Support',
    summary: 'Elderly sister recovering from eye procedure needs halal grocery run',
    description: 'Need assistance picking up essential groceries and medications from Taman Melawati market. Mobility limited this week.',
    urgency: 'moderate',
    area: 'Ampang',
    contactPreference: 'whatsapp',
    contactValue: '+60 12-345 6789',
    isAnonymous: false,
    status: 'completed',
    createdAt: 'Yesterday, 3:40 PM',
    assignedVolunteerId: 'vol-3',
    assignedVolunteerName: 'Nurul Huda',
    adminNote: 'Completed safely. Groceries delivered.'
  },
  {
    id: 'req-3',
    reference: 'REQ-2026-080',
    category: 'wellbeing',
    categoryLabel: 'Wellbeing & Family Care',
    summary: 'Confidential listening and guidance on family communication',
    description: 'Seeking advice from a mature community elder regarding explaining Islamic practices respectfully to non-Muslim parents.',
    urgency: 'routine',
    area: 'Cyberjaya',
    contactPreference: 'in_app',
    contactValue: 'In-app confidential channel',
    isAnonymous: true,
    status: 'triaged',
    createdAt: 'Oct 12, 2:10 PM',
    adminNote: 'Assigned to Senior Coordinator Sister Amina.'
  }
];

export const INITIAL_VOLUNTEER_PROFILE: VolunteerProfile = {
  id: 'vol-1',
  name: 'Ahmad Faisal',
  email: 'ahmad.faisal@mrm.local',
  phone: '+60 12-889 4412',
  area: 'Kuala Lumpur',
  gender: 'male',
  skills: ['Revert Mentorship', 'Companionship', 'Basic Arabic Tutoring', 'Driving / Transport'],
  languages: ['English', 'Bahasa Melayu', 'Basic Arabic'],
  availability: 'Weekdays 7:00 PM - 9:30 PM, Weekends flexible',
  motivation: 'Keen to support new Muslims around Kuala Lumpur with practical, safe and consistent help.',
  status: 'approved',
  documents: {
    idDocument: { name: 'mykad_ahmad_faisal.pdf', verified: true, uploadedAt: '15 Sep 2026' },
    referenceLetter: { name: 'imam_reference_letter.pdf', verified: true, uploadedAt: '18 Sep 2026' }
  },
  interview: {
    scheduledDate: '29 Sep 2026, 15:30',
    interviewer: 'Hafiz Salleh (MRM Coordinator)',
    outcome: 'passed',
    notes: 'Interview covers boundaries, safeguarding, language ability and active availability in KL.'
  },
  verifiedHours: 24.5,
  badges: ['Verified Helper', 'Revert Mentor Level 1', 'Safeguarding Certified', '5+ Completed Missions']
};

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    requestId: 'req-1',
    title: 'Revert Support: Foundations of Salah Practice',
    category: 'Revert Support',
    beneficiaryName: 'Brother Jason (New Revert)',
    area: 'Petaling Jaya (Near Masjid Al-Azhar)',
    urgency: 'Routine',
    status: 'in_progress',
    assignedDate: 'Oct 14, 2026',
    instructions: 'Meet in a public space (Masjid lobby or café). Follow MRM Code of Conduct. Focus on Wudu steps and posture in prayer.',
    notes: [
      'Initial contact made via safe app messaging. Agreed to meet Thursday after Maghrib.',
      'Shared the MRM Beginners Salah Guide PDF.'
    ]
  },
  {
    id: 'asg-2',
    requestId: 'req-2',
    title: 'Halal Essentials Delivery & Wellbeing Check',
    category: 'Groceries & Care',
    beneficiaryName: 'Sister Fatimah (Senior Member)',
    area: 'Ampang Jaya',
    urgency: 'Moderate',
    status: 'completed',
    assignedDate: 'Oct 11, 2026',
    instructions: 'Pick up dry grocery items from approved halal vendor and deliver to front door. Respect privacy.',
    notes: [
      'Items safely delivered. Receipt attached to coordinator report.',
      'Recipient expressed deep gratitude for MRM community care.'
    ]
  }
];

export const INITIAL_LEARNING_ITEMS: LearningItem[] = [
  {
    id: 'lrn-1',
    title: 'Foundations of Salah for Beginners',
    author: 'Ustazah Hana Yusof',
    authorRole: 'Head of Revert Education',
    category: 'revert',
    status: 'published',
    language: 'English & Malay',
    duration: '45 mins',
    isLive: true,
    liveTime: 'Tonight, 8:30 PM (MYT)',
    summary: 'A step-by-step interactive walkthrough of prayer postures, spiritual presence, and essential recitations.',
    content: 'Learn why prayer is our direct conversation with Allah SWT. We break down the physical actions: Takbir, Qiyam, Ruku, Sujud, and Tashahhud, along with phonetics for non-Arabic speakers.',
    meetingLink: 'https://mrm.community/live/salah-basics'
  },
  {
    id: 'lrn-2',
    title: 'New Muslim Family Conversations',
    author: 'Ustaz Rafiq Aziz',
    authorRole: 'Community Counselor',
    category: 'lifestyle',
    status: 'published',
    language: 'English',
    duration: '1 hr 15 mins',
    summary: 'Gentle guidance on navigating family relationships, holiday meals, and respecting parents while embracing Islam.',
    content: 'Wisdom from the prophetic sunnah on maintaining filial piety (birr al-walidayn) and answering questions with kindness and patience.',
    meetingLink: 'https://mrm.community/live/family-dialogue'
  },
  {
    id: 'lrn-3',
    title: 'Reading Al-Fatihah with Proper Tajweed',
    author: 'Dr. Sofia Rahim',
    authorRole: 'Certified Qari’ah',
    category: 'quran',
    status: 'published',
    language: 'Arabic / English',
    duration: '35 mins',
    summary: 'Makharij al-Huroof (articulation points) of Surat Al-Fatihah practiced verse by verse.',
    content: 'Detailed audio breakdown of each verse, common pronunciation challenges, and how to recite with clarity.',
    meetingLink: 'https://mrm.community/live/fatihah-tajweed'
  },
  {
    id: 'lrn-4',
    title: 'Halal Food Basics & Additives Guide',
    author: 'Umar Khalil',
    authorRole: 'Halal Industry Researcher',
    category: 'lifestyle',
    status: 'published',
    language: 'English',
    duration: '30 mins',
    summary: 'Understanding ingredients, checking E-numbers, and eating with peace of mind.',
    content: 'Demystifying food labels, animal fats vs plant based emulsifiers, and using the MRM Haram Code directory.',
    meetingLink: 'https://mrm.community/live/halal-essentials'
  }
];

export const INITIAL_ZAKAT_REFERRALS: ZakatReferral[] = [
  {
    id: 'zkt-1',
    reference: 'MY-ZKT-2026-001',
    memberName: 'Brother Adam Tan',
    needDescription: 'Single father requesting zakat subsistence referral for rental & school supplies assistance in Petaling Jaya.',
    region: 'Selangor (Petaling Jaya)',
    stateAuthority: 'Lembaga Zakat Selangor (LZS)',
    contactPhone: '+60 12-220 0317',
    status: 'referred',
    submittedDate: '08 Oct 2026',
    consentGiven: true,
    notes: 'Official referral letter sent to LZS branch. Coordinator assigned as institutional liaison.'
  },
  {
    id: 'zkt-2',
    reference: 'MY-ZKT-2026-002',
    memberName: 'Sister Siti Lee',
    needDescription: 'Medical equipment & wheelchair support for revert sister recovering from surgery.',
    region: 'Kuala Lumpur',
    stateAuthority: 'Pusat Pungutan Zakat (MAIWP)',
    contactPhone: '+60 13-220 0634',
    status: 'documents_requested',
    submittedDate: '11 Oct 2026',
    consentGiven: true,
    notes: 'Awaiting medical summary from hospital for official filing.'
  }
];

export const INITIAL_NOTIFICATIONS: ActivityNotification[] = [
  {
    id: 'notif-1',
    title: 'Class Reminder',
    message: 'Foundations of Salah starts tonight at 8:30 PM. Live audio room will open 10 mins prior.',
    type: 'learning',
    timestamp: '1 hour ago',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Volunteer Match Confirmed',
    message: 'Your help request #REQ-2026-084 has been paired with a certified revert mentor.',
    type: 'help',
    timestamp: '4 hours ago',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Service Hours Verified',
    message: 'MRM Coordinator verified 3.5 hours for Ampang care mission. Baraka Allahu feekum!',
    type: 'volunteer',
    timestamp: 'Yesterday',
    read: true
  },
  {
    id: 'notif-4',
    title: 'MRM Community Safety Notice',
    message: 'Our helpline active hours are 8:00 AM – 10:00 PM daily. Emergency? Call 999 directly.',
    type: 'system',
    timestamp: '2 days ago',
    read: true
  }
];

export const DUA_LIST: DuaItem[] = [
  {
    id: 'dua-1',
    shortNameEn: 'For a Happy & Righteous Family',
    shortNameAr: 'للسعادة العائلية',
    arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    transliteration: 'Rabbana hab lana min azwajina wa dhurriyyatina qurrata a\'yunin waj\'alna lil-muttaqina imama',
    translation: 'Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.',
    category: 'Family & Marriage',
    reference: 'Surah Al-Furqan 25:74'
  },
  {
    id: 'dua-2',
    shortNameEn: 'Dua After Prayer (Istighfar & Peace)',
    shortNameAr: 'بعد السلام',
    arabic: 'أَسْتَغْفِرُ اللَّهَ (ثَلاثاً)، اللَّهُمَّ أَنْتَ السَّلامُ، وَمِنْكَ السَّلامُ، تَبَارَكْتَ يَا ذَا الجَلالِ وَالإِكْرَامِ',
    transliteration: 'Astaghfirullah (3x), Allahumma antas-Salam wa minkas-Salam, tabarakta ya dhal-Jalali wal-Ikram',
    translation: 'I ask Allah for forgiveness (3x). O Allah, You are Peace and from You comes peace. Blessed are You, O Owner of majesty and honor.',
    category: 'Salah & Remembrance',
    reference: 'Sahih Muslim 591'
  },
  {
    id: 'dua-3',
    shortNameEn: 'Protection from Trials & Hardship',
    shortNameAr: 'الاستعاذة من الفتن',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، وَمِنْ عَذَابِ جَهَنَّمَ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',
    transliteration: 'Allahumma inni a\'udhu bika min \'adhab al-qabr, wa min \'adhab jahannam, wa min fitnatil-mahya wal-mamat, wa min sharri fitnatil-masihid-dajjal',
    translation: 'O Allah, I seek refuge in You from the punishment of the grave, from the punishment of Hell, from the trials of life and death, and from the evil of the trial of the False Messiah.',
    category: 'Protection',
    reference: 'Sahih Bukhari 1377'
  },
  {
    id: 'dua-4',
    shortNameEn: 'Dua for Ease in All Affairs',
    shortNameAr: 'لتيسير الأمور',
    arabic: 'اللَّهُمَّ لا سَهْلَ إِلاَّ ما جَعَلْتَهُ سَهْلاً، وأَنْتَ تَجْعَلُ الحَزْنَ إذا شِئْتَ سَهْلاً',
    transliteration: 'Allahumma la sahla illa ma ja\'altahu sahla, wa anta taj\'alul-hazna idha shi\'ta sahla',
    translation: 'O Allah, there is no ease except in that which You have made easy, and You make the difficulty, if You wish, easy.',
    category: 'Daily Living',
    reference: 'Sahih Ibn Hibban 974'
  }
];

export const DHIKR_LIST: DhikrItem[] = [
  {
    id: 'dhikr-1',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subhan Allah',
    translation: 'Glory be to Allah',
    targetCount: 33,
    benefits: 'Purifies the heart and earns 1,000 good deeds or erases 1,000 sins.'
  },
  {
    id: 'dhikr-2',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Al-hamdulillah',
    translation: 'All praise is due to Allah',
    targetCount: 33,
    benefits: 'Fills the scales of good deeds on the Day of Resurrection.'
  },
  {
    id: 'dhikr-3',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translation: 'Allah is the Greatest',
    targetCount: 34,
    benefits: 'Affirms Allah\'s greatness above all worldly stress and anxieties.'
  },
  {
    id: 'dhikr-4',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: 'La ilaha illallah wahdahu la sharika lah',
    translation: 'None has the right to be worshipped but Allah alone, without partner',
    targetCount: 10,
    benefits: 'The heaviest statement on the scales, reward equivalent to freeing slaves.'
  },
  {
    id: 'dhikr-5',
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullah wa atubu ilayh',
    translation: 'I seek the forgiveness of Allah and repent to Him',
    targetCount: 100,
    benefits: 'Opens doors of sustenance, brings ease to worries, and expiates errors.'
  },
  {
    id: 'dhikr-6',
    arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ',
    transliteration: 'Allahumma salli \'ala Muhammad wa \'ala ali Muhammad',
    translation: 'O Allah, send blessings upon Muhammad and upon the family of Muhammad',
    targetCount: 10,
    benefits: 'Whoever sends one blessing, Allah sends ten blessings upon them.'
  }
];

export const SIFAT_NAMES: SifatNameItem[] = [
  {
    number: 1,
    arabic: 'الرَّحْمَٰنُ',
    transliteration: 'Ar-Rahmaan',
    meaning: 'The Entirely Merciful',
    benefits: 'He is the One who wills Mercy and good for all creation at all times. Inspires immense hope and gratitude.'
  },
  {
    number: 2,
    arabic: 'الرَّحِيمُ',
    transliteration: 'Ar-Raheem',
    meaning: 'The Especially Merciful',
    benefits: 'The source of infinite mercy and reward for the believers who strive in righteousness.'
  },
  {
    number: 3,
    arabic: 'الْمَلِكُ',
    transliteration: 'Al-Malik',
    meaning: 'The King and Sovereign',
    benefits: 'The owner and ruler of the entire universe, visible and invisible. Recitation brings contentment with divine decree.'
  },
  {
    number: 4,
    arabic: 'الْقُدُّوسُ',
    transliteration: 'Al-Quddus',
    meaning: 'The Most Sacred & Pure',
    benefits: 'Free from any imperfection, weakness, or error. Calms turbulent minds and cleanses spiritual intentions.'
  },
  {
    number: 5,
    arabic: 'السَّلَامُ',
    transliteration: 'As-Salaam',
    meaning: 'The Source of Peace',
    benefits: 'The giver of safety, serenity, and security in this life and the Hereafter.'
  },
  {
    number: 6,
    arabic: 'الْمُؤْمِنُ',
    transliteration: 'Al-Mu\'min',
    meaning: 'The Guardian of Faith',
    benefits: 'The granter of security and certitude to those who turn to Him.'
  }
];

export const HARAM_CODES: HaramCodeItem[] = [
  {
    code: 'E120',
    name: 'Carmine / Cochineal',
    status: 'Haram',
    description: 'Red dye extracted from dried crushed insects (cochineal). Deemed non-halal by major fatwa councils due to insect derivation.',
    source: 'JAKIM / MUI Halal Standard'
  },
  {
    code: 'E161(c)',
    name: 'Cryptoxanthin',
    status: 'Mushbooh',
    description: 'Natural pigment from petals. Halal status depends upon extraction solvent; if alcohol or porcine carrier is used, requires halal certificate.',
    source: 'Food Additives Handbook'
  },
  {
    code: 'E161(d)',
    name: 'Rubixanthin',
    status: 'Mushbooh',
    description: 'Xanthophyll pigment extracted from plants. Halal if 100% dry powder or plant oil solvent used.',
    source: 'Halal Ingredients Reference'
  },
  {
    code: 'E441',
    name: 'Gelatine',
    status: 'Mushbooh',
    description: 'Gelling agent derived from animal collagen. Halal only if sourced from bovine slaughtered in accordance with Islamic law or fish.',
    source: 'JAKIM Halal Hub'
  },
  {
    code: 'E471',
    name: 'Mono- and Diglycerides',
    status: 'Mushbooh',
    description: 'Emulsifier derived either from plant oil (soy, palm) or animal fat. Check for "100% plant origin" or official Halal stamp.',
    source: 'Islamic Food Council'
  },
  {
    code: 'E100',
    name: 'Curcumin',
    status: 'Halal',
    description: 'Natural yellow color extracted from the roots of the turmeric plant. Universally certified Halal.',
    source: 'Universal Halal List'
  }
];

export const SERVICE_AREAS = [
  'Kuala Lumpur',
  'Petaling Jaya',
  'Shah Alam',
  'Subang Jaya',
  'Cyberjaya',
  'Putrajaya',
  'Ampang',
  'Klang',
  'Kajang',
  'Cheras'
];
