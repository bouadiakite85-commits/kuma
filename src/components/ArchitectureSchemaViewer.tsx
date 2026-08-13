import React, { useState } from 'react';
import { kumaDatabaseSchema } from '../data/mockData';
import { ANDROID_PLAYSTORE_CONFIG, REQUIRED_ANDROID_PERMISSIONS, ANDROID_MANIFEST_XML } from '../lib/androidConfig';
import { Cpu, Database, Server, Smartphone, Lock, Wifi, Zap, Table, FileCode, CheckCircle2, ShieldCheck, Download, Code } from 'lucide-react';

export const ArchitectureSchemaViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stack' | 'architecture' | 'schema' | 'playstore'>('stack');
  const [selectedTable, setSelectedTable] = useState<string>(kumaDatabaseSchema[0].tableName);

  const activeSchema = kumaDatabaseSchema.find(t => t.tableName === selectedTable) || kumaDatabaseSchema[0];

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 overflow-y-auto p-4 space-y-4">
      {/* Title & Navigation Header */}
      <div className="bg-emerald-950 p-4 rounded-2xl border border-emerald-800 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black text-base text-amber-300">Spécifications Techniques & Play Store "KUMA Mali"</h2>
            <p className="text-xs text-emerald-200">Architecture Senior Software Architect & Android Deployment Specs</p>
          </div>
        </div>

        {/* Subtabs */}
        <div className="flex flex-wrap bg-emerald-900/80 p-1 rounded-xl text-xs font-bold border border-emerald-700/60 gap-1">
          <button
            onClick={() => setActiveTab('stack')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'stack' ? 'bg-amber-400 text-emerald-950 shadow-md' : 'text-emerald-200 hover:text-white'
            }`}
          >
            1. Stack Technique
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'architecture' ? 'bg-amber-400 text-emerald-950 shadow-md' : 'text-emerald-200 hover:text-white'
            }`}
          >
            2. Architecture Système
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'schema' ? 'bg-amber-400 text-emerald-950 shadow-md' : 'text-emerald-200 hover:text-white'
            }`}
          >
            3. Schéma BDD
          </button>
          <button
            onClick={() => setActiveTab('playstore')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'playstore' ? 'bg-amber-400 text-emerald-950 shadow-md' : 'text-emerald-200 hover:text-white'
            }`}
          >
            4. Google Play & Android 🤖
          </button>
        </div>
      </div>

      {/* TAB 1: RECOMMENDED TECH STACK */}
      {activeTab === 'stack' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mobile Frontend */}
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm border-b border-slate-700 pb-2">
                <Smartphone className="w-5 h-5" />
                <span>1. Frontend Mobile (Cross-Platform / Native Performance)</span>
              </div>
              <ul className="text-xs space-y-2 text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Flutter (Dart)</strong> ou <strong className="text-white">React Native (Expo + Reanimated)</strong>: Performance native 60fps sur téléphones Android à ressources modérées (très répandus au Mali).
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Opus Audio Codec (libopus)</strong>: Compression vocale extrême (8 kbps à 16 kbps) pour réduire de 80% la consommation de données par rapport à MP3/AAC.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">SQLite / WatermelonDB / Hive (Local First)</strong>: Base de données embarquée pour la persistance complète des messages hors-ligne.
                  </div>
                </li>
              </ul>
            </div>

            {/* Backend & Real-time */}
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm border-b border-slate-700 pb-2">
                <Server className="w-5 h-5" />
                <span>2. Backend & Temps Réel (Haute Concurrence)</span>
              </div>
              <ul className="text-xs space-y-2 text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Elixir / Erlang OTP (Phoenix Framework)</strong> ou <strong className="text-white">Go (Golang)</strong>: Moteur de messagerie ultra-robuste inspiré de l'architecture originale de WhatsApp.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">MQTT over TLS / WebSockets</strong>: Protocoles de transport ultra-léger avec en-têtes réseau réduits (2 octets) adaptés aux connexions 2G instables.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Signaling WebRTC (Coturn TURN/STUN)</strong>: Serveurs de relais légers pour appels vocaux P2P à faible latence.
                  </div>
                </li>
              </ul>
            </div>

            {/* Database & Caching */}
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm border-b border-slate-700 pb-2">
                <Database className="w-5 h-5" />
                <span>3. Base de Données & Caching</span>
              </div>
              <ul className="text-xs space-y-2 text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">PostgreSQL + Citus (ou ScyllaDB/Cassandra)</strong>: Stockage relationnel distribué pour les profils utilisateurs, groupes, droits et historique.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Redis Cluster / Dragonfly</strong>: File d'attente Pub/Sub haute vitesse et gestionnaire de présence d'état.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">MinIO / Cloud Object Storage (S3)</strong>: Stockage des fichiers médias compressés (photos WebP, audio Opus).
                  </div>
                </li>
              </ul>
            </div>

            {/* Security & Mobile Money */}
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm border-b border-slate-700 pb-2">
                <Lock className="w-5 h-5" />
                <span>4. Chiffrement (E2EE) & Mobile Money Mali</span>
              </div>
              <ul className="text-xs space-y-2 text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Libsignal Protocol (Double Ratchet + Curve25519)</strong>: Chiffrement de bout en bout où le serveur ne peut jamais lire les conversations.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">API Orange Money Mali, Moov Money, Wave SDK</strong>: Passerelles Webhook sécurisées avec validation OTP.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GLOBAL ARCHITECTURE FLOW */}
      {activeTab === 'architecture' && (
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4 animate-fadeIn">
          <h3 className="font-extrabold text-sm text-amber-300 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Schéma d'Architecture Flux de Messagerie "Mali Low-Data Mode"
          </h3>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-3 overflow-x-auto text-emerald-300">
            <div className="p-3 bg-emerald-950/80 rounded border border-emerald-800/80 text-white">
              <span className="text-amber-400 font-bold">[ ÉTAPE 1: CLIENT MOBILE (FLUTTER / REACT NATIVE) ]</span>
              <br />
              - Capture vocal (Codec Opus @ 8kbps) ou Texte
              <br />
              - Chiffrement local via Clé de Session (Libsignal)
              <br />
              - Stockage local immédiat dans SQLite (Mode Offline Resilience)
            </div>

            <div className="text-center text-amber-400 font-bold my-1">⬇️ WebSocket / MQTT over TLS (Connecteur 2G/3G)</div>

            <div className="p-3 bg-slate-900 rounded border border-slate-700 text-white">
              <span className="text-emerald-400 font-bold">[ ÉTAPE 2: PASSERELLE BACKEND (GO / PHOENIX ELIXIR) ]</span>
              <br />
              - Routeur de paquets légers (Sans stockage de contenu en clair)
              <br />
              - Vérification des jetons d'authentification OTP SMS
              <br />
              - Diffusion Pub/Sub via Redis pour mise à jour du statut (✓ Envoyé, ✓✓ Reçu)
            </div>

            <div className="text-center text-amber-400 font-bold my-1">⬇️ Traitement de Notification Push & Stockage</div>

            <div className="p-3 bg-slate-900 rounded border border-slate-700 text-white">
              <span className="text-cyan-400 font-bold">[ ÉTAPE 3: STOCKAGE BD & INTEGRATION MOBILE MONEY MALI ]</span>
              <br />
              - PostgreSQL: Table Messages (Métadonnées & Payload chiffré)
              <br />
              - MinIO CDN: Fichiers audio compressés
              <br />
              - APIs Webhook: Orange Money / Moov Money / Wave
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DATABASE SCHEMA INSPECTOR */}
      {activeTab === 'schema' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex flex-wrap gap-2 bg-slate-800 p-2 rounded-xl border border-slate-700">
            {kumaDatabaseSchema.map((t) => (
              <button
                key={t.tableName}
                onClick={() => setSelectedTable(t.tableName)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedTable === t.tableName
                    ? 'bg-amber-400 text-emerald-950 shadow-md'
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>{t.tableName}</span>
              </button>
            ))}
          </div>

          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <div>
                <h3 className="font-extrabold text-sm text-amber-300 font-mono">
                  TABLE: {activeSchema.tableName}
                </h3>
                <p className="text-xs text-slate-400">{activeSchema.description}</p>
              </div>
              <span className="text-[10px] bg-emerald-900 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-700">
                PostgreSQL 16
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-amber-300 font-mono border-b border-slate-700">
                    <th className="p-2.5">Colonne</th>
                    <th className="p-2.5">Type de Donnée</th>
                    <th className="p-2.5">Clé / Référence</th>
                    <th className="p-2.5">Description & Utilisation Mali</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 font-mono text-[11px]">
                  {activeSchema.columns.map((col) => (
                    <tr key={col.name} className="hover:bg-slate-750/50">
                      <td className="p-2.5 font-bold text-emerald-300">{col.name}</td>
                      <td className="p-2.5 text-slate-300">{col.type}</td>
                      <td className="p-2.5">
                        {col.isPrimary && (
                          <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded font-bold border border-amber-500/40">
                            PRIMARY KEY
                          </span>
                        )}
                        {col.isForeign && (
                          <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-1.5 py-0.5 rounded font-bold border border-cyan-500/40 ml-1">
                            FK ➔ {col.references}
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 text-slate-300 font-sans">{col.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GOOGLE PLAY STORE READINESS & ANDROID SPECS */}
      {activeTab === 'playstore' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Header Specs summary */}
          <div className="bg-gradient-to-r from-emerald-950 to-slate-900 p-4 rounded-2xl border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>Conformité Google Play Store 2026 (Android 14 API 34)</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Package ID: <span className="font-mono text-amber-300">{ANDROID_PLAYSTORE_CONFIG.applicationId}</span> | Min SDK: {ANDROID_PLAYSTORE_CONFIG.minSdkVersion} (Lollipop 5.0)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-emerald-950 font-bold text-xs px-3 py-1 rounded-lg">
                Format: .AAB (Android App Bundle)
              </span>
            </div>
          </div>

          {/* Android Permissions List */}
          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
            <h3 className="font-bold text-sm text-amber-300 flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Permissions Android Requises (AndroidManifest.xml)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {REQUIRED_ANDROID_PERMISSIONS.map((perm) => (
                <div key={perm.permission} className="bg-slate-900 p-3 rounded-xl border border-slate-700 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-emerald-300 font-bold text-[11px] truncate">
                      {perm.permission.replace('android.permission.', '')}
                    </span>
                    <span className="bg-emerald-900 text-emerald-200 text-[10px] px-1.5 py-0.2 rounded font-bold">
                      {perm.requiredForPlayStore ? 'Obligatoire' : 'Optionnel'}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{perm.purpose}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Android Manifest Code Preview */}
          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
              <span className="flex items-center gap-1.5 font-mono">
                <Code className="w-4 h-4 text-emerald-400" />
                AndroidManifest.xml Généré
              </span>
              <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400 font-mono">UTF-8</span>
            </div>
            <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-56">
              {ANDROID_MANIFEST_XML}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
