import { isConfigured } from "./supabase-client.js";
import {
  onAuthChange, signInWithGoogle, signInWithPassword, signUpWithPassword,
  signOut, getUser,
} from "./auth.js";
import { QUESTIONS } from "./questions.js";
import { CASE_SETS, CASE_QUESTIONS } from "./questions-cases.js";
import { TOPIC_SETS, TOPIC_QUESTIONS } from "./questions-topics.js";
import { startExam, resumeExam, getSavedExam, discardSavedExam } from "./quiz-engine.js";
import { callCoach } from "./api.js";
import {
  saveAttempt, saveFeedback, saveGeneratedQuestions, getHistory,
  getAttempts, getFeedbackForAttempt,
} from "./store.js";

const $ = (s) => document.querySelector(s);
const screens = {
  auth: $("#screenAuth"),
  start: $("#screenStart"),
  exam: $("#screenExam"),
  results: $("#screenResults"),
};
function show(name) {
  Object.values(screens).forEach((s) => s.classList.add("hidden"));
  screens[name].classList.remove("hidden");
  window.scrollTo({ top: 0 });
}

let currentUser = null;
let lastResults = null;
let lastAttemptRow = null;

// id -> question, across the official + case-study + topic banks. Used to
// reconstruct the per-question review when re-opening a saved attempt.
const QUESTION_BY_ID = new Map(
  [...QUESTIONS, ...CASE_QUESTIONS, ...TOPIC_QUESTIONS].map((q) => [String(q.id), q]),
);

// Human label for a stored/saved `source` value.
function setLabelFromSource(source) {
  if (source === "base-19") return "Official sample";
  if (source === "adaptive") return "Adaptive round";
  if (source === "cases-all") return "All v6.1 case studies";
  if (source === "everything") return "Everything";
  if (typeof source === "string" && source.startsWith("case-")) {
    return CASE_SETS.find((s) => `case-${s.key}` === source)?.name ?? "Case study";
  }
  if (typeof source === "string" && source.startsWith("topic-")) {
    return TOPIC_SETS.find((s) => `topic-${s.key}` === source)?.name ?? "Study set";
  }
  return source || "Exam";
}

// Per-user localStorage key for the in-progress autosave (null when signed out).
const inprogressKey = () => (currentUser ? `pca:inprogress:${currentUser.id}` : null);

// ---------------------------------------------------------------- theme
$("#themeToggle").addEventListener("click", () => {
  const root = document.documentElement;
  const dark = root.getAttribute("data-theme") === "dark";
  root.setAttribute("data-theme", dark ? "light" : "dark");
  $("#iconMoon").innerHTML = dark
    ? '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'
    : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
});

// ---------------------------------------------------------------- auth gate
if (!isConfigured()) {
  $("#authNote").textContent =
    "⚠ This build is not yet connected to Supabase. Set SUPABASE_URL and SUPABASE_ANON_KEY in web/config.js.";
  $("#googleBtn").disabled = true;
}
$("#googleBtn").addEventListener("click", () => signInWithGoogle().catch((e) => setAuthMsg(e.message, true)));
$("#signOutBtn").addEventListener("click", () => signOut());

function setAuthMsg(msg, isErr = false) {
  const el = $("#authMsg");
  el.textContent = msg;
  el.classList.toggle("err", isErr);
}

// Surface an auth-redirect error (e.g. allowlist rejection after Google sign-in)
// that Supabase returns in the URL, then clean it from the address bar.
(function showAuthRedirectError() {
  let err = null;
  for (const raw of [window.location.hash.slice(1), window.location.search.slice(1)]) {
    if (!raw) continue;
    const e = new URLSearchParams(raw).get("error_description") ||
              new URLSearchParams(raw).get("error");
    if (e) { err = e; break; }
  }
  if (!err) return;
  const blocked = /not authorized|allowlist|saving new user|database error/i.test(err);
  setAuthMsg(
    blocked
      ? "That email isn't on the allowlist for this app. Ask the owner to add you."
      : decodeURIComponent(err.replace(/\+/g, " ")),
    true,
  );
  history.replaceState(null, "", window.location.pathname);
})();
$("#emailForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("#emailInput").value.trim();
  const pw = $("#passwordInput").value;
  setAuthMsg("Signing in…");
  try { await signInWithPassword(email, pw); } catch (err) { setAuthMsg(err.message, true); }
});
$("#emailSignUpBtn").addEventListener("click", async () => {
  const email = $("#emailInput").value.trim();
  const pw = $("#passwordInput").value;
  if (!email || pw.length < 6) { setAuthMsg("Enter an email and a password of at least 6 characters.", true); return; }
  setAuthMsg("Creating account…");
  try {
    const data = await signUpWithPassword(email, pw);
    if (data.session) setAuthMsg("");
    else setAuthMsg("Account created. Check your email to confirm, then sign in.");
  } catch (err) { setAuthMsg(err.message, true); }
});

onAuthChange(async (session) => {
  currentUser = getUser(session);
  if (currentUser) {
    $("#userChip").classList.remove("hidden");
    $("#userEmail").textContent = currentUser.email ?? "Signed in";
    show("start");
    refreshTrend();
    refreshResume();
    refreshPastAttempts();
  } else {
    $("#userChip").classList.add("hidden");
    show("auth");
  }
});

// ---------------------------------------------------------------- start exam
function beginExam(questions, source, round) {
  show("exam");
  startExam({
    questions,
    timed: $("#optTimer").checked,
    instant: $("#optInstant").checked,
    shuffle: $("#optShuffle").checked,
    // ~2 min/question, matching the real PCA pacing, so short case sets aren't
    // stuck with the full 40-minute clock.
    durationSecs: questions.length * 120,
    source, round,
    persistKey: inprogressKey(),
    onComplete: handleComplete,
  });
}

// Resolve the start-screen picker value to a question array + source label.
// "base-19" = official sample, "cases-all" = every case study, "everything" =
// all banks, otherwise a single case (CASE_SETS[].key) or topic set
// (TOPIC_SETS[].key).
function resolveSet(value) {
  if (value === "cases-all") return { qs: CASE_QUESTIONS, source: "cases-all" };
  if (value === "everything") {
    return { qs: [...QUESTIONS, ...CASE_QUESTIONS, ...TOPIC_QUESTIONS], source: "everything" };
  }
  const caseSet = CASE_SETS.find((s) => s.key === value);
  if (caseSet) return { qs: caseSet.questions, source: `case-${caseSet.key}` };
  const topicSet = TOPIC_SETS.find((s) => s.key === value);
  if (topicSet) return { qs: topicSet.questions, source: `topic-${topicSet.key}` };
  return { qs: QUESTIONS, source: "base-19" };
}

// Keep the hero stats in sync with the chosen set (count, ~2 min/q timer, topics).
function updateStartStats() {
  const sel = $("#setSelect");
  if (!sel) return;
  const { qs } = resolveSet(sel.value);
  const topics = new Set(qs.map((q) => q.topic)).size;
  $("#qCountStat").textContent = qs.length;
  $("#timerStat").innerHTML = `${qs.length * 2}<span style="font-size:14px">m</span>`;
  $("#topicStat").textContent = topics;
}
$("#setSelect")?.addEventListener("change", updateStartStats);
updateStartStats();

$("#startBtn").addEventListener("click", () => {
  const { qs, source } = resolveSet($("#setSelect")?.value || "base-19");
  beginExam(qs, source, 1);
});
$("#retakeBtn").addEventListener("click", () => {
  show("start"); refreshTrend(); refreshResume(); refreshPastAttempts();
});

// ---------------------------------------------------------------- resume in-progress
function answeredInSaved(saved) {
  return saved.questions.reduce((n, q) => {
    const a = saved.answers?.[q.id] || [];
    const done = q.type === "single" ? a.length === 1 : a.length === (q.pick || 1);
    return n + (done ? 1 : 0);
  }, 0);
}

function refreshResume() {
  const card = $("#resumeCard");
  if (!card) return;
  const saved = getSavedExam(inprogressKey());
  if (!saved) { card.classList.add("hidden"); return; }
  const answered = answeredInSaved(saved);
  const total = saved.questions.length;
  const r = saved.remaining ?? 0;
  const clock = saved.timed ? ` · ${Math.floor(r / 60)}:${String(r % 60).padStart(2, "0")} left` : "";
  const roundTag = (saved.round ?? 1) > 1 ? ` · round ${saved.round}` : "";
  $("#resumeInfo").innerHTML = `<b>${setLabelFromSource(saved.source)}</b>${roundTag} · ${answered}/${total} answered${clock}`;
  card.classList.remove("hidden");
}

$("#resumeBtn")?.addEventListener("click", () => {
  const key = inprogressKey();
  const saved = getSavedExam(key);
  if (!saved) { refreshResume(); return; }
  show("exam");
  resumeExam({ saved, persistKey: key, onComplete: handleComplete });
});
$("#discardResumeBtn")?.addEventListener("click", () => {
  discardSavedExam(inprogressKey());
  refreshResume();
});

// ---------------------------------------------------------------- results
async function handleComplete(results) {
  lastResults = results;
  renderResults(results);
  show("results");

  // Persist the attempt, then ask Claude for coaching + adaptive questions.
  const coachEl = $("#coachingPanel");
  $("#adaptiveBtn").classList.add("hidden");

  try {
    lastAttemptRow = await saveAttempt(currentUser.id, results);
  } catch (e) {
    coachEl.innerHTML = coachingError("Couldn't save your attempt: " + e.message);
    return;
  }

  // Don't spend tokens analyzing a blank attempt — if nothing was answered,
  // there's nothing to coach. (Skipped questions are already excluded from the
  // payload; this guards the answered-nothing case entirely.)
  if (!results.attemptedCount) {
    coachEl.innerHTML = `<div class="domain-card" style="text-align:center;color:var(--fg-muted)">You didn't answer any questions, so there's nothing for the AI to analyze yet. Answer at least one and you'll get coaching plus adaptive practice on your weak topics.</div>`;
    refreshTrend();
    refreshResume();
    refreshPastAttempts();
    return;
  }

  coachEl.innerHTML = coachingLoading();
  let history = [];
  try { history = await getHistory(currentUser.id); } catch { /* non-fatal */ }

  try {
    const coach = await callCoach(
      {
        pct: results.pct,
        score: `${results.correctCount}/${results.total}`,
        topicBreakdown: results.topicBreakdown,
        wrongQuestions: results.wrongQuestions,
      },
      history.map((h) => ({ pct: h.pct, created_at: h.created_at })),
    );
    renderCoaching(coach);
    saveFeedback(currentUser.id, lastAttemptRow.id, coach).catch(() => {});
    saveGeneratedQuestions(currentUser.id, lastAttemptRow.id, coach.new_questions).catch(() => {});

    if (coach.new_questions?.length) {
      const round = (results.round ?? 1) + 1;
      const adaptive = coach.new_questions.map((q, i) => ({ ...q, id: `a${round}-${i + 1}` }));
      const btn = $("#adaptiveBtn");
      btn.classList.remove("hidden");
      btn.onclick = () => beginExam(adaptive, "adaptive", round);
    }
  } catch (e) {
    coachEl.innerHTML = coachingError("AI coaching unavailable: " + e.message);
  }
  refreshTrend();
  refreshResume();
  refreshPastAttempts();
}

function coachingLoading() {
  return `<div class="domain-card" style="text-align:center;color:var(--fg-muted)">
    <div class="spinner" aria-hidden="true"></div>
    <div style="margin-top:10px;font-family:'Lexend'">Claude is analyzing your attempt…</div>
    <div style="font-size:13px;margin-top:4px">Writing coaching + generating adaptive questions for your weak topics.</div>
  </div>`;
}
function coachingError(msg) {
  return `<div class="domain-card" style="color:var(--red-500)">${msg}</div>`;
}

function renderCoaching(coach) {
  const c = coach.coaching || {};
  const strengths = (c.strengths || []).map((s) => `<li>${s}</li>`).join("");
  const focus = (c.focus_areas || []).map((f) => `
    <div class="focus-row">
      <div class="focus-topic">${f.topic}</div>
      <div class="focus-why">${f.why}</div>
      <div class="focus-action"><b>Do this:</b> ${f.action}</div>
    </div>`).join("");
  $("#coachingPanel").innerHTML = `
    <div class="coach-card">
      <div class="coach-head">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2Z"/><path d="M9 22h6"/></svg>
        <span>AI Coach · ${coach.model || "Claude"}</span>
      </div>
      <p class="coach-summary">${c.summary || ""}</p>
      ${strengths ? `<div class="coach-block"><h4>Strengths</h4><ul class="coach-strengths">${strengths}</ul></div>` : ""}
      ${focus ? `<div class="coach-block"><h4>Focus areas</h4>${focus}</div>` : ""}
    </div>`;
}

// ---- ported results rendering (ring, topic breakdown, review) --------------
const PASS_MARK = 0.70;

function renderResults(results) {
  const { correctCount: correct, total, pct, passed } = results;
  const circ = 2 * Math.PI * 82;
  const ring = $("#ringFill");
  ring.style.stroke = passed ? "var(--green-500)" : "var(--red-500)";
  ring.setAttribute("stroke-dasharray", circ);
  ring.setAttribute("stroke-dashoffset", circ);
  setTimeout(() => ring.setAttribute("stroke-dashoffset", circ * (1 - pct / 100)), 80);

  $("#scorePct").textContent = Math.round(pct) + "%";
  $("#scoreFraction").textContent = `${correct} / ${total}`;
  const vb = $("#verdictBadge");
  vb.className = "verdict " + (passed ? "pass" : "fail");
  vb.innerHTML = passed
    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg> PASS'
    : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg> NOT YET';
  const need = Math.ceil(PASS_MARK * total);
  $("#resultsSub").innerHTML = passed
    ? `You're above the 70% pass line — solid work. The AI coach below shows how to push your margin higher.`
    : `You need <b>70%</b> to pass (that's ${need} of ${total}). You're ${need - correct} question${need - correct > 1 ? "s" : ""} short — the AI coach below targets exactly where to focus.`;

  $("#statCorrect").textContent = correct;
  $("#statWrong").textContent = total - correct;
  $("#statTime").textContent = results.timeUsed != null
    ? `${Math.floor(results.timeUsed / 60)}:${String(results.timeUsed % 60).padStart(2, "0")}` : "—";

  renderDomains(results.topicBreakdown);
  renderReview(results.perQuestion, false);
  const btn = $("#reviewWrongBtn");
  btn.textContent = "Review only my mistakes";
  btn.dataset.mode = "";
}

function renderDomains(rows) {
  $("#domainCard").innerHTML = rows.map((o) => {
    const p = o.pct / 100;
    const col = p >= 0.7 ? "var(--green-500)" : p >= 0.5 ? "var(--gold-500)" : "var(--red-500)";
    const pill = p < 0.7 ? `<span class="weak-pill">Focus area</span>` : `<span class="strong-pill">Strong</span>`;
    return `<div class="domain-row">
      <div class="domain-name"><span class="dn-label">${o.topic}</span>${pill}</div>
      <div class="domain-bar"><span style="width:${o.pct}%;background:${col}"></span></div>
      <div class="domain-score">${o.correct}/${o.total} · ${o.pct}%</div>
    </div>`;
  }).join("");
}

function renderReview(perQuestion, onlyWrong) {
  const list = $("#reviewList");
  list.innerHTML = "";
  perQuestion.forEach((pq, idx) => {
    const q = pq.q;
    const ok = pq.isCorrect;
    if (onlyWrong && ok) return;
    const a = pq.picked || [];
    const item = document.createElement("div");
    item.className = "review-item";
    const optsHtml = Object.entries(q.options)
      .filter(([, t]) => t != null && t !== "")
      .map(([letter, txt]) => {
        let cls = "opt review";
        let note = "";
        if (q.correct.includes(letter)) { cls += " correct"; note = '<span class="opt-note">Correct</span>'; }
        else if (a.includes(letter)) { cls += " wrong"; note = '<span class="opt-note">Your choice</span>'; }
        return `<div class="${cls}"><span class="opt-marker">${letter}</span><span class="opt-body">${txt}</span>${note}</div>`;
      }).join("");
    const whyHtml = Object.entries(q.why || {})
      .map(([k, v]) => `<li class="${q.correct.includes(k) ? "is-correct" : "is-wrong"}"><span class="k">${k}</span><span>${v}</span></li>`)
      .join("");
    item.innerHTML = `
      <div class="review-q">
        <span class="rq-badge ${ok ? "ok" : "bad"}">${ok
          ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>'
          : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>'}</span>
        <span class="rq-text"><b>Q${idx + 1}.</b> ${q.text}</span>
        <svg class="rq-chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="review-body">
        <div class="qmeta" style="margin:6px 0 14px"><span class="topic-tag">${q.topic}</span>${q.case ? `<span class="topic-tag case-tag" style="padding-left:11px">${q.case}</span>` : ""}${q.type === "multi" ? `<span class="topic-tag multi-tag" style="margin-left:8px">Choose ${q.pick}</span>` : ""}</div>
        <div class="options" style="margin-bottom:6px">${optsHtml}</div>
        <div class="explain"><h4>Official explanation</h4><ul>${whyHtml}</ul></div>
      </div>`;
    item.querySelector(".review-q").addEventListener("click", () => item.classList.toggle("open"));
    list.appendChild(item);
  });
  if (onlyWrong && !list.children.length) {
    list.innerHTML = `<div class="domain-card" style="text-align:center;color:var(--fg-muted)">No mistakes to review — perfect score.</div>`;
  }
}

$("#reviewWrongBtn").addEventListener("click", () => {
  const btn = $("#reviewWrongBtn");
  if (btn.dataset.mode === "wrong") {
    renderReview(lastResults.perQuestion, false);
    btn.textContent = "Review only my mistakes"; btn.dataset.mode = "";
  } else {
    renderReview(lastResults.perQuestion, true);
    btn.textContent = "Show all questions"; btn.dataset.mode = "wrong";
    $("#reviewList").scrollIntoView({ behavior: "smooth" });
  }
});

// ---------------------------------------------------------------- trend
async function refreshTrend() {
  if (!currentUser) return;
  let history = [];
  try { history = await getHistory(currentUser.id); } catch { return; }
  const section = $("#trendSection");
  if (!history.length) { section.classList.add("hidden"); return; }
  section.classList.remove("hidden");
  $("#trendCount").textContent = `${history.length} attempt${history.length > 1 ? "s" : ""}`;
  $("#trendChart").innerHTML = trendSvg(history);
}

function trendSvg(history) {
  const W = 640, H = 180, pad = 28;
  const n = history.length;
  const xs = (i) => n === 1 ? W / 2 : pad + (i * (W - 2 * pad)) / (n - 1);
  const ys = (v) => H - pad - (v / 100) * (H - 2 * pad);
  const passY = ys(70);
  const pts = history.map((h, i) => `${xs(i)},${ys(h.pct)}`).join(" ");
  const dots = history.map((h, i) => {
    const col = h.pct >= 70 ? "var(--green-500)" : "var(--red-500)";
    return `<circle cx="${xs(i)}" cy="${ys(h.pct)}" r="5" fill="${col}"/><text x="${xs(i)}" y="${ys(h.pct) - 10}" text-anchor="middle" font-size="11" fill="var(--fg-muted)">${Math.round(h.pct)}%</text>`;
  }).join("");
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Score trend">
    <line x1="${pad}" y1="${passY}" x2="${W - pad}" y2="${passY}" stroke="var(--gold-500)" stroke-width="1.5" stroke-dasharray="5 5"/>
    <text x="${W - pad}" y="${passY - 6}" text-anchor="end" font-size="11" fill="var(--gold-600)">70% pass</text>
    <polyline points="${pts}" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    ${dots}
  </svg>`;
}

// ---------------------------------------------------------------- past attempts
// Rebuild a results object from a stored attempt row. The headline numbers come
// straight from the stored columns (robust even when a question can't be found,
// e.g. adaptive questions that aren't kept individually); the per-question review
// is reconstructed from the question banks for whatever ids we can resolve.
function reconstructResults(row) {
  const answers = row.answers || {};
  const perQuestion = [];
  let unresolved = 0;
  for (const [qid, picked] of Object.entries(answers)) {
    const q = QUESTION_BY_ID.get(String(qid));
    if (!q) { unresolved++; continue; }
    const a = Array.isArray(picked) ? picked : [];
    const ok = a.length === q.correct.length && q.correct.every((c) => a.includes(c));
    perQuestion.push({ q, picked: a, isCorrect: ok });
  }
  const pct = Number(row.pct);
  return {
    correctCount: row.score_correct,
    total: row.score_total,
    pct,
    passed: pct / 100 >= PASS_MARK,
    timeUsed: row.time_used_seconds ?? null,
    topicBreakdown: row.topic_breakdown || [],
    perQuestion,
    _unresolved: unresolved,
  };
}

// Open a saved attempt read-only: summary + topic breakdown + review + the
// coaching that was stored at the time. No new save and no new AI call.
async function viewAttempt(row) {
  const results = reconstructResults(row);
  lastResults = results;
  renderResults(results);
  show("results");

  $("#resultsSub").innerHTML =
    `Saved attempt from <b>${new Date(row.created_at).toLocaleString()}</b> · ${setLabelFromSource(row.source)}${(row.round ?? 1) > 1 ? ` · round ${row.round}` : ""}`;

  // If some questions couldn't be resolved (adaptive), say so above the review.
  if (results.perQuestion.length < results.total) {
    const note = document.createElement("div");
    note.className = "domain-card";
    note.style.cssText = "text-align:center;color:var(--fg-muted);margin-bottom:12px";
    note.textContent = results.perQuestion.length === 0
      ? "Detailed review isn't available for this attempt — adaptive questions aren't stored individually. The score and topic breakdown above are exact."
      : "Some adaptive questions in this attempt aren't stored individually, so only part of the review is shown.";
    $("#reviewList").prepend(note);
  }

  // Re-opened attempts never re-run coaching or generate a new round.
  $("#adaptiveBtn").classList.add("hidden");
  const coachEl = $("#coachingPanel");
  coachEl.innerHTML = `<div class="domain-card" style="text-align:center;color:var(--fg-muted)">Loading saved coaching…</div>`;
  let fb = null;
  try { fb = await getFeedbackForAttempt(currentUser.id, row.id); } catch { /* non-fatal */ }
  if (fb) {
    renderCoaching(fb.raw?.coaching
      ? fb.raw
      : { model: fb.model, coaching: { summary: fb.summary, strengths: fb.strengths, focus_areas: fb.focus_areas } });
  } else {
    coachEl.innerHTML = `<div class="domain-card" style="text-align:center;color:var(--fg-muted)">No saved AI coaching for this attempt.</div>`;
  }
}

async function refreshPastAttempts() {
  if (!currentUser) return;
  const section = $("#attemptsSection");
  if (!section) return;
  let rows = [];
  try { rows = await getAttempts(currentUser.id); } catch { section.classList.add("hidden"); return; }
  if (!rows.length) { section.classList.add("hidden"); return; }
  section.classList.remove("hidden");
  $("#attemptsCount").textContent = `${rows.length} attempt${rows.length > 1 ? "s" : ""}`;
  const list = $("#attemptsList");
  list.innerHTML = "";
  rows.forEach((row) => {
    const pct = Math.round(Number(row.pct));
    const pass = Number(row.pct) / 100 >= PASS_MARK;
    const date = new Date(row.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    const btn = document.createElement("button");
    btn.className = "attempt-row";
    btn.innerHTML = `
      <span class="attempt-score ${pass ? "pass" : "fail"}">${pct}%</span>
      <span class="attempt-meta">
        <span class="attempt-set">${setLabelFromSource(row.source)}${(row.round ?? 1) > 1 ? ` · round ${row.round}` : ""}</span>
        <span class="attempt-date">${date} · ${row.score_correct}/${row.score_total} correct</span>
      </span>
      <svg class="attempt-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>`;
    btn.addEventListener("click", () => viewAttempt(row));
    list.appendChild(btn);
  });
}
