import React, { useState, useEffect } from 'react';
import { CallSession, NetworkMode } from '../types';
import { NETWORK_PRESETS } from '../data/networkPresets';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Volume2,
  VolumeX,
  SwitchCamera,
  Signal,
  Wifi,
  ShieldCheck,
  Zap,
  PhoneIncoming,
  Check,
  Sparkles
} from 'lucide-react';

interface CallOverlayProps {
  callSession: CallSession | null;
  onEndCall: () => void;
  onAcceptCall?: () => void;
  networkMode: NetworkMode;
}

export const CallOverlay: React.FC<CallOverlayProps> = ({
  callSession,
  onEndCall,
  onAcceptCall,
  networkMode
}) => {
  if (!callSession) return null;

  const [isMuted, setIsMuted] = useState(callSession.isMuted);
  const [isVideoOff, setIsVideoOff] = useState(callSession.isVideoOff);
  const [isSpeakerOn, setIsSpeakerOn] = useState(callSession.isSpeakerOn);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [callDurationSeconds, setCallDurationSeconds] = useState(0);

  // Timer for connected call
  useEffect(() => {
    let interval: any = null;
    if (callSession.status === 'connected') {
      interval = setInterval(() => {
        setCallDurationSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callSession.status]);

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  // INCOMING CALL SCREEN
  if (callSession.status === 'ringing' && callSession.direction === 'incoming') {
    return (
      <div className="fixed inset-0 bg-emerald-950/95 backdrop-blur-md z-50 flex flex-col justify-between p-6 text-white animate-fadeIn">
        <div className="text-center pt-8 space-y-2">
          <span className="bg-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full font-bold border border-amber-500/40 inline-flex items-center gap-1.5">
            <PhoneIncoming className="w-3.5 h-3.5 animate-bounce" />
            Appel WebRTC Entrant (KUMA E2EE)
          </span>
          <h2 className="text-2xl font-black tracking-wide text-white">{callSession.peerName}</h2>
          <p className="text-xs text-emerald-300">{callSession.peerPhone}</p>
        </div>

        {/* Peer Avatar */}
        <div className="flex flex-col items-center justify-center my-auto">
          <div className="relative">
            <img
              src={callSession.peerAvatar}
              alt={callSession.peerName}
              className="w-32 h-32 rounded-full object-cover border-4 border-amber-400 shadow-2xl animate-pulse"
            />
            <div className="absolute -bottom-2 right-2 bg-emerald-800 text-amber-300 p-2 rounded-full border border-white">
              {callSession.type === 'video' ? <Video className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
            </div>
          </div>
          {/* Security E2EE Badge */}
          <div className="bg-emerald-900/90 text-amber-300 px-3 py-1.5 rounded-2xl border border-emerald-700/80 text-[11px] font-mono flex items-center justify-center gap-1.5 shadow-lg max-w-xs mx-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Chiffrement E2EE : DTLS-SRTP (256-bit)</span>
          </div>

          <p className="text-[11px] text-emerald-300 mt-2 font-mono">
            🔐 Empreinte SAS : 🇲🇱-🦁-🛡️-⚡ | Hash : 8F:4A:9C:21
          </p>
          <p className="text-xs text-emerald-200 mt-1">
            Opus Codec 8 kbps • Mode Réseau Adaptatif Mali
          </p>
        </div>

        {/* Actions: Decline / Accept */}
        <div className="flex items-center justify-around pb-8 max-w-xs mx-auto w-full">
          <button
            onClick={onEndCall}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-xl transition-transform active:scale-90"
            title="Refuser"
          >
            <PhoneOff className="w-7 h-7" />
          </button>

          <button
            onClick={onAcceptCall || onEndCall}
            className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 flex items-center justify-center shadow-xl transition-transform active:scale-90 animate-bounce"
            title="Accepter l'appel"
          >
            <Check className="w-8 h-8 font-extrabold" />
          </button>
        </div>
      </div>
    );
  }

  // ACTIVE OR OUTGOING CALL OVERLAY
  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col justify-between text-white overflow-hidden">
      {/* Background Video Stream Mock or Dark Backdrop */}
      {callSession.type === 'video' && !isVideoOff ? (
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
            alt="Remote Stream"
            className="w-full h-full object-cover filter brightness-90"
          />
          {/* Local PIP Video */}
          <div className="absolute top-16 right-4 w-28 h-40 bg-slate-900 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-2xl z-10">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
              alt="Local Stream"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1 left-1 bg-black/60 text-[9px] px-1 rounded text-emerald-300 font-mono">
              Vous (Local)
            </span>
          </div>
        </div>
      ) : (
        /* Audio Call Background */
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center z-0">
          <div className="relative mb-6">
            <img
              src={callSession.peerAvatar}
              alt={callSession.peerName}
              className="w-28 h-28 rounded-full object-cover border-4 border-emerald-600 shadow-2xl"
            />
            {callSession.status === 'connected' && (
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-emerald-950 p-2 rounded-full border-2 border-emerald-950">
                <Zap className="w-4 h-4 fill-current" />
              </div>
            )}
          </div>
          <h2 className="text-2xl font-black text-emerald-100">{callSession.peerName}</h2>
          <p className="text-xs text-emerald-300 mt-1">{callSession.peerPhone}</p>

          <div className="mt-3 bg-emerald-950/90 px-3.5 py-1.5 rounded-full border border-emerald-700/80 text-xs text-amber-300 font-mono flex items-center gap-1.5 shadow-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {callSession.status === 'connected'
                ? `E2EE Active • DTLS-SRTP • ${formatDuration(callDurationSeconds)}`
                : 'Connexion STUN/TURN Chiffrée...'}
            </span>
          </div>
          <div className="mt-1.5 text-[10px] text-emerald-300 font-mono">
            Clé Clavier : 🇲🇱-🦁-🛡️-⚡ | Direct P2P Chiffré
          </div>
        </div>
      )}

      {/* Top Floating WebRTC Network Stats */}
      <div className="relative z-10 p-4 pt-6 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-800 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
            WebRTC {callSession.type === 'video' ? 'Vidéo' : 'Audio'}
          </span>
          <span className={`text-[11px] flex items-center gap-1 font-bold ${
            networkMode === 'infinig' ? 'text-fuchsia-300 animate-pulse' : 'text-emerald-300'
          }`}>
            <Wifi className="w-3 h-3 text-emerald-400" />
            {NETWORK_PRESETS[networkMode]?.audioCodec || 'Opus Codec'} ({NETWORK_PRESETS[networkMode]?.bandwidthDisplay})
          </span>
        </div>

        <button
          onClick={onEndCall}
          className="text-slate-300 hover:text-white bg-white/10 px-2.5 py-1 rounded-lg text-[11px]"
        >
          Réduire
        </button>
      </div>

      {/* Bottom In-Call Control Panel */}
      <div className="relative z-10 p-6 pb-10 bg-gradient-to-t from-black/90 via-black/70 to-transparent flex items-center justify-around max-w-md mx-auto w-full">
        {/* Mute Button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-3.5 rounded-full transition-transform active:scale-90 shadow-lg ${
            isMuted ? 'bg-red-500 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
          }`}
          title={isMuted ? "Activer le micro" : "Couper le micro"}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {/* Video Toggle Button */}
        {callSession.type === 'video' && (
          <>
            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-3.5 rounded-full transition-transform active:scale-90 shadow-lg ${
                isVideoOff ? 'bg-red-500 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              title={isVideoOff ? "Activer la caméra" : "Couper la caméra"}
            >
              {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </button>

            <button
              onClick={() => setIsFrontCamera(!isFrontCamera)}
              className="p-3.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-transform active:scale-90 shadow-lg"
              title="Bascule Caméra Avant/Arrière"
            >
              <SwitchCamera className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Speaker Button */}
        <button
          onClick={() => setIsSpeakerOn(!isSpeakerOn)}
          className={`p-3.5 rounded-full transition-transform active:scale-90 shadow-lg ${
            isSpeakerOn ? 'bg-amber-400 text-emerald-950 font-bold' : 'bg-white/20 hover:bg-white/30 text-white'
          }`}
          title={isSpeakerOn ? "Désactiver le haut-parleur" : "Haut-parleur"}
        >
          {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </button>

        {/* End Call Button */}
        <button
          onClick={onEndCall}
          className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-2xl transition-transform active:scale-90"
          title="Raccrocher"
        >
          <PhoneOff className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};
