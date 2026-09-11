# Refactoring Implementation Plan — As-Built Record

**Project:** Chimezie Bright — professional static portfolio
**Target:** https://webecomtech.com · Netlify · `master`
**Status:** ✅ Build green, all sections complete, QA passing — ready for content review and deploy

> The original `RACTORING_IMPLEMENTATION_PLAN.md` was **0 bytes** — the plan had
> never been written to disk. This document is the reconstructed plan plus a
> record of what was actually executed. The mis-named empty file was removed.

---

## 1. Starting state (what was actually found)

Phase 1 was committed (`6458134`). The uncommitted "Phase 2" work was
**half-finished and corrupt**, and the project did not build.

### Blockers

| # | Defect | Evidence |
| --- | --- | --- |
| B1 | `index.html` truncated mid-tag at line 212; no `<footer>`; `<main>`, `#root-app`, `#about` all left unclosed | file ended `</span>` → `</div>` → `</body>` |
| B2 | `src/app.ts` had 5 syntax errors — `npm run build` failed | `tsc`: `app.ts(154,22..53): error TS1005: ',' expected` |
| B3 | Unquoted string `transition-all border opacity duration cursor select-none` | `app.ts:154` |
| B4 | Malformed `**/ declare const IntersectionObserver: any; declare const localStorage: Storage;` redeclaring DOM globals | `app.ts:3` |
| B10 | `#stat-years` / `#stat-projects` were empty spans nothing populated | `index.html:207,211` |

### Verified latent defects

| # | Defect | Evidence |
| --- | --- | --- |
| B5 | **`prefers-reduced-motion` users saw a blank page** — `initReveal()` returned early, so every `.reveal` stayed at `opacity: 0` | `app.ts:113-114` + `index.css:118-122` |
| B6 | `bg-opacity-60` / `dark:bg-opacity-95` are **removed in Tailwind v4** — the header never gained a scroll background | built CSS grep: `bg-opacity => False` |
| B7 | **No `@custom-variant dark`** — class-based `dark:` could not work with the `.dark` toggle | built CSS grep: `prefers-color-scheme => False` |
| B8 | `initScrollHeader()` never ran on load — wrong state after an anchor jump or refresh mid-page | `app.ts:85-108` |
| B9 | **FOUC** — theme applied from a deferred module; `<html class="dark">` hard-coded | `index.html:2,40` |
| B11 | `initTechBadges()` double-animated (`.reveal` + inline opacity + `setTimeout`) and used emoji icons | `app.ts:132-174` |
| B12 | `tsconfig` declared `@/*` paths but `vite.config.ts` had no `resolve.alias` | both configs |
| B13 | `"jsx": "react-jsx"` in a vanilla-TS tsconfig | `tsconfig.json:16` |
| B18 | Missing `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, `404.html`, `netlify.toml`, `_redirects`, canonical, JSON-LD, `theme-color` | repo scan |
| B19 | No skip-link, no image `width`/`height` (CLS), no `:focus-visible`, no active-nav state | source |

### Housekeeping

- B14 dead scaffold: `src/counter.ts`, `src/assets/{hero.png,typescript.svg,vite.svg}`
- B15 junk literal directory `public/img/{logos,profile,projects,testimonials,icons}` from a failed PowerShell brace `mkdir` — also mirrored into `dist/`
- B16 `src/components/`, `src/hooks/`, `src/utils/`, `public/img/icons/` all empty
- B20 stale `dist/` built from a pre-Phase-2 state
- Nav pointed at `#skills`, `#experience`, `#projects`, `#contact` — **none existed** (4 of 5 links dead, in both desktop and mobile nav)

### Content recovered from git history (`b0fbe74:index.html`)

The old 4-year-old site was mined for real data so nothing had to be invented:
6 projects with live Netlify URLs, 9 skill percentages, 3 client testimonials
(Mayflor / Dr Emma PhD / Dao Ha) with their verbatim quotes, both phone numbers,
email, Hanoi location, and the GitHub + LinkedIn profiles.

The CV PDF could **not** be read programmatically — it uses Adobe subset-embedded
fonts with no `ToUnicode` map, so only font metadata was recoverable. Work
history therefore ships as a clearly-flagged editable template.
## 2. Phases executed

### Phase 0 — Recovery & stabilisation ✅

- **0.1** Safety checkpoint committed as `1fa7c6c` before any repair, so the broken Phase 2 state stays recoverable.
- **0.2** `src/app.ts` deleted and rebuilt as a module orchestrator (B2, B3, B4 fixed).
- **0.3** `index.html` deleted and rebuilt from scratch — 1,202 lines, every tag balanced (B1 fixed).
- **0.4** Junk removed: brace directory, `src/counter.ts`, `src/assets/*`, stale `dist/` (B14, B15, B20).
- **0.5** `vite.config.ts` gained `resolve.alias` for `@` → `/src` plus explicit build targets; `tsconfig.json` lost `jsx`, gained `noImplicitReturns`, `noImplicitOverride`, `types: ["vite/client"]`; `@types/node` added as a devDependency (B12, B13).
- **0.6** **Gate passed** — `npx tsc --noEmit` exits 0 and `npm run build` succeeds.

### Phase 1.5 — Phase 1 defect fixes ✅

- **1.5.1** `@custom-variant dark (&:where(.dark, .dark *))` added (B7). *Proven* with a throwaway `dark:text-red-500` probe: it compiled to a `.dark`-scoped selector and **not** to `prefers-color-scheme`. Probe deleted afterwards.
- **1.5.2** Dead v3 opacity utilities replaced with a semantic `#main-header.header-scrolled` rule plus `--header-bg` / `--overlay-bg` tokens (B6).
- **1.5.3** Reduced-motion now reveals everything immediately instead of bailing out; CSS also forces `.reveal { opacity: 1 !important }` under the media query (B5).
- **1.5.4** FOUC killed — an inline blocking script in `<head>` resolves the theme before first paint and also adds `.js` to `<html>` (B9).
- **1.5.5** `initHeaderScroll()` runs once on init as well as on scroll, via a shared `rafThrottle` helper (B8).
- **1.5.6** Emoji tech badges replaced with static `<li class="tag">` markup — no JS generation, no double animation (B11).
- **Extra** `scroll-padding-top` added so anchor jumps no longer hide section headings under the fixed header.
- **Extra** Theme icon swap moved to pure CSS (`.theme-icon--sun` / `--moon`), removing the `textContent = '☾'` hack.

### Phase 2 — Content sections ✅

All seven sections built, with real recovered data:

| Section | Contents |
| --- | --- |
| `#hero` | H1, availability pill, CTAs, 9 static tech pills, portrait (840×840, `fetchpriority="high"`) |
| `#about` | Photo (768×1024), two-paragraph bio, 3-stat `<dl>` wired to `useCountUp`, CV + contact CTAs |
| `#skills` | 3 groups × 6 bars = 18 skills, each `role="progressbar"` with `aria-valuenow`/`aria-label` |
| `#experience` | 3-entry gradient timeline — **flagged EDIT REQUIRED** (CV unreadable) |
| `#projects` | 6 cards with the real live Netlify URLs, tech tags, Live Demo + Source |
| `#testimonials` | 3 `<figure>`/`<blockquote>`/`<cite>` cards with verbatim client quotes |
| `#contact` | Call / Email / Location cards, social row, Netlify form |
| `<footer>` | Brand, footer nav, connect links, auto-updating year, back-to-top |

### Phase 3 — Polish, images & motion ✅

- Every image carries its true intrinsic `width`/`height` (measured from the files) plus `alt`, `loading="lazy"` and `decoding="async"` below the fold — CLS eliminated (B19).
- Scrollspy (`useActiveSection`) drives `aria-current="true"` → gradient underline.
- Keyboard/a11y: skip-link, `:focus-visible` ring, Escape closes the overlay, focus trap, focus restoration, `aria-hidden`/`aria-expanded` bookkeeping, `body.nav-open` scroll-lock, auto-close on resize to desktop.
- Reduced motion honoured globally — animations, smooth-scroll and the back-to-top behaviour all degrade.
- **Decision:** the legacy root `img/` folder was left untouched (non-destructive) and is listed as a pre-launch task instead.

### Phase 4 — SEO, a11y & performance hardening ✅

- Canonical, absolute OG image with `width`/`height`/`alt`/`secure_url`/`type`, Twitter Card, `og:locale`, `og:site_name`, `profile:*`, `theme-color` (JS-synced), `color-scheme`, Apple meta.
- JSON-LD `@graph` with `Person` (address, `sameAs`, `knowsAbout`, telephone, email) + `WebSite`.
- `robots.txt` (with `Sitemap:` + `Host:`), `sitemap.xml`, `manifest.webmanifest`, self-contained `404.html`.
- Non-blocking Google Fonts (`preload` + `media="print"` swap + `<noscript>` fallback).
- Exactly one `<h1>`, landmarks labelled, `text-wrap: balance` on headings.
- **Resilience:** `.reveal` hidden state is scoped under `.js`, so content is fully readable with scripting disabled.

### Phase 5 — Deploy config, QA & launch ✅ (pending your content review)

- `netlify.toml`: build command, publish dir, Node 20, zero-risk security headers, immutable caching on `/assets/*`, `must-revalidate` on `/`, and a **CSP written but commented out** with enable-and-test instructions (a mis-tuned CSP cannot be validated from a local build).
- `public/_redirects`: custom-404 rule.
- `.github/workflows/ci.yml`: `npm ci` → `typecheck` → `build` → verify `dist` artefacts → upload. **This is the gate that would have caught the broken Phase 2 commit.**
- `package.json`: added `npm run typecheck`.
- `README.md` rewritten for the new architecture.
## 3. Verification performed

| Check | Result |
| --- | --- |
| `npx tsc --noEmit` | ✅ 0 errors |
| `npm run build` | ✅ succeeds in ~230 ms |
| Bundle size | `index.html` 68.19 kB (gzip 12.11) · CSS 26.26 kB (gzip 6.44) · JS 6.82 kB (gzip 2.80) |
| Tag balance (`section, main, header, footer, nav, form, article, figure, ul, ol, li, div`) | ✅ all balanced — truncation fully repaired |
| In-page anchors | ✅ 8/8 resolve — no dead links |
| Local assets referenced | ✅ 15/15 exist in `dist` |
| `<h1>` count | ✅ exactly 1 |
| Images with `alt` | ✅ 11/11 |
| Images with `width` + `height` | ✅ 11/11 |
| `target="_blank"` with `noopener` | ✅ 20/20 |
| `console.log` in bundle | ✅ none |
| Probe leftovers in bundle | ✅ none |
| Tailwind `dark:` variant | ✅ compiles to `.dark`-scoped selector, not the media query |
| `vite preview` smoke test | ✅ `/`, `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, images and the CV PDF all return **200** |
| `dist` hygiene | ✅ no brace directory, no dead scaffold |

## 4. Remaining work — needs your input

These are **content** decisions, not engineering ones. All are flagged in the
code with `EDIT` comments and repeated in the README pre-launch checklist.

1. **`#experience` is a template.** Your CV PDF is not machine-readable (Adobe
   subset fonts, no `ToUnicode` map). The three timeline entries were built from
   repo evidence (project set, testimonials, Hanoi). Replace them with your real
   roles, employers and dates. Look for the `EDIT REQUIRED` banner above
   `<section id="experience">`.
2. **About stats are placeholders** — `5+` years, `20+` projects, `15+` clients.
   Change both `data-count-to` **and** the fallback text inside each `<span>`.
3. **Skill percentages** were seeded from your old site's progress bars plus
   reasonable values for the newer stack. Adjust `--level`, `aria-valuenow`,
   `aria-label` and the visible `%` together.
4. **Project screenshots** — only three images exist, so they are reused across
   six cards. Real screenshots of the live sites would be far stronger.
5. **PWA icons** — the manifest uses a 180×180 PNG and a 512×384 JPEG. Add proper
   192×192 and 512×512 PNGs for a fully installable manifest.
6. **Contact form** — test a real submission on a Netlify deploy preview
   (form handling does not exist in `npm run dev`).
7. **CSP** — uncomment in `netlify.toml` and verify on a preview URL first.
8. **Legacy root `img/`** — still holds personal photos (`maywedding.jpg`,
   `nana.jpg`, `ha.jpg`), duplicate CVs and 884 KB / 1.1 MB JPGs. Left in place
   deliberately; delete once you have confirmed nothing is needed.
9. **Lighthouse** — run desktop + mobile against the deployed site; target 95+
   across Performance, Accessibility, Best Practices and SEO.

## 5. Architecture decision worth noting

The original plan sketched `src/data/*.ts` modules that would *render* each
section. That was **deliberately not done**: for a production static portfolio,
JS-rendered content would be invisible to crawlers, broken with scripting
disabled, and slower to first meaningful paint.

Instead: **all content is static markup in `index.html`; TypeScript only adds
behaviour.** The `components/`, `hooks/` and `utils/` folders are used for
enhancement modules. Every module no-ops safely if its markup is absent, and
every animation degrades correctly under `prefers-reduced-motion` or without
`IntersectionObserver`.

## 6. Commit hygiene

- `1fa7c6c` — checkpoint preserving the broken Phase 2 state (recoverable)
- Next commit — the completed rebuild

CI now blocks any push whose `tsc` or `vite build` fails, so the class of failure
that produced the broken Phase 2 state cannot reach `master` again.

