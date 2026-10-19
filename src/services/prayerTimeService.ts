import { LocationPrayerTimes } from '../types';

export interface CalculationMethod {
  id: number;
  name: string;
  shortName: string;
}

export const CALCULATION_METHODS: CalculationMethod[] = [
  { id: 17, name: 'Jabatan Kemajuan Islam Malaysia (JAKIM)', shortName: 'JAKIM (Malaysia)' },
  { id: 4, name: 'Umm Al-Qura University, Makkah', shortName: 'Umm Al-Qura (Makkah)' },
  { id: 3, name: 'Muslim World League (MWL)', shortName: 'Muslim World League' },
  { id: 2, name: 'Islamic Society of North America (ISNA)', shortName: 'ISNA (North America)' },
  { id: 5, name: 'Egyptian General Authority of Survey', shortName: 'Egyptian Authority' },
  { id: 1, name: 'University of Islamic Sciences, Karachi', shortName: 'Karachi' },
];

export interface PresetCity {
  city: string;
  country: string;
  displayName: string;
  lat: number;
  lng: number;
  defaultMethodId: number;
}

export const PRESET_CITIES: PresetCity[] = [
  { city: 'Kuala Lumpur', country: 'Malaysia', displayName: 'Kuala Lumpur, Malaysia', lat: 3.1390, lng: 101.6869, defaultMethodId: 17 },
  { city: 'Petaling Jaya', country: 'Malaysia', displayName: 'Petaling Jaya / Selangor', lat: 3.1073, lng: 101.6067, defaultMethodId: 17 },
  { city: 'Shah Alam', country: 'Malaysia', displayName: 'Shah Alam, Selangor', lat: 3.0738, lng: 101.5183, defaultMethodId: 17 },
  { city: 'Cyberjaya', country: 'Malaysia', displayName: 'Cyberjaya / Putrajaya', lat: 2.9213, lng: 101.6559, defaultMethodId: 17 },
  { city: 'George Town', country: 'Malaysia', displayName: 'Penang (George Town)', lat: 5.4141, lng: 100.3288, defaultMethodId: 17 },
  { city: 'Johor Bahru', country: 'Malaysia', displayName: 'Johor Bahru, Malaysia', lat: 1.4927, lng: 103.7414, defaultMethodId: 17 },
  { city: 'Singapore', country: 'Singapore', displayName: 'Singapore (MUIS)', lat: 1.3521, lng: 103.8198, defaultMethodId: 17 },
  { city: 'Mecca', country: 'Saudi Arabia', displayName: 'Makkah Al-Mukarramah', lat: 21.3891, lng: 39.8579, defaultMethodId: 4 },
  { city: 'Medina', country: 'Saudi Arabia', displayName: 'Madinah Al-Munawwarah', lat: 24.5247, lng: 39.5692, defaultMethodId: 4 },
  { city: 'Jakarta', country: 'Indonesia', displayName: 'Jakarta, Indonesia', lat: -6.2088, lng: 106.8456, defaultMethodId: 17 },
  { city: 'London', country: 'United Kingdom', displayName: 'London, United Kingdom', lat: 51.5074, lng: -0.1278, defaultMethodId: 3 },
  { city: 'New York', country: 'United States', displayName: 'New York, USA', lat: 40.7128, lng: -74.0060, defaultMethodId: 2 },
];

/**
 * Format raw time from API (e.g., "05:48 (MYT)" -> "05:48")
 */
function cleanTimeStr(raw: string): string {
  if (!raw) return '--:--';
  const match = raw.match(/(\d{1,2}:\d{2})/);
  return match ? match[1] : raw.slice(0, 5);
}

/**
 * Fallback static computation in case of network offline / sandbox isolation
 */
export function getOfflineFallbackPrayerTimes(
  city: string = 'Kuala Lumpur',
  country: string = 'Malaysia',
  lat: number = 3.1390,
  lng: number = 101.6869,
  methodId: number = 17
): LocationPrayerTimes {
  const method = CALCULATION_METHODS.find(m => m.id === methodId) || CALCULATION_METHODS[0];
  const now = new Date();
  
  return {
    locationName: city,
    country: country,
    latitude: lat,
    longitude: lng,
    dateStr: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    hijriDateStr: '14 Rabi\' al-Thani 1448',
    hijriYear: '1448',
    hijriMonthEn: 'Rabi\' al-Thani',
    hijriMonthAr: 'رَبِيعُ الثَّانِي',
    timings: {
      Imsak: '05:38',
      Fajr: '05:48',
      Sunrise: '06:58',
      Dhuhr: '13:08',
      Asr: '16:22',
      Maghrib: '19:12',
      Isha: '20:21',
      Midnight: '00:30',
    },
    methodName: method.shortName,
    methodId: method.id,
    source: 'fallback',
  };
}

/**
 * Fetch prayer times by latitude and longitude
 */
export async function fetchPrayerTimesByCoordinates(
  lat: number,
  lng: number,
  locationLabel: string = 'Current Location',
  methodId: number = 17
): Promise<LocationPrayerTimes> {
  const method = CALCULATION_METHODS.find(m => m.id === methodId) || CALCULATION_METHODS[0];
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const today = new Date();
    const timestamp = Math.floor(today.getTime() / 1000);
    const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lng}&method=${methodId}`;

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`Aladhan API HTTP ${res.status}`);
    const json = await res.json();
    const data = json.data;

    return {
      locationName: locationLabel,
      country: data.meta?.timezone || 'Local Zone',
      latitude: lat,
      longitude: lng,
      dateStr: data.date?.readable || today.toLocaleDateString(),
      hijriDateStr: `${data.date?.hijri?.day} ${data.date?.hijri?.month?.en} ${data.date?.hijri?.year}`,
      hijriYear: data.date?.hijri?.year || '1448',
      hijriMonthEn: data.date?.hijri?.month?.en || 'Rabi\' al-Thani',
      hijriMonthAr: data.date?.hijri?.month?.ar || '',
      timings: {
        Imsak: cleanTimeStr(data.timings.Imsak),
        Fajr: cleanTimeStr(data.timings.Fajr),
        Sunrise: cleanTimeStr(data.timings.Sunrise),
        Dhuhr: cleanTimeStr(data.timings.Dhuhr),
        Asr: cleanTimeStr(data.timings.Asr),
        Maghrib: cleanTimeStr(data.timings.Maghrib),
        Isha: cleanTimeStr(data.timings.Isha),
        Midnight: cleanTimeStr(data.timings.Midnight),
      },
      methodName: method.shortName,
      methodId: method.id,
      source: 'api',
    };
  } catch (err) {
    console.warn('Prayer time API fetch failed, using reliable fallback:', err);
    return getOfflineFallbackPrayerTimes(locationLabel, 'Malaysia', lat, lng, methodId);
  }
}

/**
 * Fetch prayer times by city and country
 */
export async function fetchPrayerTimesByCity(
  city: string,
  country: string,
  methodId: number = 17
): Promise<LocationPrayerTimes> {
  const method = CALCULATION_METHODS.find(m => m.id === methodId) || CALCULATION_METHODS[0];
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${methodId}`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`Aladhan API HTTP ${res.status}`);
    const json = await res.json();
    const data = json.data;

    return {
      locationName: city,
      country: country,
      latitude: Number(data.meta?.latitude) || 3.1390,
      longitude: Number(data.meta?.longitude) || 101.6869,
      dateStr: data.date?.readable || new Date().toLocaleDateString(),
      hijriDateStr: `${data.date?.hijri?.day} ${data.date?.hijri?.month?.en} ${data.date?.hijri?.year}`,
      hijriYear: data.date?.hijri?.year || '1448',
      hijriMonthEn: data.date?.hijri?.month?.en || 'Rabi\' al-Thani',
      hijriMonthAr: data.date?.hijri?.month?.ar || '',
      timings: {
        Imsak: cleanTimeStr(data.timings.Imsak),
        Fajr: cleanTimeStr(data.timings.Fajr),
        Sunrise: cleanTimeStr(data.timings.Sunrise),
        Dhuhr: cleanTimeStr(data.timings.Dhuhr),
        Asr: cleanTimeStr(data.timings.Asr),
        Maghrib: cleanTimeStr(data.timings.Maghrib),
        Isha: cleanTimeStr(data.timings.Isha),
        Midnight: cleanTimeStr(data.timings.Midnight),
      },
      methodName: method.shortName,
      methodId: method.id,
      source: 'api',
    };
  } catch (err) {
    console.warn(`Prayer time API city fetch failed for ${city}, using fallback:`, err);
    const preset = PRESET_CITIES.find(p => p.city.toLowerCase() === city.toLowerCase());
    return getOfflineFallbackPrayerTimes(
      city, 
      country, 
      preset?.lat || 3.1390, 
      preset?.lng || 101.6869, 
      methodId
    );
  }
}

export interface NextPrayerInfo {
  currentPrayerName: string;
  nextPrayerName: string;
  nextPrayerTime: string;
  timeRemainingStr: string;
  minutesRemaining: number;
  progressPercent: number;
  arabicName: string;
}

/**
 * Calculate the next prayer and time remaining from timings
 */
export function getNextPrayerCalculation(timings: LocationPrayerTimes['timings']): NextPrayerInfo {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const parseMinutes = (timeStr: string) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const prayers = [
    { name: 'Fajr', arabic: 'الفجر', minutes: parseMinutes(timings.Fajr), time: timings.Fajr },
    { name: 'Sunrise', arabic: 'الشروق', minutes: parseMinutes(timings.Sunrise), time: timings.Sunrise },
    { name: 'Dhuhr', arabic: 'الظهر', minutes: parseMinutes(timings.Dhuhr), time: timings.Dhuhr },
    { name: 'Asr', arabic: 'العصر', minutes: parseMinutes(timings.Asr), time: timings.Asr },
    { name: 'Maghrib', arabic: 'المغرب', minutes: parseMinutes(timings.Maghrib), time: timings.Maghrib },
    { name: 'Isha', arabic: 'العشاء', minutes: parseMinutes(timings.Isha), time: timings.Isha },
  ];

  // Find next prayer today
  let next = prayers.find(p => p.minutes > currentMinutes);
  let current = prayers.slice().reverse().find(p => p.minutes <= currentMinutes) || prayers[prayers.length - 1];

  let minutesDiff = 0;
  if (next) {
    minutesDiff = next.minutes - currentMinutes;
  } else {
    // Next prayer is Fajr tomorrow (after midnight or Isha)
    next = prayers[0];
    const minutesUntilMidnight = 24 * 60 - currentMinutes;
    minutesDiff = minutesUntilMidnight + next.minutes;
  }

  // Format hours and minutes remaining
  const hours = Math.floor(minutesDiff / 60);
  const mins = minutesDiff % 60;
  const timeRemainingStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  // Estimate interval percentage
  const totalInterval = 180; // approximate average ~3 hours between prayers
  const elapsed = Math.max(0, totalInterval - minutesDiff);
  const progressPercent = Math.min(100, Math.max(5, Math.round((elapsed / totalInterval) * 100)));

  return {
    currentPrayerName: current.name,
    nextPrayerName: next.name,
    nextPrayerTime: next.time,
    timeRemainingStr,
    minutesRemaining: minutesDiff,
    progressPercent,
    arabicName: next.arabic,
  };
}
