# Ember & Ivy — Database Guide

Backend is **Supabase (PostgreSQL)** — optional. Without `VITE_SUPABASE_URL` /
`VITE_SUPABASE_ANON_KEY`, the app runs entirely on local demo data
(`localStorage`) and no database is used.

## Schema

Apply `supabase/schema.sql` in the Supabase **SQL Editor** — it is idempotent
and can be re-run safely at any time (policies are dropped and recreated).
Then apply `supabase/seed.sql` — it fills the content tables (menu,
categories, reviews, events, gallery, hero, team, Instagram) with the
sample café data and the repo's `/images/*.svg` assets. It only inserts
into tables that are currently empty, so re-running is safe.

| Table | Purpose |
| --- | --- |
| `menu_items` | Menu entries (`category` holds the category **name**, e.g. `Signature Coffee`). |
| `categories` | Menu category tabs shown on `/menu`. |
| `reviews` | Guest reviews shown on the homepage. |
| `events` | Live-music / event announcements. |
| `gallery` | Gallery preview images. |
| `reservations` | Table bookings; status `pending` / `confirmed` / `cancelled`. |
| `hero_slides` | Hero carousel slides on the homepage. |
| `team` | Team/staff cards. |
| `instagram` | Instagram-feed image rows (`src`, `link`). |
| `settings` | Key/value site settings. Keys in use below. |
| `analytics` | Lightweight counters. Currently only `visits`. |
| `profiles` | One row per auth user — holds their access **role** (`admin` / `employee` / `client`). |

## Access roles

Every account belongs to one level. Admins set the level for others in the
panel under **Users & Access**:

| Role | Sees | Can do |
| --- | --- | --- |
| `admin` | everything | Full access, including reservations, page settings, image uploads, and creating/removing user accounts. |
| `employee` | content only | Add/edit/delete menu, categories, gallery, reviews, events, hero banner, team, Instagram — plus image uploads. No reservations, settings or user management. |
| `client` | own reservations | Signs into the guest portal (“My Reservations”), sees only the bookings made with their email, and can cancel one that is still pending. |

Existing accounts created before this script (e.g. straight in the Supabase
dashboard) are **backfilled as admins** so they keep the full access they had.

## Row Level Security (RLS)

Row Level Security is **enabled on every table** (including `profiles`). The
app's role is read from `profiles.role` via the `app_role()` helper (a
`SECURITY DEFINER` function, so policies can use it safely).

- **Public (anon)** — the website visitors:
  - `SELECT` on all content tables (`menu_items`, `categories`, `reviews`,
    `events`, `gallery`, `hero_slides`, `team`, `instagram`).
  - `SELECT` on `settings` — **only** for the keys `theme`, `rating`,
    `sections`, `defaultTheme`.
  - `SELECT` on `analytics` — **only** the `visits` row.
  - `INSERT` on `reservations` — the row may only be created with
    `status IS NULL OR status = 'pending'`. Guests cannot pre-mark bookings
    as confirmed.
  - `INSERT` and `UPDATE` on `analytics` — **only** for the `visits` key
    (powers the visit counter).
  - No `UPDATE`/`DELETE` and no read of private tables (reservations,
    settings beyond the allowed keys, other analytics, user profiles).
- **Admin + employee** — full CRUD on the content tables (public read stays
  available to everyone because policy conditions are OR'd).
- **Admin only** — full access to `reservations`, `settings`, `analytics`
  and `profiles` (via dedicated policies).
- **Client** — can `SELECT` only their own reservations (matched on the
  booking email) and can `UPDATE` an own pending reservation, but **only**
  pending → cancelled.

The app's read paths (`src/lib/store.js`) rely on these policies, and the
public reservation form uses a plain `insert` (no read-back) so it works
under the insert-only policy.

## Managing user accounts

While only admins can touch accounts (RLS), creating or deleting actual auth
users needs the database owner's privileges. The schema ships three
`SECURITY DEFINER` RPCs that admins call from the panel — each checks the
caller's role internally:

| Function | Purpose |
| --- | --- |
| `admin_create_user(email, password, role)` | Create a sign-in account with the chosen role (email-confirmed immediately). |
| `admin_set_role(user_id, role)` | Change an account's access level. |
| `admin_delete_user(user_id)` | Remove an account (cannot remove yourself). |

A trigger also auto-creates a `profiles` row (role `employee`) for any future
email signups. New accounts are **never** admins by default — only an admin
chooses that level.

## Image uploads (Supabase Storage)

Uploaded pictures are auto-compressed in the browser and stored in the
public storage bucket **`content`** (`images/<timestamp>.webp`). The public
can read everything in the bucket; only admins/employees can add or delete.
In demo mode there is no cloud — images are compressed and kept in the
browser as compact data-URLs instead.

## Settings keys used by the app

| Key | Value | Used by |
| --- | --- | --- |
| `sections` | JSON map of section toggles (e.g. `{"hero": true, ...}`) | Admin → Settings → "Show this section on homepage" |
| `defaultTheme` | `dark` or `light` | Applied to visitors with no saved theme preference |
| `theme` / `rating` | default theme + aggregate rating (legacy seed metadata) | Homepage badge/legacy display |

## Data flow

- **Reading:** `store.list(key)` → `SELECT * FROM <table>` when Supabase is
  configured. Empty results fall through to the components' built-in empty
  states (no seed fallback once a real backend is enabled).
- **Writing (public):** reservations + visit counter go straight to Supabase.
- **Writing (admin):** every CRUD action in `/admin` (add/edit/delete) plus
  settings save through Supabase. Emails (EmailJS) are also sent when
  configured.

## EmailJS

Optional. Create a service + template; the template must use the params
`to_name`, `subject`, `message_html`. Without it, submissions are still
saved but no email is sent.