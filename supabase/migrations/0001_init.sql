-- PCA Mock Exam — initial schema
-- Per-user exam history, AI coaching, and adaptive questions.
-- Every table is owned by the authenticated user and protected by RLS.

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- attempts: one row per completed exam run
-- ----------------------------------------------------------------------------
create table if not exists public.attempts (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users (id) on delete cascade,
  created_at         timestamptz not null default now(),
  round              int  not null default 1,
  source             text not null default 'base-19'
                       check (source in ('base-19', 'adaptive')),
  score_correct      int  not null,
  score_total        int  not null,
  pct                numeric(5,2) not null,
  time_used_seconds  int,
  topic_breakdown    jsonb not null default '[]'::jsonb,
  answers            jsonb not null default '{}'::jsonb
);

create index if not exists attempts_user_created_idx
  on public.attempts (user_id, created_at);

-- ----------------------------------------------------------------------------
-- ai_feedback: Claude's coaching for an attempt
-- ----------------------------------------------------------------------------
create table if not exists public.ai_feedback (
  id           uuid primary key default gen_random_uuid(),
  attempt_id   uuid not null references public.attempts (id) on delete cascade,
  user_id      uuid not null references auth.users (id) on delete cascade,
  created_at   timestamptz not null default now(),
  summary      text,
  strengths    jsonb not null default '[]'::jsonb,
  focus_areas  jsonb not null default '[]'::jsonb,
  model        text,
  raw          jsonb
);

create index if not exists ai_feedback_user_created_idx
  on public.ai_feedback (user_id, created_at);
create index if not exists ai_feedback_attempt_idx
  on public.ai_feedback (attempt_id);

-- ----------------------------------------------------------------------------
-- generated_questions: adaptive questions Claude produced for the next round
-- ----------------------------------------------------------------------------
create table if not exists public.generated_questions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  attempt_id   uuid references public.attempts (id) on delete set null,
  created_at   timestamptz not null default now(),
  topic        text,
  question     jsonb not null,
  used         boolean not null default false
);

create index if not exists generated_questions_user_created_idx
  on public.generated_questions (user_id, created_at);
create index if not exists generated_questions_user_unused_idx
  on public.generated_questions (user_id, used);

-- ----------------------------------------------------------------------------
-- Row Level Security: a user may only touch their own rows
-- ----------------------------------------------------------------------------
alter table public.attempts            enable row level security;
alter table public.ai_feedback         enable row level security;
alter table public.generated_questions enable row level security;

-- attempts
create policy "attempts: select own"
  on public.attempts for select using (auth.uid() = user_id);
create policy "attempts: insert own"
  on public.attempts for insert with check (auth.uid() = user_id);
create policy "attempts: update own"
  on public.attempts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "attempts: delete own"
  on public.attempts for delete using (auth.uid() = user_id);

-- ai_feedback
create policy "ai_feedback: select own"
  on public.ai_feedback for select using (auth.uid() = user_id);
create policy "ai_feedback: insert own"
  on public.ai_feedback for insert with check (auth.uid() = user_id);
create policy "ai_feedback: update own"
  on public.ai_feedback for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ai_feedback: delete own"
  on public.ai_feedback for delete using (auth.uid() = user_id);

-- generated_questions
create policy "generated_questions: select own"
  on public.generated_questions for select using (auth.uid() = user_id);
create policy "generated_questions: insert own"
  on public.generated_questions for insert with check (auth.uid() = user_id);
create policy "generated_questions: update own"
  on public.generated_questions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "generated_questions: delete own"
  on public.generated_questions for delete using (auth.uid() = user_id);
