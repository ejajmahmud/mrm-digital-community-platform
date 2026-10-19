import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Terminal, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Info, 
  AlertTriangle,
  Download
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';

interface AndroidRunModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl: string;
}

export const AndroidRunModal: React.FC<AndroidRunModalProps> = ({ isOpen, onClose, appUrl }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-lg rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Run on Android Device</h2>
              <p className="text-xs text-slate-500">PWA installation & native APK setup</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
          
          {/* Important Technical Container Notice */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5 text-slate-700">
            <Info className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">Cloud Sandbox Environment</p>
              <p className="text-[11px] text-slate-500 leading-normal">
                This cloud environment runs inside a lightweight Linux container (gVisor sandbox) without hardware hypervisor virtualization (<code className="font-mono bg-slate-200 px-1 rounded">/dev/kvm</code>). Because bare-metal AVDs require a desktop GUI server and KVM, the app is executed as an interactive mobile simulator here, or installed directly onto your physical Android phone / Android Studio.
              </p>
            </div>
          </div>

          {/* Option 1: Instant 1-Click Install on Android Phone / Tablet (PWA) */}
          <Card className="border-emerald-200 bg-emerald-50/20 shadow-xs">
            <CardContent className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-emerald-800" /> Option 1: Install to Android Device (Instant)
                </span>
                <Badge variant="default">Recommended</Badge>
              </div>

              <p className="text-slate-600 leading-normal">
                Open the live application URL in <strong>Google Chrome</strong> on any Android smartphone or tablet:
              </p>

              <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between font-mono text-[11px]">
                <span className="truncate pr-2 text-slate-800">{appUrl}</span>
                <button
                  onClick={() => handleCopy(appUrl)}
                  className="text-emerald-800 hover:underline flex items-center gap-1 font-sans font-semibold shrink-0 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="space-y-1 text-slate-600 pt-1">
                <p>1. Open the URL above in Chrome on Android.</p>
                <p>2. Tap the <strong>three dots (⋮)</strong> or the <strong>"Install app"</strong> banner at the bottom.</p>
                <p>3. Tap <strong>"Install"</strong>. The MRM Community app will appear on your Android home screen as a standalone full-screen application!</p>
              </div>
            </CardContent>
          </Card>

          {/* Option 2: Native Android Studio / Gradle APK */}
          <Card className="border-slate-200 shadow-xs">
            <CardContent className="p-4 space-y-2.5">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-slate-700" /> Option 2: Native Android Studio / APK Build
              </span>

              <p className="text-slate-600 leading-normal">
                To build an APK or run in local Android Studio emulator via Capacitor:
              </p>

              <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] space-y-1 overflow-x-auto">
                <p className="text-emerald-400"># 1. Install Capacitor</p>
                <p>npm install @capacitor/core @capacitor/android</p>
                <p className="text-emerald-400"># 2. Add Android Platform</p>
                <p>npx cap add android</p>
                <p className="text-emerald-400"># 3. Open in Android Studio or run</p>
                <p>npx cap open android</p>
              </div>
            </CardContent>
          </Card>

          <Button onClick={onClose} className="w-full">
            Got it, Return to App
          </Button>
        </div>
      </div>
    </div>
  );
};
