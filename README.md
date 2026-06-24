# PCA Mock Exam — AI Adaptive Study App

An open-source study app for the **Google Cloud Professional Cloud Architect (PCA)** certification.
Take an exam, and after each attempt **Claude Sonnet** analyzes your mistakes, writes targeted
coaching, and **generates fresh adaptive questions** aimed at your weakest topics — so you improve
on every round. Your history is saved, with an improvement trend over time.

> The exam was updated to **v6.1 (Oct 30 2025)**: generative AI / Gemini, the Well-Architected
> Framework's 6 pillars, Cloud Run over App Engine, and new case studies (Altostrat Media, Cymbal
> Retail, EHR Healthcare, KnightMotives Automotive). The base 19 questions are the official Google
> sample set; adaptive rounds are generated to match the current blueprint and your weak areas.

## Features

- 19 official PCA sample questions — verbatim text, answer keys, and the official explanations.
- Timed exam, question navigator, single/multi-select, flag-for-review, dark mode.
- **AI coaching** after each attempt (summary, strengths, focus areas with concrete actions).
- **Adaptive rounds** — Claude generates new questions targeting your weak topics.
- **Improvement trend** chart across all your attempts.
- Google sign-in; per-user history protected by Postgres Row Level Security.

## Architecture

| Layer | Tech |
|---|---|
| Frontend | Static HTML + ES modules (no build step) — `web/`, deployed to **Vercel** |
| Auth + DB | **Supabase** (Postgres + RLS + Google OAuth) |
| AI backend | **Supabase Edge Function** (`coach`, Deno) calling **Claude Sonnet 4.6** |
| HTTP client | `axios` (frontend), `fetch` (edge function) |

The Anthropic API key lives **only** in the Edge Function as a Supabase secret — never in the
frontend or this repo. The frontend ships only the public Supabase anon key (RLS protects data).

```
web/                 frontend (Vercel)
supabase/
  migrations/        Postgres schema + RLS
  functions/coach/   Deno edge function → Claude Sonnet 4.6
offline/             self-contained single-file version (no backend)
docs/                study resources
```

## Setup

Prerequisites: a Supabase project, a Vercel account, an Anthropic API key, and a Google OAuth client.

### 1. Database

```bash
supabase link --project-ref <your-ref>
supabase db push                       # applies supabase/migrations/0001_init.sql
```

### 2. Edge function + secret

```bash
supabase functions deploy coach
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Auth

In the Supabase dashboard → Authentication → Providers, enable **Google** (paste your Google Cloud
OAuth client id/secret). Add your Vercel URL to the allowed redirect URLs.

### 4. Frontend config

Edit `web/config.js` with your project's URL and anon key (Supabase → Project Settings → API):

```js
export const SUPABASE_URL = "https://<ref>.supabase.co";
export const SUPABASE_ANON_KEY = "<anon-key>";
```

### 5. Deploy

```bash
vercel --prod          # serves web/ as a static site
```

## Local development

```bash
cd web && python3 -m http.server 8765   # open http://localhost:8765
# Edge function locally:
supabase functions serve coach          # needs ANTHROPIC_API_KEY in supabase/.env
```

## License

[MIT](./LICENSE) © Ivan Mendoza
