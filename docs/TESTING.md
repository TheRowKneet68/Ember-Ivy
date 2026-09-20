# Ember & Ivy — Testing Guide

How to verify the site, and what is already confirmed.

## Quick verify

```bash
npm install
npm run dev      # demo mode — open http://localhost:5173
```

With a real backend:

```bash
cp .env.example .env.local   # paste Supabase + EmailJS keys
npm run dev
npm run build && npm run preview   # production build check
```

## Already verified (run in CI/checkout)

- **Production build** — `npm run build` completes with **no warnings**.
  Bundle is code-split (`vendor`, `motion`, `supabase` chunks) and the
  largest chunk is under the size warning limit.
- **SPA routing** — preview server returns the app shell (200) for every
  route, including deep links (`/menu`, `/admin/dashboard`) and unknown
  paths (client-side fallback).
- **Asset integrity** — every `/images/*.svg` referenced in code exists in
  `public/images`.
- **Content hygiene** — no lorem ipsum / FIXME / TODO placeholders in source.
- **Secrets** — only `.env.example` is tracked; real `.env*` files and
  credentials are gitignored. Demo admin credentials are used **only** when
  Supabase is not configured.

## Manual QA checklist (browser)

### Public site (demo mode)

- [ ] Theme toggle switches dark ⇄ light; preference persists on reload.
- [ ] On first visit, no saved preference → site shows `defaultTheme` from
      admin settings.
- [ ] Homepage: hero carousel auto-advances and arrows work; reviews, team,
      gallery preview, events and Instagram feed render.
- [ ] `/menu` tabs filter items; switching tabs shows the right items.
- [ ] `/gallery` lightbox opens, closes (Esc / click / X), arrows navigate.
- [ ] Reservation form validates, submits, shows success; record appears in
      admin → Reservations.
- [ ] Contact form and newsletter submit with success states.
- [ ] Footer: "Made with ✦" renders; `VITE_WATERMARK` shows the line when set,
      nothing when empty.
- [ ] Mobile widths (375 / 390 / 768px): navbar collapses into a working
      menu; no horizontal scroll; text is legible.

### Admin (demo mode)

- [ ] Sign in at `/admin` with demo credentials
      (`admin@emberandivy.com` / `ember-admin`, or your `VITE_ADMIN_EMAIL` /
      `VITE_ADMIN_PASSWORD`).
- [ ] Dashboard shows stats and recent reservations.
- [ ] Menu / categories / gallery / reviews / events / hero / team /
      Instagram: add, edit, delete; changes appear on the public site after
      refresh.
- [ ] Reservations: confirm / cancel changes the badge on the public side.
- [ ] Settings: hide a homepage section; saves (and survives reload).

### Live backend (Supabase configured)

> Requires the client's Supabase project. Mark everything here
> `REQUIRES CLIENT CONFIGURATION` until exercised against a real project.

- [ ] `supabase/schema.sql` runs cleanly in the SQL Editor (idempotent).
- [ ] Auth → Users has the admin account; email login works at `/admin`.
- [ ] Public reservation goes into the `reservations` table with
      `status = pending`.
- [ ] Visit counter increments in `analytics`.
- [ ] Content edited in `/admin` appears on the public site.

### Live EmailJS (optional)

- [ ] Reservation / contact / newsletter triggers a sent email with
      `to_name`, `subject`, `message_html`.

## Known notes

- EmailJS is **not** sent without keys; submission is still saved.
- The Supabase schema is validated by review only — run it once against the
  client project and confirm no errors (it should be).
- Performance figures: see [PROJECT_REPORT.md](PROJECT_REPORT.md).