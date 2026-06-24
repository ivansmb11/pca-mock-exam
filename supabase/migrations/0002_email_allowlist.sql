-- Email allowlist: only listed addresses may create an account (Google or email).
-- Enforced server-side via a BEFORE INSERT trigger on auth.users, so a
-- non-listed email can authenticate with Google but cannot be provisioned —
-- the sign-in fails and no user/session is created.

create table if not exists public.allowed_emails (
  email      text primary key,
  note       text,
  created_at timestamptz not null default now()
);

-- Admin-only table: enable RLS with no policies so anon/authenticated cannot
-- read or write it. The trigger function (SECURITY DEFINER, owned by postgres
-- which also owns the table) bypasses RLS; manage rows via SQL / service role.
alter table public.allowed_emails enable row level security;

create or replace function public.enforce_email_allowlist()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email is null
     or not exists (
       select 1 from public.allowed_emails a
       where lower(a.email) = lower(new.email)
     ) then
    raise exception 'Email % is not authorized to sign in to this app', new.email
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_email_allowlist on auth.users;
create trigger enforce_email_allowlist
  before insert on auth.users
  for each row execute function public.enforce_email_allowlist();

-- Seed the allowlist.
insert into public.allowed_emails (email, note)
values ('ivanmendozabaca@gmail.com', 'owner')
on conflict (email) do nothing;
