import { $$ } from '../utils/dom';
import { prefersReducedMotion, supportsIntersectionObserver } from '../utils/motion';

/**
 * Animates every `[data-count-to]` element from 0 to its target the first time
 * it scrolls into view.
 *
 * The final value is already present in the markup (e.g. `>5+<`), so the
 * numbers are correct with JavaScript disabled and are never hidden from
 * assistive technology.
 */
export function useCountUp(duration = 1400): void {
  const targets = $$<HTMLElement>('[data-count-to]');
  if (targets.length === 0) return;

  // Markup already holds the correct final value — nothing to do.
  if (prefersReducedMotion() || !supportsIntersectionObserver()) return;

  const animate = (el: HTMLElement): void => {
    const to = Number(el.dataset.countTo);
    const suffix = el.dataset.countSuffix ?? '';
    if (!Number.isFinite(to)) return;

    const start = performance.now();

    const step = (now: number): void => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = `${Math.round(to * eased)}${suffix}`;
      if (progress < 1) window.requestAnimationFrame(step);
    };

    window.requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        animate(entry.target as HTMLElement);
        obs.unobserve(entry.target);
      }
    },
    { threshold: 0.4 },
  );

  for (const el of targets) observer.observe(el);
}
