import { supabase } from "./supabase-client.js";

// Insert a completed attempt; returns the inserted row (with id).
export async function saveAttempt(userId, results) {
  const { data, error } = await supabase
    .from("attempts")
    .insert({
      user_id: userId,
      round: results.round ?? 1,
      source: results.source ?? "base-19",
      score_correct: results.correctCount,
      score_total: results.total,
      pct: results.pct,
      time_used_seconds: results.timeUsed ?? null,
      topic_breakdown: results.topicBreakdown,
      answers: results.answers ?? {},
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function saveFeedback(userId, attemptId, coach) {
  const { error } = await supabase.from("ai_feedback").insert({
    user_id: userId,
    attempt_id: attemptId,
    summary: coach.coaching?.summary ?? null,
    strengths: coach.coaching?.strengths ?? [],
    focus_areas: coach.coaching?.focus_areas ?? [],
    model: coach.model ?? null,
    raw: coach,
  });
  if (error) throw error;
}

export async function saveGeneratedQuestions(userId, attemptId, questions) {
  if (!questions?.length) return;
  const rows = questions.map((q) => ({
    user_id: userId,
    attempt_id: attemptId,
    topic: q.topic ?? null,
    question: q,
    used: false,
  }));
  const { error } = await supabase.from("generated_questions").insert(rows);
  if (error) throw error;
}

// Oldest-first list of {pct, created_at, source} for the trend chart.
export async function getHistory(userId, limit = 50) {
  const { data, error } = await supabase
    .from("attempts")
    .select("pct, created_at, source, round")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

// Most recent unused adaptive questions for a "start adaptive round".
export async function getUnusedAdaptiveQuestions(userId, limit = 5) {
  const { data, error } = await supabase
    .from("generated_questions")
    .select("id, question")
    .eq("user_id", userId)
    .eq("used", false)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function markQuestionsUsed(ids) {
  if (!ids?.length) return;
  const { error } = await supabase
    .from("generated_questions")
    .update({ used: true })
    .in("id", ids);
  if (error) throw error;
}
