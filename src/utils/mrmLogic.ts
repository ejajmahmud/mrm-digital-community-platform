export interface InfaqAllocationItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  category: string;
  beneficiariesPerShare?: number;
}

export interface InfaqSummary {
  subtotal: number;
  logisticsSupport: number;
  total: number;
  totalShares: number;
  estimatedBeneficiaries: number;
  lhdnTaxDeductibleAmount: number;
  receiptReference: string;
}

export function calculateInfaqSummary(
  items: InfaqAllocationItem[],
  logisticsSupport: number = 0
): InfaqSummary {
  const validItems = items.filter((i) => i.quantity > 0 && i.price >= 0);
  const subtotal = validItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalShares = validItems.reduce((sum, item) => sum + item.quantity, 0);
  const safeLogistics = Math.max(0, logisticsSupport);
  const total = subtotal + safeLogistics;

  const estimatedBeneficiaries = validItems.reduce((sum, item) => {
    const perShare = item.beneficiariesPerShare ?? (item.category === 'Food Relief' ? 4 : 1);
    return sum + item.quantity * perShare;
  }, 0);

  return {
    subtotal,
    logisticsSupport: safeLogistics,
    total,
    totalShares,
    estimatedBeneficiaries,
    lhdnTaxDeductibleAmount: total,
    receiptReference: 'LHDN-MRM-2026-88412',
  };
}

export interface CampaignProgress {
  percentage: number;
  remainingAmount: number;
  statusLabel: 'Fully Funded' | 'Near Target' | 'Active Relief';
}

export function calculateCampaignProgress(raised: number, target: number): CampaignProgress {
  if (target <= 0) {
    return { percentage: 100, remainingAmount: 0, statusLabel: 'Fully Funded' };
  }
  const safeRaised = Math.max(0, raised);
  const rawPct = Math.round((safeRaised / target) * 100);
  const percentage = Math.min(100, Math.max(0, rawPct));
  const remainingAmount = Math.max(0, target - safeRaised);

  let statusLabel: CampaignProgress['statusLabel'] = 'Active Relief';
  if (percentage >= 100) {
    statusLabel = 'Fully Funded';
  } else if (percentage >= 80) {
    statusLabel = 'Near Target';
  }

  return {
    percentage,
    remainingAmount,
    statusLabel,
  };
}

export interface LocationZoneMeta {
  code: string;
  fullLabel: string;
  city: string;
  state: string;
  country: string;
  authority: string;
  hubName: string;
  lat: number;
  lng: number;
  offsetMinutes: number;
  methodId: number;
}

export const MRM_LOCATION_ZONES: LocationZoneMeta[] = [
  {
    code: 'WLY01',
    fullLabel: 'WLY01 - Kuala Lumpur & Putrajaya',
    city: 'Kuala Lumpur',
    state: 'Wilayah Persekutuan',
    country: 'Malaysia',
    authority: 'JAKIM Malaysia',
    hubName: 'Masjid Wilayah Persekutuan Hub',
    lat: 3.139,
    lng: 101.6869,
    offsetMinutes: 0,
    methodId: 17,
  },
  {
    code: 'SGR01',
    fullLabel: 'SGR01 - Gombak, Petaling, Sepang',
    city: 'Petaling Jaya & Shah Alam',
    state: 'Selangor',
    country: 'Malaysia',
    authority: 'JAKIM / JAIS',
    hubName: 'Masjid Sultan Salahuddin Abdul Aziz Hub',
    lat: 3.1073,
    lng: 101.6067,
    offsetMinutes: 1,
    methodId: 17,
  },
  {
    code: 'PNG01',
    fullLabel: 'PNG01 - Pulau Pinang',
    city: 'George Town, Penang',
    state: 'Pulau Pinang',
    country: 'Malaysia',
    authority: 'JAKIM / JHEAIPP',
    hubName: 'Masjid Kapitan Keling Revert Hub',
    lat: 5.4141,
    lng: 100.3288,
    offsetMinutes: 7,
    methodId: 17,
  },
  {
    code: 'JHR02',
    fullLabel: 'JHR02 - Johor Bahru, Kota Tinggi',
    city: 'Johor Bahru',
    state: 'Johor',
    country: 'Malaysia',
    authority: 'JAKIM / JAINJ',
    hubName: 'Masjid Sultan Abu Bakar Hub',
    lat: 1.4927,
    lng: 103.7414,
    offsetMinutes: -6,
    methodId: 17,
  },
  {
    code: 'SBH07',
    fullLabel: 'SBH07 - Kota Kinabalu, Penampang',
    city: 'Kota Kinabalu',
    state: 'Sabah',
    country: 'Malaysia',
    authority: 'JAKIM / JHEAINS',
    hubName: 'Masjid Bandaraya Kota Kinabalu Hub',
    lat: 5.9804,
    lng: 116.0735,
    offsetMinutes: -52,
    methodId: 17,
  },
  {
    code: 'SWK08',
    fullLabel: 'SWK08 - Kuching, Samarahan',
    city: 'Kuching',
    state: 'Sarawak',
    country: 'Malaysia',
    authority: 'JAKIM / JAIS Sarawak',
    hubName: 'Masjid Jamek Sarawak Hub',
    lat: 1.5533,
    lng: 110.3592,
    offsetMinutes: -34,
    methodId: 17,
  },
  {
    code: 'SGP01',
    fullLabel: 'SGP01 - Singapore (MUIS Official)',
    city: 'Singapore',
    state: 'Central Region',
    country: 'Singapore',
    authority: 'MUIS Singapore',
    hubName: 'Masjid Sultan Regional Care Hub',
    lat: 1.3521,
    lng: 103.8198,
    offsetMinutes: -7,
    methodId: 17,
  },
  {
    code: 'MKH01',
    fullLabel: 'MKH01 - Makkah Al-Mukarramah',
    city: 'Makkah Al-Mukarramah',
    state: 'Makkah Province',
    country: 'Saudi Arabia',
    authority: 'Umm Al-Qura University',
    hubName: 'Al-Masjid Al-Haram Guidance Hub',
    lat: 21.3891,
    lng: 39.8579,
    offsetMinutes: -30,
    methodId: 4,
  },
  {
    code: 'DHK01',
    fullLabel: 'DHK01 - Dhaka, Bangladesh',
    city: 'Dhaka',
    state: 'Dhaka Division',
    country: 'Bangladesh',
    authority: 'Islamic Foundation',
    hubName: 'Baitul Mukarram Community Hub',
    lat: 23.8103,
    lng: 90.4125,
    offsetMinutes: -55,
    methodId: 1,
  },
];

export function calculateDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function resolveZoneMeta(zoneInput: string = 'WLY01'): LocationZoneMeta {
  const safe = typeof zoneInput === 'string' && zoneInput.trim() ? zoneInput.trim() : 'WLY01';
  const codePrefix = safe.split(' ')[0].toUpperCase();
  const matched =
    MRM_LOCATION_ZONES.find(
      (z) =>
        z.code === codePrefix ||
        safe.toUpperCase().startsWith(z.code) ||
        z.city.toLowerCase() === safe.toLowerCase()
    ) || MRM_LOCATION_ZONES[0];
  return matched;
}

export function findNearestLocationZone(lat: number, lng: number): {
  zone: LocationZoneMeta;
  distanceKm: number;
} {
  let bestZone = MRM_LOCATION_ZONES[0];
  let bestDist = Infinity;

  for (const zone of MRM_LOCATION_ZONES) {
    const d = calculateDistanceKm(lat, lng, zone.lat, zone.lng);
    if (d < bestDist) {
      bestDist = d;
      bestZone = zone;
    }
  }

  return {
    zone: bestZone,
    distanceKm: bestDist,
  };
}

export interface PrayerScheduleItem {
  id: string;
  name: string;
  arabicName: string;
  time24: string;
  endTime24?: string;
  rakaatSummary?: string;
  minutesFromMidnight: number;
  endMinutesFromMidnight?: number;
}

export const JAKIM_WLY01_PRAYERS: PrayerScheduleItem[] = [
  {
    id: 'fajr',
    name: 'Subuh',
    arabicName: 'الفجر',
    time24: '05:48',
    endTime24: '07:00',
    rakaatSummary: '2 Sunnah · 2 Farz',
    minutesFromMidnight: 5 * 60 + 48,
    endMinutesFromMidnight: 7 * 60,
  },
  {
    id: 'syuruk',
    name: 'Syuruk',
    arabicName: 'الشروق',
    time24: '07:01',
    endTime24: '07:16',
    rakaatSummary: 'Sunrise (No Salah)',
    minutesFromMidnight: 7 * 60 + 1,
    endMinutesFromMidnight: 7 * 60 + 16,
  },
  {
    id: 'dhuhr',
    name: 'Zohor',
    arabicName: 'الظهر',
    time24: '13:08',
    endTime24: '16:23',
    rakaatSummary: '4 Sunnah · 4 Farz · 2 Sunnah',
    minutesFromMidnight: 13 * 60 + 8,
    endMinutesFromMidnight: 16 * 60 + 23,
  },
  {
    id: 'asr',
    name: 'Asar',
    arabicName: 'العصر',
    time24: '16:24',
    endTime24: '19:11',
    rakaatSummary: '4 Sunnah · 4 Farz',
    minutesFromMidnight: 16 * 60 + 24,
    endMinutesFromMidnight: 19 * 60 + 11,
  },
  {
    id: 'maghrib',
    name: 'Maghrib',
    arabicName: 'المغرب',
    time24: '19:12',
    endTime24: '20:21',
    rakaatSummary: '3 Farz · 2 Sunnah',
    minutesFromMidnight: 19 * 60 + 12,
    endMinutesFromMidnight: 20 * 60 + 21,
  },
  {
    id: 'isha',
    name: 'Isyak',
    arabicName: 'العشاء',
    time24: '20:22',
    endTime24: '05:47',
    rakaatSummary: '4 Farz · 2 Sunnah · 3 Witr',
    minutesFromMidnight: 20 * 60 + 22,
    endMinutesFromMidnight: 5 * 60 + 47,
  },
];

export function formatMinutesTo24h(totalMinutes: number): string {
  const normalized = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60)
    .toString()
    .padStart(2, '0');
  const m = (normalized % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

export function parse24hToMinutes(time24: string): number {
  if (!time24 || typeof time24 !== 'string') return 0;
  const match = time24.match(/(\d{1,2}):(\d{2})/);
  if (!match) return 0;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function getPrayersForZone(zoneCode: string = 'WLY01'): PrayerScheduleItem[] {
  const meta = resolveZoneMeta(zoneCode);
  const offset = meta.offsetMinutes;

  return JAKIM_WLY01_PRAYERS.map((p) => {
    const totalMins = p.minutesFromMidnight + offset;
    const endMins = (p.endMinutesFromMidnight ?? p.minutesFromMidnight + 60) + offset;
    return {
      ...p,
      time24: formatMinutesTo24h(totalMins),
      endTime24: formatMinutesTo24h(endMins),
      minutesFromMidnight: totalMins,
      endMinutesFromMidnight: endMins,
    };
  });
}

export interface ForbiddenPrayerWindow {
  id: string;
  name: string;
  arabicName: string;
  startTime24: string;
  endTime24: string;
  reason: string;
}

export interface NaflPrayerWindow {
  id: string;
  name: string;
  arabicName: string;
  startTime24: string;
  endTime24: string;
  rakaat: string;
  virtue: string;
}

export interface WaqtAndFastingAlmanac {
  zoneCode: string;
  sehriEnds24: string;
  fajrStarts24: string;
  iftarMaghrib24: string;
  fastingDurationLabel: string;
  farzPrayers: PrayerScheduleItem[];
  naflPrayers: NaflPrayerWindow[];
  forbiddenWindows: ForbiddenPrayerWindow[];
}

export function getWaqtAndForbiddenSchedule(
  zoneCode: string = 'WLY01',
  customPrayers?: PrayerScheduleItem[]
): WaqtAndFastingAlmanac {
  const prayers = customPrayers && customPrayers.length >= 6 ? customPrayers : getPrayersForZone(zoneCode);
  const fajr = prayers.find((p) => p.id === 'fajr') || prayers[0];
  const syuruk = prayers.find((p) => p.id === 'syuruk') || prayers[1];
  const dhuhr = prayers.find((p) => p.id === 'dhuhr') || prayers[2];
  const maghrib = prayers.find((p) => p.id === 'maghrib') || prayers[4];
  const isha = prayers.find((p) => p.id === 'isha') || prayers[5];

  // Imsak / Sehri ends 10 minutes before Fajr
  const sehriEndMins = fajr.minutesFromMidnight - 10;
  const iftarMins = maghrib.minutesFromMidnight;
  const fastMins = Math.max(0, iftarMins - sehriEndMins);
  const fastHrs = Math.floor(fastMins / 60);
  const fastRemMins = fastMins % 60;

  // 3 Prohibited / Forbidden (Makruh Tahrimi) windows per Hadith (Sahih Muslim 831)
  const forbiddenWindows: ForbiddenPrayerWindow[] = [
    {
      id: 'tulu',
      name: "Tulu' (Sunrise Window)",
      arabicName: 'طلوع الشمس',
      startTime24: formatMinutesTo24h(syuruk.minutesFromMidnight),
      endTime24: formatMinutesTo24h(syuruk.minutesFromMidnight + 15),
      reason: 'From sunrise until the sun rises a spear-length (~15 mins after Syuruk).',
    },
    {
      id: 'istiwa',
      name: 'Istiwa / Zawal (Solar Zenith)',
      arabicName: 'استواء الشمس',
      startTime24: formatMinutesTo24h(dhuhr.minutesFromMidnight - 6),
      endTime24: formatMinutesTo24h(dhuhr.minutesFromMidnight - 1),
      reason: 'When the sun is directly overhead at meridian until it passes into Zohor.',
    },
    {
      id: 'ghurub',
      name: 'Ghurub (Sunset Window)',
      arabicName: 'غروب الشمس',
      startTime24: formatMinutesTo24h(maghrib.minutesFromMidnight - 15),
      endTime24: formatMinutesTo24h(maghrib.minutesFromMidnight - 1),
      reason: 'When the sun begins to set until complete sunset at Maghrib (except today’s Asar Farz).',
    },
  ];

  const naflPrayers: NaflPrayerWindow[] = [
    {
      id: 'tahajjud',
      name: 'Tahajjud & Qiyamul Lail',
      arabicName: 'التهجد',
      startTime24: '02:30',
      endTime24: formatMinutesTo24h(sehriEndMins),
      rakaat: '2 to 8 Rakaat',
      virtue: 'Last third of the night when Allah descends to answer supplications.',
    },
    {
      id: 'ishraq',
      name: 'Salat al-Ishraq',
      arabicName: 'الإشراق',
      startTime24: formatMinutesTo24h(syuruk.minutesFromMidnight + 16),
      endTime24: formatMinutesTo24h(syuruk.minutesFromMidnight + 60),
      rakaat: '2 Rakaat',
      virtue: 'Reward of a complete Hajj and Umrah when prayed after Fajr remembrance.',
    },
    {
      id: 'duha',
      name: 'Salat al-Duha (Chasht)',
      arabicName: 'الضحى',
      startTime24: formatMinutesTo24h(syuruk.minutesFromMidnight + 61),
      endTime24: formatMinutesTo24h(dhuhr.minutesFromMidnight - 10),
      rakaat: '2, 4, or 8 Rakaat',
      virtue: 'Fulfills charity due on every single joint of the human body (360 joints).',
    },
    {
      id: 'awwabin',
      name: 'Salat al-Awwabin',
      arabicName: 'الأوابين',
      startTime24: formatMinutesTo24h(maghrib.minutesFromMidnight + 15),
      endTime24: formatMinutesTo24h(isha.minutesFromMidnight - 5),
      rakaat: '2 to 6 Rakaat',
      virtue: 'Prayer of the oft-returning penitent between Maghrib and Isyak.',
    },
  ];

  return {
    zoneCode,
    sehriEnds24: formatMinutesTo24h(sehriEndMins),
    fajrStarts24: fajr.time24,
    iftarMaghrib24: maghrib.time24,
    fastingDurationLabel: `${fastHrs}h ${fastRemMins}m`,
    farzPrayers: prayers.filter((p) => p.id !== 'syuruk'),
    naflPrayers,
    forbiddenWindows,
  };
}

export interface NextPrayerInfo {
  nextPrayer: PrayerScheduleItem;
  minutesRemaining: number;
  countdownLabel: string;
}

export function getNextPrayerInfo(
  currentMinutesFromMidnight?: number,
  prayers: PrayerScheduleItem[] = JAKIM_WLY01_PRAYERS,
  customSecondsFromMidnight?: number
): NextPrayerInfo {
  let minutes = currentMinutesFromMidnight;
  let seconds = customSecondsFromMidnight;
  if (minutes === undefined) {
    const now = new Date();
    minutes = now.getHours() * 60 + now.getMinutes();
    seconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  }
  const normalizedMinutes = ((minutes % 1440) + 1440) % 1440;
  const upcoming = prayers.find((p) => p.minutesFromMidnight > normalizedMinutes);

  const calculateCountdown = (prayerMinutes: number) => {
    let diffSec: number;
    if (seconds !== undefined) {
      const prayerSec = prayerMinutes * 60;
      const curSec = ((seconds % 86400) + 86400) % 86400;
      diffSec = prayerSec > curSec ? prayerSec - curSec : (86400 - curSec) + prayerSec;
    } else {
      const diffMin = prayerMinutes > normalizedMinutes ? prayerMinutes - normalizedMinutes : (1440 - normalizedMinutes) + prayerMinutes;
      diffSec = diffMin * 60;
    }
    const hrs = Math.floor(diffSec / 3600);
    const mins = Math.floor((diffSec % 3600) / 60);
    const secs = diffSec % 60;
    let label = '';
    if (hrs > 0) label = `${hrs}h ${mins}m ${secs}s`;
    else if (mins > 0) label = `${mins}m ${secs}s`;
    else label = `${secs}s`;
    return { diffMin: Math.ceil(diffSec / 60), label };
  };

  if (upcoming) {
    const { diffMin, label } = calculateCountdown(upcoming.minutesFromMidnight);
    return {
      nextPrayer: upcoming,
      minutesRemaining: diffMin,
      countdownLabel: label,
    };
  }

  // Wrap around to next day's Subuh
  const firstPrayer = prayers[0];
  const { diffMin, label } = calculateCountdown(firstPrayer.minutesFromMidnight);
  return {
    nextPrayer: firstPrayer,
    minutesRemaining: diffMin,
    countdownLabel: label,
  };
}

export interface QiblaCalculationResult {
  bearingDegrees: number;
  cardinalDirection: string;
  distanceKm: number;
}

const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

export function calculateQiblaAndDistance(lat: number, lng: number): QiblaCalculationResult {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const phi1 = toRad(lat);
  const phi2 = toRad(KAABA_LAT);
  const deltaLambda = toRad(KAABA_LNG - lng);

  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);
  const rawBearing = (toDeg(Math.atan2(y, x)) + 360) % 360;
  const bearingDegrees = Math.round(rawBearing * 10) / 10;

  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const cardinalDirection = dirs[Math.round(bearingDegrees / 22.5) % 16];

  // Haversine distance in km
  const R = 6371;
  const dLat = toRad(KAABA_LAT - lat);
  const dLon = toRad(KAABA_LNG - lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round(R * c);

  return {
    bearingDegrees,
    cardinalDirection,
    distanceKm,
  };
}

export interface NearbyMrmFacility {
  id: string;
  name: string;
  type: 'Mosque & Revert Hub' | 'Halal Food Bank' | 'MRM Welfare Clinic';
  city: string;
  lat: number;
  lng: number;
  distanceKm: number;
}

const MRM_FACILITIES_CATALOG: Omit<NearbyMrmFacility, 'distanceKm'>[] = [
  {
    id: 'fac-wilayah',
    name: 'Masjid Wilayah Persekutuan Revert Center',
    type: 'Mosque & Revert Hub',
    city: 'Kuala Lumpur',
    lat: 3.1722,
    lng: 101.6708,
  },
  {
    id: 'fac-setapak',
    name: 'MRM National HQ & Halal Aid Pantry (Setapak)',
    type: 'Halal Food Bank',
    city: 'Kuala Lumpur',
    lat: 3.1932,
    lng: 101.7145,
  },
  {
    id: 'fac-shah-alam',
    name: 'Masjid Sultan Salahuddin Asnaf Hub',
    type: 'Mosque & Revert Hub',
    city: 'Shah Alam',
    lat: 3.0786,
    lng: 101.521,
  },
  {
    id: 'fac-penang',
    name: 'Masjid Kapitan Keling Revert Care Desk',
    type: 'Mosque & Revert Hub',
    city: 'George Town',
    lat: 5.417,
    lng: 100.3376,
  },
  {
    id: 'fac-jb',
    name: 'Masjid Sultan Abu Bakar Southern Relief Hub',
    type: 'Halal Food Bank',
    city: 'Johor Bahru',
    lat: 1.4566,
    lng: 103.7511,
  },
  {
    id: 'fac-kk',
    name: 'Masjid Bandaraya Kota Kinabalu Outreach',
    type: 'MRM Welfare Clinic',
    city: 'Kota Kinabalu',
    lat: 5.9989,
    lng: 116.1076,
  },
  {
    id: 'fac-kuching',
    name: 'Masjid Jamek Sarawak Revert Sanctuary',
    type: 'Mosque & Revert Hub',
    city: 'Kuching',
    lat: 1.5841,
    lng: 110.3401,
  },
];

export function getNearbyMrmFacilities(lat: number, lng: number): NearbyMrmFacility[] {
  return MRM_FACILITIES_CATALOG.map((f) => ({
    ...f,
    distanceKm: calculateDistanceKm(lat, lng, f.lat, f.lng),
  })).sort((a, b) => a.distanceKm - b.distanceKm);
}

export interface LocationSyncSnapshot {
  zone: LocationZoneMeta;
  zoneCode: string;
  fullZoneLabel: string;
  cityLabel: string;
  hubName: string;
  authority: string;
  lat: number;
  lng: number;
  qibla: QiblaCalculationResult;
  prayers: PrayerScheduleItem[];
  almanac: WaqtAndFastingAlmanac;
  nextPrayerInfo: NextPrayerInfo;
  nearbyFacilities: NearbyMrmFacility[];
}

export function getLocationSyncSnapshot(
  zoneInput: string = 'WLY01',
  customMinutesFromMidnight?: number,
  customCoords?: { lat: number; lng: number },
  customSecondsFromMidnight?: number
): LocationSyncSnapshot {
  const resolvedZone = customCoords
    ? findNearestLocationZone(customCoords.lat, customCoords.lng).zone
    : resolveZoneMeta(zoneInput);

  const activeLat = customCoords?.lat ?? resolvedZone.lat;
  const activeLng = customCoords?.lng ?? resolvedZone.lng;

  const prayers = getPrayersForZone(resolvedZone.code);
  const almanac = getWaqtAndForbiddenSchedule(resolvedZone.code, prayers);
  const nextPrayerInfo = getNextPrayerInfo(customMinutesFromMidnight, prayers, customSecondsFromMidnight);
  const qibla = calculateQiblaAndDistance(activeLat, activeLng);
  const nearbyFacilities = getNearbyMrmFacilities(activeLat, activeLng);

  return {
    zone: resolvedZone,
    zoneCode: resolvedZone.code,
    fullZoneLabel: resolvedZone.fullLabel,
    cityLabel: resolvedZone.city,
    hubName: resolvedZone.hubName,
    authority: resolvedZone.authority,
    lat: activeLat,
    lng: activeLng,
    qibla,
    prayers,
    almanac,
    nextPrayerInfo,
    nearbyFacilities,
  };
}

export interface FitrahAndFidyahResult {
  fitrahTotal: number;
  fidyahTotal: number;
  combinedObligation: number;
  riceGradeLabel: string;
}

export function calculateFitrahAndFidyah(
  dependentsCount: number,
  riceRateRM: 7 | 14 | 21 = 14,
  missedFastDays: number = 0,
  fidyahRatePerDayRM: number = 4
): FitrahAndFidyahResult {
  const safeDependents = Math.max(1, Math.round(dependentsCount));
  const safeMissedDays = Math.max(0, Math.round(missedFastDays));
  const fitrahTotal = safeDependents * riceRateRM;
  const fidyahTotal = safeMissedDays * fidyahRatePerDayRM;

  const gradeMap: Record<number, string> = {
    7: 'Local Super Special Rice (RM 7)',
    14: 'Imported Fragrant / Thai White Rice (RM 14)',
    21: 'Basmati / Premium Japonica Rice (RM 21)',
  };

  return {
    fitrahTotal,
    fidyahTotal,
    combinedObligation: fitrahTotal + fidyahTotal,
    riceGradeLabel: gradeMap[riceRateRM] || 'Standard Fitrah Rate',
  };
}

export interface CalendarMonthMeta {
  index: number;
  gregorianMonth: string;
  shortMonth: string;
  year: number;
  hijriMonth: string;
  hijriYear: string;
  daysCount: number;
  startWeekdayOffset: number; // 0 = Mon, 6 = Sun
  eventDays: number[];
  sunnahFastDays: number[];
  hijriStartDay: number;
}

export const MRM_CALENDAR_MONTHS: CalendarMonthMeta[] = [
  {
    index: 0,
    gregorianMonth: 'September',
    shortMonth: 'Sep',
    year: 2026,
    hijriMonth: "Rabi' al-Awwal",
    hijriYear: '1448H',
    daysCount: 30,
    startWeekdayOffset: 1, // Tue
    eventDays: [4, 8, 12, 18, 22, 27],
    sunnahFastDays: [3, 7, 10, 14, 17, 21, 24, 25, 26, 28],
    hijriStartDay: 19,
  },
  {
    index: 1,
    gregorianMonth: 'October',
    shortMonth: 'Oct',
    year: 2026,
    hijriMonth: "Rabi' al-Thani",
    hijriYear: '1448H',
    daysCount: 31,
    startWeekdayOffset: 3, // Thu
    eventDays: [3, 7, 12, 16, 20, 24, 28],
    sunnahFastDays: [1, 5, 8, 12, 15, 19, 22, 24, 25, 26, 29],
    hijriStartDay: 19,
  },
  {
    index: 2,
    gregorianMonth: 'November',
    shortMonth: 'Nov',
    year: 2026,
    hijriMonth: 'Jumada al-Awwal',
    hijriYear: '1448H',
    daysCount: 30,
    startWeekdayOffset: 6, // Sun
    eventDays: [2, 6, 14, 19, 25, 29],
    sunnahFastDays: [2, 5, 9, 12, 16, 19, 23, 24, 25, 26, 30],
    hijriStartDay: 20,
  },
  {
    index: 3,
    gregorianMonth: 'December',
    shortMonth: 'Dec',
    year: 2026,
    hijriMonth: 'Jumada al-Thani',
    hijriYear: '1448H',
    daysCount: 31,
    startWeekdayOffset: 1, // Tue
    eventDays: [5, 11, 15, 20, 26, 30],
    sunnahFastDays: [3, 7, 10, 14, 17, 21, 23, 24, 25, 28, 31],
    hijriStartDay: 20,
  },
  {
    index: 4,
    gregorianMonth: 'January',
    shortMonth: 'Jan',
    year: 2027,
    hijriMonth: 'Rajab',
    hijriYear: '1448H',
    daysCount: 31,
    startWeekdayOffset: 4, // Fri
    eventDays: [3, 9, 14, 21, 25, 30],
    sunnahFastDays: [4, 7, 11, 14, 18, 21, 22, 23, 24, 25, 28],
    hijriStartDay: 22,
  },
];

export function getCalendarMonthInfo(monthIndex: number, day: number) {
  const safeIndex = Math.max(0, Math.min(MRM_CALENDAR_MONTHS.length - 1, monthIndex));
  const meta = MRM_CALENDAR_MONTHS[safeIndex];
  const clampedDay = Math.max(1, Math.min(meta.daysCount, day));
  const hijriDay = ((meta.hijriStartDay + clampedDay - 2) % 30) + 1;
  const isEventDay = meta.eventDays.includes(clampedDay);
  const isSunnahFastDay =
    meta.sunnahFastDays.includes(clampedDay) || [13, 14, 15].includes(hijriDay);
  const isAyyamAlBeedh = [13, 14, 15].includes(hijriDay);

  return {
    meta,
    clampedDay,
    hijriDay,
    hijriDateLabel: `${hijriDay} ${meta.hijriMonth} ${meta.hijriYear}`,
    isEventDay,
    isSunnahFastDay,
    isAyyamAlBeedh,
  };
}

export interface ZakatAssessment {
  eligibleAnnualWealth: number;
  nisabThreshold: number;
  isAboveNisab: boolean;
  annualZakat: number;
  monthlyZakat: number;
}

export function calculateZakatObligation(
  monthlyIncome: number,
  annualSavings: number,
  nisabThreshold: number = 24000
): ZakatAssessment {
  const safeIncome = Math.max(0, monthlyIncome);
  const safeSavings = Math.max(0, annualSavings);
  // Standard 40% basic living deduction on income + 100% of haul savings
  const assessableIncome = Math.round(safeIncome * 12 * 0.6);
  const eligibleAnnualWealth = assessableIncome + safeSavings;
  const isAboveNisab = eligibleAnnualWealth >= nisabThreshold;
  const annualZakat = isAboveNisab ? Math.round(eligibleAnnualWealth * 0.025) : 0;
  const monthlyZakat = isAboveNisab ? Math.max(10, Math.round(annualZakat / 12)) : 0;

  return {
    eligibleAnnualWealth,
    nisabThreshold,
    isAboveNisab,
    annualZakat,
    monthlyZakat,
  };
}

export function formatLiveHijriDate(date: Date = new Date()): { full: string; day: number; month: string; year: string } {
  try {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).formatToParts(date);
    const d = parts.find(p => p.type === 'day')?.value || '1';
    const m = parts.find(p => p.type === 'month')?.value || "Rabi' al-Thani";
    const y = parts.find(p => p.type === 'year')?.value || '1448';
    return {
      full: `${d} ${m} ${y} AH`,
      day: parseInt(d, 10),
      month: m,
      year: `${y} AH`
    };
  } catch {
    return { full: "14 Rabi' al-Thani 1448 AH", day: 14, month: "Rabi' al-Thani", year: "1448 AH" };
  }
}

export interface DynamicMonthInfo {
  year: number;
  monthIndex: number;
  gregorianMonth: string;
  shortMonth: string;
  daysCount: number;
  startWeekdayOffset: number;
  clampedDay: number;
  hijriDay: number;
  hijriMonth: string;
  hijriYear: string;
  hijriDateLabel: string;
  isEventDay: boolean;
  isSunnahFastDay: boolean;
  isAyyamAlBeedh: boolean;
  isToday: boolean;
}

export function getDynamicCalendarMonth(year: number, month: number, day: number): DynamicMonthInfo {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const clampedDay = Math.max(1, Math.min(daysInMonth, day));
  const firstDayWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // 0 = Mon, 6 = Sun
  
  const targetDate = new Date(year, month, clampedDay);
  const hijri = formatLiveHijriDate(targetDate);

  const dayOfWeek = targetDate.getDay();
  const isSunnahFastDay = (dayOfWeek === 1 || dayOfWeek === 4) || [13, 14, 15].includes(hijri.day);
  const isAyyamAlBeedh = [13, 14, 15].includes(hijri.day);
  const isEventDay = (clampedDay % 4 === 0) || (dayOfWeek === 5);

  const now = new Date();
  const isToday = now.getFullYear() === year && now.getMonth() === month && now.getDate() === clampedDay;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return {
    year,
    monthIndex: month,
    gregorianMonth: monthNames[month],
    shortMonth: monthNames[month].slice(0, 3),
    daysCount: daysInMonth,
    startWeekdayOffset: firstDayWeekday,
    clampedDay,
    hijriDay: hijri.day,
    hijriMonth: hijri.month,
    hijriYear: hijri.year,
    hijriDateLabel: hijri.full,
    isEventDay,
    isSunnahFastDay,
    isAyyamAlBeedh,
    isToday,
  };
}

export function generateICalendarBooking(booking: {
  title: string;
  role: string;
  location: string;
  dateStr: string; // YYYY-MM-DD
  slot: string;
}): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const dtStamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}00Z`;
  
  const cleanDate = booking.dateStr.replace(/-/g, '');
  let startH = 9, startM = 0, endH = 12, endM = 0;
  if (booking.slot.includes('02:00')) { startH = 14; endH = 17; }
  else if (booking.slot.includes('07:30')) { startH = 19; startM = 30; endH = 21; endM = 30; }

  const dtStart = `${cleanDate}T${pad(startH)}${pad(startM)}00`;
  const dtEnd = `${cleanDate}T${pad(endH)}${pad(endM)}00`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MRM Care//Digital Community Platform//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:mrm-${Date.now()}@mrm.org.my`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:MRM Care: ${booking.title} (${booking.role})`,
    `DESCRIPTION:Confirmed duty shift with Multiracial Reverted Muslims (MRM).\nSlot: ${booking.slot}\nLocation: ${booking.location}`,
    `LOCATION:${booking.location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}
