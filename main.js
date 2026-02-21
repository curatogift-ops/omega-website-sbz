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
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ══════════════════════════════════════
     2. MOBILE ACCORDION — Solutions submenu
  ══════════════════════════════════════ */
  document.querySelectorAll('.mobile-accordion-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const bodyId = btn.getAttribute('data-target');
      const body   = document.getElementById(bodyId);
      const isOpen = btn.classList.contains('open');

      // Close all other accordions
      document.querySelectorAll('.mobile-accordion-btn.open').forEach(b => {
        b.classList.remove('open');
        const bBody = document.getElementById(b.getAttribute('data-target'));
        if (bBody) bBody.classList.remove('open');
      });

      if (!isOpen) {
        btn.classList.add('open');
        if (body) body.classList.add('open');
      }
    });
  });

  /* ══════════════════════════════════════
     3. MEGA MENU — close on outside click
  ══════════════════════════════════════ */
  const megaWrappers = document.querySelectorAll('.nav-dropdown-wrapper');
  megaWrappers.forEach(wrapper => {
    // Keep hover via CSS; also support focus/keyboard
    wrapper.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        wrapper.querySelector('.mega-menu')?.blur();
      }
    });
  });

  /* ══════════════════════════════════════
     4. ACTIVE NAV LINK
  ══════════════════════════════════════ */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a:not(.btn)').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPage = href.split('/').pop().split('#')[0];
    if (linkPage && linkPage === page) link.classList.add('active');
  });

  /* ══════════════════════════════════════
     5. NAVBAR SCROLL SHADOW
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
     6. SCROLL-TRIGGERED FADE-UP ANIMATION
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
    }, { threshold: 0.1 });
    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ══════════════════════════════════════
     7. ANIMATED COUNTERS
  ══════════════════════════════════════ */
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length) {
    const animateCounter = el => {
      const raw    = el.getAttribute('data-target').replace(/,/g, '');
      const target = +raw;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1600;
      const step     = 16;
      const increment = target / (duration / step);
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = el.getAttribute('data-target') + suffix;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current).toLocaleString() + suffix;
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
     8. CONTACT FORM — SUCCESS POPUP
  ══════════════════════════════════════ */
  const popup = document.getElementById('success-popup');
  document.querySelectorAll('form').forEach(form => {
    if (form.dataset.handled) return;
    form.dataset.handled = 'true';
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (popup) {
        popup.classList.add('show');
        setTimeout(() => popup.classList.remove('show'), 5000);
      }
      form.reset();
    });
  });

  /* ══════════════════════════════════════
     9. TESTIMONIALS SLIDER
  ══════════════════════════════════════ */
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const testimonialDots  = document.querySelectorAll('.testimonials-dots .dot');
  let currentSlide = 0;
  let sliderTimer;

  function showSlide(index) {
    testimonialCards.forEach(c => c.classList.remove('active'));
    testimonialDots.forEach(d => d.classList.remove('active'));
    currentSlide = (index + testimonialCards.length) % testimonialCards.length;
    testimonialCards[currentSlide].classList.add('active');
    if (testimonialDots[currentSlide]) testimonialDots[currentSlide].classList.add('active');
  }

  if (testimonialCards.length) {
    // Dot click — manual navigation
    testimonialDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(sliderTimer);
        showSlide(i);
        // Resume auto-play after 10 seconds
        sliderTimer = setInterval(() => showSlide(currentSlide + 1), 6000);
      });
    });
    // Auto-play
    sliderTimer = setInterval(() => showSlide(currentSlide + 1), 6000);
  }

});
