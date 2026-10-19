# MRM Care — Pure Native Android Studio Project (Kotlin + Jetpack Compose)

This directory contains a 100% self-contained, native Android Studio project built with **Kotlin 2.0.21**, **Android Gradle Plugin 8.7.2**, **Jetpack Compose (Material 3)**, and **Target SDK 35 (Android 15)**.

## Architecture & Included Modules

1. **`app/src/main/java/my/org/mrm/care/MainActivity.kt`**
   - Edge-to-edge `ComponentActivity` entry point mounting `MrmCareTheme` and `MrmCareApp()`.
2. **`app/src/main/java/my/org/mrm/care/model/MrmModels.kt`**
   - Complete data models for all **20 Native Screens (`ScreenId`)**, **9 JAKIM & Global Location Zones (`LOCATION_ZONES`)**, **Prayer & Forbidden Waqt Almanac (`DailyPrayerAlmanac`, `WaqtPeriod`)**, **Nearby MRM Hubs & Mosques (`NearbyFacility`)**, **Audited Infaq Catalog (`CatalogItem`)**, **Surah / Masnoon Dua / 99 Names**, and **Zakat Calculation Models**.
3. **`app/src/main/java/my/org/mrm/care/domain/MrmLogic.kt`**
   - Pure Kotlin Location & Prayer Sync Engine:
     - `findNearestLocationZone(lat, lng)` — Haversine nearest-zone resolver
     - `calculateQiblaDirection(lat, lng)` — Spherical trigonometry Qibla bearing & distance to Makkah
     - `getPrayersForZone(zoneCode, customLat, customLng)` — Solar-shifted 5 daily obligatory prayer times
     - `getWaqtAndForbiddenSchedule(zoneCode)` — Full Sehri, Sunrise (Prohibited), Ishraq, Duha/Chasht, Zawal (Prohibited), Sunset (Prohibited), Awwabin, and Tahajjud almanac
     - `getNearbyMrmFacilities(lat, lng)` — Real-time distance sorting for MRM Relief Hubs & Mosques
     - `calculateInfaqSummary(...)` & `calculateZakatObligation(...)`
4. **`app/src/main/java/my/org/mrm/care/ui/MrmCareApp.kt`**
   - Full Jetpack Compose Material 3 UI implementing all 20 screens, real-time Location & GPS Zone Syncing, and the interactive **9-Module Islamic Utilities Bottom Sheet**.

## How to Open & Run in Android Studio

1. Launch **Android Studio Ladybug (2024.2.1+)** or newer.
2. Select **File → Open...** and choose this `android/` project folder.
3. Allow Android Studio to finish **Gradle Sync** (downloads Kotlin 2.0.21 & Compose BOM 2024.10.01 automatically).
4. Select an **Android Emulator (API 26–35)** or connect a physical Android device via USB Debugging.
5. Click **Run 'app' (`Shift + F10` / `^R`)**.
