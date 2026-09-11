import { $, $$ } from '../utils/dom';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Mobile navigation overlay.
 *
 * Beyond the open/close transition this handles the accessibility work the
 * original implementation was missing: Escape to close, a focus trap so
 * keyboard users cannot tab into the page behind the overlay, focus restoration
 * to the trigger, `aria-hidden`/`aria-expanded` bookkeeping, body scroll-lock,
 * and auto-close when the viewport grows past the mobile breakpoint.
 */
export function initMobileMenu(): void {
  const button = $('#mobile-menu-btn');
  const overlay = $('#mobile-nav');
  if (!button || !overlay) return;

  const bars = $$<HTMLElement>('.hamburger-bar', button);
  const links = $$<HTMLAnchorElement>('a[href]', overlay);
  let isOpen = false;

  const setBars = (open: boolean): void => {
    const top = bars[0];
    const bottom = bars[1];
    if (top) top.style.transform = open ? 'rotate(45deg) translateY(3.5px)' : '';
    if (bottom) bottom.style.transform = open ? 'rotate(-45deg) translateY(-3.5px)' : '';
  };

  const open = (): void => {
    isOpen = true;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-label', 'Close navigation menu');
    document.body.classList.add('nav-open');
    setBars(true);
    links[0]?.focus();
  };

  const close = (restoreFocus = false): void => {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Open navigation menu');
    document.body.classList.remove('nav-open');
    setBars(false);
    if (restoreFocus) button.focus();
  };

  button.addEventListener('click', () => {
    if (isOpen) close(true);
    else open();
  });

  for (const link of links) {
    link.addEventListener('click', () => close());
  }

  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (!isOpen) return;

    if (event.key === 'Escape') {
      close(true);
      return;
    }
    if (event.key !== 'Tab') return;

    // Keep Tab cycling inside the overlay.
    const items = $$<HTMLElement>(FOCUSABLE, overlay).filter(
      (el) => el.getClientRects().length > 0,
    );
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // The overlay is mobile-only; never leave it open across a resize to desktop.
  window
    .matchMedia('(min-width: 768px)')
    .addEventListener('change', (event: MediaQueryListEvent) => {
      if (event.matches) close();
    });
}
