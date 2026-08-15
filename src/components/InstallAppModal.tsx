import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  Share2,
  PlusSquare,
  Monitor,
  CheckCircle2,
  X,
  QrCode,
  ShieldCheck,
  Zap,
  Globe,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ANDROID_PLAYSTORE_CONFIG } from '../lib/androidConfig';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt?: any;
  onInstalledSuccess?: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstalledSuccess
}) => {
  const [deviceTab, setDeviceTab] = useState<'android' | 'ios' | 'desktop' | 'qr'>('android');
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect current user platform automatically
    const ua = navigator.userAgent || navigator.vendor;
    if (/android/i.test(ua)) {
      setDeviceTab('android');
    } else if (/iPad|iPhone|iPod/.test(ua)) {
      setDeviceTab('ios');
    } else if (/Macintosh|Windows|Linux/.test(ua)) {
      setDeviceTab('desktop');
    }

    // Check if already standalone
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTriggerNativeInstall = async () => {
    if (deferredPrompt) {
      setIsInstalling(true);
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        if (onInstalledSuccess) onInstalledSuccess();
      }
      setIsInstalling(false);
    } else {
      // Fallback guide
      alert("Sur ce navigateur, utilisez le menu des options (⋮ ou Partager) et sélectionnez 'Installer l'application' ou 'Ajouter à l'écran d'accueil'.");
    }
  };

  const appUrl = window.location.origin || 'https://kuma-mali.app';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}&color=064e3b&bgcolor=f0fdf4`;

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-emerald-700/60 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 p-4 sm:p-5 border-b border-emerald-800 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-500 p-0.5 shadow-lg flex items-center justify-center flex-shrink-0">
              <div className="w-full h-full bg-emerald-950 rounded-[14px] flex items-center justify-center font-black text-amber-300 text-lg">
                KUMA
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-300 flex items-center gap-1.5">
                Installer KUMA Mali
                <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full font-bold border border-emerald-600">
                  Tous Appareils
                </span>
              </h2>
              <p className="text-xs text-emerald-200">Fonctionne 100% Hors-Ligne & 2G/3G/4G/5G/∞G</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="grid grid-cols-4 p-2 bg-slate-950/80 border-b border-slate-800 text-xs font-bold gap-1">
          <button
            onClick={() => setDeviceTab('android')}
            className={`py-2 px-1 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
              deviceTab === 'android' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-300" />
            <span>Android 🤖</span>
          </button>

          <button
            onClick={() => setDeviceTab('ios')}
            className={`py-2 px-1 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
              deviceTab === 'ios' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Share2 className="w-4 h-4 text-amber-300" />
            <span>iPhone / iOS 🍏</span>
          </button>

          <button
            onClick={() => setDeviceTab('desktop')}
            className={`py-2 px-1 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
              deviceTab === 'desktop' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4 text-cyan-300" />
            <span>PC & Mac 💻</span>
          </button>

          <button
            onClick={() => setDeviceTab('qr')}
            className={`py-2 px-1 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
              deviceTab === 'qr' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4 text-purple-300" />
            <span>Scan QR 📲</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Status banner if already installed */}
          {isInstalled && (
            <div className="bg-emerald-950 border border-emerald-600 p-3 rounded-2xl flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-200">Application déjà installée en mode autonome</p>
                <p className="text-[11px] text-slate-300">KUMA est prête sur votre écran d'accueil avec support hors-ligne complet.</p>
              </div>
            </div>
          )}

          {/* TAB 1: ANDROID */}
          {deviceTab === 'android' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-emerald-300 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    Installation Directe Android (APK / PWA / Google Play)
                  </span>
                  <span className="bg-emerald-950 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-700 font-bold">
                    Target API 34
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Installez KUMA sur n'importe quel smartphone Android (Samsung, Xiaomi, Tecno, Infinix, Huawei, itel...). L'application occupe moins de <strong>5 Mo</strong> et fonctionne sans connexion internet.
                </p>

                {deferredPrompt ? (
                  <button
                    onClick={handleTriggerNativeInstall}
                    disabled={isInstalling}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 border border-emerald-400"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isInstalling ? 'Installation...' : "Installer en 1 Clic sur Android 🤖"}</span>
                  </button>
                ) : (
                  <div className="space-y-2 pt-1">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 text-xs space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">1</span>
                        <p className="text-slate-300">Appuyez sur les <strong>3 points verticaux (⋮)</strong> en haut à droite de Google Chrome.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">2</span>
                        <p className="text-slate-300">Sélectionnez <strong>"Installer l'application"</strong> ou <strong>"Ajouter à l'écran d'accueil"</strong>.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">3</span>
                        <p className="text-slate-300">Validez pour retrouver l'icône KUMA avec vos applications favorites.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Play Store Bundle info */}
              <div className="bg-emerald-950/60 p-3.5 rounded-2xl border border-emerald-800/80 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Google Play Store Bundle Ready</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Package ID : <code className="text-emerald-300 font-mono">{ANDROID_PLAYSTORE_CONFIG.applicationId}</code>. Conforme Trusted Web Activity (.AAB).
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: IOS / IPHONE */}
          {deviceTab === 'ios' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-amber-300 flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-amber-400" />
                    Installation sur iPhone & iPad (Safari)
                  </span>
                  <span className="bg-amber-950 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-700 font-bold">
                    iOS 14 - 18+
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  Suivez ces 3 étapes simples depuis le navigateur <strong>Safari</strong> sur votre iPhone :
                </p>

                <div className="space-y-2.5">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/50 flex items-center justify-center flex-shrink-0 text-blue-300">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-white">Étape 1 : Bouton Partager</p>
                      <p className="text-slate-400 text-[11px]">Appuyez sur l'icône <strong>Partager</strong> en bas de Safari.</p>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center flex-shrink-0 text-emerald-300">
                      <PlusSquare className="w-5 h-5" />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-white">Étape 2 : Sur l'écran d'accueil</p>
                      <p className="text-slate-400 text-[11px]">Faites défiler vers le bas et appuyez sur <strong>"Sur l'écran d'accueil"</strong>.</p>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center flex-shrink-0 text-amber-300 font-bold">
                      ✓
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-white">Étape 3 : Confirmer "Ajouter"</p>
                      <p className="text-slate-400 text-[11px]">Appuyez sur <strong>Ajouter</strong> en haut à droite. KUMA apparaîtra comme une app native.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DESKTOP PC & MAC */}
          {deviceTab === 'desktop' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 space-y-3">
                <span className="font-extrabold text-sm text-cyan-300 flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-cyan-400" />
                  Installation sur Windows, Mac & Linux
                </span>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Sur <strong>Google Chrome, Microsoft Edge, Brave ou Opera</strong> :
                </p>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">1</span>
                    <p className="text-slate-300">Regardez à l'extrémité droite de la barre d'adresse URL.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">2</span>
                    <p className="text-slate-300">Cliquez sur l'icône <strong>"Installer KUMA" (⊕ ou 💻)</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">3</span>
                    <p className="text-slate-300">L'application s'ouvrira dans sa propre fenêtre indépendante et s'ajoutera à votre barre des tâches.</p>
                  </div>
                </div>

                {deferredPrompt && (
                  <button
                    onClick={handleTriggerNativeInstall}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Installer sur mon Ordinateur maintenant</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: QR CODE FOR MOBILE SCAN */}
          {deviceTab === 'qr' && (
            <div className="space-y-4 animate-fadeIn text-center">
              <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700 space-y-3 flex flex-col items-center">
                <span className="font-extrabold text-sm text-purple-300 flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-purple-400" />
                  Scanner pour installer sur votre Téléphone
                </span>
                <p className="text-xs text-slate-300 max-w-xs">
                  Ouvrez l'appareil photo de votre smartphone pour ouvrir et installer KUMA Mali immédiatement :
                </p>

                <div className="bg-white p-3 rounded-2xl shadow-xl border-4 border-emerald-600 inline-block">
                  <img
                    src={qrUrl}
                    alt="QR Code Installation KUMA"
                    className="w-44 h-44 object-contain rounded-lg"
                  />
                </div>

                <p className="text-[11px] text-emerald-300 font-mono font-bold">
                  {appUrl}
                </p>
              </div>
            </div>
          )}

          {/* Advantages list */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/80 flex items-center gap-2 text-emerald-300">
              <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Zéro consommation de données en veille</span>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/80 flex items-center gap-2 text-emerald-300">
              <Globe className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Fonctionne 100% sans connexion</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Certifié Sécurisé E2EE • PWA Standard
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
