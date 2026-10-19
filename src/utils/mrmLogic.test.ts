import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateInfaqSummary,
  calculateCampaignProgress,
  getNextPrayerInfo,
  getCalendarMonthInfo,
  calculateZakatObligation,
  getPrayersForZone,
  getWaqtAndForbiddenSchedule,
  calculateQiblaAndDistance,
  calculateFitrahAndFidyah,
  findNearestLocationZone,
  getLocationSyncSnapshot,
  getNearbyMrmFacilities,
} from './mrmLogic.ts';

test('calculateInfaqSummary computes subtotal, logistics, and LHDN tax deductible total', () => {
  const result = calculateInfaqSummary(
    [
      { id: '1', title: 'Asnaf Grocery Box', price: 120, quantity: 2, category: 'Food Relief' },
      { id: '2', title: 'Revert Starter Kit', price: 85, quantity: 1, category: 'Revert Care' },
    ],
    15
  );
  assert.equal(result.subtotal, 325);
  assert.equal(result.logisticsSupport, 15);
  assert.equal(result.total, 340);
  assert.equal(result.totalShares, 3);
  assert.equal(result.estimatedBeneficiaries, 9);
  assert.equal(result.lhdnTaxDeductibleAmount, 340);
});

test('calculateCampaignProgress clamps percentage and classifies status', () => {
  const active = calculateCampaignProgress(15000, 30000);
  assert.equal(active.percentage, 50);
  assert.equal(active.remainingAmount, 15000);
  assert.equal(active.statusLabel, 'Active Relief');

  const near = calculateCampaignProgress(26400, 30000);
  assert.equal(near.percentage, 88);
  assert.equal(near.statusLabel, 'Near Target');

  const full = calculateCampaignProgress(35000, 30000);
  assert.equal(full.percentage, 100);
  assert.equal(full.remainingAmount, 0);
  assert.equal(full.statusLabel, 'Fully Funded');
});

test('getNextPrayerInfo returns upcoming prayer and countdown accurately', () => {
  const info = getNextPrayerInfo(15 * 60 + 46); // 15:46 -> Asar at 16:24
  assert.equal(info.nextPrayer.name, 'Asar');
  assert.equal(info.minutesRemaining, 38);
  assert.equal(info.countdownLabel, '38 mins');
});

test('getCalendarMonthInfo switches months, computes Hijri dates, and flags Sunnah fast days', () => {
  const oct = getCalendarMonthInfo(1, 16);
  assert.equal(oct.meta.gregorianMonth, 'October');
  assert.equal(oct.clampedDay, 16);
  assert.equal(oct.isEventDay, true);
  assert.ok(oct.hijriDateLabel.includes("Rabi' al-Thani"));

  // Check Ayyam al-Beedh (13, 14, 15 Hijri)
  const ayyam = getCalendarMonthInfo(1, 25); // 19 + 25 - 2 = 42 % 30 + 1 = 13th Hijri
  assert.equal(ayyam.hijriDay, 13);
  assert.equal(ayyam.isAyyamAlBeedh, true);
  assert.equal(ayyam.isSunnahFastDay, true);

  const nov = getCalendarMonthInfo(2, 31); // Clamps 31 -> 30 for November
  assert.equal(nov.meta.gregorianMonth, 'November');
  assert.equal(nov.clampedDay, 30);
});

test('calculateZakatObligation assesses Nisab threshold and 2.5% Zakat accurately', () => {
  const below = calculateZakatObligation(1500, 2000, 24000);
  assert.equal(below.isAboveNisab, false);
  assert.equal(below.annualZakat, 0);

  const above = calculateZakatObligation(6000, 15000, 24000);
  // 6000 * 12 * 0.6 = 43200 + 15000 = 58200 (> 24000) -> 2.5% = 1455
  assert.equal(above.isAboveNisab, true);
  assert.equal(above.eligibleAnnualWealth, 58200);
  assert.equal(above.annualZakat, 1455);
  assert.equal(above.monthlyZakat, 121);
});

test('getPrayersForZone adjusts prayer schedule for Penang, Johor, Sabah, and Sarawak zones', () => {
  const kl = getPrayersForZone('WLY01');
  const png = getPrayersForZone('PNG01');
  const sbh = getPrayersForZone('SBH07');
  assert.equal(kl[0].time24, '05:48');
  assert.equal(png[0].time24, '05:55');
  assert.equal(sbh[0].time24, '04:56');
});

test('getWaqtAndForbiddenSchedule computes Sehri, Iftar, Nafl, and 3 Forbidden windows', () => {
  const almanac = getWaqtAndForbiddenSchedule('WLY01');
  assert.equal(almanac.sehriEnds24, '05:38');
  assert.equal(almanac.fajrStarts24, '05:48');
  assert.equal(almanac.iftarMaghrib24, '19:12');
  assert.equal(almanac.farzPrayers.length, 5);
  assert.equal(almanac.naflPrayers.length, 4);
  assert.equal(almanac.forbiddenWindows.length, 3);
  assert.equal(almanac.forbiddenWindows[0].startTime24, '07:01');
  assert.equal(almanac.forbiddenWindows[0].endTime24, '07:16');
});

test('calculateQiblaAndDistance computes accurate bearing and distance for Kuala Lumpur', () => {
  const klQibla = calculateQiblaAndDistance(3.139, 101.6869);
  assert.ok(klQibla.bearingDegrees >= 292 && klQibla.bearingDegrees <= 293);
  assert.equal(klQibla.cardinalDirection, 'WNW');
  assert.ok(klQibla.distanceKm >= 6950 && klQibla.distanceKm <= 7000);
});

test('calculateFitrahAndFidyah computes household Fitrah and Fidyah obligations', () => {
  const res = calculateFitrahAndFidyah(4, 14, 5, 4);
  assert.equal(res.fitrahTotal, 56);
  assert.equal(res.fidyahTotal, 20);
  assert.equal(res.combinedObligation, 76);
});

test('findNearestLocationZone and getLocationSyncSnapshot synchronize prayers, Qibla, and nearby hubs accurately by coordinates or zone', () => {
  const nearestPenang = findNearestLocationZone(5.41, 100.33);
  assert.equal(nearestPenang.zone.code, 'PNG01');

  const snapshot = getLocationSyncSnapshot('PNG01 - Pulau Pinang', 15 * 60 + 46);
  assert.equal(snapshot.zoneCode, 'PNG01');
  assert.equal(snapshot.cityLabel, 'George Town, Penang');
  assert.equal(snapshot.almanac.sehriEnds24, '05:45');
  assert.equal(snapshot.almanac.iftarMaghrib24, '19:19');
  assert.equal(snapshot.nextPrayerInfo.nextPrayer.name, 'Asar');
  assert.equal(snapshot.nextPrayerInfo.nextPrayer.time24, '16:31');
  assert.equal(snapshot.nearbyFacilities[0].city, 'George Town');

  const facilities = getNearbyMrmFacilities(3.139, 101.6869);
  assert.ok(facilities.length >= 5);
  assert.equal(facilities[0].city, 'Kuala Lumpur');
});
