# Google Cloud Professional Cloud Architect (PCA) — Study Resource Guide

> Compiled 2026-06-24 via parallel research (official docs + instructors + passer accounts + practice banks).
> All URLs verified against source pages. **Authoritative version finding below — read it first.**

---

## 0. ⚠️ EXAM VERSION — read before anything else

**Current exam: PCA v6.1, effective October 30, 2025.**

> "If you plan to take the Professional Cloud Architect exam in English on or after October 30, review this exam guide." — official v6.1 guide PDF

### What changed (≈70% overlap with the old exam, ≈30% new)

| | Old exam (what the 19-Jun practice test used) | Current v6.1 |
|---|---|---|
| **Case studies** | EHR Healthcare, Helicopter Racing League, Mountkirk Games, TerramEarth | **EHR Healthcare (kept)** + **Altostrat Media**, **Cymbal Retail**, **KnightMotives Automotive** (all GenAI-centric) |
| **AI** | Minimal | **Core** — Gemini Enterprise Agent Platform (was Vertex AI), Model Garden, Gemini Cloud Assist, NotebookLM, Securing AI / Model Armor |
| **Framework** | Implicit | **Well-Architected Framework, all 6 pillars** (incl. sustainability) named as key requirement |

- **Study LESS:** App Engine (use Cloud Run), specific gcloud syntax, pure lift-and-shift, VM remote-access trivia, quota/billing minutiae, CIDR/subnet sizing.
- **Study MORE:** Cloud Run / Cloud Deploy / Application Integration; Direct VPC Egress for serverless; Cloud KMS HSM, VPC Service Controls, conditional IAM; Vertex AI/Gemini Model Garden + Pipelines; AlloyDB, Filestore tiers, Bigtable schema; Migration Center, Google Cloud VMware Engine; GKE autoscalers (VPA vs HPA).

> ⚠️ Many third-party courses/books still describe the OLD case-study pool. If a resource lists Mountkirk/HRL/TerramEarth as current or never mentions Vertex AI/Gemini, it predates v6.1 — use it for fundamentals only.

---

## 1. Official Google resources (source of truth — all FREE)

| Resource | Type | URL |
|---|---|---|
| PCA certification main page (logistics, registration) | Page | https://cloud.google.com/learn/certification/cloud-architect |
| **Exam guide (current, redirects to v6.1)** | PDF | https://services.google.com/fh/files/misc/professional_cloud_architect_exam_guide_english.pdf |
| Exam guide — version-pinned v6.1 | PDF | https://services.google.com/fh/files/misc/v6.1_pca_professional_cloud_architect_exam_guide_english.pdf |
| Renewal exam guide (1-hr, 4 sections) | PDF | https://services.google.com/fh/files/misc/professional_cloud_architect_renewal_exam_guide_eng.pdf |
| **Official sample questions** (do first AND last) | Google Form | https://docs.google.com/forms/d/e/1FAIpQLSf54f7FbtSJcXUY6-DUHfBG31jZ3pujgb8-a5io_9biJsNpqg/viewform |
| Skills Boost — PCA learning path (24 activities) | Path | https://www.skills.google/paths/12 |
| Skills Boost — "Preparing for your PCA Journey" | Course | https://cloud.google.com/training/courses/preparing-pro-cloud-architect-exam |
| Skills Boost — "Build a Certification Study Guide" (NotebookLM) | Course | https://www.skills.google/course_templates/78 |
| Coursera — official "Cloud Architect Professional Certificate" | Specialization | https://www.coursera.org/professional-certificates/gcp-cloud-architect |

### Current case studies (v6.1) — memorize these, retire the old ones
| Case study | URL |
|---|---|
| EHR Healthcare (retained) | https://services.google.com/fh/files/misc/v6.1_pca_ehr_healthcare_case_study_english.pdf |
| Altostrat Media (new) | https://services.google.com/fh/files/misc/v6.1_pca_altostrat_media_case_study_english.pdf |
| Cymbal Retail (new) | https://services.google.com/fh/files/misc/v6.1_pca_cymbal_retail_case_study_english.pdf |
| KnightMotives Automotive (new) | https://services.google.com/fh/files/misc/v6.1_pca_knightmotives_automotive_case_study_english.pdf |

### Exam logistics
- **Standard:** $200 USD, 2 hours, 50–60 questions (multiple choice/select), English & Japanese, valid 2 years.
- **Renewal:** $100 USD, 1 hour, 25 questions (opens 60 days before expiry).
- Format: online-proctored (remote) or onsite testing center.

### Exam domains & weighting (v6.1 standard exam)
| Section | Weight |
|---|---|
| 1. Designing & planning a cloud solution architecture | ~25% |
| 2. Managing & provisioning cloud infrastructure | ~17.5% |
| 3. Designing for security & compliance | ~17.5% |
| 4. Analyzing & optimizing technical/business processes | ~15% |
| 5. Managing implementation | ~12.5% |
| 6. Ensuring solution & operations excellence | ~12.5% |

---

## 2. Courses & instructors (best-regarded, confirmed current)

| Resource | Instructor | Platform | Cost | Current? | Strength |
|---|---|---|---|---|---|
| **GCP Professional Cloud Architect Certification** | Ranga Karanam (in28Minutes) | Udemy | ~$15–20 | ✅ updated 5/2026 | Best-structured full video course; beginner-friendly |
| **Cloud Architect Professional Certificate** (7 courses, ~49h) | Google Cloud | Coursera | Audit free / ~$49/mo | ✅ 4.7★ (61k) | Official curriculum + Qwiklabs labs |
| **Free 16-hr PCA course** | Andrew Brown (ExamPro) | YouTube/freeCodeCamp | Free | ✅ Aug 2025 | Best free comprehensive course | 
| → link | | | | | https://youtu.be/u43gJJrVa1I |
| **PCA Study Guide, 2nd ed.** | Dan Sullivan | Wiley/Sybex (book) | Paid | ⚠️ 2022 — pre-GenAI | The definitive textbook; supplement AI topics separately |
| → link | | | | | https://www.oreilly.com/library/view/google-cloud-certified/9781119871057/ |
| **PCA learning path** (refreshed Aug–Dec 2025) | Victor Dantas | Pluralsight | ~$29–45/mo | ✅ | Concise, recent; good for experienced architects |
| **GCP PCA path** | Whizlabs team | Whizlabs | Paid | likely ✅ (verify) | Heavy hands-on labs + sandbox |

**Notes repo (freshest, covers current case studies):** https://github.com/vipulgupta2048/awesome-google-cloud-architect (updated Sept 2025)
**Avoid as primary:** grantcarthew/notes-google-cloud-architect (last updated 2020).

---

## 3. Practice exams & question banks

| Resource | Cost | # Q | Note |
|---|---|---|---|
| **Tutorials Dojo / Jon Bonso** (the gold standard) | ~$11 | 120+ | Best explanations w/ doc refs; 4 modes + flashcards |
| Tutorials Dojo — **FREE sampler** | Free | 30 | Best free explanation-rich starter |
| → https://portal.tutorialsdojo.com/courses/free-google-cloud-certified-professional-cloud-architect-practice-exams-sampler/ |
| Udemy — "GCP PCA: 6 Practice Exams [2026]" | ~$13–20 | 300 | Highest-volume current set |
| Udemy — "Google PCA [Exams 2026]" | ~$13–20 | 6 exams | Aligned to the **current** case studies |
| Whizlabs — 25 free questions | Free | 25 | https://www.whizlabs.com/blog/gcp-professional-cloud-architect-free-questions/ |
| **Official sample questions** | Free | ~25 | The source of truth for question *style* |
| ⚠️ ExamTopics | Free/paywall | 300+ | **Exposure only.** Community "correct" answers are frequently wrong (~30–40%). Verify every answer against official docs. Never memorize its keys. |

---

## 4. Free hands-on practice (highest-retention activity per passers)

| Resource | What | URL |
|---|---|---|
| **$300 free credit / 90 days** | Build the case-study architectures yourself | https://cloud.google.com/free |
| Skills Boost PCA path | Official labs in real console | https://www.skills.google/paths/12 |
| Always-free tier | Keep practicing after credit | https://cloud.google.com/free/docs/free-cloud-features |
| Innovators credits (~35/mo) | Fund Skills Boost labs/badges | https://cloud.google.com/innovators |
| Official Anki deck (archived 2023 — fundamentals only) | Flashcards | https://github.com/GoogleCloudPlatform/google-cloud-flashcards |
| Curated free resource hub | Index of free PCA material | https://github.com/sathishvj/awesome-gcp-certifications/blob/master/professional-cloud-architect.md |

---

## 5. 🎯 Targeted resources for YOUR weak areas (from the 19-Jun diagnostic, 13/19)

Official docs preferred — these are the "best practice" source the exam grades against.

| # | Weak area (missed question) | Best resource | URL |
|---|---|---|---|
| a | **Hybrid connectivity** — Dedicated vs Partner Interconnect vs VPN vs Peering (Q2) | "Choosing a Network Connectivity product" decision guide | https://docs.cloud.google.com/network-connectivity/docs/how-to/choose-product |
| b | **SRE — SLI/SLO/SLA/error budgets** (Q8) | SRE Workbook — "Implementing SLOs" | https://sre.google/workbook/implementing-slos/ |
| c | **VPC Service Controls scoping** (Q7) | VPC Service Controls overview + service perimeters | https://docs.cloud.google.com/vpc-service-controls/docs/overview |
| d | **Billing & cost mgmt** — BigQuery export, labels, budgets (Q18) | "Export Cloud Billing data to BigQuery" | https://docs.cloud.google.com/billing/docs/how-to/export-data-bigquery |
| e | **Compute Engine PD performance** — IOPS scales w/ size & vCPUs (Q19) | "Persistent Disk performance overview" | https://docs.cloud.google.com/compute/docs/disks/performance |
| f | **GKE security best practices** (Q6) | "Harden your cluster's security" | https://docs.cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster |

**Plus a NEW gap created by v6.1:** generative AI architecture & governance.
- Vertex AI / Gemini docs: https://cloud.google.com/vertex-ai/docs
- Securing AI / Model Armor + AI governance — study alongside the 3 new case studies.

---

## 6. Recommended study plan

**Consensus from 11 passer accounts: 6–12 weeks, ~10–15 hrs/week (≈60–120 hrs total).** ACE-level knowledge assumed.

1. **Calibrate (week 1):** Official sample questions → Tutorials Dojo free 30-Q sampler. Re-read the v6.1 exam guide PDF.
2. **Close YOUR gaps (weeks 1–2):** Drill the 6 weak-area docs in §5 — that's where your points leaked.
3. **Structured course (weeks 1–5):** in28Minutes (Udemy) or Coursera official cert + Andrew Brown's free 16-hr course for breadth.
4. **Add the NEW v6.1 material (weeks 3–6):** Vertex AI/Gemini, Cloud Run/Cloud Deploy, AI governance, Well-Architected 6 pillars.
5. **Hands-on throughout:** $300 credit — actually build Interconnect/VPN, VPC SC, GKE hardening, a Vertex AI pipeline.
6. **Memorize the 4 CURRENT case studies** (EHR, Altostrat Media, Cymbal Retail, KnightMotives) — they're ~20–30% of the exam and free points.
7. **Final 1–2 weeks:** Timed full-length mocks (Tutorials Dojo paid + Udemy 2026 sets), log every wrong answer in a spreadsheet, re-drill misses.

**Exam-day mindset (from passers):** questions ask for the *BEST* option, not merely a correct one — separate real constraints from narrative noise; networking is the single heaviest domain; no per-question feedback, so calibrate via mocks.
