# MRM Care — Pure Native Android Studio Project (Kotlin + Jetpack Compose)

Official **Multiracial Reverted Muslims (MRM)** native Android application built with **Kotlin 2.0**, **Jetpack Compose (Material 3)**, and **Android Gradle Plugin (AGP 8.7.2)**.

## Quick Start in Android Studio
1. Open **Android Studio** (Ladybug 2024.2.1 or newer recommended).
2. Click **Open** and select this `android` folder (the directory containing `settings.gradle.kts` and `build.gradle.kts`).
3. Allow **Gradle Sync** to complete (uses JDK 17, `compileSdk = 35`, `minSdk = 26`).
4. Select any Android Emulator (e.g., Pixel 8 API 35) or physical Android device via USB Debugging.
5. Click **Run 'app'** (`Shift + F10` / `Ctrl + R`).

## Architecture & Included Features
- **`MainActivity.kt` & `ui/MrmCareApp.kt`**:
  - Edge-to-edge Material 3 scaffold with Light Theme as default (`ui/theme/Theme.kt`) and instant Dark Theme toggle inside the Sidebar Menu (`Screen #7`) and Settings (`Screen #20`).
  - **De-densed Top Bar**: Displays the custom-drawn MRM 3-Arch Vector Monogram (`ui/components/MrmLogo.kt`), full title (`MRM Care — Multiracial Reverted Muslims`), Infaq Pledge Basket badge, Human Icon (`Person`) Role Switcher dropdown (`Admin Ops`, `Volunteer`, `Seeker`, `Scholar/Mentor`, `Applicant`, `Member`), and Sidebar Menu button.
- **`domain/MrmLogic.kt`**:
  - **Multi-Month Gregorian & Hijri Calendar Switcher** (`September 2026` – `January 2027` / `Rabi' al-Awwal` – `Sha'ban 1448H`) with weekday grid offsets and event markers.
  - **Live Zakat 2.5% Nisab Calculator** against the RM 24,000 Gold Nisab threshold.
  - **Infaq Basket & LHDN Sec 44(6) Checkout** with optional RM 10 field logistics fuel top-up and FPX / DuitNow payment confirmation.
  - **JAKIM e-Solat Zone Offsets** across `WLY01`, `SGR01`, `JHR01`, `PNG01`, `SBH01`, and `SWK01`.
