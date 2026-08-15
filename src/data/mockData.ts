import { Chat, User, Contact, StatusStory, CallLog, TableSchema } from '../types';

export const mockContacts: Contact[] = [
  {
    id: 'contact_oumou',
    name: 'Oumou Diarra',
    phone: '+223 76 12 34 56',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Enseignante Bamanankan • Bamako',
    category: 'ami',
    isFavorite: true,
    online: true,
    addedAt: '10 Août 2026'
  },
  {
    id: 'contact_bakary',
    name: 'Bakary Coulibaly',
    phone: '+223 66 44 22 11',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Badalabougou • Grin du soir ☕',
    category: 'ami',
    isFavorite: true,
    online: true,
    addedAt: '12 Août 2026'
  },
  {
    id: 'contact_fatou',
    name: 'Fatoumata Traoré',
    phone: '+223 70 88 99 00',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    bio: 'Commerce Bogolan & Tissus Médina Coura',
    category: 'commerce',
    isFavorite: false,
    online: false,
    lastSeen: 'Hier à 19:40',
    addedAt: '05 Août 2026'
  },
  {
    id: 'contact_sory',
    name: 'Sory Keita',
    phone: '+223 75 33 22 11',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    bio: 'Famille Keita Ségou • Disponible',
    category: 'famille',
    isFavorite: true,
    online: true,
    addedAt: '01 Août 2026'
  },
  {
    id: 'contact_drissa',
    name: 'Drissa Camara',
    phone: '+223 78 90 12 34',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    bio: 'Ingénieur Télécom Mali • KUMA Tech',
    category: 'travail',
    isFavorite: false,
    online: true,
    addedAt: '14 Août 2026'
  },
  {
    id: 'contact_aminata',
    name: 'Aminata Maïga',
    phone: '+223 65 43 21 00',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bio: 'Gao & Bamako • Santé Communautaire',
    category: 'travail',
    isFavorite: false,
    online: false,
    lastSeen: 'Il y a 2h',
    addedAt: '08 Août 2026'
  },
  {
    id: 'contact_mahamadou',
    name: 'Mahamadou Koné',
    phone: '+223 71 22 33 44',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    bio: 'Transfert d\'argent & Kiosque Orange/Moov/Wave',
    category: 'commerce',
    isFavorite: false,
    online: true,
    addedAt: '03 Août 2026'
  }
];

export const currentUser: User = {
  id: 'user_me',
  phone: '+223 76 12 34 56',
  name: 'Amadou Diallo',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  bio: 'An ba bo Mali kənə! | En paix au Mali 🇲🇱',
  language: 'fr',
  online: true,
  publicKey: 'ed25519_pk_7a9f...3e21'
};

export const mockChats: Chat[] = [
  {
    id: 'chat_1',
    isGroup: false,
    name: 'Oumou Diarra',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    unreadCount: 2,
    pinned: true,
    participantIds: ['user_me', 'user_oumou'],
    lastMessage: {
      id: 'm_1',
      chatId: 'chat_1',
      senderId: 'user_oumou',
      type: 'voice',
      timestamp: '10:42',
      status: 'delivered',
      originalSizeKb: 1420,
      transferredSizeKb: 68,
      encrypted: true,
      voiceNote: {
        durationSeconds: 24,
        audioSizeKb: 68,
        compressedSizeKb: 18,
        transcriptBambara: 'I ni sogoma! Wari sara fɛn bɛ ka ɲɛ Orange Money kan?',
        transcriptFrench: 'Bonjour ! Est-ce que le virement Orange Money a bien été effectué ?',
        waveform: [20, 45, 80, 60, 90, 30, 70, 85, 40, 95, 60, 30, 50, 80, 40]
      }
    }
  },
  {
    id: 'chat_2',
    isGroup: true,
    name: 'Grin des Jeunes de Bamako 🇲🇱',
    bambaraTitle: 'Bamako Kamalenw ka Grin',
    avatar: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=150&auto=format&fit=crop&q=80',
    unreadCount: 5,
    pinned: true,
    participantIds: ['user_me', 'user_bakary', 'user_sory', 'user_fatou'],
    groupAdminIds: ['user_me', 'user_bakary'],
    lastMessage: {
      id: 'm_2',
      chatId: 'chat_2',
      senderId: 'user_bakary',
      type: 'text',
      content: 'An ka Grin bɛ da wuli bi su fe Badalabougou tea shop kan!',
      timestamp: '09:15',
      status: 'read',
      encrypted: true
    }
  },
  {
    id: 'chat_3',
    isGroup: false,
    name: 'Bakary Coulibaly',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    unreadCount: 0,
    pinned: false,
    participantIds: ['user_me', 'user_bakary'],
    lastMessage: {
      id: 'm_3',
      chatId: 'chat_3',
      senderId: 'user_me',
      type: 'mobile_money',
      timestamp: 'Hier',
      status: 'read',
      encrypted: true,
      mobileMoney: {
        provider: 'orange',
        amountFcfa: 15000,
        recipientPhone: '+223 66 44 22 11',
        recipientName: 'Bakary Coulibaly',
        transactionRef: 'OM20260813-88912',
        status: 'completed',
        note: 'SARA / Remboursement Thé'
      }
    }
  },
  {
    id: 'chat_4',
    isGroup: false,
    name: 'Fatoumata Traoré',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    unreadCount: 0,
    pinned: false,
    participantIds: ['user_me', 'user_fatou'],
    lastMessage: {
      id: 'm_4',
      chatId: 'chat_4',
      senderId: 'user_fatou',
      type: 'image',
      content: 'Bogolan du marché de Medina Coura',
      mediaUrl: 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=500&auto=format&fit=crop&q=80',
      timestamp: 'Hier',
      status: 'read',
      originalSizeKb: 3400,
      transferredSizeKb: 120, // compressed in 2G/3G low data mode
      encrypted: true
    }
  },
  {
    id: 'chat_5',
    isGroup: true,
    name: 'Famille Keita & Co (Ségou)',
    avatar: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=150&auto=format&fit=crop&q=80',
    unreadCount: 1,
    pinned: false,
    participantIds: ['user_me', 'user_sory', 'user_oumou'],
    groupAdminIds: ['user_sory'],
    lastMessage: {
      id: 'm_5',
      chatId: 'chat_5',
      senderId: 'user_sory',
      type: 'voice',
      timestamp: '11/08',
      status: 'read',
      encrypted: true,
      voiceNote: {
        durationSeconds: 42,
        audioSizeKb: 110,
        compressedSizeKb: 32,
        transcriptBambara: 'Ségou kibaru duman bɛ yen, an bɛ Sambanyali kɛ bi su fɛ.',
        transcriptFrench: 'Bonnes nouvelles de Ségou, nous célébrons ce soir.',
        waveform: [10, 30, 70, 90, 40, 60, 80, 50, 90, 100, 40, 20, 50, 80]
      }
    }
  }
];

export const mockStatuses: StatusStory[] = [
  {
    id: 's_1',
    userId: 'user_oumou',
    userName: 'Oumou Diarra',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    timestamp: 'Il y a 2h',
    type: 'image',
    content: 'Marché Rose de Bamako ce matin 🌞',
    mediaUrl: 'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=600&auto=format&fit=crop&q=80',
    viewsCount: 34,
    expiresInHours: 22
  },
  {
    id: 's_2',
    userId: 'user_bakary',
    userName: 'Bakary Coulibaly',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    timestamp: 'Il y a 5h',
    type: 'voice',
    content: 'Note vocale publique : N\'oubliez pas la réunion du Grin !',
    voiceDuration: 18,
    viewsCount: 52,
    expiresInHours: 19
  }
];

export const mockCalls: CallLog[] = [
  {
    id: 'c_1',
    contactId: 'user_oumou',
    contactName: 'Oumou Diarra',
    contactAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    type: 'audio',
    direction: 'incoming',
    timestamp: 'Aujourd\'hui, 10:15',
    duration: '4 min 12s',
    dataUsedKb: 240, // 8 kbps Opus low-data mode
    codec: 'opus_8kbps'
  },
  {
    id: 'c_2',
    contactId: 'user_bakary',
    contactName: 'Bakary Coulibaly',
    contactAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    type: 'video',
    direction: 'outgoing',
    timestamp: 'Hier, 18:30',
    duration: '1 min 45s',
    dataUsedKb: 1850,
    codec: 'h264_low'
  }
];

export const kumaDatabaseSchema: TableSchema[] = [
  {
    tableName: 'users',
    description: 'Comptes utilisateurs authentifiés par numéro de téléphone (Mali +223)',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'Identifiant unique de l\'utilisateur' },
      { name: 'phone_number', type: 'VARCHAR(20)', description: 'Numéro au format E.164 (+223...)' },
      { name: 'phone_verified_at', type: 'TIMESTAMP', description: 'Horodatage de la validation OTP SMS' },
      { name: 'display_name', type: 'VARCHAR(100)', description: 'Nom affiché dans l\'application' },
      { name: 'avatar_url', type: 'TEXT', description: 'Lien vers l\'image de profil compressée WebP' },
      { name: 'preferred_language', type: 'VARCHAR(5)', description: 'Langue: fr, bm, ff, sn, tm' },
      { name: 'public_identity_key', type: 'TEXT', description: 'Clé publique Signal Protocol (E2EE)' },
      { name: 'created_at', type: 'TIMESTAMP', description: 'Date de création du compte' }
    ]
  },
  {
    tableName: 'messages',
    description: 'Messages chiffrés de bout en bout avec métadonnées de transfert Low-Data',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'ID unique du message' },
      { name: 'chat_id', type: 'UUID', isForeign: true, references: 'chats.id', description: 'ID de la conversation ou du groupe' },
      { name: 'sender_id', type: 'UUID', isForeign: true, references: 'users.id', description: 'Auteur du message' },
      { name: 'msg_type', type: 'VARCHAR(20)', description: 'text, voice, image, video, mobile_money' },
      { name: 'encrypted_payload', type: 'BYTEA / TEXT', description: 'Contenu chiffré par la clé de session E2EE' },
      { name: 'media_blob_url', type: 'TEXT', description: 'URL du média hautement compressé (Opus 8k/WebP)' },
      { name: 'original_size_bytes', type: 'INTEGER', description: 'Taille originale avant compression' },
      { name: 'compressed_size_bytes', type: 'INTEGER', description: 'Taille transférée sur le réseau 2G/3G' },
      { name: 'delivery_status', type: 'VARCHAR(20)', description: 'pending, sent, delivered, read' },
      { name: 'sent_at', type: 'TIMESTAMP', description: 'Horodatage d\'envoi d\'origine (synchro offline)' }
    ]
  },
  {
    tableName: 'voice_notes',
    description: 'Métadonnées avancées et transcriptions intelligentes des notes vocales',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'ID de la note vocale' },
      { name: 'message_id', type: 'UUID', isForeign: true, references: 'messages.id', description: 'Rattaché au message' },
      { name: 'duration_seconds', type: 'INTEGER', description: 'Durée exacte en secondes' },
      { name: 'audio_codec', type: 'VARCHAR(20)', description: 'opus_8kbps, opus_16kbps' },
      { name: 'waveform_data', type: 'JSONB', description: 'Tableau de hauteurs pour le rendu visuel' },
      { name: 'transcript_bm', type: 'TEXT', description: 'Transcription automatique IA en Bambara' },
      { name: 'transcript_fr', type: 'TEXT', description: 'Traduction automatique IA en Français' }
    ]
  },
  {
    tableName: 'chats',
    description: 'Espaces de discussion individuels ou de groupes',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'ID de la discussion' },
      { name: 'is_group', type: 'BOOLEAN', description: 'Vrai si groupe, faux si discussion privée' },
      { name: 'title', type: 'VARCHAR(150)', description: 'Nom du groupe (si is_group = true)' },
      { name: 'avatar_url', type: 'TEXT', description: 'Photo de profil du groupe' },
      { name: 'created_by', type: 'UUID', isForeign: true, references: 'users.id', description: 'Créateur du groupe' },
      { name: 'created_at', type: 'TIMESTAMP', description: 'Date de création' }
    ]
  },
  {
    tableName: 'group_members',
    description: 'Gestion des membres et rôles d\'administration de groupes',
    columns: [
      { name: 'group_id', type: 'UUID', isPrimary: true, isForeign: true, references: 'chats.id', description: 'ID du groupe' },
      { name: 'user_id', type: 'UUID', isPrimary: true, isForeign: true, references: 'users.id', description: 'ID de l\'utilisateur' },
      { name: 'role', type: 'VARCHAR(20)', description: 'admin, member' },
      { name: 'joined_at', type: 'TIMESTAMP', description: 'Date d\'arrivée dans le groupe' }
    ]
  },
  {
    tableName: 'mobile_money_shortcuts',
    description: 'Transactions et demandes de paiements intégrées (Orange, Moov, Wave)',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'ID de la transaction' },
      { name: 'message_id', type: 'UUID', isForeign: true, references: 'messages.id', description: 'Rattaché au message de discussion' },
      { name: 'provider', type: 'VARCHAR(20)', description: 'orange_money, moov_money, wave' },
      { name: 'amount_fcfa', type: 'NUMERIC(12,2)', description: 'Montant en Francs CFA' },
      { name: 'recipient_phone', type: 'VARCHAR(20)', description: 'Numéro du destinataire' },
      { name: 'status', type: 'VARCHAR(20)', description: 'pending, completed, failed' },
      { name: 'transaction_ref', type: 'VARCHAR(100)', description: 'Référence officielle du service Mobile Money' }
    ]
  }
];
