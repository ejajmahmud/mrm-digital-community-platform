import React, { useState } from 'react';
import {
  X,
  Download,
  Code2,
  CheckCircle2,
  FolderGit2,
  Smartphone,
  Terminal,
  Cpu,
  Layers,
  ShieldCheck,
  FileCode,
  Copy,
  Check,
  Sparkles,
  Play,
  MapPin,
} from 'lucide-react';
import {
  exportPureAndroidStudioZip,
  getAndroidProjectFileTree,
} from '../../utils/androidStudioPackExporter';

interface AndroidStudioBundleModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPureAndroidMode?: boolean;
  onTogglePureAndroidMode?: () => void;
}

export const AndroidStudioBundleModal: React.FC<AndroidStudioBundleModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(5); // Default to MrmLogic.kt
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  if (!isOpen) return null;

  const projectFiles = getAndroidProjectFileTree();
  const activeFile = projectFiles[selectedFileIndex] || projectFiles[0];

  const handleDownloadBundle = async () => {
    setIsExporting(true);
    setExportSuccess(false);
    try {
      await exportPureAndroidStudioZip();
      setExportSuccess(true);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopySnippet = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(label);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Pure Android Studio Project Bundle"
    >
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-inner">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Pure Native Kotlin + Jetpack Compose
                </span>
                <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  AGP 8.7.2 • SDK 35 (Android 15)
                </span>
                <span className="text-[10px] font-mono text-teal-300 bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Location Sync Ready
                </span>
              </div>
              <h2 className="text-lg font-extrabold !text-white mt-0.5">
                MRM Care — Pure Android Studio Bundle (`my.org.mrm.care`)
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Android Studio modal"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 !text-slate-200 hover:!text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Specs, Instructions & Download Trigger */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {/* Architecture Highlights */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4" /> Native Android Architecture
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">100% Pure Kotlin</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                    <div className="text-[10px] text-slate-400">UI Toolkit</div>
                    <div className="font-bold text-white mt-0.5">Jetpack Compose M3</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                    <div className="text-[10px] text-slate-400">Location & Prayer Sync</div>
                    <div className="font-bold text-emerald-300 mt-0.5">9 Zones + Spherical Qibla</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                    <div className="text-[10px] text-slate-400">Screens & Utilities</div>
                    <div className="font-bold text-amber-300 mt-0.5">20 Screens + 9 Islamic Tools</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                    <div className="text-[10px] text-slate-400">Build System</div>
                    <div className="font-bold text-white mt-0.5">Gradle Kotlin DSL</div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Zero WebViews or wrappers. Includes native Compose Material 3 implementations of all{' '}
                  <strong className="text-white">20 MRM Care screens</strong>, the{' '}
                  <strong className="text-amber-300">9-Module Islamic Utilities Suite</strong>, and the{' '}
                  <strong className="text-emerald-300">Haversine & Spherical Qibla Location Sync Engine</strong>{' '}
                  in <code className="text-emerald-300 font-mono">MrmLogic.kt</code>.
                </p>
              </div>

              {/* 3-Step Run in Android Studio Guide */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5" /> How to Run in Android Studio
                </h3>

                <ol className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      1
                    </span>
                    <div>
                      <strong className="text-white">Download & Unzip:</strong> Extract{' '}
                      <code className="text-emerald-300 font-mono">MRM_Care_Android_Studio_Project.zip</code>{' '}
                      to your AndroidStudioProjects directory.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      2
                    </span>
                    <div>
                      <strong className="text-white">Open in Android Studio:</strong> Launch{' '}
                      <span className="text-amber-200 font-medium">Android Studio Ladybug (2024.2.1+)</span>,
                      select <em>File → Open</em>, and choose the unzipped project folder.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      3
                    </span>
                    <div>
                      <strong className="text-white">Sync Gradle & Run (`Shift+F10`):</strong> Let Android
                      Studio sync Kotlin 2.0.21 & Compose BOM, pick any Pixel / API 35 emulator or physical
                      phone, and hit <strong>Run 'app'</strong>.
                    </div>
                  </li>
                </ol>
              </div>
            </div>

            {/* Download Action Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold !text-emerald-700 dark:!text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Ready for Gradle Sync
                </span>
                <span className="font-mono text-[11px] font-bold !text-amber-700 dark:!text-amber-300">
                  24 Source & Config Files
                </span>
              </div>

              <button
                onClick={handleDownloadBundle}
                disabled={isExporting}
                className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                {isExporting
                  ? 'Packaging Pure Android Studio Project...'
                  : 'Download Android Studio Standalone (.ZIP, 225 KB)'}
              </button>

              <a
                href="./MRM-Care-Full-Production-Bundle.zip"
                download="MRM-Care-Full-Production-Bundle.zip"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm text-center"
              >
                <Download className="w-4 h-4 text-emerald-200" />
                <span>Download Full Project (React + Android + 48 Screens, 54.8 MB)</span>
              </a>

              {exportSuccess && (
                <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/90 border border-emerald-500/40 px-3 py-2 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Downloaded <strong>MRM_Care_Android_Studio_Project.zip</strong>! Open directly in Android
                    Studio.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Project File Tree & Kotlin Code Inspector */}
          <div className="lg:col-span-7 flex flex-col rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden h-[520px]">
            {/* File Selector Tabs */}
            <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <FolderGit2 className="w-4 h-4 text-emerald-400" />
                <span>Android Studio Project Structure (`android/`)</span>
              </div>
              <button
                onClick={() => handleCopySnippet(activeFile.content, activeFile.path)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                {copiedPath === activeFile.path ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copied File</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Source</span>
                  </>
                )}
              </button>
            </div>

            {/* Horizontal File Chips */}
            <div className="px-3 py-2 bg-slate-900/50 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {projectFiles.map((file, idx) => {
                const shortName = file.path.split('/').pop() || file.path;
                const isSelected = idx === selectedFileIndex;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFileIndex(idx)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white font-bold shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 shrink-0" />
                    <span>{shortName}</span>
                  </button>
                );
              })}
            </div>

            {/* Active File Path Bar */}
            <div className="px-4 py-2 bg-slate-950 border-b border-slate-900 flex items-center justify-between text-[11px]">
              <span className="font-mono text-emerald-400 truncate">{activeFile.path}</span>
              <span className="text-slate-400 hidden sm:inline">{activeFile.description}</span>
            </div>

            {/* Code Content Area */}
            <pre className="flex-1 p-4 overflow-auto text-[11px] leading-relaxed font-mono text-slate-200 bg-slate-950 selection:bg-emerald-600 selection:text-white">
              <code>{activeFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
