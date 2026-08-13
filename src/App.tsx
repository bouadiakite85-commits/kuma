import React, { useState } from 'react';
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
  User
} from './types';
import { currentUser, mockChats, mockStatuses, mockCalls } from './data/mockData';
import { Header } from './components/Header';
import { ChatList } from './components/ChatList';
import { ChatRoom } from './components/ChatRoom';
import { MobileMoneyModal } from './components/MobileMoneyModal';
import { CallsScreen } from './components/CallsScreen';
import { StatusesScreen } from './components/StatusesScreen';
import { ArchitectureSchemaViewer } from './components/ArchitectureSchemaViewer';
import { CallOverlay } from './components/CallOverlay';
import { GroupInfoModal } from './components/GroupInfoModal';

const ALL_MOCK_USERS: User[] = [
  currentUser,
  {
    id: 'user_oumou',
    phone: '+223 76 12 34 56',
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
  const [currentTab, setCurrentTab] = useState<'chats' | 'status' | 'calls' | 'architecture'>('chats');
  const [language, setLanguage] = useState<Language>('fr');
  const [networkMode, setNetworkMode] = useState<NetworkMode>('3g');
  const [dataSavingMode, setDataSavingMode] = useState<DataSavingMode>('low_data');

  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [activeChatId, setActiveChatId] = useState<string | null>('chat_1');
  const [statusesList, setStatusesList] = useState<StatusStory[]>(mockStatuses);

  // Active WebRTC call session state
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);

  // Group Info Modal state
  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);

  // Messages database indexed by chatId
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({
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
        content: 'Bonjour Oumou, oui ça va très bien. Je suis en train d\'utiliser KUMA en mode Low-Data.',
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
          amountFcfa: 15000,
          recipientPhone: '+223 66 44 22 11',
          recipientName: 'Bakary Coulibaly',
          transactionRef: 'OM20260813-88912',
          status: 'completed',
          note: 'SARA / Remboursement Thé'
        }
      }
    ],
    chat_4: [
      {
        id: 'm_401',
        chatId: 'chat_4',
        senderId: 'user_fatou',
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
  });

  // Mobile Money Modal state
  const [isMobileMoneyOpen, setIsMobileMoneyOpen] = useState(false);
  const [mobileMoneyRecipient, setMobileMoneyRecipient] = useState({ name: 'Oumou Diarra', phone: '+223 76 12 34 56' });

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];
  const activeMessages = activeChatId ? messagesMap[activeChatId] || [] : [];

  const unreadTotal = chats.reduce((acc, c) => acc + c.unreadCount, 0);

  // Start Call WebRTC Session
  const handleStartCall = (type: 'audio' | 'video', customPeerName?: string, customPeerAvatar?: string) => {
    const peerName = customPeerName || activeChat.name;
    const peerAvatar = customPeerAvatar || activeChat.avatar;

    setActiveCall({
      id: `call_${Date.now()}`,
      peerName,
      peerAvatar,
      peerPhone: '+223 76 12 34 56',
      type,
      status: 'calling',
      direction: 'outgoing',
      isMuted: false,
      isVideoOff: type === 'audio',
      isSpeakerOn: true,
      isFrontCamera: true,
      bitrateKbps: networkMode === '2g' ? 8 : 24,
      packetsLostPercentage: 0.1,
      iceConnectionState: 'checking',
      codec: networkMode === '2g' ? 'Opus 8kbps (Mali 2G)' : 'Opus 24kbps / H.264'
    });

    // Simulate WebRTC connection after 1.8 seconds
    setTimeout(() => {
      setActiveCall((prev) => (prev ? { ...prev, status: 'connected', iceConnectionState: 'completed' } : null));
    }, 1800);
  };

  // Send message handler with network/offline simulation
  const handleSendMessage = (type: MessageType, content?: string, extraData?: any) => {
    if (!activeChatId) return;

    const newMsg: Message = {
      id: `m_${Date.now()}`,
      chatId: activeChatId,
      senderId: 'user_me',
      type,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: networkMode === 'offline' ? 'pending_offline' : 'sent',
      encrypted: true,
      replyTo: extraData?.replyTo,
      ...(type === 'voice' && { voiceNote: extraData }),
      ...(type === 'mobile_money' && { mobileMoney: extraData })
    };

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

    // Simulate recipient typing indicator and reply
    if (networkMode !== 'offline') {
      setTimeout(() => {
        setChats((prevChats) =>
          prevChats.map((c) =>
            c.id === activeChatId ? { ...c, isTyping: true, typingUserName: activeChat.name } : c
          )
        );
      }, 800);

      setTimeout(() => {
        setChats((prevChats) =>
          prevChats.map((c) =>
            c.id === activeChatId ? { ...c, isTyping: false } : c
          )
        );

        const replyMsg: Message = {
          id: `m_reply_${Date.now()}`,
          chatId: activeChatId,
          senderId: activeChat.participantIds.find((id) => id !== 'user_me') || 'user_oumou',
          type: 'text',
          content: language === 'bm' ? "Aw ni ce ! Kuma bɛ taa ka ɲɛ Mali kənə." : "Bien reçu ! La messagerie KUMA fonctionne parfaitement.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read',
          encrypted: true
        };

        setMessagesMap((prev) => ({
          ...prev,
          [activeChatId]: [...(prev[activeChatId] || []), replyMsg]
        }));
      }, 2500);
    }
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
            reactions: [...currentReactions, { emoji, count: 1, userIds: ['user_me'] }]
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
          openSettings={() => setCurrentTab('architecture')}
          openMobileMoney={() => openMobileMoneyForRecipient('+223 76 00 00 00', activeChat.name)}
        />

        {/* Main Body View based on activeTab */}
        <div className="flex-1 overflow-hidden relative">
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
                    const newId = `chat_${Date.now()}`;
                    const newChat: Chat = {
                      id: newId,
                      isGroup: false,
                      name: 'Fatoumata Diallo',
                      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
                      unreadCount: 0,
                      pinned: false,
                      participantIds: ['user_me', 'user_fatou']
                    };
                    setChats([newChat, ...chats]);
                    setActiveChatId(newId);
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

          {currentTab === 'status' && (
            <StatusesScreen
              statuses={statusesList}
              language={language}
              onAddStatus={handleAddStatus}
            />
          )}

          {currentTab === 'calls' && (
            <CallsScreen
              calls={mockCalls}
              language={language}
              onStartCall={(contactName, type) => handleStartCall(type, contactName)}
            />
          )}

          {currentTab === 'architecture' && <ArchitectureSchemaViewer />}
        </div>
      </div>

      {/* WebRTC Active Call Overlay */}
      <CallOverlay
        callSession={activeCall}
        onEndCall={() => setActiveCall(null)}
        onAcceptCall={() => setActiveCall((prev) => prev ? { ...prev, status: 'connected' } : null)}
        networkMode={networkMode}
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
    </div>
  );
}
