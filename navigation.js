/**
 * ==========================================================================
 * TETU COLLECTION — GLOBAL NAVIGATION & CHROME CONTROLLER (navigation.js)
 * Brand: TETU COLLECTION
 * Atelier / Made by: Bossy designs
 * Contact / WhatsApp Concierge: +254700309655
 * Theme: Luxury Dark Noir & Brushed Warm Gold (#d4af37)
 * ==========================================================================
 *
 * Capabilities:
 * - Dynamic Active Link Resolution (multi-page URL matching & in-page anchors)
 * - Sticky Glassmorphic Header blur transition on scroll
 * - Mobile Navigation Menu Toggle (drawer/dropdown with accessible ARIA)
 * - Smooth In-Page Anchor Scrolling with sticky header offset calculation
 * - WhatsApp Concierge Direct Action formatting & analytics trigger
 * - Scroll Progress Indicator Bar across long catalog pages
 * - Keyboard Accessibility & Escape key to dismiss mobile drawer
 * ==========================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Configuration & Constants
  // --------------------------------------------------------------------------
  const NAV_CONFIG = {
    brandName: 'TETU COLLECTION',
    madeBy: 'Bossy designs',
    phone: '+254700309655',
    phoneRaw: '254700309655',
    scrollThreshold: 40,
    headerSelector: '.header-nav, header.fixed',
    navLinksSelector: '.nav-links',
    mobileToggleSelector: '#mobile-menu-toggle, #mobile-nav-toggle, .mobile-menu-toggle, .mobile-menu-btn',
    mobilePanelSelector: '#mobile-menu-panel, .mobile-menu-panel',
    mobileBackdropSelector: '#mobile-menu-backdrop, .mobile-menu-backdrop',
    progressBarId: 'tetu-nav-progress',
    desktopBreakpoint: 1024,
  };

  // --------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------
  const state = {
    isMobileMenuOpen: false,
  };

  // --------------------------------------------------------------------------
  // DOM Helper Selectors
  // --------------------------------------------------------------------------
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  // --------------------------------------------------------------------------
  // Scroll Progress Bar (Top micro-line indicator in brushed gold)
  // --------------------------------------------------------------------------
  function initProgressBar() {
    let bar = document.getElementById(NAV_CONFIG.progressBarId);
    if (!bar) {
      bar = document.createElement('div');
      bar.id = NAV_CONFIG.progressBarId;
      bar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 2px;
        width: 0%;
        background: linear-gradient(90deg, #d4af37 0%, #f3e5ab 50%, #d4af37 100%);
        box-shadow: 0 0 10px rgba(212, 175, 55, 0.6);
        z-index: 9999;
        transition: width 0.1s ease-out;
        pointer-events: none;
      `;
      document.body.appendChild(bar);
    }

    function updateBar() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight > 0) {
        const percent = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        bar.style.width = percent + '%';
      } else {
        bar.style.width = '0%';
      }
    }

    window.addEventListener('scroll', updateBar, { passive: true });
    updateBar();
  }

  // --------------------------------------------------------------------------
  // Sticky Header Glassmorphic State on Scroll
  // --------------------------------------------------------------------------
  function initHeaderScrollState() {
    const header = $(NAV_CONFIG.headerSelector);
    if (!header) return;

    function handleScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > NAV_CONFIG.scrollThreshold) {
        header.classList.add('scrolled', 'header-scrolled');
        header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.7), 0 1px 0 rgba(212, 175, 55, 0.15)';
      } else {
        header.classList.remove('scrolled', 'header-scrolled');
        header.style.boxShadow = 'none';
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // --------------------------------------------------------------------------
  // Active Navigation Link Detection (Page & Section Anchors)
  // --------------------------------------------------------------------------
  function initActiveLinks() {
    const links = $$(NAV_CONFIG.navLinksSelector + ' a');
    if (!links.length) return;

    const currentPath = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const currentHash = (window.location.hash || '').toLowerCase();

    // 1. Highlight based on current file/page name
    let matchedPage = false;
    links.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const hrefFile = href.split('#')[0].split('/').pop().toLowerCase();

      link.classList.remove('active');
      link.removeAttribute('aria-current');

      if (hrefFile && (hrefFile === currentPath || (currentPath === '' && hrefFile === 'index.html'))) {
        // If there's a hash in the URL, prefer matching that specific section
        if (currentHash && href.toLowerCase().includes(currentHash)) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
          matchedPage = true;
        } else if (!currentHash) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
          matchedPage = true;
        }
      }
    });

    // Default to Home link if nothing matched on the root
    if (!matchedPage && (currentPath === 'index.html' || currentPath === '')) {
      const homeLink = links.find((l) => {
        const h = (l.getAttribute('href') || '').toLowerCase();
        return h === 'index.html' || h === '#' || h.startsWith('#home');
      });
      if (homeLink) {
        homeLink.classList.add('active');
        homeLink.setAttribute('aria-current', 'page');
      }
    }

    // 2. IntersectionObserver for single-page anchor sections
    const sectionLinks = links.filter((l) => {
      const h = l.getAttribute('href') || '';
      return h.startsWith('#') && h !== '#';
    });

    if (sectionLinks.length > 0 && 'IntersectionObserver' in window) {
      const sections = sectionLinks
        .map((l) => {
          try {
            return $(l.getAttribute('href'));
          } catch (err) {
            return null;
          }
        })
        .filter((sec) => sec !== null);

      if (sections.length > 0) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const id = '#' + entry.target.getAttribute('id');
                sectionLinks.forEach((link) => {
                  if (link.getAttribute('href') === id) {
                    links.forEach((l) => l.classList.remove('active'));
                    link.classList.add('active');
                  }
                });
              }
            });
          },
          { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
        );

        sections.forEach((sec) => observer.observe(sec));
      }
    }
  }

  // --------------------------------------------------------------------------
  // Smooth Scroll with Sticky Header Offset
  // --------------------------------------------------------------------------
  function initSmoothScroll() {
    const anchorLinks = $$('a[href^="#"]:not([href="#"])');
    const header = $(NAV_CONFIG.headerSelector);

    anchorLinks.forEach((anchor) => {
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
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 16;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });

          // Close mobile menu if open
          closeMobileNav();

          // Push hash to history without jump
          if (history.pushState) {
            history.pushState(null, null, targetId);
          }
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // Mobile Navigation Drawer Toggle & Accessibility
  // --------------------------------------------------------------------------
  function getMobileElements() {
    return {
      toggle: $(NAV_CONFIG.mobileToggleSelector),
      panel: $(NAV_CONFIG.mobilePanelSelector),
      backdrop: $(NAV_CONFIG.mobileBackdropSelector),
      navLinks: $(NAV_CONFIG.navLinksSelector),
    };
  }

  function openMobileNav() {
    const { toggle, panel, backdrop } = getMobileElements();

    // Support both the new panel-based mobile menu and legacy .nav-open class
    if (panel) {
      panel.classList.remove('-translate-x-full');
      panel.classList.add('translate-x-0', 'open');
    }
    if (backdrop) {
      backdrop.classList.remove('hidden');
      backdrop.classList.add('open');
    }
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'true');
      toggle.classList.add('is-active');
      // Swap hamburger icon to close
      const icon = toggle.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = 'close';
    }

    // Legacy fallback
    const navLinksList = $('.nav-links');
    if (navLinksList && !panel) {
      navLinksList.classList.add('nav-open');
    }

    document.body.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
    state.isMobileMenuOpen = true;
  }

  function closeMobileNav() {
    const { toggle, panel, backdrop } = getMobileElements();

    if (panel) {
      panel.classList.add('-translate-x-full');
      panel.classList.remove('translate-x-0', 'open');
    }
    if (backdrop) {
      backdrop.classList.add('hidden');
      backdrop.classList.remove('open');
    }
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('is-active');
      // Swap close icon back to hamburger
      const icon = toggle.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = 'menu';
    }

    // Legacy fallback
    const navLinksList = $('.nav-links');
    if (navLinksList) {
      navLinksList.classList.remove('nav-open');
    }

    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
    state.isMobileMenuOpen = false;
  }

  function initMobileMenu() {
    const { toggle, panel, backdrop, navLinks } = getMobileElements();

    if (!toggle && !panel) return;

    // Set accessibility attributes
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', 'mobile-menu-panel');

      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (state.isMobileMenuOpen) {
          closeMobileNav();
        } else {
          openMobileNav();
        }
      });
    }

    // Backdrop click closes menu
    if (backdrop) {
      backdrop.addEventListener('click', closeMobileNav);
    }

    // Close when clicking a link inside the panel
    if (panel) {
      const panelLinks = panel.querySelectorAll('a');
      panelLinks.forEach((link) => {
        link.addEventListener('click', () => {
          // Delay to allow smooth navigation
          setTimeout(closeMobileNav, 150);
        });
      });
    }

    // Legacy: also handle nav link clicks if no panel exists
    if (navLinks && !panel) {
      navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          if (window.innerWidth <= NAV_CONFIG.desktopBreakpoint) {
            setTimeout(closeMobileNav, 150);
          }
        });
      });
    }

    // Click outside closes menu (legacy support)
    document.addEventListener('click', (e) => {
      if (!state.isMobileMenuOpen) return;
      if (toggle && toggle.contains(e.target)) return;
      if (panel && panel.contains(e.target)) return;
      if (navLinks && navLinks.contains(e.target)) return;
      closeMobileNav();
    });

    // Escape key closes menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.isMobileMenuOpen) {
        closeMobileNav();
      }
    });

    // Restore scroll and close menu when resizing to desktop
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth >= NAV_CONFIG.desktopBreakpoint) {
          closeMobileNav();
          document.body.style.overflow = '';
        }
      }, 150);
    });
  }

  // --------------------------------------------------------------------------
  // WhatsApp Direct Concierge Integration (+254700309655)
  // --------------------------------------------------------------------------
  function initWhatsAppConcierge() {
    const ctaButtons = $$('.nav-whatsapp-cta, .btn-concierge-nav, a[href*="wa.me"]');

    ctaButtons.forEach((btn) => {
      const currentHref = btn.getAttribute('href');
      if (!currentHref || currentHref === '#' || currentHref === '') {
        const defaultMsg = encodeURIComponent(
          `Hello TETU COLLECTION (+254700309655),\nI am enquiring about bespoke leather footwear and evening bags from your atelier.\n\nMade by Bossy designs`
        );
        btn.setAttribute('href', `https://wa.me/${NAV_CONFIG.phoneRaw}?text=${defaultMsg}`);
        btn.setAttribute('target', '_blank');
        btn.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  // --------------------------------------------------------------------------
  // Public API Export (Optional for global window access)
  // --------------------------------------------------------------------------
  window.TetuNavigation = {
    open: openMobileNav,
    close: closeMobileNav,
    toggle: function () {
      if (state.isMobileMenuOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    },
    refreshActiveState: initActiveLinks,
    isOpen: function () {
      return state.isMobileMenuOpen;
    },
    config: NAV_CONFIG,
  };

  // --------------------------------------------------------------------------
  // Bootstrapping
  // --------------------------------------------------------------------------
  function init() {
    initProgressBar();
    initHeaderScrollState();
    initActiveLinks();
    initSmoothScroll();
    initMobileMenu();
    initWhatsAppConcierge();

    console.log(
      `%c ${NAV_CONFIG.brandName} %c Navigation Loaded %c Made by ${NAV_CONFIG.madeBy} `,
      'background: #d4af37; color: #0b0e15; font-weight: bold; padding: 3px 6px; border-radius: 3px 0 0 3px;',
      'background: #151821; color: #d4af37; padding: 3px 6px;',
      'background: #212532; color: #fff; padding: 3px 6px; border-radius: 0 3px 3px 0;'
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();