# AI Scout

**Your Career, Powered by AI.** — find the perfect AI toolkit to bridge the gap
between where you are and where you want to be.

You describe your current status and the role you're aiming for; AI Scout
recommends the best AI tools to get there, each rated out of 5 on three axes:

- **Effectiveness** — how well it does the job
- **Value for cost** — how cheap / good the free tier is
- **Data safety** — how well it handles your data

The **global score** is the (optionally weighted) average of those three.

> Rebuilt as a standalone React + TypeScript app from the original Google AI
> Studio prototype, so it can be versioned, hosted and extended freely.

## Features

- 🔍 **Recommendation engine** — enter your profile, get a ranked AI toolkit.
- ⭐ **3-axis scoring** — effectiveness, cost and data safety, with a global score.
- 🎛️ **Personal priorities** — weight each axis to taste; scores and ranking
  adapt to you, and your weights are remembered across sessions.
- 📁 **My toolkit** — save recommended tools *or* add your own websites/apps to a
  collection kept in memory (per device).
- ↗️ **Share** — send your toolkit as a link; opening it imports the tools.
- 🌗 **Dark mode** and 🇺🇸/🇫🇷 **EN/FR** language toggle.
- 🧠 **Live or offline** — uses the Gemini API when a key is configured,
  otherwise a curated offline tool database (demo mode).

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
```

### Optional: live AI recommendations

By default the app runs in **demo mode** on a curated tool database — no key
required. To generate recommendations dynamically with Gemini:

```bash
cp .env.example .env
# then set VITE_GEMINI_API_KEY=<your key from https://aistudio.google.com/apikey>
```

> ⚠️ The key is used client-side (like the original AI Studio app). For a public
> deployment, proxy the Gemini call through a small backend so the key isn't
> exposed in the browser.

## Tech stack

- [Vite](https://vite.dev/) + [React 18](https://react.dev/) + TypeScript (strict)
- [`@google/genai`](https://www.npmjs.com/package/@google/genai) for Gemini
- No UI framework — hand-written CSS with light/dark theming

## Project structure

```
src/
├── App.tsx                 # top-level state & layout
├── i18n.ts                 # EN/FR strings
├── types.ts                # Tool, Scores, Weights + scoring helpers
├── data/tools.ts           # curated offline tool database
├── services/
│   ├── recommend.ts        # orchestrator: live Gemini or curated fallback
│   ├── gemini.ts           # Gemini structured-output call
│   ├── curated.ts          # offline relevance ranking
│   └── share.ts            # encode/decode a toolkit into a shareable link
├── hooks/                  # useTheme, useCollection, useWeights
└── components/             # Header, Hero, ScoutForm, WeightsControl,
                            # Results, ToolCard, StarRating, CollectionPanel
```

## Roadmap

- **User accounts** — persistence is currently per-device (localStorage).
  True multi-device accounts need a backend + authentication (see the open
  discussion on how to handle this).
