---
title: Ember & Ivy — Project Handover Report
date: 2026-09-20
status: READY for client setup
---

# Ember & Ivy — Project Handover Report

## 1. Overview

Premium café, restaurant, cocktail lounge and live music venue website —
Lakeside, Pokhara, Nepal. React 18 + Vite 5 single-page application with an
optional Supabase backend and an optional EmailJS integration.

The site runs in **demo mode** out of the box (no keys required): rich seed
content, working admin CRUD against `localStorage`, theme switching and the
full browsing experience. Enabling Supabase replaces the demo backend with a
real database and admin authentication; enabling EmailJS sends real emails.

## 2. What was delivered

### 2.1 Public site
- Homepage: hero carousel, features, menu highlights, today's specials,
  reviews, gallery preview, events, team, story/about, awards, Instagram
  feed, newsletter, contact/reserve CTA.
- `/menu` — full menu with 10 categories, price, tags (popular/chef/seasonal),
  vegetarian flags.
- `/gallery` — filterable grid + lightbox (20 images).
- `/events` — upcoming nights + recurring schedule + reservation CTA.
- `/reservation` — validated booking form (demo + Supabase).
- `/contact` — contact form, map embed, opening hours, newsletter.
- Theme system: dark (default) + light mode, persisted, admin-settable default.
- Fully responsive; reduced-motion + accessibility considered (aria labels,
  keyboard-friendly lightbox).

### 2.2 Admin panel (`/admin`)
Role-based panel for non-technical users:
- **Admins** — dashboard, content management (all resources), reservations,
  page settings, user accounts, image uploads.
- **Employees** — content management + image uploads only (no reservations,
  settings or user management).
- **Clients** — guest portal with **My Reservations**: sees only their own
  bookings and can cancel one that is still pending.
- Image uploads are auto-compressed in the browser (WebP, resized) and stored
  in Supabase Storage — no technical knowledge needed.
- Authenticated via Supabase Auth (or demo credentials without Supabase).

### 2.3 Backend (Supabase, optional but production-ready)
- `supabase/schema.sql` — idempotent schema, RLS on every table, role-based
  access via the `profiles` table (`admin` / `employee` / `client`).
- Public site: read-only on content, reservation insert locked to
  `pending`, visit counter increments only the `visits` row.
- Admins: content + reservations + settings + analytics + user accounts.
  Employees: content + uploads. Clients: own reservations only.
- Account management in the panel uses admin-protected database RPCs
  (`admin_create_user`, `admin_set_role`, `admin_delete_user`) — no
  service-role key on the client.
- Public image storage bucket `content` (public read, staff write).
- See [`DATABASE.md`](DATABASE.md).

### 2.4 Docs
- README (setup, env, deploy)
- `docs/DATABASE.md`, `docs/TESTING.md`, `docs/PROJECT_REPORT.md` (this file)

## 3. What was fixed / improved

- **Build warning removed** — the single 594 kB chunk is now code-split into
  `vendor` / `motion` / `supabase` chunks (largest = 218 kB, 57 kB gzip).
- **Admin settings bug** — section toggles and default theme were saved under
  a never-read key and so never reached the public site. Now saved under
  `sections` / `defaultTheme` and applied.
- **Homepage now uses real data** — hero, reviews and team load from the
  store (DB when Supabase is on, seed in demo mode) instead of hardcoded
  copies that diverged from admin edits.
- **Menu tabs** — category tabs now come from the admin-managed categories.
- **RLS-safe reservation inserts** — removed the `select().single()` read-back
  that would have leaked reservation data and thrown for anon users.
- **Seed fallback corrected** — with a real backend the DB is the source of
  truth (empty states render); demo seed is only for demo mode.
- **EmailJS v4** — send call now passes the public key explicitly.
- **Footer watermark** — developer credit is now optional via `VITE_WATERMARK`
  (empty by default); placeholder default phone aligns with `.env.example`.
- **Deduped scroll-to-top** — removed a scroll handler duplicated by the
  router-level one.
- **Dead code removed** — unused singleton flag, store `count`/`setAnalytics`,
  unused `initEmailJS`.
- **Role-based access** — accounts now have `admin` / `employee` / `client`
  levels; the admin panel and the database enforce them (employees can't see
  reservations, clients only their own).
- **User management in the panel** — admins create accounts, set roles and
  remove users without touching the dashboard (admin-protected DB RPCs).
- **Guest portal** — clients log in to a friendly “My Reservations” screen
  and can cancel their own pending booking.
- **Photo upload with compression** — every photo field now has an
  “Upload picture” button: images are resized + WebP-compressed in the
  browser and stored in Supabase Storage (demo mode: compact copy in the
  browser). Non-technical users no longer need to type paths.
- **Admin friendliness** — clearer labels (“Home Banner”, “Instagram Feed”,
  “Page Settings”), a starter guide on the dashboard, and one-line
  descriptions under each management page.

## 4. Performance (real build output, Vite 5.4.21)

| Asset | Size | gzip |
| --- | --- | --- |
| `index.html` | 4.43 kB | 1.66 kB |
| `index-*.css` | 37.99 kB | 7.96 kB |
| `index-*.js` (app) | 98.61 kB | 29.62 kB |
| `motion-*.js` (framer-motion) | 113.14 kB | 37.38 kB |
| `vendor-*.js` (react, router) | 163.96 kB | 53.50 kB |
| `supabase-*.js` | 218.45 kB | 56.99 kB |
| **Total JS** | **594.16 kB** | **177.49 kB** |

- 483 modules transformed, ~1.5 s build.
- All `/images/*.svg` referenced by the app exist (42 files, generated by
  `scripts/gen-images.mjs`).
- `vercel.json` and `netlify.toml` SPA rewrites included.

## 5. Content & on-brand assets

- Menu: **50 items** across **10 categories**, prices in NPR, chefs-specials,
  vegetarian and seasonal flags.
- Reviews: **19 original testimonial-style reviews** (avg 4.7 ⭐).
- Events: **4** recurring night concepts; Gallery: **20** images; Team: **4**;
  Hero: **4**; Awards: **4**; Instagram feed: **6**.
- The rating "4.7 · 19+ reviews" (and the aggregate-rating schema markup) is
  **demo content** based on the bundled reviews — replace or mark real once
  the venue has live Google reviews. Same for the Google Maps embed (correct
  Lakeside location) — confirm coordinates/street.
- Placeholder contact values: `VITE_PHONE=+977 980 000 0000`,
  `VITE_EMAIL=hello@emberandivy.com` — replace with the venue's real details.

## 6. Deployment

Vercel or Netlify out of the box:
1. `npm run build` (SPA; both hosts include rewrites).
2. Set env vars in the host (see README / `.env.example`).
3. For a real backend, point `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
   at the client project and run `supabase/schema.sql` first.

## 7. Handover checklist (REQUIRES CLIENT CONFIGURATION)

Items that cannot be completed without the client's real accounts/values:

1. **Supabase project + credentials** — create project, run `schema.sql`,
   then `seed.sql` (front-fills menu/categories/reviews/events/gallery/hero/
   team/Instagram with the sample café data + the repo's SVG images), enable
   Email auth, create admin user. *(schema verified by review; run once in
   the client project.)* The schema also creates the `content` storage
   bucket and the `profiles` role system — existing accounts are backfilled
   as admins automatically.
2. **Create app accounts** — sign in as the first admin, then use
   **Users & Access** to add employees/clients (no dashboard needed).
3. **Real venue contact** — phone, email, address, social links, map pin.
4. **Real Google reviews / rating + review count** — or update the demo values.
5. **Menu prices confirm** — seed prices are plausible placeholders.
6. **EmailJS account/template** — optional; without keys, form submissions
   are saved but not emailed.
7. **`VITE_WATERMARK`** — optional footer credit line.
8. **Footer/boilerplate text** — fine-tune "Made with ✦ in Pokhara".

Everything else is verified and working in demo mode.

## 8. Known limitations

- Supabase/EmailJS paths are implemented and reviewed but **not exercised
  against a live client project** — first live run is part of the checklist
  above (incl. the admin RPCs and image uploads).
- A **client account** only sees reservations booked with the **same email**
  they sign in with; the public booking form's email field is optional, so a
  guest who books without an email won't appear in a client portal.
- Restaurant menu "recipes"/prices are editorial content owned by the venue.