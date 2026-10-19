import React, { useState } from 'react';
import { 
  X, 
  Compass, 
  Volume2, 
  RotateCcw, 
  Search,
  Play, 
  Pause, 
  Sparkles
} from 'lucide-react';
import { 
  INITIAL_PRAYER_TIMES, 
  DUA_LIST, 
  DHIKR_LIST, 
  SIFAT_NAMES, 
  HARAM_CODES 
} from '../../../data/mockData';
import { LocationPrayerTimesWidget } from '../LocationPrayerTimesWidget';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';

interface UtilitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

export const UtilitiesModal: React.FC<UtilitiesModalProps> = ({ 
  isOpen, 
  onClose, 
  initialTab = 'prayer' 
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Dhikr Counter State
  const [selectedDhikrIndex, setSelectedDhikrIndex] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);

  // Audio Quran State
  const [selectedReciter, setSelectedReciter] = useState('Mishary Rashid Alafasy');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSurah, setCurrentSurah] = useState('Surah Al-Fatihah (1)');

  // Dua Search
  const [duaSearch, setDuaSearch] = useState('');

  // Haram Codes Search
  const [eCodeSearch, setECodeSearch] = useState('');

  // Zakat Calculator State
  const [cashVal, setCashVal] = useState<number>(15000);
  const [goldVal, setGoldVal] = useState<number>(3000);
  const [debtVal, setDebtVal] = useState<number>(2000);
  const nisabThreshold = 24000;
  const netWealth = Math.max(0, cashVal + goldVal - debtVal);
  const zakatDue = netWealth >= nisabThreshold ? netWealth * 0.025 : 0;

  if (!isOpen) return null;

  const currentDhikr = DHIKR_LIST[selectedDhikrIndex];

  const filteredDuas = DUA_LIST.filter(d => 
    d.shortNameEn.toLowerCase().includes(duaSearch.toLowerCase()) ||
    d.translation.toLowerCase().includes(duaSearch.toLowerCase()) ||
    d.category.toLowerCase().includes(duaSearch.toLowerCase())
  );

  const filteredCodes = HARAM_CODES.filter(c =>
    c.code.toLowerCase().includes(eCodeSearch.toLowerCase()) ||
    c.name.toLowerCase().includes(eCodeSearch.toLowerCase()) ||
    c.status.toLowerCase().includes(eCodeSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-emerald-800">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Islamic Utilities</h2>
              <p className="text-xs text-slate-500">Daily faith tools & verified references</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex gap-1 overflow-x-auto text-xs">
          {[
            { id: 'prayer', label: 'Prayer & Qibla' },
            { id: 'tasbih', label: 'Dhikr / Tasbih' },
            { id: 'quran', label: 'Audio Quran' },
            { id: 'dua', label: 'Duas' },
            { id: 'sifat', label: '99 Names' },
            { id: 'halal', label: 'E-Codes' },
            { id: 'zakat', label: 'Zakat Calc' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`py-1.5 px-3 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* 1. PRAYER & QIBLA */}
          {activeTab === 'prayer' && (
            <div className="space-y-4">
              <LocationPrayerTimesWidget />

              {/* Qibla Direction */}
              <Card className="border-slate-200 shadow-xs">
                <CardContent className="p-4 space-y-3 text-center">
                  <div className="flex items-center justify-between text-xs text-slate-700">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-emerald-800" /> Qibla Bearing
                    </span>
                    <span className="font-mono text-emerald-800 font-bold">292° WNW</span>
                  </div>

                  <div className="w-24 h-24 mx-auto relative flex items-center justify-center rounded-full border-2 border-slate-200 bg-slate-50">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] text-slate-400 absolute top-1 font-mono">N</span>
                      <span className="text-[10px] text-slate-400 absolute bottom-1 font-mono">S</span>
                      <span className="text-[10px] text-slate-400 absolute left-2 font-mono">W</span>
                      <span className="text-[10px] text-slate-400 absolute right-2 font-mono">E</span>
                    </div>
                    <div 
                      className="w-1.5 h-14 bg-emerald-800 rounded-full transform rotate-[292deg] transition-transform duration-700 origin-center"
                    />
                    <div className="w-2.5 h-2.5 bg-emerald-700 rounded-full z-10 border border-white" />
                  </div>
                  <p className="text-xs text-slate-500">
                    Distance to Holy Kaaba in Makkah: ~7,015 km
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 2. DHIKR / TASBIH */}
          {activeTab === 'tasbih' && (
            <div className="space-y-4 text-center">
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                {DHIKR_LIST.map((d, idx) => (
                  <button
                    key={d.id}
                    onClick={() => { setSelectedDhikrIndex(idx); setCurrentCount(0); }}
                    className={`py-1 px-3 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                      selectedDhikrIndex === idx
                        ? 'bg-emerald-800 text-white font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {d.transliteration}
                  </button>
                ))}
              </div>

              <Card className="border-slate-200 shadow-xs">
                <CardContent className="p-6 space-y-4">
                  <p className="text-2xl font-arabic text-emerald-900 leading-loose">
                    {currentDhikr.arabic}
                  </p>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-slate-900">{currentDhikr.transliteration}</h4>
                    <p className="text-xs text-slate-500">{currentDhikr.translation}</p>
                  </div>

                  {/* Tap counter */}
                  <button
                    type="button"
                    onClick={() => setCurrentCount(prev => prev + 1)}
                    className="w-32 h-32 mx-auto rounded-full bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white shadow-md flex flex-col items-center justify-center transition-all cursor-pointer"
                  >
                    <span className="text-3xl font-bold font-mono tabular-nums">
                      {currentCount}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-emerald-100 mt-0.5">
                      Tap to count
                    </span>
                  </button>

                  <div className="flex items-center justify-between px-2 pt-2 text-xs text-slate-500">
                    <span>Target: {currentDhikr.targetCount}x</span>
                    <button
                      onClick={() => setCurrentCount(0)}
                      className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-left border border-slate-200 text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">Virtue:</span> {currentDhikr.benefits}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 3. AUDIO QURAN */}
          {activeTab === 'quran' && (
            <div className="space-y-4">
              <Card className="border-slate-200 shadow-xs">
                <CardContent className="p-4 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Select Qari / Reciter</label>
                    <select
                      value={selectedReciter}
                      onChange={(e) => setSelectedReciter(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                    >
                      <option value="Mishary Rashid Alafasy">Mishary Rashid Alafasy</option>
                      <option value="Abdul Rahman Al-Sudais">Abdul Rahman Al-Sudais (Imam of Makkah)</option>
                      <option value="Saad Al-Ghamdi">Saad Al-Ghamdi</option>
                    </select>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{currentSurah}</p>
                      <p className="text-[11px] text-slate-500">{selectedReciter}</p>
                    </div>
                    <Button
                      size="icon"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="h-9 w-9 rounded-full"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Surah List */}
              <div className="space-y-1.5">
                {[
                  { num: 1, name: 'Al-Fatihah', meaning: 'The Opening', verses: 7 },
                  { num: 36, name: 'Ya-Sin', meaning: 'Ya-Sin', verses: 83 },
                  { num: 55, name: 'Ar-Rahman', meaning: 'The Beneficent', verses: 78 },
                  { num: 67, name: 'Al-Mulk', meaning: 'The Sovereignty', verses: 30 },
                  { num: 112, name: 'Al-Ikhlas', meaning: 'Sincerity', verses: 4 },
                ].map((s) => (
                  <button
                    key={s.num}
                    onClick={() => {
                      setCurrentSurah(`Surah ${s.name} (${s.num})`);
                      setIsPlaying(true);
                    }}
                    className="w-full p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-between text-left text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-md bg-slate-100 text-[11px] font-mono text-slate-700 flex items-center justify-center font-bold">
                        {s.num}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900">Surah {s.name}</p>
                        <p className="text-[10px] text-slate-500">{s.meaning} · {s.verses} verses</p>
                      </div>
                    </div>
                    <Play className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. DUAS */}
          {activeTab === 'dua' && (
            <div className="space-y-3">
              <Input
                placeholder="Search supplication or topic..."
                value={duaSearch}
                onChange={(e) => setDuaSearch(e.target.value)}
              />

              <div className="space-y-2.5">
                {filteredDuas.map((d) => (
                  <Card key={d.id} className="border-slate-200 shadow-xs">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{d.category}</Badge>
                        <span className="text-[10px] text-slate-400 font-mono">{d.reference}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">{d.shortNameEn}</h4>
                      <p className="text-right text-base font-arabic text-emerald-900 leading-relaxed">
                        {d.arabic}
                      </p>
                      <p className="text-xs text-slate-500 italic">"{d.transliteration}"</p>
                      <p className="text-xs text-slate-700 pt-1 border-t border-slate-100">{d.translation}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 5. 99 NAMES */}
          {activeTab === 'sifat' && (
            <div className="space-y-2.5">
              {SIFAT_NAMES.map((s) => (
                <Card key={s.number} className="border-slate-200 shadow-xs">
                  <CardContent className="p-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] flex items-center justify-center font-bold">
                          {s.number}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{s.transliteration}</h4>
                      </div>
                      <span className="text-base font-arabic text-emerald-900 font-bold">{s.arabic}</span>
                    </div>
                    <p className="text-xs font-semibold text-emerald-800">{s.meaning}</p>
                    <p className="text-xs text-slate-600 leading-normal">{s.benefits}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* 6. HALAL E-CODES */}
          {activeTab === 'halal' && (
            <div className="space-y-3">
              <Input
                placeholder="Search code or additive (e.g. E120, E471)"
                value={eCodeSearch}
                onChange={(e) => setECodeSearch(e.target.value)}
              />

              <div className="space-y-2">
                {filteredCodes.map((item) => (
                  <Card key={item.code} className="border-slate-200 shadow-xs">
                    <CardContent className="p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                            {item.code}
                          </span>
                          <span className="text-xs font-semibold text-slate-900">{item.name}</span>
                        </div>
                        <Badge variant={item.status === 'Halal' ? 'default' : item.status === 'Haram' ? 'destructive' : 'secondary'}>
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 leading-normal">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 7. ZAKAT CALC */}
          {activeTab === 'zakat' && (
            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-4 space-y-3">
                <p className="text-xs text-slate-500">
                  2.5% calculated on net qualifying wealth held for one lunar year if above Nisab threshold (approx. MYR {nisabThreshold.toLocaleString()}).
                </p>

                <div className="space-y-2.5">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Cash & Bank Balances (MYR)</label>
                    <Input
                      type="number"
                      value={cashVal}
                      onChange={(e) => setCashVal(Number(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Gold & Investments (MYR)</label>
                    <Input
                      type="number"
                      value={goldVal}
                      onChange={(e) => setGoldVal(Number(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Immediate Debts & Liabilities (MYR)</label>
                    <Input
                      type="number"
                      value={debtVal}
                      onChange={(e) => setDebtVal(Number(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-200 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Net Wealth:</span>
                    <span className="font-mono font-bold text-slate-900">MYR {netWealth.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm">
                    <span className="font-bold text-slate-900">Estimated Zakat (2.5%):</span>
                    <span className="font-mono font-bold text-emerald-800 text-base">
                      MYR {zakatDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
