import { TOOLS } from "../data/tools";
import { globalScore, type ProfileInput, type Tool } from "../types";

const STOP_WORDS = new Set([
  "a", "an", "the", "to", "of", "in", "for", "and", "or", "as", "at", "my",
  "i", "am", "is", "want", "be", "become", "job", "work", "working", "career",
  "un", "une", "le", "la", "les", "de", "des", "et", "ou", "pour", "je", "suis",
  "veux", "devenir", "travail", "metier", "métier",
]);

function keywords(profile: ProfileInput): string[] {
  const text = [profile.currentStatus, profile.expectedPosition, profile.dreamJob]
    .join(" ")
    .toLowerCase();
  return text
    .split(/[^a-zàâäéèêëîïôöùûüç0-9]+/i)
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

/**
 * Rank the curated tools by relevance to the profile, then by global score.
 * Always returns `limit` tools, padding with the highest-rated general tools.
 */
export function recommendCurated(profile: ProfileInput, limit = 6): Tool[] {
  const words = keywords(profile);

  const scored = TOOLS.map((tool) => {
    const haystack = [tool.category.toLowerCase(), ...tool.tags];
    let relevance = 0;
    for (const w of words) {
      if (haystack.some((h) => h.includes(w) || w.includes(h))) relevance += 1;
    }
    return { tool, relevance };
  });

  scored.sort((a, b) => {
    if (b.relevance !== a.relevance) return b.relevance - a.relevance;
    return globalScore(b.tool.scores) - globalScore(a.tool.scores);
  });

  return scored.slice(0, limit).map((s) => s.tool);
}
