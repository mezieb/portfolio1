import { $$ } from '../utils/dom';
import { prefersReducedMotion, supportsIntersectionObserver } from '../utils/motion';

/**
 * Adds `.visible` to every `.reveal` element as it scrolls into view.
 *
 * When the visitor prefers reduced motion — or IntersectionObserver is
 * unavailable — every element is revealed immediately. The previous
 * implementation returned early in that case, which left all content
 * permanently stuck at `opacity: 0` (a blank page).
 */
export function useReveal(): void {
  const targets = $$('.reveal');
  if (targets.length === 0) return;

  if (prefersReducedMotion() || !supportsIntersectionObserver()) {
    for (const el of targets) el.classList.add('visible');
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
  );

  for (const el of targets) observer.observe(el);
}
