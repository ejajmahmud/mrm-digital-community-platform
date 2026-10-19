export type ScreenId =
  | 'splash'
  | 'onboarding'
  | 'welcome'
  | 'signup'
  | 'login'
  | 'home'
  | 'menu'
  | 'dashboard'
  | 'search'
  | 'catalog'
  | 'product_detail'
  | 'profile'
  | 'settings'
  | 'calendar_booking'
  | 'feed'
  | 'chat'
  | 'cart'
  | 'checkout'
  | 'notifications'
  | 'empty_loading_error';

export interface ScreenMeta {
  id: ScreenId;
  number: number;
  title: string;
  category:
    | 'Onboarding & Auth'
    | 'Core Operations & Hub'
    | 'Welfare, Infaq & Relief'
    | 'Mentorship, Dawah & System';
  icon: string;
  description: string;
}

export interface CapturedScreenMeta {
  number: number;
  slug: string;
  screenId: ScreenId;
  title: string;
  category:
    | 'Core 20 Screens'
    | '9 Islamic Utilities (Hidden Sheets)'
    | '6 Role Workspaces (Hidden Views)'
    | 'Hidden Modals, Tabs & States';
  query: string;
  description: string;
}

export const ALL_SCREENS_META: ScreenMeta[] = [
  { id: 'splash', number: 1, title: 'Splash Screen', category: 'Onboarding & Auth', icon: 'Sparkles', description: 'MRM Community brand splash with Islamic motto and verified seal' },
  { id: 'onboarding', number: 2, title: 'Onboarding Screens', category: 'Onboarding & Auth', icon: 'Compass', description: 'MRM multiracial revert support, brotherhood, and pastoral care mission' },
  { id: 'welcome', number: 3, title: 'Welcome Screen', category: 'Onboarding & Auth', icon: 'HeartHandshake', description: 'Welcome to MRM: Revert pastoral care, emergency relief, and volunteer hub' },
  { id: 'signup', number: 4, title: 'Sign-Up Screen', category: 'Onboarding & Auth', icon: 'UserPlus', description: 'Community role registration: Revert/Seeker, Volunteer, Scholar, Member' },
  { id: 'login', number: 5, title: 'Login Screen', category: 'Onboarding & Auth', icon: 'LogIn', description: 'Secure member credentials & biometric Face ID authentication' },
  { id: 'home', number: 6, title: 'Home Screen', category: 'Core Operations & Hub', icon: 'Home', description: 'MRM Hub: JAKIM prayer clock, urgent crisis triage, Islamic utilities, revert mentors' },
  { id: 'menu', number: 7, title: 'Menu and Navigation Screen', category: 'Core Operations & Hub', icon: 'Menu', description: 'MRM master navigation drawer: Islamic tools, care requests, academy, zakat' },
  { id: 'dashboard', number: 8, title: 'Dashboard Screen', category: 'Core Operations & Hub', icon: 'LayoutDashboard', description: 'MRM Impact: Asnaf aided, revert mentorship hours, and Zakat disbursed' },
  { id: 'search', number: 9, title: 'Search Screen', category: 'Core Operations & Hub', icon: 'Search', description: 'Directory search for Mosques, Duas, Halal food checker & emergency squads' },
  { id: 'catalog', number: 10, title: 'Infaq & Relief Campaigns', category: 'Welfare, Infaq & Relief', icon: 'HeartHandshake', description: 'Emergency halal grocery hampers, revert starter kits, dialysis transit & Asnaf aid' },
  { id: 'product_detail', number: 11, title: 'Campaign & Kit Breakdown', category: 'Welfare, Infaq & Relief', icon: 'PackageCheck', description: 'Revert provisions, mentor matching, Asnaf verification & free dispatch' },
  { id: 'profile', number: 12, title: 'Profile Screen', category: 'Core Operations & Hub', icon: 'User', description: 'MRM Member credentials, verified responder badge & service ledger' },
  { id: 'settings', number: 13, title: 'Settings Screen', category: 'Mentorship, Dawah & System', icon: 'Settings', description: 'JAKIM prayer notifications, discreet protection mode & language' },
  { id: 'calendar_booking', number: 14, title: 'Halaqa & Shift Calendar', category: 'Welfare, Infaq & Relief', icon: 'Calendar', description: 'Daily prayer times, Masjid Wilayah Halaqas & volunteer duty shifts' },
  { id: 'feed', number: 15, title: 'Dawah & Impact Feed', category: 'Mentorship, Dawah & System', icon: 'MessageSquare', description: 'MRM stories of hope, new Shahadas, and volunteer field dispatches' },
  { id: 'chat', number: 16, title: 'Caseworker Chat Screen', category: 'Mentorship, Dawah & System', icon: 'Send', description: 'Confidential encrypted chat with assigned revert mentor or coordinator' },
  { id: 'cart', number: 17, title: 'Sadaqah & Infaq Allocation', category: 'Welfare, Infaq & Relief', icon: 'HeartHandshake', description: 'Sadaqah Jariyah sponsorship, food hampers & Asnaf direct relief allocation' },
  { id: 'checkout', number: 18, title: 'Zakat & Direct Infaq Portal', category: 'Welfare, Infaq & Relief', icon: 'CreditCard', description: 'FPX Malaysian online banking, Lembaga Zakat referral & tax relief receipt' },
  { id: 'notifications', number: 19, title: 'Notifications Screen', category: 'Mentorship, Dawah & System', icon: 'Bell', description: 'Adhan prayer alerts, urgent dispatch calls & mentor messages' },
  { id: 'empty_loading_error', number: 20, title: 'Empty, Loading & Error States', category: 'Mentorship, Dawah & System', icon: 'AlertTriangle', description: 'Network resilience, empty care ledger & skeleton loading states' },
];

export const ALL_CAPTURED_SCREENS_META: CapturedScreenMeta[] = [
  // 1-20: Core 20 Screens
  { number: 1, slug: 'splash', screenId: 'splash', title: 'Splash Screen', category: 'Core 20 Screens', query: 'screen=splash', description: 'MRM Community brand splash with verified platform seal & JAKIM WLY01 sync' },
  { number: 2, slug: 'onboarding', screenId: 'onboarding', title: 'Onboarding (Slide 1: Revert Care)', category: 'Core 20 Screens', query: 'screen=onboarding&slide=0', description: 'Onboarding Pillar 1: Real-Time Revert Pastoral Care & 1-on-1 mentorship' },
  { number: 3, slug: 'welcome', screenId: 'welcome', title: 'Welcome Screen', category: 'Core 20 Screens', query: 'screen=welcome', description: 'Welcome to MRM: Revert pastoral care, emergency relief, and volunteer hub' },
  { number: 4, slug: 'signup', screenId: 'signup', title: 'Sign-Up Screen', category: 'Core 20 Screens', query: 'screen=signup', description: 'Community role registration: Revert/Seeker, Volunteer, Scholar, Member' },
  { number: 5, slug: 'login', screenId: 'login', title: 'Login Screen', category: 'Core 20 Screens', query: 'screen=login', description: 'Secure member credentials & biometric Face ID authentication' },
  { number: 6, slug: 'home', screenId: 'home', title: 'Home Hub (Admin Ops Workspace)', category: 'Core 20 Screens', query: 'screen=home&role=staff_admin', description: 'MRM Hub: JAKIM prayer clock, 4x2 Islamic Utilities Bento, KPIs & SOS Triage' },
  { number: 7, slug: 'menu', screenId: 'menu', title: 'Menu & Navigation Drawer', category: 'Core 20 Screens', query: 'screen=menu', description: 'Master navigation drawer: Location Zone sync, Islamic tools & 20-screen index' },
  { number: 8, slug: 'dashboard', screenId: 'dashboard', title: 'Impact Analytics & Zakat Calc', category: 'Core 20 Screens', query: 'screen=dashboard', description: 'Audited Zakat pool, beneficiary metrics, bar chart & live 2.5% Zakat calculator' },
  { number: 9, slug: 'search', screenId: 'search', title: 'Search & Facility Directory', category: 'Core 20 Screens', query: 'screen=search', description: 'Haversine-sorted nearby MRM hubs, mosques, halal food & emergency squads' },
  { number: 10, slug: 'catalog', screenId: 'catalog', title: 'Infaq & Relief Campaigns', category: 'Core 20 Screens', query: 'screen=catalog', description: 'Emergency halal grocery hampers, revert starter kits & dialysis transit' },
  { number: 11, slug: 'product_detail', screenId: 'product_detail', title: 'Campaign Breakdown (Overview)', category: 'Core 20 Screens', query: 'screen=product_detail&tab=overview', description: 'New Revert Starter Kit & Mentorship overview, audit badge & share sponsor' },
  { number: 12, slug: 'profile', screenId: 'profile', title: 'Member Profile & Credentials', category: 'Core 20 Screens', query: 'screen=profile', description: 'Verified MRM digital ID credential, service metrics & role persona matrix' },
  { number: 13, slug: 'settings', screenId: 'settings', title: 'System & JAKIM Zone Settings', category: 'Core 20 Screens', query: 'screen=settings', description: 'JAKIM zone selector, GPS sync, discreet protection mode & theme preferences' },
  { number: 14, slug: 'calendar_booking', screenId: 'calendar_booking', title: 'Halaqa & Volunteer Shift Calendar', category: 'Core 20 Screens', query: 'screen=calendar_booking&view=shifts', description: 'Interactive Hijri/Gregorian calendar, Sunnah fast indicators & shift booking' },
  { number: 15, slug: 'feed', screenId: 'feed', title: 'Dawah & Field Impact Feed', category: 'Core 20 Screens', query: 'screen=feed', description: 'Official field dispatches, sisters Halaqa updates & volunteer stories' },
  { number: 16, slug: 'chat', screenId: 'chat', title: 'Encrypted Caseworker Chat', category: 'Core 20 Screens', query: 'screen=chat', description: 'End-to-end encrypted pastoral & emergency dispatch chat with quick replies' },
  { number: 17, slug: 'cart', screenId: 'cart', title: 'Sadaqah & Infaq Basket', category: 'Core 20 Screens', query: 'screen=cart', description: 'Itemized relief shares, volunteer logistics top-up & LHDN tax summary' },
  { number: 18, slug: 'checkout', screenId: 'checkout', title: 'Zakat & FPX Checkout Portal', category: 'Core 20 Screens', query: 'screen=checkout', description: 'FPX Malaysian online banking, DuitNow QR & donor NRIC tax exemption form' },
  { number: 19, slug: 'notifications', screenId: 'notifications', title: 'Adhan & SOS Notifications', category: 'Core 20 Screens', query: 'screen=notifications', description: 'Real-time Adhan alerts, urgent SOS triage dispatches & mentor messages' },
  { number: 20, slug: 'empty_loading_error', screenId: 'empty_loading_error', title: 'System State: Loading Skeleton', category: 'Core 20 Screens', query: 'screen=empty_loading_error&state=loading', description: 'JAKIM Prayer API & Zakat ledger synchronization skeleton state' },

  // 21-29: Hidden 9-Module Islamic Utilities Suite Sheets
  { number: 21, slug: 'utility_waqt', screenId: 'home', title: 'Utility #1: Waqt, Sehri/Iftar & Haram', category: '9 Islamic Utilities (Hidden Sheets)', query: 'screen=home&utility=waqt', description: 'Sehri Imsak, Iftar Maghrib, 5 Farz Waqt windows, 4 Nafl & 3 Prohibited Haram times' },
  { number: 22, slug: 'utility_tracker', screenId: 'home', title: 'Utility #2: 5-Waqt Salah & Qaza Log', category: '9 Islamic Utilities (Hidden Sheets)', query: 'screen=home&utility=tracker', description: 'Interactive daily 5-Waqt prayer completion checklist, streak & Qaza backlog counter' },
  { number: 23, slug: 'utility_qibla', screenId: 'home', title: 'Utility #3: 3D Spherical Qibla Compass', category: '9 Islamic Utilities (Hidden Sheets)', query: 'screen=home&utility=qibla', description: 'Great-circle Kaaba bearing (292.5° WNW), distance to Makkah & nearest mosques' },
  { number: 24, slug: 'utility_quran', screenId: 'home', title: 'Utility #4: Color-Coded Tajweed Quran', category: '9 Islamic Utilities (Hidden Sheets)', query: 'screen=home&utility=quran', description: 'Surah Al-Fatihah, Al-Ikhlas, Al-Falaq & An-Nas with color Tajweed rules & audio' },
  { number: 25, slug: 'utility_tasbih', screenId: 'home', title: 'Utility #5: Digital Tasbih Counter', category: '9 Islamic Utilities (Hidden Sheets)', query: 'screen=home&utility=tasbih', description: 'Interactive Dhikr counter with 33x / 99x / 100x targets & Sunnah presets' },
  { number: 26, slug: 'utility_dua', screenId: 'home', title: 'Utility #6: Hisnul Muslim Duas & Ruqyah', category: '9 Islamic Utilities (Hidden Sheets)', query: 'screen=home&utility=dua', description: 'Categorized authentic Duas (Fasting, Morning/Evening, Protection, Distress)' },
  { number: 27, slug: 'utility_salah_guide', screenId: 'home', title: 'Utility #7: Revert 7-Posture Solat Guide', category: '9 Islamic Utilities (Hidden Sheets)', query: 'screen=home&utility=salah_guide', description: 'Step-by-step Wudhu & 7-Posture Solat guide for new Muslims with transliteration' },
  { number: 28, slug: 'utility_sifat', screenId: 'home', title: 'Utility #8: Asma-ul-Husna (99 Names)', category: '9 Islamic Utilities (Hidden Sheets)', query: 'screen=home&utility=sifat', description: 'Beautiful Names & Attributes of Allah with Arabic calligraphy & reflection benefits' },
  { number: 29, slug: 'utility_halal', screenId: 'home', title: 'Utility #9: Halal E-Code, Zakat & Fitrah', category: '9 Islamic Utilities (Hidden Sheets)', query: 'screen=home&utility=halal', description: 'JAKIM Halal E-Number database search + Zakat Fitrah & Fidyah obligation calculator' },

  // 30-34: Hidden Role-Adaptive Home Workspaces
  { number: 30, slug: 'role_volunteer', screenId: 'home', title: 'Role #2: Field Volunteer Workspace', category: '6 Role Workspaces (Hidden Views)', query: 'screen=home&role=approved_volunteer', description: 'Ahmad Faisal Field Responder shift check-in, GPS route & active SOS dispatch' },
  { number: 31, slug: 'role_seeker', screenId: 'home', title: 'Role #3: New Revert / Seeker Workspace', category: '6 Role Workspaces (Hidden Views)', query: 'screen=home&role=seeker', description: 'Brother Adam Tan Shahada milestone tracker, assigned mentor & discreet safety' },
  { number: 32, slug: 'role_teacher', screenId: 'home', title: 'Role #4: Scholar / Mentor Workspace', category: '6 Role Workspaces (Hidden Views)', query: 'screen=home&role=approved_teacher', description: 'Ustazah Hana Al-Idrus Halaqa session roster, Tajweed clinic & mentee progress' },
  { number: 33, slug: 'role_applicant', screenId: 'home', title: 'Role #5: Relief Applicant Workspace', category: '6 Role Workspaces (Hidden Views)', query: 'screen=home&role=volunteer_applicant', description: 'Puan Siti Sarah Asnaf aid application tracker & SKP vetting checklist' },
  { number: 34, slug: 'role_member', screenId: 'home', title: 'Role #6: Community Donor Workspace', category: '6 Role Workspaces (Hidden Views)', query: 'screen=home&role=member', description: 'Dato’ Seri Farid Sadaqah Jariyah impact ledger & LHDN tax deduction summary' },

  // 35-48: Hidden Sub-Screens, Tabs, Modals, States & Dark Theme
  { number: 35, slug: 'onboarding_slide2', screenId: 'onboarding', title: 'Hidden Slide: Onboarding Pillar 2 (Welfare)', category: 'Hidden Modals, Tabs & States', query: 'screen=onboarding&slide=1', description: 'Audited Welfare & Direct Asnaf Aid onboarding slide with LHDN Sec 44(6) highlights' },
  { number: 36, slug: 'onboarding_slide3', screenId: 'onboarding', title: 'Hidden Slide: Onboarding Pillar 3 (Squads)', category: 'Hidden Modals, Tabs & States', query: 'screen=onboarding&slide=2', description: 'Unified Mosque & Volunteer Squad onboarding slide with final Get Started CTA' },
  { number: 37, slug: 'product_provisions', screenId: 'product_detail', title: 'Hidden Tab: Kit Itemized Provisions', category: 'Hidden Modals, Tabs & States', query: 'screen=product_detail&tab=provisions', description: 'Itemized breakdown of physical provisions inside the Revert & Asnaf Care Kit' },
  { number: 38, slug: 'product_impact', screenId: 'product_detail', title: 'Hidden Tab: Audited Campaign Impact', category: 'Hidden Modals, Tabs & States', query: 'screen=product_detail&tab=impact', description: 'Field coordinator verification, audit trail & beneficiary distribution metrics' },
  { number: 39, slug: 'calendar_almanac', screenId: 'calendar_booking', title: 'Hidden Tab: Calendar Waqt & Haram Almanac', category: 'Hidden Modals, Tabs & States', query: 'screen=calendar_booking&view=almanac', description: 'Daily Sehri/Iftar times, 5 Farz Waqt ranges & 3 Prohibited prayer windows inside Calendar' },
  { number: 40, slug: 'calendar_confirm_modal', screenId: 'calendar_booking', title: 'Hidden Modal: Shift Booking Confirmation', category: 'Hidden Modals, Tabs & States', query: 'screen=calendar_booking&modal=booking_confirm', description: 'Volunteer Halaqa & relief duty shift registration confirmation modal' },
  { number: 41, slug: 'feed_composer', screenId: 'feed', title: 'Hidden Modal: Field Dispatch Post Composer', category: 'Hidden Modals, Tabs & States', query: 'screen=feed&modal=composer', description: 'New community story & volunteer field dispatch creation modal overlay' },
  { number: 42, slug: 'checkout_receipt', screenId: 'checkout', title: 'Hidden Screen: Official LHDN Tax Receipt', category: 'Hidden Modals, Tabs & States', query: 'screen=checkout&state=receipt', description: 'Verified post-payment LHDN Section 44(6) tax-deductible receipt (MRM-2026-TX-849210)' },
  { number: 43, slug: 'state_empty', screenId: 'empty_loading_error', title: 'Hidden State: Empty Care Missions View', category: 'Hidden Modals, Tabs & States', query: 'screen=empty_loading_error&state=empty', description: 'Zero active missions empty state with direct CTA to explore Infaq campaigns' },
  { number: 44, slug: 'state_error', screenId: 'empty_loading_error', title: 'Hidden State: Offline Gateway Error View', category: 'Hidden Modals, Tabs & States', query: 'screen=empty_loading_error&state=error', description: 'Network interruption resilience screen with offline prayer/Quran fallback & retry' },
  { number: 45, slug: 'modal_role_picker', screenId: 'home', title: 'Hidden Overlay: Role Persona Switcher', category: 'Hidden Modals, Tabs & States', query: 'screen=home&modal=role_picker', description: 'Top-bar dropdown popover switching between all 6 MRM operating role personas' },
  { number: 46, slug: 'modal_navigator', screenId: 'home', title: 'Hidden Modal: 20-Screen Master Directory', category: 'Hidden Modals, Tabs & States', query: 'screen=home&modal=navigator', description: 'Categorized full-screen modal jumping directly to any of the 20 core screens' },
  { number: 47, slug: 'modal_android_apk', screenId: 'home', title: 'Hidden Modal: Native Android APK & QR Sheet', category: 'Hidden Modals, Tabs & States', query: 'screen=home&modal=android_apk', description: 'In-phone modal for scanning live QR, installing PWA APK & viewing Android specs' },
  { number: 48, slug: 'home_dark_mode', screenId: 'home', title: 'Hidden Theme: Night Mode Home Hub', category: 'Hidden Modals, Tabs & States', query: 'screen=home&theme=dark', description: 'High-contrast OLED Slate-950 Night Appearance Theme on the MRM Home Hub' },
];

export interface CartItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  quantity: number;
  category: string;
  iconName: string;
}

export interface CatalogItem {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
  isFree?: boolean;
  coordinator: string;
  location: string;
  rating: number;
  reviewsCount: number;
  badge?: string;
  duration?: string;
}
