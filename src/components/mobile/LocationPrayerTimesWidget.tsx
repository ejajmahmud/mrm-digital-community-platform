import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  RefreshCw, 
  Settings2, 
  Volume2, 
  VolumeX, 
  Compass
} from 'lucide-react';
import { LocationPrayerTimes } from '../../types';
import { 
  PRESET_CITIES, 
  CALCULATION_METHODS, 
  fetchPrayerTimesByCoordinates, 
  fetchPrayerTimesByCity, 
  getOfflineFallbackPrayerTimes,
  getNextPrayerCalculation,
  NextPrayerInfo,
  PresetCity
} from '../../services/prayerTimeService';
import { format24to12 } from '../../utils/mrmLogic';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface LocationPrayerTimesWidgetProps {
  onOpenQibla?: () => void;
}

export const LocationPrayerTimesWidget: React.FC<LocationPrayerTimesWidgetProps> = ({ 
  onOpenQibla 
}) => {
  const [selectedCity, setSelectedCity] = useState<PresetCity>(PRESET_CITIES[0]);
  const [selectedMethodId, setSelectedMethodId] = useState<number>(17); // JAKIM
  const [prayerData, setPrayerData] = useState<LocationPrayerTimes>(
    getOfflineFallbackPrayerTimes(PRESET_CITIES[0].city, PRESET_CITIES[0].country)
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [customCityQuery, setCustomCityQuery] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [nextInfo, setNextInfo] = useState<NextPrayerInfo>(
    getNextPrayerCalculation(prayerData.timings)
  );

  useEffect(() => {
    loadPrayerTimes(selectedCity.city, selectedCity.country, selectedMethodId);
  }, [selectedCity, selectedMethodId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNextInfo(getNextPrayerCalculation(prayerData.timings));
    }, 1000);
    return () => clearInterval(interval);
  }, [prayerData]);

  const loadPrayerTimes = async (city: string, country: string, methodId: number) => {
    setIsLoading(true);
    setStatusMessage('');
    try {
      const data = await fetchPrayerTimesByCity(city, country, methodId);
      setPrayerData(data);
      setNextInfo(getNextPrayerCalculation(data.timings));
      if (data.source === 'api') {
        setStatusMessage(`Live times verified for ${city}`);
      }
    } catch {
      const fallback = getOfflineFallbackPrayerTimes(city, country, 3.1390, 101.6869, methodId);
      setPrayerData(fallback);
      setNextInfo(getNextPrayerCalculation(fallback.timings));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingLocation(true);
    setStatusMessage('Detecting coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const data = await fetchPrayerTimesByCoordinates(
            latitude, 
            longitude, 
            'Detected Location', 
            selectedMethodId
          );
          setPrayerData(data);
          setNextInfo(getNextPrayerCalculation(data.timings));
          setStatusMessage(`Location updated (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`);
        } catch {
          setStatusMessage('Using local calculation.');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (err) => {
        setStatusMessage('GPS unavailable. Defaulting to Kuala Lumpur.');
        setIsDetectingLocation(false);
      },
      { timeout: 7000 }
    );
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCityQuery.trim()) return;
    loadPrayerTimes(customCityQuery.trim(), '', selectedMethodId);
  };

  const prayersList = [
    { key: 'Imsak', name: 'Imsak', arabic: 'الإمساك', time: format24to12(prayerData.timings.Imsak) },
    { key: 'Fajr', name: 'Fajr', arabic: 'الفجر', time: format24to12(prayerData.timings.Fajr) },
    { key: 'Sunrise', name: 'Syuruk', arabic: 'الشروq', time: format24to12(prayerData.timings.Sunrise) },
    { key: 'Dhuhr', name: 'Dhuhr', arabic: 'الظهر', time: format24to12(prayerData.timings.Dhuhr) },
    { key: 'Asr', name: 'Asr', arabic: 'العصر', time: format24to12(prayerData.timings.Asr) },
    { key: 'Maghrib', name: 'Maghrib', arabic: 'المغرب', time: format24to12(prayerData.timings.Maghrib) },
    { key: 'Isha', name: 'Isha', arabic: 'العشاء', time: format24to12(prayerData.timings.Isha) },
  ];

  return (
    <Card className="border-slate-200 shadow-xs">
      <CardContent className="p-4 sm:p-5 space-y-3.5">
        {/* Top Location Bar */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
              <MapPin className="w-4 h-4 text-emerald-800" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {prayerData.locationName}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  · {prayerData.source === 'api' ? 'Live' : 'Almanac'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">
                {prayerData.hijriDateStr} · {prayerData.methodName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDetectLocation}
              disabled={isDetectingLocation}
              className="h-8 w-8 rounded-lg"
              title="Auto-detect current GPS location"
              aria-label="Detect GPS Location"
            >
              <Navigation className={`w-3.5 h-3.5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
            </Button>

            <Button
              variant={showSettings ? 'secondary' : 'outline'}
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="h-8 w-8 rounded-lg"
              title="Location & Calculation Settings"
              aria-label="Settings"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Settings Drawer */}
        {showSettings && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold text-slate-700">Choose Preset Region</p>
              <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto pr-1">
                {PRESET_CITIES.map((c) => (
                  <button
                    key={c.displayName}
                    onClick={() => {
                      setSelectedCity(c);
                      setSelectedMethodId(c.defaultMethodId);
                      setShowSettings(false);
                    }}
                    className={`py-1.5 px-2.5 rounded-lg text-left truncate border text-[11px] transition-all cursor-pointer ${
                      selectedCity.city === c.city
                        ? 'bg-emerald-800 text-white border-emerald-800 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {c.displayName}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom search */}
            <form onSubmit={handleCustomSearch} className="flex gap-1.5 pt-1">
              <Input
                placeholder="Or enter city (e.g. Putrajaya, London)"
                value={customCityQuery}
                onChange={(e) => setCustomCityQuery(e.target.value)}
                className="h-9 text-xs"
              />
              <Button type="submit" size="sm" className="h-9">
                Search
              </Button>
            </form>

            {/* Calculation Method */}
            <div className="space-y-1 pt-1 border-t border-slate-200">
              <p className="text-[11px] font-semibold text-slate-700">Calculation Method</p>
              <select
                value={selectedMethodId}
                onChange={(e) => setSelectedMethodId(Number(e.target.value))}
                className="w-full h-9 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                {CALCULATION_METHODS.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {statusMessage && (
          <div className="text-[11px] text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center justify-between">
            <span>{statusMessage}</span>
            <button onClick={() => setStatusMessage('')} className="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
          </div>
        )}

        {/* Hero Next Prayer Block */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-700" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  NEXT PRAYER
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-bold text-slate-900">
                  {nextInfo.nextPrayerName}
                </h3>
                <span className="font-arabic text-emerald-800 text-lg font-semibold">
                  {nextInfo.arabicName}
                </span>
                <span className="text-sm font-mono font-bold text-slate-800">
                  {nextInfo.nextPrayerTime}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-0.5">
                Current prayer: <span className="font-medium text-slate-700">{nextInfo.currentPrayerName}</span>
              </p>
            </div>

            <div className="text-right flex flex-col items-end gap-1.5">
              <Badge variant="secondary" className="font-mono font-bold text-slate-800 text-xs py-1 px-2.5">
                {nextInfo.timeRemainingStr} left
              </Badge>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title={isMuted ? 'Unmute reminder' : 'Mute reminder'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-800" />}
              </button>
            </div>
          </div>

          {/* Simple clean progress bar */}
          <div className="space-y-1">
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-800 rounded-full transition-all duration-300"
                style={{ width: `${nextInfo.progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>{nextInfo.currentPrayerName}</span>
              <span>{nextInfo.nextPrayerName} ({nextInfo.nextPrayerTime})</span>
            </div>
          </div>
        </div>

        {/* Prayer times schedule grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {prayersList.map((p) => {
            const isNext = p.name.toLowerCase() === nextInfo.nextPrayerName.toLowerCase();
            return (
              <div
                key={p.name}
                className={`p-2.5 rounded-xl border transition-all ${
                  isNext
                    ? 'bg-emerald-50 border-emerald-300 text-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-900 flex items-center gap-1">
                    {p.name}
                    {isNext && <span className="text-[9px] bg-emerald-700 text-white px-1 rounded font-normal">Next</span>}
                  </span>
                  <span className="font-arabic text-xs text-slate-500">{p.arabic}</span>
                </div>
                <div className="mt-1">
                  <span className="font-mono font-bold text-sm text-slate-900 tabular-nums">
                    {p.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action footer */}
        <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
          <button
            onClick={() => loadPrayerTimes(selectedCity.city, selectedCity.country, selectedMethodId)}
            disabled={isLoading}
            className="flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {onOpenQibla && (
            <button
              onClick={onOpenQibla}
              className="flex items-center gap-1.5 text-emerald-800 hover:text-emerald-900 font-semibold cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Qibla Compass</span>
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
