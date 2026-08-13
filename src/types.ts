export type Language = 'fr' | 'bm' | 'ff' | 'sn' | 'tm';

export type NetworkMode = '4g' | '3g' | '2g' | 'offline';

export type DataSavingMode = 'normal' | 'low_data' | 'ultra_low_data';

export type MessageStatus = 'pending_offline' | 'sent' | 'delivered' | 'read';

export type MessageType = 'text' | 'voice' | 'image' | 'video' | 'mobile_money' | 'location';

export interface User {
  id: string;
  phone: string;
  name: string;
  avatar: string;
  bio: string;
  language: Language;
  online: boolean;
  lastSeen?: string;
  publicKey: string;
}

export interface VoiceNoteDetails {
  durationSeconds: number;
  audioUrl?: string;
  audioSizeKb: number;
  compressedSizeKb: number;
  transcriptBambara?: string;
  transcriptFrench?: string;
  waveform: number[];
}

export interface MobileMoneyDetails {
  provider: 'orange' | 'moov' | 'wave';
  amountFcfa: number;
  recipientPhone: string;
  recipientName: string;
  transactionRef?: string;
  status: 'pending' | 'completed' | 'failed';
  note?: string;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  userIds: string[];
}

export interface MessageReplyPreview {
  messageId: string;
  senderName: string;
  content: string;
  type: MessageType;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  type: MessageType;
  content?: string;
  timestamp: string;
  status: MessageStatus;
  originalSizeKb?: number;
  transferredSizeKb?: number;
  voiceNote?: VoiceNoteDetails;
  mobileMoney?: MobileMoneyDetails;
  mediaUrl?: string;
  encrypted: boolean;
  replyTo?: MessageReplyPreview;
  reactions?: MessageReaction[];
  deletedForEveryone?: boolean;
}

export interface Chat {
  id: string;
  isGroup: boolean;
  name: string;
  avatar: string;
  unreadCount: number;
  lastMessage?: Message;
  pinned?: boolean;
  participantIds: string[];
  groupAdminIds?: string[];
  bambaraTitle?: string;
  description?: string;
  inviteLink?: string;
  isTyping?: boolean;
  typingUserName?: string;
}

export interface StatusStory {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  timestamp: string;
  type: 'image' | 'text' | 'voice';
  content: string;
  bgColor?: string;
  mediaUrl?: string;
  voiceDuration?: number;
  viewsCount: number;
  expiresInHours: number;
  viewers?: { id: string; name: string; avatar: string; time: string }[];
}

export interface CallLog {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar: string;
  type: 'audio' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  duration?: string;
  dataUsedKb: number;
  codec: 'opus_8kbps' | 'opus_16kbps' | 'h264_low';
}

export interface CallSession {
  id: string;
  peerName: string;
  peerAvatar: string;
  peerPhone: string;
  type: 'audio' | 'video';
  status: 'calling' | 'ringing' | 'connected' | 'ended';
  direction: 'incoming' | 'outgoing';
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeakerOn: boolean;
  isFrontCamera: boolean;
  bitrateKbps: number;
  packetsLostPercentage: number;
  iceConnectionState: 'checking' | 'connected' | 'completed' | 'disconnected';
  codec: string;
}

export interface TableColumn {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  references?: string;
  description: string;
}

export interface TableSchema {
  tableName: string;
  description: string;
  columns: TableColumn[];
}

export interface AndroidPermissionSpec {
  permission: string;
  purpose: string;
  requiredForPlayStore: boolean;
}
