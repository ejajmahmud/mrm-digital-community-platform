# MRM Care — Pure Real MVP & Unified Platform
**Muslim Revert Welfare, Islamic Utilities Suite, JAKIM Prayer Times & Infaq Platform**

Welcome to the **MRM Care** production codebase, engineered for seamless deployment across Web (GitHub Pages), Native Android Studio (Kotlin 2.0 + Jetpack Compose), and mobile web app environments.

---

## 🚀 Instant Deployment to GitHub Pages

This project is pre-configured for **zero-configuration GitHub Pages hosting**:

### Method 1: Automatic Deployment with GitHub Actions (Recommended)
1. Push your code to your GitHub repository on `main` (or `master`):
   ```bash
   git add .
   git commit -m "Deploy MRM Care Pure Real MVP"
   git push origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** → **Pages**
   - Under **Build and deployment** → **Source**, change from *Deploy from a branch* to **GitHub Actions**.
3. That's it! The workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) will trigger on push, compile the app with relative base paths (`./`), create the `404.html` SPA fallback, and publish the live URL at:
   ```
   https://<your-username>.github.io/<your-repo-name>/
   ```

### Method 2: One-Command CLI Deploy via `gh-pages`
If you prefer pushing directly to a `gh-pages` branch without GitHub Actions:
```bash
npm install
npm run deploy
```
This automatically runs `npm run build` and deploys `./dist` with `gh-pages`.

### Direct URL Access:
- **Interactive 3-Column Studio** (Live bezel.fit iPhone 17 Pro Max preview + sidebars):
  `https://<your-username>.github.io/<your-repo-name>/`
- **Pure Real MVP Mobile App Mode** (Full-screen native experience):
  `https://<your-username>.github.io/<your-repo-name>/?pure=1`

---

## 📱 Pure Native Android Studio Project (`android/`)
- **IDE**: Android Studio Ladybug (2024.2.1+) or newer
- **Opening the project**:
  - Open either the root folder or the `android/` directory in Android Studio.
- **Specs**:
  - Kotlin 2.0.21, Android Gradle Plugin 8.7.2, Compose BOM 2024.10.01, Material 3
  - Core Compose UI: `android/app/src/main/java/my/org/mrm/care/ui/MrmCareApp.kt` (3,439 lines of 1:1 matching UI)

---

## 📦 Production Download Bundles
The application provides direct one-click downloads in both web and pure mobile views:
- **Full Production Bundle** (`/MRM-Care-Full-Production-Bundle.zip`): Complete React source + Android Studio project + 48 iPhone 17 Pro Max White screenshots + GitHub workflows.
- **Pure Android Studio Project** (`/MRM_Care_Android_Studio_Project.zip`): Standalone native Kotlin 2.0 + Jetpack Compose project.
- **48 Verified Screenshots** (`/MRM-Care-iPhone-17-Pro-Max-White-48Screens.zip`): All 48 unique application screens and hidden views in official bezel.fit White Titanium frame.

---

## 💻 Local Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the live development application.
