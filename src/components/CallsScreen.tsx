import React from 'react';
import { CallLog, Language } from '../types';
import { translations } from '../data/translations';
import { PhoneCall, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed, Zap } from 'lucide-react';

interface CallsScreenProps {
  calls: CallLog[];
  language: Language;
  onStartCall: (contactName: string, type: 'audio' | 'video') => void;
}

export const CallsScreen: React.FC<CallsScreenProps> = ({ calls, language, onStartCall }) => {
  const t = translations[language];

  return (
    <div className="flex flex-col h-full bg-slate-50 p-3 space-y-3 overflow-y-auto">
      {/* Banner explaining 2G Audio Call Optimizations */}
      <div className="bg-emerald-900 text-emerald-100 p-3 rounded-2xl border border-emerald-700 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold flex-shrink-0">
          <Zap className="w-5 h-5" />
        </div>
        <div className="text-xs">
          <h3 className="font-bold text-amber-300 text-sm">Appels Haute Qualité 2G (Codec Opus)</h3>
          <p className="text-emerald-200 opacity-90 leading-relaxed">
            Consomme seulement <span className="font-bold underline">8 kbps</span> (environ 60 KB par minute) pour fonctionner même sur les réseaux cellulaires très instables au Mali.
          </p>
        </div>
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
                <h4 className="font-bold text-slate-900 text-xs">{call.contactName}</h4>
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
            >
              {call.type === 'video' ? <Video className="w-4 h-4" /> : <PhoneCall className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
