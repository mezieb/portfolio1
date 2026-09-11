import { $$ } from '../utils/dom';
import { supportsIntersectionObserver } from '../utils/motion';

/**
 * Scrollspy: marks the desktop nav link for the section currently in view with
 * `aria-current="true"`, which index.css uses to draw the gradient underline.
 *
 * The link -> section pairing is driven by the `data-nav` attribute so the
 * markup stays the single source of truth.
 */
export function useActiveSection(): void {
  const links = $$<HTMLAnchorElement>('#desktop-nav .nav-link[data-nav]');
  if (links.length === 0 || !supportsIntersectionObserver()) return;

  const byId = new Map<string, HTMLAnchorElement>();
  for (const link of links) {
    const id = link.dataset.nav;
    if (id) byId.set(id, link);
  }

  const sections = Array.from(byId.keys())
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);

  if (sections.length === 0) return;

  const setActive = (id: string | null): void => {
    for (const [key, link] of byId) {
      if (key === id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  };

  const visible = new Set<string>();

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      }
      // Prefer the earliest section in document order that is currently visible.
      const current = sections.find((section) => visible.has(section.id));
      setActive(current ? current.id : null);
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
  );

  for (const section of sections) observer.observe(section);
}
