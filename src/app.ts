/** ==========================================
 * Chimezie Bright — Portfolio Dark/Light theme engine, mobile menu handler, scroll & reveal logic
 **/ declare const IntersectionObserver: any; declare const localStorage: Storage; // global declarations

/* --- Theme Toggle --- */
(function initTheme() {
  const html = document.documentElement;
  const toggleButtons = [document.getElementById('theme-toggle'), document.getElementById('theme-toggle-mobile')] as HTMLButtonElement[];

  function applyTheme(mode: 'dark' | 'light') {
    if (mode === 'dark') {
      html.classList.add('dark');
      toggleButtons.forEach(b => b && (b.textContent = '☾'));
    } else {
      html.classList.remove('dark');
      toggleButtons.forEach(b => b && (b.textContent = '☀'));
    }
    localStorage.setItem('theme-mode', mode);
  }

  // Determine initial theme
  const saved = localStorage.getItem('theme-mode') as string | null;
  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  // Toggle listener
  toggleButtons.forEach(btn => {
    btn?.addEventListener('click', () => {
      const current = html.classList.contains('dark') ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  });

  // Listen for system preferences change
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme-mode')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
})();

/* --- Mobile Menu --- */
(function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn') as HTMLElement | null;
  const overlay = document.getElementById('mobile-nav') as HTMLElement | null;
  const links = overlay ? overlay.querySelectorAll('.mobile-nav-link') : [];
  let isOpen = false;

  function openMenu() {
    if (!btn || !overlay) return;
    btn.setAttribute('aria-expanded', 'true');
    overlay.style.transform = 'translateX(0)';
    if (btn) {
      const bars = btn.querySelectorAll('.hamburger-bar');
      barAnimate(bars[0], 'rotate-45 translate-y-[9px]');
      barAnimate(bars[1], '-rotate-45 -translate-y-[9px]');
    }
    isOpen = true;
  }

  function closeMenu() {
    if (!btn || !overlay) return;
    btn.setAttribute('aria-expanded', 'false');
    overlay.style.transform = 'translateX(100%)';
    if (btn) {
      const bars = btn.querySelectorAll('.hamburger-bar');
      barAnimate(bars[0], '');
      barAnimate(bars[1], '');
    }
    isOpen = false;
  }

  function barAnimate(el: Element, cls: string) {
    el.className = `block w-5 h-[2px] bg-current transition-all duration-300 hamburger-bar ${cls}`.trim();
  }

  btn?.addEventListener('click', () => isOpen ? closeMenu() : openMenu());
  links.forEach(link => link.addEventListener('click', closeMenu));
})();

/* --- Scroll Header Effect --- */
(function initScrollHeader() {
  const header = document.getElementById('main-header');
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (!header) return;
        const scrolled = window.scrollY > 20;
        if (scrolled) {
          header.classList.add('border-[var(--border-color)]', 'bg-opacity-60', 'dark:bg-opacity-60');
          header.style.backdropFilter = 'blur(16px)';
        } else {
          header.classList.remove('border-[var(--border-color)]');
          header.style.backdropFilter = '';
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* --- Scroll Reveal --- */
(function initReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();
