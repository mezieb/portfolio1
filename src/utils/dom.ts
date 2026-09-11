/**
 * Tiny DOM helpers shared across the feature modules.
 */

/** `querySelector` with a narrowed return type. */
export function $<T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document,
): T | null {
  return root.querySelector<T>(selector);
}

/** `querySelectorAll` as a real array, so map/filter/find just work. */
export function $$<T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document,
): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

/**
 * Registers a listener and returns its own remover, keeping teardown trivial.
 */
export function on(
  target: EventTarget,
  type: string,
  handler: (event: Event) => void,
  options?: boolean | AddEventListenerOptions,
): () => void {
  target.addEventListener(type, handler, options);
  return () => target.removeEventListener(type, handler, options);
}

/**
 * Coalesces a high-frequency handler (scroll, resize) into one call per frame.
 */
export function rafThrottle(fn: () => void): () => void {
  let ticking = false;
  return () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      fn();
      ticking = false;
    });
  };
}
