import React, { useState } from 'react';
import { PhoneCall, Video, MessageSquare, X, Delete, ShieldCheck, UserPlus, Globe, ChevronDown } from 'lucide-react';
import { Language } from '../types';
import { ALL_INTERNATIONAL_COUNTRIES, CountryInfo } from '../lib/countryCodes';

interface PhoneDialerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCall: (contactName: string, type: 'audio' | 'video', phone: string) => void;
  onStartChatWithPhone?: (phone: string) => void;
  onSaveAsContact?: (phone: string) => void;
  language: Language;
}

export const PhoneDialerModal: React.FC<PhoneDialerModalProps> = ({
  isOpen,
  onClose,
  onStartCall,
  onStartChatWithPhone,
  onSaveAsContact,
  language
}) => {
  if (!isOpen) return null;

  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(ALL_INTERNATIONAL_COUNTRIES[0]);
  const [typedDigits, setTypedDigits] = useState('76 12 34 56');
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const [searchCountry, setSearchCountry] = useState('');

  const fullPhone = `${selectedCountry.code} ${typedDigits.trim()}`;

  const handleKeyPress = (val: string) => {
    if (typedDigits.length < 15) {
      const clean = (typedDigits + val).replace(/\s/g, '');
      const formatted = clean.match(/.{1,2}/g)?.join(' ') || clean;
      setTypedDigits(formatted);
    }
  };

  const handleDelete = () => {
    if (typedDigits.length > 0) {
      const clean = typedDigits.replace(/\s/g, '');
      const sliced = clean.slice(0, -1);
      const formatted = sliced.match(/.{1,2}/g)?.join(' ') || sliced;
      setTypedDigits(formatted);
    }
  };

  const filteredCountries = ALL_INTERNATIONAL_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchCountry.toLowerCase()) ||
      c.code.includes(searchCountry) ||
      c.nameEn.toLowerCase().includes(searchCountry.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 text-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black text-xs">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-amber-300">Clavier International KUMA</h3>
              <p className="text-[10px] text-emerald-300">Appels Chiffrés E2EE Monde Entier</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Display Screen */}
        <div className="p-5 bg-slate-950/90 text-center border-b border-slate-800/80 space-y-1 relative">
          <div className="flex justify-center items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCountryPickerOpen(!isCountryPickerOpen)}
              className="bg-emerald-950 hover:bg-emerald-900 text-amber-300 font-bold text-sm px-2.5 py-1.5 rounded-xl border border-emerald-800 flex items-center gap-1.5 focus:outline-none"
            >
              <span>{selectedCountry.flag}</span>
              <span>{selectedCountry.code}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <span className="text-2xl font-black font-mono tracking-wider text-white">
              {typedDigits || '00 00 00 00'}
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            {selectedCountry.name} ({selectedCountry.region})
          </div>

          {/* Quick country search dropdown */}
          {isCountryPickerOpen && (
            <div className="absolute left-3 right-3 top-16 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-2.5 z-30 text-left">
              <input
                type="text"
                placeholder="Rechercher pays ou indicatif..."
                value={searchCountry}
                onChange={(e) => setSearchCountry(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 mb-2"
                autoFocus
              />
              <div className="max-h-48 overflow-y-auto space-y-1 divide-y divide-slate-800">
                {filteredCountries.map((c) => (
                  <button
                    key={`${c.code}-${c.name}`}
                    type="button"
                    onClick={() => {
                      setSelectedCountry(c);
                      setIsCountryPickerOpen(false);
                      setSearchCountry('');
                    }}
                    className="w-full px-2 py-1.5 flex items-center justify-between text-xs hover:bg-slate-700 rounded-lg text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{c.flag}</span>
                      <span className="text-slate-200">{c.name}</span>
                    </div>
                    <span className="font-mono text-amber-400 font-bold">{c.code}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Save as contact quick prompt */}
          {typedDigits && onSaveAsContact && (
            <div className="pt-1">
              <button
                onClick={() => {
                  onSaveAsContact(fullPhone);
                  onClose();
                }}
                className="text-[11px] text-amber-300 hover:text-amber-200 font-bold inline-flex items-center gap-1 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800"
              >
                <UserPlus className="w-3 h-3" />
                <span>Enregistrer dans les contacts</span>
              </button>
            </div>
          )}

          <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-400 font-mono mt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sécurisé DTLS-SRTP • Opus Audio HD International</span>
          </div>
        </div>

        {/* Dialpad Buttons 0-9, *, # */}
        <div className="p-5 grid grid-cols-3 gap-3 bg-slate-900">
          {[
            { num: '1', sub: '' },
            { num: '2', sub: 'ABC' },
            { num: '3', sub: 'DEF' },
            { num: '4', sub: 'GHI' },
            { num: '5', sub: 'JKL' },
            { num: '6', sub: 'MNO' },
            { num: '7', sub: 'PQRS' },
            { num: '8', sub: 'TUV' },
            { num: '9', sub: 'WXYZ' },
            { num: '*', sub: '' },
            { num: '0', sub: '+' },
            { num: '#', sub: '' },
          ].map((item) => (
            <button
              key={item.num}
              onClick={() => handleKeyPress(item.num)}
              className="h-14 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700/70 flex flex-col items-center justify-center transition-transform active:scale-90"
            >
              <span className="text-xl font-bold text-white">{item.num}</span>
              {item.sub && <span className="text-[9px] text-slate-400 font-semibold tracking-widest">{item.sub}</span>}
            </button>
          ))}
        </div>

        {/* Bottom Actions: Clear / Call Audio / Call Video / Message */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between gap-2">
            {/* Clear button */}
            <button
              onClick={handleDelete}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 flex-shrink-0"
              title="Effacer un chiffre"
            >
              <Delete className="w-5 h-5" />
            </button>

            {/* Audio E2EE Call */}
            <button
              onClick={() => {
                if (!typedDigits) return;
                onStartCall(`Appel ${fullPhone}`, 'audio', fullPhone);
                onClose();
              }}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5 shadow-lg transition-transform active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Audio E2EE</span>
            </button>

            {/* Video E2EE Call */}
            <button
              onClick={() => {
                if (!typedDigits) return;
                onStartCall(`Appel ${fullPhone}`, 'video', fullPhone);
                onClose();
              }}
              className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-95"
              title="Appel Vidéo E2EE"
            >
              <Video className="w-4 h-4" />
            </button>

            {/* Start Chat */}
            {onStartChatWithPhone && (
              <button
                onClick={() => {
                  if (!typedDigits) return;
                  onStartChatWithPhone(fullPhone);
                  onClose();
                }}
                className="p-3 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-95"
                title="Message Chat"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
