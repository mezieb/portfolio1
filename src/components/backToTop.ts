import { $, rafThrottle, on } from '../utils/dom';
import { scrollBehavior } from '../utils/motion';

/**
 * Reveals the back-to-top button after the visitor has scrolled a little,
 * and scrolls to the top on click (honouring reduced-motion).
 */
export function initBackToTop(threshold = 600): void {
  const button = $('#back-to-top');
  if (!button) return;

  const update = (): void => {
    button.classList.toggle('is-visible', window.scrollY > threshold);
  };

  on(window, 'scroll', rafThrottle(update), { passive: true });
  update();

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  });
}
