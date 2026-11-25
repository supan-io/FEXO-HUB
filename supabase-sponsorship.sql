-- FEXOZONE sponsorship system (run in Supabase SQL Editor)
create extension if not exists pgcrypto;

create table if not exists public.owner_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.sponsorship_requests (
  id uuid primary key default gen_random_uuid(),
  company_name text not null check (char_length(company_name) between 2 and 120),
  contact_person text not null check (char_length(contact_person) between 2 and 100),
  business_email text not null check (char_length(business_email) between 5 and 254),
  website text,
  country_region text,
  package_interest text not null check (package_interest in ('Starter','Premium','Exclusive','Custom campaign','Not sure yet')),
  indicative_budget text,
  campaign_goals text not null check (char_length(campaign_goals) between 2 and 250),
  proposal text not null check (char_length(proposal) between 10 and 3000),
  status text not null default 'new' check (status in ('new','reviewing','accepted','declined')),
  owner_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.owner_access enable row level security;
alter table public.sponsorship_requests enable row level security;

-- Owners can verify their own owner_access membership.
drop policy if exists "Owners can read own access" on public.owner_access;
create policy "Owners can read own access" on public.owner_access
for select to authenticated using (user_id = auth.uid());

-- Public visitors can submit an inquiry, but cannot read or edit requests.
drop policy if exists "Anyone can submit sponsorship inquiry" on public.sponsorship_requests;
create policy "Anyone can submit sponsorship inquiry" on public.sponsorship_requests
for insert to anon, authenticated with check (
  status = 'new' and owner_notes is null
);

-- Only users manually placed in owner_access can view and manage submissions.
drop policy if exists "Owners can view sponsorship requests" on public.sponsorship_requests;
create policy "Owners can view sponsorship requests" on public.sponsorship_requests
for select to authenticated using (
  exists (select 1 from public.owner_access oa where oa.user_id = auth.uid())
);
drop policy if exists "Owners can update sponsorship requests" on public.sponsorship_requests;
create policy "Owners can update sponsorship requests" on public.sponsorship_requests
for update to authenticated
using (exists (select 1 from public.owner_access oa where oa.user_id = auth.uid()))
with check (exists (select 1 from public.owner_access oa where oa.user_id = auth.uid()));

-- IMPORTANT: After you sign in once with Google, copy your user UUID from
-- Supabase → Authentication → Users, then run this with your actual UUID:
-- insert into public.owner_access (user_id) values ('YOUR-AUTH-USER-UUID');
-- Do not put your UUID or service_role key in public website files.
