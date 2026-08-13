import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { X, ArrowRightLeft, CheckCircle2, ShieldCheck, Wallet } from 'lucide-react';

interface MobileMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  recipientName?: string;
  recipientPhone?: string;
  onConfirmTransfer: (provider: 'orange' | 'moov' | 'wave', amountFcfa: number, note?: string) => void;
}

export const MobileMoneyModal: React.FC<MobileMoneyModalProps> = ({
  isOpen,
  onClose,
  language,
  recipientName = "Bakary Coulibaly",
  recipientPhone = "+223 76 12 34 56",
  onConfirmTransfer
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const [provider, setProvider] = useState<'orange' | 'moov' | 'wave'>('orange');
  const [amount, setAmount] = useState<string>('5000');
  const [note, setNote] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSend = () => {
    const numAmount = parseFloat(amount) || 0;
    if (numAmount <= 0) return;

    setIsSuccess(true);
    setTimeout(() => {
      onConfirmTransfer(provider, numAmount, note);
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="bg-emerald-950 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-emerald-950 flex items-center justify-center font-bold">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-emerald-100">Raccourci Mobile Money Mali</h3>
              <p className="text-[11px] text-emerald-300">Transfert direct sans quitter KUMA</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="font-black text-lg text-slate-900">Transfert Effectué !</h4>
            <p className="text-xs text-slate-600">
              {amount} FCFA ont été envoyés à {recipientName} ({recipientPhone}) via{' '}
              <span className="font-bold uppercase text-amber-700">{provider} Money</span>.
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Recipient Details */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Destinataire :</span>
                <span className="font-bold text-slate-900 text-sm">{recipientName}</span>
                <span className="text-slate-500 block text-[11px]">{recipientPhone}</span>
              </div>
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>

            {/* Provider Selection */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                Choix de l'opérateur Mobile Money Mali :
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setProvider('orange')}
                  className={`p-2.5 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                    provider === 'orange'
                      ? 'bg-orange-500 text-white border-orange-600 shadow-md scale-102'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <span>Orange Money</span>
                  <span className="text-[9px] opacity-80">Mali #144#</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('moov')}
                  className={`p-2.5 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                    provider === 'moov'
                      ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-102'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <span>Moov Money</span>
                  <span className="text-[9px] opacity-80">Moov Africa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('wave')}
                  className={`p-2.5 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                    provider === 'wave'
                      ? 'bg-cyan-500 text-slate-950 border-cyan-600 shadow-md scale-102'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <span>Wave Mali</span>
                  <span className="text-[9px] opacity-80">0% Frais</span>
                </button>
              </div>
            </div>

            {/* Amount input */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">
                Montant à envoyer (FCFA) :
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-3 pr-16 py-2.5 bg-slate-100 font-extrabold text-base text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <span className="absolute right-3 top-3 text-xs font-black text-slate-500">FCFA</span>
              </div>
            </div>

            {/* Quick Amount Chips */}
            <div className="flex gap-2 text-xs">
              {['2000', '5000', '10000', '25000'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setAmount(chip)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium border border-slate-200 text-[11px]"
                >
                  +{parseInt(chip).toLocaleString()} F
                </button>
              ))}
            </div>

            {/* Note Input */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">
                Motif du transfert (Optionnel) :
              </label>
              <input
                type="text"
                placeholder="Ex: Thé, Marché, Remboursement..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 bg-slate-100 text-xs text-slate-800 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Confirm Send Button */}
            <button
              onClick={handleSend}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black rounded-xl text-sm shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              <span>Valider le transfert {parseInt(amount || '0').toLocaleString()} FCFA</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
