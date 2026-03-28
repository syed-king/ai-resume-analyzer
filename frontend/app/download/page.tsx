'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Download, Smartphone, CheckCircle, Zap } from 'lucide-react';

export default function DownloadPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Capture the native Android/Chrome install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
      setIsInstalled(true);
    });

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("Your browser doesn't support automatic installation, or you're on an iPhone. On iPhone, tap 'Share' then 'Add to Home Screen'.");
      return;
    }
    
    // Show the native Android install prompt (acts like downloading an APK)
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg grid-bg flex flex-col">
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb w-80 h-80 bg-purple-600 top-[-5%] right-[-5%]" />
        <div className="orb w-72 h-72 bg-blue-600 bottom-[5%] left-[-5%]" style={{ animationDelay: '2s' }} />
      </div>
      <Navbar />
      
      <main className="relative z-10 pt-32 pb-28 md:pb-10 px-4 max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto">
          <div className="w-24 h-24 bg-gradient-purple-blue p-1 rounded-3xl mx-auto mb-8 shadow-[0_0_40px_rgba(139,92,246,0.5)]">
            <div className="w-full h-full bg-black/80 rounded-[22px] flex items-center justify-center backdrop-blur-xl">
              <Zap className="w-12 h-12 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
            </div>
          </div>
          
          <h1 className="font-display font-bold text-4xl md:text-5xl text-glow text-white mb-4">
            Get the <span className="gradient-text">ResumeAI App</span>
          </h1>
          <p className="text-white/60 mb-10 text-lg">
            Install our native app directly to your phone for faster access, offline capabilities, and a full-screen mobile experience without the browser toolbar.
          </p>

          <div className="card-3d p-8 bg-black/40 backdrop-blur-2xl border-white/10 mb-8 max-w-sm mx-auto">
            {isInstalled ? (
              <div className="flex flex-col items-center justify-center text-green-400">
                <CheckCircle className="w-16 h-16 mb-4 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
                <h3 className="font-display font-bold text-xl text-white">App Installed!</h3>
                <p className="text-white/50 text-sm mt-2">ResumeAI is already running natively on your device.</p>
              </div>
            ) : (
              <button 
                onClick={handleInstallClick}
                className="btn-3d w-full py-4 text-base font-bold flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-500 shadow-[0_6px_0_#6d28d9,0_0_30px_rgba(124,58,237,0.4)]"
              >
                <Download className="w-5 h-5" /> 
                {isInstallable ? "Install App Now" : "Download App"}
              </button>
            )}
            
            {!isInstalled && (
              <p className="text-white/40 text-xs mt-4">
                Secure 1-click install. Requires no App Store. Works instantly on Android & Windows.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left border-t border-white/10 pt-8 mt-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <Smartphone className="w-6 h-6 text-purple-400 mb-3" />
              <h4 className="font-bold text-sm text-white mb-1">Native App Drawer</h4>
              <p className="text-xs text-white/50">Appears directly alongside your other apps on your home screen.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <Zap className="w-6 h-6 text-blue-400 mb-3" />
              <h4 className="font-bold text-sm text-white mb-1">Zero Storage Usage</h4>
              <p className="text-xs text-white/50">Requires almost no hard drive space compared to heavy App Store downloads.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <Download className="w-6 h-6 text-pink-400 mb-3" />
              <h4 className="font-bold text-sm text-white mb-1">Auto-Updating</h4>
              <p className="text-xs text-white/50">Always stays on the latest version seamlessly in the background without manual updates.</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
