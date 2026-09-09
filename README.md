# Chimezie Bright — Professional Portfolio

Modern, responsive portfolio website for Okoro Chimezie Bright — Full Stack Software Engineer.

## Tech Stack

- **Build**: [Vite 6](https://vite.dev) — Blazing fast dev server & optimized production builds
- **CSS**: [Tailwind CSS v4](https://tailwindcss.com) + custom dark/light theme system
- **Language**: Vanilla TypeScript
- **Fonts**: Plus Jakarta Sans (headings) + Inter (body) via Google Fonts
- **Icons**: Lucide/Heroicons SVGs (inline)
- **Deploy**: [Netlify](https://netlify.com) — auto-deploy from GitHub
- **Domain**: webecomtech.com (Hostinger-resolved to Netlify CNAME)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```
├── index.html            # Semantic HTML shell with SEO meta tags
├── src/
│   ├── index.css         # Tailwind v4 + dark/light theme CSS variables
│   ├── main.ts           # Entry point — imports CSS + runtime logic
│   └── app.ts            # Theme toggle, mobile menu, scroll effects, reveal animations
├── public/
│   ├── img/
│   │   ├── logos/        # Brand logo SVG
│   │   ├── profile/      # Portrait photos
│   │   ├── projects/     # Project screenshots
│   │   └── testimonials/ # Testimonial images
│   └── resume/           # CV PDF for download
├── dist/                 # Production build output (generated)
└── package.json
```

## Deployment

### Netlify (recommended)
1. Push to your GitHub repo
2. Connect repo in [Netlify → New site from Git](https://app.netlify.com/start)
3. Build settings auto-detected (`npm run build` → `dist/`)
4. Add custom domain `webecomtech.com` — Netlify provides DNS + SSL

### Hostinger (your existing hosting)
Your CNAME can point to Netlify:
```
Type: CNAME
Name: www
Value: [your-netlify-site-name].netlify.app
```

## Theme System

Uses CSS custom properties for full dark/light mode support:
- **Dark mode** is default (midnight palette with cyan/violet gradients)
- Toggle via header buttons or `localStorage` preference
- Respects `prefers-color-scheme` system setting

## Browser Support

Modern browsers — Chrome 90+, Firefox 88+, Safari 14+, Edge 90+.
IE11 not supported (no need for a dev portfolio 😉).
