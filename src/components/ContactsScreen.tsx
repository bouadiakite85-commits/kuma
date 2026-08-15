import React, { useState } from 'react';
import { Contact, Language, NetworkMode } from '../types';
import { translations } from '../data/translations';
import {
  Search,
  UserPlus,
  Phone,
  Video,
  MessageSquare,
  ArrowDownUp,
  Star,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  Users,
  Smartphone,
  Tag,
  RotateCcw
} from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+223', country: 'Mali', flag: '🇲🇱' },
  { code: '+221', country: 'Sénégal', flag: '🇸🇳' },
  { code: '+225', country: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: '+224', country: 'Guinée', flag: '🇬🇳' },
  { code: '+226', country: 'Burkina Faso', flag: '🇧🇫' },
  { code: '+227', country: 'Niger', flag: '🇳🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸' }
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
];

interface ContactsScreenProps {
  contacts: Contact[];
  language: Language;
  onAddContact: (contact: Omit<Contact, 'id' | 'addedAt'>) => void;
  onUpdateContact: (contact: Contact) => void;
  onDeleteContact: (id: string) => void;
  onStartChatWithContact: (contact: Contact) => void;
  onStartCall: (contactName: string, type: 'audio' | 'video', phone?: string, avatar?: string) => void;
  onOpenMobileMoney: (phone: string, name: string) => void;
  onResetSampleContacts?: () => void;
}

export const ContactsScreen: React.FC<ContactsScreenProps> = ({
  contacts,
  language,
  onAddContact,
  onUpdateContact,
  onDeleteContact,
  onStartChatWithContact,
  onStartCall,
  onOpenMobileMoney,
  onResetSampleContacts
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'favoris' | 'famille' | 'travail' | 'ami' | 'commerce'>('all');

  // Modal State for Add / Edit Contact
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('+223');
  const [rawPhone, setRawPhone] = useState('');
  const [bio, setBio] = useState('');
  const [category, setCategory] = useState<'famille' | 'travail' | 'ami' | 'commerce' | 'autre'>('ami');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [formError, setFormError] = useState('');

  const resetForm = () => {
    setName('');
    setSelectedCountryCode('+223');
    setRawPhone('');
    setBio('');
    setCategory('ami');
    setSelectedAvatar(PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)]);
    setIsFavorite(false);
    setFormError('');
    setEditingContact(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (contact: Contact) => {
    setEditingContact(contact);
    setName(contact.name);
    // Parse phone and code
    const matchedCode = COUNTRY_CODES.find((c) => contact.phone.startsWith(c.code));
    if (matchedCode) {
      setSelectedCountryCode(matchedCode.code);
      setRawPhone(contact.phone.replace(matchedCode.code, '').trim());
    } else {
      setSelectedCountryCode('+223');
      setRawPhone(contact.phone);
    }
    setBio(contact.bio || '');
    setCategory(contact.category || 'ami');
    setSelectedAvatar(contact.avatar);
    setIsFavorite(!!contact.isFavorite);
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Veuillez renseigner le nom du contact.');
      return;
    }
    const cleanPhoneDigits = rawPhone.replace(/\s+/g, '');
    if (!cleanPhoneDigits || cleanPhoneDigits.length < 6) {
      setFormError('Veuillez renseigner un numéro de téléphone valide.');
      return;
    }

    const fullPhone = `${selectedCountryCode} ${rawPhone.trim()}`;

    if (editingContact) {
      onUpdateContact({
        ...editingContact,
        name: name.trim(),
        phone: fullPhone,
        avatar: selectedAvatar,
        bio: bio.trim() || 'Utilisateur KUMA Mali',
        category,
        isFavorite
      });
    } else {
      onAddContact({
        name: name.trim(),
        phone: fullPhone,
        avatar: selectedAvatar,
        bio: bio.trim() || 'Disponible sur KUMA Mali',
        category,
        isFavorite,
        online: true
      });
    }

    setIsAddModalOpen(false);
    resetForm();
  };

  // Filter contacts in real-time
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.bio && c.bio.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeCategory === 'favoris') return c.isFavorite;
    if (activeCategory === 'all') return true;
    return c.category === activeCategory;
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header and Search */}
      <div className="p-3 bg-white border-b border-slate-200 shadow-xs flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>{t.contacts}</span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                {contacts.length} enregistrés
              </span>
            </h2>
            <p className="text-[11px] text-slate-500">
              {language === 'bm'
                ? "Mɔgɔ kura fara n'i ka welew kɛ teliman"
                : "Ajoutez vos correspondants pour discuter et envoyer de l'argent"}
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-md transition-all active:scale-95 border border-emerald-600 flex-shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Nouveau Contact</span>
          </button>
        </div>

        {/* Real-time search bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, numéro (+223...) ou actu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-100 text-slate-900 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter categories pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-emerald-800 text-white font-bold'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Tous ({contacts.length})
          </button>
          <button
            onClick={() => setActiveCategory('favoris')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
              activeCategory === 'favoris'
                ? 'bg-amber-500 text-emerald-950 font-bold'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Star className="w-3 h-3 fill-current" />
            Favoris ({contacts.filter((c) => c.isFavorite).length})
          </button>
          <button
            onClick={() => setActiveCategory('famille')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'famille'
                ? 'bg-emerald-800 text-white font-bold'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            👨‍👩‍👧 Famille
          </button>
          <button
            onClick={() => setActiveCategory('travail')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'travail'
                ? 'bg-emerald-800 text-white font-bold'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            💼 Travail
          </button>
          <button
            onClick={() => setActiveCategory('ami')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'ami'
                ? 'bg-emerald-800 text-white font-bold'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            🤝 Amis
          </button>
          <button
            onClick={() => setActiveCategory('commerce')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'commerce'
                ? 'bg-emerald-800 text-white font-bold'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            🛍️ Commerce
          </button>
        </div>
      </div>

      {/* Contacts Cards List in Real-Time */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredContacts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500">
            <Users className="w-12 h-12 text-slate-300 mb-2" />
            <p className="font-semibold text-sm text-slate-700">Aucun contact trouvé</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              {searchQuery
                ? `Aucun résultat pour "${searchQuery}".`
                : 'Votre carnet de contacts est actuellement vide.'}
            </p>
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={handleOpenAdd}
                className="bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-sm hover:bg-emerald-800"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Ajouter un contact
              </button>
              {onResetSampleContacts && (
                <button
                  onClick={onResetSampleContacts}
                  className="bg-slate-200 text-slate-800 font-medium px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 hover:bg-slate-300"
                >
                  <RotateCcw className="w-3 h-3" />
                  Recharger exemples
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              {/* Left Side: Avatar + Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative flex-shrink-0">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-xs"
                  />
                  {contact.online ? (
                    <span
                      className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"
                      title="En ligne sur KUMA"
                    />
                  ) : (
                    <span
                      className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-slate-400 border-2 border-white rounded-full"
                      title="Hors-ligne"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 truncate">{contact.name}</h3>
                    {contact.isFavorite && (
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
                    )}
                    {contact.category && (
                      <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200 uppercase flex-shrink-0">
                        {contact.category}
                      </span>
                    )}
                  </div>

                  {/* Phone number */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono mt-0.5">
                    <Smartphone className="w-3 h-3 text-emerald-600" />
                    <span className="font-semibold">{contact.phone}</span>
                  </div>

                  {/* Bio/Status */}
                  {contact.bio && (
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{contact.bio}</p>
                  )}
                </div>
              </div>

              {/* Right Side: Instant Real-Time Actions */}
              <div className="flex items-center justify-end gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
                {/* Send Message / Open Chat */}
                <button
                  onClick={() => onStartChatWithContact(contact)}
                  className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1.5 rounded-xl text-xs transition-colors border border-emerald-200 shadow-xs"
                  title="Ouvrir la discussion"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="hidden xs:inline">Message</span>
                </button>

                {/* Audio Call */}
                <button
                  onClick={() => onStartCall(contact.name, 'audio', contact.phone, contact.avatar)}
                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl transition-colors border border-emerald-200 shadow-xs"
                  title="Appel Audio WebRTC E2EE"
                >
                  <Phone className="w-4 h-4 text-emerald-700" />
                </button>

                {/* Video Call */}
                <button
                  onClick={() => onStartCall(contact.name, 'video', contact.phone, contact.avatar)}
                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl transition-colors border border-emerald-200 shadow-xs"
                  title="Appel Vidéo WebRTC E2EE"
                >
                  <Video className="w-4 h-4 text-emerald-700" />
                </button>

                {/* Send Mobile Money */}
                <button
                  onClick={() => onOpenMobileMoney(contact.phone, contact.name)}
                  className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl transition-colors border border-amber-200 shadow-xs"
                  title="Transférer Mobile Money (Orange, Moov, Wave)"
                >
                  <ArrowDownUp className="w-4 h-4 text-amber-700" />
                </button>

                {/* Toggle Favorite */}
                <button
                  onClick={() => onUpdateContact({ ...contact, isFavorite: !contact.isFavorite })}
                  className={`p-1.5 rounded-xl transition-colors border shadow-xs ${
                    contact.isFavorite
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-400 border-slate-200'
                  }`}
                  title={contact.isFavorite ? 'Retirer des favoris' : 'Mettre en favori'}
                >
                  <Star className={`w-3.5 h-3.5 ${contact.isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
                </button>

                {/* Edit */}
                <button
                  onClick={() => handleOpenEdit(contact)}
                  className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors border border-slate-200"
                  title="Modifier le contact"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => {
                    if (window.confirm(`Supprimer ${contact.name} de vos contacts ?`)) {
                      onDeleteContact(contact.id);
                    }
                  }}
                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors border border-rose-200"
                  title="Supprimer le contact"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADD / EDIT CONTACT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-scale-up">
            {/* Modal Header */}
            <div className="bg-emerald-950 p-4 text-white flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-amber-300">
                    {editingContact ? 'Modifier le Contact' : 'Nouveau Contact KUMA'}
                  </h3>
                  <p className="text-[11px] text-emerald-300">
                    Enregistrement instantané en temps réel
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetForm();
                }}
                className="p-1.5 rounded-full hover:bg-emerald-900 text-emerald-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveContact} className="p-4 space-y-3.5">
              {formError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-2.5 rounded-xl font-medium">
                  {formError}
                </div>
              )}

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Photo de profil
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(url)}
                      className={`relative flex-shrink-0 w-11 h-11 rounded-full overflow-hidden border-2 transition-all ${
                        selectedAvatar === url
                          ? 'border-emerald-600 scale-105 shadow-md ring-2 ring-emerald-300'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="avatar option" className="w-full h-full object-cover" />
                      {selectedAvatar === url && (
                        <div className="absolute inset-0 bg-emerald-600/30 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white font-bold" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom et Prénom *
                </label>
                <input
                  type="text"
                  placeholder="ex: Oumou Traoré, Bakary..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white font-medium"
                  required
                />
              </div>

              {/* Phone Number with Country Flag Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Numéro de Téléphone *
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedCountryCode}
                    onChange={(e) => setSelectedCountryCode(e.target.value)}
                    className="px-2.5 py-2 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} ({c.country})
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    placeholder="76 12 34 56"
                    value={rawPhone}
                    onChange={(e) => setRawPhone(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Format Mali : 8 chiffres (Orange: 7x/8x/9x, Moov: 6x, etc.)
                </p>
              </div>

              {/* Category & Favorite */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="ami">🤝 Ami(e)</option>
                    <option value="famille">👨‍👩‍👧 Famille</option>
                    <option value="travail">💼 Travail / Pro</option>
                    <option value="commerce">🛍️ Commerce / Marché</option>
                    <option value="autre">📌 Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Favori ⭐</label>
                  <button
                    type="button"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isFavorite
                        ? 'bg-amber-100 text-amber-900 border-amber-400'
                        : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
                    <span>{isFavorite ? 'En Favori' : 'Non Favori'}</span>
                  </button>
                </div>
              </div>

              {/* Bio / Note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Statut / Note personnelle (Optionnel)
                </label>
                <input
                  type="text"
                  placeholder="ex: Artisan Médina Coura, Cousin..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingContact ? 'Enregistrer les modifications' : 'Ajouter le Contact'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
