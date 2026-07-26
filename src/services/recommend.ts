import type { ProfileInput, Tool } from "../types";
import { recommendCurated } from "./curated";
import { recommendWithGemini } from "./gemini";

export type RecommendationMode = "live" | "demo" | "error";

export interface RecommendationResult {
  tools: Tool[];
  mode: RecommendationMode;
}

/**
 * Returns recommendations, preferring live Gemini results when a key is set,
 * and falling back to the curated database otherwise (or on failure).
 */
export async function recommend(profile: ProfileInput): Promise<RecommendationResult> {
  const hasKey = Boolean(import.meta.env.VITE_GEMINI_API_KEY);

  if (!hasKey) {
    return { tools: recommendCurated(profile), mode: "demo" };
  }

  try {
    const tools = await recommendWithGemini(profile);
    return { tools, mode: "live" };
  } catch (err) {
    console.error("Gemini recommendation failed, falling back to curated:", err);
    return { tools: recommendCurated(profile), mode: "error" };
  }
}
