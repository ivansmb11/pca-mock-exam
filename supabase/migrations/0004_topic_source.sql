-- Allow topic/week study-set sources on attempts.
--
-- Alongside the v6.1 case-study sets ('case-*'), the app now has topic sets
-- generated from the weekly study-group decks (docs/week1.pdf → Week 1 —
-- Cloud Foundations). Those attempts are stored with source 'topic-<key>'
-- (e.g. 'topic-week1'), which the 0003 pattern rejects — and a rejected
-- INSERT silently drops the attempt and skips AI coaching (same failure mode
-- 0003 fixed for case sets). Extend the pattern with 'topic-*' so any future
-- weekly set works without another migration.

do $$
declare c text;
begin
  for c in
    select conname
    from pg_constraint
    where conrelid = 'public.attempts'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%source%'
  loop
    execute format('alter table public.attempts drop constraint %I', c);
  end loop;
end $$;

alter table public.attempts
  add constraint attempts_source_check
  check (source ~ '^(base-19|adaptive|cases-all|everything|case-[a-z0-9-]+|topic-[a-z0-9-]+)$');
