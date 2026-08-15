import React, { useState, useEffect } from 'react';
import { User, Language } from '../types';
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
  KeyRound
} from 'lucide-react';

interface WhatsAppAuthFlowProps {
  isOpen: boolean;
  onClose?: () => void;
  currentUser: User;
  onAuthSuccess: (user: User) => void;
  isInitialOnboarding?: boolean;
}

const COUNTRY_LIST = [
  { code: '+223', country: 'Mali', flag: '🇲🇱', example: '76 12 34 56' },
  { code: '+221', country: 'Sénégal', flag: '🇸🇳', example: '77 123 45 67' },
  { code: '+225', country: 'Côte d\'Ivoire', flag: '🇨🇮', example: '07 08 09 10 11' },
  { code: '+224', country: 'Guinée', flag: '🇬🇳', example: '620 12 34 56' },
  { code: '+226', country: 'Burkina Faso', flag: '🇧🇫', example: '70 12 34 56' },
  { code: '+227', country: 'Niger', flag: '🇳🇪', example: '90 12 34 56' },
  { code: '+33', country: 'France', flag: '🇫🇷', example: '06 12 34 56 78' },
  { code: '+1', country: 'États-Unis / Canada', flag: '🇺🇸', example: '202 555 0199' }
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
];

export const WhatsAppAuthFlow: React.FC<WhatsAppAuthFlowProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  isInitialOnboarding = false
}) => {
  const [step, setStep] = useState<'welcome' | 'phone_input' | 'confirm_dialog' | 'otp_verify' | 'profile_setup' | 'initializing'>('phone_input');
  
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_LIST[0]);
  const [phoneDigits, setPhoneDigits] = useState('76 12 34 56');
  const [otpValues, setOtpValues] = useState(['1', '2', '3', '4', '5', '6']);
  const [otpTimer, setOtpTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Profile setup states
  const [displayName, setDisplayName] = useState(currentUser.name || 'Amadou Diallo');
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatar || PRESET_AVATARS[0]);
  const [userBio, setUserBio] = useState(currentUser.bio || 'An ba bo Mali kənə! | En ligne sur KUMA 🇲🇱');
  const [selectedLang, setSelectedLang] = useState<Language>(currentUser.language || 'fr');

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
    if (phoneDigits.replace(/\s+/g, '').length < 6) {
      setErrorMsg('Veuillez entrer un numéro de téléphone valide.');
      return;
    }
    setErrorMsg('');
    setStep('confirm_dialog');
  };

  const handleConfirmPhoneNumber = () => {
    setIsLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp_verify');
      setOtpTimer(30);
      setCanResend(false);
    }, 600);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const updated = [...otpValues];
    updated[index] = val;
    setOtpValues(updated);

    if (val && index < 5) {
      const next = document.getElementById(`wa_otp_${index + 1}`);
      next?.focus();
    }

    // Auto verify if all 6 filled
    if (index === 5 && val && updated.every(d => d !== '')) {
      triggerVerification(updated.join(''));
    }
  };

  const triggerVerification = (codeToVerify?: string) => {
    const code = codeToVerify || otpValues.join('');
    if (code.length < 6) {
      setErrorMsg('Veuillez saisir le code à 6 chiffres.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      // Success -> move to profile setup like WhatsApp
      setStep('profile_setup');
    }, 1000);
  };

  const handleFinishProfileSetup = () => {
    if (!displayName.trim()) {
      setErrorMsg('Veuillez entrer votre nom.');
      return;
    }

    setStep('initializing');

    // Simulate key generation and initialization
    setTimeout(() => {
      const updatedUser: User = {
        id: `user_${phoneDigits.replace(/\D/g, '')}`,
        phone: fullFormattedPhone,
        name: displayName.trim(),
        avatar: selectedAvatar,
        bio: userBio.trim(),
        language: selectedLang,
        online: true,
        publicKey: `ed25519_pk_${Math.random().toString(36).substring(2, 10)}`
      };

      // Save to localStorage
      try {
        localStorage.setItem('kuma_auth_user', JSON.stringify(updatedUser));
      } catch (e) {
        console.error(e);
      }

      onAuthSuccess(updatedUser);
      if (onClose) onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-sm sm:max-w-md w-full overflow-hidden shadow-2xl border border-emerald-700/60 flex flex-col max-h-[94vh]">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 p-4 border-b border-emerald-800 text-center relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 font-black text-sm flex items-center justify-center shadow">
              🇲🇱
            </div>
            <div className="text-left">
              <h2 className="font-extrabold text-sm text-amber-300">Connexion KUMA Mali</h2>
              <p className="text-[10px] text-emerald-200">Authentification Numéro Mobile & E2EE</p>
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

        {/* Dynamic WhatsApp Flow Steps */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="bg-red-950/80 border border-red-500 text-red-200 text-xs p-2.5 rounded-xl text-center font-medium animate-fadeIn">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: PHONE NUMBER INPUT */}
          {step === 'phone_input' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4 animate-fadeIn">
              <div className="text-center space-y-1">
                <h3 className="text-base font-extrabold text-white">Entrez votre numéro de téléphone</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  KUMA va envoyer un SMS contenant un code de confirmation pour vérifier votre numéro.
                </p>
              </div>

              {/* Country Selection dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-400">Pays / Indicatif</label>
                <div className="relative">
                  <select
                    value={selectedCountry.code}
                    onChange={(e) => {
                      const found = COUNTRY_LIST.find((c) => c.code === e.target.value);
                      if (found) setSelectedCountry(found);
                    }}
                    className="w-full bg-slate-800 text-white font-bold text-xs p-3 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none pr-8 cursor-pointer"
                  >
                    {COUNTRY_LIST.map((c) => (
                      <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                        {c.flag} {c.country} ({c.code})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>
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
                <p className="text-[10px] text-slate-400">Exemple au Mali : 76 12 34 56 ou 66 00 11 22</p>
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
                    className="w-10 sm:w-11 h-12 text-center text-xl font-black text-amber-300 bg-slate-800 border-2 border-emerald-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
                  />
                ))}
              </div>

              {/* Helper SMS text */}
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 text-xs flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">
                  Code SMS auto-test : <strong className="text-amber-300 font-mono">123456</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setOtpTimer(30);
                    setCanResend(false);
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

          {/* STEP 4: PROFILE SETUP (NAME, AVATAR, STATUS, LANGUAGE) */}
          {step === 'profile_setup' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center space-y-1">
                <h3 className="text-base font-extrabold text-white">Infos du profil</h3>
                <p className="text-xs text-slate-400">
                  Veuillez fournir votre nom et choisir une photo de profil.
                </p>
              </div>

              {/* Avatar Selector */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <img
                    src={selectedAvatar}
                    alt="Profil"
                    className="w-20 h-20 rounded-full object-cover border-4 border-emerald-500 shadow-xl"
                  />
                  <div className="absolute bottom-0 right-0 p-1.5 bg-amber-400 rounded-full text-emerald-950 shadow">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  {PRESET_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(av)}
                      className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-transform ${
                        selectedAvatar === av ? 'border-amber-400 scale-110 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt="Avatar option" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-400">Votre nom</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Saisissez votre nom ici"
                  required
                  className="w-full bg-slate-800 text-white font-bold text-sm p-3 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[10px] text-slate-400">Ce nom sera visible par vos contacts KUMA.</p>
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
                  Génération des clés de chiffrement de bout en bout (E2EE Signal Protocol).
                </p>
              </div>

              <div className="max-w-xs mx-auto bg-slate-800 p-3 rounded-xl border border-slate-700 text-[11px] text-emerald-300 font-mono">
                ✓ Clé Publique liée au {fullFormattedPhone}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
