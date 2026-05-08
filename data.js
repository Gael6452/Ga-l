// FindMyAI — base de connaissances
// Chaque outil :
//  price: 'free' | 'freemium' | 'cheap'
//  flags: ensemble de drapeaux pour filtrer
//    - 'private'  : on-device / open-source / pas d'entraînement sur vos données
//    - 'eu'       : entreprise ou hébergement européen (RGPD)
//    - 'offline'  : peut tourner sans Internet
//    - 'hidden'   : alternative peu connue (pas ChatGPT/Gemini/Copilot)
//  jobs: liste de métiers concernés
//  why : pourquoi on le recommande pour ce profil

window.JOBS = [
  { id: "dev",        label: "Développeur·euse" },
  { id: "design",     label: "Designer / Graphiste" },
  { id: "writer",     label: "Rédacteur·trice / Journaliste" },
  { id: "teacher",    label: "Enseignant·e" },
  { id: "student",    label: "Étudiant·e" },
  { id: "researcher", label: "Chercheur·euse" },
  { id: "marketer",   label: "Marketing / Communication" },
  { id: "translator", label: "Traducteur·trice" },
  { id: "lawyer",     label: "Juriste / Avocat·e" },
  { id: "doctor",     label: "Santé / Médecine" },
  { id: "finance",    label: "Comptable / Finance" },
  { id: "sales",      label: "Commercial·e" },
  { id: "support",    label: "Service client" },
  { id: "video",      label: "Vidéaste / Monteur·euse" },
  { id: "photo",      label: "Photographe" },
  { id: "music",      label: "Musicien·ne" },
  { id: "hr",         label: "RH / Recrutement" },
  { id: "pm",         label: "Chef·fe de projet" },
  { id: "data",       label: "Analyste de données" },
  { id: "artisan",    label: "Artisan / TPE" },
];

window.TOOLS = [
  // ---------- Polyvalents ----------
  {
    name: "Le Chat (Mistral)",
    url: "https://chat.mistral.ai",
    price: "freemium",
    flags: ["eu", "hidden"],
    jobs: ["writer", "marketer", "teacher", "student", "lawyer", "hr", "support", "sales", "pm", "finance", "artisan"],
    why: "Assistant français, hébergé en Europe, gratuit et rapide.",
  },
  {
    name: "HuggingChat",
    url: "https://huggingface.co/chat",
    price: "free",
    flags: ["private", "hidden"],
    jobs: ["writer", "student", "teacher", "researcher", "marketer", "support", "hr", "pm"],
    why: "Modèles open-source, sans collecte abusive, plusieurs IA au choix.",
  },
  {
    name: "Perplexity",
    url: "https://www.perplexity.ai",
    price: "freemium",
    jobs: ["researcher", "student", "marketer", "sales", "pm", "writer"],
    why: "Réponses sourcées avec citations — idéal pour vérifier l'info.",
  },
  {
    name: "Ollama (local)",
    url: "https://ollama.com",
    price: "free",
    flags: ["private", "offline", "hidden"],
    jobs: ["dev", "researcher", "writer", "lawyer", "doctor", "finance"],
    why: "Tourne 100 % en local sur votre machine — vos données ne sortent jamais.",
  },
  {
    name: "NotebookLM",
    url: "https://notebooklm.google",
    price: "free",
    jobs: ["student", "teacher", "researcher", "lawyer", "writer", "pm"],
    why: "Téléchargez vos PDF/notes, l'IA répond en citant vos documents.",
  },

  // ---------- Développement ----------
  {
    name: "Codeium",
    url: "https://codeium.com",
    price: "free",
    jobs: ["dev"],
    why: "Auto-complétion gratuite illimitée pour tous les IDE.",
  },
  {
    name: "Continue.dev",
    url: "https://continue.dev",
    price: "free",
    flags: ["private", "offline", "hidden"],
    jobs: ["dev"],
    why: "Extension VS Code open-source, branchable sur un modèle local.",
  },
  {
    name: "Tabby",
    url: "https://tabby.tabbyml.com",
    price: "free",
    flags: ["private", "offline", "hidden"],
    jobs: ["dev"],
    why: "Copilote auto-hébergeable — souverain et gratuit.",
  },
  {
    name: "Phind",
    url: "https://www.phind.com",
    price: "freemium",
    flags: ["hidden"],
    jobs: ["dev"],
    why: "Moteur de recherche dédié au code, avec sources.",
  },
  {
    name: "Cursor",
    url: "https://cursor.com",
    price: "freemium",
    jobs: ["dev"],
    why: "Éditeur basé VS Code avec IA intégrée — palier gratuit utile.",
  },

  // ---------- Design / Image ----------
  {
    name: "Krea",
    url: "https://www.krea.ai",
    price: "freemium",
    jobs: ["design", "marketer"],
    why: "Génération et retouche d'image en temps réel — très intuitif.",
  },
  {
    name: "Leonardo.AI",
    url: "https://leonardo.ai",
    price: "freemium",
    jobs: ["design", "marketer", "video"],
    why: "150 crédits gratuits/jour, contrôle fin du style.",
  },
  {
    name: "Ideogram",
    url: "https://ideogram.ai",
    price: "freemium",
    jobs: ["design", "marketer"],
    why: "Excellent pour les images contenant du texte (logos, affiches).",
  },
  {
    name: "Stable Diffusion (local)",
    url: "https://github.com/AUTOMATIC1111/stable-diffusion-webui",
    price: "free",
    flags: ["private", "offline", "hidden"],
    jobs: ["design", "photo", "video"],
    why: "100 % gratuit, vos images restent sur votre machine.",
  },
  {
    name: "Recraft",
    url: "https://www.recraft.ai",
    price: "freemium",
    flags: ["hidden"],
    jobs: ["design"],
    why: "Génère des illustrations vectorielles éditables.",
  },

  // ---------- Écriture / Journalisme ----------
  {
    name: "DeepL Write",
    url: "https://www.deepl.com/write",
    price: "freemium",
    flags: ["eu"],
    jobs: ["writer", "translator", "student", "lawyer", "hr", "marketer"],
    why: "Améliore vos textes en français — éditeur allemand, RGPD.",
  },
  {
    name: "LanguageTool",
    url: "https://languagetool.org",
    price: "freemium",
    flags: ["eu", "private", "hidden"],
    jobs: ["writer", "student", "translator", "lawyer", "hr"],
    why: "Correcteur grammatical européen, version auto-hébergeable.",
  },
  {
    name: "Grammarly",
    url: "https://www.grammarly.com",
    price: "freemium",
    jobs: ["writer", "student", "marketer"],
    why: "Référence pour l'anglais, palier gratuit suffisant.",
  },

  // ---------- Traduction ----------
  {
    name: "DeepL",
    url: "https://www.deepl.com",
    price: "freemium",
    flags: ["eu"],
    jobs: ["translator", "writer", "student", "support", "lawyer"],
    why: "Meilleure qualité française, hébergé en Allemagne.",
  },
  {
    name: "LibreTranslate",
    url: "https://libretranslate.com",
    price: "free",
    flags: ["private", "offline", "hidden"],
    jobs: ["translator", "support"],
    why: "Open-source, installable en local — souverain.",
  },

  // ---------- Recherche / Académique ----------
  {
    name: "Elicit",
    url: "https://elicit.com",
    price: "freemium",
    flags: ["hidden"],
    jobs: ["researcher", "student"],
    why: "Synthétise des articles scientifiques avec citations.",
  },
  {
    name: "Consensus",
    url: "https://consensus.app",
    price: "freemium",
    flags: ["hidden"],
    jobs: ["researcher", "student", "doctor"],
    why: "Cherche un consensus dans les études publiées sur un sujet.",
  },
  {
    name: "Connected Papers",
    url: "https://www.connectedpapers.com",
    price: "freemium",
    flags: ["hidden"],
    jobs: ["researcher", "student"],
    why: "Visualise un graphe d'articles liés à votre publication.",
  },

  // ---------- Vidéo ----------
  {
    name: "CapCut",
    url: "https://www.capcut.com",
    price: "freemium",
    jobs: ["video", "marketer"],
    why: "Sous-titres auto, suppression de fond, gratuit et puissant.",
  },
  {
    name: "Descript",
    url: "https://www.descript.com",
    price: "freemium",
    jobs: ["video", "writer"],
    why: "Édite la vidéo en éditant le texte de la transcription.",
  },
  {
    name: "Whisper (local)",
    url: "https://github.com/openai/whisper",
    price: "free",
    flags: ["private", "offline", "hidden"],
    jobs: ["video", "writer", "researcher", "support"],
    why: "Transcription audio open-source, fonctionne hors-ligne.",
  },

  // ---------- Photo ----------
  {
    name: "Upscayl",
    url: "https://upscayl.org",
    price: "free",
    flags: ["private", "offline", "hidden"],
    jobs: ["photo", "design"],
    why: "Agrandit vos photos sans perte, 100 % local et open-source.",
  },
  {
    name: "GFPGAN",
    url: "https://github.com/TencentARC/GFPGAN",
    price: "free",
    flags: ["private", "offline", "hidden"],
    jobs: ["photo"],
    why: "Restaure les vieux portraits — gratuit, en local.",
  },
  {
    name: "Photopea + IA",
    url: "https://www.photopea.com",
    price: "free",
    flags: ["hidden"],
    jobs: ["photo", "design"],
    why: "Photoshop gratuit dans le navigateur, plug-ins IA disponibles.",
  },

  // ---------- Audio / Musique ----------
  {
    name: "Suno",
    url: "https://suno.com",
    price: "freemium",
    jobs: ["music", "video", "marketer"],
    why: "Génère des morceaux complets avec voix — gratuit chaque jour.",
  },
  {
    name: "Udio",
    url: "https://www.udio.com",
    price: "freemium",
    jobs: ["music"],
    why: "Génération musicale très expressive, palier gratuit.",
  },
  {
    name: "AudioCraft (Meta)",
    url: "https://audiocraft.metademolab.com",
    price: "free",
    flags: ["private", "offline", "hidden"],
    jobs: ["music", "video"],
    why: "Open-source, à installer localement — aucune limite.",
  },

  // ---------- Marketing / Sales ----------
  {
    name: "Canva Magic Studio",
    url: "https://www.canva.com/magic-studio/",
    price: "freemium",
    jobs: ["marketer", "design", "artisan"],
    why: "Visuels, textes, présentations — tout-en-un grand public.",
  },
  {
    name: "Brevo (ex-Sendinblue)",
    url: "https://www.brevo.com",
    price: "freemium",
    flags: ["eu", "hidden"],
    jobs: ["marketer", "sales", "artisan", "support"],
    why: "Emailing avec IA, éditeur français — RGPD natif.",
  },
  {
    name: "Tactiq",
    url: "https://tactiq.io",
    price: "freemium",
    flags: ["hidden"],
    jobs: ["sales", "pm", "support", "hr"],
    why: "Transcrit et résume vos réunions Meet/Zoom/Teams.",
  },

  // ---------- Données / Tableurs ----------
  {
    name: "Rows",
    url: "https://rows.com",
    price: "freemium",
    flags: ["eu", "hidden"],
    jobs: ["data", "marketer", "finance", "pm"],
    why: "Tableur avec IA intégrée, éditeur portugais.",
  },
  {
    name: "Julius",
    url: "https://julius.ai",
    price: "freemium",
    flags: ["hidden"],
    jobs: ["data", "researcher", "finance"],
    why: "Analyse de données par conversation, génère graphes et code.",
  },

  // ---------- Juridique ----------
  {
    name: "Doctrine",
    url: "https://www.doctrine.fr",
    price: "cheap",
    flags: ["eu", "hidden"],
    jobs: ["lawyer"],
    why: "Recherche juridique française, IA pour synthétiser jurisprudence.",
  },
  {
    name: "Lexnow",
    url: "https://www.lexnow.io",
    price: "freemium",
    flags: ["eu", "hidden"],
    jobs: ["lawyer"],
    why: "Assistant juridique français — vérifiez toujours les sources.",
  },

  // ---------- RH ----------
  {
    name: "Teal",
    url: "https://www.tealhq.com",
    price: "freemium",
    flags: ["hidden"],
    jobs: ["hr", "student"],
    why: "Optimise CV et lettres de motivation, palier gratuit utile.",
  },

  // ---------- Santé (prudence) ----------
  {
    name: "OpenEvidence",
    url: "https://www.openevidence.com",
    price: "free",
    flags: ["hidden"],
    jobs: ["doctor"],
    why: "Réservé aux pros de santé — répond avec des sources médicales vérifiées.",
  },
];
