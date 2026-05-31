-- ============================================================
-- Shadow Raiders — Member Section Schema
-- Run this in Supabase SQL Editor AFTER the main schema
-- ============================================================

-- MEMBERS TABLE
-- Each row is one member account with a unique password
create table if not exists members (
  id uuid default gen_random_uuid() primary key,
  username text not null unique,           -- display name (e.g. "King Andy")
  password_hash text not null,             -- bcrypt hash of their unique password
  role text not null default 'member',     -- 'member' | 'officer'
  notes text,                              -- admin notes (e.g. "joined academy May 2025")
  active boolean not null default true,    -- false = account disabled (left alliance)
  created_at timestamptz default now(),
  last_login timestamptz,
  updated_at timestamptz default now()
);

-- MEMBER POSTS TABLE
-- Text posts/announcements visible in the member area
create table if not exists member_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  body text not null,
  category text not null default 'announcement', -- 'announcement' | 'tactics' | 'news' | 'other'
  pinned boolean not null default false,
  created_by text not null default 'Admin',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- MEMBER FILES TABLE
-- Files uploaded by admin for members to download
create table if not exists member_files (
  id uuid default gen_random_uuid() primary key,
  name text not null,                      -- display name
  description text,
  file_path text not null,                 -- path in Supabase Storage
  file_url text not null,                  -- public URL
  file_type text not null,                 -- mime type
  file_size integer,                       -- bytes
  category text not null default 'general', -- 'general' | 'tactics' | 'rules' | 'media'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- MEMBER SESSIONS TABLE
-- Tracks active member login tokens
create table if not exists member_sessions (
  id uuid default gen_random_uuid() primary key,
  member_id uuid not null references members(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- RLS policies
alter table members         enable row level security;
alter table member_posts    enable row level security;
alter table member_files    enable row level security;
alter table member_sessions enable row level security;

-- Only service role (admin API) can read/write all member data
-- Public cannot read any of this directly — all access goes through our API

-- Create Supabase Storage bucket for member files
-- (Run this separately in the Storage section of your Supabase dashboard,
--  or uncomment and run this SQL if your Supabase version supports it)
-- insert into storage.buckets (id, name, public) values ('member-files', 'member-files', false);

-- Storage policy: only service role can upload/read
-- (Configure in Supabase Dashboard > Storage > member-files > Policies)
