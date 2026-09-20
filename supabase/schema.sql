-- ============================================================
-- Ember & Ivy — Supabase schema
-- Run this in the Supabase SQL editor after creating your project.
--
-- Security model (Row Level Security):
--   * Public visitors (anon role) can only:
--       - SELECT site content (categories, menu_items, reviews, events,
--         gallery, hero_slides, team, instagram)
--       - SELECT a limited set of settings rows used to render the site
--         (theme, rating, sections, defaultTheme)
--       - INSERT their own reservation (status locked to 'pending')
--       - Track the aggregate "visits" counter (read/increment only the
--         'visits' analytics row)
--   * Authenticated admin users have full CRUD on every table.
--   * Reservations, settings and private analytics are NEVER publicly readable.
--
-- The script is idempotent — it can be run again safely.
-- Enable Auth > Email provider first, then add an admin user under
-- Auth > Users (the email/password admin signs in with at /admin).
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text,
  description text,
  sort int default 0,
  created_at timestamptz default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric,
  category text,
  image text,
  veg boolean default true,
  popular boolean default false,
  chef boolean default false,
  seasonal boolean default false,
  rating numeric default 5,
  created_at timestamptz default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating int default 5,
  review_date text,
  text text,
  tag text,
  created_at timestamptz default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date,
  time text,
  tag text,
  description text,
  image text,
  cover numeric default 0,
  featured boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  src text not null,
  cat text,
  title text,
  created_at timestamptz default now()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  guests int,
  date text,
  time text,
  occasion text,
  message text,
  status text default 'pending',   -- pending | confirmed | cancelled
  created_at timestamptz default now()
);

create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  image text not null,
  label text,
  sort int default 0,
  created_at timestamptz default now()
);

create table if not exists public.team (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  image text,
  bio text,
  created_at timestamptz default now()
);

create table if not exists public.instagram (
  id uuid primary key default gen_random_uuid(),
  src text not null,
  link text,
  sort int default 0,
  created_at timestamptz default now()
);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb,
  created_at timestamptz default now()
);

create table if not exists public.analytics (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value numeric default 0,
  updated_at timestamptz default now()
);

-- ---------- Row Level Security ----------
alter table public.categories    enable row level security;
alter table public.menu_items    enable row level security;
alter table public.reviews       enable row level security;
alter table public.events        enable row level security;
alter table public.gallery       enable row level security;
alter table public.reservations  enable row level security;
alter table public.hero_slides   enable row level security;
alter table public.team          enable row level security;
alter table public.instagram     enable row level security;
alter table public.settings      enable row level security;
alter table public.analytics     enable row level security;

-- ---------- Policies (idempotent: drop-then-create) ----------

-- Public can read the site content (not reservations/settings/analytics).
do $$
declare
  p text;
  t text;
begin
  foreach t in array array['categories','menu_items','reviews','events','gallery','hero_slides','team','instagram']
  loop
    p := 'public_read_' || t;
    execute format('drop policy if exists %I on public.%I;', p, t);
    execute format('create policy %I on public.%I for select using (true);', p, t);
  end loop;
end $$;

-- Authenticated admin can read/write everything (full CRUD).
do $$
declare
  p text;
  t text;
begin
  foreach t in array array[
    'categories','menu_items','reviews','events','gallery',
    'reservations','hero_slides','team','instagram','settings','analytics'
  ]
  loop
    p := 'admin_all_' || t;
    execute format('drop policy if exists %I on public.%I;', p, t);
    execute format('create policy %I on public.%I for all to authenticated using (true) with check (true);', p, t);
  end loop;
end $$;

-- Reservations: public visitors can submit a booking (always 'pending'),
-- but the data is never readable by the public.
drop policy if exists public_insert_reservations on public.reservations;
create policy public_insert_reservations on public.reservations
  for insert to anon, authenticated
  with check (status is null or status = 'pending');

-- Settings: the site needs a few configuration values to render itself.
-- Everything sensitive stays private; only these keys are public.
drop policy if exists public_read_settings on public.settings;
create policy public_read_settings on public.settings
  for select
  using (key in ('theme', 'rating', 'sections', 'defaultTheme'));

-- Analytics: the aggregate visit counter is tracked anonymously.
-- Public can only read/increment the 'visits' row (never other keys).
drop policy if exists public_read_analytics on public.analytics;
create policy public_read_analytics on public.analytics
  for select using (key = 'visits');

drop policy if exists public_track_insert_analytics on public.analytics;
create policy public_track_insert_analytics on public.analytics
  for insert to anon, authenticated
  with check (key = 'visits');

drop policy if exists public_track_update_analytics on public.analytics;
create policy public_track_update_analytics on public.analytics
  for update to anon, authenticated
  using (key = 'visits') with check (key = 'visits');

-- ---------- Default settings ----------
insert into public.settings (key, value) values
  ('theme', '"dark"'::jsonb),
  ('rating', '4.7'::jsonb)
on conflict (key) do nothing;