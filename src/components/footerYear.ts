import { $ } from '../utils/dom';

/**
 * Keeps the footer copyright year current.
 *
 * The markup ships a hard-coded fallback year so the value is correct even
 * without JavaScript; this simply refreshes it. Replaces the inline
 * `<script>` that lived in the footer of the old site.
 */
export function initFooterYear(): void {
  const el = $('#year');
  if (el) el.textContent = String(new Date().getFullYear());
}
