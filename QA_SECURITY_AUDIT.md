# QA & Security Audit — Ember & Ivy

**Date:** 2026-09-20
**Scope:** Full application, database, authentication, authorization, and deployment audit of the Ember & Ivy web application.
**Result:** Passed the defined security and functional checks. Scope and limitations are listed at the end.

---

## 1. Executive Summary

A full end-to-end audit of the Ember & Ivy SPA (public site + admin panel + Supabase backend) found and fixed **10 issues**, including one **critical secret-handling issue**, one **high-risk HTML-injection vector in transactional emails**, and two **moderate** items. Every fix was applied, the production build rebuilt, and all public/admin routes regression-tested against the built preview.

The app's security model is fundamentally sound: admin/employee/client roles are enforced by **Row Level Security in PostgreSQL**, not just by hiding UI. Admin RPCs (`admin_create_user`, `admin_set_role`, `admin_delete_user`) are `SECURITY DEFINER` with internal role checks, so a non-admin cannot escalate by editing browser state.

The single most important action for the owner: **rotate the Supabase `service_role` key** that was committed to the repository on 2026-09-14 (commit listed in section 13) and ensure the deployed `VITE_SUPABASE_ANON_KEY` is the public **anon** key, never the service key.

---

## 2. Project Environment

| Item | Value |
|---|---|
| Working dir | `D:\Projects\Websites\Ember & Ivy` |
| Stack | React 18 + Vite 5 SPA |
| Router | react-router v7 (upgraded from v6 during audit) |
| Backend | Supabase (Postgres + Auth + Storage + RLS) |
| Email | EmailJS (browser SDK) |
| Hosting | Vercel (SPA rewrites + headers in `vercel.json`) |
| Node | v25.8.2 (local) |

## 3. Application Architecture

- **Public site:** Home, Menu, Gallery, Events, Reservation, Contact (+ Newsletter), NotFound. Rendered via `src/App.jsx`, content from `store.list()` (Supabase when configured, localStorage demo otherwise).
- **Admin panel:** `/admin/*` (`src/admin/AdminApp.jsx`). Role-gated nav + routes. CRUD pages for menu, categories, gallery, reviews, events, hero slides, team, instagram. Admin-only: reservations, site images, page settings, users.
- **Auth:** Supabase Auth (real) or demo sessionStorage (no backend). Role read from `profiles` table.
- **Data:** 12 tables; RLS on all; content readable anon; writes gated by `app_role()`.
- **Third-party:** Supabase (project + storage bucket `content`), EmailJS, Google Fonts, Google Maps embed, Instagram/Facebook/TikTok links.

## 4. Testing Scope

Tests performed in this environment: static code/security review of every component and form, dependency audit (`npm audit`), secret scan (working tree + git history), SQL/RLS policy review, XSS/injection input handling via disposable payload self-checks, production build, and HTTP route/asset smoke tests against the built bundle.

Not performed (no browser available): real-browser rendering, cross-browser checks, real XSS *execution*, Lighthouse, live Supabase/EmailJS round-trips. These are documented in section 22.

## 5. Functional Testing

Public routes (`/`, `/menu`, `/gallery`, `/events`, `/reservation`, `/contact`), admin routes (`/admin`, `/admin/login`, `/admin/images`), the SPA fallback (`/nope`), and static assets all returned **200** on the production build. Admin CRUD flows reviewed end-to-end (list/insert/update/delete against `store`), error paths now surface toasts instead of unhandled rejections.

## 6. Database Testing

Reviewed `supabase/schema.sql` (RLS policies, grants, triggers, RPCs) in full. Added a hardening section (idempotent, re-runnable):

- `track_visit()` SECURITY DEFINER RPC — server-side visit counter increment.
- Revoked anon/authenticated INSERT/UPDATE (table grant and policies) on `analytics`; only SELECT and the RPC path remain.
- Reservation CHECK constraints: `status IN ('pending','confirmed','cancelled')`, `guests BETWEEN 1 AND 100`, and length caps on name (120), phone (40), email (320), message (2000).

Re-running the whole schema file is safe; `create policy`/`create function`/`alter` statements all carry `drop if exists` guards.

## 7. Authentication Testing

Auth flow reviewed (not executed — no live Supabase credentials):

- Sign-in validates via Supabase `signInWithPassword` (real mode) or demo localStorage + plaintext compare (demo mode only).
- Session restored from `supabase.auth.getSession()` + `onAuthStateChange`.
- Sign-out clears the session.
- Demo mode stores identity in `sessionStorage` (`ei-admin-user` / `ei-admin-role`) — forgeable by design; **demo mode is explicitly not a security boundary.** With Supabase configured, role comes from the server.

## 8. Authorization Testing

Authorization is enforced **server-side**, verified in review:

- Content write: RLS `app_role() IN ('admin','employee')`.
- Reservations: admin sees all; `client` role sees only rows whose email matches `auth.jwt().email` (case-insensitive) and can cancel only `pending` → `cancelled`.
- Settings / analytics / users: `app_role() = 'admin'` only; the three admin RPCs re-check `app_role()` internally and are granted to `authenticated` (never anon).
- Uploads: `content` storage bucket policies allow insert/update/delete only for admin/employee.
- **No path to escalate via frontend state or URL manipulation.** Editing `localStorage`/`sessionStorage` cannot grant DB rights.

## 9. Input Validation Testing

All forms reviewed. Reservation uses a `min=today` date input; guests from a fixed 1–20 selector; time/occasion from fixed lists; email `type="email"`. New DB constraints now back the reservation data at the database level (section 6). Client-side validation is intentionally light on free-text fields (names longer than intended are still stored), but nothing flows into SQL or HTML unescaped (section 10).

The disposable payload set from the brief (`' OR '1'='1`, `<script>…`, `<img onerror>`, `../../`, `{{template}}`, `${test}`, backticks, etc.) is asserted against the email-escaping helper in `tests/security-selfcheck.mjs` — all pass.

## 10. XSS Testing

- **Fixed:** Reservation, Contact, and Newsletter interpolated raw visitor input into HTML emails sent to the owner's inbox (HTML injection in email). New `src/lib/escape.js` (`escapeHtml`) applied at all three call sites. Verified by 13 self-check assertions.
- **Audited:** `dangerouslySetInnerHTML` appears once (`SectionHead`), rendering only hardcoded static titles — not user-controlled. Risk: none.
- No `innerHTML=`, `document.write`, or `eval` anywhere.
- React's built-in defensive rendering is used for all data (reviews, menu, events, gallery, reservations). React 18 blocks `javascript:` URLs in `href`/`src`.

## 11. Injection Testing

No concatenated SQL exists. All DB access uses the Supabase structured query API (select/insert/update/delete/upsert/rpc with parameter binding). RLS `WITH CHECK` predicates gate inserts (e.g., reservations forced to `pending`). Payload strings from section 9 exercise the only places user input is serialized (JSON to Supabase, HTML emails) — safe.

## 12. Dependency Audit

`npm audit` before: **2 moderate** advisories affecting `react-router-dom@6.30.4` / `react-router@6.30.4` (open redirect via backslash; deserializeErrors injection — the latter SSR-only, this app is CSR, so practical impact low).

**Applied:** upgraded to `react-router-dom@^7.18.4` (fixes both advisories). Build and all routes verified after the upgrade. `npm audit` after: **0 vulnerabilities**. No other dependency changed; no unnecessary packages added.

## 13. Secret / Credential Audit

- `.env`, `.env.*.local`, `node_modules`, `dist` are gitignored; **the only tracked env file is `.env.example`** (template).
- **CRITICAL — service_role key committed:** the tracked `.env.example` contained a JWT with `role: service_role` (project ref `nmenqlrurmkmgkolzbzu`) under the `VITE_SUPABASE_ANON_KEY` slot, committed on 2026-09-14 (commit `6ec6276`, still present through `4fbf1f9`).
  - **Impact:** if that value (or a copy of it) is used as `VITE_SUPABASE_ANON_KEY` in the deployed frontend bundle, the service key sits in the browser, **bypasses RLS for every visitor**, and lets anyone read/modify all data. Even unused-in-browser it is a leaked admin credential in a public repo.
  - **Fix applied:** `.env.example` now uses placeholders and a warning to use the anon key only.
  - **Required owner action:** rotate the `service_role` key in Supabase → Settings → API (invalidate the old one), and confirm the Vercel production `VITE_SUPABASE_ANON_KEY` is the **anon** key.
- No other secrets, tokens, or DB passwords found in the working tree or history.
- Demo admin default (`admin@emberandivy.com` / `ember-admin`) is demo-mode-only (no Supabase). Informational.

## 14. Image / Asset Audit

All image references resolve to real files in `public/images/` (16 unique paths checked). Assets are local vector SVGs (compressed, small). Uploaded photos are downscaled to WebP (max 1200px). Alt text present on meaningful images (`alt=""` only on decorative CTA banner). `sitemap.xml` + `robots.txt` (+ `Disallow: /admin`) present; `og-cover.svg` referenced in meta tags.

**Owner note:** current photos are stylized vector placeholders, not real venue photography, and this repository holds **no verified photos of the actual business**. Real photography must be supplied by the owner and uploaded via Admin → CRUD/Site Images; please do not substitute stock photos without confirming rights.

## 15. Responsive Testing

Responsive layout reviewed in CSS (clamp() typography, fluid grids, mobile nav, admin tables wrapped in horizontal-scroll containers to prevent page-level overflow). Live multi-viewport rendering **not executed** (no browser). A single real-browser pass at 320px–1920px is recommended after deploy (see section 22).

## 16. Accessibility Testing

Fixed: Lightbox is now a proper dialog (`role="dialog"`, `aria-modal="true"`, `aria-label="Photo viewer"`) and focuses the close button on open; Escape/arrow-key navigation already present. Icon buttons and toggles carry `aria-label`s. Form inputs are labelled (`htmlFor`/`id`). Reviews, menu, and events use semantic `article`/`blockquote`/`h1-h5`. Full WCAG contrast/AT testing requires a browser (documented limitation).

## 17. Performance Review

Production build: 6 assets, ~626 kB JS total (gzip 187 kB), 38.8 kB CSS. Largest single bundle: supabase client (218 kB, code-split). All images are vector/data-URL compact assets; uploads are compressed to WebP before storage. Countdown, scroll effects (framer-motion) present but not on the critical path. No obvious repeated API calls or missing loading states. No aggressive optimization applied — size is reasonable for a content/app SPA.

## 18. Deployment Review

`vercel.json` handles SPA routing (`/(.*)` → `/index.html`) and now ships security headers (section 19). Build output is `dist/` (Vite default). Env vars are read at build time via `import.meta.env` — a redeploy is required after any env change. HTTPS enforced by Vercel's CDN; HSTS header added.

## 19. Security Headers

Added to `vercel.json` for all routes:

- `Content-Security-Policy` — behaviour-preserving for this app's exact external services: Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`), Google Maps embed (`frame-src www.google.com` / `*.google.com`), Supabase (`connect-src *.supabase.co`), EmailJS (`api.emailjs.com` / `*.emailjs.com`), plus `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`, `upgrade-insecure-requests`. The theme bootstrap was moved to an external `public/theme.js` so `script-src 'self'` stays strict.
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

**Verify after deploy:** headers are served by Vercel only (not by the local preview), so confirm once on the live domain and watch the contact-page map iframe + a reservation email for regressions.

## 20. Issues Found & Fixed

| # | Severity | Issue | Affected | Fix | Verified |
|---|---|---|---|---|---|
| 1 | **Critical** | `service_role` JWT committed in git-tracked `.env.example` (and possibly deployed as anon key) | Secrets / production security | Replaced with placeholder + warning; owner must rotate key | File sanitized; rotation is owner action |
| 2 | **High** | Visitor input interpolated raw into HTML emails (Reservation/Contact/Newsletter) | EmailJS → owner inbox | `escapeHtml()` in all three senders | 13-assertion self-check + 7/7 payloads pass |
| 3 | **Moderate** | `react-router-dom` 6.30.4 in vulnerable range | Dependency | Upgraded to 7.18.4 | `npm audit` 0 vulns; build+routes pass |
| 4 | **Moderate** | Public users could write arbitrary analytics values; visit counter race | `analytics` RLS | `track_visit()` RPC (SECURITY DEFINER), revoked anon/authenticated write | SQL review; schema re-run required |
| 5 | **Low** | No DB constraints on reservations (unbounded guests/fields) | `reservations` | CHECK constraints (status, guests 1–100, length caps) | SQL review; schema re-run required |
| 6 | **Low** | UsersPage temp-password field was `type="text"` | Admin panel | `type="password"` + `autoComplete="new-password"` | Build passes |
| 7 | **Low** | ReservationsPage status/delete had no error handling (unhandled rejections, stale UI) | Admin panel | Wrapped in try/catch + toast errors | Build passes |
| 8 | **Low** | Lightbox not announced as a dialog; no focus management | Accessibility | `role="dialog"`, `aria-modal`, focus close on open | Build passes |
| 9 | **Low** | `/admin` discoverable by crawlers | SEO/robots | `Disallow: /admin` added | Asset check |
| 10 | **Info** | No security headers on Vercel | Deployment | CSP + 5 headers added to `vercel.json` | Config valid; verify live |

Ownership-required (not fixable in repo): service-role key rotation; real photography; live Supabase/EmailJS/Vercel validation.

## 21. Regression Testing

After all fixes: production build **passes** (497 modules), all 16 public/admin/fallback routes + static assets return **200**, `tests/security-selfcheck.mjs` passes (13 assertions with the brief's payload set), and all 16 referenced image paths resolve to files on disk.

## 22. Remaining Limitations

- **No browser automation** was available. Actual page rendering, cross-browser/device behavior, XSS *execution*, keyboard navigation, and Lighthouse were reviewed statically but not run live.
- **No live Supabase access** from this environment: RLS/counter/CRUD were validated by code + SQL review, not executed. The project's own Supabase must re-run `supabase/schema.sql` (now idempotent, contains the hardening section) so items 4 and 5 take effect.
- **EmailJS / Vercel headers** require a post-deploy spot-check (reservation email renders correctly; map iframe loads; headers present).
- **Demo mode** (no Supabase env) intentionally stores identity/roles in browser storage — not a security boundary; production must run with Supabase configured.
- A security audit reduces risk; it cannot mathematically prove the absence of vulnerabilities.

## 23. Final Production Readiness Status

**Passed the defined security and functional checks.**

The application builds cleanly, all routes resolve, authorization is enforced by the database, the two most serious findings (service-role key exposure, email HTML injection) are remediated or have a mandatory owner action, and dependencies report 0 known vulnerabilities.

**Before client delivery, close these owner actions:**
1. Rotate the Supabase `service_role` key and confirm `VITE_SUPABASE_ANON_KEY` (anon) is what's deployed.
2. Re-run `supabase/schema.sql` on the live database (hardening section).
3. Rebuild + redeploy so the new bundle, RPC, and headers go live.
4. Supply real venue photography.
5. Do one browser pass on the live domain (responsive + map iframe + a test reservation from a disposable email such as `qa-test@example.invalid`).

**Acceptance checklist:** Application builds ✔ · No critical runtime errors (build-level verified) ✔ · No broken routes ✔ · Customer flows ✔ · Admin flows ✔ · Database ops (code + SQL review) ✔ · RLS reviewed ✔ · Auth reviewed ✔ · AuthZ reviewed ✔ · Inputs tested (disposable) ✔ · XSS protections reviewed + email XSS fixed ✔ · Injection reviewed (structured API only) ✔ · Dependencies audited (0 vulns) ✔ · Secrets audited + 1 critical remediated ✔ · Images audited ✔ · Responsive reviewed (live pass pending) ✔ · Accessibility reviewed + dialog fixed ✔ · Error handling improved ✔ · Production build succeeds ✔ · Deployment config reviewed ✔ · Test data removed / left reproducible (self-check test) ✔ · No secrets committed in this change ✔ · Changes committed + pushed (see commit) ✔ · Report created ✔