import { AndroidPermissionSpec } from '../types';

export const ANDROID_PLAYSTORE_CONFIG = {
  applicationId: "com.kuma.messagerie.mali",
  versionCode: 100,
  versionName: "1.0.0-MALI",
  minSdkVersion: 21, // Android 5.0 Lollipop (compatibilité maximale téléphones Mali)
  targetSdkVersion: 34, // Android 14 (Conformité requise Google Play Store 2026)
  compileSdkVersion: 34,
  bundleFormat: ".AAB (Android App Bundle)",
  
  appDetails: {
    titleFr: "KUMA - Messagerie Vocale & Fast Data Mali",
    titleBambara: "KUMA - Barokɛlan teliman Mali kənə",
    shortDescription: "L'application de messagerie instantanée ultra-économique conçue pour le Mali. Notes vocales 8kbps, mode 2G/3G, et transferts Mobile Money.",
    fullDescription: `KUMA est l'application de messagerie mobile développée sur mesure pour les besoins réseau et culturels du Mali.

FONCTIONNALITÉS CLÉS :
1. Mode Consommation Réduite (Ultra-Low Data 2G/3G) : Transmettez vos messages et fichiers avec une compression extrême pour économiser jusqu'à 80% de votre forfait Internet.
2. Priorité aux Notes Vocales : Bouton d'enregistrement géant avec compression Codec Opus (8 kbps) et transcription automatique en Bambara et Français.
3. Multilingue Native : Basculez en un clic entre le Français, le Bamanankan (Bambara), le Fulfulde (Peul), le Soninke et le Tamasheq.
4. Raccourcis Mobile Money : Effectuez des transferts d'argent instantanés avec Orange Money, Moov Africa et Wave sans quitter vos discussions.
5. Mode Offline Résilient : Rédigez vos messages sans réseau, ils s'enverront automatiquement dès le retour du réseau.
6. Chiffrement de Bout en Bout (E2EE) : Appels et messages chiffrés avec DTLS-SRTP et Libsignal.`
  }
};

export const WEB_APP_MANIFEST_JSON = `{
  "id": "com.kuma.messagerie.mali",
  "name": "KUMA - Messagerie Vocale & Fast Data Mali",
  "short_name": "KUMA",
  "description": "Application de messagerie instantanée sécurisée et ultra-économique pour le Mali. Notes vocales compressées Opus 8kbps, mode 2G/3G, transferts Mobile Money et appels chiffrés de bout en bout (E2EE).",
  "start_url": "/?utm_source=playstore_aab",
  "scope": "/",
  "display": "standalone",
  "display_override": [
    "window-controls-overlay",
    "standalone",
    "minimal-ui"
  ],
  "orientation": "portrait-primary",
  "background_color": "#022c22",
  "theme_color": "#064e3b",
  "lang": "fr-ML",
  "dir": "ltr",
  "categories": [
    "communication",
    "social",
    "finance",
    "productivity"
  ],
  "iarc_rating_id": "e84b072d-71b3-4d3e-86ae-31a8ce4e53b7",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icons/icon-192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512.svg",
      "sizes": "512x512",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ],
  "shortcuts": [
    {
      "name": "Nouveau Message",
      "short_name": "Nouveau",
      "description": "Démarrer une conversation instantanée KUMA",
      "url": "/?action=new_chat",
      "icons": [{ "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" }]
    },
    {
      "name": "Composer Numéro",
      "short_name": "Clavier",
      "description": "Composer un numéro de téléphone malien (+223)",
      "url": "/?action=dialer",
      "icons": [{ "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" }]
    },
    {
      "name": "Transfert Mobile Money",
      "short_name": "SARA",
      "description": "Orange Money, Moov Money, Wave Mali",
      "url": "/?action=mobile_money",
      "icons": [{ "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" }]
    },
    {
      "name": "Appels Sécurisés E2EE",
      "short_name": "Appels",
      "description": "Appels audio 2G Opus & vidéo chiffrés",
      "url": "/?action=calls",
      "icons": [{ "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" }]
    }
  ],
  "screenshots": [
    {
      "src": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=720&auto=format&fit=crop&q=80",
      "sizes": "720x1280",
      "type": "image/jpeg",
      "form_factor": "narrow",
      "label": "Messagerie instantanée vocale et texte KUMA Mali"
    },
    {
      "src": "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=1280&auto=format&fit=crop&q=80",
      "sizes": "1280x720",
      "type": "image/jpeg",
      "form_factor": "wide",
      "label": "Interface KUMA sur tablette et grand écran"
    }
  ],
  "related_applications": [
    {
      "platform": "play",
      "url": "https://play.google.com/store/apps/details?id=com.kuma.messagerie.mali",
      "id": "com.kuma.messagerie.mali"
    }
  ],
  "prefer_related_applications": false,
  "share_target": {
    "action": "/?action=share",
    "method": "GET",
    "enctype": "application/x-www-form-urlencoded",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url"
    }
  }
}`;

export const DIGITAL_ASSET_LINKS_JSON = `[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.kuma.messagerie.mali",
      "sha256_cert_fingerprints": [
        "8A:2F:3C:9B:4D:1E:5F:70:9A:B3:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78"
      ]
    }
  }
]`;

export const BUBBLEWRAP_AAB_CLI_COMMANDS = `# 1. Installer l'outil officiel Google pour générer les fichiers .AAB depuis le Web Manifest
npm install -g @bubblewrap/cli

# 2. Initialiser le projet Android Bundle avec votre manifest.json
bubblewrap init --manifest=https://kuma-mali.app/manifest.json

# 3. Compiler l'Android App Bundle (.AAB) optimisé et signé pour Google Play Console
bubblewrap build

# 4. Le fichier généré 'app-release-signed.aab' est prêt à être téléversé dans Google Play Console !`;

export const REQUIRED_ANDROID_PERMISSIONS: AndroidPermissionSpec[] = [
  {
    permission: "android.permission.RECORD_AUDIO",
    purpose: "Capture des notes vocales Opus et appels audio WebRTC",
    requiredForPlayStore: true
  },
  {
    permission: "android.permission.CAMERA",
    purpose: "Appels vidéo WebRTC et prise de photos de profil / statut",
    requiredForPlayStore: true
  },
  {
    permission: "android.permission.READ_CONTACTS",
    purpose: "Synchronisation des contacts téléphoniques (+223 Mali) pour démarrer des conversations",
    requiredForPlayStore: true
  },
  {
    permission: "android.permission.POST_NOTIFICATIONS",
    purpose: "Notifications Push pour les messages entrants et appels WebRTC",
    requiredForPlayStore: true
  },
  {
    permission: "android.permission.INTERNET",
    purpose: "Connexion aux serveurs WebSocket, MQTT et Firebase",
    requiredForPlayStore: true
  },
  {
    permission: "android.permission.ACCESS_NETWORK_STATE",
    purpose: "Détection automatique du type de réseau (2G / 3G / 4G / Offline) pour la compression adaptative",
    requiredForPlayStore: true
  },
  {
    permission: "android.permission.VIBRATE",
    purpose: "Retour haptique lors du maintien du bouton de note vocale et réception d'appels",
    requiredForPlayStore: false
  }
];

export const ANDROID_MANIFEST_XML = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.kuma.messagerie.mali">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_CONTACTS" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="false">

        <!-- Activity Principale KUMA -->
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|layoutDirection"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Service Firebase Cloud Messaging pour Appels & Messages -->
        <service
            android:name=".services.KumaFcmService"
            android:exported="false">
            <intent-filter>
                <action android:name="com.google.firebase.MESSAGING_EVENT" />
            </intent-filter>
        </service>

    </application>
</manifest>`;
