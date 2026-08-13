import React from 'react';
import { NetworkMode, Language, DataSavingMode } from '../types';
import { translations } from '../data/translations';
import { Signal, Wifi, WifiOff, Globe, Zap, Cpu, ArrowDownUp, Phone, Grid3x3, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentTab: 'chats' | 'status' | 'calls' | 'architecture';
  setCurrentTab: (tab: 'chats' | 'status' | 'calls' | 'architecture') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  networkMode: NetworkMode;
  setNetworkMode: (mode: NetworkMode) => void;
  dataSavingMode: DataSavingMode;
  setDataSavingMode: (mode: DataSavingMode) => void;
  unreadTotal: number;
  openSettings: () => void;
  openMobileMoney: () => void;
  currentUserPhone?: string;
  openPhoneAuth?: () => void;
  openDialer?: () => void;
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
  openSettings,
  openMobileMoney,
  currentUserPhone = '+223 76 12 34 56',
  openPhoneAuth,
  openDialer
}) => {
  const t = translations[language];

  return (
    <header className="bg-emerald-950 text-white shadow-lg border-b border-emerald-800/50 sticky top-0 z-30">
      {/* Top Utility & Network Status Bar */}
      <div className="bg-emerald-900/90 px-3 py-1.5 flex items-center justify-between text-xs border-b border-emerald-800/40">
        <div className="flex items-center gap-2">
          {/* Network Selector */}
          <div className="flex items-center gap-1 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/60">
            {networkMode === 'offline' ? (
              <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            ) : networkMode === '2g' ? (
              <Signal className="w-3.5 h-3.5 text-orange-400" />
            ) : (
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <select
              value={networkMode}
              onChange={(e) => setNetworkMode(e.target.value as NetworkMode)}
              className="bg-transparent text-emerald-100 font-medium cursor-pointer focus:outline-none"
            >
              <option value="4g" className="bg-emerald-900 text-white">4G / Fibre (Rapide)</option>
              <option value="3g" className="bg-emerald-900 text-white">3G (Normal Mali)</option>
              <option value="2g" className="bg-emerald-900 text-white">2G / EDGE (Faible)</option>
              <option value="offline" className="bg-emerald-900 text-white">Hors-ligne (Offline)</option>
            </select>
          </div>

          {/* Data Savings Badge */}
          <button
            onClick={() => {
              if (dataSavingMode === 'normal') setDataSavingMode('low_data');
              else if (dataSavingMode === 'low_data') setDataSavingMode('ultra_low_data');
              else setDataSavingMode('normal');
            }}
            className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              dataSavingMode === 'ultra_low_data'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : dataSavingMode === 'low_data'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                : 'bg-emerald-800/40 text-emerald-300'
            }`}
            title="Cliquer pour changer le mode d'économie de données"
          >
            <Zap className="w-3 h-3 text-yellow-400" />
            <span>
              {dataSavingMode === 'ultra_low_data' ? 'Ultra-Low 2G (Opus 8k)' : dataSavingMode === 'low_data' ? 'Economie 3G' : 'Standard'}
            </span>
          </button>
        </div>

        {/* Right Bar Controls: Language & Phone Auth */}
        <div className="flex items-center gap-2">
          {/* Phone Number Login Badge */}
          {openPhoneAuth && (
            <button
              onClick={openPhoneAuth}
              className="flex items-center gap-1 bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold px-2 py-0.5 rounded border border-emerald-700 text-[11px] transition-transform active:scale-95 shadow-sm"
              title="Connexion par Numéro de Téléphone"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span className="hidden xs:inline font-mono">{currentUserPhone}</span>
              <span className="xs:hidden">Mobile</span>
            </button>
          )}

          {/* Mobile Money Quick Access */}
          <button
            onClick={openMobileMoney}
            className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-2 py-0.5 rounded text-[11px] transition-transform active:scale-95 shadow-sm"
          >
            <ArrowDownUp className="w-3 h-3" />
            <span className="hidden xs:inline">Mobile Money</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/60">
            <Globe className="w-3 h-3 text-emerald-300" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-emerald-100 font-medium cursor-pointer focus:outline-none"
            >
              <option value="fr" className="bg-emerald-900 text-white">🇫🇷 Français</option>
              <option value="bm" className="bg-emerald-900 text-white">🇲🇱 Bamanankan (Bambara)</option>
              <option value="ff" className="bg-emerald-900 text-white">🇲🇱 Fulfulde (Peul)</option>
              <option value="sn" className="bg-emerald-900 text-white">🇲🇱 Soninke</option>
              <option value="tm" className="bg-emerald-900 text-white">🇲🇱 Tamasheq</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main App Title Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Bogolan styled Logo Badge */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-yellow-500 to-red-500 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-emerald-950 rounded-[10px] flex items-center justify-center font-black text-amber-400 text-lg tracking-wider">
              KUMA
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-emerald-100 leading-tight tracking-wide flex items-center gap-2">
              KUMA
              <span className="text-[10px] font-semibold bg-emerald-800/80 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Appels E2EE 🇲🇱
              </span>
            </h1>
            <p className="text-xs text-emerald-300/80 line-clamp-1">{t.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Keypad Dialer Button in Header */}
          {openDialer && (
            <button
              onClick={openDialer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-emerald-950 shadow-md transition-transform active:scale-95"
              title="Composer un numéro de téléphone"
            >
              <Grid3x3 className="w-4 h-4" />
              <span className="hidden sm:inline">Clavier</span>
            </button>
          )}

          {/* Action Button for Architecture & DB View */}
          <button
            onClick={() => setCurrentTab('architecture')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
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
          className={`flex-1 py-3 text-center transition-colors relative flex items-center justify-center gap-1.5 ${
            currentTab === 'chats' ? 'text-amber-400 font-bold bg-emerald-900/40' : 'hover:bg-emerald-900/20'
          }`}
        >
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

        <button
          onClick={() => setCurrentTab('status')}
          className={`flex-1 py-3 text-center transition-colors relative flex items-center justify-center gap-1.5 ${
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
          className={`flex-1 py-3 text-center transition-colors relative flex items-center justify-center gap-1.5 ${
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
          className={`flex-1 py-3 text-center transition-colors relative flex items-center justify-center gap-1.5 ${
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
