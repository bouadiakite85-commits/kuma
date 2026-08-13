import React, { useState } from 'react';
import { StatusStory, Language } from '../types';
import { translations } from '../data/translations';
import { Plus, Mic, Eye, Play, Sparkles, X, Image as ImageIcon, Send, Volume2, Check } from 'lucide-react';

interface StatusesScreenProps {
  statuses: StatusStory[];
  language: Language;
  onAddStatus: (newStatus: Omit<StatusStory, 'id' | 'viewsCount'>) => void;
}

const BG_COLORS = [
  'bg-emerald-900',
  'bg-amber-800',
  'bg-indigo-900',
  'bg-rose-900',
  'bg-slate-900',
  'bg-teal-900'
];

export const StatusesScreen: React.FC<StatusesScreenProps> = ({
  statuses,
  language,
  onAddStatus
}) => {
  const t = translations[language];
  const [activeStory, setActiveStory] = useState<StatusStory | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<'text' | 'voice' | 'image'>('text');
  const [statusText, setStatusText] = useState('');
  const [selectedBg, setSelectedBg] = useState(BG_COLORS[0]);

  const handleCreateStatus = () => {
    if (!statusText.trim() && createType === 'text') return;

    onAddStatus({
      userId: 'user_me',
      userName: 'Vous (KUMA Mali)',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      timestamp: 'À l\'instant',
      type: createType,
      content: statusText.trim() || 'Awa Kuma, Mali Kura ! 🇲🇱',
      bgColor: selectedBg,
      expiresInHours: 24,
      mediaUrl: createType === 'image' ? 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&auto=format&fit=crop&q=80' : undefined,
      viewers: [
        { id: 'u1', name: 'Oumou Traoré', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', time: 'Il y a 5 min' },
        { id: 'u2', name: 'Mamadou Coulibaly', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', time: 'Il y a 12 min' }
      ]
    });

    setStatusText('');
    setShowCreateModal(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 p-3 space-y-4 overflow-y-auto relative">
      {/* My Status Card */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
              alt="Mon statut"
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-600 p-0.5 group-hover:scale-105 transition-transform"
            />
            <div className="absolute bottom-0 right-0 bg-emerald-600 text-white rounded-full p-1 border-2 border-white">
              <Plus className="w-3 h-3" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs group-hover:text-emerald-700 transition-colors">
              Mon statut KUMA (24h)
            </h4>
            <p className="text-[11px] text-slate-500">Ajouter du texte, une photo ou une note vocale</p>
          </div>
        </div>

        <button
          onClick={() => {
            setCreateType('voice');
            setShowCreateModal(true);
          }}
          className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-3 py-1.5 rounded-xl text-xs transition-transform active:scale-95"
        >
          <Mic className="w-3.5 h-3.5 text-amber-700" />
          <span>Statut Vocal</span>
        </button>
      </div>

      {/* Recent Updates Header */}
      <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider px-1">
        Mises à jour récentes (24h)
      </h3>

      {/* Stories Grid */}
      <div className="grid grid-cols-2 gap-3">
        {statuses.map((story) => (
          <button
            key={story.id}
            onClick={() => setActiveStory(story)}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs text-left group hover:shadow-md transition-all relative flex flex-col justify-between min-h-[160px]"
          >
            {story.mediaUrl ? (
              <img
                src={story.mediaUrl}
                alt={story.userName}
                className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className={`absolute inset-0 ${story.bgColor || 'bg-emerald-950'} p-3 flex flex-col justify-center items-center text-center`}>
                <Mic className="w-8 h-8 text-amber-400 mb-2 animate-pulse" />
                <p className="text-amber-200 font-bold text-xs">{story.content}</p>
              </div>
            )}

            <div className="relative z-10 p-2.5 bg-gradient-to-b from-slate-950/70 to-transparent text-white w-full flex items-center gap-2">
              <img
                src={story.userAvatar}
                alt={story.userName}
                className="w-7 h-7 rounded-full border border-white/80 object-cover"
              />
              <div className="min-w-0">
                <h5 className="font-bold text-[11px] truncate text-white">{story.userName}</h5>
                <span className="text-[9px] text-slate-300 block">{story.timestamp}</span>
              </div>
            </div>

            <div className="relative z-10 p-2.5 bg-gradient-to-t from-slate-950/80 to-transparent text-white w-full flex items-center justify-between text-[10px]">
              <span className="flex items-center gap-1 font-medium">
                <Eye className="w-3 h-3 text-emerald-400" />
                {story.viewsCount} vues
              </span>
              <span className="bg-amber-400 text-emerald-950 px-1.5 py-0.2 rounded font-bold">
                {story.type === 'voice' ? 'Vocal 🎙️' : 'Photo 📸'}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* CREATE STATUS MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900">Publier un statut KUMA</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Type selector */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-700">
              <button
                onClick={() => setCreateType('text')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${createType === 'text' ? 'bg-white shadow text-emerald-800' : ''}`}
              >
                Texte 📝
              </button>
              <button
                onClick={() => setCreateType('voice')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${createType === 'voice' ? 'bg-white shadow text-emerald-800' : ''}`}
              >
                Vocal 🎙️
              </button>
              <button
                onClick={() => setCreateType('image')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${createType === 'image' ? 'bg-white shadow text-emerald-800' : ''}`}
              >
                Photo 📸
              </button>
            </div>

            {/* Input fields */}
            {createType === 'text' && (
              <div className="space-y-3">
                <textarea
                  placeholder="Quoi de neuf à Bamako ?"
                  value={statusText}
                  onChange={(e) => setStatusText(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
                  rows={3}
                />
                <div>
                  <span className="text-[11px] font-bold text-slate-600 block mb-1">Couleur de fond :</span>
                  <div className="flex gap-2">
                    {BG_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedBg(color)}
                        className={`w-7 h-7 rounded-full ${color} border-2 ${selectedBg === color ? 'border-amber-400 scale-110' : 'border-transparent'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {createType === 'voice' && (
              <div className="bg-emerald-950 text-amber-300 p-4 rounded-xl text-center space-y-2">
                <Mic className="w-8 h-8 mx-auto text-amber-400 animate-bounce" />
                <p className="text-xs font-bold">Enregistrement statut vocal 15s (Opus 8kbps)</p>
                <input
                  type="text"
                  placeholder="Titre du statut vocal..."
                  value={statusText}
                  onChange={(e) => setStatusText(e.target.value)}
                  className="w-full text-xs p-2 rounded bg-emerald-900 text-white placeholder-emerald-400 outline-none"
                />
              </div>
            )}

            {createType === 'image' && (
              <div className="bg-slate-100 p-4 rounded-xl text-center space-y-2 border border-dashed border-slate-300">
                <ImageIcon className="w-8 h-8 mx-auto text-slate-400" />
                <p className="text-xs text-slate-600 font-medium">Image présélectionnée Mali Kura</p>
                <input
                  type="text"
                  placeholder="Légende de la photo..."
                  value={statusText}
                  onChange={(e) => setStatusText(e.target.value)}
                  className="w-full text-xs p-2 rounded bg-white border outline-none"
                />
              </div>
            )}

            <button
              onClick={handleCreateStatus}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2.5 rounded-xl shadow-md flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Publier le statut KUMA</span>
            </button>
          </div>
        </div>
      )}

      {/* FULLSCREEN STORY VIEWER */}
      {activeStory && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="bg-emerald-950 text-white rounded-2xl w-full max-w-sm p-4 space-y-4 relative overflow-hidden border border-emerald-800 shadow-2xl">
            {/* Top timer bar */}
            <div className="w-full h-1 bg-emerald-900 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 w-3/4 animate-pulse" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={activeStory.userAvatar}
                  alt={activeStory.userName}
                  className="w-9 h-9 rounded-full object-cover border border-amber-400"
                />
                <div>
                  <h4 className="font-bold text-xs text-emerald-100">{activeStory.userName}</h4>
                  <span className="text-[10px] text-emerald-300">{activeStory.timestamp}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveStory(null)}
                className="bg-emerald-900 hover:bg-emerald-800 text-emerald-200 px-3 py-1 rounded-lg text-xs font-bold"
              >
                Fermer
              </button>
            </div>

            {activeStory.mediaUrl && (
              <img
                src={activeStory.mediaUrl}
                alt="Story"
                className="rounded-xl max-h-72 object-cover w-full border border-emerald-800"
              />
            )}

            <p className="text-xs text-emerald-100 font-medium italic bg-emerald-900/60 p-3 rounded-xl border border-emerald-800">
              "{activeStory.content}"
            </p>

            {/* Viewers list */}
            {activeStory.viewers && activeStory.viewers.length > 0 && (
              <div className="border-t border-emerald-800 pt-3">
                <span className="text-[11px] font-bold text-amber-300 block mb-1.5 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  Vu par {activeStory.viewers.length} personnes :
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {activeStory.viewers.map((viewer) => (
                    <div key={viewer.id} className="flex items-center gap-1 bg-emerald-900/80 px-2 py-1 rounded-full text-[10px]">
                      <img src={viewer.avatar} alt={viewer.name} className="w-4 h-4 rounded-full object-cover" />
                      <span className="text-emerald-100 font-medium truncate max-w-[80px]">{viewer.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
