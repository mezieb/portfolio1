# Chimezie Bright — Professional Portfolio

Modern, responsive, production-grade static portfolio for **Okoro Chimezie Bright** —
Full Stack Software Engineer.

Live target: **https://webecomtech.com**

## Tech Stack

| Layer | Choice |
| --- | --- |
| Build | [Vite 6](https://vite.dev) |
| CSS | [Tailwind CSS v4](https://tailwindcss.com) + a custom design-token system |
| Language | Vanilla TypeScript (`strict`) |
| Fonts | Plus Jakarta Sans (headings) + Inter (body) |
| Icons | Inline SVG — no icon font, no runtime requests |
| Forms | Netlify Forms (progressively enhanced) |
| Deploy | Netlify, auto-deployed from GitHub |
| CI | GitHub Actions — typecheck + build on every push |

## Getting Started

```bash
npm install     # install dependencies
npm run dev     # dev server with hot reload
npm run build   # typecheck (tsc) then build to dist/
npm run preview # serve the production build locally
npm run typecheck # types only, no emit
```

## Production output

A single-page static site. Current bundle:

```
dist/index.html          ~68 kB   (gzip ~12 kB)
dist/assets/*.css        ~26 kB   (gzip ~6.4 kB)
dist/assets/*.js        ~6.8 kB   (gzip ~2.8 kB)
```

No framework runtime, no icon font, no third-party JS.

## Project Structure

```
├── index.html              # All page content lives here (SEO + no-JS safe)
├── netlify.toml            # Build, headers, caching, CSP (commented)
├── vite.config.ts          # Tailwind plugin, @ alias, build targets
├── tsconfig.json           # strict TypeScript
├── .github/workflows/ci.yml
├── public/
│   ├── 404.html            # Self-contained error page (inline styles)
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── manifest.webmanifest
│   ├── social-preview.jpg  # 1200x630 Open Graph image
│   ├── _redirects          # Netlify custom-404 rule
│   ├── img/
│   │   ├── brand/          # logo.jpg
│   │   ├── logos/          # logo.svg, apple-touch-icon.png
│   │   ├── profile/        # hero-photo.jpg, about-photo.jpg
│   │   ├── projects/       # sp_admin/appointment/frontend, kingcruise, cb_portfolio (.png)
│   │   └── testimonials/   # mayflor.jpg, dr-emma.jpg, dao-ha.jpg
│   └── resume/             # CV PDF
└── src/
    ├── main.ts             # Entry: imports CSS, calls boot()
    ├── app.ts              # Boot orchestrator for every module
    ├── index.css           # Tokens, utilities, components, a11y, motion
    ├── components/         # themeToggle, header, mobileMenu, projectModal,
    │                       # backToTop, footerYear, contactForm
    ├── hooks/              # useReveal, useCountUp, useActiveSection
    └── utils/              # dom.ts ($, $$, on, rafThrottle), motion.ts
```
## Architecture: content in HTML, behaviour in TypeScript

All copy, projects, skills, testimonials and contact details are **static markup
in `index.html`**. TypeScript only adds behaviour on top.

This is deliberate and matters for a production static site:

- **SEO** — crawlers see the full content without executing JavaScript.
- **Resilience** — with JS disabled the page is still fully readable.
- **Performance** — no client-side rendering pass, no hydration cost.

The reveal animations are gated behind a `.js` class that the inline head script
adds to `<html>`. Without scripting, `.reveal` never hides anything.

## Theme System

Dark-first, driven entirely by CSS custom properties:

- `:root` holds the light palette; `.dark` overrides it.
- An **inline script in `<head>`** resolves the theme *before first paint*
  (saved preference → OS preference → site default dark), so there is no flash
  of the wrong theme.
- `src/index.css` re-points Tailwind's variant with
  `@custom-variant dark (&:where(.dark, .dark *))`. Without this, every `dark:`
  utility silently follows the OS media query instead of the toggle.
- The toggle icon swaps in pure CSS (`.theme-icon--sun` / `--moon`) — no JS
  `textContent` juggling.

## Contact Form

Netlify Forms with progressive enhancement:

- Markup is a plain `<form method="POST" data-netlify="true">` with a
  `netlify-honeypot` spam field, so it works with JavaScript disabled.
- `src/components/contactForm.ts` intercepts submit, POSTs via `fetch` and shows
  inline status, so the visitor never leaves the page.

> **Note:** form handling only exists on Netlify. During `npm run dev` the POST
> is answered by the Vite dev server. Test real submissions on a deploy preview.

## Project Lightbox

The Service Provider Platform card opens a screenshot panel. Same doctrine as
the contact form — two working paths:

- **Without JS:** the trigger is an `<a href="#project-modal">`, so the CSS
  `:target` rule opens the panel and the close anchor dismisses it. Nothing is
  dead in the no-scripting path.
- **With JS:** `src/components/projectModal.ts` intercepts the click and drives
  an `.is-open` class instead (the hash is never set), which adds Escape-to-close,
  a focus trap, focus restoration to the trigger and body scroll-lock.

The closed panel uses `visibility: hidden` rather than `aria-hidden="true"`.
That removes the subtree from both the accessibility tree and the tab order in
either path, and it avoids the usual modal bug of marking a focused element as
hidden. `prefers-reduced-motion` needs no extra rule: the panel opens by toggling
a class, never via `animation`, so the existing global transition override makes
it snap open.

`.lightbox` sits at `z-index: 60` — above `#mobile-nav` (40), `#back-to-top` (45)
and the header (50), below the skip link (100). Every colour it uses is an
existing design token that `.dark` already overrides, so theming is inherited.

Screenshots render at the panel's full width with their intrinsic aspect ratio
(`width: 100%; height: auto`) and are never cropped — there is no `object-fit`
anywhere in the panel. The three screenshots are taller than the panel, so
`.lightbox__body` scrolls. `.lightbox__figure` therefore carries
`flex-shrink: 0`: without it these column-flex items would squash to fit the
panel rather than overflow it, because `min-height: auto` only resolves to
content size when `overflow` is `visible`, and `overflow: hidden` is required
there to clip the image to the rounded corners. The header and footer are pinned
the same way. `overscroll-behavior: contain` keeps the scroll from chaining to
the page behind, which matters in the no-JS path that has no body scroll-lock.

## SEO & Accessibility

- Canonical URL, Open Graph (1200×630 image + dimensions), Twitter Card
- JSON-LD `Person` + `WebSite` structured data
- `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, custom `404.html`
- Skip-to-content link, `:focus-visible` ring, ARIA landmarks and labels
- Skill groups are badge lists (`<li class="tag">`) with an `aria-label` per category
- Testimonials use `<figure>` / `<blockquote>` / `<cite>`
- Exactly one `<h1>`; every image has `alt` plus explicit `width`/`height`
- Full `prefers-reduced-motion` support — and content is never left hidden
- Security headers via `netlify.toml` (CSP included but commented out pending
  preview-URL testing)

## Deployment

### Netlify (configured)

`netlify.toml` already sets the build command and publish directory.

1. Push to GitHub.
2. Netlify → *New site from Git* → select this repo. Settings are auto-detected.
3. Add the custom domain `webecomtech.com`; Netlify issues the SSL certificate.

### DNS (Hostinger)

```
Type: CNAME   Name: www   Value: <your-site>.netlify.app
Type: A/ALIAS Name: @     Value: see Netlify's apex instructions
```

Enable **Force HTTPS** in Netlify's domain settings.

## Editing Content

| To change… | Edit |
| --- | --- |
| Bio, headline, copy | `index.html` — the relevant `<section>` |
| Stat numbers | `index.html` — `data-count-to` / `data-count-suffix` **and** the fallback text inside the span |
| Skill lists | `index.html` — `#skills` badge `<li class="tag">` items inside each category card |
| Work history | `index.html` — `#experience` (see the EDIT REQUIRED banner) |
| Projects / links | `index.html` — `#projects` |
| Colours | `src/index.css` — the `:root` and `.dark` token blocks |
| Contact details | `index.html` — `#contact`, `<footer>`, and the JSON-LD in `<head>` |

## Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+. No IE11.

## Pre-Launch Checklist

- [ ] Replace the `#experience` template entries with real employment history
- [ ] Confirm the About stat figures (years / projects / clients) are accurate
- [x] Swap the three reused project screenshots for real ones
- [ ] **Optimise the project screenshots** — they are currently raw PNGs
      (`kingcruise.png` 4.5 MB, `cb_portfolio.png` 1.1 MB, `sp_*.png` ~250-300 KB
      each, ~6.7 MB total). Resize and re-encode to 640/1280/1920 px WebP + JPEG
      and serve via `<picture>`/`srcset`. Needs `sharp`, ImageMagick or `cwebp`.
- [ ] Delete the now-unused `coding.jpg`, `plan.jpg` and `respweb.jpg` from
      `public/img/projects/` once you are happy with the new cards
- [ ] Add 192×192 and 512×512 PNG icons for a fully installable manifest
- [ ] Test a live form submission on a Netlify deploy preview
- [ ] Uncomment and verify the CSP on a preview URL
- [ ] Run Lighthouse (desktop + mobile) — target 95+ in all four categories
- [ ] Remove the legacy root `img/` folder from the repo once nothing needs it

