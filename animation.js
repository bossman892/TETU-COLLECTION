/**
 * ==========================================================================
 * TETU COLLECTION — LUXURY MOTION & AMBIENT ANIMATION CONTROLLER (animation.js)
 * Brand: TETU COLLECTION
 * Atelier / Made by: Bossy designs
 * Contact / WhatsApp Concierge: +254700309655
 * Theme: Luxury Dark Noir & Brushed Warm Gold (#d4af37)
 * ==========================================================================
 *
 * Capabilities:
 * - Fluid Scroll-Triggered Reveal Animations (IntersectionObserver with stagger)
 * - Atmospheric Gold Shimmer & Stardust Canvas Particle System (ambient noir depth)
 * - 3D Magnetic Tilt & Dynamic Glow for luxury product & atelier cards
 * - Magnetic Hover Physics for luxury buttons and interactive CTAs
 * - Smooth Parallax Depth for hero visuals and editorial lifestyle banners
 * - Atmospheric Gold Cursor Halo with trailing inertia
 * - Smooth Mobile Navigation (drawer toggle, backdrop, body scroll lock)
 * - Navigation Link Handling (active state + smooth scroll)
 * - Full 'prefers-reduced-motion' accessibility compliance & battery awareness
 * ==========================================================================
 */

(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.TetuAnimation = factory();
  }
})(
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof window !== 'undefined'
    ? window
    : this,
  function () {
    'use strict';

    // ------------------------------------------------------------------------
    // 1. Configuration & Motion Tokens
    // ------------------------------------------------------------------------
    const ANIM_CONFIG = {
      brandName: 'TETU COLLECTION',
      madeBy: 'Bossy designs',
      phone: '+254700309655',
      canvasId: 'tetu-ambient-canvas',
      goldColor: 'rgba(212, 175, 55, 0.45)',
      goldCore: '#d4af37',
      particleCount: window.innerWidth < 768 ? 24 : 50,
      maxSpeed: 0.35,
      tiltAngle: 8, // Max tilt in degrees
      magneticStrength: 0.25, // Strength of button pull
      revealThreshold: 0.12,
    };

    // Resolve mobile nav config from global config if available
    function getMobileNavConfig() {
      const cfg = (typeof window !== 'undefined' && window.TETU_CONFIG) || null;
      return (
        (cfg && cfg.mobileNav) || {
          breakpoint: 1024,
          toggleSelector:
            '#mobile-menu-toggle, #mobile-nav-toggle, .mobile-menu-toggle, .mobile-menu-btn',
          panelSelector: '#mobile-menu-panel, .mobile-menu-panel',
          backdropSelector: '#mobile-menu-backdrop, .mobile-menu-backdrop',
          navLinksSelector: '.nav-links',
          bodyLockClass: 'menu-open',
          iconOpen: 'close',
          iconClosed: 'menu',
        }
      );
    }

    const isReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const navState = { isOpen: false };

    // ------------------------------------------------------------------------
    // 2. DOM Helpers
    // ------------------------------------------------------------------------
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    // ------------------------------------------------------------------------
    // 3. Global Keyframes & CSS Injection
    // ------------------------------------------------------------------------
    function injectAnimationStyles() {
      if (document.getElementById('tetu-animation-styles')) return;

      const style = document.createElement('style');
      style.id = 'tetu-animation-styles';
      style.textContent = `
        /* Staggered Scroll Reveal Classes */
        .tetu-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .tetu-reveal.is-revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .tetu-reveal-scale {
          opacity: 0;
          transform: scale(0.96) translateY(20px);
          transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .tetu-reveal-scale.is-revealed {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
        .tetu-reveal-left {
          opacity: 0;
          transform: translateX(-30px);
          transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tetu-reveal-left.is-revealed {
          opacity: 1;
          transform: translateX(0);
        }
        .tetu-reveal-right {
          opacity: 0;
          transform: translateX(30px);
          transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tetu-reveal-right.is-revealed {
          opacity: 1;
          transform: translateX(0);
        }

        /* Gold Halo Mouse Cursor Follower */
        #tetu-cursor-halo {
          position: fixed;
          top: 0;
          left: 0;
          width: 320px;
          height: 320px;
          margin-left: -160px;
          margin-top: -160px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.07) 0%, rgba(212, 175, 55, 0.02) 40%, transparent 70%);
          pointer-events: none;
          z-index: 1;
          opacity: 0;
          transition: opacity 0.4s ease-out;
          transform: translate3d(-999px, -999px, 0);
          will-change: transform;
        }
        body:hover #tetu-cursor-halo {
          opacity: 1;
        }

        /* Ambient Background Canvas */
        #${ANIM_CONFIG.canvasId} {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 0;
        }

        /* Product Card Luxury Glow Reflection */
        .tetu-interactive-card {
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        .tetu-interactive-card .card-sheen {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 175, 55, 0.12) 0%, transparent 60%);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .tetu-interactive-card:hover .card-sheen {
          opacity: 1;
        }

        /* Ambient Gold Pulse for WhatsApp & Badges */
        @keyframes goldPulseGlow {
          0%, 100% {
            box-shadow: 0 0 15px rgba(212, 175, 55, 0.25), 0 0 1px rgba(212, 175, 55, 0.6);
          }
          50% {
            box-shadow: 0 0 28px rgba(212, 175, 55, 0.45), 0 0 4px rgba(212, 175, 55, 0.9);
          }
        }
        .anim-pulse-gold {
          animation: goldPulseGlow 3.5s ease-in-out infinite;
        }
      `;
      document.head.appendChild(style);
    }

    // ------------------------------------------------------------------------
    // 4. Staggered Scroll Reveal System (IntersectionObserver)
    // ------------------------------------------------------------------------
    function initScrollReveal() {
      if (isReducedMotion) {
        $$(
          '.tetu-reveal, .tetu-reveal-scale, .tetu-reveal-left, .tetu-reveal-right'
        ).forEach((el) => el.classList.add('is-revealed'));
        return;
      }

      // Auto-tag common elements if not already tagged
      const targetSelectors = [
        '.page-header',
        '.product-card',
        '.catalog-item',
        '.atelier-card',
        '.review-item-card',
        '.metric-col',
        '.concierge-support-banner',
        'section h2',
        'section p.subtitle',
        '.brand-ethos-content',
      ];

      targetSelectors.forEach((sel) => {
        $$(sel).forEach((el, index) => {
          if (
            !el.classList.contains('tetu-reveal') &&
            !el.classList.contains('tetu-reveal-scale')
          ) {
            el.classList.add('tetu-reveal');
            const stagger = (index % 4) * 0.1;
            el.style.transitionDelay = `${stagger}s`;
          }
        });
      });

      if (!('IntersectionObserver' in window)) {
        // Fallback: reveal everything
        $$(
          '.tetu-reveal, .tetu-reveal-scale, .tetu-reveal-left, .tetu-reveal-right'
        ).forEach((el) => el.classList.add('is-revealed'));
        return;
      }

      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px -40px 0px',
          threshold: ANIM_CONFIG.revealThreshold,
        }
      );

      $$(
        '.tetu-reveal, .tetu-reveal-scale, .tetu-reveal-left, .tetu-reveal-right'
      ).forEach((el) => revealObserver.observe(el));
    }

    // ------------------------------------------------------------------------
    // 5. Atmospheric Gold Stardust Canvas (Ambient Particle Simulation)
    // ------------------------------------------------------------------------
    function initAmbientParticles() {
      if (isReducedMotion) return;
      if (document.getElementById(ANIM_CONFIG.canvasId)) return;

      const canvas = document.createElement('canvas');
      canvas.id = ANIM_CONFIG.canvasId;
      document.body.prepend(canvas);

      const ctx = canvas.getContext('2d');
      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);

      let animationFrameId = null;
      const particles = [];

      class GoldParticle {
        constructor() {
          this.reset();
        }

        reset() {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.radius = Math.random() * 1.4 + 0.3;
          this.vx = (Math.random() - 0.5) * ANIM_CONFIG.maxSpeed;
          this.vy = -(Math.random() * 0.4 + 0.15);
          this.alpha = Math.random() * 0.55 + 0.15;
          this.twinkleSpeed = Math.random() * 0.02 + 0.008;
          this.twinkleFactor = Math.random() * Math.PI * 2;
        }

        update() {
          this.x += this.vx;
          this.y += this.vy;
          this.twinkleFactor += this.twinkleSpeed;

          if (this.y < -10 || this.x < -10 || this.x > width + 10) {
            this.y = height + 10;
            this.x = Math.random() * width;
          }
        }

        draw() {
          const dynamicAlpha = Math.max(
            0.08,
            this.alpha + Math.sin(this.twinkleFactor) * 0.25
          );
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 175, 55, ${dynamicAlpha})`;
          ctx.shadowBlur = this.radius * 3;
          ctx.shadowColor = '#d4af37';
          ctx.fill();
        }
      }

      for (let i = 0; i < ANIM_CONFIG.particleCount; i++) {
        particles.push(new GoldParticle());
      }

      function render() {
        ctx.clearRect(0, 0, width, height);
        ctx.shadowBlur = 0;

        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();
        }

        animationFrameId = requestAnimationFrame(render);
      }

      render();

      window.addEventListener(
        'resize',
        () => {
          width = canvas.width = window.innerWidth;
          height = canvas.height = window.innerHeight;
        },
        { passive: true }
      );
    }

    // ------------------------------------------------------------------------
    // 6. 3D Tilt & Dynamic Radial Sheen on Product Cards
    // ------------------------------------------------------------------------
    function init3DCardTilt() {
      if (isReducedMotion || window.innerWidth <= 768) return;

      const cards = $$(
        '.product-card, .catalog-item, .atelier-card, .review-item-card'
      );

      cards.forEach((card) => {
        if (card.__tetuTiltBound) return;
        card.__tetuTiltBound = true;
        card.classList.add('tetu-interactive-card');

        if (!card.querySelector('.card-sheen')) {
          const sheen = document.createElement('div');
          sheen.className = 'card-sheen';
          card.appendChild(sheen);
        }

        function handleMouseMove(e) {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX =
            ((y - centerY) / centerY) * -ANIM_CONFIG.tiltAngle;
          const rotateY = ((x - centerX) / centerX) * ANIM_CONFIG.tiltAngle;

          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(
            2
          )}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;

          const pctX = ((x / rect.width) * 100).toFixed(1) + '%';
          const pctY = ((y / rect.height) * 100).toFixed(1) + '%';
          card.style.setProperty('--mouse-x', pctX);
          card.style.setProperty('--mouse-y', pctY);
        }

        function handleMouseLeave() {
          card.style.transform =
            'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        }

        card.addEventListener('mousemove', handleMouseMove, { passive: true });
        card.addEventListener('mouseleave', handleMouseLeave, { passive: true });
      });
    }

    // ------------------------------------------------------------------------
    // 7. Magnetic Button Hover Interaction
    // ------------------------------------------------------------------------
    function initMagneticButtons() {
      if (isReducedMotion || window.innerWidth <= 768) return;

      const magneticElements = $$(
        '.btn-gold, .btn-whatsapp-solid, .nav-whatsapp-cta, #tetu-floating-whatsapp, #tetu-floating-cart-btn'
      );

      magneticElements.forEach((btn) => {
        if (btn.__tetuMagneticBound) return;
        btn.__tetuMagneticBound = true;
        btn.style.willChange = 'transform';
        btn.style.transition =
          'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)';

        btn.addEventListener(
          'mousemove',
          (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - (rect.left + rect.width / 2);
            const y = e.clientY - (rect.top + rect.height / 2);

            btn.style.transform = `translate3d(${
              x * ANIM_CONFIG.magneticStrength
            }px, ${y * ANIM_CONFIG.magneticStrength}px, 0)`;
          },
          { passive: true }
        );

        btn.addEventListener(
          'mouseleave',
          () => {
            btn.style.transform = 'translate3d(0, 0, 0)';
          },
          { passive: true }
        );
      });
    }

    // ------------------------------------------------------------------------
    // 8. Ambient Cursor Halo with Smooth Inertia
    // ------------------------------------------------------------------------
    function initCursorHalo() {
      if (isReducedMotion || window.innerWidth <= 768) return;

      let halo = document.getElementById('tetu-cursor-halo');
      if (!halo) {
        halo = document.createElement('div');
        halo.id = 'tetu-cursor-halo';
        document.body.appendChild(halo);
      }

      let mouseX = -999;
      let mouseY = -999;
      let currentX = -999;
      let currentY = -999;
      let isMoving = false;

      window.addEventListener(
        'mousemove',
        (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
          if (!isMoving) {
            currentX = mouseX;
            currentY = mouseY;
            isMoving = true;
          }
        },
        { passive: true }
      );

      function tick() {
        if (isMoving) {
          currentX += (mouseX - currentX) * 0.12;
          currentY += (mouseY - currentY) * 0.12;
          halo.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
        requestAnimationFrame(tick);
      }

      tick();
    }

    // ------------------------------------------------------------------------
    // 9. Parallax Depth for Hero Banners & Lifestyle Imagery
    // ------------------------------------------------------------------------
    function initParallax() {
      if (isReducedMotion) return;

      const parallaxBanners = $$(
        '.hero-section, .brand-ethos-section, .editorial-hero'
      );
      if (!parallaxBanners.length) return;

      window.addEventListener(
        'scroll',
        () => {
          const scrollY = window.pageYOffset || window.scrollY;

          parallaxBanners.forEach((banner) => {
            const rect = banner.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
              const bgImg = banner.querySelector(
                'img, .hero-background-layer'
              );
              if (bgImg) {
                const speed = 0.18;
                const yPos = rect.top * speed;
                bgImg.style.transform = `translate3d(0, ${yPos.toFixed(
                  1
                )}px, 0)`;
              }
            }
          });
        },
        { passive: true }
      );
    }

    // ==========================================================================
    // 10. SMOOTH MOBILE NAVIGATION
    // ==========================================================================
    function getNavElements() {
      const cfg = getMobileNavConfig();
      return {
        toggle: $(cfg.toggleSelector),
        panel: $(cfg.panelSelector),
        backdrop: $(cfg.backdropSelector),
        navLinks: $(cfg.navLinksSelector),
        breakpoint: cfg.breakpoint || 1024,
        bodyLockClass: cfg.bodyLockClass || 'menu-open',
        iconOpen: cfg.iconOpen || 'close',
        iconClosed: cfg.iconClosed || 'menu',
      };
    }

    function openMobileNav() {
      const els = getNavElements();
      if (!els.panel) return;

      els.panel.classList.remove('-translate-x-full');
      els.panel.classList.add('translate-x-0', 'open');
      els.panel.setAttribute('aria-hidden', 'false');

      if (els.backdrop) {
        els.backdrop.classList.remove('hidden');
        els.backdrop.classList.add('open');
      }

      if (els.toggle) {
        els.toggle.setAttribute('aria-expanded', 'true');
        els.toggle.classList.add('is-active');
        const icon = els.toggle.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = els.iconOpen;
      }

      document.body.classList.add(els.bodyLockClass);
      document.body.style.overflow = 'hidden';
      navState.isOpen = true;
    }

    function closeMobileNav() {
      const els = getNavElements();
      if (!els.panel) return;

      els.panel.classList.add('-translate-x-full');
      els.panel.classList.remove('translate-x-0', 'open');
      els.panel.setAttribute('aria-hidden', 'true');

      if (els.backdrop) {
        els.backdrop.classList.add('hidden');
        els.backdrop.classList.remove('open');
      }

      if (els.toggle) {
        els.toggle.setAttribute('aria-expanded', 'false');
        els.toggle.classList.remove('is-active');
        const icon = els.toggle.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = els.iconClosed;
      }

      document.body.classList.remove(els.bodyLockClass);
      document.body.style.overflow = '';
      navState.isOpen = false;
    }

    function toggleMobileNav() {
      if (navState.isOpen) closeMobileNav();
      else openMobileNav();
    }

    function initMobileNavigation() {
      const els = getNavElements();
      if (!els.toggle && !els.panel) return;

      if (els.toggle && !els.toggle.__tetuNavBound) {
        els.toggle.__tetuNavBound = true;
        els.toggle.setAttribute('aria-expanded', 'false');
        els.toggle.setAttribute('aria-controls', 'mobile-menu-panel');

        els.toggle.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          toggleMobileNav();
        });
      }

      if (els.backdrop && !els.backdrop.__tetuNavBound) {
        els.backdrop.__tetuNavBound = true;
        els.backdrop.addEventListener('click', closeMobileNav);
      }

      if (els.panel && !els.panel.__tetuNavLinksBound) {
        els.panel.__tetuNavLinksBound = true;
        els.panel.querySelectorAll('a').forEach((link) => {
          link.addEventListener('click', function () {
            setTimeout(closeMobileNav, 150);
          });
        });
      }

      if (!document.__tetuNavEscapeBound) {
        document.__tetuNavEscapeBound = true;
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && navState.isOpen) {
            closeMobileNav();
          }
        });
      }

      if (!window.__tetuNavResizeBound) {
        window.__tetuNavResizeBound = true;
        let resizeTimer;
        window.addEventListener('resize', function () {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(function () {
            if (window.innerWidth >= els.breakpoint && navState.isOpen) {
              closeMobileNav();
            }
          }, 150);
        });
      }
    }

    // ==========================================================================
    // 11. NAVIGATION LINKS — Active state + smooth scroll
    // ==========================================================================
    function initNavigationLinks() {
      const cfg = getMobileNavConfig();
      const desktopLinks = $$(cfg.navLinksSelector + ' a');
      const mobileLinks = $$(cfg.panelSelector + ' a');
      const allLinks = desktopLinks.concat(mobileLinks);

      if (!allLinks.length) return;

      const currentPath = (
        window.location.pathname.split('/').pop() || 'index.html'
      ).toLowerCase();
      const currentHash = (window.location.hash || '').toLowerCase();

      allLinks.forEach((link) => {
        const href = link.getAttribute('href') || '';
        if (!href || href === '#') return;

        const hrefFile = href.split('#')[0].split('/').pop().toLowerCase();
        const hrefHash = href.includes('#')
          ? '#' + href.split('#')[1].toLowerCase()
          : '';

        link.classList.remove('active');
        link.removeAttribute('aria-current');

        const pageMatches =
          hrefFile === currentPath ||
          (currentPath === '' && hrefFile === 'index.html');

        if (pageMatches) {
          if (currentHash) {
            if (hrefHash === currentHash) {
              link.classList.add('active');
              link.setAttribute('aria-current', 'page');
            }
          } else {
            if (!hrefHash) {
              link.classList.add('active');
              link.setAttribute('aria-current', 'page');
            }
          }
        }
      });

      const header = $('.header-nav, header.fixed');
      const anchorLinks = $$('a[href^="#"]:not([href="#"])');

      anchorLinks.forEach((anchor) => {
        if (anchor.__tetuSmoothScrollBound) return;
        anchor.__tetuSmoothScrollBound = true;

        anchor.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href');
          if (!targetId || targetId === '#') return;

          let targetEl = null;
          try {
            targetEl = $(targetId);
          } catch (err) {
            targetEl = null;
          }

          if (targetEl) {
            e.preventDefault();

            const headerHeight = header ? header.offsetHeight : 80;
            const elementPosition = targetEl.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - headerHeight - 16;

            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

            if (navState.isOpen) {
              setTimeout(closeMobileNav, 150);
            }

            if (history.pushState) {
              history.pushState(null, null, targetId);
            }
          }
        });
      });

      if ('IntersectionObserver' in window) {
        const sectionLinks = allLinks.filter((l) => {
          const h = l.getAttribute('href') || '';
          return h.startsWith('#') && h !== '#';
        });

        const sections = sectionLinks
          .map((l) => {
            try {
              return $(l.getAttribute('href'));
            } catch (err) {
              return null;
            }
          })
          .filter(Boolean);

        if (sections.length > 0 && !window.__tetuSectionObserver) {
          window.__tetuSectionObserver = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  const id = '#' + entry.target.getAttribute('id');
                  sectionLinks.forEach((link) => {
                    if (link.getAttribute('href') === id) {
                      allLinks.forEach((l) => l.classList.remove('active'));
                      link.classList.add('active');
                    }
                  });
                }
              });
            },
            { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
          );
          sections.forEach((sec) => window.__tetuSectionObserver.observe(sec));
        }
      }
    }

    // ------------------------------------------------------------------------
    // 12. Public API Export & Rebinding
    // ------------------------------------------------------------------------
    const API = {
      // Motion
      refresh: function () {
        initScrollReveal();
        init3DCardTilt();
        initMagneticButtons();
      },
      config: ANIM_CONFIG,
      version: '1.0.0',

      // Smooth mobile navigation
      mobileNav: {
        open: openMobileNav,
        close: closeMobileNav,
        toggle: toggleMobileNav,
        isOpen: function () {
          return navState.isOpen;
        },
      },

      // Navigation links
      refreshNavigationLinks: initNavigationLinks,
    };

    // ------------------------------------------------------------------------
    // 13. Bootstrapping
    // ------------------------------------------------------------------------
    function init() {
      injectAnimationStyles();
      initScrollReveal();
      initAmbientParticles();
      init3DCardTilt();
      initMagneticButtons();
      initCursorHalo();
      initParallax();

      // Smooth mobile navigation + nav links
      initMobileNavigation();
      initNavigationLinks();

      console.log(
        `%c ${ANIM_CONFIG.brandName} %c Motion + Mobile Nav Ready %c Made by ${ANIM_CONFIG.madeBy} `,
        'background: #d4af37; color: #0b0e15; font-weight: bold; padding: 3px 6px; border-radius: 3px 0 0 3px;',
        'background: #151821; color: #d4af37; padding: 3px 6px;',
        'background: #212532; color: #fff; padding: 3px 6px; border-radius: 0 3px 3px 0;'
      );
    }

    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
    }

    return API;
  }
);