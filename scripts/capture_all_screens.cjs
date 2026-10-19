const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const SCREENS = [
  // 1-20: Core 20 Screens
  { number: 1, slug: 'splash', query: 'screen=splash', title: 'Splash Screen', category: 'Core 20 Screens' },
  { number: 2, slug: 'onboarding', query: 'screen=onboarding&slide=0', title: 'Onboarding (Slide 1: Revert Care)', category: 'Core 20 Screens' },
  { number: 3, slug: 'welcome', query: 'screen=welcome', title: 'Welcome Screen', category: 'Core 20 Screens' },
  { number: 4, slug: 'signup', query: 'screen=signup', title: 'Sign-Up Screen', category: 'Core 20 Screens' },
  { number: 5, slug: 'login', query: 'screen=login', title: 'Login Screen', category: 'Core 20 Screens' },
  { number: 6, slug: 'home', query: 'screen=home&role=staff_admin', title: 'Home Hub (Admin Ops Workspace)', category: 'Core 20 Screens' },
  { number: 7, slug: 'menu', query: 'screen=menu', title: 'Menu & Navigation Drawer', category: 'Core 20 Screens' },
  { number: 8, slug: 'dashboard', query: 'screen=dashboard', title: 'Impact Analytics & Zakat Calc', category: 'Core 20 Screens' },
  { number: 9, slug: 'search', query: 'screen=search', title: 'Search & Facility Directory', category: 'Core 20 Screens' },
  { number: 10, slug: 'catalog', query: 'screen=catalog', title: 'Infaq & Relief Campaigns', category: 'Core 20 Screens' },
  { number: 11, slug: 'product_detail', query: 'screen=product_detail&tab=overview', title: 'Campaign Breakdown (Overview)', category: 'Core 20 Screens' },
  { number: 12, slug: 'profile', query: 'screen=profile', title: 'Member Profile & Credentials', category: 'Core 20 Screens' },
  { number: 13, slug: 'settings', query: 'screen=settings', title: 'System & JAKIM Zone Settings', category: 'Core 20 Screens' },
  { number: 14, slug: 'calendar_booking', query: 'screen=calendar_booking&view=shifts', title: 'Halaqa & Volunteer Shift Calendar', category: 'Core 20 Screens' },
  { number: 15, slug: 'feed', query: 'screen=feed', title: 'Dawah & Field Impact Feed', category: 'Core 20 Screens' },
  { number: 16, slug: 'chat', query: 'screen=chat', title: 'Encrypted Caseworker Chat', category: 'Core 20 Screens' },
  { number: 17, slug: 'cart', query: 'screen=cart', title: 'Sadaqah & Infaq Basket', category: 'Core 20 Screens' },
  { number: 18, slug: 'checkout', query: 'screen=checkout', title: 'Zakat & FPX Checkout Portal', category: 'Core 20 Screens' },
  { number: 19, slug: 'notifications', query: 'screen=notifications', title: 'Adhan & SOS Notifications', category: 'Core 20 Screens' },
  { number: 20, slug: 'empty_loading_error', query: 'screen=empty_loading_error&state=loading', title: 'System State: Loading Skeleton', category: 'Core 20 Screens' },

  // 21-29: Hidden 9-Module Islamic Utilities Suite Sheets
  { number: 21, slug: 'utility_waqt', query: 'screen=home&utility=waqt', title: 'Utility #1: Waqt, Sehri/Iftar & Haram', category: '9 Islamic Utilities (Hidden Sheets)' },
  { number: 22, slug: 'utility_tracker', query: 'screen=home&utility=tracker', title: 'Utility #2: 5-Waqt Salah & Qaza Log', category: '9 Islamic Utilities (Hidden Sheets)' },
  { number: 23, slug: 'utility_qibla', query: 'screen=home&utility=qibla', title: 'Utility #3: 3D Spherical Qibla Compass', category: '9 Islamic Utilities (Hidden Sheets)' },
  { number: 24, slug: 'utility_quran', query: 'screen=home&utility=quran', title: 'Utility #4: Color-Coded Tajweed Quran', category: '9 Islamic Utilities (Hidden Sheets)' },
  { number: 25, slug: 'utility_tasbih', query: 'screen=home&utility=tasbih', title: 'Utility #5: Digital Tasbih Counter', category: '9 Islamic Utilities (Hidden Sheets)' },
  { number: 26, slug: 'utility_dua', query: 'screen=home&utility=dua', title: 'Utility #6: Hisnul Muslim Duas & Ruqyah', category: '9 Islamic Utilities (Hidden Sheets)' },
  { number: 27, slug: 'utility_salah_guide', query: 'screen=home&utility=salah_guide', title: 'Utility #7: Revert 7-Posture Solat Guide', category: '9 Islamic Utilities (Hidden Sheets)' },
  { number: 28, slug: 'utility_sifat', query: 'screen=home&utility=sifat', title: 'Utility #8: Asma-ul-Husna (99 Names)', category: '9 Islamic Utilities (Hidden Sheets)' },
  { number: 29, slug: 'utility_halal', query: 'screen=home&utility=halal', title: 'Utility #9: Halal E-Code, Zakat & Fitrah', category: '9 Islamic Utilities (Hidden Sheets)' },

  // 30-34: Hidden Role-Adaptive Home Workspaces
  { number: 30, slug: 'role_volunteer', query: 'screen=home&role=approved_volunteer', title: 'Role #2: Field Volunteer Workspace', category: '6 Role Workspaces (Hidden Views)' },
  { number: 31, slug: 'role_seeker', query: 'screen=home&role=seeker', title: 'Role #3: New Revert / Seeker Workspace', category: '6 Role Workspaces (Hidden Views)' },
  { number: 32, slug: 'role_teacher', query: 'screen=home&role=approved_teacher', title: 'Role #4: Scholar / Mentor Workspace', category: '6 Role Workspaces (Hidden Views)' },
  { number: 33, slug: 'role_applicant', query: 'screen=home&role=volunteer_applicant', title: 'Role #5: Relief Applicant Workspace', category: '6 Role Workspaces (Hidden Views)' },
  { number: 34, slug: 'role_member', query: 'screen=home&role=member', title: 'Role #6: Community Donor Workspace', category: '6 Role Workspaces (Hidden Views)' },

  // 35-48: Hidden Sub-Screens, Tabs, Modals, States & Dark Theme
  { number: 35, slug: 'onboarding_slide2', query: 'screen=onboarding&slide=1', title: 'Hidden Slide: Onboarding Pillar 2 (Welfare)', category: 'Hidden Modals, Tabs & States' },
  { number: 36, slug: 'onboarding_slide3', query: 'screen=onboarding&slide=2', title: 'Hidden Slide: Onboarding Pillar 3 (Squads)', category: 'Hidden Modals, Tabs & States' },
  { number: 37, slug: 'product_provisions', query: 'screen=product_detail&tab=provisions', title: 'Hidden Tab: Kit Itemized Provisions', category: 'Hidden Modals, Tabs & States' },
  { number: 38, slug: 'product_impact', query: 'screen=product_detail&tab=impact', title: 'Hidden Tab: Audited Campaign Impact', category: 'Hidden Modals, Tabs & States' },
  { number: 39, slug: 'calendar_almanac', query: 'screen=calendar_booking&view=almanac', title: 'Hidden Tab: Calendar Waqt & Haram Almanac', category: 'Hidden Modals, Tabs & States' },
  { number: 40, slug: 'calendar_confirm_modal', query: 'screen=calendar_booking&modal=booking_confirm', title: 'Hidden Modal: Shift Booking Confirmation', category: 'Hidden Modals, Tabs & States' },
  { number: 41, slug: 'feed_composer', query: 'screen=feed&modal=composer', title: 'Hidden Modal: Field Dispatch Post Composer', category: 'Hidden Modals, Tabs & States' },
  { number: 42, slug: 'checkout_receipt', query: 'screen=checkout&state=receipt', title: 'Hidden Screen: Official LHDN Tax Receipt', category: 'Hidden Modals, Tabs & States' },
  { number: 43, slug: 'state_empty', query: 'screen=empty_loading_error&state=empty', title: 'Hidden State: Empty Care Missions View', category: 'Hidden Modals, Tabs & States' },
  { number: 44, slug: 'state_error', query: 'screen=empty_loading_error&state=error', title: 'Hidden State: Offline Gateway Error View', category: 'Hidden Modals, Tabs & States' },
  { number: 45, slug: 'modal_role_picker', query: 'screen=home&modal=role_picker', title: 'Hidden Overlay: Role Persona Switcher', category: 'Hidden Modals, Tabs & States' },
  { number: 46, slug: 'modal_navigator', query: 'screen=home&modal=navigator', title: 'Hidden Modal: 20-Screen Master Directory', category: 'Hidden Modals, Tabs & States' },
  { number: 47, slug: 'modal_android_apk', query: 'screen=home&modal=android_apk', title: 'Hidden Modal: Native Android APK & QR Sheet', category: 'Hidden Modals, Tabs & States' },
  { number: 48, slug: 'home_dark_mode', query: 'screen=home&theme=dark', title: 'Hidden Theme: Night Mode Home Hub', category: 'Hidden Modals, Tabs & States' }
];

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function buildZip(files) {
  const localChunks = [];
  const centralChunks = [];
  let offset = 0;

  for (const f of files) {
    const nameBytes = Buffer.from(f.name, "utf8");
    const data = f.data;
    const crc = crc32(data);
    const size = data.length;

    const lh = Buffer.alloc(30 + nameBytes.length);
    lh.writeUInt32LE(0x04034b50, 0);
    lh.writeUInt16LE(20, 4);
    lh.writeUInt16LE(0, 6);
    lh.writeUInt16LE(0, 8);
    lh.writeUInt16LE(0, 10);
    lh.writeUInt16LE(0, 12);
    lh.writeUInt32LE(crc, 14);
    lh.writeUInt32LE(size, 18);
    lh.writeUInt32LE(size, 22);
    lh.writeUInt16LE(nameBytes.length, 26);
    lh.writeUInt16LE(0, 28);
    nameBytes.copy(lh, 30);
    localChunks.push(lh, data);

    const ch = Buffer.alloc(46 + nameBytes.length);
    ch.writeUInt32LE(0x02014b50, 0);
    ch.writeUInt16LE(20, 4);
    ch.writeUInt16LE(20, 6);
    ch.writeUInt16LE(0, 8);
    ch.writeUInt16LE(0, 10);
    ch.writeUInt16LE(0, 12);
    ch.writeUInt32LE(crc, 16);
    ch.writeUInt32LE(size, 20);
    ch.writeUInt32LE(size, 24);
    ch.writeUInt16LE(nameBytes.length, 28);
    ch.writeUInt16LE(0, 30);
    ch.writeUInt16LE(0, 32);
    ch.writeUInt16LE(0, 34);
    ch.writeUInt16LE(0, 36);
    ch.writeUInt32LE(0, 38);
    ch.writeUInt32LE(offset, 42);
    nameBytes.copy(ch, 46);
    centralChunks.push(ch);

    offset += lh.length + size;
  }

  const centralBuf = Buffer.concat(centralChunks);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localChunks, centralBuf, eocd]);
}

(async () => {
  console.log("Starting 48-screen capture pipeline...");
  const outDir = path.join(process.cwd(), "public", "screenshots", "iphone-17-pro-max");
  fs.mkdirSync(outDir, { recursive: true });

  const bezelPath = path.join(process.cwd(), "public", "frames", "iphone-17-pro-max-silver.png");
  if (!fs.existsSync(bezelPath)) {
    throw new Error("Missing bezel frame: " + bezelPath);
  }
  const bezelB64 = fs.readFileSync(bezelPath).toString("base64");

  const browser = await chromium.launch({ headless: true });
  const capturePage = await browser.newPage({ viewport: { width: 1320, height: 2868 }, deviceScaleFactor: 1 });
  const compPage = await browser.newPage({ viewport: { width: 1472, height: 3002 }, deviceScaleFactor: 1 });

  await compPage.setContent(`<canvas id="c" width="1472" height="3002"></canvas>`);

  const hashes = new Map();
  const capturedMeta = [];

  for (let i = 0; i < SCREENS.length; i++) {
    const s = SCREENS[i];
    const numStr = String(s.number).padStart(2, "0");
    const fname = `${numStr}-${s.slug}-iphone-17-pro-max.png`;
    const targetUrl = `http://localhost:3000/?capture=1&${s.query}`;

    await capturePage.goto(targetUrl, { waitUntil: "networkidle" });
    await capturePage.waitForTimeout(150);

    const el = await capturePage.$("#root > div");
    if (!el) {
      throw new Error(`Failed to find capture root element for screen #${s.number} (${s.slug})`);
    }

    const rawBuf = await el.screenshot({ type: "png" });
    const hash = crypto.createHash("sha256").update(rawBuf).digest("hex");

    if (hashes.has(hash)) {
      const prior = hashes.get(hash);
      throw new Error(`DUPLICATE DETECTED! Screen #${s.number} (${s.slug}) produced the exact same hash as Screen #${prior.number} (${prior.slug}). Each screen must be unique!`);
    }
    hashes.set(hash, s);

    const framedB64 = await compPage.evaluate(async ({ screenB64, bezelB64 }) => {
      const canvas = document.getElementById("c");
      const ctx = canvas.getContext("2d");

      const loadImg = src => new Promise((res, rej) => {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = rej;
        img.src = src;
      });

      const [scr, bez] = await Promise.all([
        loadImg("data:image/png;base64," + screenB64),
        loadImg("data:image/png;base64," + bezelB64)
      ]);

      ctx.clearRect(0, 0, 1472, 3002);
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(76, 67, 1320, 2868, 174);
      ctx.clip();
      ctx.drawImage(scr, 76, 67, 1320, 2868);
      ctx.restore();

      ctx.drawImage(bez, 0, 0, 1472, 3002);
      return canvas.toDataURL("image/png").split(",")[1];
    }, {
      screenB64: rawBuf.toString("base64"),
      bezelB64
    });

    const finalBuf = Buffer.from(framedB64, "base64");
    const outPath = path.join(outDir, fname);
    fs.writeFileSync(outPath, finalBuf);

    capturedMeta.push({
      ...s,
      filename: fname,
      hash,
      sizeBytes: finalBuf.length
    });

    console.log(`[${i + 1}/${SCREENS.length}] Captured #${numStr} ${s.title} -> ${fname} (${(finalBuf.length / 1024).toFixed(0)} KB, SHA: ${hash.slice(0, 10)}...)`);
  }

  await browser.close();

  // Generate README.md
  let readme = `# MRM Care — iPhone 17 Pro Max White (bezel.fit) Screenshots Pack\n\n`;
  readme += `Every single screen and hidden view in the MRM Care application captured at 1320×2868 (3x Retina) and composited into the official **bezel.fit iPhone 17 Pro Max White** frame (\`iphone-17-pro-max-silver.png\`, 1472×3002px, offset x:76, y:67, radius: 174px).\n\n`;
  readme += `### Verification Summary\n`;
  readme += `- Total Screens Captured: **${capturedMeta.length}**\n`;
  readme += `- Unique Screen Hashes: **${hashes.size} / ${capturedMeta.length}** (0 duplicates guaranteed)\n`;
  readme += `- Device Frame: **bezel.fit iPhone 17 Pro Max White Titanium** (\`1472×3002\` PNG)\n\n`;
  readme += `| # | Screen / View Name | Category | Filename | SHA-256 (Raw Buffer) |\n`;
  readme += `|---|---|---|---|---|\n`;

  for (const m of capturedMeta) {
    const num = String(m.number).padStart(2, "0");
    readme += `| ${num} | **${m.title}** | ${m.category} | \`${m.filename}\` | \`${m.hash.slice(0, 16)}...\` |\n`;
  }

  fs.writeFileSync(path.join(outDir, "README.md"), readme, "utf8");

  // Build the .ZIP archive containing all 48 framed PNGs + README.md
  console.log("Building public/MRM-Care-iPhone-17-Pro-Max-Screenshots.zip...");
  const zipEntries = [];
  for (const m of capturedMeta) {
    const fPath = path.join(outDir, m.filename);
    zipEntries.push({
      name: `MRMCare-iPhone17ProMax-White/${m.filename}`,
      data: fs.readFileSync(fPath)
    });
  }
  zipEntries.push({
    name: `MRMCare-iPhone17ProMax-White/README.md`,
    data: Buffer.from(readme, "utf8")
  });

  const zipBuf = buildZip(zipEntries);
  fs.writeFileSync(path.join(process.cwd(), "public", "MRM-Care-iPhone-17-Pro-Max-Screenshots.zip"), zipBuf);

  console.log(`Successfully generated public/MRM-Care-iPhone-17-Pro-Max-Screenshots.zip (${(zipBuf.length / (1024 * 1024)).toFixed(2)} MB, ${zipEntries.length} files).`);
  console.log("PIPELINE COMPLETE: All 48 screens captured, visually framed in White bezel, verified 100% unique.");
})().catch(err => {
  console.error("CAPTURE PIPELINE FAILED:", err);
  process.exit(1);
});
