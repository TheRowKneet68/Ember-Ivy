-- ============================================================
-- Ember & Ivy — Supabase schema
-- Run this in the Supabase SQL editor after creating your project.
-- Public visitors can read; authenticated admins (email/password)
-- get full CRUD. Enable Auth > Email provider first.
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

-- Public can read the site content (not reservations/settings/analytics)
do $$
declare
  t text;
begin
  foreach t in array array['categories','menu_items','reviews','events','gallery','hero_slides','team','instagram']
  loop
    execute format('create policy "public_read_%1$s" on public.%1$s for select using (true);', t);
  end loop;
end $$;

-- Authenticated admin can read/write everything
do $$
declare
  t text;
begin
  foreach t in array array[
    'categories','menu_items','reviews','events','gallery',
    'reservations','hero_slides','team','instagram','settings','analytics'
  ]
  loop
    execute format('create policy "admin_all_%1$s" on public.%1$s for all to authenticated using (true) with check (true);', t);
  end loop;
end $$;

-- ---------- Default settings ----------
insert into public.settings (key, value) values
  ('theme', '"dark"'::jsonb),
  ('rating', '4.7'::jsonb)
on conflict (key) do nothing;
