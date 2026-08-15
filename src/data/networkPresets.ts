import { NetworkMode } from '../types';

export interface NetworkPreset {
  id: NetworkMode;
  name: string;
  shortName: string;
  bandwidthMbps: number;
  bandwidthDisplay: string;
  pingMs: number;
  description: string;
  flagOrIcon: string;
  colorClass: string;
  badgeClass: string;
  packetLoss: string;
  techDetails: string;
  audioCodec: string;
  videoQuality: string;
  transferSpeedMultiplier: number;
}

export const NETWORK_PRESETS: Record<NetworkMode, NetworkPreset> = {
  infinig: {
    id: 'infinig',
    name: '⚡ ∞G Quantique Ultra-Fast (Infini G)',
    shortName: '∞G Infini',
    bandwidthMbps: 1000000,
    bandwidthDisplay: '100 Tbps+ (Illimité)',
    pingMs: 0.1,
    description: 'Réseau Quantique Instantané Mali - Débit infini & Latence Zéro absolue',
    flagOrIcon: '⚡',
    colorClass: 'text-fuchsia-400',
    badgeClass: 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-amber-400 text-white shadow-lg border border-fuchsia-300 animate-pulse',
    packetLoss: '0.000%',
    techDetails: 'Quantique Photonique E2EE • Instantanéité Totale',
    audioCodec: 'Opus Studio Lossless 48kHz (32-bit Float)',
    videoQuality: '8K HDR 120fps Uncompressed',
    transferSpeedMultiplier: 10000
  },
  '6g': {
    id: '6g',
    name: '🌐 6G Terahertz (Ultra Fast 10 Gbps)',
    shortName: '6G Terahertz',
    bandwidthMbps: 10000,
    bandwidthDisplay: '10 Gbps',
    pingMs: 1,
    description: 'Fréquences sub-terahertz ultra-rapides Mali',
    flagOrIcon: '🌐',
    colorClass: 'text-cyan-400',
    badgeClass: 'bg-cyan-900 text-cyan-200 border border-cyan-500',
    packetLoss: '0.001%',
    techDetails: 'Holographic & AI Native Beamforming',
    audioCodec: 'Opus 48kHz HD 128kbps',
    videoQuality: '4K Ultra HD 60fps',
    transferSpeedMultiplier: 500
  },
  '5g': {
    id: '5g',
    name: '🚀 5G Bamako & Villes (350 Mbps)',
    shortName: '5G Ultra',
    bandwidthMbps: 350,
    bandwidthDisplay: '350 Mbps',
    pingMs: 10,
    description: 'Très haut débit mobile urbain (Orange / Moov 5G)',
    flagOrIcon: '🚀',
    colorClass: 'text-emerald-400',
    badgeClass: 'bg-emerald-800 text-emerald-100 border border-emerald-500',
    packetLoss: '0.01%',
    techDetails: 'Massive MIMO 3.5GHz NR',
    audioCodec: 'Opus 32kHz 64kbps',
    videoQuality: '1080p Full HD',
    transferSpeedMultiplier: 100
  },
  starlink: {
    id: 'starlink',
    name: '🛰️ Starlink Satellitaire (Désert / Régions)',
    shortName: 'Starlink Sat',
    bandwidthMbps: 150,
    bandwidthDisplay: '150 Mbps',
    pingMs: 35,
    description: 'Constellation LEO (Tombouctou, Gao, Kidal, Kayes, Mopti)',
    flagOrIcon: '🛰️',
    colorClass: 'text-amber-300',
    badgeClass: 'bg-indigo-900 text-amber-300 border border-amber-400/50',
    packetLoss: '0.05%',
    techDetails: 'Ku/Ka-band Phased Array Direct to Mobile',
    audioCodec: 'Opus 24kHz 32kbps',
    videoQuality: '1080p HD',
    transferSpeedMultiplier: 50
  },
  '4g': {
    id: '4g',
    name: '📶 4G LTE / Fibre Bamako (25 Mbps)',
    shortName: '4G LTE',
    bandwidthMbps: 25,
    bandwidthDisplay: '25 Mbps',
    pingMs: 45,
    description: 'Réseau 4G standard opérateurs maliens',
    flagOrIcon: '📶',
    colorClass: 'text-blue-300',
    badgeClass: 'bg-blue-900 text-blue-200 border border-blue-600',
    packetLoss: '0.1%',
    techDetails: 'LTE Advanced Cat 6',
    audioCodec: 'Opus 24kHz 24kbps',
    videoQuality: '720p HD',
    transferSpeedMultiplier: 20
  },
  '3g': {
    id: '3g',
    name: '⚡ 3G HSPA+ (Normal Mali - 384 kbps)',
    shortName: '3G Mali',
    bandwidthMbps: 0.384,
    bandwidthDisplay: '384 kbps',
    pingMs: 180,
    description: 'Couverture nationale Mali (Villes & axes routiers)',
    flagOrIcon: '⚡',
    colorClass: 'text-yellow-300',
    badgeClass: 'bg-yellow-900/80 text-yellow-200 border border-yellow-600',
    packetLoss: '0.8%',
    techDetails: 'UMTS / WCDMA 2100MHz',
    audioCodec: 'Opus 16kHz 16kbps',
    videoQuality: '480p SD',
    transferSpeedMultiplier: 5
  },
  '2g': {
    id: '2g',
    name: '📻 2G / EDGE Sahel (Réseau Faible 8 kbps)',
    shortName: '2G EDGE',
    bandwidthMbps: 0.008,
    bandwidthDisplay: '8 kbps (Ultra Low-Data)',
    pingMs: 600,
    description: 'Zones rurales profondes, brousse et Sahel malien',
    flagOrIcon: '📻',
    colorClass: 'text-orange-400',
    badgeClass: 'bg-orange-950 text-orange-300 border border-orange-600',
    packetLoss: '3.5%',
    techDetails: 'GSM / GPRS / EDGE 900MHz',
    audioCodec: 'Opus Narrowband 8kbps (Spécial KUMA Mali)',
    videoQuality: 'Audio Only / Micro-Thumbnails WebP 3KB',
    transferSpeedMultiplier: 1
  },
  offline: {
    id: 'offline',
    name: '📵 Hors-Ligne (Stockage Local SQLite)',
    shortName: 'Offline',
    bandwidthMbps: 0,
    bandwidthDisplay: '0 kbps (Hors réseau)',
    pingMs: 9999,
    description: 'Mode sans connexion - Envoi différé automatique dès reconnexion',
    flagOrIcon: '📵',
    colorClass: 'text-slate-400',
    badgeClass: 'bg-slate-800 text-slate-300 border border-slate-600',
    packetLoss: '100%',
    techDetails: 'IndexedDB & SQLite Offline Sync Queue',
    audioCodec: 'Stocké localement',
    videoQuality: 'Non disponible hors-ligne',
    transferSpeedMultiplier: 0
  }
};
