import { $, on, rafThrottle } from '../utils/dom';

/**
 * Toggles `.header-scrolled` once the page is scrolled past the threshold.
 *
 * Replaces the old implementation, which injected `bg-opacity-60` /
 * `dark:bg-opacity-60` at runtime — utilities that no longer exist in
 * Tailwind v4, so the header never actually gained a background.
 *
 * Also runs once immediately, so a page loaded mid-scroll (anchor link,
 * refresh, back/forward) starts in the correct state.
 */
export function initHeaderScroll(threshold = 20): void {
  const header = $('#main-header');
  if (!header) return;

  const update = (): void => {
    header.classList.toggle('header-scrolled', window.scrollY > threshold);
  };

  on(window, 'scroll', rafThrottle(update), { passive: true });
  update();
}
