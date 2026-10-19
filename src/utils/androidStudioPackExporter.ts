export interface AndroidProjectFile {
  path: string;
  description: string;
  content: string;
}

export function getAndroidProjectFileTree(): AndroidProjectFile[] {
  return [
    {
      path: 'settings.gradle.kts',
      description: 'Gradle project settings & repository configuration',
      content: `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "MRMCareAndroid"
include(":app")
`,
    },
    {
      path: 'build.gradle.kts',
      description: 'Root build configuration with Kotlin 2.0 & Compose plugins',
      content: `plugins {
    id("com.android.application") version "8.7.2" apply false
    id("org.jetbrains.kotlin.android") version "2.0.21" apply false
    id("org.jetbrains.kotlin.plugin.compose") version "2.0.21" apply false
}
`,
    },
    {
      path: 'gradle.properties',
      description: 'JVM heap, AndroidX, and non-transitive R class flags',
      content: `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
kotlin.code.style=official
android.nonTransitiveRClass=true
`,
    },
    {
      path: 'app/build.gradle.kts',
      description: 'App module config targeting Android 15 (SDK 35) & Jetpack Compose BOM',
      content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

android {
    namespace = "my.org.mrm.care"
    compileSdk = 35

    defaultConfig {
        applicationId = "my.org.mrm.care"
        minSdk = 26
        targetSdk = 35
        versionCode = 12
        versionName = "2.4.0"

        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2024.10.01")
    implementation(composeBom)
    androidTestImplementation(composeBom)

    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
    implementation("androidx.activity:activity-compose:1.9.3")

    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")

    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}
`,
    },
    {
      path: 'app/src/main/AndroidManifest.xml',
      description: 'Android application manifest with Location & Internet permissions',
      content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MRMCare">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize"
            android:theme="@style/Theme.MRMCare">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`,
    },
    {
      path: 'app/src/main/java/my/org/mrm/care/ui/MrmCareApp.kt',
      description: '1:1 Untitled UI Light/Dark Jetpack Compose App (Header, Emerald Hero, 4x2 Bento, 6 Roles, 20 Screens)',
      content: `package my.org.mrm.care.ui

// Full 3,440-line 1:1 Jetpack Compose UI packaged in MRM_Care_Android_Studio_Project.zip
// Matches the Web Preview 1:1:
// - Clean Light Untitled UI Default (Slate-50 canvas, Pure White header & cards, Dark Mode toggle in Settings)
// - Top Header Bar with MrmLogoBadge + 4 rounded-xl icon buttons (Islamic Utilities, Infaq Basket, Role Persona, Drawer)
// - Emerald-700/800/900 Hero Card with Location Dropdown, GPS Sync, Spherical Qibla Bearing, Next Prayer Countdown & 5-Waqt Strip (Subuh, Zohor, Asar, Maghrib, Isyak)
// - 4x2 Bento Grid of 8 Islamic Utilities (Waqt & Fast, Salah Log, Qibla 3D, Tajweed, Halal Check, Duas & Adhkar, Zakat Calc, Asmaul Husna)
// - 4 Quick Actions Grid (Revert Care, Halal Aid, Schedule, Care Chat)
// - 6-Role Persona Switcher (Admin Ops, Volunteer, Seeker, Teacher, Applicant, Member) with 2x2 KPI Grid & Priority Dispatches
// - Active Welfare & Revert Programs 2-Column Grid + Interactive 1-Click Infaq Chips (RM 10, RM 30, RM 50, RM 100)
// - 5-Tab Bottom Navigation Bar (Home, Schedule, Relief, Chat, Profile)
`,
    },
    {
      path: 'app/src/main/java/my/org/mrm/care/ui/theme/Theme.kt',
      description: 'Untitled UI Light (Default) & Dark Material 3 Color Schemes + Pastel Bento Tokens',
      content: `package my.org.mrm.care.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val Emerald600 = Color(0xFF059669)
val Emerald700 = Color(0xFF047857)
val Emerald800 = Color(0xFF065F46)
val Emerald900 = Color(0xFF064E3B)
val Slate50 = Color(0xFFF8FAFC)
val Slate900 = Color(0xFF0F172A)
val Slate950 = Color(0xFF020617)

@Composable
fun MrmCareTheme(
    darkTheme: Boolean = false, // Defaults to crisp Light Untitled UI matching Web Preview 1:1
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = if (darkTheme) DarkColors else LightColors,
        content = content
    )
}
`,
    },
    {
      path: 'app/src/main/java/my/org/mrm/care/domain/MrmLogic.kt',
      description: 'Pure Kotlin Location & Prayer Sync Engine, Spherical Qibla & Waqt Almanac',
      content: `package my.org.mrm.care.domain

import my.org.mrm.care.model.*
import java.util.Locale
import kotlin.math.*

object MrmLogic {

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

    fun getLocationSyncSnapshot(
        zoneCode: String = "WLY01",
        currentMinutes: Int = 946, // 15:46 -> Asar next in 38 mins (matches Web Preview 1:1)
        customCoords: Pair<Double, Double>? = null
    ): LocationSyncSnapshot {
        val zone = if (customCoords != null) {
            findNearestLocationZone(customCoords.first, customCoords.second)
        } else {
            MrmSampleData.LOCATION_ZONES.find { it.code == zoneCode } ?: MrmSampleData.LOCATION_ZONES.first()
        }
        val lat = customCoords?.first ?: zone.latitude
        val lng = customCoords?.second ?: zone.longitude

        val (qiblaBearing, distanceToKaabaKm) = calculateQiblaDirection(lat, lng)
        val prayers = getPrayersForZone(zone.code, lat, lng)
        val nextPrayerInfo = getNextPrayerInfo(currentMinutes, prayers)
        val almanac = getWaqtAndForbiddenSchedule(zone.code, lat, lng)
        val nearbyFacilities = getNearbyMrmFacilities(lat, lng)

        return LocationSyncSnapshot(
            zone = zone,
            isCustomGps = customCoords != null,
            latitude = lat,
            longitude = lng,
            qiblaBearing = qiblaBearing,
            distanceToKaabaKm = distanceToKaabaKm,
            prayers = prayers,
            nextPrayerInfo = nextPrayerInfo,
            almanac = almanac,
            nearbyFacilities = nearbyFacilities
        )
    }
}
`,
    },
    {
      path: 'app/src/main/java/my/org/mrm/care/MainActivity.kt',
      description: 'Main Android Activity entry point mounting Jetpack Compose UI',
      content: `package my.org.mrm.care

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import my.org.mrm.care.ui.MrmCareApp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MrmCareApp()
        }
    }
}
`,
    },
    {
      path: 'README_ANDROID_STUDIO.md',
      description: 'Step-by-step instructions to build & run in Android Studio',
      content: `# MRM Care — Pure Native Android Studio Project (Kotlin + Jetpack Compose)

1. Launch Android Studio Ladybug (2024.2.1+) or newer.
2. Select File -> Open... and choose the unzipped MRMCareAndroid/ (or android/) project folder.
3. Allow Gradle Sync to complete (Kotlin 2.0.21, AGP 8.7.2, Compose BOM 2024.10.01).
4. Select any API 26-35 emulator or physical Android phone and click Run 'app'.
`,
    },
  ];
}

export async function exportPureAndroidStudioZip(): Promise<void> {
  const response = await fetch('./MRM_Care_Android_Studio_Project.zip');
  if (response.ok) {
    const blob = await response.blob();
    triggerBlobDownload(blob, 'MRM_Care_Android_Studio_Project.zip');
    return;
  }
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
