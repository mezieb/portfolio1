/**
 * Boot sequence for every progressive-enhancement module.
 *
 * All page content lives in index.html so that it renders, and is indexable by
 * search engines, without JavaScript. Nothing below is required for the page to
 * be readable — these modules only add behaviour on top.
 */
import { initThemeToggle } from './components/themeToggle';
import { initHeaderScroll } from './components/header';
import { initMobileMenu } from './components/mobileMenu';
import { initProjectModal } from './components/projectModal';
import { initBackToTop } from './components/backToTop';
import { initFooterYear } from './components/footerYear';
import { initContactForm } from './components/contactForm';
import { useReveal } from './hooks/useReveal';
import { useCountUp } from './hooks/useCountUp';
import { useActiveSection } from './hooks/useActiveSection';

/** Initialises all features. Each one no-ops safely if its markup is absent. */
export function boot(): void {
  // Chrome & interaction
  initThemeToggle();
  initHeaderScroll();
  initMobileMenu();
  initProjectModal();
  initBackToTop();
  initFooterYear();
  initContactForm();

  // Scroll-driven animation
  useReveal();
  useCountUp();
  useActiveSection();
}
