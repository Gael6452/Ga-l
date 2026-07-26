export type Lang = "en" | "fr";

export interface Strings {
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  currentStatus: string;
  currentStatusPlaceholder: string;
  expectedPosition: string;
  expectedPositionPlaceholder: string;
  dreamJob: string;
  dreamJobPlaceholder: string;
  submit: string;
  submitting: string;
  resultsTitle: string;
  effectiveness: string;
  cost: string;
  safety: string;
  globalScore: string;
  howToUse: string;
  visit: string;
  demoNotice: string;
  errorNotice: string;
  emptyStatusError: string;
  poweredBy: string;
  // Collection ("My toolkit")
  save: string;
  saved: string;
  myToolkit: string;
  collectionEmpty: string;
  addCustom: string;
  addCustomTitle: string;
  toolName: string;
  toolUrl: string;
  toolCategory: string;
  add: string;
  remove: string;
  close: string;
  invalidCustom: string;
  share: string;
  linkCopied: string;
  shareEmpty: string;
  imported: string;
  priorities: string;
  prioritiesHint: string;
  reset: string;
  low: string;
  high: string;
}

export const STRINGS: Record<Lang, Strings> = {
  en: {
    heroTitle1: "Your Career,",
    heroTitle2: "Powered by AI.",
    heroSubtitle:
      "Find the perfect AI toolkit to bridge the gap between where you are and where you want to be.",
    currentStatus: "Current status",
    currentStatusPlaceholder: "e.g. Student, Chef…",
    expectedPosition: "Expected position",
    expectedPositionPlaceholder: "e.g. Junior Dev…",
    dreamJob: "Dream job",
    dreamJobPlaceholder: "e.g. Data Analyst… (optional)",
    submit: "Find my AI toolkit",
    submitting: "Scouting the best tools…",
    resultsTitle: "Your recommended AI toolkit",
    effectiveness: "Effectiveness",
    cost: "Value for cost",
    safety: "Data safety",
    globalScore: "Global score",
    howToUse: "How to use it",
    visit: "Visit",
    demoNotice:
      "Demo mode: results come from a curated offline database. Add a Gemini API key to generate live recommendations.",
    errorNotice:
      "Couldn't reach the AI service, so here are curated recommendations instead.",
    emptyStatusError: "Tell us at least your current status or the position you're aiming for.",
    poweredBy: "Powered by AI",
    save: "Save",
    saved: "Saved",
    myToolkit: "My toolkit",
    collectionEmpty: "Your toolkit is empty. Save recommended tools or add your own websites and apps.",
    addCustom: "Add a website or app",
    addCustomTitle: "Add your own",
    toolName: "Name",
    toolUrl: "URL",
    toolCategory: "Category",
    add: "Add",
    remove: "Remove",
    close: "Close",
    invalidCustom: "Give at least a name and a valid URL.",
    share: "Share toolkit",
    linkCopied: "Share link copied to clipboard!",
    shareEmpty: "Add some tools before sharing.",
    imported: "Imported a shared toolkit into yours.",
    priorities: "Your priorities",
    prioritiesHint: "Set how much each factor matters. Scores and ranking adapt to you.",
    reset: "Reset",
    low: "Low",
    high: "High",
  },
  fr: {
    heroTitle1: "Votre carrière,",
    heroTitle2: "Propulsée par l'IA.",
    heroSubtitle:
      "Trouvez la boîte à outils IA idéale pour combler l'écart entre où vous êtes et où vous voulez aller.",
    currentStatus: "Situation actuelle",
    currentStatusPlaceholder: "ex. Étudiant, Cuisinier…",
    expectedPosition: "Poste visé",
    expectedPositionPlaceholder: "ex. Développeur junior…",
    dreamJob: "Job de rêve",
    dreamJobPlaceholder: "ex. Data Analyst… (optionnel)",
    submit: "Trouver ma boîte à outils IA",
    submitting: "Recherche des meilleurs outils…",
    resultsTitle: "Votre boîte à outils IA recommandée",
    effectiveness: "Efficacité",
    cost: "Rapport coût/valeur",
    safety: "Sécurité des données",
    globalScore: "Note globale",
    howToUse: "Comment l'utiliser",
    visit: "Ouvrir",
    demoNotice:
      "Mode démo : les résultats viennent d'une base d'outils curée hors-ligne. Ajoutez une clé API Gemini pour des recommandations en direct.",
    errorNotice:
      "Impossible de joindre le service IA, voici des recommandations curées à la place.",
    emptyStatusError: "Indiquez au moins votre situation actuelle ou le poste que vous visez.",
    poweredBy: "Propulsé par l'IA",
    save: "Enregistrer",
    saved: "Enregistré",
    myToolkit: "Ma boîte à outils",
    collectionEmpty: "Votre boîte à outils est vide. Enregistrez des outils recommandés ou ajoutez vos propres sites et applis.",
    addCustom: "Ajouter un site ou une appli",
    addCustomTitle: "Ajoutez le vôtre",
    toolName: "Nom",
    toolUrl: "URL",
    toolCategory: "Catégorie",
    add: "Ajouter",
    remove: "Retirer",
    close: "Fermer",
    invalidCustom: "Indiquez au moins un nom et une URL valide.",
    share: "Partager la boîte",
    linkCopied: "Lien de partage copié dans le presse-papiers !",
    shareEmpty: "Ajoutez des outils avant de partager.",
    imported: "Une boîte à outils partagée a été importée dans la vôtre.",
    priorities: "Vos priorités",
    prioritiesHint: "Réglez l'importance de chaque critère. Les notes et le classement s'adaptent à vous.",
    reset: "Réinitialiser",
    low: "Faible",
    high: "Élevée",
  },
};
