import React, { useState } from 'react';
import {
  Clock,
  Send,
  Trash2,
  X,
  CheckCircle2,
  RefreshCw,
  Database,
  ShieldCheck,
  Radio,
  FileAudio,
  FileText,
  ArrowRightLeft,
  Image,
  AlertCircle
} from 'lucide-react';
import { QueuedOfflineItem } from '../lib/offlineQueue';
import { Language, NetworkMode } from '../types';

interface OfflineOutboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  queuedItems: QueuedOfflineItem[];
  onForceSendAll: () => Promise<void>;
  onRemoveItem: (messageId: string) => void;
  onClearQueue: () => void;
  onSwitchOnline: () => void;
  networkMode: NetworkMode;
  language: Language;
}

export const OfflineOutboxModal: React.FC<OfflineOutboxModalProps> = ({
  isOpen,
  onClose,
  queuedItems,
  onForceSendAll,
  onRemoveItem,
  onClearQueue,
  onSwitchOnline,
  networkMode,
  language
}) => {
  if (!isOpen) return null;

  const [isFlushing, setIsFlushing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState('');

  const totalSizeKb = queuedItems.reduce((acc, item) => acc + (item.dataSizeKb || 1), 0);

  const handleManualFlush = async () => {
    setIsFlushing(true);
    setSyncStatusMsg('Déchiffrement et transmission locale en cours...');
    try {
      await onForceSendAll();
      setSyncStatusMsg('Synchronisation terminée avec succès !');
      setTimeout(() => setSyncStatusMsg(''), 3000);
    } catch (e) {
      setSyncStatusMsg('Erreur lors de l\'envoi. Vérifiez la connexion.');
    } finally {
      setIsFlushing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-emerald-700/60 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 p-4 border-b border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-amber-300 flex items-center gap-1.5">
                File d'Attente Hors-Ligne (Outbox)
                <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.2 rounded-full font-mono">
                  {queuedItems.length} en attente
                </span>
              </h2>
              <p className="text-[11px] text-emerald-200">
                Stockage SQLite Local E2EE • Zéro perte de données
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Database & Storage Status Bar */}
        <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Poids total outbox : <strong>{totalSizeKb.toFixed(1)} KB</strong></span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Chiffré AES-256 localement</span>
          </div>
        </div>

        {/* Sync Status Banner */}
        {syncStatusMsg && (
          <div className="p-2.5 bg-emerald-900/80 border-b border-emerald-700 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{syncStatusMsg}</span>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {queuedItems.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-2" />
              <h3 className="font-bold text-sm text-slate-200">File d'attente vide</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Tous vos messages sont synchronisés et transmis. Lorsque vous écrivez hors-ligne, ils apparaîtront ici.
              </p>
            </div>
          ) : (
            queuedItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800/90 rounded-2xl p-3 border border-slate-700 hover:border-emerald-600/60 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Icon type */}
                  <div className="w-9 h-9 rounded-xl bg-slate-700 flex items-center justify-center flex-shrink-0 text-amber-300">
                    {item.message.type === 'voice' && <FileAudio className="w-4 h-4 text-emerald-400" />}
                    {item.message.type === 'text' && <FileText className="w-4 h-4 text-blue-400" />}
                    {item.message.type === 'mobile_money' && <ArrowRightLeft className="w-4 h-4 text-amber-400" />}
                    {item.message.type === 'image' && <Image className="w-4 h-4 text-purple-400" />}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-slate-200 truncate">
                        À : {item.targetRecipientName || item.chatId}
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono flex-shrink-0 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(item.queuedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {item.message.type === 'voice' && `Note Vocale Opus (${item.message.voiceNote?.durationSeconds || 5}s)`}
                      {item.message.type === 'text' && item.message.content}
                      {item.message.type === 'mobile_money' && `Paiement ${item.message.mobileMoney?.amountFcfa} FCFA`}
                      {item.message.type === 'image' && 'Image compressée'}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                      <span>Taille : {item.dataSizeKb.toFixed(1)} KB</span>
                      <span>•</span>
                      <span>Tentatives : {item.attemptsCount}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={() => onRemoveItem(item.message.id)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors"
                  title="Supprimer de la file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          {queuedItems.length > 0 && (
            <button
              onClick={onClearQueue}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium px-2 py-1"
            >
              Vider la file
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {networkMode === 'offline' && (
              <button
                onClick={onSwitchOnline}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
              >
                Passer en mode Réseau
              </button>
            )}

            <button
              onClick={handleManualFlush}
              disabled={isFlushing || queuedItems.length === 0}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFlushing ? 'animate-spin' : ''}`} />
              <span>{isFlushing ? 'Envoi...' : 'Envoyer / Synchroniser tout'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
