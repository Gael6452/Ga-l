import { useCallback, useEffect, useState } from "react";
import { DEFAULT_WEIGHTS, type Weights } from "../types";

const KEY = "ai-scout-weights";

function load(): Weights {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_WEIGHTS;
    const parsed = JSON.parse(raw);
    return {
      effectiveness: Number(parsed.effectiveness ?? DEFAULT_WEIGHTS.effectiveness),
      cost: Number(parsed.cost ?? DEFAULT_WEIGHTS.cost),
      safety: Number(parsed.safety ?? DEFAULT_WEIGHTS.safety),
    };
  } catch {
    return DEFAULT_WEIGHTS;
  }
}

export interface WeightsState {
  weights: Weights;
  setAxis: (axis: keyof Weights, value: number) => void;
  reset: () => void;
}

/** User priorities for scoring, persisted across sessions (per device). */
export function useWeights(): WeightsState {
  const [weights, setWeights] = useState<Weights>(load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(weights));
  }, [weights]);

  const setAxis = useCallback((axis: keyof Weights, value: number) => {
    setWeights((prev) => ({ ...prev, [axis]: value }));
  }, []);

  const reset = useCallback(() => setWeights(DEFAULT_WEIGHTS), []);

  return { weights, setAxis, reset };
}
