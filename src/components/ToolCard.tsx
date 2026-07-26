import type { Strings } from "../i18n";
import { DEFAULT_WEIGHTS, weightedScore, type Tool, type Weights } from "../types";
import { StarRating } from "./StarRating";

interface Props {
  tool: Tool;
  t: Strings;
  saved: boolean;
  onToggleSave: (tool: Tool) => void;
  onRemove?: (id: string) => void;
  weights?: Weights;
}

export function ToolCard({ tool, t, saved, onToggleSave, onRemove, weights = DEFAULT_WEIGHTS }: Props) {
  const score = weightedScore(tool.scores, weights);
  const hasScores =
    tool.scores.effectiveness > 0 || tool.scores.cost > 0 || tool.scores.safety > 0;

  return (
    <article className="card tool-card">
      <div className="tool-head">
        <div>
          <h3 className="tool-name">{tool.name}</h3>
          <span className="tool-category">{tool.category}</span>
        </div>
        {hasScores && (
          <div className="tool-global" title={t.globalScore}>
            <span className="tool-global-value">{score.toFixed(1)}</span>
            <span className="tool-global-max">/5</span>
          </div>
        )}
      </div>

      {tool.tagline && <p className="tool-tagline">{tool.tagline}</p>}

      {hasScores && (
        <div className="tool-ratings">
          <StarRating label={t.effectiveness} value={tool.scores.effectiveness} />
          <StarRating label={t.cost} value={tool.scores.cost} />
          <StarRating label={t.safety} value={tool.scores.safety} />
        </div>
      )}

      {tool.howTo && (
        <p className="tool-howto">
          <strong>{t.howToUse}: </strong>
          {tool.howTo}
        </p>
      )}

      <div className="tool-actions">
        <a className="btn-ghost" href={tool.url} target="_blank" rel="noreferrer noopener">
          {t.visit} ↗
        </a>
        {onRemove ? (
          <button type="button" className="btn-ghost danger" onClick={() => onRemove(tool.id)}>
            {t.remove}
          </button>
        ) : (
          <button
            type="button"
            className={saved ? "btn-ghost active" : "btn-ghost"}
            onClick={() => onToggleSave(tool)}
          >
            {saved ? `★ ${t.saved}` : `☆ ${t.save}`}
          </button>
        )}
      </div>
    </article>
  );
}
