import type { Strings } from "../i18n";
import { weightedScore, type Tool, type Weights } from "../types";
import type { RecommendationMode } from "../services/recommend";
import { ToolCard } from "./ToolCard";

interface Props {
  t: Strings;
  tools: Tool[];
  mode: RecommendationMode;
  isSaved: (id: string) => boolean;
  onToggleSave: (tool: Tool) => void;
  weights: Weights;
}

export function Results({ t, tools, mode, isSaved, onToggleSave, weights }: Props) {
  if (tools.length === 0) return null;

  const ranked = [...tools].sort(
    (a, b) => weightedScore(b.scores, weights) - weightedScore(a.scores, weights),
  );

  return (
    <section className="results">
      {mode === "demo" && <p className="notice">{t.demoNotice}</p>}
      {mode === "error" && <p className="notice warn">{t.errorNotice}</p>}

      <h2 className="results-title">{t.resultsTitle}</h2>

      <div className="tool-grid">
        {ranked.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            t={t}
            saved={isSaved(tool.id)}
            onToggleSave={onToggleSave}
            weights={weights}
          />
        ))}
      </div>
    </section>
  );
}
