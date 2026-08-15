import React, { useState, useEffect, useRef } from 'react';
import { User, Language } from '../types';
import { ALL_INTERNATIONAL_COUNTRIES, CountryInfo } from '../lib/countryCodes';
import { kumaSounds } from '../lib/soundEffects';
import {
  Phone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
  Camera,
  Globe,
  Sparkles,
  UserCheck,
  ChevronDown,
  X,
  MessageSquare,
  KeyRound,
  Search,
  Upload,
  Smile,
  PhoneCall,
  Smartphone
} from 'lucide-react';

interface WhatsAppAuthFlowProps {
  isOpen: boolean;
  onClose?: () => void;
  currentUser: User;
  onAuthSuccess: (user: User) => void;
  isInitialOnboarding?: boolean;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
];

const PRESET_ACTUS = [
  'En ligne sur KUMA 🇲🇱',
  'Toujours disponible',
  'Occupé(e)',
  'À Bamako • KUMA Fast Data',
  'Au travail / En réunion',
  'An ka kuma ! (Discutons)',
  'Appels vocaux Opus E2EE uniquement'
];

const QUICK_NAME_EMOJIS = ['🇲🇱', '🦁', '👑', '⭐', '✨', '⚡', '💼', '🚀'];

export const WhatsAppAuthFlow: React.FC<WhatsAppAuthFlowProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  isInitialOnboarding = false
}) => {
  const [step, setStep] = useState<'welcome' | 'phone_input' | 'confirm_dialog' | 'otp_verify' | 'profile_setup' | 'initializing'>(
    isInitialOnboarding ? 'welcome' : 'phone_input'
  );

  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(ALL_INTERNATIONAL_COUNTRIES[0]);
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [phoneDigits, setPhoneDigits] = useState(currentUser.phone ? currentUser.phone.replace(/^\+\d+\s*/, '') : '76 12 34 56');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Profile setup states
  const [displayName, setDisplayName] = useState(currentUser.name || 'Amadou Diallo');
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatar || PRESET_AVATARS[0]);
  const [userBio, setUserBio] = useState(currentUser.bio || 'An ba bo Mali kənə! | En ligne sur KUMA 🇲🇱');
  const [selectedLang, setSelectedLang] = useState<Language>(currentUser.language || 'fr');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // OTP Countdown timer
  useEffect(() => {
    let interval: any = null;
    if (step === 'otp_verify' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  if (!isOpen) return null;

  const fullFormattedPhone = `${selectedCountry.code} ${phoneDigits.trim()}`;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = phoneDigits.replace(/\s+/g, '');
    if (cleanDigits.length < 6) {
      setErrorMsg('Veuillez saisir un numéro de téléphone valide.');
      return;
    }
    setErrorMsg('');
    kumaSounds.playDialTone(600);
    setStep('confirm_dialog');
  };

  const handleConfirmPhoneNumber = () => {
    setIsLoading(true);
    setErrorMsg('');
    kumaSounds.playSent();
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp_verify');
      setOtpTimer(30);
      setCanResend(false);
      setOtpValues(['1', '2', '3', '4', '5', '6']); // pre-populate with test code for instant flow
    }, 600);
  };

  const handleOtpChange = (index: number, val: string) => {
    // Handle paste event or single digit
    if (val.length > 1) {
      const pasted = val.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otpValues];
      pasted.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtpValues(newOtp);
      if (newOtp.filter(Boolean).length === 6) {
        triggerVerification(newOtp.join(''));
      }
      return;
    }

    const updated = [...otpValues];
    updated[index] = val;
    setOtpValues(updated);

    kumaSounds.playDialTone(700 + index * 50);

    if (val && index < 5) {
      const next = document.getElementById(`wa_otp_${index + 1}`);
      next?.focus();
    }

    // Auto verify if all 6 filled
    if (index === 5 && val && updated.every((d) => d !== '')) {
      triggerVerification(updated.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prev = document.getElementById(`wa_otp_${index - 1}`);
      prev?.focus();
    }
  };

  const triggerVerification = (codeToVerify?: string) => {
    const code = codeToVerify || otpValues.join('');
    if (code.length < 6) {
      setErrorMsg('Veuillez saisir le code complet à 6 chiffres.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    kumaSounds.playReceived();

    setTimeout(() => {
      setIsLoading(false);
      setStep('profile_setup');
    }, 900);
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedAvatar(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFinishProfileSetup = () => {
    if (!displayName.trim()) {
      setErrorMsg('Veuillez entrer votre nom.');
      return;
    }

    setErrorMsg('');
    setStep('initializing');
    kumaSounds.playMoneySuccess();

    // Simulate key generation and initialization (WhatsApp E2EE Keygen)
    setTimeout(() => {
      const cleanNumberId = phoneDigits.replace(/\D/g, '') || `${Date.now()}`.slice(-8);
      const updatedUser: User = {
        id: `user_${cleanNumberId}`,
        phone: fullFormattedPhone,
        name: displayName.trim(),
        avatar: selectedAvatar,
        bio: userBio.trim(),
        language: selectedLang,
        online: true,
        publicKey: `ed25519_pk_${Math.random().toString(36).substring(2, 10)}`
      };

      try {
        localStorage.setItem('kuma_auth_user', JSON.stringify(updatedUser));
        localStorage.setItem('kuma_has_onboarded', 'true');
      } catch (e) {
        console.error(e);
      }

      onAuthSuccess(updatedUser);
      if (onClose) onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-sm sm:max-w-md w-full overflow-hidden shadow-2xl border border-emerald-700/60 flex flex-col max-h-[94vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 p-4 border-b border-emerald-800 text-center relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 font-black text-sm flex items-center justify-center shadow">
              🇲🇱
            </div>
            <div className="text-left">
              <h2 className="font-extrabold text-sm text-amber-300">KUMA - Inscription WhatsApp Flow</h2>
              <p className="text-[10px] text-emerald-200">Numéro Mobile International & E2EE</p>
            </div>
          </div>

          {!isInitialOnboarding && onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-emerald-950/80 text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dynamic WhatsApp Flow Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="bg-red-950/80 border border-red-500 text-red-200 text-xs p-2.5 rounded-xl text-center font-medium animate-fadeIn">
              {errorMsg}
            </div>
          )}

          {/* STEP 0: WELCOME & TERMS */}
          {step === 'welcome' && (
            <div className="space-y-6 text-center py-3 animate-fadeIn">
              <div className="w-24 h-24 rounded-full bg-emerald-950/90 border-2 border-emerald-500 flex items-center justify-center mx-auto shadow-2xl relative">
                <Smartphone className="w-12 h-12 text-amber-300" />
                <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-1.5 shadow">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white">Bienvenue sur KUMA</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                  La messagerie rapide, sécurisée et économique du Mali et du monde.
                </p>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80 text-xs text-slate-300 space-y-2 text-left">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Lock className="w-4 h-4" />
                  <span>Confidentialité & Chiffrement E2EE</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Lisez nos Conditions d'utilisation et notre Politique de confidentialité. Appuyez sur <strong className="text-white">« Accepter et continuer »</strong> pour créer votre compte avec votre numéro de téléphone.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  kumaSounds.playDialTone(800);
                  setStep('phone_input');
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm py-3.5 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <span>ACCEPTER ET CONTINUER</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 1: PHONE NUMBER INPUT */}
          {step === 'phone_input' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4 animate-fadeIn">
              <div className="text-center space-y-1">
                <h3 className="text-base font-extrabold text-white">Entrez votre numéro de téléphone</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  KUMA va envoyer un SMS contenant un code de confirmation pour vérifier votre numéro de téléphone portable.
                </p>
              </div>

              {/* Country Selection dropdown with search */}
              <div className="space-y-1 relative">
                <label className="text-xs font-bold text-emerald-400 flex items-center justify-between">
                  <span>Pays / Indicatif International</span>
                  <span className="text-[10px] text-slate-400">{selectedCountry.region}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCountryPickerOpen(!isCountryPickerOpen)}
                  className="w-full bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs p-3 rounded-xl border border-slate-700 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{selectedCountry.flag}</span>
                    <span>{selectedCountry.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-amber-400">
                    <span>{selectedCountry.code}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                </button>

                {isCountryPickerOpen && (
                  <div className="absolute left-0 right-0 top-16 bg-slate-850 border border-slate-700 rounded-2xl shadow-2xl p-2.5 z-30 text-left space-y-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Rechercher pays ou indicatif..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-1 divide-y divide-slate-800">
                      {ALL_INTERNATIONAL_COUNTRIES.filter(
                        (c) =>
                          c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
                          c.nameEn.toLowerCase().includes(countrySearch.toLowerCase()) ||
                          c.code.includes(countrySearch)
                      ).map((c) => (
                        <button
                          key={`${c.code}-${c.name}`}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(c);
                            setIsCountryPickerOpen(false);
                            setCountrySearch('');
                          }}
                          className={`w-full px-2 py-1.5 flex items-center justify-between text-xs hover:bg-slate-800 rounded-lg text-left ${
                            selectedCountry.name === c.name ? 'bg-emerald-950/80 text-amber-300 font-bold' : 'text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{c.flag}</span>
                            <span>{c.name}</span>
                          </div>
                          <span className="font-mono text-emerald-400 font-bold">{c.code}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Phone Digits Input with Country Flag */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-400">Numéro de téléphone</label>
                <div className="flex gap-2">
                  <div className="bg-slate-800 px-3 py-2.5 rounded-xl border border-slate-700 font-bold text-sm text-amber-300 flex items-center gap-1.5 flex-shrink-0">
                    <span>{selectedCountry.flag}</span>
                    <span>{selectedCountry.code}</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneDigits}
                    onChange={(e) => setPhoneDigits(e.target.value)}
                    placeholder={selectedCountry.example}
                    required
                    autoFocus
                    className="flex-1 bg-slate-800 text-white font-black text-sm p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Exemple ({selectedCountry.name}) : <span className="font-mono font-bold text-amber-300">{selectedCountry.example}</span>
                </p>
              </div>

              <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/80 text-[11px] text-emerald-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Vos messages et appels restent chiffrés de bout en bout (E2EE).</span>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <span>SUIVANT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: WHATSAPP-STYLE NUMBER CONFIRMATION DIALOG */}
          {step === 'confirm_dialog' && (
            <div className="space-y-4 text-center py-2 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
                <Phone className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-sm font-extrabold text-white">Est-ce bien votre numéro ?</h4>
                <p className="text-lg font-black text-amber-300 font-mono tracking-wider">{fullFormattedPhone}</p>
                <p className="text-xs text-slate-400">
                  Un SMS contenant votre code de vérification à 6 chiffres va être envoyé immédiatement.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('phone_input')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-3 rounded-xl transition-colors"
                >
                  MODIFIER
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPhoneNumber}
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>OUI, CONTINUER</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: 6-DIGIT OTP VERIFICATION */}
          {step === 'otp_verify' && (
            <div className="space-y-4 text-center animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-white">Vérification du {fullFormattedPhone}</h3>
                <p className="text-xs text-slate-400">
                  En attente de détection automatique d'un SMS envoyé au <strong className="text-amber-300">{fullFormattedPhone}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setStep('phone_input')}
                  className="text-[11px] text-emerald-400 hover:underline font-bold"
                >
                  Numéro incorrect ?
                </button>
              </div>

              {/* 6 Digit Input Boxes */}
              <div className="flex justify-center gap-1.5 py-1">
                {otpValues.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`wa_otp_${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-10 sm:w-11 h-12 text-center text-xl font-black text-amber-300 bg-slate-800 border-2 border-emerald-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
                  />
                ))}
              </div>

              {/* Helper SMS text */}
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 text-xs flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const testCode = ['1', '2', '3', '4', '5', '6'];
                    setOtpValues(testCode);
                    triggerVerification(testCode.join(''));
                  }}
                  className="text-amber-300 text-[11px] hover:underline font-mono font-bold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Code test : 123456</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpTimer(30);
                    setCanResend(false);
                    kumaSounds.playReceived();
                  }}
                  disabled={!canResend}
                  className={`text-[11px] font-bold ${
                    canResend ? 'text-emerald-400 hover:underline cursor-pointer' : 'text-slate-500'
                  }`}
                >
                  {canResend ? 'Renvoyer SMS' : `Renvoyer (${otpTimer}s)`}
                </button>
              </div>

              <button
                type="button"
                onClick={() => triggerVerification()}
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-amber-300" />
                    <span>VÉRIFIER LE CODE SMS</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 4: PROFILE SETUP (NAME, PHOTO, ACTU, LANGUAGE) */}
          {step === 'profile_setup' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center space-y-1">
                <h3 className="text-base font-extrabold text-white">Infos du profil</h3>
                <p className="text-xs text-slate-400">
                  Veuillez fournir votre nom et choisir une photo de profil.
                </p>
              </div>

              {/* Avatar Selector with Camera Upload */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <img
                    src={selectedAvatar}
                    alt="Profil"
                    className="w-20 h-20 rounded-full object-cover border-4 border-emerald-500 shadow-xl"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-amber-400 hover:bg-amber-300 rounded-full text-emerald-950 shadow-lg transition-transform active:scale-90"
                    title="Changer photo de profil"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCustomImageUpload}
                    className="hidden"
                  />
                </div>

                <div className="flex flex-wrap justify-center gap-1.5 pt-1 max-w-xs">
                  {PRESET_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(av)}
                      className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-transform ${
                        selectedAvatar === av ? 'border-amber-400 scale-110 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt="Avatar option" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input with Emojis */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-emerald-400">Votre nom</label>
                  <span className="text-[10px] text-slate-400">{displayName.length}/25</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={displayName}
                    maxLength={25}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Saisissez votre nom ici"
                    required
                    className="w-full bg-slate-800 text-white font-bold text-sm p-3 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10"
                  />
                  <div className="absolute right-2.5 top-3 flex items-center gap-1">
                    <Smile className="w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex gap-1.5 pt-1 overflow-x-auto pb-1">
                  {QUICK_NAME_EMOJIS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => {
                        if (displayName.length < 23) setDisplayName((prev) => `${prev} ${em}`);
                      }}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-750 text-xs rounded-lg border border-slate-700"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status / Actu */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-400">Statut / Actu</label>
                <input
                  type="text"
                  value={userBio}
                  onChange={(e) => setUserBio(e.target.value)}
                  placeholder="Actu KUMA"
                  className="w-full bg-slate-800 text-slate-200 text-xs p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex flex-wrap gap-1 pt-1">
                  {PRESET_ACTUS.slice(0, 3).map((actu) => (
                    <button
                      key={actu}
                      type="button"
                      onClick={() => setUserBio(actu)}
                      className="text-[10px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md border border-slate-700"
                    >
                      {actu}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  Langue de l'interface
                </label>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value as Language)}
                  className="w-full bg-slate-800 text-white font-bold text-xs p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="fr">🇫🇷 Français</option>
                  <option value="bm">🇲🇱 Bamanankan (Bambara)</option>
                  <option value="ff">🇲🇱 Fulfulde (Peul)</option>
                  <option value="sn">🇲🇱 Soninké</option>
                  <option value="tm">🇲🇱 Tamasheq</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleFinishProfileSetup}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <span>COMMENCER SUR KUMA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 5: INITIALIZING E2EE KEYS */}
          {step === 'initializing' && (
            <div className="text-center py-8 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 relative">
                <RefreshCw className="w-8 h-8 animate-spin" />
                <Sparkles className="w-4 h-4 text-amber-400 absolute top-1 right-1" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-white">Initialisation de votre compte...</h3>
                <p className="text-xs text-slate-300">
                  Veuillez patienter quelques instants. Configuration du chiffrement DTLS-SRTP.
                </p>
              </div>

              <div className="max-w-xs mx-auto bg-slate-800 p-3 rounded-xl border border-slate-700 text-[11px] text-emerald-300 font-mono space-y-1">
                <div>✓ Clé Signal E2EE générée</div>
                <div>✓ Compte lié au {fullFormattedPhone}</div>
                <div>✓ Profil synchronisé en temps réel</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
