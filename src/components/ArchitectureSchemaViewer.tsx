import React, { useState } from 'react';
import { kumaDatabaseSchema } from '../data/mockData';
import {
  ANDROID_PLAYSTORE_CONFIG,
  REQUIRED_ANDROID_PERMISSIONS,
  ANDROID_MANIFEST_XML,
  WEB_APP_MANIFEST_JSON,
  DIGITAL_ASSET_LINKS_JSON,
  BUBBLEWRAP_AAB_CLI_COMMANDS
} from '../lib/androidConfig';
import {
  Cpu,
  Database,
  Server,
  Smartphone,
  Lock,
  Zap,
  Table,
  CheckCircle2,
  ShieldCheck,
  Download,
  Code,
  Globe,
  Terminal,
  Copy,
  Check,
  Radio
} from 'lucide-react';

export const ArchitectureSchemaViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stack' | 'architecture' | 'schema' | 'playstore' | 'autonomous'>('autonomous');
  const [playstoreSubTab, setPlaystoreSubTab] = useState<'manifest' | 'twa' | 'assetlinks' | 'android_manifest' | 'cli_guide'>('manifest');
  const [selectedTable, setSelectedTable] = useState<string>(kumaDatabaseSchema[0].tableName);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeSchema = kumaDatabaseSchema.find((t) => t.tableName === selectedTable) || kumaDatabaseSchema[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 overflow-y-auto p-4 space-y-4">
      {/* Title & Navigation Header */}
      <div className="bg-emerald-950 p-4 rounded-2xl border border-emerald-800 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black text-base text-amber-300">Architecture Autonome KUMA & Spécifications</h2>
            <p className="text-xs text-emerald-200">Protocole KUMA ↔ KUMA Décentralisé • Mode Hors-Ligne • Google Play (.AAB)</p>
          </div>
        </div>

        {/* Subtabs */}
        <div className="flex flex-wrap bg-emerald-900/80 p-1 rounded-xl text-xs font-bold border border-emerald-700/60 gap-1">
          <button
            onClick={() => setActiveTab('autonomous')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'autonomous' ? 'bg-amber-400 text-emerald-950 shadow-md font-black' : 'text-emerald-200 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>KUMA ↔ KUMA Autonome & Offline 🌟</span>
          </button>
          <button
            onClick={() => setActiveTab('playstore')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'playstore' ? 'bg-amber-400 text-emerald-950 shadow-md font-black' : 'text-emerald-200 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Play Store & AAB 🤖</span>
          </button>
          <button
            onClick={() => setActiveTab('stack')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'stack' ? 'bg-amber-400 text-emerald-950 shadow-md font-black' : 'text-emerald-200 hover:text-white'
            }`}
          >
            Stack Technique
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'architecture' ? 'bg-amber-400 text-emerald-950 shadow-md font-black' : 'text-emerald-200 hover:text-white'
            }`}
          >
            Flux Système
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'schema' ? 'bg-amber-400 text-emerald-950 shadow-md font-black' : 'text-emerald-200 hover:text-white'
            }`}
          >
            Schéma BDD
          </button>
        </div>
      </div>

      {/* TAB 0 (AUTONOMOUS KUMA ↔ KUMA & OFFLINE MESH) */}
      {activeTab === 'autonomous' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Main Hero Card */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 p-5 rounded-2xl border border-amber-400/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300 font-extrabold text-base">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>Architecture 100% Autonome (KUMA ↔ KUMA) & Mode Hors-Ligne</span>
              </div>
              <span className="bg-amber-400 text-emerald-950 px-2.5 py-0.5 rounded-full font-black text-xs">
                Zero Cloud Vendor Lock-in
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              L'application <strong>KUMA</strong> est conçue pour fonctionner de manière totalement autonome : les applications KUMA communiquent <strong>directement entre elles (Pair-à-Pair)</strong> sans dépendre d'une infrastructure centrale vulnérable. En cas d'absence d'Internet (zones blanches ou coupure réseau), KUMA bascule en <strong>mode Hors-Ligne</strong> avec persistance locale intégrale et file d'attente (Outbox) synchronisée dès reconnexion ou via réseau maillé local <strong>KUMA Mesh</strong> (Wi-Fi Direct / Bluetooth / BroadcastChannel).
            </p>
          </div>

          {/* 3 Pillars of KUMA Autonomy */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pillar 1: P2P Communication */}
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>1. Protocole P2P KUMA ↔ KUMA</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Transmission directe de messages chiffrés E2EE, d'accusés de réception, de signaux d'appels WebRTC et de statuts entre instances KUMA via canaux locaux sécurisés et WebRTC DataChannels.
              </p>
              <div className="text-[11px] font-mono text-emerald-300 bg-slate-900 p-2 rounded-lg border border-slate-700">
                Protocole: KUMA-E2EE-P2P (Double Ratchet)
              </div>
            </div>

            {/* Pillar 2: Local Database */}
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Database className="w-4 h-4 text-amber-400" />
                <span>2. Base Locale SQLite / IndexedDB</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Toutes les discussions, contacts, historiques d'appels et notes vocales sont stockés 100% sur la mémoire de l'appareil. L'utilisateur garde la souveraineté totale de ses données.
              </p>
              <div className="text-[11px] font-mono text-emerald-300 bg-slate-900 p-2 rounded-lg border border-slate-700">
                Stockage: SQLite Chiffré AES-256
              </div>
            </div>

            {/* Pillar 3: Offline Outbox Queue */}
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Zap className="w-4 h-4 text-cyan-300" />
                <span>3. File d'Attente Store-and-Forward</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Les messages écrits sans réseau sont conservés avec horodatage dans l'Outbox (état 🕒 <code className="text-amber-300">pending_offline</code>) et expédiés automatiquement dès le retour du réseau (2G/3G/4G/5G/Starlink/InfiniG).
              </p>
              <div className="text-[11px] font-mono text-emerald-300 bg-slate-900 p-2 rounded-lg border border-slate-700">
                Auto-Sync: Priorité 2G & Relais Mesh
              </div>
            </div>
          </div>

          {/* Offline Mesh Flow Schema */}
          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
            <h3 className="font-extrabold text-sm text-amber-300 flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              Fonctionnement Détaillé du Mode Hors-Ligne & Relais KUMA Mesh
            </h3>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-2 text-slate-200">
              <div className="text-emerald-400 font-bold">1. Mode Hors-Ligne Déclenché (Réseau coupé ou Manuel) :</div>
              <div className="pl-4 text-slate-300">
                → L'application KUMA reste totalement réactive : enregistrement audio Opus, rédaction de messages, consultation de l'historique.<br />
                → Les messages reçoivent le badge 🕒 "En attente locale (Outbox)".
              </div>

              <div className="text-amber-400 font-bold mt-2">2. Détection d'un pair KUMA de proximité (KUMA Mesh P2P) :</div>
              <div className="pl-4 text-slate-300">
                → Les téléphones KUMA proches (rayon de 50m) se découvrent mutuellement via Wi-Fi Direct / Local Broadcast.<br />
                → Les messages destinés aux pairs locaux sont transmis directement de téléphone à téléphone sans passer par Internet !
              </div>

              <div className="text-cyan-400 font-bold mt-2">3. Reconnexion Réseau (2G, 3G, 4G, 5G, Starlink, ∞G) :</div>
              <div className="pl-4 text-slate-300">
                → Le moteur d'envoi différé (Outbox Flusher) dépile automatiquement la file d'attente.<br />
                → Les accusés de réception passent en ✓ (Envoyé) puis ✓✓ (Délivré et Lu).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1 (PLAYSTORE & WEB APP MANIFEST) */}
      {activeTab === 'playstore' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Header Specs summary */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 p-4 rounded-2xl border border-emerald-700 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>Web App Manifest conforme Google Play Store (.AAB & TWA)</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Package ID: <span className="font-mono text-amber-300">{ANDROID_PLAYSTORE_CONFIG.applicationId}</span> • Target API 34 (Android 14) • Version: {ANDROID_PLAYSTORE_CONFIG.versionName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-800 text-amber-300 border border-amber-400/40 font-bold text-xs px-3 py-1.5 rounded-xl shadow-inner flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                TWA / PWA / Bubblewrap Ready
              </span>
            </div>
          </div>

          {/* Sub-navigation for Play Store files */}
          <div className="flex flex-wrap gap-2 bg-slate-800 p-2 rounded-xl border border-slate-700">
            <button
              onClick={() => setPlaystoreSubTab('manifest')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                playstoreSubTab === 'manifest' ? 'bg-amber-400 text-emerald-950 shadow-md' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>manifest.json (Web Manifest)</span>
            </button>
            <button
              onClick={() => setPlaystoreSubTab('cli_guide')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                playstoreSubTab === 'cli_guide' ? 'bg-amber-400 text-emerald-950 shadow-md' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Guide Génération .AAB (CLI)</span>
            </button>
            <button
              onClick={() => setPlaystoreSubTab('assetlinks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                playstoreSubTab === 'assetlinks' ? 'bg-amber-400 text-emerald-950 shadow-md' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>assetlinks.json (Digital Asset Links)</span>
            </button>
            <button
              onClick={() => setPlaystoreSubTab('android_manifest')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                playstoreSubTab === 'android_manifest' ? 'bg-amber-400 text-emerald-950 shadow-md' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>AndroidManifest.xml</span>
            </button>
          </div>

          {/* 1. MANIFEST.JSON VIEW */}
          {playstoreSubTab === 'manifest' && (
            <div className="space-y-3">
              <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-amber-300 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-emerald-400" />
                      Fichier Web App Manifest (/public/manifest.json)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Conforme aux critères officiels W3C et Google Play Store pour l'encapsulation Trusted Web Activity (TWA) et Bubblewrap.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(WEB_APP_MANIFEST_JSON, 'manifest')}
                      className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-xs px-2.5 py-1.5 rounded-lg font-bold transition-colors"
                    >
                      {copiedKey === 'manifest' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'manifest' ? 'Copié !' : 'Copier JSON'}</span>
                    </button>
                    <button
                      onClick={() => handleDownloadFile('manifest.json', WEB_APP_MANIFEST_JSON)}
                      className="flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs px-2.5 py-1.5 rounded-lg font-bold transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger manifest.json</span>
                    </button>
                  </div>
                </div>

                {/* Validation checklist */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900/90 p-3 rounded-xl border border-slate-700 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Display: standalone</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Icônes Maskable & Any</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Shortcuts Mali (Clavier/Wave)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>ID Unique Play Store</span>
                  </div>
                </div>

                <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-96">
                  {WEB_APP_MANIFEST_JSON}
                </pre>
              </div>
            </div>
          )}

          {/* 2. CLI GENERATION GUIDE VIEW */}
          {playstoreSubTab === 'cli_guide' && (
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <h3 className="font-extrabold text-sm text-amber-300 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  Comment générer le fichier .AAB officiel avec Bubblewrap CLI
                </h3>
                <button
                  onClick={() => handleCopy(BUBBLEWRAP_AAB_CLI_COMMANDS, 'cli')}
                  className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-xs px-2.5 py-1.5 rounded-lg font-bold"
                >
                  {copiedKey === 'cli' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copier les commandes</span>
                </button>
              </div>

              <div className="text-xs text-slate-300 space-y-2">
                <p>
                  <strong>Bubblewrap</strong> est l'outil officiel open-source recommandé par Google Chrome et Google Play pour transformer un Web App Manifest en un <strong>Android App Bundle (.AAB)</strong> natif sans écrire une ligne de code Java/Kotlin.
                </p>
              </div>

              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-amber-300 overflow-x-auto leading-relaxed">
                {BUBBLEWRAP_AAB_CLI_COMMANDS}
              </pre>

              {/* Steps overview */}
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-xs text-emerald-300">Étapes de Publication sur Google Play Console :</h4>
                <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 pl-2">
                  <li>Ouvrez votre console Google Play Developer (<code className="text-amber-300">play.google.com/console</code>).</li>
                  <li>Créez une nouvelle application avec le nom <code className="text-amber-300">KUMA - Messagerie Vocale & Fast Data Mali</code>.</li>
                  <li>Dans la section <em>Production</em> ou <em>Tests fermés</em>, téléversez le fichier <code className="text-emerald-400">app-release-signed.aab</code>.</li>
                  <li>Déployez le fichier <code className="text-cyan-300">/.well-known/assetlinks.json</code> sur votre serveur web pour supprimer la barre d'adresse URL.</li>
                </ol>
              </div>
            </div>
          )}

          {/* 3. ASSETLINKS.JSON VIEW */}
          {playstoreSubTab === 'assetlinks' && (
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <div>
                  <h3 className="font-extrabold text-sm text-amber-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Digital Asset Links (/.well-known/assetlinks.json)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Fichier indispensable pour prouver à Android que votre domaine web et votre package AAB appartiennent au même éditeur.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(DIGITAL_ASSET_LINKS_JSON, 'assetlinks')}
                  className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-xs px-2.5 py-1.5 rounded-lg font-bold"
                >
                  {copiedKey === 'assetlinks' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copier JSON</span>
                </button>
              </div>

              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                {DIGITAL_ASSET_LINKS_JSON}
              </pre>
            </div>
          )}

          {/* 4. ANDROID MANIFEST & PERMISSIONS VIEW */}
          {playstoreSubTab === 'android_manifest' && (
            <div className="space-y-4">
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
                  <button
                    onClick={() => handleCopy(ANDROID_MANIFEST_XML, 'android_manifest')}
                    className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-xs px-2.5 py-1 rounded-lg font-bold"
                  >
                    {copiedKey === 'android_manifest' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copier</span>
                  </button>
                </div>
                <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-56">
                  {ANDROID_MANIFEST_XML}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RECOMMENDED TECH STACK */}
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
                    <strong className="text-white">Elixir / Erlang OTP (Phoenix Framework)</strong> ou <strong className="text-white">Go (Golang)</strong>: Moteur de messagerie distribué ultra-robuste avec gestion native de millions de connexions concurrentes.
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

      {/* TAB 3: GLOBAL ARCHITECTURE FLOW */}
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

      {/* TAB 4: DATABASE SCHEMA INSPECTOR */}
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
    </div>
  );
};

