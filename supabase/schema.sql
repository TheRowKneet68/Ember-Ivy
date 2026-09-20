-- ============================================================
-- Ember & Ivy — Supabase schema
-- Run this in the Supabase SQL editor after creating your project.
-- The script is idempotent — it can be run again safely.
--
-- ACCESS ROLES (stored in the `profiles` table, set inside the app):
--   * admin    — full access: content, reservations, settings, users, uploads
--   * employee — content only (menu, categories, gallery, reviews, events,
--                hero, team, instagram) + image uploads. NOT reservations,
--                settings or users.
--   * client   — a guest portal: can only read + cancel their OWN
--                reservations (matched on the booking email).
--
-- ROW LEVEL SECURITY:
--   * Public visitors (anon) can only:
--       - SELECT site content tables
--       - SELECT a limited set of settings rows used to render the site
--         (theme, rating, sections, defaultTheme)
--       - INSERT their own reservation (status locked to 'pending')
--       - Track the aggregate "visits" counter
--   * Admins/employees write content; only admins touch settings,
--     reservations, analytics and user accounts.
--   * Existing accounts created before this script (e.g. in the dashboard)
--     are backfilled as admins to preserve their previous full access.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- Tables ----------

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

-- User accounts: one row per auth user holding their access role.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'employee'
    check (role in ('admin', 'employee', 'client')),
  created_at timestamptz default now()
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
alter table public.profiles      enable row level security;

-- Grant the app roles the base privileges (RLS still enforces what each
-- role may actually do).
grant select on public.categories, public.menu_items, public.reviews,
  public.events, public.gallery, public.hero_slides, public.team,
  public.instagram, public.settings, public.profiles to anon, authenticated;
grant insert, update, delete on public.categories, public.menu_items,
  public.reviews, public.events, public.gallery, public.settings,
  public.hero_slides, public.team, public.instagram, public.analytics,
  public.reservations, public.profiles to authenticated;
grant select, insert, update on public.analytics to anon, authenticated;
grant select, insert on public.reservations to anon, authenticated;

-- ---------- Role helper ----------
-- Returns the caller's access role ('' when they have no profile yet).
-- SECURITY DEFINER so RLS policies can call it without recursion.
create or replace function public.app_role() returns text
language sql stable security definer set search_path = public as $$
  select coalesce((select role from public.profiles where id = auth.uid()), '')
$$;

-- Auto-add a profile when a new auth account signs up (never admins by default).
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, lower(new.email), 'employee')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: accounts that existed before this script keep their previous
-- full access (they are now admins). New accounts use the roles above.
insert into public.profiles (id, email, role)
select id, lower(email), 'admin' from auth.users
on conflict (id) do nothing;

-- ---------- Content: everyone can read; staff (admin/employee) can write ----------
do $$
declare
  p text;
  t text;
begin
  foreach t in array array['categories','menu_items','reviews','events','gallery','hero_slides','team','instagram']
  loop
    -- drop old policy names from previous schema versions
    execute format('drop policy if exists public_read_%s on public.%I;', t, t);
    execute format('drop policy if exists admin_all_%s on public.%I;', t, t);
    -- public read
    p := 'content_read_' || t;
    execute format('drop policy if exists %I on public.%I;', p, t);
    execute format('create policy %I on public.%I for select using (true);', p, t);
    -- staff write (admin + employee)
    p := 'staff_manage_' || t;
    execute format('drop policy if exists %I on public.%I;', p, t);
    execute format(
      'create policy %I on public.%I for all to authenticated using (app_role() in (''admin'',''employee'')) with check (app_role() in (''admin'',''employee''));',
      p, t
    );
  end loop;
end $$;

-- ---------- Reservations ----------
-- Public visitors can submit a booking (always 'pending'); the data is
-- never publicly readable.
drop policy if exists public_insert_reservations on public.reservations;
create policy public_insert_reservations on public.reservations
  for insert to anon, authenticated
  with check (status is null or status = 'pending');

-- Only admins can see/manage all reservations.
drop policy if exists admin_all_reservations on public.reservations;
drop policy if exists admin_manage_reservations on public.reservations;
create policy admin_manage_reservations on public.reservations
  for all to authenticated
  using (app_role() = 'admin') with check (app_role() = 'admin');

-- Clients can see their own reservations (matched on booking email)…
drop policy if exists client_read_own_reservations on public.reservations;
create policy client_read_own_reservations on public.reservations
  for select to authenticated
  using (app_role() = 'client' and lower(email) = lower(auth.jwt() ->> 'email'));

-- …and cancel their own pending booking (only pending -> cancelled).
drop policy if exists client_cancel_own_reservation on public.reservations;
create policy client_cancel_own_reservation on public.reservations
  for update to authenticated
  using (app_role() = 'client' and lower(email) = lower(auth.jwt() ->> 'email') and status = 'pending')
  with check (app_role() = 'client' and lower(email) = lower(auth.jwt() ->> 'email') and status = 'cancelled');

-- ---------- Settings ----------
drop policy if exists admin_all_settings on public.settings;
drop policy if exists public_read_settings on public.settings;
create policy public_read_settings on public.settings
  for select
  using (key in ('theme', 'rating', 'sections', 'defaultTheme'));

drop policy if exists admin_manage_settings on public.settings;
create policy admin_manage_settings on public.settings
  for all to authenticated
  using (app_role() = 'admin') with check (app_role() = 'admin');

-- ---------- Analytics ----------
drop policy if exists admin_all_analytics on public.analytics;
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

drop policy if exists admin_manage_analytics on public.analytics;
create policy admin_manage_analytics on public.analytics
  for all to authenticated
  using (app_role() = 'admin') with check (app_role() = 'admin');

-- ---------- Profiles (user accounts) ----------
-- Anyone can read their own profile; only admins can read/modify others.
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (auth.uid() = id);

drop policy if exists profiles_select_admin on public.profiles;
create policy profiles_select_admin on public.profiles
  for select using (app_role() = 'admin');

drop policy if exists profiles_write_admin on public.profiles;
create policy profiles_insert_admin on public.profiles
  for insert to authenticated
  with check (app_role() = 'admin');

create policy profiles_update_admin on public.profiles
  for update to authenticated
  using (app_role() = 'admin') with check (app_role() = 'admin');

create policy profiles_delete_admin on public.profiles
  for delete to authenticated
  using (app_role() = 'admin');

-- ---------- Admin manages user accounts (create / delete / change role) ----------
-- These run as the database owner so an admin in the app can create auth
-- accounts without the service-role key. Each function checks the caller.

create or replace function public.admin_create_user(p_email text, p_password text, p_role text default 'employee')
returns void language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid;
begin
  if app_role() <> 'admin' then
    raise exception 'Only admins can create user accounts.';
  end if;
  if p_role not in ('admin', 'employee', 'client') then
    raise exception 'Invalid role. Choose admin, employee or client.';
  end if;
  if exists (select 1 from auth.users where lower(email) = lower(p_email)) then
    raise exception 'A user with that email already exists.';
  end if;
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, invited_at, confirmation_token, recovery_token,
    email_change_token_new, email_change,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-0000-0000-000000000000', gen_random_uuid(),
    'authenticated', 'authenticated', lower(p_email),
    crypt(p_password, gen_salt('bf')), now(), now(), '', '', '', '',
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    '{}'::jsonb, now(), now()
  ) returning id into v_uid;
  -- upsert so the signup trigger's default 'employee' row (if it ran first)
  -- is overwritten with the chosen role.
  insert into public.profiles (id, email, role)
  values (v_uid, lower(p_email), p_role)
  on conflict (id) do update set role = excluded.role, email = excluded.email;
end $$;

create or replace function public.admin_delete_user(p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if app_role() <> 'admin' then
    raise exception 'Only admins can delete user accounts.';
  end if;
  if p_user_id = auth.uid() then
    raise exception 'You cannot delete your own account.';
  end if;
  delete from auth.users where id = p_user_id;
end $$;

create or replace function public.admin_set_role(p_user_id uuid, p_role text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if app_role() <> 'admin' then
    raise exception 'Only admins can change roles.';
  end if;
  if p_role not in ('admin', 'employee', 'client') then
    raise exception 'Invalid role. Choose admin, employee or client.';
  end if;
  update public.profiles set role = p_role where id = p_user_id;
end $$;

revoke all on function public.admin_create_user(text, text, text) from public, anon;
grant execute on function public.admin_create_user(text, text, text) to authenticated;
revoke all on function public.admin_delete_user(uuid) from public, anon;
grant execute on function public.admin_delete_user(uuid) to authenticated;
revoke all on function public.admin_set_role(uuid, text) from public, anon;
grant execute on function public.admin_set_role(uuid, text) to authenticated;

-- ---------- Image uploads (Supabase Storage, bucket "content") ----------
insert into storage.buckets (id, name, public)
values ('content', 'content', true)
on conflict (id) do nothing;

drop policy if exists content_read on storage.objects;
create policy content_read on storage.objects
  for select using (bucket_id = 'content');

drop policy if exists content_write on storage.objects;
create policy content_write on storage.objects
  for insert to authenticated
  with check (bucket_id = 'content' and app_role() in ('admin', 'employee'));

drop policy if exists content_update on storage.objects;
create policy content_update on storage.objects
  for update to authenticated
  using (bucket_id = 'content' and app_role() in ('admin', 'employee'))
  with check (bucket_id = 'content' and app_role() in ('admin', 'employee'));

drop policy if exists content_delete on storage.objects;
create policy content_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'content' and app_role() in ('admin', 'employee'));

-- ---------- Default settings ----------
insert into public.settings (key, value) values
  ('theme', '"dark"'::jsonb),
  ('rating', '4.7'::jsonb)
on conflict (key) do nothing;