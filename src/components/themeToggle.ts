import { $$ } from '../utils/dom';

const STORAGE_KEY = 'theme-mode';
const DARK_COLOR = '#09090b';
const LIGHT_COLOR = '#ffffff';

type Mode = 'dark' | 'light';

/** Every theme control on the page (desktop + mobile). */
function toggles(): HTMLButtonElement[] {
  return $$<HTMLButtonElement>('[id^="theme-toggle"]');
}

/** Resolves the mode to use when the visitor has not made an explicit choice. */
function storedMode(): Mode | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    /* storage blocked (private mode / strict cookies) — fall through */
  }
  return null;
}

/**
 * Applies a mode to <html>, the theme-color meta and every toggle button.
 * `persist` is false on init and on OS changes so that merely visiting the
 * site does not lock the visitor out of following their system preference.
 */
function apply(mode: Mode, persist = false): void {
  const root = document.documentElement;
  root.classList.toggle('dark', mode === 'dark');

  // Keeps native chrome (mobile address bar, form controls) in step.
  const meta = document.getElementById('theme-color');
  if (meta) meta.setAttribute('content', mode === 'dark' ? DARK_COLOR : LIGHT_COLOR);

  for (const button of toggles()) {
    button.setAttribute('aria-pressed', String(mode === 'dark'));
    button.setAttribute(
      'aria-label',
      mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
    );
  }

  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* non-fatal: theme simply will not persist */
    }
  }
}

/**
 * Wires the theme toggles.
 *
 * The inline script in <head> has already applied the correct class before
 * first paint; this module only synchronises ARIA state, handles clicks and
 * keeps following the OS preference until an explicit choice is made.
 */
export function initThemeToggle(): void {
  const buttons = toggles();
  if (buttons.length === 0) return;

  const current = (): Mode =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light';

  apply(storedMode() ?? current());

  for (const button of buttons) {
    button.addEventListener('click', () => {
      apply(current() === 'dark' ? 'light' : 'dark', true);
    });
  }

  window
    .matchMedia('(prefers-color-scheme: light)')
    .addEventListener('change', (event: MediaQueryListEvent) => {
      if (storedMode() !== null) return; // explicit choice wins
      apply(event.matches ? 'light' : 'dark');
    });
}
