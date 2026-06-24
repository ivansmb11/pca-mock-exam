// coach — Supabase Edge Function (Deno)
//
// Takes a completed PCA exam attempt, asks Claude Sonnet 4.6 to (1) write a
// targeted coaching report on the user's mistakes and (2) generate fresh
// adaptive questions for the user's weak topics. Returns guaranteed-JSON.
//
// The Anthropic API key lives ONLY here, as a Supabase secret
// (Deno.env.get("ANTHROPIC_API_KEY")). It is never exposed to the browser.
//
// Auth: `verify_jwt = true` (config.toml) means Supabase already rejects calls
// without a valid JWT; we additionally resolve the user to be explicit.

import { createClient } from "npm:@supabase/supabase-js@2";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const MODEL = "claude-sonnet-4-6";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

// ---- Structured-output schema (only structured-output-safe keywords) --------
const OPTION_MAP = {
  type: "object",
  additionalProperties: false,
  properties: {
    A: { type: "string" },
    B: { type: "string" },
    C: { type: "string" },
    D: { type: "string" },
    E: { type: "string" },
  },
  required: ["A", "B", "C", "D"],
};

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    coaching: {
      type: "object",
      additionalProperties: false,
      properties: {
        summary: { type: "string" },
        strengths: { type: "array", items: { type: "string" } },
        focus_areas: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              topic: { type: "string" },
              why: { type: "string" },
              action: { type: "string" },
            },
            required: ["topic", "why", "action"],
          },
        },
      },
      required: ["summary", "strengths", "focus_areas"],
    },
    new_questions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          topic: { type: "string" },
          type: { type: "string", enum: ["single", "multi"] },
          pick: { type: "integer" },
          text: { type: "string" },
          options: OPTION_MAP,
          correct: {
            type: "array",
            items: { type: "string", enum: ["A", "B", "C", "D", "E"] },
          },
          why: OPTION_MAP,
        },
        required: ["topic", "type", "text", "options", "correct", "why"],
      },
    },
  },
  required: ["coaching", "new_questions"],
};

const SYSTEM = `You are a Google Cloud Professional Cloud Architect (PCA) exam coach.
The exam was updated to v6.1 (Oct 30 2025): generative AI / Gemini (formerly Vertex AI),
the Well-Architected Framework's 6 pillars, Cloud Run over App Engine, and the case
studies Altostrat Media, Cymbal Retail, EHR Healthcare, and KnightMotives Automotive.

You will be given a student's just-completed practice attempt: their per-topic scores
and the specific questions they got wrong (with the right answer). Do two things:

1. coaching — A concise, encouraging but honest report:
   - summary: 2-4 sentences on how they did and what it means for exam readiness (70% pass line).
   - strengths: topics they are solid on.
   - focus_areas: their weakest topics, each with WHY they're losing points and a concrete ACTION.

2. new_questions — Generate 5 fresh, exam-realistic multiple-choice questions that DRILL the
   student's weakest topics (favor the focus_areas). Use authentic PCA scenario style: a short
   business/technical scenario then "What should you do?". Mix single-answer and one or two
   "choose two" (type:"multi", pick:2). Each question needs 4-5 plausible options (A-D, optionally E),
   the correct letter(s), and a one-line rationale per option in "why" explaining why it is or isn't
   correct. Make them genuinely harder than trivia — test best-answer judgment. Do NOT reuse the
   student's questions verbatim.`;

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  if (!ANTHROPIC_API_KEY) {
    return json({ error: "ANTHROPIC_API_KEY not configured" }, 500);
  }

  // Resolve the caller (verify_jwt already gates this, but be explicit).
  const authHeader = req.headers.get("Authorization") ?? "";
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return json({ error: "unauthorized" }, 401);

  let payload: { attempt?: unknown; history?: unknown };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "invalid JSON body" }, 400);
  }
  const { attempt, history } = payload;
  if (!attempt) return json({ error: "missing attempt" }, 400);

  const userContent =
    `Here is the student's attempt (JSON):\n\n${JSON.stringify(attempt, null, 2)}\n\n` +
    `Their recent score history (oldest first), if any:\n${JSON.stringify(history ?? [], null, 2)}\n\n` +
    `Return the coaching report and 5 adaptive questions per the schema.`;

  // Call the Claude Messages API directly (raw HTTP keeps this function
  // dependency-light and pins behaviour to the documented wire format).
  let aiResp: Response;
  try {
    aiResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 6000,
        system: SYSTEM,
        messages: [{ role: "user", content: userContent }],
        output_config: { format: { type: "json_schema", schema: SCHEMA } },
      }),
    });
  } catch (e) {
    return json({ error: "could not reach Anthropic", detail: String(e) }, 502);
  }

  if (!aiResp.ok) {
    const detail = await aiResp.text();
    return json({ error: "anthropic error", status: aiResp.status, detail }, 502);
  }

  const msg = await aiResp.json();
  if (msg.stop_reason === "refusal") {
    return json({ error: "request refused by safety classifier" }, 422);
  }

  const textBlock = (msg.content ?? []).find((b: { type: string }) => b.type === "text");
  if (!textBlock?.text) return json({ error: "empty model response" }, 502);

  let result: unknown;
  try {
    result = JSON.parse(textBlock.text);
  } catch {
    return json({ error: "model did not return valid JSON" }, 502);
  }

  return json({ model: MODEL, ...(result as Record<string, unknown>) });
});
