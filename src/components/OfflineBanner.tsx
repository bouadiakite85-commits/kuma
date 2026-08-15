import React from 'react';
import { WifiOff, Clock, Radio, RefreshCw, Database, ShieldCheck, Zap } from 'lucide-react';
import { NetworkMode, Language } from '../types';

interface OfflineBannerProps {
  networkMode: NetworkMode;
  queuedCount: number;
  queuedSizeKb: number;
  onOpenOutbox: () => void;
  onOpenMeshModal: () => void;
  onReconnect: () => void;
  language: Language;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  networkMode,
  queuedCount,
  queuedSizeKb,
  onOpenOutbox,
  onOpenMeshModal,
  onReconnect,
  language
}) => {
  if (networkMode !== 'offline' && queuedCount === 0) return null;

  const isOffline = networkMode === 'offline';

  return (
    <div className={`px-3 py-2 border-b flex flex-wrap items-center justify-between gap-2 text-xs transition-all shadow-sm ${
      isOffline
        ? 'bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white border-amber-500/40'
        : 'bg-amber-50 text-amber-950 border-amber-200'
    }`}>
      {/* Left Info */}
      <div className="flex items-center gap-2 min-w-0">
        <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isOffline ? 'bg-amber-400 text-emerald-950 font-black' : 'bg-amber-200 text-amber-900'
        }`}>
          {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 font-bold">
            <span className={isOffline ? 'text-amber-300' : 'text-amber-900'}>
              {isOffline ? 'Mode Hors-Ligne Autonome KUMA' : 'Synchronisation en cours'}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-1.5 py-0.2 rounded font-mono bg-emerald-900/80 text-emerald-300 border border-emerald-700">
              <Database className="w-2.5 h-2.5" />
              SQLite Local
            </span>
          </div>
          <p className="text-[11px] text-slate-300 truncate max-w-md">
            {queuedCount > 0
              ? `${queuedCount} message(s) (${queuedSizeKb.toFixed(1)} KB) en attente dans la file locale (Outbox).`
              : 'KUMA est 100% autonome sans Internet : vos données restent sur cet appareil.'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {queuedCount > 0 && (
          <button
            onClick={onOpenOutbox}
            className="flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-2.5 py-1 rounded-lg text-[11px] transition-transform active:scale-95 shadow-xs"
            title="Gérer la file d'attente d'envoi hors-ligne"
          >
            <Clock className="w-3 h-3" />
            <span>File d'attente ({queuedCount})</span>
          </button>
        )}

        <button
          onClick={onOpenMeshModal}
          className="flex items-center gap-1 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 font-medium px-2 py-1 rounded-lg text-[11px] border border-emerald-700 transition-colors"
          title="Transmettre via KUMA Mesh P2P direct local"
        >
          <Radio className="w-3 h-3 text-amber-400" />
          <span className="hidden md:inline">KUMA Mesh P2P</span>
          <span className="md:hidden">Mesh</span>
        </button>

        {isOffline && (
          <button
            onClick={onReconnect}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded-lg text-[11px] border border-slate-600 transition-colors font-medium"
          >
            <RefreshCw className="w-3 h-3 text-emerald-400" />
            <span>Reconnecter</span>
          </button>
        )}
      </div>
    </div>
  );
};
