import React, { useState, useEffect } from 'react';
import {
  Radio,
  Cpu,
  Users,
  ShieldCheck,
  Zap,
  WifiOff,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Database,
  ArrowRightLeft,
  Smartphone,
  Sparkles,
  X
} from 'lucide-react';
import { kumaP2P, KumaP2PNode } from '../lib/kumaAutonomousP2P';
import { User, NetworkMode } from '../types';

interface KumaAutonomousModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  allPresetUsers: User[];
  onSwitchUser: (user: User) => void;
  networkMode: NetworkMode;
  queuedCount: number;
  onRelayViaMesh: () => void;
}

export const KumaAutonomousModal: React.FC<KumaAutonomousModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allPresetUsers,
  onSwitchUser,
  networkMode,
  queuedCount,
  onRelayViaMesh
}) => {
  if (!isOpen) return null;

  const [discoveredNodes, setDiscoveredNodes] = useState<KumaP2PNode[]>([]);
  const [pingSent, setPingSent] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const updateNodes = () => {
      setDiscoveredNodes(kumaP2P.getDiscoveredNodes());
    };

    updateNodes();
    const interval = setInterval(updateNodes, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMeshPing = () => {
    kumaP2P.broadcastPing(networkMode);
    setPingSent(true);
    setTimeout(() => {
      setPingSent(false);
      setDiscoveredNodes(kumaP2P.getDiscoveredNodes());
    }, 1000);
  };

  const handleOpenSecondTab = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-emerald-700/60 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 p-4 border-b border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-amber-300 flex items-center gap-1.5">
                KUMA ↔ KUMA Protocole Autonome & P2P
              </h2>
              <p className="text-[11px] text-emerald-200">
                Communication directe d'application à application • Mode Hors-Ligne
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Architecture Highlights Card */}
          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-emerald-800/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                100% Autonome & Décentralisé
              </span>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">
                Node ID: {kumaP2P.getNodeId()}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              L'application KUMA communique <strong>directement entre instances KUMA</strong> sans dépendre d'un serveur tiers propriétaire. En mode hors-ligne, les messages sont stockés dans la base locale SQLite/IndexedDB et relayés via le réseau maillé <strong>KUMA Mesh P2P</strong> (Wi-Fi Direct / Local Broadcast / Bluetooth).
            </p>
          </div>

          {/* User Profile Switcher for Testing KUMA ↔ KUMA */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                Profil Actif sur cette instance KUMA :
              </h3>
              <span className="text-[11px] text-amber-300 font-bold">
                {currentUser.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allPresetUsers.map((user) => {
                const isActive = user.id === currentUser.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => onSwitchUser(user)}
                    className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                      isActive
                        ? 'bg-emerald-950 border-amber-400 ring-2 ring-amber-400/30'
                        : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-600"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white truncate">{user.name}</span>
                        {isActive && (
                          <span className="text-[9px] bg-amber-400 text-emerald-950 px-1 rounded font-black">
                            ACTIF
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block truncate">
                        {user.phone}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live P2P Discovered Mesh Nodes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-amber-400" />
                Nœuds KUMA pairs détectés en temps réel :
              </h3>
              <button
                onClick={handleSendMeshPing}
                className="text-[11px] text-emerald-300 hover:text-emerald-200 flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${pingSent ? 'animate-spin text-amber-300' : ''}`} />
                <span>Scanner réseau</span>
              </button>
            </div>

            {discoveredNodes.length === 0 ? (
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center space-y-2">
                <p className="text-xs text-slate-400">
                  Aucun autre nœud KUMA distant détecté pour l'instant.
                </p>
                <button
                  onClick={handleOpenSecondTab}
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ouvrir KUMA dans un 2ème onglet (Pair P2P)</span>
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                {discoveredNodes.map((node) => (
                  <div
                    key={node.nodeId}
                    className="bg-slate-800 p-2.5 rounded-xl border border-emerald-600/40 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <img
                        src={node.userAvatar}
                        alt={node.userName}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-slate-100 block truncate">
                          {node.userName} ({node.userPhone})
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Node: {node.nodeId} • Signal: {node.rssiSignalStrength} dBm
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700 font-mono">
                      Connecté P2P
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Offline Store-and-Forward Relay Action */}
          {queuedCount > 0 && (
            <div className="bg-amber-950/40 p-3 rounded-2xl border border-amber-500/40 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="font-bold text-xs text-amber-300 block">
                  {queuedCount} message(s) en file d'attente hors-ligne
                </span>
                <span className="text-[11px] text-amber-200/80">
                  Prêts à être transmis dès qu'un pair ou un réseau est disponible.
                </span>
              </div>
              <button
                onClick={onRelayViaMesh}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs rounded-xl shadow-md flex-shrink-0"
              >
                Relayer en Mesh
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>SQLite Local • Signal Protocol E2EE</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
