import { Language } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  chats: string;
  contacts: string;
  addContact: string;
  status: string;
  calls: string;
  architecture: string;
  settings: string;
  recordVoiceNote: string;
  tapToRecord: string;
  holdToRecord: string;
  recording: string;
  send: string;
  lowDataMode: string;
  ultraLowData: string;
  offlineMode: string;
  onlineMode: string;
  mobileMoney: string;
  transferMoney: string;
  sendFcfa: string;
  orangeMoney: string;
  moovMoney: string;
  waveMali: string;
  encryptedE2E: string;
  transcribing: string;
  bambaraTranscript: string;
  frenchTranscript: string;
  network2GNotice: string;
  queuedForSync: string;
  compressionSaved: string;
  audioCall2G: string;
  groupAdmins: string;
  newChat: string;
  voiceNotePriority: string;
}

export const translations: Record<Language, Translations> = {
  fr: {
    appName: "KUMA",
    tagline: "Messagerie Rapide & Economique du Mali",
    chats: "Discussions",
    contacts: "Contacts",
    addContact: "Nouveau Contact",
    status: "Statuts",
    calls: "Appels",
    architecture: "Architecture & BDD",
    settings: "Paramètres Low-Data",
    recordVoiceNote: "Note vocale",
    tapToRecord: "Appuyez pour parler",
    holdToRecord: "Maintenir pour enregistrer",
    recording: "Enregistrement en cours...",
    send: "Envoyer",
    lowDataMode: "Mode Economie 3G/2G",
    ultraLowData: "Mode Réseau Faible (2G)",
    offlineMode: "Hors-ligne (Envoi différé)",
    onlineMode: "Connecté au réseau",
    mobileMoney: "Mobile Money",
    transferMoney: "Transfert rapide FCFA",
    sendFcfa: "Envoyer FCFA",
    orangeMoney: "Orange Money Mali",
    moovMoney: "Moov Africa Mali",
    waveMali: "Wave Mali",
    encryptedE2E: "Chiffré de bout en bout (KUMA E2EE)",
    transcribing: "Transcription vocale IA...",
    bambaraTranscript: "Transcription Bambara",
    frenchTranscript: "Traduction Française",
    network2GNotice: "Réseau 2G détecté : compression audio max (8 kbps Opus)",
    queuedForSync: "Message sauvegardé localement (s'enverra au retour du réseau)",
    compressionSaved: "Données économisées",
    audioCall2G: "Appel audio ultra-léger (2G)",
    groupAdmins: "Administrateurs du groupe",
    newChat: "Nouvelle discussion",
    voiceNotePriority: "Mode Note Vocale Prioritaire"
  },
  bm: {
    appName: "KUMA",
    tagline: "Mali kənə barokɛlan teliman n'a sɔngɔ dɔgɔman",
    chats: "Kuma-so",
    contacts: "Mɔgɔw",
    addContact: "Mɔgɔ kura fara a kan",
    status: "Kibaru-Lakan",
    calls: "Wele-wele",
    architecture: "Sistɛmu Dabali",
    settings: "Reso-dɔgɔ labɛn",
    recordVoiceNote: "Kuma-lama minɛ",
    tapToRecord: "A digi ka kuma",
    holdToRecord: "A minɛ ka kuma",
    recording: "Kuma bɛ minɛna...",
    send: "A ci",
    lowDataMode: "Rɛso dɔgɔman (2G/3G)",
    ultraLowData: "Rɛso gɛlɛn sariyaw",
    offlineMode: "Rɛso tɛ (Sigi-ka-ci)",
    onlineMode: "Rɛso bɛ yen",
    mobileMoney: "Wari Ci",
    transferMoney: "Wari teliman ci FCFA",
    sendFcfa: "Wari ci FCFA",
    orangeMoney: "Orange Money Mali",
    moovMoney: "Moov Africa Mali",
    waveMali: "Wave Mali",
    encryptedE2E: "Gundolakənə kuma (KUMA E2EE)",
    transcribing: "Kuma sɛbɛnna...",
    bambaraTranscript: "Bamanankan sɛbɛnni",
    frenchTranscript: "Tubabukan bayɛlɛman",
    network2GNotice: "Rɛso dɔgɔman bɛ yen: Kuma bɛ dɔgɔya k'a to 8 kbps",
    queuedForSync: "Kuma mara la, rɛso nani a bɛ ci",
    compressionSaved: "Donne mara-len",
    audioCall2G: "Kuma wele-wele dɔgɔman (2G)",
    groupAdmins: "Kulu kuntigiw",
    newChat: "Kuma-so kura",
    voiceNotePriority: "Kuma-lama fɔlɔ-fɔlɔ"
  },
  ff: {
    appName: "KUMA",
    tagline: "Noldu e Wawtu do Mali",
    chats: "Haalaaji",
    contacts: "Yimɓe",
    addContact: "Ɓeydu Neɗɗo Keso",
    status: "Mbaydi",
    calls: "Noddaali",
    architecture: "Mahdi Sisteem",
    settings: "Teeltagol Datte",
    recordVoiceNote: "Winndu Sawtu",
    tapToRecord: "Mebbo fiɓo haala",
    holdToRecord: "Jogito ngam haalde",
    recording: "Sawtu ina nanngaa...",
    send: "Noddu / Neldoy",
    lowDataMode: "Datte Pamare (2G/3G)",
    ultraLowData: "Mbaydi Sakkitotoonde",
    offlineMode: "Ressoo Ala (Neldat so arii)",
    onlineMode: "Ina Jokkii",
    mobileMoney: "Kalis Kaŋe",
    transferMoney: "Neldu Kalis FCFA",
    sendFcfa: "Neldu FCFA",
    orangeMoney: "Orange Money Mali",
    moovMoney: "Moov Africa Mali",
    waveMali: "Wave Mali",
    encryptedE2E: "Sirluudinaaɗo (KUMA E2EE)",
    transcribing: "Firde sawtu...",
    bambaraTranscript: "Mbaydi Bamanankan",
    frenchTranscript: "Mbaydi Faransi",
    network2GNotice: "Ressoo 2G ina woodi: Sawtu ina famɗinaa",
    queuedForSync: "Noldu ina moftaa so ressoo warti ina neldoo",
    compressionSaved: "Datte moftaama",
    audioCall2G: "Noddaango sawtu pamaro",
    groupAdmins: "Ardooɓe fedde",
    newChat: "Haala kesa",
    voiceNotePriority: "Ardiingol Sawtu"
  },
  sn: {
    appName: "KUMA",
    tagline: "Mali xaran-kommo yaxare kinne",
    chats: "Kili-kili",
    contacts: "Moxonnu",
    addContact: "Moxon Kura",
    status: "Xaibarunu",
    calls: "Cilagunu",
    architecture: "Sistem-Maxa",
    settings: "Datte Laxo",
    recordVoiceNote: "Xalisi Kinne",
    tapToRecord: "A dooxu ka xali",
    holdToRecord: "A muru ka kinne",
    recording: "Kinne mulla...",
    send: "A doori",
    lowDataMode: "Datte Doxu (2G/3G)",
    ultraLowData: "Datte Kitu Mode",
    offlineMode: "Reso Yaa (Malla kille)",
    onlineMode: "Reso Xa dooxu",
    mobileMoney: "Xalisi Doori",
    transferMoney: "Xalisi Doori FCFA",
    sendFcfa: "Doori FCFA",
    orangeMoney: "Orange Money Mali",
    moovMoney: "Moov Africa Mali",
    waveMali: "Wave Mali",
    encryptedE2E: "Gundori (KUMA E2EE)",
    transcribing: "Kinne safari...",
    bambaraTranscript: "Bambara kinne",
    frenchTranscript: "Tubabu kinne",
    network2GNotice: "Reso 2G kitsu: Kinne doxu mulla",
    queuedForSync: "Xalisi safari mara, reso nani a doori",
    compressionSaved: "Datte mara",
    audioCall2G: "Kinne cilagu doxu",
    groupAdmins: "Kappan-fatanu",
    newChat: "Kili kura",
    voiceNotePriority: "Kinne fula-fula"
  },
  tm: {
    appName: "KUMA",
    tagline: "Awal wa Awal en Mali",
    chats: "Isalan",
    contacts: "Middawen",
    addContact: "Ernu Amadduy",
    status: "Taneft",
    calls: "Tighriwin",
    architecture: "Mazen n Sistem",
    settings: "Sinet n Datte",
    recordVoiceNote: "Awal n Imeslan",
    tapToRecord: "Akteb f awal",
    holdToRecord: "Ettew ka awal",
    recording: "Awal ikssad...",
    send: "Azen",
    lowDataMode: "Data Mawan (2G/3G)",
    ultraLowData: "Réseau Imidi",
    offlineMode: "War-Réseau (Azen ad yewḍ)",
    onlineMode: "Réseau illa",
    mobileMoney: "Idrimen Mobile",
    transferMoney: "Azen Idrimen FCFA",
    sendFcfa: "Azen FCFA",
    orangeMoney: "Orange Money Mali",
    moovMoney: "Moov Africa Mali",
    waveMali: "Wave Mali",
    encryptedE2E: "Intal (KUMA E2EE)",
    transcribing: "Awal ittyattab...",
    bambaraTranscript: "Tasebna-t n Bambara",
    frenchTranscript: "Tasuqilt n Tafransist",
    network2GNotice: "Réseau 2G: Awal fesaw 8 kbps",
    queuedForSync: "Inisli ittyattab, network ad yas ad yazen",
    compressionSaved: "Data ittyagzem",
    audioCall2G: "Tighri n awal mawan",
    groupAdmins: "Imgharen n Tarwa",
    newChat: "Inisli amayyn",
    voiceNotePriority: "Awal n imeslan tazwara"
  }
};
