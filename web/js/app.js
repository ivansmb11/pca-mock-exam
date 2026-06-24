import { isConfigured } from "./supabase-client.js";
import {
  onAuthChange, signInWithGoogle, signInWithPassword, signUpWithPassword,
  signOut, getUser,
} from "./auth.js";
import { QUESTIONS } from "./questions.js";
import { startExam, teardown } from "./quiz-engine.js";
import { callCoach } from "./api.js";
import {
  saveAttempt, saveFeedback, saveGeneratedQuestions, getHistory,
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
    source, round,
    onComplete: handleComplete,
  });
}
$("#startBtn").addEventListener("click", () => beginExam(QUESTIONS, "base-19", 1));
$("#retakeBtn").addEventListener("click", () => { show("start"); refreshTrend(); });

// ---------------------------------------------------------------- results
async function handleComplete(results) {
  lastResults = results;
  renderResults(results);
  show("results");

  // Persist the attempt, then ask Claude for coaching + adaptive questions.
  const coachEl = $("#coachingPanel");
  coachEl.innerHTML = coachingLoading();
  $("#adaptiveBtn").classList.add("hidden");

  try {
    lastAttemptRow = await saveAttempt(currentUser.id, results);
  } catch (e) {
    coachEl.innerHTML = coachingError("Couldn't save your attempt: " + e.message);
    return;
  }

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
      <div class="domain-name">${o.topic}${pill}</div>
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
