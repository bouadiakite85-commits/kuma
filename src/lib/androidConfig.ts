import { AndroidPermissionSpec } from '../types';

export const ANDROID_PLAYSTORE_CONFIG = {
  applicationId: "com.kuma.messagerie.mali",
  versionCode: 100,
  versionName: "1.0.0-MALI",
  minSdkVersion: 21, // Android 5.0 Lollipop (compatibilité maximale téléphones Mali)
  targetSdkVersion: 34, // Android 14 (Conformité requise Google Play Store 2026)
  compileSdkVersion: 34,
  
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
5. Mode Offline Résilient : Rédigez vos messages sans réseau, ils s'enverront automatiquement dès le retour du réseau.`
  }
};

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
