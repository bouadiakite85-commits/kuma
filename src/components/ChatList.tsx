import React, { useState } from 'react';
import { Chat, Language, NetworkMode } from '../types';
import { translations } from '../data/translations';
import { Search, Pin, Mic, ArrowRightLeft, Image as ImageIcon, Lock, Plus, Users, WifiOff } from 'lucide-react';

interface ChatListProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  language: Language;
  networkMode: NetworkMode;
  onNewChat: () => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  language,
  networkMode,
  onNewChat
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (chat.bambaraTitle && chat.bambaraTitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Search Header */}
      <div className="p-3 bg-white border-b border-slate-200">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={language === 'bm' ? "Sini kuma-so fɛ..." : "Rechercher une discussion..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-100 text-slate-800 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
          />
        </div>
      </div>

      {/* Network Warning Banner for Low Data or Offline */}
      {networkMode === '2g' && (
        <div className="bg-amber-50 border-b border-amber-200 p-2 px-3 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-medium">{t.network2GNotice}</span>
          </div>
          <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">2G</span>
        </div>
      )}

      {networkMode === 'offline' && (
        <div className="bg-slate-800 text-slate-100 p-2 px-3 text-xs flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.queuedForSync}</span>
          </div>
          <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded">Hors-ligne</span>
        </div>
      )}

      {/* Chat items list */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filteredChats.map((chat) => {
          const isSelected = chat.id === activeChatId;
          const lastMsg = chat.lastMessage;

          return (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full p-3.5 flex items-center gap-3 text-left transition-all hover:bg-slate-100/80 active:bg-slate-200/80 ${
                isSelected ? 'bg-emerald-50/80 border-l-4 border-emerald-600' : ''
              }`}
            >
              {/* Avatar with Group indicator */}
              <div className="relative flex-shrink-0">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-200"
                />
                {chat.isGroup && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-800 text-amber-300 p-1 rounded-full border border-white">
                    <Users className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>

              {/* Chat Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h3 className="font-semibold text-sm text-slate-900 truncate">
                      {chat.name}
                    </h3>
                    {chat.pinned && <Pin className="w-3 h-3 text-emerald-700 fill-emerald-700 flex-shrink-0" />}
                  </div>
                  {lastMsg && (
                    <span className="text-[11px] text-slate-400 flex-shrink-0 font-medium">
                      {lastMsg.timestamp}
                    </span>
                  )}
                </div>

                {/* Subtitle / Last Message preview */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1 min-w-0 truncate">
                    {lastMsg?.type === 'voice' && (
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <Mic className="w-3.5 h-3.5" />
                        <span>Note vocale ({lastMsg.voiceNote?.durationSeconds}s)</span>
                      </span>
                    )}

                    {lastMsg?.type === 'mobile_money' && (
                      <span className="flex items-center gap-1 text-amber-700 font-medium">
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span>{lastMsg.mobileMoney?.amountFcfa.toLocaleString()} FCFA</span>
                      </span>
                    )}

                    {lastMsg?.type === 'image' && (
                      <span className="flex items-center gap-1 text-slate-600">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Photo ({lastMsg.transferredSizeKb} KB)</span>
                      </span>
                    )}

                    {lastMsg?.type === 'text' && (
                      <span className="truncate">{lastMsg.content}</span>
                    )}
                  </div>

                  {/* Unread badge */}
                  {chat.unreadCount > 0 && (
                    <span className="ml-2 bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 shadow-sm">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Floating Action Button for New Chat */}
      <button
        onClick={onNewChat}
        className="absolute bottom-4 right-4 bg-emerald-700 hover:bg-emerald-800 text-white p-3.5 rounded-full shadow-lg transition-transform active:scale-90 flex items-center justify-center border-2 border-emerald-500"
        title={t.newChat}
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};
