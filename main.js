/* ============================================================
   ERIGO HEALTHCARE SOLUTIONS — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════
     1. HAMBURGER / MOBILE MENU
  ══════════════════════════════════════ */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      }
    });

    // Close on mobile link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ══════════════════════════════════════
     2. ACTIVE NAV LINK (auto-detect page)
  ══════════════════════════════════════ */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPage = href.split('/').pop().split('#')[0];
    if (linkPage && linkPage === page) link.classList.add('active');
  });

  /* ══════════════════════════════════════
     3. NAVBAR SCROLL SHADOW
  ══════════════════════════════════════ */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 10
        ? '0 4px 16px rgba(0,0,0,.10)'
        : '';
    }, { passive: true });
  }

  /* ══════════════════════════════════════
     4. SCROLL-TRIGGERED FADE-UP ANIMATION
  ══════════════════════════════════════ */
  const fadeEls = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ══════════════════════════════════════
     5. ANIMATED COUNTERS (stats bar)
  ══════════════════════════════════════ */
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length) {
    const animateCounter = el => {
      const target   = +el.getAttribute('data-target');
      const suffix   = el.getAttribute('data-suffix') || '';
      const duration = 1600;
      const step     = 16;
      const increment = target / (duration / step);
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target + suffix;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current) + suffix;
        }
      }, step);
    };

    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObs.observe(c));
  }

  /* ══════════════════════════════════════
     6. CONTACT FORM — SUCCESS POPUP
  ══════════════════════════════════════ */
  const forms   = document.querySelectorAll('.contact-form, form.form-box form');
  const popup   = document.getElementById('success-popup');

  forms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (popup) {
        popup.classList.add('show');
        setTimeout(() => popup.classList.remove('show'), 5000);
      }
      form.reset();
    });
  });

  // Also catch any form on page
  document.querySelectorAll('form').forEach(form => {
    if (!form.dataset.handled) {
      form.dataset.handled = 'true';
      form.addEventListener('submit', e => {
        e.preventDefault();
        if (popup) {
          popup.classList.add('show');
          setTimeout(() => popup.classList.remove('show'), 5000);
        }
        form.reset();
      });
    }
  });

});
