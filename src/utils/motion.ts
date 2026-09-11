/**
 * Motion preference helpers. Every animation module must consult this so the
 * site respects the OS "reduce motion" setting.
 */

/** True when the visitor has asked the OS to reduce motion. */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** True when IntersectionObserver is unavailable (very old browsers). */
export function supportsIntersectionObserver(): boolean {
  return typeof window !== 'undefined' && 'IntersectionObserver' in window;
}

/**
 * Scroll behaviour that honours the motion preference — use instead of
 * hard-coding `behavior: 'smooth'`.
 */
export function scrollBehavior(): ScrollBehavior {
  return prefersReducedMotion() ? 'auto' : 'smooth';
}
