-- Allow case-study and combined question-set sources on attempts.
--
-- The initial schema constrained attempts.source to ('base-19','adaptive'). The
-- v6.1 case-study question sets introduced new source labels — 'case-altostrat',
-- 'case-cymbal', 'case-ehr', 'case-night', plus 'cases-all' and 'everything' —
-- which were silently failing the INSERT (check_violation), so those attempts
-- were never saved and, because handleComplete returns early on a save error,
-- AI coaching never ran for them either.
--
-- Replace the rigid IN-list with a pattern that covers the current sets and any
-- future 'case-*' key without another migration.

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
  check (source ~ '^(base-19|adaptive|cases-all|everything|case-[a-z0-9-]+)$');
