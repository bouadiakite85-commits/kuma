import React, { useState, useRef, useEffect } from 'react';
import { Chat, Message, Language, NetworkMode, DataSavingMode, MessageType, MessageReplyPreview } from '../types';
import { translations } from '../data/translations';
import { NETWORK_PRESETS } from '../data/networkPresets';
import {
  Send,
  Mic,
  Lock,
  ArrowRightLeft,
  Check,
  CheckCheck,
  Clock,
  Zap,
  Volume2,
  Play,
  Pause,
  ArrowLeft,
  Sparkles,
  PhoneCall,
  Video,
  CornerUpLeft,
  Smile,
  Trash2,
  Share2,
  X,
  Users,
  Info,
  PauseCircle,
  PlayCircle
} from 'lucide-react';

interface ChatRoomProps {
  chat: Chat;
  messages: Message[];
  onSendMessage: (type: MessageType, content?: string, extraData?: any) => void;
  onDeleteMessage?: (messageId: string) => void;
  onAddReaction?: (messageId: string, emoji: string) => void;
  language: Language;
  networkMode: NetworkMode;
  dataSavingMode: DataSavingMode;
  onBack?: () => void;
  openMobileMoneyForRecipient: (phone: string, name: string) => void;
  onStartCall: (type: 'audio' | 'video') => void;
  onOpenGroupInfo?: () => void;
}

const QUICK_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🇲🇱'];

export const ChatRoom: React.FC<ChatRoomProps> = ({
  chat,
  messages,
  onSendMessage,
  onDeleteMessage,
  onAddReaction,
  language,
  networkMode,
  dataSavingMode,
  onBack,
  openMobileMoneyForRecipient,
  onStartCall,
  onOpenGroupInfo
}) => {
  const t = translations[language];
  const [inputText, setInputText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isRecordingPaused, setIsRecordingPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showBambaraTranscript, setShowBambaraTranscript] = useState<Record<string, boolean>>({});

  // Message selection & interactions state
  const [replyTarget, setReplyTarget] = useState<MessageReplyPreview | null>(null);
  const [selectedMessageForAction, setSelectedMessageForAction] = useState<Message | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRecordingVoice]);

  // Voice recording logic
  const startRecording = () => {
    setIsRecordingVoice(true);
    setIsRecordingPaused(false);
    setRecordingSeconds(0);
    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const togglePauseRecording = () => {
    if (isRecordingPaused) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
      setIsRecordingPaused(false);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRecordingPaused(true);
    }
  };

  const stopAndSendRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecordingVoice(false);
    
    const duration = Math.max(2, recordingSeconds);
    const audioSizeKb = duration * 3;
    const compressedKb = Math.round(audioSizeKb * (dataSavingMode === 'ultra_low_data' ? 0.4 : 0.7));

    onSendMessage('voice', undefined, {
      durationSeconds: duration,
      audioSizeKb,
      compressedSizeKb: compressedKb,
      transcriptBambara: 'Nka kuma-lama nin ye kuma kura ye.',
      transcriptFrench: 'Note vocale enregistrée avec compression réseau 2G.',
      waveform: [20, 60, 90, 40, 70, 100, 50, 80, 30, 90, 40],
      replyTo: replyTarget || undefined
    });

    setReplyTarget(null);
    setRecordingSeconds(0);
  };

  const cancelRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecordingVoice(false);
    setRecordingSeconds(0);
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;
    onSendMessage('text', inputText.trim(), { replyTo: replyTarget || undefined });
    setInputText('');
    setReplyTarget(null);
  };

  const handleReplyMessage = (msg: Message) => {
    setReplyTarget({
      messageId: msg.id,
      senderName: msg.senderId === 'user_me' ? 'Vous' : chat.name,
      content: msg.content || (msg.type === 'voice' ? 'Note vocale' : 'Média'),
      type: msg.type
    });
    setSelectedMessageForAction(null);
  };

  const toggleVoicePlayback = (msgId: string) => {
    if (playingMessageId === msgId) {
      setPlayingMessageId(null);
    } else {
      setPlayingMessageId(msgId);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#efeae2] relative overflow-hidden">
      {/* Chat Header */}
      <div className="bg-emerald-950 text-white px-3 py-2.5 flex items-center justify-between border-b border-emerald-800 shadow-md z-20">
        <div className="flex items-center gap-2 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 rounded-full hover:bg-emerald-900/80 text-emerald-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div
            onClick={onOpenGroupInfo}
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity min-w-0"
          >
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-9 h-9 rounded-full object-cover border border-emerald-700"
            />

            <div className="min-w-0">
              <h2 className="font-bold text-sm text-emerald-100 truncate flex items-center gap-1.5">
                <span>{chat.name}</span>
                {chat.isGroup && (
                  <span className="text-[10px] bg-emerald-800 text-amber-300 px-1.5 py-0.2 rounded font-medium">
                    Groupe
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-emerald-300/80 truncate">
                {chat.isTyping ? (
                  <span className="text-amber-300 font-bold animate-pulse">
                    {chat.typingUserName || 'Quelqu\'un'} est en train d'écrire...
                  </span>
                ) : chat.isGroup ? (
                  `Grin Mali • ${chat.participantIds.length} membres`
                ) : (
                  'En ligne • +223 76...'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-1.5">
          {chat.isGroup && onOpenGroupInfo && (
            <button
              onClick={onOpenGroupInfo}
              className="p-1.5 rounded-full hover:bg-emerald-900 text-emerald-200 transition-colors"
              title="Info du Groupe & Administrateurs"
            >
              <Info className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onStartCall('audio')}
            className="p-2 rounded-full hover:bg-emerald-900 text-emerald-200 transition-colors"
            title={t.audioCall2G}
          >
            <PhoneCall className="w-4 h-4" />
          </button>
          <button
            onClick={() => onStartCall('video')}
            className="p-2 rounded-full hover:bg-emerald-900 text-emerald-200 transition-colors"
            title="Appel Vidéo WebRTC"
          >
            <Video className="w-4 h-4" />
          </button>

          <button
            onClick={() => openMobileMoneyForRecipient('+223 76 00 00 00', chat.name)}
            className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-emerald-950 px-2.5 py-1 rounded-lg font-bold text-xs shadow-sm transition-transform active:scale-95 ml-1"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Payer FCFA</span>
          </button>
        </div>
      </div>

      {/* Encryption & Low-data Notice */}
      <div className={`px-3 py-1.5 text-[11px] flex items-center justify-center gap-1.5 border-b shadow-xs ${
        networkMode === 'infinig'
          ? 'bg-gradient-to-r from-purple-900 via-fuchsia-900 to-indigo-900 text-fuchsia-200 border-fuchsia-500'
          : 'bg-amber-100/90 text-amber-900 border-amber-200/80'
      }`}>
        <Lock className="w-3 h-3 text-amber-600" />
        <span className="font-medium">{t.encryptedE2E}</span>
        <span className="font-bold ml-1">
          • {NETWORK_PRESETS[networkMode]?.shortName || 'Réseau Mali'} ({NETWORK_PRESETS[networkMode]?.bandwidthDisplay})
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.senderId === 'user_me';

          return (
            <div
              key={msg.id}
              className={`group flex flex-col max-w-[85%] sm:max-w-[75%] ${
                isMe ? 'ml-auto items-end' : 'mr-auto items-start'
              }`}
            >
              {/* Message Bubble Container */}
              <div
                className={`rounded-2xl p-3 shadow-xs relative text-xs leading-relaxed transition-all ${
                  isMe
                    ? 'bg-emerald-800 text-emerald-50 rounded-br-xs'
                    : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/80'
                }`}
              >
                {/* Quoted Reply Preview */}
                {msg.replyTo && (
                  <div className={`mb-2 p-2 rounded-lg text-[11px] border-l-4 ${
                    isMe ? 'bg-emerald-900/70 border-amber-400 text-emerald-100' : 'bg-slate-100 border-emerald-600 text-slate-700'
                  }`}>
                    <span className="font-bold block text-amber-300 text-[10px]">{msg.replyTo.senderName}</span>
                    <span className="truncate block opacity-90">{msg.replyTo.content}</span>
                  </div>
                )}

                {/* Deleted Message */}
                {msg.deletedForEveryone ? (
                  <p className="italic text-slate-400 flex items-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Ce message a été supprimé par l'expéditeur</span>
                  </p>
                ) : (
                  <>
                    {/* Text Message */}
                    {msg.type === 'text' && <p className="whitespace-pre-wrap">{msg.content}</p>}

                    {/* Voice Note Priority Message */}
                    {msg.type === 'voice' && msg.voiceNote && (
                      <div className="space-y-2 min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleVoicePlayback(msg.id)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90 ${
                              isMe ? 'bg-amber-400 text-emerald-950 font-bold' : 'bg-emerald-700 text-white'
                            }`}
                          >
                            {playingMessageId === msg.id ? (
                              <Pause className="w-4 h-4 fill-current" />
                            ) : (
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            )}
                          </button>

                          {/* Waveform visualizer */}
                          <div className="flex-1 flex items-center gap-0.5 h-6">
                            {msg.voiceNote.waveform.map((height, idx) => (
                              <div
                                key={idx}
                                style={{ height: `${height}%` }}
                                className={`w-1 rounded-full transition-all ${
                                  playingMessageId === msg.id
                                    ? isMe ? 'bg-amber-300 animate-pulse' : 'bg-emerald-600 animate-pulse'
                                    : isMe ? 'bg-emerald-300/60' : 'bg-slate-300'
                                }`}
                              />
                            ))}
                          </div>

                          <button
                            onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1)}
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isMe ? 'bg-emerald-900/60 text-amber-300' : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {playbackSpeed}x
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-[10px] opacity-80 pt-1 border-t border-emerald-700/40">
                          <span className="flex items-center gap-1 font-mono">
                            <Zap className="w-3 h-3 text-yellow-400" />
                            {msg.voiceNote.compressedSizeKb} KB (économisé {msg.voiceNote.audioSizeKb - msg.voiceNote.compressedSizeKb} KB)
                          </span>
                          <span>{msg.voiceNote.durationSeconds}s</span>
                        </div>

                        {/* AI Voice Transcript */}
                        {(msg.voiceNote.transcriptBambara || msg.voiceNote.transcriptFrench) && (
                          <div className={`mt-2 p-2 rounded-lg text-[11px] ${
                            isMe ? 'bg-emerald-900/60 border border-emerald-700/50 text-emerald-100' : 'bg-slate-100 border border-slate-200 text-slate-800'
                          }`}>
                            <div className="flex items-center justify-between font-semibold mb-1 text-amber-300">
                              <span className="flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                <span>Transcript KUMA IA</span>
                              </span>
                              <button
                                onClick={() =>
                                  setShowBambaraTranscript((prev) => ({
                                    ...prev,
                                    [msg.id]: !prev[msg.id]
                                  }))
                                }
                                className="underline text-[10px]"
                              >
                                {showBambaraTranscript[msg.id] ? 'Voir Français' : 'Voir Bambara'}
                              </button>
                            </div>
                            <p className="italic font-sans">
                              {showBambaraTranscript[msg.id]
                                ? `🇲🇱 "${msg.voiceNote.transcriptBambara}"`
                                : `🇫🇷 "${msg.voiceNote.transcriptFrench}"`}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Mobile Money Shortcut Message */}
                    {msg.type === 'mobile_money' && msg.mobileMoney && (
                      <div className="space-y-1.5 min-w-[210px] bg-gradient-to-br from-amber-50 to-orange-50 text-slate-900 p-3 rounded-xl border border-amber-300 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-amber-800 text-xs flex items-center gap-1">
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                            Paiement Mobile Money
                          </span>
                          <span className="uppercase text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-black">
                            {msg.mobileMoney.provider}
                          </span>
                        </div>
                        <div className="text-base font-black text-emerald-950">
                          {msg.mobileMoney.amountFcfa.toLocaleString()} FCFA
                        </div>
                        <div className="text-[10px] text-slate-600">
                          Réf: <span className="font-mono font-medium">{msg.mobileMoney.transactionRef}</span>
                        </div>
                        {msg.mobileMoney.note && (
                          <div className="text-[11px] text-slate-700 italic border-t border-amber-200/80 pt-1">
                            "{msg.mobileMoney.note}"
                          </div>
                        )}
                      </div>
                    )}

                    {/* Image Media Message */}
                    {msg.type === 'image' && (
                      <div className="space-y-1">
                        <img
                          src={msg.mediaUrl}
                          alt="Media"
                          className="rounded-lg max-h-56 object-cover w-full border border-slate-200"
                        />
                        {msg.content && <p className="text-xs mt-1">{msg.content}</p>}
                        <div className="text-[10px] opacity-75 flex items-center justify-between pt-0.5">
                          <span>Compressé Low-Data</span>
                          <span>{msg.transferredSizeKb} KB</span>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Emoji Reactions List */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5 pt-1 border-t border-emerald-700/30">
                    {msg.reactions.map((react, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-0.5 bg-black/20 text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                      >
                        {react.emoji} {react.count}
                      </span>
                    ))}
                  </div>
                )}

                {/* Message Bottom Metadata */}
                <div
                  className={`flex items-center justify-end gap-1.5 text-[10px] mt-1 ${
                    isMe ? 'text-emerald-200/80' : 'text-slate-400'
                  }`}
                >
                  {/* Action Triggers */}
                  <div className="flex items-center gap-2 mr-2 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => handleReplyMessage(msg)}
                      className="hover:text-amber-300"
                      title="Répondre au message"
                    >
                      <CornerUpLeft className="w-3.5 h-3.5" />
                    </button>
                    {onDeleteMessage && isMe && !msg.deletedForEveryone && (
                      <button
                        onClick={() => onDeleteMessage(msg.id)}
                        className="hover:text-red-300"
                        title="Supprimer pour tous"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <span>{msg.timestamp}</span>
                  {isMe && (
                    <>
                      {msg.status === 'pending_offline' && <Clock className="w-3 h-3 text-amber-300 animate-pulse" />}
                      {msg.status === 'sent' && <Check className="w-3 h-3 text-emerald-300" />}
                      {msg.status === 'delivered' && <CheckCheck className="w-3 h-3 text-emerald-300" />}
                      {msg.status === 'read' && <CheckCheck className="w-3 h-3 text-cyan-300" />}
                    </>
                  )}
                </div>

                {/* Quick Emoji Reaction Palette */}
                {onAddReaction && (
                  <div className="absolute -top-3 right-2 hidden group-hover:flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-full shadow-lg z-20 animate-fadeIn">
                    {QUICK_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => onAddReaction(msg.id, emoji)}
                        className="hover:scale-125 transition-transform text-xs p-0.5"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Active Reply Banner */}
      {replyTarget && (
        <div className="bg-emerald-900 text-white px-4 py-2 border-t border-emerald-700 flex items-center justify-between text-xs animate-fadeIn">
          <div className="border-l-2 border-amber-400 pl-2 min-w-0">
            <span className="font-bold text-amber-300 text-[11px]">
              Réponse à {replyTarget.senderName}
            </span>
            <p className="truncate text-emerald-100 text-[11px]">{replyTarget.content}</p>
          </div>
          <button
            onClick={() => setReplyTarget(null)}
            className="p-1 rounded-full hover:bg-emerald-800 text-emerald-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Voice Recording Active Overlay */}
      {isRecordingVoice ? (
        <div className="bg-emerald-950 text-white p-4 border-t border-emerald-800 flex items-center justify-between animate-fadeIn z-30">
          <div className="flex items-center gap-3">
            <div className={`w-3.5 h-3.5 rounded-full ${isRecordingPaused ? 'bg-amber-400' : 'bg-red-500 animate-ping'}`} />
            <span className="font-bold text-xs text-red-400">
              {isRecordingPaused ? 'Enregistrement en pause' : `${t.recording} (${recordingSeconds}s)`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={togglePauseRecording}
              className="p-2 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-amber-300"
              title={isRecordingPaused ? "Reprendre" : "Pause"}
            >
              {isRecordingPaused ? <PlayCircle className="w-5 h-5" /> : <PauseCircle className="w-5 h-5" />}
            </button>
            <button
              onClick={cancelRecording}
              className="text-xs bg-emerald-900 hover:bg-emerald-800 text-slate-200 px-3 py-2 rounded-lg border border-emerald-700"
            >
              Annuler
            </button>
            <button
              onClick={stopAndSendRecording}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-4 py-2 rounded-lg text-xs transition-transform active:scale-95 shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Envoyer</span>
            </button>
          </div>
        </div>
      ) : (
        /* Input Bar */
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 z-20">
          <button
            onClick={() => openMobileMoneyForRecipient('+223 76 00 00 00', chat.name)}
            className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors"
            title="Envoyer de l'argent (Orange, Moov, Wave)"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>

          <input
            type="text"
            placeholder={
              language === 'bm'
                ? "Sina kuma sɛbɛn yan..."
                : "Écrire un message ou envoyer une note vocale..."
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
            className="flex-1 bg-slate-100 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
          />

          {inputText.trim().length > 0 ? (
            <button
              onClick={handleSendText}
              className="p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl transition-transform active:scale-90 shadow-sm"
            >
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={startRecording}
              className="p-3 bg-emerald-700 hover:bg-emerald-800 text-amber-300 rounded-full shadow-md transition-transform active:scale-95 border-2 border-emerald-500 flex items-center justify-center animate-pulse"
              title={t.tapToRecord}
            >
              <Mic className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
