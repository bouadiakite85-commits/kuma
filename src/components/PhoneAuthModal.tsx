import React, { useState, useEffect } from 'react';
import { PhoneAuthService } from '../lib/firebase';
import { Language } from '../types';
import { translations } from '../data/translations';
import {
  X,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Smartphone
} from 'lucide-react';

interface PhoneAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentPhone: string;
  onLoginSuccess: (phone: string, userName: string) => void;
}

const COUNTRY_CODES = [
  { code: '+223', country: 'Mali 🇲🇱', flag: '🇲🇱' },
  { code: '+225', country: 'Côte d\'Ivoire 🇨🇮', flag: '🇨🇮' },
  { code: '+221', country: 'Sénégal 🇸🇳', flag: '🇸🇳' },
  { code: '+224', country: 'Guinée 🇬🇳', flag: '🇬🇳' },
  { code: '+226', country: 'Burkina Faso 🇧🇫', flag: '🇧🇫' },
  { code: '+33', country: 'France 🇫🇷', flag: '🇫🇷' },
];

export const PhoneAuthModal: React.FC<PhoneAuthModalProps> = ({
  isOpen,
  onClose,
  language,
  currentPhone,
  onLoginSuccess
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [selectedCountryCode, setSelectedCountryCode] = useState('+223');
  const [phoneNumber, setPhoneNumber] = useState(currentPhone ? currentPhone.replace(/^\+\d+\s?/, '') : '76 12 34 56');
  const [otpCode, setOtpCode] = useState(['1', '2', '3', '4', '5', '6']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    let timer: any;
    if (step === 'otp' && resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  const fullPhoneNumber = `${selectedCountryCode} ${phoneNumber.trim()}`;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (phoneNumber.trim().length < 6) {
      setErrorMessage("Veuillez saisir un numéro de téléphone valide.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await PhoneAuthService.sendOtpSms(fullPhoneNumber);
      if (res.success) {
        setVerificationId(res.verificationId);
        setStep('otp');
        setResendTimer(30);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage("Erreur lors de l'envoi du SMS de vérification.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const codeStr = otpCode.join('');
    if (codeStr.length < 6) {
      setErrorMessage("Veuillez saisir le code à 6 chiffres.");
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await PhoneAuthService.verifyOtpCode(verificationId, codeStr);
      if (res.success) {
        setStep('success');
        setTimeout(() => {
          onLoginSuccess(fullPhoneNumber, 'Utilisateur KUMA Mali');
          onClose();
        }, 1200);
      } else {
        setErrorMessage("Code OTP incorrect. Réessayez avec 123456.");
      }
    } catch (err) {
      setErrorMessage("Erreur de vérification du code SMS.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto-advance
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp_input_${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white p-5 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 font-black text-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
            🇲🇱
          </div>
          <h2 className="text-lg font-bold">Connexion KUMA Mali</h2>
          <p className="text-xs text-emerald-200 mt-0.5">Authentification sécurisée par SMS (+223)</p>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {errorMessage && (
            <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200 text-center font-medium">
              {errorMessage}
            </div>
          )}

          {/* STEP 1: PHONE NUMBER INPUT */}
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  Numéro de Téléphone Mobile
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedCountryCode}
                    onChange={(e) => setSelectedCountryCode(e.target.value)}
                    className="bg-slate-100 text-slate-800 text-xs font-bold p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>

                  <input
                    type="tel"
                    placeholder="76 12 34 56"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 bg-slate-50 text-slate-900 font-bold text-sm p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
                <span className="font-bold flex items-center gap-1 text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Sécurité SMS Firebase OTP
                </span>
                <p className="text-slate-600 leading-tight">
                  Un code de vérification à 6 chiffres sera envoyé gratuitement par SMS sur votre numéro malien.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Envoyer le Code OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: OTP SMS VERIFICATION */}
          {step === 'otp' && (
            <div className="space-y-4 text-center">
              <div>
                <span className="text-xs text-slate-500">Code SMS envoyé au :</span>
                <p className="text-sm font-extrabold text-emerald-900 font-mono">{fullPhoneNumber}</p>
                <button
                  onClick={() => setStep('phone')}
                  className="text-[11px] text-emerald-700 hover:underline mt-0.5"
                >
                  Modifier le numéro
                </button>
              </div>

              {/* 6 Digit OTP Inputs */}
              <div className="flex justify-center gap-1.5 my-2">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp_input_${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-10 h-12 text-center text-lg font-black text-emerald-950 bg-slate-100 border-2 border-emerald-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                ))}
              </div>

              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>Code démo par défaut: <strong className="text-emerald-800 font-mono">123456</strong></span>
                <button
                  onClick={() => setResendTimer(30)}
                  disabled={resendTimer > 0}
                  className="text-emerald-700 hover:underline disabled:text-slate-400 font-medium"
                >
                  {resendTimer > 0 ? `Renvoyer (${resendTimer}s)` : 'Renvoyer SMS'}
                </button>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-amber-300" />
                    <span>Valider et Se Connecter</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 3: SUCCESS STATE */}
          {step === 'success' && (
            <div className="text-center py-6 space-y-3 animate-fadeIn">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="text-base font-extrabold text-slate-900">Connexion Réussie !</h3>
              <p className="text-xs text-slate-600">Bienvenue sur KUMA Mali, votre compte est vérifié.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
