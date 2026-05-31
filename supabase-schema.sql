-- ============================================================
-- Shadow Raiders Alliance — Supabase Database Schema
-- Run this in your Supabase SQL Editor (supabase.com > SQL Editor)
-- ============================================================

-- SCHEDULE TABLE
create table if not exists schedule (
  id uuid default gen_random_uuid() primary key,
  date date not null,
  time_gmt text not null default 'TBC',
  competition text not null,        -- 'rise' | 'cfc' | 'ams' | 'friendly'
  title text not null,
  opponent text not null,
  status text not null default 'upcoming', -- 'upcoming' | 'completed' | 'cancelled'
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RESULTS TABLE
create table if not exists results (
  id uuid default gen_random_uuid() primary key,
  date date not null,
  competition text not null,
  title text not null,
  opponent text not null,
  our_score int,
  their_score int,
  outcome text,                     -- 'win' | 'loss' | 'draw'
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- LEADERSHIP TABLE
create table if not exists leadership (
  id uuid default gen_random_uuid() primary key,
  rank_order int not null,
  name text not null,
  rank_title text not null,         -- e.g. "Command — Rank 1"
  role_title text not null,         -- e.g. "Founder & Alliance Owner"
  bio text not null,
  badge_text text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- FAQ TABLE
create table if not exists faq (
  id uuid default gen_random_uuid() primary key,
  sort_order int not null default 0,
  question text not null,
  answer text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security (RLS) — read is public, writes require service role
alter table schedule   enable row level security;
alter table results    enable row level security;
alter table leadership enable row level security;
alter table faq        enable row level security;

-- Public read access
create policy "Public can read schedule"   on schedule   for select using (true);
create policy "Public can read results"    on results    for select using (true);
create policy "Public can read leadership" on leadership for select using (true);
create policy "Public can read faq"        on faq        for select using (true);

-- ============================================================
-- SEED DATA — Initial content
-- ============================================================

insert into schedule (date, time_gmt, competition, title, opponent, status) values
  ('2025-05-09', '16:00', 'rise',     'Rise League — Game 4', 'Bware', 'upcoming'),
  ('2025-05-17', '16:00', 'friendly', 'Friendly AvA',         'TCR',   'upcoming'),
  ('2025-06-14', '15:00', 'rise',     'Rise League — Game 4', 'WWS',   'upcoming');

insert into leadership (rank_order, name, rank_title, role_title, bio, badge_text) values
  (1, 'Marc1809',   'Command — Rank 1', 'Founder & Alliance Owner',
   'Founded both Shadow Raiders and its predecessor Raiders CoN. Has led the organisation as Alliance Owner and Leader from day one — the constant at the centre of everything Shadow Raiders has built.',
   '✦ Founder · Since 2023'),
  (2, 'King Andy',  'Command — Rank 2', '2nd in Command',
   'The longest-serving member of the alliance, having joined in summer 2023. King Andy has been a pillar of the organisation since its earliest days, accumulating years of leadership experience alongside the founder.',
   '★ Since Summer 2023'),
  (3, 'Anton',      'Command — Rank 3', '3rd in Command',
   'A core member for over two years, Anton has built deep operational experience and plays a key role in the day-to-day running of the alliance and its competitive campaigns.',
   '◉ 2+ Years Experience'),
  (4, 'Lost Soul',  'Command — Rank 4', '4th in Command',
   'Over a year of internal command experience, Lost Soul has proven themselves as a reliable and effective leader. Their operational knowledge and commitment to the team continue to strengthen the command structure.',
   '◈ 1+ Year Internal Experience');

insert into faq (sort_order, question, answer) values
  (1, 'What if I don''t meet the rank or K/D requirements?',
     'Apply to the Raiders Academy. There you can learn, develop, and improve over time — and once you meet the standards, you''ll graduate directly into Shadow Raiders.'),
  (2, 'What AvA leagues does Shadow Raiders compete in?',
     'We currently play in Rise League and CFC. We are also launching our own tournament — the Alliance Masters Series (AMS) — starting June 2026.'),
  (3, 'Can I bring a friend?',
     'Absolutely. Friends are welcome to apply together. Each applicant is reviewed individually against our standard requirements.'),
  (4, 'Do I need to speak English?',
     'Yes — English is a key requirement. Being fluent is ideal, but being fast and reliable with a translator is also acceptable. Clear communication is essential for coordinated play.'),
  (5, 'Do I need to join voice chat?',
     'Joining voice for Alliance games may be required when coordinating AvA operations. As a regular member outside of those moments, you are not required to speak.'),
  (6, 'Is there an age requirement?',
     'No — there is no minimum age. What we do expect is that every member meets our character and behavioural standards. Maturity matters more than age.'),
  (7, 'What timezone should I be in?',
     'We have members from all over the world. Most AvA wars run between 15:00–19:00 GMT, so players based in Europe or North America benefit most from the scheduling.');
