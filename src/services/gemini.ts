import { GoogleGenAI, Type } from "@google/genai";
import type { ProfileInput, Tool } from "../types";

const MODEL = "gemini-2.5-flash";

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    tools: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          tagline: { type: Type.STRING, description: "One-line pitch of the tool." },
          howTo: { type: Type.STRING, description: "Short tip on how to use it for this goal." },
          url: { type: Type.STRING, description: "Official homepage URL." },
          category: { type: Type.STRING },
          effectiveness: { type: Type.NUMBER, description: "0 to 5" },
          cost: { type: Type.NUMBER, description: "0 to 5, higher = cheaper/better value" },
          safety: { type: Type.NUMBER, description: "0 to 5, higher = safer data handling" },
        },
        required: ["name", "tagline", "howTo", "url", "category", "effectiveness", "cost", "safety"],
      },
    },
  },
  required: ["tools"],
};

function buildPrompt(profile: ProfileInput): string {
  return [
    "You are AI Scout, an expert career advisor for AI tooling.",
    "Given a person's current status and target role, recommend the 6 best AI tools",
    "to help them bridge the gap — prioritising tools that are easy, cheap and safe.",
    "",
    `Current status: ${profile.currentStatus || "(not specified)"}`,
    `Expected position: ${profile.expectedPosition || "(not specified)"}`,
    `Dream job: ${profile.dreamJob || "(not specified)"}`,
    "",
    "For each tool, rate it 0–5 on three axes:",
    "- effectiveness: how well it does the job",
    "- cost: value for money (5 = free or very cheap, 1 = expensive)",
    "- safety: data privacy & safety (5 = excellent, 1 = risky)",
    "Give real, existing tools with correct homepage URLs. Return JSON only.",
  ].join("\n");
}

function clamp(n: unknown): number {
  const x = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(5, Math.round(x * 10) / 10));
}

/** Calls Gemini for live recommendations. Throws if the key is missing or the call fails. */
export async function recommendWithGemini(profile: ProfileInput): Promise<Tool[]> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("No Gemini API key configured");

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: buildPrompt(profile),
    config: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from Gemini");

  const parsed = JSON.parse(text) as {
    tools?: Array<Record<string, unknown>>;
  };
  if (!parsed.tools?.length) throw new Error("No tools in Gemini response");

  return parsed.tools.map((t, i) => ({
    id: `gemini-${i}`,
    name: String(t.name ?? "Unknown"),
    tagline: String(t.tagline ?? ""),
    howTo: String(t.howTo ?? ""),
    url: String(t.url ?? "#"),
    category: String(t.category ?? "AI"),
    scores: {
      effectiveness: clamp(t.effectiveness),
      cost: clamp(t.cost),
      safety: clamp(t.safety),
    },
    tags: [],
  }));
}
