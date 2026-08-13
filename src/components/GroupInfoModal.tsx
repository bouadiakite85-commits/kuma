import React, { useState } from 'react';
import { Chat, User } from '../types';
import {
  X,
  ShieldCheck,
  UserPlus,
  Copy,
  Check,
  Crown,
  Users,
  Info,
  ExternalLink,
  Trash2
} from 'lucide-react';

interface GroupInfoModalProps {
  chat: Chat;
  allUsers: User[];
  onClose: () => void;
  onUpdateGroup?: (updatedChat: Chat) => void;
}

export const GroupInfoModal: React.FC<GroupInfoModalProps> = ({
  chat,
  allUsers,
  onClose,
  onUpdateGroup
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [description, setDescription] = useState(chat.description || "Groupe officiel KUMA Bamako. Discussions, actualités locales et soutien mutuel.");
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  const inviteUrl = chat.inviteLink || `https://kuma.ml/g/${chat.id.replace('chat_', '')}`;

  const copyInviteLink = () => {
    navigator.clipboard?.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const groupAdmins = chat.groupAdminIds || ['user_1'];

  const members = allUsers.filter(u => chat.participantIds.includes(u.id));

  const toggleAdminRole = (userId: string) => {
    if (!onUpdateGroup) return;
    let newAdmins = [...groupAdmins];
    if (newAdmins.includes(userId)) {
      if (newAdmins.length === 1) {
        alert("Le groupe doit posséder au moins un administrateur.");
        return;
      }
      newAdmins = newAdmins.filter(id => id !== userId);
    } else {
      newAdmins.push(userId);
    }
    onUpdateGroup({
      ...chat,
      groupAdminIds: newAdmins
    });
  };

  const removeMember = (userId: string) => {
    if (!onUpdateGroup) return;
    if (chat.participantIds.length <= 2) {
      alert("Un groupe doit comporter au moins 2 membres.");
      return;
    }
    const updatedParticipants = chat.participantIds.filter(id => id !== userId);
    const updatedAdmins = (chat.groupAdminIds || []).filter(id => id !== userId);
    onUpdateGroup({
      ...chat,
      participantIds: updatedParticipants,
      groupAdminIds: updatedAdmins.length > 0 ? updatedAdmins : [updatedParticipants[0]]
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-emerald-800 to-emerald-950 text-white p-6 text-center rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-amber-400 shadow-lg mx-auto mb-3"
          />
          <h2 className="text-xl font-bold">{chat.name}</h2>
          {chat.bambaraTitle && (
            <p className="text-xs text-amber-300 font-medium">{chat.bambaraTitle}</p>
          )}
          <p className="text-xs text-emerald-200 mt-1 flex items-center justify-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{members.length} membres inscrits</span>
          </p>
        </div>

        <div className="p-5 space-y-5">
          {/* Group Description */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-600" />
                Description du groupe
              </span>
              <button
                onClick={() => setIsEditingDesc(!isEditingDesc)}
                className="text-emerald-700 hover:underline"
              >
                {isEditingDesc ? "Enregistrer" : "Modifier"}
              </button>
            </div>
            {isEditingDesc ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                rows={2}
              />
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
            )}
          </div>

          {/* Group Invite Link */}
          <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
            <label className="text-xs font-bold text-emerald-900 block mb-1">
              Lien d'invitation au groupe KUMA
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={inviteUrl}
                className="flex-1 bg-white text-xs font-mono text-slate-700 p-2 rounded-lg border border-emerald-300 outline-none"
              />
              <button
                onClick={copyInviteLink}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4 text-amber-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? "Copié !" : "Copier"}</span>
              </button>
            </div>
          </div>

          {/* Member List & Admin Controls */}
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2 flex items-center justify-between">
              <span>Membres du groupe ({members.length})</span>
              <span className="text-[11px] text-emerald-700 lowercase font-normal">Gestion des rôles</span>
            </h3>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
              {members.map((member) => {
                const isAdmin = groupAdmins.includes(member.id);
                return (
                  <div key={member.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-800">{member.name}</span>
                          {isAdmin && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                              <Crown className="w-3 h-3 text-amber-600 fill-current" />
                              Admin
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">{member.phone}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleAdminRole(member.id)}
                        className={`text-[11px] px-2 py-1 rounded border font-medium ${
                          isAdmin
                            ? 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                        title={isAdmin ? "Rétrograder en membre simple" : "Nommer administrateur"}
                      >
                        {isAdmin ? "Rétrograder" : "+ Admin"}
                      </button>

                      <button
                        onClick={() => removeMember(member.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Exclure du groupe"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
