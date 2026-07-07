-- Hall of Fame setup for Shadow Raiders
-- Run this once in the Supabase SQL editor before adding Hall of Fame profiles.

create table if not exists public.hall_of_fame_profiles (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  role_title text,
  short_description text not null,
  biography text,
  avatar_url text,
  avatar_path text,
  inducted_at date,
  tags text[] not null default '{}',
  status text,
  sort_order integer,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists hall_of_fame_profiles_public_sort_idx
  on public.hall_of_fame_profiles (is_public, sort_order, inducted_at desc, created_at desc);

alter table public.hall_of_fame_profiles enable row level security;

-- Public reads are safe because only visible profile data is stored here.
drop policy if exists "Public can read visible Hall of Fame profiles" on public.hall_of_fame_profiles;
create policy "Public can read visible Hall of Fame profiles"
  on public.hall_of_fame_profiles
  for select
  using (is_public = true);

-- Admin writes go through the server-side Supabase service role key.
-- No public insert/update/delete policies are created.

insert into storage.buckets (id, name, public)
values ('hall-of-fame', 'hall-of-fame', true)
on conflict (id) do update set public = true;

-- Public avatar reads for the Hall of Fame bucket.
drop policy if exists "Public can read Hall of Fame avatars" on storage.objects;
create policy "Public can read Hall of Fame avatars"
  on storage.objects
  for select
  using (bucket_id = 'hall-of-fame');
