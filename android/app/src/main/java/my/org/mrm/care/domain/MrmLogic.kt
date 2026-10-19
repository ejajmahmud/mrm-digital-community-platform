package my.org.mrm.care.domain

import my.org.mrm.care.model.*
import java.util.Locale
import kotlin.math.*

object MrmLogic {

    fun calculateInfaqSummary(items: List<CartItem>, includeLogisticsSupport: Boolean = true): InfaqSummary {
        var subtotal = 0
        var totalShares = 0
        var estimatedBeneficiaries = 0

        for (entry in items) {
            val qty = max(0, entry.quantity)
            val price = max(0, entry.item.price)
            subtotal += price * qty
            totalShares += qty
            estimatedBeneficiaries += qty * max(1, entry.item.beneficiariesPerShare)
        }

        val logisticsSupport = if (subtotal > 0 && includeLogisticsSupport) {
            15
        } else {
            0
        }

        return InfaqSummary(
            subtotal = subtotal,
            logisticsSupport = logisticsSupport,
            totalAmount = subtotal + logisticsSupport,
            totalShares = totalShares,
            estimatedBeneficiaries = estimatedBeneficiaries
        )
    }

    fun calculateCampaignProgress(raised: Int, goal: Int): CampaignProgress {
        if (goal <= 0) {
            return CampaignProgress(0, 0, false)
        }
        val safeRaised = max(0, raised)
        val rawPct = ((safeRaised.toDouble() / goal.toDouble()) * 100.0).roundToInt()
        return CampaignProgress(
            percentage = min(100, max(0, rawPct)),
            remainingAmount = max(0, goal - safeRaised),
            isFullyFunded = safeRaised >= goal
        )
    }

    fun formatMinutesTo24h(totalMinutes: Int): String {
        val normalized = ((totalMinutes % 1440) + 1440) % 1440
        val h24 = normalized / 60
        val mins = normalized % 60
        return String.format(Locale.US, "%02d:%02d", h24, mins)
    }

    fun formatMinutesTo12h(totalMinutes: Int): String {
        val normalized = ((totalMinutes % 1440) + 1440) % 1440
        val h24 = normalized / 60
        val mins = normalized % 60
        val period = if (h24 >= 12) "PM" else "AM"
        val h12 = when {
            h24 % 12 == 0 -> 12
            else -> h24 % 12
        }
        return String.format(Locale.US, "%02d:%02d %s", h12, mins, period)
    }

    fun calculateDistanceKm(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Double {
        val toRad = { deg: Double -> (deg * PI) / 180.0 }
        val r = 6371.0
        val dLat = toRad(lat2 - lat1)
        val dLon = toRad(lon2 - lon1)
        val a = sin(dLat / 2).pow(2.0) +
                cos(toRad(lat1)) * cos(toRad(lat2)) * sin(dLon / 2).pow(2.0)
        val c = 2 * atan2(sqrt(a), sqrt(1 - a))
        return ((r * c) * 10.0).roundToInt() / 10.0
    }

    fun findNearestLocationZone(lat: Double, lng: Double): LocationZoneConfig {
        var nearest = MrmSampleData.LOCATION_ZONES.first()
        var bestDist = Double.POSITIVE_INFINITY
        for (zone in MrmSampleData.LOCATION_ZONES) {
            val d = calculateDistanceKm(lat, lng, zone.latitude, zone.longitude)
            if (d < bestDist) {
                bestDist = d
                nearest = zone
            }
        }
        return nearest
    }

    fun getLocationZoneConfig(zoneCode: String): LocationZoneConfig {
        val normalized = zoneCode.trim().uppercase(Locale.US)
        return MrmSampleData.LOCATION_ZONES.find {
            normalized.startsWith(it.code) || it.label.uppercase(Locale.US).contains(normalized)
        } ?: MrmSampleData.LOCATION_ZONES.first()
    }

    fun calculateQiblaDirection(lat: Double, lng: Double): Pair<Double, Int> {
        val kaabaLat = 21.4225
        val kaabaLng = 39.8262
        val toRad = { deg: Double -> (deg * PI) / 180.0 }
        val toDeg = { rad: Double -> (rad * 180.0) / PI }

        val phiK = toRad(kaabaLat)
        val lambdaK = toRad(kaabaLng)
        val phi = toRad(lat)
        val lambda = toRad(lng)
        val dLambda = lambdaK - lambda

        val y = sin(dLambda)
        val x = cos(phi) * tan(phiK) - sin(phi) * cos(dLambda)
        val bearing = (toDeg(atan2(y, x)) + 360.0) % 360.0
        val roundedBearing = (bearing * 10.0).roundToInt() / 10.0
        val distKm = calculateDistanceKm(lat, lng, kaabaLat, kaabaLng).roundToInt()
        return Pair(roundedBearing, distKm)
    }

    fun getPrayersForZone(
        zoneCode: String = "WLY01",
        customLat: Double? = null,
        customLng: Double? = null
    ): List<PrayerTimeEntry> {
        val zone = getLocationZoneConfig(zoneCode)
        val lat = customLat ?: zone.latitude
        val lng = customLng ?: zone.longitude

        // Exact WLY01 baseline matching web app (05:48, 13:08, 16:24, 19:12, 20:22)
        val baseSubuh = 348    // 05:48
        val baseZohor = 788    // 13:08
        val baseAsar = 984     // 16:24
        val baseMaghrib = 1152 // 19:12
        val baseIsyak = 1222   // 20:22

        val standardMeridian = zone.utcOffsetHours * 15.0
        val expectedSolarShiftFromKL = (101.6869 - 120.0) * 4.0
        val localSolarShift = (standardMeridian - lng) * 4.0
        val deltaMinutes = (localSolarShift - expectedSolarShiftFromKL).roundToInt()
        val latDelta = ((lat - 3.139) * 0.6).roundToInt()

        val subuhMin = baseSubuh + deltaMinutes - latDelta
        val zohorMin = baseZohor + deltaMinutes
        val asarMin = baseAsar + deltaMinutes + (latDelta / 2)
        val maghribMin = baseMaghrib + deltaMinutes + latDelta
        val isyakMin = baseIsyak + deltaMinutes + latDelta

        return listOf(
            PrayerTimeEntry("Subuh", formatMinutesTo24h(subuhMin), subuhMin),
            PrayerTimeEntry("Zohor", formatMinutesTo24h(zohorMin), zohorMin),
            PrayerTimeEntry("Asar", formatMinutesTo24h(asarMin), asarMin),
            PrayerTimeEntry("Maghrib", formatMinutesTo24h(maghribMin), maghribMin),
            PrayerTimeEntry("Isyak", formatMinutesTo24h(isyakMin), isyakMin)
        )
    }

    fun getNextPrayerInfo(currentMinutes: Int, prayers: List<PrayerTimeEntry>): NextPrayerResult {
        val normalizedCurrent = ((currentMinutes % 1440) + 1440) % 1440
        var upcoming = prayers.find { it.minutes > normalizedCurrent }
        val minutesRemaining: Int

        if (upcoming != null) {
            minutesRemaining = upcoming.minutes - normalizedCurrent
        } else {
            upcoming = prayers.first()
            minutesRemaining = (1440 - normalizedCurrent) + upcoming.minutes
        }

        val hours = minutesRemaining / 60
        val mins = minutesRemaining % 60
        val formattedCountdown = if (hours > 0) "${hours}h ${mins}m" else "${mins} mins"
        return NextPrayerResult(upcoming, minutesRemaining, formattedCountdown)
    }

    fun getWaqtAndForbiddenSchedule(
        zoneCode: String = "WLY01",
        customLat: Double? = null,
        customLng: Double? = null
    ): DailyPrayerAlmanac {
        val zone = getLocationZoneConfig(zoneCode)
        val prayers = getPrayersForZone(zone.code, customLat, customLng)
        val subuh = prayers[0].minutes
        val zohor = prayers[1].minutes
        val asar = prayers[2].minutes
        val maghrib = prayers[3].minutes
        val isyak = prayers[4].minutes

        val sehriEnds = subuh - 10
        val sunrise = subuh + 73 // 07:01 for WLY01
        val ishraqStart = sunrise + 16
        val chashtStart = sunrise + 110
        val zawalStart = zohor - 10
        val sunsetStart = maghrib - 15
        val awwabinEnd = maghrib + 45
        val tahajjudStart = 180

        val periods = listOf(
            WaqtPeriod("tahajjud", "Tahajjud & Qiyamullail", "تهجد", "NAFL", formatMinutesTo24h(tahajjudStart), formatMinutesTo24h(sehriEnds), "Sunnah Mu'akkadah", "Last third of the night before Sehri ends."),
            WaqtPeriod("fajr_farz", "Subuh (Fajr Farz)", "صلاة الفجر", "FARZ", formatMinutesTo24h(subuh), formatMinutesTo24h(sunrise - 1), "Obligatory (2 Rakaat)", "Ends strictly at Syuruk (${formatMinutesTo24h(sunrise)})."),
            WaqtPeriod("haram_sunrise", "Tulu' al-Shams (Sunrise)", "طلوع الشمس", "PROHIBITED", formatMinutesTo24h(sunrise), formatMinutesTo24h(ishraqStart - 1), "Haram / Prohibited", "All voluntary and obligatory prayers are prohibited during solar ascension (~15 mins)."),
            WaqtPeriod("ishraq_duha", "Salat al-Ishraq & Duha", "صلاة الضحى", "NAFL", formatMinutesTo24h(ishraqStart), formatMinutesTo24h(zawalStart - 1), "Recommended (2–8 Rakaat)", "Morning charity for every joint in the human body."),
            WaqtPeriod("haram_zawal", "Istiwa / Zawal (Solar Zenith)", "الاستواء / الزوال", "PROHIBITED", formatMinutesTo24h(zawalStart), formatMinutesTo24h(zohor - 1), "Haram / Prohibited", "Prohibited ~10 minutes while the sun stands directly at meridian zenith."),
            WaqtPeriod("dhuhr_farz", "Zohor (Dhuhr Farz)", "صلاة الظهر", "FARZ", formatMinutesTo24h(zohor), formatMinutesTo24h(asar - 1), "Obligatory (4 Rakaat)", "Begins immediately after the sun passes meridian zenith."),
            WaqtPeriod("asr_farz", "Asar (Asr Farz)", "صلاة العصر", "FARZ", formatMinutesTo24h(asar), formatMinutesTo24h(sunsetStart - 1), "Obligatory (4 Rakaat)", "Perform before solar yellowing prior to sunset."),
            WaqtPeriod("haram_sunset", "Ghurub al-Shams (Sunset)", "غروب الشمس", "PROHIBITED", formatMinutesTo24h(sunsetStart), formatMinutesTo24h(maghrib - 1), "Haram / Prohibited", "Nafl prayers prohibited while the solar disc sinks below the horizon."),
            WaqtPeriod("maghrib_iftar", "Maghrib & Iftar", "صلاة المغرب", "FARZ", formatMinutesTo24h(maghrib), formatMinutesTo24h(isyak - 1), "Obligatory (3 Rakaat) + Iftar", "Fast breaking (Iftar) and Maghrib window."),
            WaqtPeriod("isha_farz", "Isyak & Witr", "صلاة العشاء", "FARZ", formatMinutesTo24h(isyak), formatMinutesTo24h(sehriEnds), "Obligatory (4 Rakaat) + Witr", "Night prayer extending until dawn.")
        )

        return DailyPrayerAlmanac(
            zoneCode = zone.code,
            zoneLabel = zone.label,
            hijriDate = "7 Rabi' al-Thani 1448H",
            sehriEnds = formatMinutesTo24h(sehriEnds),
            fajrAzan = formatMinutesTo24h(subuh),
            sunriseTime = formatMinutesTo24h(sunrise),
            ishraqStart = formatMinutesTo24h(ishraqStart),
            chashtStart = formatMinutesTo24h(chashtStart),
            zawalStart = formatMinutesTo24h(zawalStart),
            dhuhrAzan = formatMinutesTo24h(zohor),
            asrAzan = formatMinutesTo24h(asar),
            sunsetTime = formatMinutesTo24h(sunsetStart),
            iftarStarts = formatMinutesTo24h(maghrib),
            maghribAzan = formatMinutesTo24h(maghrib),
            awwabinWindow = "${formatMinutesTo24h(maghrib + 15)} - ${formatMinutesTo24h(awwabinEnd)}",
            ishaAzan = formatMinutesTo24h(isyak),
            tahajjudWindow = "${formatMinutesTo24h(tahajjudStart)} - ${formatMinutesTo24h(sehriEnds)}",
            periods = periods
        )
    }

    fun getNearbyFacilitiesForLocation(lat: Double, lng: Double): List<NearbyFacility> {
        val baseList = listOf(
            NearbyFacility("fac-1", "Masjid Wilayah Persekutuan Hub", "MRM_HUB", "WLY01", "Kuala Lumpur", 3.1710, 101.6705, 0.0, "Open • 24/7 Care Line", "+60 3-2698 4110"),
            NearbyFacility("fac-2", "Masjid Negara Malaysia", "MOSQUE", "WLY01", "Kuala Lumpur", 3.1418, 101.6917, 0.0, "Jumu'ah & Revert Desk", "+60 3-2693 7784"),
            NearbyFacility("fac-3", "Masjid Sultan Salahuddin Abdul Aziz", "MRM_HUB", "SGR01", "Shah Alam", 3.0786, 101.5209, 0.0, "Active • Asnaf Pantry", "+60 3-5519 9988"),
            NearbyFacility("fac-4", "Masjid Bandaraya Kota Kinabalu", "MRM_HUB", "SBH07", "Kota Kinabalu", 5.9958, 116.1078, 0.0, "Borneo Relief Command", "+60 88-205 411"),
            NearbyFacility("fac-5", "Masjid Sultan Abu Bakar JB", "MRM_HUB", "JHR02", "Johor Bahru", 1.4566, 103.7505, 0.0, "Southern Corridor Hub", "+60 7-223 1900"),
            NearbyFacility("fac-6", "Masjid Negeri Pulau Pinang", "MOSQUE", "PNG01", "Georgetown", 5.4065, 100.3005, 0.0, "Northern Revert Desk", "+60 4-828 2212")
        )
        return baseList.map { f ->
            f.copy(distanceKm = calculateDistanceKm(lat, lng, f.latitude, f.longitude))
        }.sortedBy { it.distanceKm }
    }

    fun getLocationSyncSnapshot(
        zoneCodeOrCoords: String = "WLY01",
        currentMinutes: Int = 946, // 15:46 -> Next: Asar in 38 mins (16:24) matching Web App
        customCoords: Pair<Double, Double>? = null
    ): LocationSyncSnapshot {
        val zone = if (customCoords != null) {
            findNearestLocationZone(customCoords.first, customCoords.second)
        } else {
            getLocationZoneConfig(zoneCodeOrCoords)
        }
        val lat = customCoords?.first ?: zone.latitude
        val lng = customCoords?.second ?: zone.longitude

        val (bearing, distKm) = calculateQiblaDirection(lat, lng)
        val prayers = getPrayersForZone(zone.code, lat, lng)
        val nextPrayerInfo = getNextPrayerInfo(currentMinutes, prayers)
        val almanac = getWaqtAndForbiddenSchedule(zone.code, lat, lng)
        val nearbyFacilities = getNearbyFacilitiesForLocation(lat, lng)

        return LocationSyncSnapshot(
            zone = zone,
            isCustomGps = customCoords != null,
            latitude = lat,
            longitude = lng,
            qiblaBearing = bearing,
            distanceToKaabaKm = distKm,
            prayers = prayers,
            nextPrayerInfo = nextPrayerInfo,
            almanac = almanac,
            nearbyFacilities = nearbyFacilities
        )
    }

    fun calculateZakatObligation(input: ZakatInput): ZakatCalculationResult {
        val gross = max(0.0, input.cashAndSavings) +
                max(0.0, input.goldAndSilverValue) +
                max(0.0, input.businessAssets) +
                max(0.0, input.investmentValue)

        val net = max(0.0, gross - max(0.0, input.shortTermLiabilities))
        val nisab = if (input.nisabThresholdRM > 0) input.nisabThresholdRM else 24000.0
        val eligible = net >= nisab
        val zakatPayable = if (eligible) ((net * 0.025) * 100.0).roundToInt() / 100.0 else 0.0
        val recommendedInfaq = if (eligible) {
            ((zakatPayable * 0.25) * 100.0).roundToInt() / 100.0
        } else {
            max(20.0, ((net * 0.005) * 100.0).roundToInt() / 100.0)
        }

        return ZakatCalculationResult(
            grossAssessableWealth = gross,
            netZakatableWealth = net,
            nisabThresholdRM = nisab,
            isEligibleForZakat = eligible,
            zakatPayableRM = zakatPayable,
            recommendedInfaqSplitRM = recommendedInfaq
        )
    }
}
