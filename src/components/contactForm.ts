import { $ } from '../utils/dom';

/**
 * Contact form submission.
 *
 * Posts to Netlify Forms over `fetch` so the visitor stays on the page and
 * receives inline feedback. This is pure progressive enhancement: the markup is
 * a plain `<form method="POST" data-netlify="true">`, so with JavaScript
 * disabled the browser performs a native POST and Netlify renders its own
 * success page.
 *
 * NOTE: form handling only exists on Netlify. During `npm run dev` the POST is
 * answered by the Vite dev server, so the success message appears without an
 * entry reaching the Netlify dashboard. Test submissions on a deploy preview.
 */
export function initContactForm(): void {
  const form = $('#contact-form');
  if (!(form instanceof HTMLFormElement)) return;

  const status = $('#form-status');
  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');

  const setStatus = (message: string, tone: 'idle' | 'ok' | 'error'): void => {
    if (!status) return;
    status.textContent = message;
    status.style.color =
      tone === 'ok' ? '#10b981' : tone === 'error' ? '#ef4444' : 'var(--text-secondary)';
  };

  form.addEventListener('submit', async (event: SubmitEvent) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (submitButton) submitButton.disabled = true;
    setStatus('Sending…', 'idle');

    try {
      // URLSearchParams has no FormData overload in the ES2020 DOM lib,
      // so the fields are copied across explicitly.
      const payload = new URLSearchParams();
      for (const [key, value] of new FormData(form).entries()) {
        payload.append(key, String(value));
      }

      const response = await fetch(form.action || window.location.pathname, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString(),
      });

      if (!response.ok) throw new Error(`Form POST failed with status ${response.status}`);

      form.reset();
      setStatus('Thanks — your message has been sent. I will reply within 24 hours.', 'ok');
    } catch {
      setStatus('Sorry, that did not send. Please email okorobright13@gmail.com instead.', 'error');
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}
