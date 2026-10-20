import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar as CalendarIcon,
  CheckCircle2,
  MapPin,
  Check,
  ShieldCheck,
  Trash2,
  ShieldAlert,
  Sparkles,
  Download,
} from 'lucide-react';
import { ScreenId } from '../../types/screens';
import {
  getDynamicCalendarMonth,
  generateICalendarBooking,
  getLocationSyncSnapshot,
  formatLiveHijriDate,
} from '../../utils/mrmLogic';
import { UtilityTabId } from '../../data/islamicUtilitiesData';

interface CalendarBookingScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenUtility?: (tab: UtilityTabId) => void;
  selectedZone?: string;
  onSelectZone?: (zone: string) => void;
  playClickSound?: () => void;
}

interface ConfirmedBooking {
  id: string;
  dateLabel: string;
  isoDate: string; // YYYY-MM-DD
  hijriLabel: string;
  slot: string;
  track: string;
  location: string;
}

export const CalendarBookingScreen: React.FC<CalendarBookingScreenProps> = ({
  onOpenUtility,
  selectedZone = 'WLY01 - Kuala Lumpur & Putrajaya',
  playClickSound,
}) => {
  const [viewMode, setViewMode] = useState<'shifts' | 'almanac'>(() => {
    if (
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('view') === 'almanac'
    ) {
      return 'almanac';
    }
    return 'shifts';
  });

  // Dynamic Date tracking initialized to current user date
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(() => now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => now.getMonth());
  const [selectedDay, setSelectedDay] = useState(() => now.getDate());

  const [selectedSlot, setSelectedSlot] = useState('09:00 AM - 12:00 PM');
  const [selectedRole, setSelectedRole] = useState('Revert Mentorship & Halaqa');
  const [lastConfirmedBooking, setLastConfirmedBooking] = useState<ConfirmedBooking | null>(null);
  const [showModal, setShowModal] = useState(
    () =>
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('modal') === 'booking_confirm'
  );

  const locationSnap = getLocationSyncSnapshot(selectedZone);
  const almanac = locationSnap.almanac;

  // Bookings persisted in localStorage
  const [bookings, setBookings] = useState<ConfirmedBooking[]>(() => {
    try {
      const saved = localStorage.getItem('mrm_calendar_bookings');
      if (saved) return JSON.parse(saved);
    } catch {}

    const todayHijri = formatLiveHijriDate(now);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return [
      {
        id: 'bk-initial-1',
        dateLabel: `${now.toLocaleString('en-US', { month: 'short' })} ${now.getDate()}, ${now.getFullYear()}`,
        isoDate: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
        hijriLabel: todayHijri.full,
        slot: '09:00 AM - 12:00 PM',
        track: 'Revert Mentorship & Halaqa',
        location: 'Masjid Wilayah Persekutuan Hub',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('mrm_calendar_bookings', JSON.stringify(bookings));
    } catch {}
  }, [bookings]);

  // Dynamic calendar month calculation
  const meta = getDynamicCalendarMonth(currentYear, currentMonth, selectedDay);
  const clampedDay = meta.clampedDay;

  const daysInMonth = Array.from({ length: meta.daysCount }, (_, i) => i + 1);
  const emptyLeadingCells = Array.from({ length: meta.startWeekdayOffset }, (_, i) => i);

  const handlePrevMonth = () => {
    playClickSound?.();
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    playClickSound?.();
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToday = () => {
    playClickSound?.();
    const t = new Date();
    setCurrentYear(t.getFullYear());
    setCurrentMonth(t.getMonth());
    setSelectedDay(t.getDate());
  };

  const todayDateObj = new Date();
  const todayLabel = `Today (${todayDateObj.toLocaleString('en-US', { month: 'short' })} ${todayDateObj.getDate()})`;

  const slots = [
    {
      time: '09:00 AM - 12:00 PM',
      label: meta.isEventDay ? 'Special Revert Halaqa & Welfare Shift' : 'Morning Halaqa & Shift',
      spots: `${(clampedDay % 4) + 2} slots left`,
    },
    {
      time: '02:00 PM - 05:00 PM',
      label: 'Afternoon Asnaf Food Hamper Dispatch',
      spots: `${(clampedDay % 5) + 3} slots left`,
    },
    {
      time: '06:00 PM - 09:00 PM',
      label: 'Maghrib–Isyak Revert Study Circle',
      spots: 'Open Registration',
    },
  ];

  const handleBooking = () => {
    playClickSound?.();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const isoDate = `${meta.year}-${pad(meta.monthIndex + 1)}-${pad(clampedDay)}`;
    const newBooking: ConfirmedBooking = {
      id: `bk-${Date.now()}`,
      dateLabel: `${meta.shortMonth} ${clampedDay}, ${meta.year}`,
      isoDate,
      hijriLabel: meta.hijriDateLabel,
      slot: selectedSlot,
      track: selectedRole,
      location: locationSnap.hubName,
    };
    setLastConfirmedBooking(newBooking);
    setBookings((prev) => [newBooking, ...prev]);
    setShowModal(true);
  };

  const handleCancelBooking = (id: string) => {
    playClickSound?.();
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const handleExportICalendar = (bk: ConfirmedBooking) => {
    playClickSound?.();
    const ics = generateICalendarBooking({
      title: bk.track,
      role: bk.track,
      location: bk.location,
      dateStr: bk.isoDate,
      slot: bk.slot,
    });
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MRM-${bk.track.replace(/\s+/g, '_')}-${bk.isoDate}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-full flex flex-col p-4 u-canvas pb-8 select-none space-y-3.5">
      {/* Top Mode Switcher: Halaqa & Shifts vs MRM Waqt & Fasting Almanac */}
      <div className="p-1 rounded-xl u-subtle border border-slate-200/80 grid grid-cols-2 gap-1">
        <button
          type="button"
          onClick={() => {
            playClickSound?.();
            setViewMode('shifts');
          }}
          className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            viewMode === 'shifts'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Halaqa &amp; Duty Shifts
        </button>
        <button
          type="button"
          onClick={() => {
            playClickSound?.();
            setViewMode('almanac');
          }}
          className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            viewMode === 'almanac'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Waqt &amp; Fasting Almanac
        </button>
      </div>

      {/* Location & Hijri Sub-Banner Synced to Active Zone */}
      <div className="p-3 u-card flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate">
              {locationSnap.hubName} ({locationSnap.zoneCode})
            </span>
            <span className="text-[11px] text-emerald-600 font-mono font-semibold block truncate">
              {meta.isAyyamAlBeedh
                ? `★ Ayyam al-Beedh · Sehri ${almanac.sehriEnds24} · Iftar ${almanac.iftarMaghrib24}`
                : meta.isSunnahFastDay
                ? `★ Sunnah Fast · Sehri ${almanac.sehriEnds24} · Iftar ${almanac.iftarMaghrib24}`
                : `${meta.hijriDateLabel} · Sehri ${almanac.sehriEnds24} · Iftar ${almanac.iftarMaghrib24}`}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleJumpToday}
          className="px-2.5 py-1.5 rounded-lg u-btn-secondary text-[11px] font-semibold shrink-0 cursor-pointer"
        >
          {todayLabel}
        </button>
      </div>

      {/* Interactive Multi-Month Calendar Card */}
      <div className="p-4 u-card">
        {/* Month Header with Working Prev / Next Switcher */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div>
            <span className="text-sm font-bold flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {meta.gregorianMonth} {meta.year}
              </span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
              {meta.hijriMonth} {meta.hijriYear}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Previous Month"
              className="w-8 h-8 rounded-xl u-btn-secondary flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono font-semibold px-2 py-1 rounded-lg u-subtle">
              {meta.shortMonth} {meta.year}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Next Month"
              className="w-8 h-8 rounded-xl u-btn-secondary flex items-center justify-center cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
          <span>Su</span>
        </div>

        {/* Calendar Days Grid with Weekday Offset */}
        <div className="grid grid-cols-7 gap-1">
          {emptyLeadingCells.map((emptyIdx) => (
            <div key={`empty-${emptyIdx}`} className="h-9" />
          ))}
          {daysInMonth.map((day) => {
            const isSelected = clampedDay === day;
            const dayMeta = getDynamicCalendarMonth(currentYear, currentMonth, day);
            const hasEvent = dayMeta.isEventDay;
            const hasSunnahFast = dayMeta.isSunnahFastDay;

            return (
              <button
                key={day}
                type="button"
                onClick={() => {
                  playClickSound?.();
                  setSelectedDay(day);
                }}
                className={`h-9 rounded-xl flex flex-col items-center justify-center relative text-xs font-mono transition-all cursor-pointer border ${
                  isSelected
                    ? 'u-btn-primary font-bold shadow-xs'
                    : 'u-surface border-slate-200/70 hover:border-emerald-500/50'
                }`}
              >
                <span>{day}</span>
                <div className="flex items-center gap-0.5 absolute bottom-1">
                  {hasEvent && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-emerald-500'
                      }`}
                    />
                  )}
                  {hasSunnahFast && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-amber-200' : 'bg-amber-500'
                      }`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-2.5 mt-2.5 border-t border-slate-200/70 flex items-center justify-between text-[10px] text-slate-500">
          <span>● Emerald: Halaqa &amp; Relief Shift</span>
          <span>● Amber: Sunnah / White Fast</span>
        </div>
      </div>

      {viewMode === 'almanac' ? (
        <div className="space-y-3">
          {/* Sehri & Iftar Summary */}
          <div className="p-3.5 u-card space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold">
                Sehri, Iftar &amp; 5 Farz Waqt ({locationSnap.zoneCode} · {meta.shortMonth}{' '}
                {clampedDay})
              </h3>
              <button
                type="button"
                onClick={() => onOpenUtility?.('waqt')}
                className="text-[11px] font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Full Suite</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl u-subtle">
                <span className="text-[10px] text-slate-500 block">Sehri Ends (Imsak)</span>
                <span className="text-sm font-bold text-emerald-600">
                  {almanac.sehriEnds24} AM
                </span>
              </div>
              <div className="p-2.5 rounded-xl u-subtle">
                <span className="text-[10px] text-slate-500 block">Iftar (Maghrib)</span>
                <span className="text-sm font-bold text-emerald-600">
                  {almanac.iftarMaghrib24} PM
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-200/60 text-xs">
              {almanac.farzPrayers.map((p) => (
                <div key={p.id} className="py-1.5 flex items-center justify-between">
                  <span className="font-semibold">
                    {p.name} <span className="text-[10px] text-slate-400">({p.rakaatSummary})</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-600">
                    {p.time24} – {p.endTime24}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3 Prohibited Windows */}
          <div className="p-3.5 u-card space-y-2">
            <h3 className="text-xs font-bold text-rose-600 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>3 Prohibited (Makruh Tahrimi) Prayer Windows</span>
            </h3>
            {almanac.forbiddenWindows.map((fw) => (
              <div
                key={fw.id}
                className="p-2 rounded-xl u-subtle flex items-center justify-between text-xs"
              >
                <span className="font-semibold">{fw.name}</span>
                <span className="font-mono font-bold text-rose-600">
                  {fw.startTime24} – {fw.endTime24}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Selected Day Agenda */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Available Slots ({meta.shortMonth} {clampedDay}, {meta.year})
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold font-mono">
                {meta.isEventDay ? '★ Featured Halaqa Day' : 'Regular Schedule'}
              </span>
            </div>

            <div className="space-y-2">
              {slots.map((slot) => {
                const isSlotSelected = selectedSlot === slot.time;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => {
                      playClickSound?.();
                      setSelectedSlot(slot.time);
                    }}
                    className={`w-full p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-left ${
                      isSlotSelected
                        ? 'u-card border-emerald-600 ring-2 ring-emerald-500/20'
                        : 'u-card hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isSlotSelected
                            ? 'bg-emerald-600 text-white'
                            : 'u-subtle text-slate-500'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs font-bold truncate">{slot.label}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{slot.time}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-emerald-600 shrink-0 ml-2">
                      {slot.spots}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role / Track Selection */}
          <div>
            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
              Select Volunteer / Mentorship Track
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Revert Mentorship & Halaqa',
                'Emergency Food Hamper Assembly',
                'Elder Care & Dialysis Escort',
                'Street Dawah Outreach',
              ].map((role) => {
                const isRoleActive = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      playClickSound?.();
                      setSelectedRole(role);
                    }}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                      isRoleActive
                        ? 'u-btn-primary shadow-xs'
                        : 'u-card hover:border-emerald-500/40'
                    }`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Confirm Booking Button */}
          <button
            type="button"
            onClick={handleBooking}
            className="w-full min-h-[46px] py-3 px-4 rounded-xl u-btn-primary font-bold text-xs shadow-sm flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              Confirm Booking for {meta.shortMonth} {clampedDay}, {meta.year}
            </span>
          </button>

          {/* Active Confirmed Bookings List */}
          {bookings.length > 0 && (
            <div>
              <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
                Your Confirmed Shifts &amp; Halaqas ({bookings.length})
              </span>
              <div className="space-y-2">
                {bookings.map((bk) => (
                  <div
                    key={bk.id}
                    className="p-3 u-card flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono">
                        <span className="text-emerald-600 font-bold">{bk.dateLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-500 truncate">{bk.hijriLabel}</span>
                      </div>
                      <div className="text-xs font-bold mt-1 truncate">{bk.track}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {bk.slot} · {bk.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleExportICalendar(bk)}
                        className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                        title="Add to Phone Calendar (.ics)"
                        aria-label="Add to Phone Calendar"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancelBooking(bk.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Cancel booking"
                        aria-label="Cancel booking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xs p-5 u-card shadow-2xl text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white mx-auto flex items-center justify-center">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-bold">Slot Confirmed!</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              You are scheduled for <strong>{selectedRole}</strong> on{' '}
              <strong>
                {meta.gregorianMonth} {clampedDay}, {meta.year}
              </strong>{' '}
              ({selectedSlot}) at <strong>{locationSnap.hubName}</strong>.
            </p>
            <div className="p-3 rounded-xl u-subtle text-[11px] text-left flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Coordinator: Ustaz Ridzwan ({locationSnap.cityLabel} Ops)</span>
            </div>

            {lastConfirmedBooking && (
              <button
                type="button"
                onClick={() => handleExportICalendar(lastConfirmedBooking)}
                className="w-full py-2.5 rounded-xl u-btn-secondary text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Add to Phone Calendar (.ics)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 rounded-xl u-btn-primary text-xs font-bold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
