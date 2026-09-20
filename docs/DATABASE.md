# Ember & Ivy — Database Guide

Backend is **Supabase (PostgreSQL)** — optional. Without `VITE_SUPABASE_URL` /
`VITE_SUPABASE_ANON_KEY`, the app runs entirely on local demo data
(`localStorage`) and no database is used.

## Schema

Apply `supabase/schema.sql` in the Supabase **SQL Editor** — it is idempotent
and can be re-run safely at any time (policies are dropped and recreated).

| Table | Purpose |
| --- | --- |
| `menu_items` | Menu entries (`category` is a `uuid` referencing `categories`). |
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

## Row Level Security (RLS)

Row Level Security is **enabled on every table**. Policies:

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
    settings beyond the allowed keys, other analytics).
- **Authenticated (admin, signed in at `/admin`)** — full CRUD on every table
  via the `admin_all_*` policies.

The app's read paths (`src/lib/store.js`) rely on these policies, and the
public reservation form uses a plain `insert` (no read-back) so it works
under the insert-only policy.

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