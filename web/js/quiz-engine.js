// Exam-taking engine. Renders one question at a time, navigator, timer,
// single/multi select, flag, and submit. On submit it computes a results
// object and hands it to onComplete — persistence + AI coaching live in app.js.
// Works on any question array (base 19 or Claude-generated adaptive sets).

const $ = (s) => document.querySelector(s);
export const PASS_MARK = 0.70;
export const DEFAULT_DURATION = 40 * 60;

let S = null;          // exam state
let timerInt = null;
let onComplete = null;

const caseIcon =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;vertical-align:-1px"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></svg>';

const pseudo = (n) => Math.floor(Math.abs(Math.sin(n * 99.13 + 17.7) * 10000));

export function startExam(opts) {
  const questions = opts.questions;
  onComplete = opts.onComplete;
  let order = questions.map((_, i) => i);
  if (opts.shuffle) {
    for (let i = order.length - 1; i > 0; i--) {
      const k = pseudo(i) % (i + 1);
      [order[i], order[k]] = [order[k], order[i]];
    }
  }
  S = {
    questions,
    order,
    cur: 0,
    answers: {},
    flags: {},
    timed: !!opts.timed,
    instant: !!opts.instant,
    revealed: {},
    remaining: opts.durationSecs ?? DEFAULT_DURATION,
    source: opts.source ?? "base-19",
    round: opts.round ?? 1,
  };
  $("#timerPill").classList.toggle("hidden", !S.timed);
  $("#mnavToggle").classList.remove("hidden");
  renderQuestion();
  startTimer();
}

export function teardown() {
  clearInterval(timerInt);
  $("#timerPill").classList.add("hidden");
  $("#mnavToggle").classList.add("hidden");
}

const curQ = () => S.questions[S.order[S.cur]];

function renderQuestion() {
  const q = curQ();
  const ans = S.answers[q.id] || [];
  const isRevealed = S.instant && S.revealed[q.id];
  const isMulti = q.type === "multi";

  const optsHtml = Object.entries(q.options)
    .filter(([, txt]) => txt != null && txt !== "")
    .map(([letter, txt]) => {
      let cls = isMulti ? "opt multi" : "opt single";
      let note = "";
      if (isRevealed) {
        cls += " review";
        if (q.correct.includes(letter)) { cls += " correct"; note = '<span class="opt-note">Correct answer</span>'; }
        else if (ans.includes(letter)) { cls += " wrong"; note = '<span class="opt-note">Your choice</span>'; }
      } else if (ans.includes(letter)) cls += " selected";
      return `<div class="${cls}" data-letter="${letter}" role="${isMulti ? "checkbox" : "radio"}" aria-checked="${ans.includes(letter)}" tabindex="0">
        <span class="opt-marker">${letter}</span><span class="opt-body">${txt}</span>${note}</div>`;
    }).join("");

  const caseTag = q.case ? `<span class="topic-tag case-tag">${caseIcon}${q.case}</span>` : "";
  const multiTag = isMulti ? `<span class="topic-tag multi-tag">Choose ${q.pick}</span>` : "";

  let explainHtml = "";
  if (isRevealed) {
    explainHtml = `<div class="explain"><h4>Why</h4><ul>${Object.entries(q.why || {})
      .map(([k, v]) => `<li class="${q.correct.includes(k) ? "is-correct" : "is-wrong"}"><span class="k">${k}</span><span>${v}</span></li>`)
      .join("")}</ul></div>`;
  }

  $("#qcard").innerHTML = `
    <div class="qmeta">
      <span class="qnum">Question ${S.cur + 1} of ${S.questions.length}</span>
      <span class="topic-tag">${q.topic}</span>${caseTag}${multiTag}
    </div>
    <div class="qtext">${q.text}</div>
    <div class="options" id="optionsBox">${optsHtml}</div>${explainHtml}`;

  if (!isRevealed) {
    $("#optionsBox").querySelectorAll(".opt").forEach((el) => {
      el.addEventListener("click", () => selectOption(el.dataset.letter));
      el.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Enter") { e.preventDefault(); selectOption(el.dataset.letter); }
      });
    });
  }

  $("#prevBtn").disabled = S.cur === 0;
  const isLast = S.cur === S.questions.length - 1;
  $("#nextBtn").innerHTML = isLast
    ? 'Review &amp; submit <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>'
    : 'Next <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  const flagged = !!S.flags[q.id];
  $("#flagBtn").classList.toggle("active", flagged);
  $("#flagLabel").textContent = flagged ? "Flagged" : "Flag";

  renderNav();
  $("#progressFill").style.width = `${((S.cur + 1) / S.questions.length) * 100}%`;
}

function selectOption(letter) {
  const q = curQ();
  let ans = S.answers[q.id] ? [...S.answers[q.id]] : [];
  if (q.type === "single") ans = [letter];
  else {
    if (ans.includes(letter)) ans = ans.filter((l) => l !== letter);
    else { if (ans.length >= q.pick) ans.shift(); ans.push(letter); }
  }
  S.answers[q.id] = ans;
  if (S.instant) {
    const complete = q.type === "single" ? ans.length === 1 : ans.length === q.pick;
    if (complete) S.revealed[q.id] = true;
  }
  renderQuestion();
}

function answeredCount() {
  let n = 0;
  S.questions.forEach((q) => {
    const a = S.answers[q.id] || [];
    if (q.type === "single" ? a.length === 1 : a.length === q.pick) n++;
  });
  return n;
}

function renderNav() {
  const grid = $("#navGrid");
  grid.innerHTML = "";
  S.order.forEach((qi, idx) => {
    const q = S.questions[qi];
    const a = S.answers[q.id] || [];
    const isAnswered = q.type === "single" ? a.length === 1 : a.length === q.pick;
    const cell = document.createElement("button");
    cell.className = "nav-cell" + (isAnswered ? " answered" : "") + (idx === S.cur ? " current" : "") + (S.flags[q.id] ? " flagged" : "");
    cell.textContent = idx + 1;
    cell.setAttribute("aria-label", `Go to question ${idx + 1}`);
    cell.addEventListener("click", () => { S.cur = idx; renderQuestion(); closeMobileNav(); });
    grid.appendChild(cell);
  });
  const n = answeredCount();
  $("#navSub").textContent = `${n} of ${S.questions.length} answered`;
  $("#mnavCount").textContent = `${n}/${S.questions.length}`;
}

function isCorrect(q) {
  const a = S.answers[q.id] || [];
  if (a.length !== q.correct.length) return false;
  return q.correct.every((c) => a.includes(c));
}

// ---- nav buttons / keyboard ------------------------------------------------
function wireControls() {
  $("#prevBtn").addEventListener("click", () => { if (S && S.cur > 0) { S.cur--; renderQuestion(); } });
  $("#nextBtn").addEventListener("click", () => {
    if (!S) return;
    if (S.cur < S.questions.length - 1) { S.cur++; renderQuestion(); }
    else openConfirm();
  });
  $("#flagBtn").addEventListener("click", () => { if (!S) return; const q = curQ(); S.flags[q.id] = !S.flags[q.id]; renderQuestion(); });
  $("#submitBtn").addEventListener("click", openConfirm);
  $("#cancelSubmit").addEventListener("click", () => $("#confirmModal").classList.remove("show"));
  $("#confirmSubmit").addEventListener("click", () => { $("#confirmModal").classList.remove("show"); doSubmit(false); });
  $("#mnavToggle").addEventListener("click", openMobileNav);
  $("#scrim").addEventListener("click", closeMobileNav);

  document.addEventListener("keydown", (e) => {
    if (!S || $("#screenExam").classList.contains("hidden")) return;
    if (e.target.tagName === "INPUT") return;
    if (e.key === "ArrowRight") $("#nextBtn").click();
    else if (e.key === "ArrowLeft") $("#prevBtn").click();
    else if (e.key === "f" || e.key === "F") $("#flagBtn").click();
    else if (/^[a-eA-E]$/.test(e.key)) {
      const letter = e.key.toUpperCase();
      const q = curQ();
      if (q.options[letter] && !(S.instant && S.revealed[q.id])) selectOption(letter);
    } else if (/^[1-5]$/.test(e.key)) {
      const letter = "ABCDE"[+e.key - 1];
      const q = curQ();
      if (q.options[letter] && !(S.instant && S.revealed[q.id])) selectOption(letter);
    }
  });
}

function openMobileNav() { $("#sidebar").classList.add("open"); $("#scrim").classList.add("show"); }
function closeMobileNav() { $("#sidebar").classList.remove("open"); $("#scrim").classList.remove("show"); }

// ---- timer -----------------------------------------------------------------
function startTimer() {
  clearInterval(timerInt);
  if (!S.timed) return;
  tickTimer();
  timerInt = setInterval(() => {
    S.remaining--;
    tickTimer();
    if (S.remaining <= 0) { clearInterval(timerInt); doSubmit(true); }
  }, 1000);
}
function tickTimer() {
  const m = Math.floor(S.remaining / 60), s = S.remaining % 60;
  $("#timerText").textContent = `${m}:${String(s).padStart(2, "0")}`;
  const pill = $("#timerPill");
  pill.classList.remove("warn", "danger");
  if (S.remaining <= 60) pill.classList.add("danger");
  else if (S.remaining <= 300) pill.classList.add("warn");
}

// ---- submit ----------------------------------------------------------------
function openConfirm() {
  const left = S.questions.length - answeredCount();
  $("#confirmText").textContent = left > 0
    ? `You have ${left} unanswered question${left > 1 ? "s" : ""}. Unanswered questions are scored as incorrect. Submit anyway?`
    : `All ${S.questions.length} questions answered. Ready to see your results?`;
  $("#confirmModal").classList.add("show");
}

function doSubmit(byTimeout) {
  clearInterval(timerInt);
  teardown();
  closeMobileNav();

  const total = S.questions.length;
  let correctCount = 0;
  let attemptedCount = 0;
  const perQuestion = [];
  const wrongQuestions = [];
  const answers = {};
  const topicMap = {};

  S.order.forEach((qi) => {
    const q = S.questions[qi];
    const a = S.answers[q.id] || [];
    answers[q.id] = a;
    const ok = isCorrect(q);
    const attempted = a.length > 0; // user selected at least one option
    if (ok) correctCount++;
    if (attempted) attemptedCount++;
    perQuestion.push({ q, picked: a, isCorrect: ok });
    topicMap[q.topic] = topicMap[q.topic] || { correct: 0, total: 0 };
    topicMap[q.topic].total++;
    if (ok) topicMap[q.topic].correct++;
    // Only send questions the user actually answered-and-got-wrong to the AI.
    // Skipped/empty questions carry no signal worth spending tokens on — the
    // topic breakdown still reflects them (counted as incorrect) so the coach
    // can target those weak topics for adaptive questions.
    if (!ok && attempted) {
      wrongQuestions.push({
        topic: q.topic, text: q.text,
        options: q.options, correct: q.correct, yourAnswer: a,
      });
    }
  });

  const topicBreakdown = Object.entries(topicMap)
    .map(([topic, o]) => ({ topic, correct: o.correct, total: o.total, pct: Math.round((o.correct / o.total) * 100) }))
    .sort((x, y) => x.pct - y.pct);

  const pct = Math.round((correctCount / total) * 10000) / 100;
  const durationUsed = S.timed ? (optDuration() - S.remaining) : null;

  onComplete?.({
    source: S.source, round: S.round,
    correctCount, attemptedCount, total, pct, passed: pct / 100 >= PASS_MARK,
    timeUsed: byTimeout && S.timed ? optDuration() : durationUsed,
    topicBreakdown, perQuestion, wrongQuestions, answers,
  });
}

function optDuration() { return DEFAULT_DURATION; }

// Bind static controls once on import.
wireControls();
