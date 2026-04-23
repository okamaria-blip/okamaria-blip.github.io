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

  /* ── Contact form ─────────────────────────────── */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const nameEl    = form.querySelector('#name');
      const emailEl   = form.querySelector('#email');
      const messageEl = form.querySelector('#message');

      const name    = nameEl?.value.trim();
      const email   = emailEl?.value.trim();
      const message = messageEl?.value.trim();

      // Clear previous state
      [nameEl, emailEl, messageEl].forEach(el => el?.removeAttribute('aria-invalid'));

      if (!name || !email || !message) {
        if (!name)    nameEl?.setAttribute('aria-invalid', 'true');
        if (!email)   emailEl?.setAttribute('aria-invalid', 'true');
        if (!message) messageEl?.setAttribute('aria-invalid', 'true');
        showFormMessage('Please fill in all fields.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        emailEl?.setAttribute('aria-invalid', 'true');
        showFormMessage('Please enter a valid email address.', 'error');
        return;
      }

      // ── REPLACE: wire up to your actual form backend or service here ──
      showFormMessage(
        "Thank you! Your message has been sent. I'll be in touch soon.",
        'success'
      );
      form.reset();
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFormMessage(msg, type) {
    let msgEl = form.querySelector('.form-message');
    if (!msgEl) {
      msgEl = document.createElement('p');
      msgEl.className = 'form-message';
      msgEl.setAttribute('role', type === 'error' ? 'alert' : 'status');
      form.appendChild(msgEl);
    }
    msgEl.textContent = msg;
    msgEl.className   = `form-message ${type}`;
    msgEl.style.display  = 'block';
    msgEl.style.opacity  = '1';

    if (type === 'success') {
      setTimeout(() => {
        msgEl.style.transition = 'opacity 0.5s ease';
        msgEl.style.opacity    = '0';
        setTimeout(() => { msgEl.style.display = 'none'; }, 520);
      }, 6000);
    }
  }

});
