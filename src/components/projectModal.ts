import { $, $$ } from '../utils/dom';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Project screenshot lightbox.
 *
 * Progressive enhancement, matching the rest of this codebase: without JS the
 * `#project-modal` anchor target opens the panel through the CSS `:target` rule,
 * and the close anchor dismisses it. With JS, clicks are intercepted and the
 * panel is driven by `.is-open`, which additionally gives Escape-to-close, a
 * focus trap, focus restoration to the trigger and body scroll-lock.
 *
 * The closed state relies on `visibility: hidden` rather than `aria-hidden`, so
 * the subtree leaves both the accessibility tree and the tab order in either
 * path — and a focused element can never be marked hidden, which is the usual
 * modal accessibility bug.
 */
export function initProjectModal(): void {
  const modal = $('#project-modal');
  if (!modal) return;

  const triggers = $$<HTMLElement>('[data-lightbox]');
  if (triggers.length === 0) return;

  const closers = $$<HTMLElement>('[data-lightbox-close]', modal);
  let isOpen = false;
  let lastTrigger: HTMLElement | null = null;

  const open = (trigger: HTMLElement): void => {
    isOpen = true;
    lastTrigger = trigger;
    modal.classList.add('is-open');
    document.body.classList.add('lightbox-open');
    closers[0]?.focus();
  };

  const close = (restoreFocus = false): void => {
    if (!isOpen) return;
    isOpen = false;
    modal.classList.remove('is-open');
    document.body.classList.remove('lightbox-open');
    if (restoreFocus) lastTrigger?.focus();
    lastTrigger = null;
  };

  for (const trigger of triggers) {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      open(trigger);
    });
  }

  for (const closer of closers) {
    closer.addEventListener('click', (event) => {
      event.preventDefault();
      close(true);
    });
  }

  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (!isOpen) return;

    if (event.key === 'Escape') {
      close(true);
      return;
    }
    if (event.key !== 'Tab') return;

    // Keep Tab cycling inside the panel — same logic as the mobile overlay.
    const items = $$<HTMLElement>(FOCUSABLE, modal).filter(
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
}
