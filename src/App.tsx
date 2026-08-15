import React, { useState, useEffect, useRef } from 'react';
import {
  Chat,
  Message,
  Language,
  NetworkMode,
  DataSavingMode,
  MessageType,
  StatusStory,
  CallLog,
  CallSession,
  User,
  Contact
} from './types';
import { currentUser as defaultUser, mockChats, mockStatuses, mockCalls, mockContacts } from './data/mockData';
import { Header } from './components/Header';
import { ChatList } from './components/ChatList';
import { ChatRoom } from './components/ChatRoom';
import { ContactsScreen } from './components/ContactsScreen';
import { MobileMoneyModal } from './components/MobileMoneyModal';
import { CallsScreen } from './components/CallsScreen';
import { StatusesScreen } from './components/StatusesScreen';
import { ArchitectureSchemaViewer } from './components/ArchitectureSchemaViewer';
import { CallOverlay } from './components/CallOverlay';
import { GroupInfoModal } from './components/GroupInfoModal';
import { WhatsAppAuthFlow } from './components/WhatsAppAuthFlow';
import { PhoneDialerModal } from './components/PhoneDialerModal';
import { InstallAppModal } from './components/InstallAppModal';
import { OfflineBanner } from './components/OfflineBanner';
import { OfflineOutboxModal } from './components/OfflineOutboxModal';
import { KumaAutonomousModal } from './components/KumaAutonomousModal';
import { kumaP2P, KumaP2PPacket } from './lib/kumaAutonomousP2P';
import { kumaOfflineQueue, QueuedOfflineItem } from './lib/offlineQueue';
import { kumaSounds } from './lib/soundEffects';

const ALL_MOCK_USERS: User[] = [
  defaultUser,
  {
    id: 'user_oumou',
    phone: '+223 76 99 88 77',
    name: 'Oumou Traoré',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Bambara teacher • KUMA Mali',
    language: 'bm',
    online: true,
    publicKey: 'pk_kuma_oumou_2026'
  },
  {
    id: 'user_bakary',
    phone: '+223 66 44 22 11',
    name: 'Bakary Coulibaly',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Bamako Grin Admin',
    language: 'fr',
    online: true,
    publicKey: 'pk_kuma_bakary_2026'
  },
  {
    id: 'user_fatou',
    phone: '+223 70 88 99 00',
    name: 'Fatoumata Diallo',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    bio: 'Peul Artisan • Segou',
    language: 'ff',
    online: false,
    publicKey: 'pk_kuma_fatou_2026'
  }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<'chats' | 'contacts' | 'status' | 'calls' | 'architecture'>('chats');
  const [language, setLanguage] = useState<Language>('fr');
  const [networkMode, setNetworkMode] = useState<NetworkMode>('3g');
  const [dataSavingMode, setDataSavingMode] = useState<DataSavingMode>('low_data');

  // Authenticated User State with localStorage persistence
  const [authenticatedUser, setAuthenticatedUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('kuma_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return defaultUser;
  });

  // Save auth user
  useEffect(() => {
    try {
      localStorage.setItem('kuma_auth_user', JSON.stringify(authenticatedUser));
    } catch (e) {
      console.error(e);
    }
  }, [authenticatedUser]);

  // Real-time Contacts List State with localStorage persistence
  const [contacts, setContacts] = useState<Contact[]>(() => {
    try {
      const saved = localStorage.getItem('kuma_contacts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return mockContacts;
  });

  // Save contacts to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem('kuma_contacts', JSON.stringify(contacts));
    } catch (e) {
      console.error(e);
    }
  }, [contacts]);

  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [activeChatId, setActiveChatId] = useState<string | null>('chat_1');
  const [statusesList, setStatusesList] = useState<StatusStory[]>(mockStatuses);

  // Active WebRTC call session state
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);

  // Modals state
  const [isPhoneAuthOpen, setIsPhoneAuthOpen] = useState(false);
  const [isDialerOpen, setIsDialerOpen] = useState(false);
  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isAutonomousModalOpen, setIsAutonomousModalOpen] = useState(false);
  const [isOutboxModalOpen, setIsOutboxModalOpen] = useState(false);
  const [isMobileMoneyOpen, setIsMobileMoneyOpen] = useState(false);
  const [mobileMoneyRecipient, setMobileMoneyRecipient] = useState({ name: 'Oumou Traoré', phone: '+223 76 99 88 77' });

  // Offline queue state
  const [queuedOfflineItems, setQueuedOfflineItems] = useState<QueuedOfflineItem[]>([]);
  const [discoveredNodesCount, setDiscoveredNodesCount] = useState<number>(0);

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalledApp, setIsInstalledApp] = useState(false);

  // Messages database indexed by chatId with local persistence
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(() => {
    try {
      const saved = localStorage.getItem('kuma_messages_db');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      chat_1: [
        {
          id: 'm_100',
          chatId: 'chat_1',
          senderId: 'user_oumou',
          type: 'text',
          content: 'I ni sogoma Amadou ! I ka kene ?',
          timestamp: '10:30',
          status: 'read',
          encrypted: true
        },
        {
          id: 'm_101',
          chatId: 'chat_1',
          senderId: 'user_me',
          type: 'text',
          content: 'Bonjour Oumou, oui ça va très bien. Je suis en train d\'utiliser KUMA en toute autonomie.',
          timestamp: '10:35',
          status: 'read',
          encrypted: true
        },
        {
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
      ],
      chat_2: [
        {
          id: 'm_201',
          chatId: 'chat_2',
          senderId: 'user_bakary',
          type: 'text',
          content: 'An ka Grin bɛ da wuli bi su fe Badalabougou tea shop kan!',
          timestamp: '09:15',
          status: 'read',
          encrypted: true
        }
      ],
      chat_3: [
        {
          id: 'm_301',
          chatId: 'chat_3',
          senderId: 'user_me',
          type: 'mobile_money',
          timestamp: 'Hier',
          status: 'read',
          encrypted: true,
          mobileMoney: {
            provider: 'orange',
            amountFcfa: 25000,
            recipientPhone: '+223 70 88 99 00',
            recipientName: 'Fatoumata Diallo',
            transactionRef: 'OM-88492019',
            status: 'completed',
            note: 'Paiement artisanat bogolan'
          }
        }
      ],
      chat_4: [
        {
          id: 'm_401',
          chatId: 'chat_4',
          senderId: 'user_moussa',
          type: 'image',
          content: 'Bogolan du marché de Medina Coura',
          mediaUrl: 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=500&auto=format&fit=crop&q=80',
          timestamp: 'Hier',
          status: 'read',
          originalSizeKb: 3400,
          transferredSizeKb: 120,
          encrypted: true
        }
      ],
      chat_5: [
        {
          id: 'm_501',
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
      ]
    };
  });

  // Save messages to local database
  useEffect(() => {
    try {
      localStorage.setItem('kuma_messages_db', JSON.stringify(messagesMap));
    } catch (e) {
      console.error(e);
    }
  }, [messagesMap]);

  // Subscribe to offline queue
  useEffect(() => {
    const unsub = kumaOfflineQueue.subscribe((items) => {
      setQueuedOfflineItems(items);
    });
    return unsub;
  }, []);

  // Initialize KUMA Autonomous P2P Protocol
  useEffect(() => {
    kumaP2P.init(authenticatedUser, networkMode);

    const unsubP2P = kumaP2P.subscribe((packet: KumaP2PPacket) => {
      handleIncomingP2PPacket(packet);
    });

    const nodeInterval = setInterval(() => {
      setDiscoveredNodesCount(kumaP2P.getDiscoveredNodes().length);
    }, 2000);

    return () => {
      unsubP2P();
      clearInterval(nodeInterval);
    };
  }, [authenticatedUser]);

  // Update P2P network mode & auto-flush when network is restored
  useEffect(() => {
    kumaP2P.setNetworkMode(networkMode);

    if (networkMode !== 'offline' && kumaOfflineQueue.getQueueCount() > 0) {
      flushOfflineQueue();
    }
  }, [networkMode]);

  // Capture PWA beforeinstallprompt event for Android / Chrome install button
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalledApp(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalledApp(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Handle incoming Autonomous P2P Packets
  const handleIncomingP2PPacket = (packet: KumaP2PPacket) => {
    switch (packet.type) {
      case 'MESSAGE_RECEIVED': {
        const incomingMsg: Message = packet.payload.message;
        if (!incomingMsg) return;

        const targetChatId = incomingMsg.chatId || 'chat_1';
        setMessagesMap((prev) => ({
          ...prev,
          [targetChatId]: [...(prev[targetChatId] || []), { ...incomingMsg, status: 'delivered' }]
        }));

        setChats((prev) =>
          prev.map((c) =>
            c.id === targetChatId
              ? { ...c, lastMessage: incomingMsg, unreadCount: c.id === activeChatId ? 0 : c.unreadCount + 1 }
              : c
          )
        );

        kumaP2P.sendAck(packet.senderUser.id, incomingMsg.id, 'delivered');
        break;
      }

      case 'MESSAGE_ACK': {
        const { messageId, status } = packet.payload;
        if (!messageId) return;

        setMessagesMap((prev) => {
          const updated = { ...prev };
          for (const key in updated) {
            updated[key] = updated[key].map((m) =>
              m.id === messageId ? { ...m, status } : m
            );
          }
          return updated;
        });
        break;
      }

      case 'TYPING': {
        const { isTyping } = packet.payload;
        setChats((prev) =>
          prev.map((c) =>
            c.participantIds.includes(packet.senderUser.id) || c.participantIds.includes(packet.senderUser.phone)
              ? { ...c, isTyping, typingUserName: packet.senderUser.name }
              : c
          )
        );
        break;
      }

      case 'CALL_OFFER': {
        const { callSession } = packet.payload;
        if (callSession) {
          setActiveCall({
            ...callSession,
            direction: 'incoming',
            status: 'ringing'
          });
        }
        break;
      }

      case 'CALL_ANSWER': {
        setActiveCall((prev) => (prev ? { ...prev, status: 'connected', iceConnectionState: 'completed' } : null));
        break;
      }

      case 'CALL_HANGUP': {
        setActiveCall(null);
        break;
      }

      case 'STATUS_NEW': {
        const { story } = packet.payload;
        if (story) {
          setStatusesList((prev) => [story, ...prev.filter((s) => s.id !== story.id)]);
        }
        break;
      }

      default:
        break;
    }
  };

  // Flush offline queue when reconnected or via Mesh relay
  const flushOfflineQueue = async () => {
    return kumaOfflineQueue.flushQueue(async (item) => {
      const targetChat = chats.find((c) => c.id === item.chatId) || chats[0];
      const targetRecipientId = targetChat.participantIds.find((id) => id !== authenticatedUser.id) || 'user_oumou';

      // Send via Autonomous P2P Protocol
      kumaP2P.sendMessage(targetRecipientId, item.message);

      // Update message status in local database
      setMessagesMap((prev) => ({
        ...prev,
        [item.chatId]: (prev[item.chatId] || []).map((m) =>
          m.id === item.message.id ? { ...m, status: 'sent' } : m
        )
      }));

      return true;
    });
  };

  // Switch authenticated profile for testing KUMA ↔ KUMA autonomy
  const handleSwitchUser = (newUser: User) => {
    setAuthenticatedUser(newUser);
    setLanguage(newUser.language || 'fr');
    kumaP2P.init(newUser, networkMode);
  };

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];
  const activeMessages = activeChatId ? messagesMap[activeChatId] || [] : [];
  const unreadTotal = chats.reduce((acc, c) => acc + c.unreadCount, 0);

  // CONTACTS MANAGEMENT HANDLERS (Real-Time CRUD)
  const handleAddContact = (newContactData: Omit<Contact, 'id' | 'addedAt'>) => {
    const newContact: Contact = {
      ...newContactData,
      id: `contact_${Date.now()}`,
      addedAt: 'À l\'instant'
    };
    setContacts((prev) => [newContact, ...prev]);
  };

  const handleUpdateContact = (updatedContact: Contact) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === updatedContact.id ? updatedContact : c))
    );
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== contactId));
  };

  const handleResetSampleContacts = () => {
    setContacts(mockContacts);
  };

  // Start Call WebRTC Session with E2EE Security
  const handleStartCall = (type: 'audio' | 'video', customPeerName?: string, customPhone?: string, customPeerAvatar?: string) => {
    const peerName = customPeerName || activeChat.name;
    const peerAvatar = customPeerAvatar || activeChat.avatar;
    const peerPhone = customPhone || activeChat.participantIds.find((id) => id !== authenticatedUser.id) || '+223 76 99 88 77';

    const newCallSession: CallSession = {
      id: `call_${Date.now()}`,
      peerName,
      peerAvatar,
      peerPhone,
      type,
      status: 'calling',
      direction: 'outgoing',
      isMuted: false,
      isVideoOff: type === 'audio',
      isSpeakerOn: true,
      isFrontCamera: true,
      bitrateKbps: networkMode === '2g' ? 8 : networkMode === 'infinig' ? 256 : 32,
      packetsLostPercentage: networkMode === 'infinig' ? 0.0 : 0.1,
      iceConnectionState: 'checking',
      codec: networkMode === 'infinig' ? 'Opus Studio Lossless 48kHz (∞G Infini)' : networkMode === '2g' ? 'Opus 8kbps (Mali 2G)' : 'Opus 24kbps / H.264',
      isEncrypted: true,
      encryptionProtocol: 'DTLS-SRTP (256-bit AES-GCM)',
      securityFingerprint: '8F:4A:9C:21:E0:77',
      sasWords: ['🇲🇱 Mali', '🦁 Lion', '🛡️ Bouclier', '⚡ Rapid']
    };

    setActiveCall(newCallSession);

    // Broadcast call offer to peer KUMA instance
    kumaP2P.sendCallOffer(peerPhone, newCallSession);

    // Auto connect fallback if peer in same tab or sandbox
    setTimeout(() => {
      setActiveCall((prev) => (prev ? { ...prev, status: 'connected', iceConnectionState: 'completed' } : null));
    }, 1800);
  };

  // Start chat with a contact from the Contacts screen
  const handleStartChatWithContact = (contact: Contact) => {
    const existing = chats.find(
      (c) =>
        c.name.toLowerCase() === contact.name.toLowerCase() ||
        (c.participantIds && c.participantIds.includes(contact.phone))
    );

    if (existing) {
      setActiveChatId(existing.id);
      setCurrentTab('chats');
    } else {
      const newChatId = `chat_${Date.now()}`;
      const newChat: Chat = {
        id: newChatId,
        isGroup: false,
        name: contact.name,
        avatar: contact.avatar,
        unreadCount: 0,
        pinned: false,
        participantIds: [authenticatedUser.id, contact.phone]
      };
      setChats([newChat, ...chats]);
      setActiveChatId(newChatId);
      setCurrentTab('chats');
    }
  };

  // Open or create a chat with a dialed phone number
  const handleStartChatWithPhone = (phone: string) => {
    const existing = chats.find((c) => c.name.includes(phone) || (c.participantIds && c.participantIds.includes(phone)));
    if (existing) {
      setActiveChatId(existing.id);
      setCurrentTab('chats');
    } else {
      const knownContact = contacts.find((c) => c.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, ''));
      const newChatId = `chat_${Date.now()}`;
      const newChat: Chat = {
        id: newChatId,
        isGroup: false,
        name: knownContact ? knownContact.name : `Contact (${phone})`,
        avatar: knownContact ? knownContact.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        unreadCount: 0,
        pinned: false,
        participantIds: [authenticatedUser.id, phone]
      };
      setChats([newChat, ...chats]);
      setActiveChatId(newChatId);
      setCurrentTab('chats');
    }
  };

  // Send message handler with offline Outbox queue, real-time sound effects, and P2P transmission
  const handleSendMessage = (type: MessageType, content?: string, extraData?: any) => {
    if (!activeChatId) return;

    const isOffline = networkMode === 'offline';
    const newMsgId = `m_${Date.now()}`;
    const newMsg: Message = {
      id: newMsgId,
      chatId: activeChatId,
      senderId: authenticatedUser.id,
      type,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: isOffline ? 'pending_offline' : 'sent',
      encrypted: true,
      replyTo: extraData?.replyTo,
      ...(type === 'voice' && { voiceNote: extraData }),
      ...(type === 'mobile_money' && { mobileMoney: extraData })
    };

    // Sound effect on send
    if (type === 'mobile_money') {
      kumaSounds.playMoneySuccess();
    } else {
      kumaSounds.playSent();
    }

    // Save to local message state
    setMessagesMap((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg]
    }));

    // Update last message in chat list
    setChats((prevChats) =>
      prevChats.map((c) => {
        if (c.id === activeChatId) {
          return {
            ...c,
            lastMessage: newMsg,
            unreadCount: 0
          };
        }
        return c;
      })
    );

    // If offline, enqueue into local Outbox queue
    if (isOffline) {
      kumaOfflineQueue.enqueueMessage(
        activeChatId,
        newMsg,
        activeChat.name,
        activeChat.participantIds.find((id) => id !== authenticatedUser.id)
      );
      return;
    }

    // Real-time progressive delivery receipt transition: sent -> delivered (✓✓)
    setTimeout(() => {
      setMessagesMap((prev) => ({
        ...prev,
        [activeChatId]: (prev[activeChatId] || []).map((m) =>
          m.id === newMsgId ? { ...m, status: 'delivered' } : m
        )
      }));
    }, 350);

    // Broadcast via KUMA Autonomous P2P
    const targetRecipientId = activeChat.participantIds.find((id) => id !== authenticatedUser.id) || 'user_oumou';
    kumaP2P.sendMessage(targetRecipientId, newMsg);

    // Local simulated peer reply for live interactive experience
    const typingDelay = networkMode === 'infinig' ? 200 : 700;
    const replyDelay = networkMode === 'infinig' ? 600 : 2000;

    // Contact starts typing -> mark user's message as read (blue ✓✓)
    setTimeout(() => {
      setMessagesMap((prev) => ({
        ...prev,
        [activeChatId]: (prev[activeChatId] || []).map((m) =>
          m.id === newMsgId ? { ...m, status: 'read' } : m
        )
      }));

      setChats((prevChats) =>
        prevChats.map((c) =>
          c.id === activeChatId ? { ...c, isTyping: true, typingUserName: activeChat.name } : c
        )
      );
    }, typingDelay);

    setTimeout(() => {
      setChats((prevChats) =>
        prevChats.map((c) =>
          c.id === activeChatId ? { ...c, isTyping: false } : c
        )
      );

      // Generate dynamic response based on sent message
      let replyText = "Bien reçu ! L'application KUMA communique en direct et de manière fluide.";
      if (type === 'mobile_money') {
        replyText = language === 'bm'
          ? "I ni ce kosɛbɛ ! Wari sara kɛra kɛnɛ kan (Mobile Money sɛbɛn sera)."
          : `Merci beaucoup ! J'ai bien reçu la notification de transfert de ${extraData?.amountFcfa?.toLocaleString()} FCFA.`;
      } else if (type === 'voice') {
        replyText = language === 'bm'
          ? "N ye i ka kuma-lama mɛn ! A kɛra kɛnɛ kan Opus 8kbps la."
          : "J'ai bien écouté ta note vocale ! Le son Opus HD est super clair même en 2G.";
      } else if (language === 'bm') {
        replyText = "Aw ni ce ! KUMA bɛ taa ka ɲɛ Mali kənə baro la.";
      } else if (networkMode === 'infinig') {
        replyText = "⚡ Reçu instantanément via le protocole autonome KUMA (∞G Quantique) !";
      }

      const replyMsg: Message = {
        id: `m_reply_${Date.now()}`,
        chatId: activeChatId,
        senderId: targetRecipientId,
        type: 'text',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
        encrypted: true
      };

      setMessagesMap((prev) => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), replyMsg]
      }));

      // Sound and vibration when receiving reply
      kumaSounds.playReceived();
    }, replyDelay);
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!activeChatId) return;
    setMessagesMap((prev) => ({
      ...prev,
      [activeChatId]: (prev[activeChatId] || []).map((m) =>
        m.id === messageId ? { ...m, deletedForEveryone: true } : m
      )
    }));
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    if (!activeChatId) return;
    setMessagesMap((prev) => ({
      ...prev,
      [activeChatId]: (prev[activeChatId] || []).map((m) => {
        if (m.id === messageId) {
          const currentReactions = m.reactions || [];
          const existing = currentReactions.find((r) => r.emoji === emoji);
          if (existing) {
            return {
              ...m,
              reactions: currentReactions.map((r) =>
                r.emoji === emoji ? { ...r, count: r.count + 1 } : r
              )
            };
          }
          return {
            ...m,
            reactions: [...currentReactions, { emoji, count: 1, userIds: [authenticatedUser.id] }]
          };
        }
        return m;
      })
    }));
  };

  const handleMobileMoneyConfirm = (provider: 'orange' | 'moov' | 'wave', amountFcfa: number, note?: string) => {
    if (!activeChatId) return;

    handleSendMessage('mobile_money', undefined, {
      provider,
      amountFcfa,
      recipientPhone: mobileMoneyRecipient.phone,
      recipientName: mobileMoneyRecipient.name,
      transactionRef: `${provider.toUpperCase()}-${Math.floor(Math.random() * 899999 + 100000)}`,
      status: 'completed',
      note
    });
  };

  const openMobileMoneyForRecipient = (phone: string, name: string) => {
    setMobileMoneyRecipient({ name, phone });
    setIsMobileMoneyOpen(true);
  };

  const handleAddStatus = (newStatus: Omit<StatusStory, 'id' | 'viewsCount'>) => {
    const created: StatusStory = {
      ...newStatus,
      id: `story_${Date.now()}`,
      viewsCount: 1
    };
    setStatusesList([created, ...statusesList]);
    kumaP2P.shareStatus(created);
  };

  return (
    <div className="w-full h-screen bg-slate-950 flex justify-center items-center font-sans antialiased">
      {/* Mobile Device Frame Simulator */}
      <div className="w-full max-w-4xl h-full sm:h-[94vh] bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-800 relative">
        {/* App Bar Header */}
        <Header
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          language={language}
          setLanguage={setLanguage}
          networkMode={networkMode}
          setNetworkMode={setNetworkMode}
          dataSavingMode={dataSavingMode}
          setDataSavingMode={setDataSavingMode}
          unreadTotal={unreadTotal}
          contactsCount={contacts.length}
          openSettings={() => setCurrentTab('architecture')}
          openMobileMoney={() => openMobileMoneyForRecipient('+223 76 00 00 00', activeChat.name)}
          currentUserPhone={authenticatedUser.phone}
          currentUserName={authenticatedUser.name}
          openPhoneAuth={() => setIsPhoneAuthOpen(true)}
          openDialer={() => setIsDialerOpen(true)}
          openInstallModal={() => setIsInstallModalOpen(true)}
          openAutonomousModal={() => setIsAutonomousModalOpen(true)}
          openOutboxModal={() => setIsOutboxModalOpen(true)}
          queuedCount={queuedOfflineItems.length}
          discoveredNodesCount={discoveredNodesCount}
        />

        {/* Offline Status & Outbox Banner */}
        <OfflineBanner
          networkMode={networkMode}
          queuedCount={queuedOfflineItems.length}
          queuedSizeKb={kumaOfflineQueue.getTotalQueuedSizeKb()}
          onOpenOutbox={() => setIsOutboxModalOpen(true)}
          onOpenMeshModal={() => setIsAutonomousModalOpen(true)}
          onReconnect={() => setNetworkMode('3g')}
          language={language}
        />

        {/* Main Body View based on activeTab */}
        <div className="flex-1 overflow-hidden relative">
          {/* Chats View */}
          {currentTab === 'chats' && (
            <div className="h-full flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200">
              {/* Chat List */}
              <div className={`w-full md:w-80 h-full ${activeChatId ? 'hidden md:block' : 'block'}`}>
                <ChatList
                  chats={chats}
                  activeChatId={activeChatId}
                  onSelectChat={(id) => {
                    setActiveChatId(id);
                    setChats((prev) =>
                      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
                    );
                  }}
                  language={language}
                  networkMode={networkMode}
                  onNewChat={() => {
                    setCurrentTab('contacts');
                  }}
                />
              </div>

              {/* Chat Room */}
              <div className={`flex-1 h-full ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
                {activeChat ? (
                  <ChatRoom
                    chat={activeChat}
                    messages={activeMessages}
                    onSendMessage={handleSendMessage}
                    onDeleteMessage={handleDeleteMessage}
                    onAddReaction={handleAddReaction}
                    language={language}
                    networkMode={networkMode}
                    dataSavingMode={dataSavingMode}
                    onBack={() => setActiveChatId(null)}
                    openMobileMoneyForRecipient={openMobileMoneyForRecipient}
                    onStartCall={(type) => handleStartCall(type)}
                    onOpenGroupInfo={activeChat.isGroup ? () => setIsGroupInfoOpen(true) : undefined}
                  />
                ) : (
                  <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                    <p className="text-xs">Sélectionnez une discussion pour démarrer sur KUMA</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contacts Management View */}
          {currentTab === 'contacts' && (
            <ContactsScreen
              contacts={contacts}
              language={language}
              onAddContact={handleAddContact}
              onUpdateContact={handleUpdateContact}
              onDeleteContact={handleDeleteContact}
              onStartChatWithContact={handleStartChatWithContact}
              onStartCall={(contactName, type, phone, avatar) =>
                handleStartCall(type, contactName, phone, avatar)
              }
              onOpenMobileMoney={openMobileMoneyForRecipient}
              onResetSampleContacts={handleResetSampleContacts}
            />
          )}

          {/* Status Stories View */}
          {currentTab === 'status' && (
            <StatusesScreen
              statuses={statusesList}
              language={language}
              onAddStatus={handleAddStatus}
            />
          )}

          {/* Call Logs View */}
          {currentTab === 'calls' && (
            <CallsScreen
              calls={mockCalls}
              language={language}
              onStartCall={(contactName, type) => handleStartCall(type, contactName)}
              onOpenDialer={() => setIsDialerOpen(true)}
            />
          )}

          {/* Architecture & DB View */}
          {currentTab === 'architecture' && <ArchitectureSchemaViewer />}
        </div>
      </div>

      {/* WebRTC Active Call Overlay */}
      <CallOverlay
        callSession={activeCall}
        onEndCall={() => {
          if (activeCall) kumaP2P.sendCallHangup(activeCall.peerPhone, activeCall.id);
          setActiveCall(null);
        }}
        onAcceptCall={() => {
          if (activeCall) kumaP2P.sendCallAnswer(activeCall.peerPhone, activeCall.id);
          setActiveCall((prev) => (prev ? { ...prev, status: 'connected', iceConnectionState: 'completed' } : null));
        }}
        networkMode={networkMode}
      />

      {/* Phone Authentication & Onboarding Flow */}
      <WhatsAppAuthFlow
        isOpen={isPhoneAuthOpen}
        onClose={() => setIsPhoneAuthOpen(false)}
        currentUser={authenticatedUser}
        onAuthSuccess={(user) => {
          setAuthenticatedUser(user);
          setLanguage(user.language || 'fr');
        }}
      />

      {/* Universal Install App Modal for All Devices */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onInstalledSuccess={() => setIsInstalledApp(true)}
      />

      {/* Keypad Dialer Modal */}
      <PhoneDialerModal
        isOpen={isDialerOpen}
        onClose={() => setIsDialerOpen(false)}
        language={language}
        onStartCall={(contactName, type, phone) => handleStartCall(type, contactName, phone)}
        onStartChatWithPhone={handleStartChatWithPhone}
        onSaveAsContact={(phone) => {
          setCurrentTab('contacts');
        }}
      />

      {/* Group Info & Admin Management Modal */}
      {isGroupInfoOpen && activeChat && activeChat.isGroup && (
        <GroupInfoModal
          chat={activeChat}
          allUsers={ALL_MOCK_USERS}
          onClose={() => setIsGroupInfoOpen(false)}
          onUpdateGroup={(updated) => {
            setChats((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
          }}
        />
      )}

      {/* Mobile Money Quick Transfer Modal */}
      <MobileMoneyModal
        isOpen={isMobileMoneyOpen}
        onClose={() => setIsMobileMoneyOpen(false)}
        language={language}
        recipientName={mobileMoneyRecipient.name}
        recipientPhone={mobileMoneyRecipient.phone}
        onConfirmTransfer={handleMobileMoneyConfirm}
      />

      {/* Offline Outbox Queue Modal */}
      <OfflineOutboxModal
        isOpen={isOutboxModalOpen}
        onClose={() => setIsOutboxModalOpen(false)}
        queuedItems={queuedOfflineItems}
        onForceSendAll={async () => {
          await flushOfflineQueue();
        }}
        onRemoveItem={(msgId) => kumaOfflineQueue.removeFromQueue(msgId)}
        onClearQueue={() => kumaOfflineQueue.clearQueue()}
        onSwitchOnline={() => setNetworkMode('3g')}
        networkMode={networkMode}
        language={language}
      />

      {/* Autonomous KUMA ↔ KUMA P2P & Mesh Modal */}
      <KumaAutonomousModal
        isOpen={isAutonomousModalOpen}
        onClose={() => setIsAutonomousModalOpen(false)}
        currentUser={authenticatedUser}
        allPresetUsers={ALL_MOCK_USERS}
        onSwitchUser={handleSwitchUser}
        networkMode={networkMode}
        queuedCount={queuedOfflineItems.length}
        onRelayViaMesh={async () => {
          await flushOfflineQueue();
          setIsAutonomousModalOpen(false);
        }}
      />
    </div>
  );
}
