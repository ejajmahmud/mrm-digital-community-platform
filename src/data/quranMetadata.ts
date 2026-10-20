export interface SurahMeta {
  number: number;
  nameEn: string;
  nameAr: string;
  meaningEn: string;
  revelationType: 'Makkiyah' | 'Madaniyah';
  versesCount: number;
  juz: number;
}

export interface LiveAyah {
  numberInSurah: number;
  arabic: string;
  translationEn: string;
  translationBm: string;
  audioUrl?: string;
}

export interface QariReciter {
  id: string;
  name: string;
  serverSubdomain: string;
  ayahAudioSubfolder: string;
}

export const QURAN_RECITERS: QariReciter[] = [
  {
    id: 'mishary',
    name: 'Mishary Rashid Alafasy',
    serverSubdomain: 'server8',
    ayahAudioSubfolder: 'Alafasy_128kbps',
  },
  {
    id: 'abdul_basit',
    name: 'Abdul Basit (Murattal)',
    serverSubdomain: 'server7',
    ayahAudioSubfolder: 'Abdul_Basit_Murattal_64kbps',
  },
  {
    id: 'ghamadi',
    name: 'Saad Al-Ghamdi',
    serverSubdomain: 'server7',
    ayahAudioSubfolder: 'Ghamadi_40kbps',
  },
  {
    id: 'sudais',
    name: 'Abdur-Rahman as-Sudais',
    serverSubdomain: 'server11',
    ayahAudioSubfolder: 'Abdurrahmaan_As-Sudais_192kbps',
  },
];

export const ALL_114_SURAHS: SurahMeta[] = [
  { number: 1, nameEn: 'Al-Fatihah', nameAr: 'الفاتحة', meaningEn: 'The Opening', revelationType: 'Makkiyah', versesCount: 7, juz: 1 },
  { number: 2, nameEn: 'Al-Baqarah', nameAr: 'البقرة', meaningEn: 'The Cow', revelationType: 'Madaniyah', versesCount: 286, juz: 1 },
  { number: 3, nameEn: 'Ali \'Imran', nameAr: 'آل عمران', meaningEn: 'Family of Imran', revelationType: 'Madaniyah', versesCount: 200, juz: 3 },
  { number: 4, nameEn: 'An-Nisa', nameAr: 'النساء', meaningEn: 'The Women', revelationType: 'Madaniyah', versesCount: 176, juz: 4 },
  { number: 5, nameEn: 'Al-Ma\'idah', nameAr: 'المائدة', meaningEn: 'The Table Spread', revelationType: 'Madaniyah', versesCount: 120, juz: 6 },
  { number: 6, nameEn: 'Al-An\'am', nameAr: 'الأنعام', meaningEn: 'The Cattle', revelationType: 'Makkiyah', versesCount: 165, juz: 7 },
  { number: 7, nameEn: 'Al-A\'raf', nameAr: 'الأعراف', meaningEn: 'The Heights', revelationType: 'Makkiyah', versesCount: 206, juz: 8 },
  { number: 8, nameEn: 'Al-Anfal', nameAr: 'الأنفال', meaningEn: 'The Spoils of War', revelationType: 'Madaniyah', versesCount: 75, juz: 9 },
  { number: 9, nameEn: 'At-Tawbah', nameAr: 'التوبة', meaningEn: 'The Repentance', revelationType: 'Madaniyah', versesCount: 129, juz: 10 },
  { number: 10, nameEn: 'Yunus', nameAr: 'يونس', meaningEn: 'Jonah', revelationType: 'Makkiyah', versesCount: 109, juz: 11 },
  { number: 11, nameEn: 'Hud', nameAr: 'هود', meaningEn: 'Hud', revelationType: 'Makkiyah', versesCount: 123, juz: 11 },
  { number: 12, nameEn: 'Yusuf', nameAr: 'يوسف', meaningEn: 'Joseph', revelationType: 'Makkiyah', versesCount: 111, juz: 12 },
  { number: 13, nameEn: 'Ar-Ra\'d', nameAr: 'الرعد', meaningEn: 'The Thunder', revelationType: 'Madaniyah', versesCount: 43, juz: 13 },
  { number: 14, nameEn: 'Ibrahim', nameAr: 'إبراهيم', meaningEn: 'Abraham', revelationType: 'Makkiyah', versesCount: 52, juz: 13 },
  { number: 15, nameEn: 'Al-Hijr', nameAr: 'الحجر', meaningEn: 'The Rocky Tract', revelationType: 'Makkiyah', versesCount: 99, juz: 14 },
  { number: 16, nameEn: 'An-Nahl', nameAr: 'النحل', meaningEn: 'The Bee', revelationType: 'Makkiyah', versesCount: 128, juz: 14 },
  { number: 17, nameEn: 'Al-Isra', nameAr: 'الإسراء', meaningEn: 'The Night Journey', revelationType: 'Makkiyah', versesCount: 111, juz: 15 },
  { number: 18, nameEn: 'Al-Kahf', nameAr: 'الكهف', meaningEn: 'The Cave', revelationType: 'Makkiyah', versesCount: 110, juz: 15 },
  { number: 19, nameEn: 'Maryam', nameAr: 'مريم', meaningEn: 'Mary', revelationType: 'Makkiyah', versesCount: 98, juz: 16 },
  { number: 20, nameEn: 'Ta-Ha', nameAr: 'طه', meaningEn: 'Ta-Ha', revelationType: 'Makkiyah', versesCount: 135, juz: 16 },
  { number: 21, nameEn: 'Al-Anbiya', nameAr: 'الأنبياء', meaningEn: 'The Prophets', revelationType: 'Makkiyah', versesCount: 112, juz: 17 },
  { number: 22, nameEn: 'Al-Hajj', nameAr: 'الحج', meaningEn: 'The Pilgrimage', revelationType: 'Madaniyah', versesCount: 78, juz: 17 },
  { number: 23, nameEn: 'Al-Mu\'minun', nameAr: 'المؤمنون', meaningEn: 'The Believers', revelationType: 'Makkiyah', versesCount: 118, juz: 18 },
  { number: 24, nameEn: 'An-Nur', nameAr: 'النور', meaningEn: 'The Light', revelationType: 'Madaniyah', versesCount: 64, juz: 18 },
  { number: 25, nameEn: 'Al-Furqan', nameAr: 'الفرقان', meaningEn: 'The Criterion', revelationType: 'Makkiyah', versesCount: 77, juz: 18 },
  { number: 26, nameEn: 'Ash-Shu\'ara', nameAr: 'الشعراء', meaningEn: 'The Poets', revelationType: 'Makkiyah', versesCount: 227, juz: 19 },
  { number: 27, nameEn: 'An-Naml', nameAr: 'النمل', meaningEn: 'The Ant', revelationType: 'Makkiyah', versesCount: 93, juz: 19 },
  { number: 28, nameEn: 'Al-Qasas', nameAr: 'القصص', meaningEn: 'The Stories', revelationType: 'Makkiyah', versesCount: 88, juz: 20 },
  { number: 29, nameEn: 'Al-\'Ankabut', nameAr: 'العنكبوت', meaningEn: 'The Spider', revelationType: 'Makkiyah', versesCount: 69, juz: 20 },
  { number: 30, nameEn: 'Ar-Rum', nameAr: 'الروم', meaningEn: 'The Romans', revelationType: 'Makkiyah', versesCount: 60, juz: 21 },
  { number: 31, nameEn: 'Luqman', nameAr: 'لقمان', meaningEn: 'Luqman', revelationType: 'Makkiyah', versesCount: 34, juz: 21 },
  { number: 32, nameEn: 'As-Sajdah', nameAr: 'السجدة', meaningEn: 'The Prostration', revelationType: 'Makkiyah', versesCount: 30, juz: 21 },
  { number: 33, nameEn: 'Al-Ahzab', nameAr: 'الأحزاب', meaningEn: 'The Combined Forces', revelationType: 'Madaniyah', versesCount: 73, juz: 21 },
  { number: 34, nameEn: 'Saba', nameAr: 'سبأ', meaningEn: 'Sheba', revelationType: 'Makkiyah', versesCount: 54, juz: 22 },
  { number: 35, nameEn: 'Fatir', nameAr: 'فاطر', meaningEn: 'Originator', revelationType: 'Makkiyah', versesCount: 45, juz: 22 },
  { number: 36, nameEn: 'Ya-Sin', nameAr: 'يس', meaningEn: 'The Heart of the Quran', revelationType: 'Makkiyah', versesCount: 83, juz: 22 },
  { number: 37, nameEn: 'As-Saffat', nameAr: 'الصافات', meaningEn: 'Those who set the Ranks', revelationType: 'Makkiyah', versesCount: 182, juz: 23 },
  { number: 38, nameEn: 'Sad', nameAr: 'ص', meaningEn: 'The Letter Sad', revelationType: 'Makkiyah', versesCount: 88, juz: 23 },
  { number: 39, nameEn: 'Az-Zumar', nameAr: 'الزمر', meaningEn: 'The Troops', revelationType: 'Makkiyah', versesCount: 75, juz: 23 },
  { number: 40, nameEn: 'Ghafir', nameAr: 'غافر', meaningEn: 'The Forgiver', revelationType: 'Makkiyah', versesCount: 85, juz: 24 },
  { number: 41, nameEn: 'Fussilat', nameAr: 'فصلت', meaningEn: 'Explained in Detail', revelationType: 'Makkiyah', versesCount: 54, juz: 24 },
  { number: 42, nameEn: 'Ash-Shura', nameAr: 'الشورى', meaningEn: 'The Consultation', revelationType: 'Makkiyah', versesCount: 53, juz: 25 },
  { number: 43, nameEn: 'Az-Zukhruf', nameAr: 'الزخرف', meaningEn: 'The Ornaments of Gold', revelationType: 'Makkiyah', versesCount: 89, juz: 25 },
  { number: 44, nameEn: 'Ad-Dukhan', nameAr: 'الدخان', meaningEn: 'The Smoke', revelationType: 'Makkiyah', versesCount: 59, juz: 25 },
  { number: 45, nameEn: 'Al-Jathiyah', nameAr: 'الجاثية', meaningEn: 'The Crouching', revelationType: 'Makkiyah', versesCount: 37, juz: 25 },
  { number: 46, nameEn: 'Al-Ahqaf', nameAr: 'الأحقاف', meaningEn: 'The Wind-Curved Sandhills', revelationType: 'Makkiyah', versesCount: 35, juz: 26 },
  { number: 47, nameEn: 'Muhammad', nameAr: 'محمد', meaningEn: 'Muhammad', revelationType: 'Madaniyah', versesCount: 38, juz: 26 },
  { number: 48, nameEn: 'Al-Fath', nameAr: 'الفتح', meaningEn: 'The Victory', revelationType: 'Madaniyah', versesCount: 29, juz: 26 },
  { number: 49, nameEn: 'Al-Hujurat', nameAr: 'الحجرات', meaningEn: 'The Rooms', revelationType: 'Madaniyah', versesCount: 18, juz: 26 },
  { number: 50, nameEn: 'Qaf', nameAr: 'ق', meaningEn: 'The Letter Qaf', revelationType: 'Makkiyah', versesCount: 45, juz: 26 },
  { number: 51, nameEn: 'Adh-Dhariyat', nameAr: 'الذاريات', meaningEn: 'The Winnowing Winds', revelationType: 'Makkiyah', versesCount: 60, juz: 26 },
  { number: 52, nameEn: 'At-Tur', nameAr: 'الطور', meaningEn: 'The Mount', revelationType: 'Makkiyah', versesCount: 49, juz: 27 },
  { number: 53, nameEn: 'An-Najm', nameAr: 'النجم', meaningEn: 'The Star', revelationType: 'Makkiyah', versesCount: 62, juz: 27 },
  { number: 54, nameEn: 'Al-Qamar', nameAr: 'القمر', meaningEn: 'The Moon', revelationType: 'Makkiyah', versesCount: 55, juz: 27 },
  { number: 55, nameEn: 'Ar-Rahman', nameAr: 'الرحمن', meaningEn: 'The Beneficent', revelationType: 'Madaniyah', versesCount: 78, juz: 27 },
  { number: 56, nameEn: 'Al-Waqi\'ah', nameAr: 'الواقعة', meaningEn: 'The Inevitable', revelationType: 'Makkiyah', versesCount: 96, juz: 27 },
  { number: 57, nameEn: 'Al-Hadid', nameAr: 'الحديد', meaningEn: 'The Iron', revelationType: 'Madaniyah', versesCount: 29, juz: 27 },
  { number: 58, nameEn: 'Al-Mujadila', nameAr: 'المجادلة', meaningEn: 'The Pleading Woman', revelationType: 'Madaniyah', versesCount: 22, juz: 28 },
  { number: 59, nameEn: 'Al-Hashr', nameAr: 'الحشر', meaningEn: 'The Exile', revelationType: 'Madaniyah', versesCount: 24, juz: 28 },
  { number: 60, nameEn: 'Al-Mumtahanah', nameAr: 'الممتحنة', meaningEn: 'She that is to be examined', revelationType: 'Madaniyah', versesCount: 13, juz: 28 },
  { number: 61, nameEn: 'As-Saff', nameAr: 'الصف', meaningEn: 'The Ranks', revelationType: 'Madaniyah', versesCount: 14, juz: 28 },
  { number: 62, nameEn: 'Al-Jumu\'ah', nameAr: 'الجمعة', meaningEn: 'Friday Congregation', revelationType: 'Madaniyah', versesCount: 11, juz: 28 },
  { number: 63, nameEn: 'Al-Munafiqun', nameAr: 'المنافقون', meaningEn: 'The Hypocrites', revelationType: 'Madaniyah', versesCount: 11, juz: 28 },
  { number: 64, nameEn: 'At-Taghabun', nameAr: 'التغابن', meaningEn: 'The Mutual Disillusion', revelationType: 'Madaniyah', versesCount: 18, juz: 28 },
  { number: 65, nameEn: 'At-Talaq', nameAr: 'الطلاق', meaningEn: 'The Divorce', revelationType: 'Madaniyah', versesCount: 12, juz: 28 },
  { number: 66, nameEn: 'At-Tahrim', nameAr: 'التحريم', meaningEn: 'The Prohibition', revelationType: 'Madaniyah', versesCount: 12, juz: 28 },
  { number: 67, nameEn: 'Al-Mulk', nameAr: 'الملك', meaningEn: 'The Sovereignty', revelationType: 'Makkiyah', versesCount: 30, juz: 29 },
  { number: 68, nameEn: 'Al-Qalam', nameAr: 'القلم', meaningEn: 'The Pen', revelationType: 'Makkiyah', versesCount: 52, juz: 29 },
  { number: 69, nameEn: 'Al-Haqqah', nameAr: 'الحاقة', meaningEn: 'The Inevitable Reality', revelationType: 'Makkiyah', versesCount: 52, juz: 29 },
  { number: 70, nameEn: 'Al-Ma\'arij', nameAr: 'المعارج', meaningEn: 'The Ascending Stairways', revelationType: 'Makkiyah', versesCount: 44, juz: 29 },
  { number: 71, nameEn: 'Nuh', nameAr: 'نوح', meaningEn: 'Noah', revelationType: 'Makkiyah', versesCount: 28, juz: 29 },
  { number: 72, nameEn: 'Al-Jinn', nameAr: 'الجن', meaningEn: 'The Jinn', revelationType: 'Makkiyah', versesCount: 28, juz: 29 },
  { number: 73, nameEn: 'Al-Muzzammil', nameAr: 'المزمل', meaningEn: 'The Enshrouded One', revelationType: 'Makkiyah', versesCount: 20, juz: 29 },
  { number: 74, nameEn: 'Al-Muddaththir', nameAr: 'المدثر', meaningEn: 'The Cloaked One', revelationType: 'Makkiyah', versesCount: 56, juz: 29 },
  { number: 75, nameEn: 'Al-Qiyamah', nameAr: 'القيامة', meaningEn: 'The Resurrection', revelationType: 'Makkiyah', versesCount: 40, juz: 29 },
  { number: 76, nameEn: 'Al-Insan', nameAr: 'الإنسان', meaningEn: 'Man', revelationType: 'Madaniyah', versesCount: 31, juz: 29 },
  { number: 77, nameEn: 'Al-Mursalat', nameAr: 'المرسلات', meaningEn: 'The Emissaries', revelationType: 'Makkiyah', versesCount: 50, juz: 29 },
  { number: 78, nameEn: 'An-Naba', nameAr: 'النبأ', meaningEn: 'The Great Tidings', revelationType: 'Makkiyah', versesCount: 40, juz: 30 },
  { number: 79, nameEn: 'An-Nazi\'at', nameAr: 'النازعات', meaningEn: 'Those who pull out', revelationType: 'Makkiyah', versesCount: 46, juz: 30 },
  { number: 80, nameEn: '\'Abasa', nameAr: 'عبس', meaningEn: 'He Frowned', revelationType: 'Makkiyah', versesCount: 42, juz: 30 },
  { number: 81, nameEn: 'At-Takwir', nameAr: 'التكوير', meaningEn: 'The Overthrowing', revelationType: 'Makkiyah', versesCount: 29, juz: 30 },
  { number: 82, nameEn: 'Al-Infitar', nameAr: 'الانفطار', meaningEn: 'The Cleaving', revelationType: 'Makkiyah', versesCount: 19, juz: 30 },
  { number: 83, nameEn: 'Al-Mutaffifin', nameAr: 'المطففين', meaningEn: 'The Defrauders', revelationType: 'Makkiyah', versesCount: 36, juz: 30 },
  { number: 84, nameEn: 'Al-Inshiqaq', nameAr: 'الانشقاق', meaningEn: 'The Splitting Asunder', revelationType: 'Makkiyah', versesCount: 25, juz: 30 },
  { number: 85, nameEn: 'Al-Buruj', nameAr: 'البروج', meaningEn: 'The Great Constellations', revelationType: 'Makkiyah', versesCount: 22, juz: 30 },
  { number: 86, nameEn: 'At-Tariq', nameAr: 'الطارق', meaningEn: 'The Night-Comer', revelationType: 'Makkiyah', versesCount: 17, juz: 30 },
  { number: 87, nameEn: 'Al-A\'la', nameAr: 'الأعلى', meaningEn: 'The Most High', revelationType: 'Makkiyah', versesCount: 19, juz: 30 },
  { number: 88, nameEn: 'Al-Ghashiyah', nameAr: 'الغاشية', meaningEn: 'The Overwhelming Event', revelationType: 'Makkiyah', versesCount: 26, juz: 30 },
  { number: 89, nameEn: 'Al-Fajr', nameAr: 'الفجر', meaningEn: 'The Break of Dawn', revelationType: 'Makkiyah', versesCount: 30, juz: 30 },
  { number: 90, nameEn: 'Al-Balad', nameAr: 'البلد', meaningEn: 'The City', revelationType: 'Makkiyah', versesCount: 20, juz: 30 },
  { number: 91, nameEn: 'Ash-Shams', nameAr: 'الشمس', meaningEn: 'The Sun', revelationType: 'Makkiyah', versesCount: 15, juz: 30 },
  { number: 92, nameEn: 'Al-Layl', nameAr: 'الليل', meaningEn: 'The Night', revelationType: 'Makkiyah', versesCount: 21, juz: 30 },
  { number: 93, nameEn: 'Ad-Duha', nameAr: 'الضحى', meaningEn: 'The Bright Morning Hours', revelationType: 'Makkiyah', versesCount: 11, juz: 30 },
  { number: 94, nameEn: 'Ash-Sharh', nameAr: 'الشرح', meaningEn: 'The Expansion of Chest', revelationType: 'Makkiyah', versesCount: 8, juz: 30 },
  { number: 95, nameEn: 'At-Tin', nameAr: 'التين', meaningEn: 'The Fig and the Olive', revelationType: 'Makkiyah', versesCount: 8, juz: 30 },
  { number: 96, nameEn: 'Al-\'Alaq', nameAr: 'العلق', meaningEn: 'The Clinging Clot', revelationType: 'Makkiyah', versesCount: 19, juz: 30 },
  { number: 97, nameEn: 'Al-Qadr', nameAr: 'القدر', meaningEn: 'The Night of Decree', revelationType: 'Makkiyah', versesCount: 5, juz: 30 },
  { number: 98, nameEn: 'Al-Bayyinah', nameAr: 'البينة', meaningEn: 'The Clear Evidence', revelationType: 'Madaniyah', versesCount: 8, juz: 30 },
  { number: 99, nameEn: 'Az-Zalzalah', nameAr: 'الزلزلة', meaningEn: 'The Earthquake', revelationType: 'Madaniyah', versesCount: 8, juz: 30 },
  { number: 100, nameEn: 'Al-\'Adiyat', nameAr: 'العاديات', meaningEn: 'The War Horses', revelationType: 'Makkiyah', versesCount: 11, juz: 30 },
  { number: 101, nameEn: 'Al-Qari\'ah', nameAr: 'القارعة', meaningEn: 'The Calamity', revelationType: 'Makkiyah', versesCount: 11, juz: 30 },
  { number: 102, nameEn: 'At-Takathur', nameAr: 'التكاثر', meaningEn: 'The Piling Up', revelationType: 'Makkiyah', versesCount: 8, juz: 30 },
  { number: 103, nameEn: 'Al-\'Asr', nameAr: 'العصر', meaningEn: 'The Flight of Time', revelationType: 'Makkiyah', versesCount: 3, juz: 30 },
  { number: 104, nameEn: 'Al-Humazah', nameAr: 'الهمزة', meaningEn: 'The Slanderer', revelationType: 'Makkiyah', versesCount: 9, juz: 30 },
  { number: 105, nameEn: 'Al-Fil', nameAr: 'الفيل', meaningEn: 'The Elephant', revelationType: 'Makkiyah', versesCount: 5, juz: 30 },
  { number: 106, nameEn: 'Quraysh', nameAr: 'قريش', meaningEn: 'Quraysh', revelationType: 'Makkiyah', versesCount: 4, juz: 30 },
  { number: 107, nameEn: 'Al-Ma\'un', nameAr: 'الماعون', meaningEn: 'Small Kindnesses', revelationType: 'Makkiyah', versesCount: 7, juz: 30 },
  { number: 108, nameEn: 'Al-Kawthar', nameAr: 'الكوثر', meaningEn: 'Abundance of Good', revelationType: 'Makkiyah', versesCount: 3, juz: 30 },
  { number: 109, nameEn: 'Al-Kafirun', nameAr: 'الكافرون', meaningEn: 'The Disbelievers', revelationType: 'Makkiyah', versesCount: 6, juz: 30 },
  { number: 110, nameEn: 'An-Nasr', nameAr: 'النصر', meaningEn: 'Divine Help and Victory', revelationType: 'Madaniyah', versesCount: 3, juz: 30 },
  { number: 111, nameEn: 'Al-Masad', nameAr: 'المسد', meaningEn: 'The Twisted Strands of Palm', revelationType: 'Makkiyah', versesCount: 5, juz: 30 },
  { number: 112, nameEn: 'Al-Ikhlas', nameAr: 'الإخلاص', meaningEn: 'Purity of Faith (Tawheed)', revelationType: 'Makkiyah', versesCount: 4, juz: 30 },
  { number: 113, nameEn: 'Al-Falaq', nameAr: 'الفلق', meaningEn: 'The Rising Dawn', revelationType: 'Makkiyah', versesCount: 5, juz: 30 },
  { number: 114, nameEn: 'An-Nas', nameAr: 'الناس', meaningEn: 'Mankind', revelationType: 'Makkiyah', versesCount: 6, juz: 30 },
];

export function getSurahAudioUrl(surahNumber: number, reciterId: string = 'mishary'): string {
  const pad3 = (n: number) => n.toString().padStart(3, '0');
  const reciter = QURAN_RECITERS.find((r) => r.id === reciterId) || QURAN_RECITERS[0];
  return `https://${reciter.serverSubdomain}.mp3quran.net/${reciter.id === 'mishary' ? 'afs' : reciter.id === 'abdul_basit' ? 'basit' : 'ghamdi'}/${pad3(surahNumber)}.mp3`;
}

export function getAyahAudioUrl(surahNumber: number, ayahNumber: number, reciterId: string = 'mishary'): string {
  const reciter = QURAN_RECITERS.find((r) => r.id === reciterId) || QURAN_RECITERS[0];
  const pad3 = (n: number) => n.toString().padStart(3, '0');
  return `https://everyayah.com/data/${reciter.ayahAudioSubfolder}/${pad3(surahNumber)}${pad3(ayahNumber)}.mp3`;
}

export async function fetchFullSurahFromApi(surahNumber: number): Promise<LiveAyah[]> {
  try {
    const cached = localStorage.getItem(`mrm_surah_full_${surahNumber}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  try {
    const res = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih,ms.basmeih`,
      { cache: 'force-cache' }
    );
    if (!res.ok) throw new Error('Failed to fetch from Quran API');
    const json = await res.json();
    if (!json.data || !Array.isArray(json.data) || json.data.length < 3) {
      throw new Error('Invalid Quran API response format');
    }

    const arabicAyat = json.data[0].ayahs;
    const englishAyat = json.data[1].ayahs;
    const malayAyat = json.data[2].ayahs;

    const combined: LiveAyah[] = arabicAyat.map((a: any, idx: number) => ({
      numberInSurah: a.numberInSurah,
      arabic: a.text,
      translationEn: englishAyat[idx]?.text || '',
      translationBm: malayAyat[idx]?.text || englishAyat[idx]?.text || '',
      audioUrl: a.audio || getAyahAudioUrl(surahNumber, a.numberInSurah),
    }));

    try {
      localStorage.setItem(`mrm_surah_full_${surahNumber}`, JSON.stringify(combined));
    } catch {}

    return combined;
  } catch (err) {
    console.warn(`Fallback to offline Quran data for surah ${surahNumber}:`, err);
    return [];
  }
}
