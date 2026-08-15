import React from 'react';
import { NetworkMode, Language, DataSavingMode } from '../types';
import { translations } from '../data/translations';
import { NETWORK_PRESETS } from '../data/networkPresets';
import {
  Signal,
  Wifi,
  WifiOff,
  Globe,
  Zap,
  Cpu,
  ArrowDownUp,
  Phone,
  Grid3x3,
  ShieldCheck,
  Download,
  Sparkles,
  Smartphone,
  Users,
  MessageSquare,
  Radio,
  Clock
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'chats' | 'contacts' | 'status' | 'calls' | 'architecture';
  setCurrentTab: (tab: 'chats' | 'contacts' | 'status' | 'calls' | 'architecture') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  networkMode: NetworkMode;
  setNetworkMode: (mode: NetworkMode) => void;
  dataSavingMode: DataSavingMode;
  setDataSavingMode: (mode: DataSavingMode) => void;
  unreadTotal: number;
  contactsCount?: number;
  openSettings: () => void;
  openMobileMoney: () => void;
  currentUserPhone?: string;
  currentUserName?: string;
  openPhoneAuth?: () => void;
  openDialer?: () => void;
  openInstallModal?: () => void;
  openAutonomousModal?: () => void;
  openOutboxModal?: () => void;
  queuedCount?: number;
  discoveredNodesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  networkMode,
  setNetworkMode,
  dataSavingMode,
  setDataSavingMode,
  unreadTotal,
  contactsCount = 0,
  openSettings,
  openMobileMoney,
  currentUserPhone = '+223 76 12 34 56',
  currentUserName = 'Amadou',
  openPhoneAuth,
  openDialer,
  openInstallModal,
  openAutonomousModal,
  openOutboxModal,
  queuedCount = 0,
  discoveredNodesCount = 0
}) => {
  const t = translations[language];
  const activePreset = NETWORK_PRESETS[networkMode] || NETWORK_PRESETS['3g'];

  return (
    <header className="bg-emerald-950 text-white shadow-lg border-b border-emerald-800/50 sticky top-0 z-30">
      {/* Top Utility & Network Status Bar */}
      <div className="bg-emerald-900/90 px-3 py-1.5 flex items-center justify-between text-xs border-b border-emerald-800/40 gap-1 overflow-x-auto">
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Network Selector with 2G up to ∞G (Infini G) */}
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border transition-all ${
            networkMode === 'infinig'
              ? 'bg-gradient-to-r from-fuchsia-950 via-purple-900 to-indigo-950 border-fuchsia-400 shadow-md shadow-fuchsia-900/40 text-fuchsia-200'
              : networkMode === '6g'
              ? 'bg-cyan-950 border-cyan-500 text-cyan-200'
              : networkMode === '5g'
              ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
              : networkMode === 'starlink'
              ? 'bg-indigo-950 border-amber-400/70 text-amber-200'
              : networkMode === '2g'
              ? 'bg-orange-950 border-orange-600 text-orange-200'
              : networkMode === 'offline'
              ? 'bg-slate-900 border-slate-600 text-slate-300'
              : 'bg-emerald-950/90 border-emerald-700/60 text-emerald-100'
          }`}>
            <span className="text-xs">{activePreset.flagOrIcon}</span>
            <select
              value={networkMode}
              onChange={(e) => setNetworkMode(e.target.value as NetworkMode)}
              className="bg-transparent font-bold cursor-pointer focus:outline-none text-[11px] pr-1"
            >
              <option value="infinig" className="bg-slate-900 text-fuchsia-300 font-bold">⚡ ∞G Quantique (Infini G - Illimité)</option>
              <option value="6g" className="bg-slate-900 text-cyan-300">🌐 6G Terahertz (10 Gbps)</option>
              <option value="5g" className="bg-slate-900 text-emerald-300">🚀 5G Bamako (350 Mbps)</option>
              <option value="starlink" className="bg-slate-900 text-amber-300">🛰️ Starlink Sat (150 Mbps)</option>
              <option value="4g" className="bg-slate-900 text-blue-300">📶 4G / Fibre (25 Mbps)</option>
              <option value="3g" className="bg-slate-900 text-yellow-300">⚡ 3G Normal Mali (384 kbps)</option>
              <option value="2g" className="bg-slate-900 text-orange-300">📻 2G / EDGE Sahel (8 kbps)</option>
              <option value="offline" className="bg-slate-900 text-slate-300">📵 Hors-ligne (Offline SQLite)</option>
            </select>
          </div>

          {/* Network Latency & Speed Badge */}
          <span className={`hidden md:inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
            networkMode === 'infinig'
              ? 'bg-fuchsia-900/60 text-fuchsia-300 border border-fuchsia-500/50 animate-pulse'
              : networkMode === '2g'
              ? 'bg-orange-900/60 text-orange-300 border border-orange-500/40'
              : networkMode === 'offline'
              ? 'bg-slate-800 text-slate-400 border border-slate-700'
              : 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
          }`}>
            <span>{activePreset.latencyMs}ms</span>
            <span className="opacity-60">|</span>
            <span>{activePreset.bandwidthDisplay}</span>
          </span>

          {/* Data Compression & Low-Data Preset Mode */}
          <button
            onClick={() => {
              const modes: DataSavingMode[] = ['normal', 'low_data', 'ultra_low_data'];
              const nextIdx = (modes.indexOf(dataSavingMode) + 1) % modes.length;
              setDataSavingMode(modes[nextIdx]);
            }}
            className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              dataSavingMode === 'ultra_low_data'
                ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50 font-bold'
                : dataSavingMode === 'low_data'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                : 'bg-emerald-800/40 text-emerald-300'
            }`}
            title="Cliquer pour changer le mode d'économie de données"
          >
            <Zap className="w-3 h-3 text-yellow-400" />
            <span>
              {dataSavingMode === 'ultra_low_data' ? 'Ultra 2G (Opus 8k)' : dataSavingMode === 'low_data' ? 'Eco 3G' : 'Standard'}
            </span>
          </button>
        </div>

        {/* Right Bar Controls: Install Button, Phone Auth & Language */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Universal Install Button for ALL Devices */}
          {openInstallModal && (
            <button
              onClick={openInstallModal}
              className="flex items-center gap-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-emerald-950 font-black px-2.5 py-0.5 rounded-lg text-[11px] transition-transform active:scale-95 shadow-md shadow-amber-500/20 border border-amber-300"
              title="Installer KUMA sur tous les appareils (Android, iOS, PC, Mac)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Installer</span>
              <span className="hidden sm:inline">l'App 📲</span>
            </button>
          )}

          {/* Phone Number Account Badge */}
          {openPhoneAuth && (
            <button
              onClick={openPhoneAuth}
              className="flex items-center gap-1 bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold px-2 py-0.5 rounded-lg border border-emerald-700 text-[11px] transition-transform active:scale-95 shadow-sm"
              title="Connexion par Numéro de Téléphone E2EE"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline font-mono">{currentUserPhone}</span>
              <span className="sm:hidden">Mon N°</span>
            </button>
          )}

          {/* Mobile Money Quick Access */}
          <button
            onClick={openMobileMoney}
            className="flex items-center gap-1 bg-emerald-900/90 hover:bg-emerald-800 text-emerald-200 font-bold px-2 py-0.5 rounded-lg border border-emerald-700/80 text-[11px] transition-transform active:scale-95 shadow-sm"
          >
            <ArrowDownUp className="w-3 h-3 text-amber-400" />
            <span className="hidden md:inline">Money</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-700/60">
            <Globe className="w-3 h-3 text-emerald-300" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-emerald-100 font-medium cursor-pointer focus:outline-none text-[11px]"
            >
              <option value="fr" className="bg-emerald-900 text-white">🇫🇷 FR</option>
              <option value="bm" className="bg-emerald-900 text-white">🇲🇱 Bambara</option>
              <option value="ff" className="bg-emerald-900 text-white">🇲🇱 Peul</option>
              <option value="sn" className="bg-emerald-900 text-white">🇲🇱 Soninke</option>
              <option value="tm" className="bg-emerald-900 text-white">🇲🇱 Tamasheq</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main App Title Header */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Bogolan styled Logo Badge */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-yellow-500 to-red-500 p-0.5 shadow-md flex items-center justify-center flex-shrink-0">
            <div className="w-full h-full bg-emerald-950 rounded-[10px] flex items-center justify-center font-black text-amber-400 text-lg tracking-wider">
              KUMA
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-base sm:text-lg text-emerald-100 leading-tight tracking-wide flex items-center gap-2">
              KUMA
              <span className="text-[10px] font-semibold bg-emerald-800/80 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Messagerie Sécurisée 🇲🇱
              </span>
            </h1>
            <p className="text-xs text-emerald-300/80 line-clamp-1">{t.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Autonomous P2P Hub Button */}
          {openAutonomousModal && (
            <button
              onClick={openAutonomousModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-900/90 hover:bg-emerald-800 text-amber-300 border border-amber-400/40 shadow-sm transition-all active:scale-95"
              title="KUMA ↔ KUMA Protocole Autonome (P2P Mesh / Hors-ligne)"
            >
              <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden md:inline">KUMA ↔ KUMA P2P</span>
              <span className="md:hidden">P2P</span>
              {discoveredNodesCount > 0 && (
                <span className="bg-emerald-700 text-emerald-100 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-emerald-500">
                  {discoveredNodesCount}
                </span>
              )}
            </button>
          )}

          {/* Outbox Badge if messages queued */}
          {queuedCount > 0 && openOutboxModal && (
            <button
              onClick={openOutboxModal}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-black bg-amber-400 text-emerald-950 shadow-md animate-bounce"
              title="Messages en attente dans la file d'attente hors-ligne"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{queuedCount}</span>
            </button>
          )}

          {/* Keypad Dialer Button in Header */}
          {openDialer && (
            <button
              onClick={openDialer}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-emerald-950 shadow-md transition-transform active:scale-95"
              title="Composer un numéro de téléphone"
            >
              <Grid3x3 className="w-4 h-4" />
              <span className="hidden sm:inline">Clavier</span>
            </button>
          )}

          {/* Action Button for Architecture & DB View */}
          <button
            onClick={() => setCurrentTab('architecture')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              currentTab === 'architecture'
                ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-md font-bold'
                : 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border-emerald-700/60'
            }`}
          >
            <Cpu className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">{t.architecture}</span>
            <span className="sm:hidden">Arch.</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <nav className="flex border-t border-emerald-800/50 bg-emerald-950 text-xs font-semibold text-emerald-300">
        <button
          onClick={() => setCurrentTab('chats')}
          className={`flex-1 py-2.5 text-center transition-colors relative flex items-center justify-center gap-1.5 ${
            currentTab === 'chats' ? 'text-amber-400 font-bold bg-emerald-900/40' : 'hover:bg-emerald-900/20'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{t.chats}</span>
          {unreadTotal > 0 && (
            <span className="bg-amber-500 text-emerald-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
              {unreadTotal}
            </span>
          )}
          {currentTab === 'chats' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400 rounded-t-full" />
          )}
        </button>

        {/* Contacts Tab */}
        <button
          onClick={() => setCurrentTab('contacts')}
          className={`flex-1 py-2.5 text-center transition-colors relative flex items-center justify-center gap-1.5 ${
            currentTab === 'contacts' ? 'text-amber-400 font-bold bg-emerald-900/40' : 'hover:bg-emerald-900/20'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{t.contacts}</span>
          {contactsCount > 0 && (
            <span className="bg-emerald-800 text-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-emerald-600">
              {contactsCount}
            </span>
          )}
          {currentTab === 'contacts' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400 rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => setCurrentTab('status')}
          className={`flex-1 py-2.5 text-center transition-colors relative flex items-center justify-center gap-1.5 ${
            currentTab === 'status' ? 'text-amber-400 font-bold bg-emerald-900/40' : 'hover:bg-emerald-900/20'
          }`}
        >
          <span>{t.status}</span>
          {currentTab === 'status' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400 rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => setCurrentTab('calls')}
          className={`flex-1 py-2.5 text-center transition-colors relative flex items-center justify-center gap-1.5 ${
            currentTab === 'calls' ? 'text-amber-400 font-bold bg-emerald-900/40' : 'hover:bg-emerald-900/20'
          }`}
        >
          <span>{t.calls}</span>
          {currentTab === 'calls' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400 rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => setCurrentTab('architecture')}
          className={`flex-1 py-2.5 text-center transition-colors relative flex items-center justify-center gap-1.5 ${
            currentTab === 'architecture' ? 'text-amber-400 font-bold bg-emerald-900/40' : 'hover:bg-emerald-900/20'
          }`}
        >
          <span className="hidden xs:inline">Architecture & BDD</span>
          <span className="xs:hidden">Arch.</span>
          {currentTab === 'architecture' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400 rounded-t-full" />
          )}
        </button>
      </nav>
    </header>
  );
};
