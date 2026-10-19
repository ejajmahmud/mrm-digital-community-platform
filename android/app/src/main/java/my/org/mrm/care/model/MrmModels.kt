package my.org.mrm.care.model

enum class ScreenId(val id: String, val title: String, val category: String) {
    SPLASH("01_splash", "Splash Screen", "Onboarding & Auth"),
    ONBOARDING("02_onboarding", "Onboarding Screens", "Onboarding & Auth"),
    WELCOME("03_welcome", "Welcome Screen", "Onboarding & Auth"),
    REGISTER("04_register", "Sign-Up Screen", "Onboarding & Auth"),
    LOGIN("05_login", "Login Screen", "Onboarding & Auth"),
    HOME("06_home", "Home Screen", "Core Workspace"),
    MENU("07_menu", "Menu and Navigation Screen", "Core Workspace"),
    STATS("08_dashboard", "Dashboard Screen", "Operations & Analytics"),
    SEARCH("09_search", "Search Screen", "Core Workspace"),
    CATALOG("10_catalog", "Infaq & Relief Campaigns", "Commerce & Infaq"),
    DETAIL("11_detail", "Campaign & Kit Breakdown", "Commerce & Infaq"),
    PROFILE("12_profile", "Profile Screen", "System & Identity"),
    SETTINGS("13_settings", "Settings Screen", "System & Identity"),
    CALENDAR("14_calendar", "Calendar & Booking Screen", "Operations & Field"),
    CHAT_LIST("15_feed", "Feed & Community Updates", "Community & Comms"),
    CHAT_DETAIL("16_chat", "Chat & Caseworker Support", "Community & Comms"),
    CART("17_cart", "Sadaqah & Infaq Basket", "Commerce & Infaq"),
    CHECKOUT("18_checkout", "Zakat & Infaq Checkout", "Commerce & Infaq"),
    NOTIFICATIONS("19_notifications", "Notifications Screen", "Community & Comms"),
    UPLOAD("20_states", "System States & Audit", "Operations & Field")
}

enum class UserRolePersona(
    val id: String,
    val shortLabel: String,
    val fullName: String,
    val greetingName: String,
    val badgeTitle: String
) {
    STAFF_ADMIN("staff_admin", "Admin Ops", "Capt. Zulkifli Hasan", "Capt.", "Crisis & Dispatch Commander"),
    VOLUNTEER("approved_volunteer", "Volunteer", "Ahmad Faisal", "Ahmad", "Field First Responder"),
    SEEKER("seeker", "Seeker", "Brother Adam Lim", "Adam", "New Revert Care Recipient"),
    TEACHER("approved_teacher", "Scholar/Mentor", "Ustaz Dr. Riduan", "Ustaz", "Tauliah Certified Mentor"),
    APPLICANT("volunteer_applicant", "Applicant", "Nurul Izzah", "Nurul", "Volunteer Applicant"),
    MEMBER("member", "Member", "Dato' Seri Farid", "Farid", "Community Donor & Member")
}

data class LocationZoneConfig(
    val code: String,
    val label: String,
    val stateName: String,
    val city: String,
    val hubName: String,
    val authority: String,
    val latitude: Double,
    val longitude: Double,
    val utcOffsetHours: Double
)

data class PrayerTimeEntry(
    val name: String,
    val time: String,
    val minutes: Int
)

data class WaqtPeriod(
    val id: String,
    val name: String,
    val arabicName: String,
    val category: String, // "FARZ" | "NAFL" | "PROHIBITED"
    val startTime: String,
    val endTime: String,
    val ruling: String,
    val description: String
)

data class DailyPrayerAlmanac(
    val zoneCode: String,
    val zoneLabel: String,
    val hijriDate: String,
    val sehriEnds: String,
    val fajrAzan: String,
    val sunriseTime: String,
    val ishraqStart: String,
    val chashtStart: String,
    val zawalStart: String,
    val dhuhrAzan: String,
    val asrAzan: String,
    val sunsetTime: String,
    val iftarStarts: String,
    val maghribAzan: String,
    val awwabinWindow: String,
    val ishaAzan: String,
    val tahajjudWindow: String,
    val periods: List<WaqtPeriod>
)

data class NearbyFacility(
    val id: String,
    val name: String,
    val type: String,
    val zoneCode: String,
    val city: String,
    val latitude: Double,
    val longitude: Double,
    val distanceKm: Double,
    val status: String,
    val contact: String
)

data class NextPrayerResult(
    val nextPrayer: PrayerTimeEntry,
    val minutesRemaining: Int,
    val formattedCountdown: String
)

data class LocationSyncSnapshot(
    val zone: LocationZoneConfig,
    val isCustomGps: Boolean,
    val latitude: Double,
    val longitude: Double,
    val qiblaBearing: Double,
    val distanceToKaabaKm: Int,
    val prayers: List<PrayerTimeEntry>,
    val nextPrayerInfo: NextPrayerResult,
    val almanac: DailyPrayerAlmanac,
    val nearbyFacilities: List<NearbyFacility>
)

data class CatalogItem(
    val id: String,
    val title: String,
    val subtitle: String,
    val category: String,
    val price: Int,
    val raised: Int,
    val goal: Int,
    val donors: Int,
    val urgency: String,
    val location: String,
    val auditCode: String,
    val description: String,
    val beneficiariesPerShare: Int
)

data class CartItem(
    val item: CatalogItem,
    val quantity: Int
)

data class InfaqSummary(
    val subtotal: Int,
    val logisticsSupport: Int,
    val totalAmount: Int,
    val totalShares: Int,
    val estimatedBeneficiaries: Int
)

data class CampaignProgress(
    val percentage: Int,
    val remainingAmount: Int,
    val isFullyFunded: Boolean
)

data class ZakatInput(
    val cashAndSavings: Double,
    val goldAndSilverValue: Double,
    val businessAssets: Double,
    val investmentValue: Double,
    val shortTermLiabilities: Double,
    val nisabThresholdRM: Double = 24000.0
)

data class ZakatCalculationResult(
    val grossAssessableWealth: Double,
    val netZakatableWealth: Double,
    val nisabThresholdRM: Double,
    val isEligibleForZakat: Boolean,
    val zakatPayableRM: Double,
    val recommendedInfaqSplitRM: Double
)

data class SurahInfo(
    val number: Int,
    val nameTranslit: String,
    val nameArabic: String,
    val meaning: String,
    val versesCount: Int,
    val keyAyahArabic: String,
    val keyAyahTranslation: String
)

data class MasnoonDuaInfo(
    val id: String,
    val title: String,
    val category: String,
    val arabic: String,
    val transliteration: String,
    val translation: String,
    val reference: String
)

data class AsmaUlHusnaInfo(
    val number: Int,
    val arabic: String,
    val transliteration: String,
    val meaning: String,
    val reflection: String
)

data class RevertSalahStep(
    val stepNumber: Int,
    val postureName: String,
    val arabicPhrase: String,
    val transliteration: String,
    val englishMeaning: String,
    val guidanceNote: String
)

data class HalalECodeItem(
    val code: String,
    val name: String,
    val status: String, // "Halal" | "Mushbooh" | "Haram"
    val source: String,
    val jakimNote: String
)

object MrmSampleData {
    val LOCATION_ZONES = listOf(
        LocationZoneConfig("WLY01", "WLY01 - Kuala Lumpur & Putrajaya", "Wilayah Persekutuan", "Kuala Lumpur", "Masjid Wilayah Persekutuan", "JAKIM Malaysia", 3.1390, 101.6869, 8.0),
        LocationZoneConfig("SGR01", "SGR01 - Selangor (Gombak, Petaling, Shah Alam)", "Selangor", "Shah Alam", "Masjid Sultan Salahuddin Abdul Aziz", "JAIS / JAKIM", 3.0738, 101.5183, 8.0),
        LocationZoneConfig("JHR02", "JHR02 - Johor Bahru, Kulai & Kota Tinggi", "Johor", "Johor Bahru", "Masjid Sultan Abu Bakar JB", "JAINJ / JAKIM", 1.4927, 103.7414, 8.0),
        LocationZoneConfig("PNG01", "PNG01 - Pulau Pinang (Georgetown & Butterworth)", "Pulau Pinang", "Georgetown", "Masjid Negeri Pulau Pinang", "MAINPP / JAKIM", 5.4141, 100.3288, 8.0),
        LocationZoneConfig("PRK02", "PRK02 - Perak (Ipoh, Batu Gajah & Kampar)", "Perak", "Ipoh", "Masjid Sultan Idris Shah II", "JAIPk / JAKIM", 4.5975, 101.0901, 8.0),
        LocationZoneConfig("KTN01", "KTN01 - Kelantan (Kota Bharu, Bachok & Tumpat)", "Kelantan", "Kota Bharu", "Masjid Muhammadi Kota Bharu", "MAIK / JAKIM", 6.1254, 102.2381, 8.0),
        LocationZoneConfig("TRG01", "TRG01 - Terengganu (Kuala Terengganu & Marang)", "Terengganu", "Kuala Terengganu", "Masjid Kristal Taman Tamadun", "MAIDAM / JAKIM", 5.3296, 103.1370, 8.0),
        LocationZoneConfig("SBH07", "SBH07 - Sabah (Kota Kinabalu, Penampang & Papar)", "Sabah", "Kota Kinabalu", "Masjid Bandaraya Kota Kinabalu", "MUIS / JAKIM", 5.9804, 116.0735, 8.0),
        LocationZoneConfig("SWK08", "SWK08 - Sarawak (Kuching, Samarahan & Serian)", "Sarawak", "Kuching", "Masjid Jamek Negeri Sarawak", "JAIS Sarawak / JAKIM", 1.5533, 110.3592, 8.0),
        LocationZoneConfig("SGP01", "SGP01 - Singapore (MUIS Central)", "Singapore", "Singapore", "Masjid Sultan Kampong Glam", "MUIS Singapore", 1.3521, 103.8198, 8.0),
        LocationZoneConfig("MKH01", "MKH01 - Makkah Al-Mukarramah (Umm al-Qura)", "Hijaz", "Makkah", "Al-Masjid Al-Haram Gate 79", "Umm al-Qura", 21.4225, 39.8262, 3.0),
        LocationZoneConfig("MDN01", "MDN01 - Madinah Al-Munawwarah", "Hijaz", "Madinah", "Al-Masjid An-Nabawi Care Desk", "Umm al-Qura", 24.4672, 39.6112, 3.0)
    )

    val CATALOG_ITEMS = listOf(
        CatalogItem(
            id = "camp-1",
            title = "Emergency Asnaf Halal Grocery & Staples Box",
            subtitle = "Rice, oil, dates & staples for 4 pax",
            category = "Food Relief",
            price = 120,
            raised = 42800,
            goal = 52000,
            donors = 356,
            urgency = "Urgent Triage",
            location = "Kuala Lumpur & Selangor (WLY01)",
            auditCode = "LHDN Sec 44(6) • SOS-8492",
            description = "Provides 10kg fragrant rice, 5kg cooking oil, 4kg flour, sugar, infant formula, and Mariami dates directly to audited urban poor and single-mother families.",
            beneficiariesPerShare = 4
        ),
        CatalogItem(
            id = "camp-2",
            title = "New Revert (Muallaf) Starter Kit & Mentorship",
            subtitle = "Bilingual Quran, prayer rug, solat manual & 6mo mentor",
            category = "Revert Care",
            price = 85,
            raised = 26400,
            goal = 30000,
            donors = 310,
            urgency = "Free for Reverts",
            location = "Nationwide MRM Care Hubs",
            auditCode = "LHDN Sec 44(6) • SAFE-104",
            description = "Equips every new brother or sister in Islam with a hardcover Bilingual Tajweed Quran, velvet prayer mat, step-by-step pictorial Salah guide, and 6 months of 1-on-1 mentorship.",
            beneficiariesPerShare = 1
        ),
        CatalogItem(
            id = "camp-3",
            title = "Revert Sister Safe Transit Shelter & Legal Escort",
            subtitle = "24/7 confidential safe haven, counseling & welfare",
            category = "Safeguarding",
            price = 150,
            raised = 38500,
            goal = 45000,
            donors = 258,
            urgency = "High Priority",
            location = "WLY01 & SGR01 Protected Sectors",
            auditCode = "LHDN Sec 44(6) • SAFE-209",
            description = "Funds emergency safe transit accommodation, female protection caseworkers, and emergency subsistence for vulnerable new converts facing family displacement.",
            beneficiariesPerShare = 1
        ),
        CatalogItem(
            id = "camp-4",
            title = "Mobile Clinic & Asnaf Dialysis Subsidy",
            subtitle = "Free hemodialysis & chronic medication for elderly Asnaf",
            category = "Medical Aid",
            price = 180,
            raised = 64200,
            goal = 75000,
            donors = 289,
            urgency = "Medical Relief",
            location = "Nationwide MRM Panel Clinics",
            auditCode = "LHDN Sec 44(6) • MED-112",
            description = "Covers one full hemodialysis session and post-session medication for low-income kidney patients verified by hospital social workers.",
            beneficiariesPerShare = 1
        )
    )

    val SURAHS = listOf(
        SurahInfo(1, "Al-Fatihah", "الفاتحة", "The Opening", 7, "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", "It is You we worship and You we ask for help. (1:5)"),
        SurahInfo(36, "Ya-Sin", "يس", "Heart of the Quran", 83, "سَلَامٌ قَوْلًا مِّن رَّبٍّ رَّحِيمٍ", "'Peace,' a word from a Merciful Lord. (36:58)"),
        SurahInfo(67, "Al-Mulk", "الملك", "The Sovereignty", 30, "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", "Blessed is He in whose hand is dominion, and He is over all things competent. (67:1)"),
        SurahInfo(112, "Al-Ikhlas", "الإخلاص", "Sincere Monotheism", 4, "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ", "Say, 'He is Allah, [who is] One, Allah, the Eternal Refuge.' (112:1-2)"),
        SurahInfo(113, "Al-Falaq", "الفلق", "The Daybreak", 5, "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", "Say, 'I seek refuge in the Lord of daybreak.' (113:1)"),
        SurahInfo(114, "An-Nas", "الناس", "Mankind", 6, "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", "Say, 'I seek refuge in the Lord of mankind.' (114:1)")
    )

    val MASNOON_DUAS = listOf(
        MasnoonDuaInfo("dua-1", "Niyyah for Fasting (Sehri)", "Fasting & Iftar", "نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى", "Nawaytu sawma ghadin 'an ada'i fardi shahri Ramadana hadhihis-sanati lillahi Ta'ala", "I intend to fast tomorrow to fulfill the obligation of the month of Ramadan this year for Allah the Exalted.", "Fiqh al-Shafi'i / JAKIM"),
        MasnoonDuaInfo("dua-2", "Dua for Breaking Fast (Iftar)", "Fasting & Iftar", "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ", "Dhahaba az-zama'u wabtallatil-'uruqu wa thabatal-ajru in sha' Allah", "The thirst is gone, the veins are moistened, and the reward is confirmed, if Allah wills.", "Sunan Abi Dawud 2357"),
        MasnoonDuaInfo("dua-3", "Sayyidul Istighfar (Chief Dua for Forgiveness)", "Morning & Evening", "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ", "Allahumma Anta Rabbi la ilaha illa Anta, khalaqtani wa ana 'abduka", "O Allah, You are my Lord, there is no deity except You; You created me and I am Your servant.", "Sahih al-Bukhari 6306"),
        MasnoonDuaInfo("dua-4", "Revert Ease & Steadfastness of Heart", "Revert Care", "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ", "Ya Muqallibal-qulub, thabbit qalbi 'ala dinik", "O Turner of the hearts, keep my heart firm upon Your religion.", "Jami at-Tirmidhi 2140")
    )

    val REVERT_SALAH_STEPS = listOf(
        RevertSalahStep(1, "Takbiratul Ihram (Opening)", "اللَّهُ أَكْبَرُ", "Allahu Akbar", "Allah is the Greatest", "Raise both hands to earlobes/shoulders facing the Qibla and form intention in your heart."),
        RevertSalahStep(2, "Qiyam & Surah Al-Fatihah", "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", "Bismillahir-Rahmanir-Rahim. Alhamdulillahi Rabbil-'Alamin...", "In the Name of Allah... All praise is due to Allah, Lord of the worlds.", "Place right hand over left on chest and recite Surah Al-Fatihah calmly."),
        RevertSalahStep(3, "Ruku' (Bowing)", "سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ", "Subhana Rabbiyal-'Azim wa bihamdih (3x)", "Glory be to my Lord, the Most Great, and praise be to Him.", "Bow with back straight and hands resting on knees."),
        RevertSalahStep(4, "I'tidal (Rising from Bow)", "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ ۝ رَبَّنَا لَكَ الْحَمْدُ", "Sami'Allahu liman hamidah. Rabbana lakal-hamd", "Allah hears whoever praises Him. Our Lord, to You belongs all praise.", "Stand upright calmly before descending into prostration."),
        RevertSalahStep(5, "Sujud (Prostration)", "سُبْحَانَ رَبِّيَ الْأَعْلَىٰ وَبِحَمْدِهِ", "Subhana Rabbiyal-A'la wa bihamdih (3x)", "Glory be to my Lord, the Most High, and praise be to Him.", "Rest forehead, nose, both palms, both knees, and toes on the prayer mat."),
        RevertSalahStep(6, "Jalsah (Sitting Between Sujud)", "رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَارْزُقْنِي", "Rabbighfir li warhamni wahdini warzuqni", "My Lord, forgive me, have mercy on me, guide me, and provide for me.", "Sit calmly on the left foot with right foot upright, then perform the second Sujud."),
        RevertSalahStep(7, "Tashahhud & Taslim (Closing)", "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ", "As-salamu 'alaykum wa rahmatullah", "Peace and mercy of Allah be upon you.", "Recite At-Tahiyyat and Salawat upon the Prophet ﷺ, then turn head right and left.")
    )

    val HALAL_ECODES = listOf(
        HalalECodeItem("E120", "Cochineal / Carmine Red", "Haram", "Crushed female Dactylopius coccus insects", "Non-Halal under Shafi'i / JAKIM MS 1500:2019."),
        HalalECodeItem("E441", "Gelatine (Animal Derived)", "Mushbooh", "Bovine or porcine collagen hydrolysis", "Requires verified JAKIM Halal slaughter certificate; avoid if porcine."),
        HalalECodeItem("E471", "Mono- and Diglycerides of Fatty Acids", "Mushbooh", "Soy/palm oil (Halal) or animal fat (Syubhah)", "Verify plant-origin or JAKIM Halal logo on packaging."),
        HalalECodeItem("E322", "Lecithin (Soy / Sunflower)", "Halal", "Soybean or egg yolk", "100% Halal when plant-derived."),
        HalalECodeItem("E100", "Curcumin (Turmeric Extract)", "Halal", "Natural Curcuma longa rhizome", "100% Halal natural botanical colorant.")
    )

    val ASMA_UL_HUSNA = listOf(
        AsmaUlHusnaInfo(1, "الرَّحْمَنُ", "Ar-Rahman", "The Entirely Merciful", "Encompasses all creation with immediate provision and compassion."),
        AsmaUlHusnaInfo(2, "الرَّحِيمُ", "Ar-Rahim", "The Especially Merciful", "Bestows enduring mercy upon the believers in this life and the Hereafter."),
        AsmaUlHusnaInfo(3, "الْمَلِكُ", "Al-Malik", "The Sovereign Lord", "Absolute Owner and Ruler of the heavens and earth."),
        AsmaUlHusnaInfo(4, "الْقُدُّوسُ", "Al-Quddus", "The Pure & Sacred", "Transcendent above every imperfection or human limitation."),
        AsmaUlHusnaInfo(5, "السَّلَامُ", "As-Salam", "The Source of Peace", "Grants safety, tranquility, and wholeness to the hearts."),
        AsmaUlHusnaInfo(6, "الرَّزَّاقُ", "Ar-Razzaq", "The Total Provider", "Sustains every living creature with both physical and spiritual nourishment.")
    )
}
