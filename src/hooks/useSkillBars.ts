import { $$ } from '../utils/dom';
import { prefersReducedMotion, supportsIntersectionObserver } from '../utils/motion';

/**
 * Fills each `.skill-bar__fill` when its bar scrolls into view.
 *
 * The real width comes from the inline `--level` custom property in the
 * markup, so bars render at their true value with JavaScript disabled.
 * The `.js`-gated rule in index.css is what enables the scaleX(0) -> scaleX(1)
 * transition only for scripting visitors.
 */
export function useSkillBars(): void {
  const fills = $$('.skill-bar__fill');
  if (fills.length === 0) return;

  if (prefersReducedMotion() || !supportsIntersectionObserver()) {
    for (const el of fills) el.classList.add('is-filled');
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-filled');
        obs.unobserve(entry.target);
      }
    },
    { threshold: 0.3 },
  );

  for (const el of fills) observer.observe(el);
}
