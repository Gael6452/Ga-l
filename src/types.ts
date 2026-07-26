export interface Scores {
  /** How well the tool does the job, 0–5. */
  effectiveness: number;
  /** Value for the money (higher = cheaper / better free tier), 0–5. */
  cost: number;
  /** Data safety & privacy, 0–5. */
  safety: number;
}

export interface Tool {
  id: string;
  name: string;
  /** One-line pitch of what the tool does. */
  tagline: string;
  /** Short "how to use it for this goal" tip. */
  howTo: string;
  /** Homepage URL. */
  url: string;
  /** Coarse category, e.g. "Writing", "Coding", "Design". */
  category: string;
  scores: Scores;
  /** Keywords used for offline relevance matching. */
  tags: string[];
}

export interface ProfileInput {
  currentStatus: string;
  expectedPosition: string;
  dreamJob: string;
}

/** Average of the three sub-scores, rounded to one decimal. */
export function globalScore(scores: Scores): number {
  const avg = (scores.effectiveness + scores.cost + scores.safety) / 3;
  return Math.round(avg * 10) / 10;
}

/** Per-user importance weights for each score axis (0–5, higher = more important). */
export interface Weights {
  effectiveness: number;
  cost: number;
  safety: number;
}

export const DEFAULT_WEIGHTS: Weights = { effectiveness: 3, cost: 3, safety: 3 };

/**
 * Weighted average of the three sub-scores using the user's priorities,
 * rounded to one decimal. Falls back to a plain average if all weights are 0.
 */
export function weightedScore(scores: Scores, weights: Weights): number {
  const total = weights.effectiveness + weights.cost + weights.safety;
  if (total <= 0) return globalScore(scores);
  const sum =
    scores.effectiveness * weights.effectiveness +
    scores.cost * weights.cost +
    scores.safety * weights.safety;
  return Math.round((sum / total) * 10) / 10;
}
