export type UtilityTabId =
  | 'waqt'
  | 'tracker'
  | 'qibla'
  | 'quran'
  | 'tasbih'
  | 'dua'
  | 'salah_guide'
  | 'sifat'
  | 'halal';

export interface TajweedSegment {
  text: string;
  rule?: 'ghunnah' | 'ikhfa' | 'idgham' | 'qalqalah' | 'madd';
}

export interface QuranAyah {
  ayahNumber: number;
  arabic: string;
  tajweedSegments: TajweedSegment[];
  transliteration: string;
  translationEn: string;
  translationBm: string;
}

export interface TajweedSurah {
  number: number;
  nameEn: string;
  nameAr: string;
  meaningEn: string;
  revelationType: 'Makkiyah' | 'Madaniyah';
  versesCount: number;
  virtueNote: string;
  ayat: QuranAyah[];
}

export const TAJWEED_RULES_LEGEND = [
  { id: 'ghunnah', label: 'Ghunnah (Nasal 2 beats)', colorClass: 'text-emerald-600 bg-emerald-500/10' },
  { id: 'ikhfa', label: 'Ikhfa (Hidden Noon)', colorClass: 'text-amber-600 bg-amber-500/10' },
  { id: 'idgham', label: 'Idgham (Merging)', colorClass: 'text-sky-600 bg-sky-500/10' },
  { id: 'qalqalah', label: 'Qalqalah (Echoing)', colorClass: 'text-rose-600 bg-rose-500/10' },
  { id: 'madd', label: 'Madd (Elongation 4–6)', colorClass: 'text-purple-600 bg-purple-500/10' },
] as const;

export const TAJWEED_SURAHS: TajweedSurah[] = [
  {
    number: 1,
    nameEn: 'Al-Fatihah',
    nameAr: 'الفاتحة',
    meaningEn: 'The Opening',
    revelationType: 'Makkiyah',
    versesCount: 7,
    virtueNote: 'The Greatest Surah in the Quran; recited in every Rakaat of Fard and Sunnah Salah.',
    ayat: [
      {
        ayahNumber: 1,
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        tajweedSegments: [
          { text: 'بِسْمِ اللَّهِ ' },
          { text: 'الرَّحْمَٰنِ ', rule: 'madd' },
          { text: 'الرَّحِيمِ', rule: 'madd' },
        ],
        transliteration: 'Bismillahir-Rahmanir-Rahim',
        translationEn: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
        translationBm: 'Dengan nama Allah, Yang Maha Pemurah, lagi Maha Mengasihani.',
      },
      {
        ayahNumber: 2,
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        tajweedSegments: [
          { text: 'الْحَمْدُ لِلَّهِ رَبِّ ' },
          { text: 'الْعَالَمِينَ', rule: 'madd' },
        ],
        transliteration: 'Alhamdu lillahi Rabbil-alamin',
        translationEn: 'All praise is due to Allah, Lord of the worlds.',
        translationBm: 'Segala puji tertentu bagi Allah, Tuhan yang memelihara dan mentadbirkan sekalian alam.',
      },
      {
        ayahNumber: 3,
        arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
        tajweedSegments: [
          { text: 'الرَّحْمَٰنِ ', rule: 'madd' },
          { text: 'الرَّحِيمِ', rule: 'madd' },
        ],
        transliteration: 'Ar-Rahmanir-Rahim',
        translationEn: 'The Entirely Merciful, the Especially Merciful.',
        translationBm: 'Yang Maha Pemurah, lagi Maha Mengasihani.',
      },
      {
        ayahNumber: 4,
        arabic: 'مَالِكِ يَوْمِ الدِّينِ',
        tajweedSegments: [
          { text: 'مَالِكِ ', rule: 'madd' },
          { text: 'يَوْمِ الدِّينِ', rule: 'madd' },
        ],
        transliteration: 'Maliki yawmid-din',
        translationEn: 'Sovereign of the Day of Recompense.',
        translationBm: 'Yang Menguasai pemerintahan hari Pembalasan (hari Akhirat).',
      },
      {
        ayahNumber: 5,
        arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        tajweedSegments: [
          { text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ ' },
          { text: 'نَسْتَعِينُ', rule: 'madd' },
        ],
        transliteration: 'Iyyaka na’budu wa iyyaka nasta’in',
        translationEn: 'It is You we worship and You we ask for help.',
        translationBm: 'Engkaulah sahaja (Ya Allah) Yang Kami sembah, dan kepada Engkaulah sahaja kami memohon pertolongan.',
      },
      {
        ayahNumber: 6,
        arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        tajweedSegments: [
          { text: 'اهْدِنَا الصِّرَاطَ ' },
          { text: 'الْمُسْتَقِيمَ', rule: 'madd' },
        ],
        transliteration: 'Ihdinas-siratal-mustaqim',
        translationEn: 'Guide us to the straight path.',
        translationBm: 'Tunjukilah kami jalan yang lurus.',
      },
      {
        ayahNumber: 7,
        arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        tajweedSegments: [
          { text: 'صِرَاطَ الَّذِينَ ' },
          { text: 'أَنْعَمْتَ ', rule: 'ikhfa' },
          { text: 'عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا ' },
          { text: 'الضَّالِّينَ', rule: 'madd' },
        ],
        transliteration: 'Siratal-ladhina an’amta alayhim ghayril-maghdubi alayhim wa lad-dallin',
        translationEn: 'The path of those upon whom You have bestowed favor, not of those who have evoked anger or of those who are astray.',
        translationBm: 'Iaitu jalan orang-orang yang Engkau telah kurniakan nikmat kepada mereka, bukan (jalan) orang-orang yang Engkau telah murkai, dan bukan pula (jalan) orang-orang yang sesat.',
      },
    ],
  },
  {
    number: 112,
    nameEn: 'Al-Ikhlas',
    nameAr: 'الإخلاص',
    meaningEn: 'Sincerity of Monotheism',
    revelationType: 'Makkiyah',
    versesCount: 4,
    virtueNote: 'Equivalent to one-third of the Quran in reward; foundational Tawheed chapter for Reverts.',
    ayat: [
      {
        ayahNumber: 1,
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        tajweedSegments: [
          { text: 'قُلْ هُوَ اللَّهُ ' },
          { text: 'أَحَدٌ', rule: 'qalqalah' },
        ],
        transliteration: 'Qul huwallahu ahad',
        translationEn: 'Say, "He is Allah, [who is] One,"',
        translationBm: 'Katakanlah (wahai Muhammad): "(Tuhanku) ialah Allah Yang Maha Esa;"',
      },
      {
        ayahNumber: 2,
        arabic: 'اللَّهُ الصَّمَدُ',
        tajweedSegments: [
          { text: 'اللَّهُ ' },
          { text: 'الصَّمَدُ', rule: 'qalqalah' },
        ],
        transliteration: 'Allahus-samad',
        translationEn: 'Allah, the Eternal Refuge.',
        translationBm: '"Allah Yang menjadi tumpuan sekalian makhluk untuk memohon sebarang hajat;"',
      },
      {
        ayahNumber: 3,
        arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        tajweedSegments: [
          { text: 'لَمْ ' },
          { text: 'يَلِدْ ', rule: 'qalqalah' },
          { text: 'وَلَمْ ' },
          { text: 'يُولَدْ', rule: 'qalqalah' },
        ],
        transliteration: 'Lam yalid wa lam yulad',
        translationEn: 'He neither begets nor is born,',
        translationBm: '"Ia tiada beranak, dan Ia pula tidak diperanakkan;"',
      },
      {
        ayahNumber: 4,
        arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        tajweedSegments: [
          { text: 'وَلَمْ ' },
          { text: 'يَكُن لَّهُ ', rule: 'idgham' },
          { text: 'كُفُوًا ' },
          { text: 'أَحَدٌ', rule: 'qalqalah' },
        ],
        transliteration: 'Wa lam yakul-lahu kufuwan ahad',
        translationEn: 'Nor is there to Him any equivalent.',
        translationBm: '"Dan tidak ada sesiapapun yang serupa denganNya."',
      },
    ],
  },
  {
    number: 36,
    nameEn: 'Ya-Sin (Selected)',
    nameAr: 'يس',
    meaningEn: 'The Heart of the Quran',
    revelationType: 'Makkiyah',
    versesCount: 83,
    virtueNote: 'Recited in Malaysian mosques and Halaqas for spiritual peace, ease, and forgiveness.',
    ayat: [
      {
        ayahNumber: 1,
        arabic: 'يس ۝ وَالْقُرْآنِ الْحَكِيمِ',
        tajweedSegments: [
          { text: 'يس ', rule: 'madd' },
          { text: 'وَالْقُرْآنِ الْحَكِيمِ', rule: 'madd' },
        ],
        transliteration: 'Ya-Sin. Wal-Quranil-Hakim',
        translationEn: 'Ya, Seen. By the wise Quran.',
        translationBm: 'Yaa, Siin. Demi Al-Quran yang mengandungi hikmat-hikmat dan kebenaran yang tetap kukuh.',
      },
      {
        ayahNumber: 58,
        arabic: 'سَلَامٌ قَوْلًا مِّن رَّبٍّ رَّحِيمٍ',
        tajweedSegments: [
          { text: 'سَلَامٌ ', rule: 'ikhfa' },
          { text: 'قَوْلًا مِّن ', rule: 'idgham' },
          { text: 'رَّبٍّ رَّحِيمٍ', rule: 'idgham' },
        ],
        transliteration: 'Salamun qawlam-mir-Rabbir-Rahim',
        translationEn: '"Peace," a word from a Merciful Lord.',
        translationBm: '(Mereka juga beroleh) ucapan salam sejahtera dari Tuhan Yang Maha Mengasihani.',
      },
    ],
  },
  {
    number: 67,
    nameEn: 'Al-Mulk (Selected)',
    nameAr: 'الملك',
    meaningEn: 'The Sovereignty',
    revelationType: 'Makkiyah',
    versesCount: 30,
    virtueNote: 'Sunnah to recite every night before sleeping; intercedes and protects from the grave.',
    ayat: [
      {
        ayahNumber: 1,
        arabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
        tajweedSegments: [
          { text: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ ' },
          { text: 'شَيْءٍ قَدِيرٌ', rule: 'ikhfa' },
        ],
        transliteration: 'Tabarakal-ladhi biyadihil-mulku wa huwa ala kulli shay’in qadir',
        translationEn: 'Blessed is He in whose hand is dominion, and He is over all things competent.',
        translationBm: 'Maha Berkat Tuhan yang menguasai pemerintahan; dan memanglah Ia Maha Kuasa atas tiap-tiap sesuatu.',
      },
      {
        ayahNumber: 2,
        arabic: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا',
        tajweedSegments: [
          { text: 'الَّذِي ' },
          { text: 'خَلَقَ ', rule: 'qalqalah' },
          { text: 'الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا' },
        ],
        transliteration: 'Alladhi khalaqal-mawta wal-hayata liyabluwakum ayyukum ahsanu amala',
        translationEn: '[He] who created death and life to test you [as to] which of you is best in deed.',
        translationBm: 'Dia lah yang telah mentakdirkan adanya mati dan hidup untuk menguji siapakah di antara kamu yang lebih baik amalnya.',
      },
    ],
  },
];

export interface ExtendedDuaItem {
  id: string;
  titleEn: string;
  category: 'Morning & Evening' | 'Sehri & Iftar' | 'Salah & Wudhu' | 'Revert & Family' | 'Ruqyah & Protection';
  arabic: string;
  transliteration: string;
  translationEn: string;
  reference: string;
  targetReps: number;
}

export const EXTENDED_DUAS: ExtendedDuaItem[] = [
  {
    id: 'dua-sehri',
    titleEn: 'Niyyah for Fasting (Sehri / Suhoor)',
    category: 'Sehri & Iftar',
    arabic: 'نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى',
    transliteration: 'Nawaytu sawma ghadin an ada’i fardi shahri Ramadana hadhihis-sanati lillahi Ta’ala',
    translationEn: 'I intend to keep the fast for tomorrow in the month of Ramadan this year sincerely for Allah the Exalted.',
    reference: 'JAKIM Panduan Puasa & Fiqh Shafi’i',
    targetReps: 1,
  },
  {
    id: 'dua-iftar',
    titleEn: 'Sunnah Dua at Iftar (Breaking Fast)',
    category: 'Sehri & Iftar',
    arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ',
    transliteration: 'Dhahabadh-dhama’u wabtallatil-’uruqu wa thabatal-ajru in sha’Allah',
    translationEn: 'The thirst has gone, the veins are moistened, and the reward is confirmed, if Allah wills.',
    reference: 'Sunan Abi Dawud 2357 (Sahih)',
    targetReps: 1,
  },
  {
    id: 'dua-morning-1',
    titleEn: 'Sayyidul Istighfar (Chief of Forgiveness)',
    category: 'Morning & Evening',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ',
    transliteration: 'Allahumma Anta Rabbi la ilaha illa Anta, khalaqtani wa ana abduka, wa ana ala ahdika wa wa’dika mastata’tu',
    translationEn: 'O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can.',
    reference: 'Sahih Al-Bukhari 6306',
    targetReps: 1,
  },
  {
    id: 'dua-morning-2',
    titleEn: 'Morning & Evening Protection Shield (3x)',
    category: 'Morning & Evening',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: 'Bismillahil-ladhi la yadurru ma’asmihi shay’un fil-ardi wa la fis-sama’i wa Huwas-Sami’ul-Alim',
    translationEn: 'In the Name of Allah with Whose Name nothing is harmed on earth nor in the heavens, and He is the All-Hearing, the All-Knowing.',
    reference: 'Sunan At-Tirmidhi 3388',
    targetReps: 3,
  },
  {
    id: 'dua-salah-1',
    titleEn: 'Dua After Completing Wudhu (Ablution)',
    category: 'Salah & Wudhu',
    arabic: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    transliteration: 'Ashhadu an la ilaha illallahu wahdahu la sharika lahu wa ashhadu anna Muhammadan abduhu wa Rasuluh',
    translationEn: 'I bear witness that none has the right to be worshipped but Allah alone, and that Muhammad is His servant and Messenger. (Opens all 8 gates of Jannah).',
    reference: 'Sahih Muslim 234',
    targetReps: 1,
  },
  {
    id: 'dua-revert-1',
    titleEn: 'Dua for Steadfastness of Heart in Islam (Revert Essential)',
    category: 'Revert & Family',
    arabic: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ',
    transliteration: 'Ya Muqallibal-qulub, thabbit qalbi ala dinik',
    translationEn: 'O Turner of the hearts, keep my heart firm and steadfast upon Your religion.',
    reference: 'Sunan At-Tirmidhi 2140',
    targetReps: 3,
  },
  {
    id: 'dua-revert-2',
    titleEn: 'Dua for Parents & Family Guidance & Harmony',
    category: 'Revert & Family',
    arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    transliteration: 'Rabbana hab lana min azwajina wa dhurriyyatina qurrata a’yunin waj’alna lil-muttaqina imama',
    translationEn: 'Our Lord, grant us from among our spouses and offspring comfort to our eyes and make us an example for the righteous.',
    reference: 'Surah Al-Furqan 25:74',
    targetReps: 1,
  },
  {
    id: 'dua-ruqyah-1',
    titleEn: 'Ruqyah Shariah for Healing & Relief from Pain',
    category: 'Ruqyah & Protection',
    arabic: 'اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَاسَ، اشْفِهِ وَأَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا',
    transliteration: 'Allahumma Rabban-nasi adhhibil-ba’sa, ishfihi wa Antash-Shafi, la shifa’a illa shifa’uka, shifa’an la yughadiru saqama',
    translationEn: 'O Allah, Lord of mankind, remove the harm and heal him, for You are the Healer; there is no healing except Your healing, a healing that leaves no illness behind.',
    reference: 'Sahih Al-Bukhari 5675',
    targetReps: 3,
  },
];

export interface RevertSalahStep {
  step: number;
  title: string;
  posture: string;
  arabic: string;
  transliteration: string;
  meaning: string;
}

export const REVERT_SALAH_STEPS: RevertSalahStep[] = [
  {
    step: 1,
    title: 'Takbiratul Ihram (Opening Takbir)',
    posture: 'Stand facing Qibla (292°), raise both hands to ears/shoulders',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    meaning: 'Allah is the Greatest',
  },
  {
    step: 2,
    title: 'Qiyam (Standing & Surah Al-Fatihah)',
    posture: 'Place right hand over left on chest, recite Al-Fatihah',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    transliteration: 'Bismillahir-Rahmanir-Rahim. Alhamdu lillahi Rabbil-alamin...',
    meaning: 'In the name of Allah... All praise is due to Allah, Lord of the worlds',
  },
  {
    step: 3,
    title: 'Ruku’ (Bowing Position)',
    posture: 'Bow with back straight and hands resting on knees (3x)',
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ',
    transliteration: 'Subhana Rabbiyal-Adhim wa bihamdih (3x)',
    meaning: 'Glory be to my Lord, the Most Great, and praise be to Him',
  },
  {
    step: 4,
    title: 'I’tidal (Rising from Bowing)',
    posture: 'Rise upright calmly before prostration',
    arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ ۝ رَبَّنَا وَلَكَ الْحَمْدُ',
    transliteration: 'Sami’Allahu liman hamidah — Rabbana wa lakal-hamd',
    meaning: 'Allah hears whoever praises Him — Our Lord, to You belongs all praise',
  },
  {
    step: 5,
    title: 'Sujud (Prostration on 7 Bones)',
    posture: 'Forehead & nose, both palms, both knees, and toes touching floor (3x)',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى وَبِحَمْدِهِ',
    transliteration: 'Subhana Rabbiyal-A’la wa bihamdih (3x)',
    meaning: 'Glory be to my Lord, the Most High, and praise be to Him',
  },
  {
    step: 6,
    title: 'Jalsah (Sitting Between Two Prostrations)',
    posture: 'Sit calmly on left foot with right foot upright',
    arabic: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَارْزُقْنِي',
    transliteration: 'Rabbighfir li warhamni wahdini warzuqni',
    meaning: 'My Lord, forgive me, have mercy on me, guide me, and provide for me',
  },
  {
    step: 7,
    title: 'Tashahhud & Taslim (Closing Salam)',
    posture: 'Recite At-Tahiyyat, Salawat, then turn head right and left',
    arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
    transliteration: 'As-salamu alaykum wa rahmatullah (Right & Left)',
    meaning: 'Peace and mercy of Allah be upon you',
  },
];

export interface ExtendedHaramCode {
  code: string;
  name: string;
  status: 'Halal' | 'Mushbooh' | 'Haram';
  origin: string;
  description: string;
  source: string;
}

export const EXTENDED_HARAM_CODES: ExtendedHaramCode[] = [
  {
    code: 'E100',
    name: 'Curcumin (Turmeric Extract)',
    status: 'Halal',
    origin: '100% Plant (Turmeric Root)',
    description: 'Natural yellow food coloring extracted from turmeric rhizomes. Universally Halal.',
    source: 'JAKIM / Universal Halal Standard',
  },
  {
    code: 'E120',
    name: 'Carmine / Cochineal Red',
    status: 'Haram',
    origin: 'Insect (Crushed Female Cochineal)',
    description: 'Red dye extracted from crushed insects. Prohibited by Hanafi & majority of Malaysian/ASEAN Halal standards.',
    source: 'JAKIM Malaysia MS 1500',
  },
  {
    code: 'E322',
    name: 'Lecithin',
    status: 'Halal',
    origin: 'Soybean / Sunflower (Check if Animal)',
    description: 'Emulsifier usually extracted from soy or sunflower oil. Halal when plant-derived.',
    source: 'JAKIM Halal Directory',
  },
  {
    code: 'E422',
    name: 'Glycerol / Glycerin',
    status: 'Mushbooh',
    origin: 'Plant Oil or Animal Tallow',
    description: 'Humectant and sweetener. Halal only if derived from palm/vegetable oil with Halal certification.',
    source: 'JAKIM / MUI Fatwa',
  },
  {
    code: 'E441',
    name: 'Gelatine (Food Grade)',
    status: 'Mushbooh',
    origin: 'Porcine Skin or Bovine Bone/Hide',
    description: 'Haram if porcine. Halal only if certified from Zabihah slaughtered cattle or fish.',
    source: 'JAKIM Halal Hub',
  },
  {
    code: 'E471',
    name: 'Mono- and Diglycerides of Fatty Acids',
    status: 'Mushbooh',
    origin: 'Palm Oil (Halal) or Animal Fat (Haram)',
    description: 'Very common bakery & ice cream emulsifier. Verify JAKIM Halal logo or "100% Vegetable Origin".',
    source: 'Islamic Food Council / JAKIM',
  },
  {
    code: 'E542',
    name: 'Edible Bone Phosphate',
    status: 'Haram',
    origin: 'Crushed Animal Bones (Often Porcine/Non-Zabihah)',
    description: 'Anti-caking agent steamed from animal bones. Avoid unless explicitly Halal certified.',
    source: 'JAKIM Food Additive Guidelines',
  },
  {
    code: 'E904',
    name: 'Shellac (Confectionery Glaze)',
    status: 'Mushbooh',
    origin: 'Lac Insect Resin (Check Alcohol Solvent)',
    description: 'Candy & fruit glaze. Permitted if ethyl alcohol solvent is evaporated or replaced with food-grade carrier.',
    source: 'Muzakarah Jawatankuasa Fatwa',
  },
  {
    code: 'E920',
    name: 'L-Cysteine (Dough Conditioner)',
    status: 'Haram',
    origin: 'Human Hair / Duck Feathers / Pig Bristles',
    description: 'Haram when derived from human hair or porcine bristles. Synthetic microbial L-Cysteine requires certification.',
    source: 'JAKIM MS 1500:2019',
  },
];

export interface ExtendedSifatName {
  number: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  reflection: string;
}

export const EXTENDED_SIFAT_NAMES: ExtendedSifatName[] = [
  { number: 1, arabic: 'الرَّحْمَٰنُ', transliteration: 'Ar-Rahman', meaning: 'The Entirely Merciful', reflection: 'His mercy encompasses every living creature in this world without exception.' },
  { number: 2, arabic: 'الرَّحِيمُ', transliteration: 'Ar-Rahim', meaning: 'The Especially Merciful', reflection: 'His special, eternal mercy bestowed upon believers in the Hereafter.' },
  { number: 3, arabic: 'الْمَلِكُ', transliteration: 'Al-Malik', meaning: 'The Eternal Sovereign', reflection: 'The absolute ruler of the heavens and earth who needs nothing from creation.' },
  { number: 4, arabic: 'الْقُدُّوسُ', transliteration: 'Al-Quddus', meaning: 'The Most Pure & Sacred', reflection: 'Transcendent above every flaw, partner, or human limitation.' },
  { number: 5, arabic: 'السَّلَامُ', transliteration: 'As-Salam', meaning: 'The Source of Peace', reflection: 'The giver of inner tranquility and safety to hearts that remember Him.' },
  { number: 6, arabic: 'الْمُؤْمِنُ', transliteration: 'Al-Mu’min', meaning: 'The Guardian of Faith', reflection: 'Grants security from fear and fulfills His promise of peace to believers.' },
  { number: 7, arabic: 'الْمُهَيْمِنُ', transliteration: 'Al-Muhaymin', meaning: 'The Preserver & Overseer', reflection: 'Watches over and protects every soul, sustenance, and hidden deed.' },
  { number: 8, arabic: 'الْعَزِيزُ', transliteration: 'Al-Aziz', meaning: 'The Almighty & Invincible', reflection: 'Honor and strength belong entirely to Him; He honors whomever He wills.' },
  { number: 9, arabic: 'الْجَبَّارُ', transliteration: 'Al-Jabbar', meaning: 'The Restorer & Mender', reflection: 'Heals broken hearts and restores the weak, oppressed, and distressed.' },
  { number: 10, arabic: 'الْغَفَّارُ', transliteration: 'Al-Ghaffar', meaning: 'The Oft-Forgiving', reflection: 'Repeatedly forgives sins and conceals faults whenever a servant repents.' },
  { number: 11, arabic: 'الرَّزَّاقُ', transliteration: 'Ar-Razzaq', meaning: 'The Total Provider', reflection: 'Guarantees physical and spiritual sustenance for every creature.' },
  { number: 12, arabic: 'الْوَهَّابُ', transliteration: 'Al-Wahhab', meaning: 'The Supreme Bestower', reflection: 'Gives gifts and guidance freely without expectation of return.' },
];
