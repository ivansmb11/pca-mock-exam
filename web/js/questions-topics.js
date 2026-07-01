// Aggregated topic/week study sets (non-case-study banks generated from the
// study-group decks in docs/). Each week lives in its own module under
// ./topics/ ; this file combines them and exposes the set list used by the
// start-screen question-set picker. Questions use the same shape as the
// official QUESTIONS in questions.js, so quiz-engine.js and the adaptive
// coaching pipeline work on them unchanged.
import { WEEK1_QUESTIONS } from "./topics/week1.js";

// Ordered list backing the picker. `key` is the <option> value; attempts are
// stored with source `topic-${key}` (see migration 0004_topic_source.sql).
export const TOPIC_SETS = [
  { key: "week1", name: "Week 1 — Cloud Foundations", questions: WEEK1_QUESTIONS },
];

// All topic-set questions in one array (every week, in TOPIC_SETS order).
export const TOPIC_QUESTIONS = TOPIC_SETS.flatMap((s) => s.questions);
