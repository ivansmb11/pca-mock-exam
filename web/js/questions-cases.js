// Aggregated v6.1 case-study question bank. Each case study lives in its own
// module under ./cases/ ; this file combines them and exposes the set list used
// by the start-screen question-set picker. Questions use the same shape as the
// official QUESTIONS in questions.js, so quiz-engine.js and the adaptive coaching
// pipeline work on them unchanged.
import { ALTOSTRAT_QUESTIONS } from "./cases/altostrat.js";
import { CYMBAL_QUESTIONS } from "./cases/cymbal.js";
import { EHR_QUESTIONS } from "./cases/ehr.js";
import { NIGHT_MOTIVES_QUESTIONS } from "./cases/night-motives.js";

// Ordered list backing the picker. `key` is the <option> value; `name` matches
// each question's `case` field so per-case filtering is exact.
export const CASE_SETS = [
  { key: "altostrat", name: "Altostrat Media", questions: ALTOSTRAT_QUESTIONS },
  { key: "cymbal", name: "Cymbal Retail", questions: CYMBAL_QUESTIONS },
  { key: "ehr", name: "EHR Healthcare", questions: EHR_QUESTIONS },
  { key: "night", name: "Night Motives Automotive", questions: NIGHT_MOTIVES_QUESTIONS },
];

// All case-study questions in one array (every case, in CASE_SETS order).
export const CASE_QUESTIONS = CASE_SETS.flatMap((s) => s.questions);
