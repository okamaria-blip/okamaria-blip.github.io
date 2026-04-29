/* ================================================
   AUTHOR WEBSITE — Vanilla JS
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Page fade-in ─────────────────────────────── */
  document.body.classList.add('page-loaded');

  /* ── Nav scroll state ─────────────────────────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Active nav link ──────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (
      href === currentPage ||
      (currentPage === '' && href === 'index.html') ||
      (currentPage === 'index.html' && href === 'index.html')
    ) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ── Mobile hamburger ─────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const navMenu   = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');
      navMenu.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile nav when a link is tapped
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    // Close on backdrop click (outside menu)
    document.addEventListener('click', e => {
      if (navMenu.classList.contains('active') &&
          !navMenu.contains(e.target) &&
          !hamburger.contains(e.target)) {
        closeMobileNav();
      }
    });
  }

  function closeMobileNav() {
    hamburger?.classList.remove('active');
    navMenu?.classList.remove('active');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /* ── Page transitions ─────────────────────────── */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    // Only intercept internal page links (not anchors, external URLs, or mailto)
    if (
      href &&
      !href.startsWith('#') &&
      !href.startsWith('http') &&
      !href.startsWith('//') &&
      !href.startsWith('mailto') &&
      !href.startsWith('tel')
    ) {
      link.addEventListener('click', e => {
        e.preventDefault();
        const dest = link.href;
        document.body.classList.remove('page-loaded');
        document.body.classList.add('page-exit');
        setTimeout(() => { window.location.href = dest; }, 320);
      });
    }
  });

  /* ── Scroll-reveal animations ─────────────────── */
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fade-in').forEach(el => revealObserver.observe(el));

});
