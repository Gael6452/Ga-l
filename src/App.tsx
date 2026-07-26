import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ScoutForm } from "./components/ScoutForm";
import { Results } from "./components/Results";
import { CollectionPanel } from "./components/CollectionPanel";
import { WeightsControl } from "./components/WeightsControl";
import { useTheme } from "./hooks/useTheme";
import { useCollection } from "./hooks/useCollection";
import { useWeights } from "./hooks/useWeights";
import { STRINGS, type Lang } from "./i18n";
import { recommend, type RecommendationMode } from "./services/recommend";
import { clearSharedToolkit, parseSharedToolkit } from "./services/share";
import type { ProfileInput, Tool } from "./types";

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [lang, setLang] = useState<Lang>("en");
  const collection = useCollection();
  const weightsState = useWeights();

  const [tools, setTools] = useState<Tool[]>([]);
  const [mode, setMode] = useState<RecommendationMode>("demo");
  const [loading, setLoading] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);

  const t = STRINGS[lang];

  // Import a shared toolkit from the URL hash on first load.
  useEffect(() => {
    const shared = parseSharedToolkit();
    if (shared && shared.length > 0) {
      shared.forEach((tool) => collection.add(tool));
      clearSharedToolkit();
      setCollectionOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(profile: ProfileInput) {
    setLoading(true);
    try {
      const result = await recommend(profile);
      setTools(result.tools);
      setMode(result.mode);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <Header
        lang={lang}
        onToggleLang={() => setLang((l) => (l === "en" ? "fr" : "en"))}
        theme={theme}
        onToggleTheme={toggleTheme}
        collectionCount={collection.items.length}
        onOpenCollection={() => setCollectionOpen(true)}
      />

      <main className="container">
        <Hero t={t} />
        <ScoutForm t={t} loading={loading} onSubmit={handleSubmit} />
        {tools.length > 0 && <WeightsControl t={t} state={weightsState} />}
        <Results
          t={t}
          tools={tools}
          mode={mode}
          isSaved={collection.has}
          onToggleSave={collection.toggle}
          weights={weightsState.weights}
        />
      </main>

      <footer className="footer">
        <span>AI Scout · {t.poweredBy}</span>
      </footer>

      {collectionOpen && (
        <CollectionPanel
          t={t}
          collection={collection}
          onClose={() => setCollectionOpen(false)}
          weights={weightsState.weights}
        />
      )}
    </div>
  );
}
