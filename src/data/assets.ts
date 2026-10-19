/**
 * High-resolution self-contained SVG Data-URI artwork & editorial illustrations
 * for the MRM Digital Community Platform (Zero external image dependency).
 */

function svgUri(svgContent: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}

function createAvatarSvg(initials: string, bgStart: string, bgEnd: string, accent: string): string {
  return svgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgStart}" />
          <stop offset="100%" stop-color="${bgEnd}" />
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="80" fill="url(#g)" />
      <circle cx="80" cy="60" r="26" fill="${accent}" fill-opacity="0.22" />
      <path d="M32 142c8-26 26-40 48-40s40 14 48 40" fill="${accent}" fill-opacity="0.18" />
      <circle cx="80" cy="80" r="74" fill="none" stroke="${accent}" stroke-opacity="0.3" stroke-width="2" />
      <text x="80" y="92" font-family="Plus Jakarta Sans, sans-serif" font-size="38" font-weight="700" fill="#ffffff" text-anchor="middle">${initials}</text>
    </svg>
  `);
}

export const ASSETS = {
  avatars: {
    admin: createAvatarSvg('RN', '#065f46', '#047857', '#6ee7b7'), // Capt. Razali Noor
    volunteer: createAvatarSvg('AF', '#0f766e', '#115e59', '#5eead4'), // Ahmad Faisal
    seeker: createAvatarSvg('JM', '#1e40af', '#1d4ed8', '#93c5fd'), // Brother Jason M.
    teacher: createAvatarSvg('HA', '#047857', '#064e3b', '#a7f3d0'), // Ustazah Hana Al-Idrus
    applicant: createAvatarSvg('ZM', '#b45309', '#92400e', '#fcd34d'), // Zaid bin Mansur
    member: createAvatarSvg('NA', '#0d9488', '#0f766e', '#99f6e4'), // Nurul Aini
    sarah: createAvatarSvg('SW', '#be185d', '#9d174d', '#f9a8d4'), // Sister Sarah Wong
    david: createAvatarSvg('DT', '#4338ca', '#3730a3', '#c7d2fe'), // Brother David Tan
  },

  stories: {
    prayer: svgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="p" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#065f46"/>
            <stop offset="100%" stop-color="#047857"/>
          </linearGradient>
        </defs>
        <rect width="200" height="200" rx="36" fill="url(#p)"/>
        <circle cx="100" cy="85" r="42" fill="#fbbf24" fill-opacity="0.2"/>
        <path d="M112 62a30 30 0 1 0 0 52 26 26 0 1 1 0-52z" fill="#fbbf24"/>
        <path d="M55 155h90" stroke="#a7f3d0" stroke-width="6" stroke-linecap="round"/>
      </svg>
    `),
    foodBank: svgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <rect width="200" height="200" rx="36" fill="#b45309"/>
        <rect x="45" y="75" width="110" height="80" rx="14" fill="#fef3c7"/>
        <path d="M70 75V60a30 30 0 0 1 60 0v15" fill="none" stroke="#fde68a" stroke-width="10"/>
        <circle cx="100" cy="115" r="18" fill="#d97706"/>
      </svg>
    `),
    revertCare: svgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <rect width="200" height="200" rx="36" fill="#0f766e"/>
        <rect x="52" y="45" width="96" height="115" rx="10" fill="#ccfbf1"/>
        <path d="M75 80h50M75 105h50M75 130h32" stroke="#0f766e" stroke-width="8" stroke-linecap="round"/>
      </svg>
    `),
    healthcare: svgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <rect width="200" height="200" rx="36" fill="#0369a1"/>
        <circle cx="100" cy="100" r="52" fill="#e0f2fe"/>
        <path d="M100 72v56M72 100h56" stroke="#0284c7" stroke-width="14" stroke-linecap="round"/>
      </svg>
    `),
    volunteers: svgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <rect width="200" height="200" rx="36" fill="#047857"/>
        <circle cx="100" cy="80" r="26" fill="#d1fae5"/>
        <path d="M56 152c8-24 24-38 44-38s36 14 44 38" fill="#a7f3d0"/>
      </svg>
    `),
    zakat: svgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <rect width="200" height="200" rx="36" fill="#15803d"/>
        <circle cx="100" cy="100" r="48" fill="#dcfce7" stroke="#86efac" stroke-width="6"/>
        <path d="M85 102l12 12 24-26" fill="none" stroke="#15803d" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `),
  },

  banners: {
    communityHall: svgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 420">
        <defs>
          <linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#064e3b"/>
            <stop offset="55%" stop-color="#047857"/>
            <stop offset="100%" stop-color="#0f766e"/>
          </linearGradient>
        </defs>
        <rect width="800" height="420" fill="url(#bg1)"/>
        <circle cx="680" cy="90" r="160" fill="#10b981" fill-opacity="0.16"/>
        <circle cx="120" cy="340" r="190" fill="#f59e0b" fill-opacity="0.12"/>
        <path d="M320 420V220c0-48 36-85 80-85s80 37 80 85v200" fill="#ffffff" fill-opacity="0.08"/>
        <path d="M180 420V260c0-35 28-64 62-64s62 29 62 64v160" fill="#ffffff" fill-opacity="0.05"/>
        <path d="M496 420V260c0-35 28-64 62-64s62 29 62 64v160" fill="#ffffff" fill-opacity="0.05"/>
        <circle cx="650" cy="110" r="28" fill="#fbbf24" fill-opacity="0.85"/>
      </svg>
    `),
    foodDistribution: svgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 420">
        <defs>
          <linearGradient id="fd" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#78350f"/>
            <stop offset="100%" stop-color="#b45309"/>
          </linearGradient>
        </defs>
        <rect width="800" height="420" fill="url(#fd)"/>
        <circle cx="640" cy="120" r="140" fill="#fbbf24" fill-opacity="0.18"/>
        <rect x="460" y="130" width="240" height="170" rx="24" fill="#fef3c7" fill-opacity="0.15" stroke="#fde68a" stroke-opacity="0.3" stroke-width="2"/>
        <rect x="500" y="170" width="160" height="100" rx="16" fill="#fde68a" fill-opacity="0.22"/>
      </svg>
    `),
    volunteerDispatch: svgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 420">
        <defs>
          <linearGradient id="vd" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#064e3b"/>
            <stop offset="50%" stop-color="#065f46"/>
            <stop offset="100%" stop-color="#0f766e"/>
          </linearGradient>
        </defs>
        <rect width="800" height="420" fill="url(#vd)"/>
        <g stroke="#34d399" stroke-opacity="0.16" stroke-width="1.5" fill="none">
          <circle cx="620" cy="180" r="60"/>
          <circle cx="620" cy="180" r="120"/>
          <circle cx="620" cy="180" r="180"/>
          <path d="M420 180h400M620 0v380"/>
        </g>
        <circle cx="620" cy="180" r="10" fill="#34d399"/>
        <circle cx="560" cy="130" r="7" fill="#fbbf24"/>
        <circle cx="670" cy="230" r="7" fill="#38bdf8"/>
      </svg>
    `),
    mosqueNight: svgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 420">
        <defs>
          <linearGradient id="mn" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#064e3b"/>
          </linearGradient>
        </defs>
        <rect width="800" height="420" fill="url(#mn)"/>
        <circle cx="660" cy="95" r="34" fill="#fde68a" fill-opacity="0.9"/>
        <path d="M280 420V210c0-65 54-118 120-118s120 53 120 118v210" fill="#10b981" fill-opacity="0.12"/>
      </svg>
    `),
    revertHalaqa: svgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 420">
        <defs>
          <linearGradient id="rh" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#115e59"/>
            <stop offset="100%" stop-color="#047857"/>
          </linearGradient>
        </defs>
        <rect width="800" height="420" fill="url(#rh)"/>
        <circle cx="640" cy="160" r="130" fill="#5eead4" fill-opacity="0.14"/>
        <rect x="480" y="110" width="220" height="190" rx="22" fill="#ffffff" fill-opacity="0.1"/>
      </svg>
    `),
    gpsMap: svgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 420">
        <rect width="800" height="420" fill="#0f172a"/>
        <g stroke="#1e293b" stroke-width="2">
          <path d="M0 70h800M0 140h800M0 210h800M0 280h800M0 350h800"/>
          <path d="M120 0v420M240 0v420M360 0v420M480 0v420M600 0v420M720 0v420"/>
        </g>
        <path d="M120 310 Q 310 260, 440 180 T 660 110" fill="none" stroke="#10b981" stroke-width="6" stroke-dasharray="10 6"/>
        <circle cx="120" cy="310" r="12" fill="#38bdf8"/>
        <circle cx="660" cy="110" r="14" fill="#10b981"/>
        <circle cx="660" cy="110" r="28" fill="#10b981" fill-opacity="0.25"/>
      </svg>
    `),
  },

  catalog: {
    foodHamper: svgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
        <defs>
          <linearGradient id="fh" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#fef3c7"/>
            <stop offset="100%" stop-color="#fde68a"/>
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#fh)"/>
        <rect x="85" y="95" width="230" height="145" rx="20" fill="#d97706"/>
        <rect x="105" y="65" width="75" height="50" rx="10" fill="#059669"/>
        <rect x="195" y="55" width="85" height="60" rx="10" fill="#b45309"/>
        <rect x="115" y="130" width="170" height="75" rx="12" fill="#fffbeb"/>
        <text x="200" y="175" font-family="Plus Jakarta Sans, sans-serif" font-size="20" font-weight="800" fill="#92400e" text-anchor="middle">HALAL CARE BOX</text>
      </svg>
    `),
    revertKit: svgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
        <defs>
          <linearGradient id="rk" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ecfdf5"/>
            <stop offset="100%" stop-color="#a7f3d0"/>
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#rk)"/>
        <rect x="110" y="45" width="180" height="210" rx="16" fill="#065f46"/>
        <rect x="128" y="63" width="144" height="174" rx="10" fill="none" stroke="#fbbf24" stroke-width="3"/>
        <circle cx="200" cy="135" r="32" fill="#fbbf24" fill-opacity="0.2" stroke="#fbbf24" stroke-width="2.5"/>
        <text x="200" y="205" font-family="Plus Jakarta Sans, sans-serif" font-size="16" font-weight="700" fill="#ecfdf5" text-anchor="middle">AL-QURAN &amp; KIT</text>
      </svg>
    `),
    healthcare: svgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#e0f2fe"/>
        <rect x="90" y="65" width="220" height="170" rx="24" fill="#0284c7"/>
        <circle cx="200" cy="150" r="46" fill="#ffffff"/>
        <path d="M200 124v52M174 150h52" stroke="#0284c7" stroke-width="12" stroke-linecap="round"/>
      </svg>
    `),
    childrenSchool: svgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#f3e8ff"/>
        <rect x="95" y="65" width="210" height="170" rx="22" fill="#7c3aed"/>
        <path d="M140 120h120M140 155h120M140 190h80" stroke="#ede9fe" stroke-width="10" stroke-linecap="round"/>
      </svg>
    `),
    elderCare: svgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#f0fdf4"/>
        <circle cx="200" cy="150" r="85" fill="#16a34a" fill-opacity="0.15"/>
        <circle cx="200" cy="150" r="55" fill="#15803d"/>
        <path d="M180 150l14 14 28-28" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
      </svg>
    `),
    counseling: svgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#f0fdfa"/>
        <rect x="85" y="70" width="230" height="160" rx="24" fill="#0d9488"/>
        <circle cx="165" cy="145" r="24" fill="#ccfbf1"/>
        <circle cx="235" cy="145" r="24" fill="#99f6e4"/>
      </svg>
    `),
  },

  feed: {
    foodDriveAction: svgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360">
        <defs>
          <linearGradient id="fda" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#065f46"/>
            <stop offset="100%" stop-color="#059669"/>
          </linearGradient>
        </defs>
        <rect width="600" height="360" fill="url(#fda)"/>
        <rect x="60" y="70" width="480" height="220" rx="24" fill="#ffffff" fill-opacity="0.1" stroke="#a7f3d0" stroke-opacity="0.3" stroke-width="2"/>
        <circle cx="170" cy="180" r="48" fill="#fbbf24" fill-opacity="0.9"/>
        <rect x="250" y="135" width="220" height="22" rx="8" fill="#ffffff" fill-opacity="0.85"/>
        <rect x="250" y="175" width="160" height="16" rx="6" fill="#a7f3d0" fill-opacity="0.75"/>
        <rect x="250" y="205" width="190" height="16" rx="6" fill="#a7f3d0" fill-opacity="0.5"/>
      </svg>
    `),
    sistersHalaqa: svgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360">
        <defs>
          <linearGradient id="sh" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0f766e"/>
            <stop offset="100%" stop-color="#0d9488"/>
          </linearGradient>
        </defs>
        <rect width="600" height="360" fill="url(#sh)"/>
        <circle cx="300" cy="180" r="110" fill="#ffffff" fill-opacity="0.12"/>
        <circle cx="300" cy="180" r="65" fill="#ccfbf1" fill-opacity="0.22"/>
        <rect x="220" y="155" width="160" height="50" rx="12" fill="#ffffff" fill-opacity="0.9"/>
        <text x="300" y="187" font-family="Plus Jakarta Sans, sans-serif" font-size="18" font-weight="800" fill="#0f766e" text-anchor="middle">REVERT HALAQA</text>
      </svg>
    `),
    mosqueRenovation: svgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360">
        <rect width="600" height="360" fill="#1e293b"/>
        <path d="M180 360V190c0-66 54-120 120-120s120 54 120 120v170" fill="#059669" fill-opacity="0.35"/>
        <circle cx="300" cy="120" r="24" fill="#fbbf24"/>
      </svg>
    `),
    volunteerCelebration: svgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360">
        <defs>
          <linearGradient id="vc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#047857"/>
            <stop offset="100%" stop-color="#10b981"/>
          </linearGradient>
        </defs>
        <rect width="600" height="360" fill="url(#vc)"/>
        <circle cx="200" cy="170" r="44" fill="#ffffff" fill-opacity="0.25"/>
        <circle cx="300" cy="155" r="52" fill="#ffffff" fill-opacity="0.35"/>
        <circle cx="400" cy="170" r="44" fill="#ffffff" fill-opacity="0.25"/>
      </svg>
    `),
  },
};
