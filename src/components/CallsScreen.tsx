import React from 'react';
import { CallLog, Language } from '../types';
import { translations } from '../data/translations';
import { PhoneCall, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed, Zap, ShieldCheck, Grid3x3 } from 'lucide-react';

interface CallsScreenProps {
  calls: CallLog[];
  language: Language;
  onStartCall: (contactName: string, type: 'audio' | 'video') => void;
  onOpenDialer?: () => void;
}

export const CallsScreen: React.FC<CallsScreenProps> = ({ calls, language, onStartCall, onOpenDialer }) => {
  const t = translations[language];

  return (
    <div className="flex flex-col h-full bg-slate-50 p-3 space-y-3 overflow-y-auto relative">
      {/* Banner explaining 2G Audio Call Optimizations & E2EE */}
      <div className="bg-emerald-900 text-emerald-100 p-3.5 rounded-2xl border border-emerald-700 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold flex-shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <h3 className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
              <span>Appels WebRTC Sécurisés & Chiffrés (E2EE)</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </h3>
            <p className="text-emerald-200 opacity-90 leading-relaxed text-[11px]">
              Protocoles DTLS-SRTP 256 bits • Codec Opus <span className="font-bold underline">8 kbps</span> (spécial 2G Mali).
            </p>
          </div>
        </div>

        {/* Quick Dialer Button */}
        {onOpenDialer && (
          <button
            onClick={onOpenDialer}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs px-3 py-2 rounded-xl shadow-md transition-transform active:scale-95 flex-shrink-0"
          >
            <Grid3x3 className="w-4 h-4" />
            <span className="hidden sm:inline">Composer</span>
          </button>
        )}
      </div>

      {/* Calls List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
        {calls.map((call) => (
          <div key={call.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <img
                src={call.contactAvatar}
                alt={call.contactName}
                className="w-11 h-11 rounded-full object-cover border border-slate-200"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-slate-900 text-xs">{call.contactName}</h4>
                  <span className="bg-emerald-50 text-emerald-700 text-[9px] font-mono px-1.5 py-0.2 rounded border border-emerald-200 flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                    E2EE
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                  {call.direction === 'incoming' && <PhoneIncoming className="w-3 h-3 text-emerald-600" />}
                  {call.direction === 'outgoing' && <PhoneOutgoing className="w-3 h-3 text-blue-600" />}
                  {call.direction === 'missed' && <PhoneMissed className="w-3 h-3 text-red-500" />}
                  <span>{call.timestamp}</span>
                  {call.duration && <span>• {call.duration}</span>}
                </div>
                <div className="text-[10px] text-emerald-700 font-mono mt-0.5">
                  Données: {call.dataUsedKb} KB ({call.codec})
                </div>
              </div>
            </div>

            {/* Quick Callback button */}
            <button
              onClick={() => onStartCall(call.contactName, call.type)}
              className="p-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-all"
              title="Rappeler"
            >
              {call.type === 'video' ? <Video className="w-4 h-4" /> : <PhoneCall className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>

      {/* Floating Action Button to Compose / Dial */}
      {onOpenDialer && (
        <button
          onClick={onOpenDialer}
          className="fixed bottom-6 right-6 sm:absolute sm:bottom-6 sm:right-6 bg-amber-400 hover:bg-amber-300 text-emerald-950 p-4 rounded-2xl shadow-2xl flex items-center gap-2 font-black text-xs transition-transform active:scale-90 border-2 border-emerald-900 z-20"
        >
          <Grid3x3 className="w-5 h-5" />
          <span>Composer Numéro</span>
        </button>
      )}
    </div>
  );
};
