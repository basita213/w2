/* ======================================================
   RR BOUTIQUE — Main JavaScript
   Preloader, Navigation, Scroll Animations, Counters
   ====================================================== */

(function () {
  'use strict';

  // --- Preloader ---
  const preloader = document.getElementById('preloader');

  function hidePreloader() {
    preloader.classList.add('hidden');
    document.body.classList.remove('no-scroll');
    initAnimations();
  }

  document.body.classList.add('no-scroll');

  if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 800);
  } else {
    window.addEventListener('load', function () {
      setTimeout(hidePreloader, 800);
    });
  }

  // --- Navigation ---
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

  function handleNavScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  function toggleMobileMenu() {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  }

  navToggle.addEventListener('click', toggleMobileMenu);

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (mobileMenu.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // --- Scroll Animations ---
  function initAnimations() {
    var elements = document.querySelectorAll('[data-animate]');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var delay = parseInt(entry.target.dataset.delay) || 0;
              setTimeout(function () {
                entry.target.classList.add('visible');
              }, delay);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -40px 0px',
        }
      );

      elements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: show everything
      elements.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  // --- Number Counter Animation ---
  function animateCounters() {
    var counters = document.querySelectorAll('[data-count]');

    if ('IntersectionObserver' in window) {
      var counterObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var el = entry.target;
              var target = parseInt(el.dataset.count);
              var suffix = el.dataset.suffix || '';
              var format = el.dataset.format || '';
              var duration = 2000;
              var startTime = null;

              function easeOutQuart(t) {
                return 1 - Math.pow(1 - t, 4);
              }

              function updateCounter(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var easedProgress = easeOutQuart(progress);
                var current = Math.floor(easedProgress * target);

                if (format === 'abbr') {
                  if (current >= 1000) {
                    el.textContent = (current / 1000).toFixed(1) + 'k' + suffix;
                  } else {
                    el.textContent = current + suffix;
                  }
                } else {
                  el.textContent = current.toLocaleString() + suffix;
                }

                if (progress < 1) {
                  requestAnimationFrame(updateCounter);
                }
              }

              requestAnimationFrame(updateCounter);
              counterObserver.unobserve(el);
            }
          });
        },
        { threshold: 0.5 }
      );

      counters.forEach(function (counter) {
        counterObserver.observe(counter);
      });
    }
  }

  animateCounters();

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: top,
          behavior: 'smooth',
        });
      }
    });
  });

  // --- Parallax on Image Break ---
  var imageBreak = document.querySelector('.image-break-bg img');
  if (imageBreak) {
    window.addEventListener(
      'scroll',
      function () {
        var rect = imageBreak.parentElement.parentElement.getBoundingClientRect();
        var windowHeight = window.innerHeight;

        if (rect.top < windowHeight && rect.bottom > 0) {
          var scrollPercent = (windowHeight - rect.top) / (windowHeight + rect.height);
          var parallaxOffset = (scrollPercent - 0.5) * 40;
          imageBreak.style.transform = 'translateY(' + parallaxOffset + 'px) scale(1.1)';
        }
      },
      { passive: true }
    );
  }

  // --- Hero Parallax ---
  var heroBg = document.querySelector('.hero-bg-img');
  if (heroBg) {
    window.addEventListener(
      'scroll',
      function () {
        var scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
          heroBg.style.transform = 'scale(' + (1.05 + scrolled * 0.0001) + ') translateY(' + scrolled * 0.15 + 'px)';
        }
      },
      { passive: true }
    );
  }

  // --- Nav hide on scroll down, show on scroll up ---
  var lastScrollY = 0;
  var navHidden = false;

  window.addEventListener(
    'scroll',
    function () {
      var currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 200 && !navHidden) {
        nav.style.transform = 'translateY(-100%)';
        nav.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        navHidden = true;
      } else if (currentScrollY < lastScrollY && navHidden) {
        nav.style.transform = 'translateY(0)';
        navHidden = false;
      }

      lastScrollY = currentScrollY;
    },
    { passive: true }
  );
})();
