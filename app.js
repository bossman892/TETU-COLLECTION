/* TETU COLLECTION consolidated application bundle */

(function () {
  'use strict';
  function addMobileWhatsAppButton() {
    if (document.getElementById('mobile-whatsapp-button')) return;
    const button = document.createElement('a');
    button.id = 'mobile-whatsapp-button';
    button.className = 'mobile-whatsapp-button';
    button.href = 'https://wa.me/254700309655?text=' + encodeURIComponent(
      'Hello TETU COLLECTION, I would like to enquire about your bespoke collection.'
    );
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    button.setAttribute('aria-label', 'Contact TETU COLLECTION on WhatsApp');
    button.innerHTML = '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z"/><path d="M8.5 9.2c.3 2 2.3 4 4.3 4.3l1.2-.8 1.5.7c.3.2.3.6.1.9-.5.7-1.4 1-2.3.8-3.6-.9-5.2-2.5-5.9-5.2-.2-.9.1-1.8.8-2.3.3-.2.7-.2.9.1l.7 1.5-.8 1.2Z"/></svg><span>WhatsApp</span>';
    document.body.appendChild(button);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addMobileWhatsAppButton);
  } else {
    addMobileWhatsAppButton();
  }
})();

/* config.js */
﻿/**
 * ==========================================================================
 * TETU COLLECTION â€” GLOBAL CONFIGURATION & ENVIRONMENT SETUP (config.js)
 * Brand: TETU COLLECTION
 * Atelier / Made by: Bossy designs
 * Contact / WhatsApp Concierge: +254700309655
 * Theme: Luxury Dark Noir & Brushed Warm Gold (#d4af37)
 * ==========================================================================
 *
 * Capabilities:
 * - Centralized atelier branding, phone numbers, and WhatsApp concierge formatting
 * - Design tokens & color hex constants (Noir, Gold, Midnight Navy)
 * - Navigation links & route mappings across index.html, new-arrivals.html,
 *   evening-luxury.html, reviews.html, contact.html
 * - Smooth mobile navigation config (drawer, breakpoint, animation timings)
 * - Product catalog default schema, categories (footwear vs. bags)
 * - Storage keys, animation timings, audio paths, and toast notification defaults
 * - Safe frozen immutable export for window.TETU_CONFIG
 * ==========================================================================
 */

(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && typeof module.exports === 'object') {
    // CommonJS / Node environment
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD environment
    define([], factory);
  } else {
    // Browser environment: attach to global window
    root.TETU_CONFIG = factory();
  }
})(
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof window !== 'undefined'
    ? window
    : this,
  function () {
    'use strict';

    /**
     * Deep freeze utility to prevent accidental runtime mutations
     * to core brand constants or styling configuration.
     */
    function deepFreeze(obj) {
      Object.keys(obj).forEach((prop) => {
        const value = obj[prop];
        if (
          value !== null &&
          (typeof value === 'object' || typeof value === 'function') &&
          !Object.isFrozen(value)
        ) {
          deepFreeze(value);
        }
      });
      return Object.freeze(obj);
    }

    const CONFIG = {
      // ----------------------------------------------------------------------
      // 1. Atelier & Brand Identity
      // ----------------------------------------------------------------------
      brand: {
        name: 'TETU COLLECTION',
        shortName: 'TETU',
        monogram: 'TC',
        tagline: 'Handcrafted Luxury Footwear & Evening Maroquinerie',
        subtext: 'Bespoke Atelier Craft',
        madeBy: 'Bossy designs',
        origin: 'Kenya',
        headquarters: 'Nairobi, Kenya',
        copyrightYear: 2026,
        copyrightNotice: 'Copyright 2026 Tetu Collection made by Bossy designs',
        social: {
          tiktok:
            'https://www.tiktok.com/@tetucollection',
          instagram: 'https://www.instagram.com/tetucollection',
        },
      },

      // ----------------------------------------------------------------------
      // 2. Direct WhatsApp Concierge & Contact
      // ----------------------------------------------------------------------
      contact: {
        phoneDisplay: '+254700309655',
        phoneRaw: '254700309655', // Normalized for wa.me URL generation
        countryCode: '+254',
        whatsappBaseUrl: 'https://wa.me/254700309655',
        emailDisplay: 'tetucollection1@gmail.com',
        emailRaw: 'tetucollection1@gmail.com',
        hours: {
          weekdays: 'Mon â€“ Fri: 8:00 AM â€“ 7:00 PM',
          weekends: 'Sat â€“ Sun: 10:00 AM â€“ 6:00 PM',
        },
        defaultEnquiryMessage:
          'Hello TETU COLLECTION (+254700309655),\nI would like to enquire about bespoke leather footwear and evening bags from your atelier.\n\nMade by Bossy designs',
        orderMessageTemplate: (productName, variant = '') =>
          `Hello TETU COLLECTION,\n\nI am interested in acquiring the bespoke piece: "${productName}"${
            variant ? ` (Finish: ${variant})` : ''
          }.\nPlease advise on availability, sizing, and payment details.\n\n(+254700309655 â€¢ Made by Bossy designs)`,
        reviewMessageTemplate: ({ name, location, piece, rating, comment }) =>
          `Hello TETU COLLECTION (+254700309655),\n\nI would like to share my bespoke client feedback:\nâ€¢ Client: ${
            name || 'Anonymous Client'
          }\nâ€¢ Location: ${location || 'Kenya'}\nâ€¢ Piece Owned: ${piece}\nâ€¢ Rating: ${'â˜…'.repeat(
            rating || 5
          )} (${rating || 5}/5)\nâ€¢ Feedback: ${
            comment || 'Exceptional craftsmanship by Bossy designs!'
          }\n\nMade by Bossy designs`,
        contactMessageTemplate: ({ name, phone, interest, message }) =>
          `Hello TETU COLLECTION,\n\n*Name:* ${name}\n${
            phone ? `*Phone:* ${phone}\n` : ''
          }*Interest:* ${interest}\n\n*Message:*\n"${message}"\n\nSent from TETU COLLECTION website â€¢ Made by Bossy designs`,
      },

      // ----------------------------------------------------------------------
      // 3. Navigation Map & Page Registry (Smooth Mobile Nav + Links)
      // ----------------------------------------------------------------------
      routes: [
        { id: 'home', title: 'Home', path: 'index.html', anchor: '#home' },
        { id: 'new_arrivals', title: 'New Arrivals', path: 'new-arrival.html', anchor: '#new-arrivals' },
        { id: 'evening', title: 'Evening Luxury', path: 'evening-luxury.html', anchor: '#vault-collection' },
        { id: 'reviews', title: 'Reviews', path: 'review.html', anchor: '#reviews-top' },
        { id: 'contact', title: 'Contact', path: 'contact.html', anchor: '#contact' },
      ],

      // Primary navigation links (used by header + mobile menu)
      navLinks: [
        { id: 'home', title: 'Home', href: 'index.html', active: true },
        { id: 'new_arrivals', title: 'New Arrivals', href: 'new-arrival.html' },
        { id: 'evening', title: 'Evening Luxury', href: 'evening-luxury.html' },
        { id: 'reviews', title: 'Reviews', href: 'review.html' },
        { id: 'contact', title: 'Contact', href: 'contact.html' },
      ],

      // ----------------------------------------------------------------------
      // 4. Smooth Mobile Navigation Configuration
      // ----------------------------------------------------------------------
      mobileNav: {
        breakpoint: 1024, // px â€” menu collapses below this width
        toggleSelector: '#mobile-menu-toggle, #mobile-nav-toggle, .mobile-menu-toggle, .mobile-menu-btn',
        panelSelector: '#mobile-menu-panel, .mobile-menu-panel',
        backdropSelector: '#mobile-menu-backdrop, .mobile-menu-backdrop',
        navLinksSelector: '.nav-links',
        animationDuration: 300, // ms â€” must match CSS transition
        slideClass: 'translate-x-full',
        openClass: 'open',
        bodyLockClass: 'menu-open',
        iconOpen: 'close',
        iconClosed: 'menu',
        closeOnLinkClick: true,
        closeOnResize: true,
        closeOnEscape: true,
        closeOnBackdropClick: true,
      },

      // ----------------------------------------------------------------------
      // 5. Design System Tokens & Color Palette
      // ----------------------------------------------------------------------
      theme: {
        mode: 'dark',
        colors: {
          gold: {
            primary: '#d4af37',
            hover: '#e5c158',
            subtle: '#caa12c',
            dim: 'rgba(212, 175, 55, 0.15)',
            border: 'rgba(212, 175, 55, 0.28)',
            glow: 'rgba(212, 175, 55, 0.40)',
          },
          noir: {
            obsidian: '#07090e',
            surfaceDim: '#0b0e15',
            surface: '#10131a',
            surfaceCard: '#151821',
            surfaceContainer: '#191c26',
            surfaceHigh: '#212532',
          },
          text: {
            main: '#f5f5f7',
            muted: '#9ba1b0',
            dim: '#646a7a',
            gold: '#e6c56b',
          },
          border: {
            subtle: 'rgba(255, 255, 255, 0.07)',
            gold: 'rgba(212, 175, 55, 0.25)',
            goldFocus: 'rgba(212, 175, 55, 0.60)',
          },
        },
        typography: {
          fontSerif:
            "'Bodoni Moda', 'Playfair Display', Didot, 'Cinzel', Georgia, serif",
          fontSans:
            "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
        borderRadius: {
          sm: '4px',
          md: '8px',
          lg: '16px',
          xl: '24px',
          pill: '9999px',
        },
      },

      // ----------------------------------------------------------------------
      // 6. Product Categories & Atelier Defaults
      // ----------------------------------------------------------------------
      catalog: {
        categories: [
          { id: 'all', label: 'All Pieces' },
          { id: 'footwear', label: 'Handcrafted Footwear' },
          { id: 'bags', label: 'Evening Bags & Maroquinerie' },
          { id: 'blacktie', label: 'Black Tie Edition' },
        ],
        defaultPieces: [
          { id: 'tc-slide-tan-h', name: 'Tan H-Strap Leather Slide', category: 'footwear' },
          { id: 'tc-slide-noir-h', name: 'Midnight Noir Cutout Slide', category: 'footwear' },
          { id: 'tc-slide-gold-chain', name: 'Monogram Gold-Chain Slide', category: 'footwear' },
          { id: 'tc-slide-amber-toe', name: 'Amber Cognac Toe-Loop Sandal', category: 'footwear' },
          { id: 'tc-slide-pearl-rose', name: 'Rose Gold Beaded Pearl Slide', category: 'footwear' },
          { id: 'tc-slide-sun-yellow', name: 'Sunburst Yellow Atelier Slide', category: 'footwear' },
          { id: 'tc-slide-crimson', name: 'Imperial Red Cutout Slide', category: 'footwear' },
          { id: 'tc-slide-ivory-weave', name: 'Ivory Textured Cross Slide', category: 'footwear' },
          { id: 'tc-slide-onyx-chain', name: 'Onyx Curb Chain Leather Slide', category: 'footwear' },
          { id: 'tc-slide-chromatic', name: 'Chromatic Metallic Gilded Slide', category: 'footwear' },
          { id: 'tc-slide-gilded-python', name: 'Gilded Python Evening Slide', category: 'footwear' },
          { id: 'tc-bag-crescent-ivory', name: 'Ivory Sculpted Crescent Bag', category: 'bags' },
          { id: 'tc-bag-tote-cognac', name: 'Cognac Hand-Stitched Leather Tote', category: 'bags' },
          { id: 'tc-bag-tote-noir', name: 'Noir Classic Atelier Shoulder Bag', category: 'bags' },
          { id: 'tc-bag-hobo-noir', name: 'Obsidian Noir Curved Shoulder Bag', category: 'bags' },
          { id: 'tc-bag-clutch-chevron', name: 'Woven Amber Chevron Tote', category: 'bags' },
          { id: 'tc-bag-nocturne-croc', name: 'Nocturne Croc Pochette', category: 'bags' },
          { id: 'tc-bag-alabaster-crescent', name: 'Alabaster Evening Crescent', category: 'bags' },
        ],
      },

      // ----------------------------------------------------------------------
      // 7. Persistence & Storage Keys
      // ----------------------------------------------------------------------
      storage: {
        reviewsKey: 'tetu_collection_reviews_v1',
        cartKey: 'tetu_collection_enquiries_v1',
        themeKey: 'tetu_theme_preference_v1',
      },

      // ----------------------------------------------------------------------
      // 8. Interactive UI & Animation Constants
      // ----------------------------------------------------------------------
      ui: {
        scrollThreshold: 40,
        toastDuration: 4000,
        animationSpeed: 300,
        ratingDescriptions: {
          1: '1 Star â€” Needs Improvement',
          2: '2 Stars â€” Fair Craftsmanship',
          3: '3 Stars â€” Good Bespoke Quality',
          4: '4 Stars â€” Highly Impressed',
          5: '5 Stars â€” Exceptional Luxury',
        },
      },

      // ----------------------------------------------------------------------
      // 9. Helper Methods
      // ----------------------------------------------------------------------
      helpers: {
        /**
         * Build a wa.me URL with a pre-filled message.
         * @param {string} text - Message body
         * @returns {string} Full WhatsApp URL
         */
        buildWhatsAppUrl: function (text) {
          const phone = CONFIG.contact.phoneRaw;
          const safeText = (text == null ? '' : String(text)).trim();
          return `https://wa.me/${phone}?text=${encodeURIComponent(safeText)}`;
        },

        /**
         * Build a wa.me URL from a WhatsApp message template function.
         * @param {Function} templateFn - Template function receiving data
         * @param {object} data - Data to pass to the template
         * @returns {string} Full WhatsApp URL
         */
        buildWhatsAppFromTemplate: function (templateFn, data) {
          if (typeof templateFn !== 'function') {
            return CONFIG.helpers.buildWhatsAppUrl(
              CONFIG.contact.defaultEnquiryMessage
            );
          }
          const msg = templateFn(data || {});
          return CONFIG.helpers.buildWhatsAppUrl(msg);
        },

        /**
         * Generate initials from a name for review avatars.
         * @param {string} name
         * @returns {string} Uppercase initials (2 chars max)
         */
        formatReviewInitial: function (name) {
          if (!name) return 'TC';
          const parts = String(name).trim().split(/\s+/).filter(Boolean);
          if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
          }
          return String(name).slice(0, 2).toUpperCase();
        },

        /**
         * Get the current page's filename (e.g. "index.html").
         * @returns {string}
         */
        getCurrentPage: function () {
          const path = window.location.pathname.split('/').pop();
          return (path || 'index.html').toLowerCase();
        },

        /**
         * Get the current URL hash (e.g. "#hero").
         * @returns {string}
         */
        getCurrentHash: function () {
          return (window.location.hash || '').toLowerCase();
        },

        /**
         * Detect if we're on a touch device (coarse pointer).
         * @returns {boolean}
         */
        isTouchDevice: function () {
          return (
            typeof window !== 'undefined' &&
            ('ontouchstart' in window ||
              (window.matchMedia &&
                window.matchMedia('(hover: none) and (pointer: coarse)').matches))
          );
        },

        /**
         * Detect if the current viewport is mobile (below nav breakpoint).
         * @returns {boolean}
         */
        isMobileViewport: function () {
          if (typeof window === 'undefined') return false;
          return window.innerWidth < CONFIG.mobileNav.breakpoint;
        },

        /**
         * Escape a string for safe HTML insertion.
         * @param {string} str
         * @returns {string}
         */
        escapeHTML: function (str) {
          if (str == null) return '';
          return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
        },

        /**
         * Find a route by its id.
         * @param {string} id
         * @returns {object|null}
         */
        getRouteById: function (id) {
          if (!id) return null;
          return CONFIG.routes.find((r) => r.id === id) || null;
        },

        /**
         * Find a nav link by its id.
         * @param {string} id
         * @returns {object|null}
         */
        getNavLinkById: function (id) {
          if (!id) return null;
          return CONFIG.navLinks.find((l) => l.id === id) || null;
        },

        /**
         * Build a href from a route id (e.g. "home" -> "index.html#home").
         * @param {string} id
         * @returns {string}
         */
        buildRouteHref: function (id) {
          const route = CONFIG.helpers.getRouteById(id);
          if (!route) return '#';
          const hash = route.anchor && route.anchor !== '#' ? route.anchor : '';
          return `${route.path}${hash}`;
        },
      },
    };

    return deepFreeze(CONFIG);
  }
);



/* whatsapp.js */
﻿/**
 * ==========================================================================
 * TETU COLLECTION â€” WHATSAPP CONCIERGE CONTROLLER (whatsapp.js)
 * Brand: TETU COLLECTION
 * Atelier / Made by: Bossy designs
 * Contact / WhatsApp Concierge: +254700309655
 * Theme: Luxury Dark Noir & Brushed Warm Gold (#d4af37)
 * ==========================================================================
 *
 * Capabilities:
 * - Unified WhatsApp Concierge API for the entire site
 * - Auto-binds all [data-wa], .btn-enquire-whatsapp, [data-enquire-product]
 * - Product enquiry, contact form, review, bespoke commission templates
 * - Reads phone number & templates from window.TETU_CONFIG when available
 * - Safe URL builder with proper encoding
 * - Toast notification feedback on click (if main.js toast is present)
 * - Opens WhatsApp in a new tab (mobile app or web)
 * - Smooth Mobile Navigation (drawer toggle, backdrop, body scroll lock)
 * - Navigation Link Handling (active state, smooth scroll, mobile close)
 * ==========================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Fallback Config (used if config.js is not loaded)
  // --------------------------------------------------------------------------
  const FALLBACK = {
    phoneRaw: '254700309655',
    phoneDisplay: '+254700309655',
    brandName: 'TETU COLLECTION',
    madeBy: 'Bossy designs',
    defaultEnquiry:
      'Hello TETU COLLECTION (+254700309655),\nI would like to enquire about bespoke leather footwear and evening bags from your atelier.\n\nMade by Bossy designs',
  };

  // --------------------------------------------------------------------------
  // Resolve Config Safely
  // --------------------------------------------------------------------------
  function getConfig() {
    const cfg = (typeof window !== 'undefined' && window.TETU_CONFIG) || null;
    return {
      phoneRaw:
        (cfg && cfg.contact && cfg.contact.phoneRaw) || FALLBACK.phoneRaw,
      phoneDisplay:
        (cfg && cfg.contact && cfg.contact.phoneDisplay) ||
        FALLBACK.phoneDisplay,
      brandName: (cfg && cfg.brand && cfg.brand.name) || FALLBACK.brandName,
      madeBy: (cfg && cfg.brand && cfg.brand.madeBy) || FALLBACK.madeBy,
      defaultEnquiry:
        (cfg && cfg.contact && cfg.contact.defaultEnquiryMessage) ||
        FALLBACK.defaultEnquiry,
      orderTemplate:
        (cfg && cfg.contact && cfg.contact.orderMessageTemplate) || null,
      reviewTemplate:
        (cfg && cfg.contact && cfg.contact.reviewMessageTemplate) || null,
      contactTemplate:
        (cfg && cfg.contact && cfg.contact.contactMessageTemplate) || null,
      mobileNav:
        (cfg && cfg.mobileNav) || {
          breakpoint: 1024,
          toggleSelector:
            '#mobile-menu-toggle, #mobile-nav-toggle, .mobile-menu-toggle, .mobile-menu-btn',
          panelSelector: '#mobile-menu-panel, .mobile-menu-panel',
          backdropSelector: '#mobile-menu-backdrop, .mobile-menu-backdrop',
          navLinksSelector: '.nav-links',
          animationDuration: 300,
          bodyLockClass: 'menu-open',
          iconOpen: 'close',
          iconClosed: 'menu',
        },
    };
  }

  // --------------------------------------------------------------------------
  // DOM Helpers
  // --------------------------------------------------------------------------
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // --------------------------------------------------------------------------
  // Core URL Builder
  // --------------------------------------------------------------------------
  function buildWhatsAppUrl(message) {
    const { phoneRaw } = getConfig();
    const safeText = (message == null ? '' : String(message)).trim();
    return `https://wa.me/${phoneRaw}?text=${encodeURIComponent(safeText)}`;
  }

  // --------------------------------------------------------------------------
  // Toast Feedback (uses main.js toast if available, else silent)
  // --------------------------------------------------------------------------
  function notify(message, isSuccess) {
    if (typeof window.showTetuToast === 'function') {
      try {
        window.showTetuToast(message, isSuccess !== false);
        return;
      } catch (e) {
        /* fall through */
      }
    }
    const existing = document.getElementById('tetu-toast');
    if (existing) {
      const icon = isSuccess === false ? 'âš ' : 'âœ¦';
      existing.innerHTML =
        '<span style="color:#d4af37;font-weight:bold;">' +
        icon +
        '</span> <span>' +
        String(message) +
        '</span>';
      existing.style.opacity = '1';
      existing.style.transform = 'translateY(0)';
      clearTimeout(existing._timeout);
      existing._timeout = setTimeout(() => {
        existing.style.opacity = '0';
        existing.style.transform = 'translateY(15px)';
      }, 4000);
    }
  }

  // --------------------------------------------------------------------------
  // Open WhatsApp in a New Tab
  // --------------------------------------------------------------------------
  function openWhatsApp(message) {
    const url = buildWhatsAppUrl(message);
    try {
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (!win) {
        window.location.href = url;
      }
    } catch (e) {
      window.location.href = url;
    }
    notify('Opening WhatsApp Conciergeâ€¦', true);
    return url;
  }

  // ==========================================================================
  // SMOOTH MOBILE NAVIGATION
  // ==========================================================================
  const navState = { isOpen: false };

  function getNavElements() {
    const cfg = getConfig();
    return {
      toggle: $(cfg.mobileNav.toggleSelector),
      panel: $(cfg.mobileNav.panelSelector),
      backdrop: $(cfg.mobileNav.backdropSelector),
      navLinks: $(cfg.mobileNav.navLinksSelector),
      breakpoint: cfg.mobileNav.breakpoint,
      bodyLockClass: cfg.mobileNav.bodyLockClass,
      iconOpen: cfg.mobileNav.iconOpen,
      iconClosed: cfg.mobileNav.iconClosed,
    };
  }

  function openMobileNav() {
    const els = getNavElements();
    if (!els.panel) return;

    // Slide the panel in
    els.panel.classList.remove('translate-x-full');
    els.panel.classList.add('translate-x-0', 'open');
    els.panel.setAttribute('aria-hidden', 'false');

    // Show backdrop
    if (els.backdrop) {
      els.backdrop.classList.remove('hidden');
      els.backdrop.classList.add('open');
    }

    // Update toggle state + icon
    if (els.toggle) {
      els.toggle.setAttribute('aria-expanded', 'true');
      els.toggle.classList.add('is-active');
    }

    // Lock body scroll
    document.body.classList.add(els.bodyLockClass);
    document.body.style.overflow = 'hidden';
    navState.isOpen = true;
  }

  function closeMobileNav() {
    const els = getNavElements();
    if (!els.panel) return;

    // Slide the panel out
    els.panel.classList.add('translate-x-full');
    els.panel.classList.remove('translate-x-0', 'open');
    els.panel.setAttribute('aria-hidden', 'true');

    // Hide backdrop
    if (els.backdrop) {
      els.backdrop.classList.add('hidden');
      els.backdrop.classList.remove('open');
    }

    // Update toggle state + icon
    if (els.toggle) {
      els.toggle.setAttribute('aria-expanded', 'false');
      els.toggle.classList.remove('is-active');
    }

    // Unlock body scroll
    document.body.classList.remove(els.bodyLockClass);
    document.body.style.overflow = '';
    navState.isOpen = false;
  }

  function toggleMobileNav() {
    if (navState.isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  function initMobileNavigation() {
    const els = getNavElements();
    if (!els.toggle && !els.panel) return;

    // Set accessibility attributes
    if (els.toggle) {
      els.toggle.setAttribute('aria-expanded', 'false');
      els.toggle.setAttribute('aria-controls', 'mobile-menu-panel');

      els.toggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileNav();
      });
    }

    // Backdrop click closes
    if (els.backdrop) {
      els.backdrop.addEventListener('click', closeMobileNav);
    }

    // Clicking a link inside the panel closes the drawer smoothly
    if (els.panel) {
      els.panel.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', function () {
          setTimeout(closeMobileNav, 150);
        });
      });
    }

    // Escape key closes
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navState.isOpen) {
        closeMobileNav();
      }
    });

    // Resize: auto-close when crossing to desktop
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

  // ==========================================================================
  // NAVIGATION LINKS â€” Active state + smooth scroll
  // ==========================================================================
  function initNavigationLinks() {
    const cfg = getConfig();
    const desktopLinks = $$(cfg.mobileNav.navLinksSelector + ' a');
    const mobileLinks = $$(cfg.mobileNav.panelSelector + ' a');
    const allLinks = desktopLinks.concat(mobileLinks);

    if (!allLinks.length) return;

    // ---------- 1. Active state based on current page ----------
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
        // If URL has a hash, only highlight if the hash matches
        if (currentHash) {
          if (hrefHash === currentHash) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          }
        } else {
          // No hash â†’ highlight the base page link
          if (!hrefHash) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          }
        }
      }
    });

    // ---------- 2. Smooth scroll for in-page anchors ----------
    const header = $('.header-nav, header.fixed');
    const anchorLinks = $$('a[href^="#"]:not([href="#"])');

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
          const offsetPosition =
            elementPosition + window.pageYOffset - headerHeight - 16;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });

          // Close mobile nav smoothly
          if (navState.isOpen) {
            setTimeout(closeMobileNav, 150);
          }

          if (history.pushState) {
            history.pushState(null, null, targetId);
          }
        }
      });
    });

    // ---------- 3. IntersectionObserver for active section highlight ----------
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

      if (sections.length > 0) {
        const observer = new IntersectionObserver(
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
        sections.forEach((sec) => observer.observe(sec));
      }
    }
  }

  // --------------------------------------------------------------------------
  // Template: Product Enquiry
  // --------------------------------------------------------------------------
  function productEnquiryMessage(productName, variant) {
    const cfg = getConfig();
    if (typeof cfg.orderTemplate === 'function') {
      try {
        return cfg.orderTemplate(productName, variant || '');
      } catch (e) {
        /* fallback below */
      }
    }
    return (
      `Hello TETU COLLECTION,\n\nI am interested in acquiring the bespoke piece: "${productName}"` +
      (variant ? ` (Finish: ${variant})` : '') +
      `.\nPlease advise on availability, sizing, and payment details.\n\n(${cfg.phoneDisplay} â€¢ Made by ${cfg.madeBy})`
    );
  }

  // --------------------------------------------------------------------------
  // Template: Review Submission
  // --------------------------------------------------------------------------
  function reviewMessage(data) {
    const cfg = getConfig();
    if (typeof cfg.reviewTemplate === 'function') {
      try {
        return cfg.reviewTemplate(data || {});
      } catch (e) {
        /* fallback below */
      }
    }
    const d = data || {};
    const rating = d.rating || 5;
    const stars = 'â˜…'.repeat(rating) + ` (${rating}/5)`;
    return (
      `Hello TETU COLLECTION (${cfg.phoneDisplay}),\n\n` +
      `I would like to share my bespoke client feedback:\n` +
      `â€¢ Client: ${d.name || 'Anonymous Client'}\n` +
      `â€¢ Location: ${d.location || 'Kenya'}\n` +
      `â€¢ Piece Owned: ${d.piece || 'TETU COLLECTION Piece'}\n` +
      `â€¢ Rating: ${stars}\n` +
      `â€¢ Feedback: ${d.comment || 'Exceptional craftsmanship by Bossy designs!'}\n\n` +
      `Made by ${cfg.madeBy}`
    );
  }

  // --------------------------------------------------------------------------
  // Template: Contact / Bespoke Commission
  // --------------------------------------------------------------------------
  function contactMessage(data) {
    const cfg = getConfig();
    if (typeof cfg.contactTemplate === 'function') {
      try {
        return cfg.contactTemplate(data || {});
      } catch (e) {
        /* fallback below */
      }
    }
    const d = data || {};
    return (
      `Hello TETU COLLECTION,\n\n` +
      `*Name:* ${d.name || 'Client'}\n` +
      (d.phone ? `*Phone:* ${d.phone}\n` : '') +
      `*Interest:* ${d.interest || 'TETU COLLECTION Piece'}\n\n` +
      `*Message:*\n"${d.message || 'I would like to enquire about bespoke leather pieces.'}"\n\n` +
      `Sent from TETU COLLECTION website â€¢ Made by ${cfg.madeBy}`
    );
  }

  // --------------------------------------------------------------------------
  // Auto-Bind: [data-wa] Elements
  // --------------------------------------------------------------------------
  function bindDataWaElements() {
    const nodes = $$('[data-wa], .btn-enquire-whatsapp, [data-enquire-product]');
    if (!nodes.length) return;

    nodes.forEach((el) => {
      if (el.__tetuWaBound) return;
      el.__tetuWaBound = true;

      el.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const explicit = el.getAttribute('data-wa');
        const product =
          el.getAttribute('data-wa-product') ||
          el.getAttribute('data-enquire-product') ||
          el.closest('.product-card')?.querySelector('.product-title')?.textContent?.trim() ||
          el.closest('.vault-item')?.querySelector('.font-headline-sm')?.textContent?.trim() ||
          el.closest('article')?.querySelector('h3')?.textContent?.trim() ||
          null;

        const variant = el.getAttribute('data-wa-variant') || '';

        let message;
        if (explicit && explicit.trim()) {
          message = explicit.trim();
        } else if (product) {
          message = productEnquiryMessage(product, variant);
        } else {
          message = getConfig().defaultEnquiry;
        }

        openWhatsApp(message);
      });
    });
  }

  // --------------------------------------------------------------------------
  // Auto-Bind: Contact Form
  // --------------------------------------------------------------------------
  function bindContactForm() {
    const forms = [
      document.getElementById('contact-form'),
      document.getElementById('enquire-form'),
    ].filter(Boolean);

    if (!forms.length) return;

    forms.forEach((form) => {
      if (form.__tetuWaBound) return;
      form.__tetuWaBound = true;

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nameEl =
          form.querySelector('[name="name"]') ||
          document.getElementById('contact-name');
        const phoneEl =
          form.querySelector('[name="phone"]') ||
          document.getElementById('contact-phone');
        const interestEl =
          form.querySelector('[name="piece"]') ||
          form.querySelector('[name="interest"]') ||
          document.getElementById('contact-interest');
        const msgEl =
          form.querySelector('[name="message"]') ||
          document.getElementById('contact-message');

        const name = nameEl ? nameEl.value.trim() : '';
        const phone = phoneEl ? phoneEl.value.trim() : '';
        const interest = interestEl ? interestEl.value : 'TETU COLLECTION Piece';
        const message = msgEl ? msgEl.value.trim() : '';

        if (!name || !message) {
          notify('Please complete all required fields before sending.', false);
          if (!name && nameEl) nameEl.focus();
          else if (!message && msgEl) msgEl.focus();
          return;
        }

        openWhatsApp(contactMessage({ name, phone, interest, message }));
      });
    });
  }

  // --------------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------------
  const TetuWhatsApp = {
    // ---------- WhatsApp core ----------
    buildUrl: buildWhatsAppUrl,
    open: openWhatsApp,
    product: productEnquiryMessage,
    review: reviewMessage,
    contact: contactMessage,
    enquireProduct: function (productName, variant) {
      return openWhatsApp(productEnquiryMessage(productName, variant));
    },
    sendReview: function (data) {
      return openWhatsApp(reviewMessage(data));
    },
    sendContact: function (data) {
      return openWhatsApp(contactMessage(data));
    },
    openDefault: function () {
      return openWhatsApp(getConfig().defaultEnquiry);
    },
    rebind: function () {
      bindDataWaElements();
    },
    config: getConfig,

    // ---------- Smooth Mobile Navigation ----------
    mobileNav: {
      open: openMobileNav,
      close: closeMobileNav,
      toggle: toggleMobileNav,
      isOpen: function () {
        return navState.isOpen;
      },
    },

    // ---------- Navigation links ----------
    refreshNavigationLinks: initNavigationLinks,
  };

  // --------------------------------------------------------------------------
  // Bootstrapping
  // --------------------------------------------------------------------------
  function init() {
    // 1. WhatsApp bindings
    bindDataWaElements();
    bindContactForm();

    // 2. Smooth mobile navigation
    initMobileNavigation();

    // 3. Navigation links (active state + smooth scroll)
    initNavigationLinks();

    console.log(
      `%c ${FALLBACK.brandName} %c WhatsApp + Mobile Nav Ready %c ${FALLBACK.phoneDisplay} `,
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

  // Export to window
  window.TetuWhatsApp = TetuWhatsApp;
})();


/* cart.js */
﻿/**
 * ==========================================================================
 * TETU COLLECTION â€” CLIENT ACQUISITIONS & BESPOKE CART CONTROLLER (cart.js)
 * Brand: TETU COLLECTION
 * Atelier / Made by: Bossy designs
 * Contact / WhatsApp Concierge: +254700309655
 * Theme: Luxury Dark Noir & Brushed Warm Gold (#d4af37)
 * ==========================================================================
 *
 * Capabilities:
 * - Bespoke Inquiry / Acquisition Cart management (Add, Remove, Quantity, Sizing)
 * - Off-canvas luxury slide-out drawer with obsidian glassmorphic backdrop
 * - Multi-item WhatsApp checkout generator formatted for +254700309655
 * - LocalStorage persistence (tetu_collection_cart_v1) across all pages
 * - Dynamic Floating Cart Icon / Header Badge Counter with smooth pulse animation
 * - Auto-binding to all [data-add-to-cart] buttons & catalog cards
 * - Toast feedback integration and keyboard navigation (ESC to dismiss)
 * - Smooth Mobile Navigation (drawer toggle, backdrop, body scroll lock)
 * - Navigation Link Handling (active state + smooth scroll)
 * ==========================================================================
 */

(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.TetuCart = factory();
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
    // 1. Configuration & Constants
    // ------------------------------------------------------------------------
    const CART_CONFIG = {
      brandName: 'TETU COLLECTION',
      madeBy: 'Bossy designs',
      phone: '+254700309655',
      phoneRaw: '254700309655',
      storageKey: 'tetu_collection_cart_v1',
      drawerId: 'tetu-cart-drawer-overlay',
      floatingTriggerId: 'tetu-floating-cart-btn',
      badgeSelector: '.cart-count-badge, [data-cart-counter]',
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

    // ------------------------------------------------------------------------
    // 2. Cart State Management
    // ------------------------------------------------------------------------
    const state = {
      isOpen: false,
      items: [], // { id, title, category, size, finish, image, quantity }
    };

    const navState = { isOpen: false };

    // ------------------------------------------------------------------------
    // 3. DOM Helpers
    // ------------------------------------------------------------------------
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    // ------------------------------------------------------------------------
    // 4. Persistence
    // ------------------------------------------------------------------------
    function loadCart() {
      try {
        const data = localStorage.getItem(CART_CONFIG.storageKey);
        state.items = data ? JSON.parse(data) : [];
      } catch (e) {
        console.warn(
          'TETU Cart: LocalStorage inaccessible, fallback to memory.',
          e
        );
        state.items = [];
      }
      updateBadgeCounts();
    }

    function saveCart() {
      try {
        localStorage.setItem(
          CART_CONFIG.storageKey,
          JSON.stringify(state.items)
        );
      } catch (e) {
        console.warn('TETU Cart: Unable to save cart to localStorage.', e);
      }
      updateBadgeCounts();
    }

    function getTotalItemCount() {
      return state.items.reduce((total, item) => total + (item.quantity || 1), 0);
    }

    function updateBadgeCounts() {
      const count = getTotalItemCount();
      const badges = document.querySelectorAll(CART_CONFIG.badgeSelector);
      badges.forEach((badge) => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-flex' : 'none';
      });

      const floatingBtn = document.getElementById(CART_CONFIG.floatingTriggerId);
      if (floatingBtn) {
        const floatingBadge = floatingBtn.querySelector(
          '.tetu-floating-cart-count'
        );
        if (floatingBadge) {
          floatingBadge.textContent = count;
          floatingBadge.style.display = count > 0 ? 'flex' : 'none';
        }
      }
    }

    // ------------------------------------------------------------------------
    // 5. WhatsApp Message Formatter for Multi-Item Inquiries
    // ------------------------------------------------------------------------
    function generateWhatsAppEnquiryMessage(notes = '', clientName = '') {
      const greeting = clientName
        ? `Hello TETU COLLECTION, my name is ${clientName}.`
        : `Hello TETU COLLECTION (${CART_CONFIG.phone}),`;

      if (state.items.length === 0) {
        return `${greeting}\nI would like to enquire about bespoke leather commissions from your atelier.\n\nMade by ${CART_CONFIG.madeBy}`;
      }

      let itemListStr = '';
      state.items.forEach((item, idx) => {
        const sizeStr = item.size ? ` (Size: ${item.size})` : '';
        const finishStr = item.finish ? ` [Finish: ${item.finish}]` : '';
        const qtyStr = item.quantity > 1 ? ` x${item.quantity}` : '';
        itemListStr += `${idx + 1}. ${item.title}${sizeStr}${finishStr}${qtyStr}\n`;
      });

      return (
        `${greeting}\n\n` +
        `I would like to enquire regarding the acquisition & bespoke availability of the following atelier piece(s):\n\n` +
        `${itemListStr}\n` +
        (notes ? `â€¢ Additional Fitting Notes: "${notes}"\n` : '') +
        `Please advise on bespoke production lead time, custom fitting, and acquisition details.\n\n` +
        `Direct Concierge (${CART_CONFIG.phone} â€¢ Made by ${CART_CONFIG.madeBy})`
      );
    }

    function openWhatsAppCheckout(notes = '', clientName = '') {
      const msg = generateWhatsAppEnquiryMessage(notes, clientName);
      const url = `https://wa.me/${
        CART_CONFIG.phoneRaw
      }?text=${encodeURIComponent(msg.trim())}`;
      try {
        const win = window.open(url, '_blank', 'noopener,noreferrer');
        if (win) win.focus();
      } catch (e) {
        window.location.href = url;
      }
      return url;
    }

    // ------------------------------------------------------------------------
    // 6. Cart UI Drawer Injection & Styles
    // ------------------------------------------------------------------------
    function injectDrawerDOM() {
      if (document.getElementById(CART_CONFIG.drawerId)) return;

      const overlay = document.createElement('aside');
      overlay.id = CART_CONFIG.drawerId;
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Atelier Acquisition Bag');

      overlay.innerHTML = `
        <style>
          #${CART_CONFIG.drawerId} {
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            background: rgba(7, 9, 14, 0.75);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            z-index: 100080;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            box-sizing: border-box;
          }
          #${CART_CONFIG.drawerId} * { box-sizing: border-box; }
          #${CART_CONFIG.drawerId}.is-open { opacity: 1; pointer-events: auto; }
          .tetu-cart-sidebar {
            position: absolute;
            top: 0; right: 0;
            width: 100%;
            max-width: 440px;
            height: 100%;
            background: #10131a;
            border-left: 1px solid rgba(212, 175, 55, 0.28);
            box-shadow: -15px 0 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(212, 175, 55, 0.12);
            display: flex;
            flex-direction: column;
            transform: translateX(100%);
            transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
          }
          #${CART_CONFIG.drawerId}.is-open .tetu-cart-sidebar { transform: translateX(0); }
          .tetu-cart-header {
            padding: 1.5rem 1.75rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #151821;
          }
          .tetu-cart-header-title {
            font-family: 'Bodoni Moda', Georgia, serif;
            font-size: 1.35rem;
            color: #fff;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .tetu-cart-header-tag {
            font-size: 0.68rem;
            text-transform: uppercase;
            letter-spacing: 0.14em;
            color: #d4af37;
            border: 1px solid rgba(212, 175, 55, 0.3);
            padding: 2px 8px;
            border-radius: 9999px;
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
          .tetu-cart-close-btn {
            background: none;
            border: none;
            color: #9ba1b0;
            font-size: 1.6rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            transition: all 0.2s;
          }
          .tetu-cart-close-btn:hover { color: #d4af37; background: rgba(255, 255, 255, 0.06); }
          .tetu-cart-body {
            flex: 1;
            overflow-y: auto;
            padding: 1.5rem 1.75rem;
            display: flex;
            flex-direction: column;
            gap: 14px;
          }
          .tetu-cart-empty-state { text-align: center; padding: 4rem 1.5rem; margin: auto 0; }
          .tetu-cart-empty-emblem {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 1px dashed rgba(212, 175, 55, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.25rem;
            color: #d4af37;
            font-size: 1.5rem;
          }
          .tetu-cart-empty-title {
            font-family: 'Bodoni Moda', serif;
            font-size: 1.3rem;
            color: #fff;
            margin-bottom: 0.5rem;
          }
          .tetu-cart-empty-desc { font-size: 0.82rem; color: #9ba1b0; line-height: 1.5; }
          .tetu-cart-item {
            display: flex;
            align-items: center;
            gap: 14px;
            background: #151821;
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 12px;
            padding: 12px;
            transition: border-color 0.2s;
          }
          .tetu-cart-item:hover { border-color: rgba(212, 175, 55, 0.35); }
          .tetu-cart-item-img {
            width: 68px;
            height: 68px;
            border-radius: 8px;
            object-fit: cover;
            background: #0b0e15;
            border: 1px solid rgba(255, 255, 255, 0.08);
            flex-shrink: 0;
          }
          .tetu-cart-item-meta { flex: 1; min-width: 0; }
          .tetu-cart-item-cat {
            font-size: 0.65rem;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #d4af37;
            margin-bottom: 2px;
          }
          .tetu-cart-item-title {
            font-family: 'Bodoni Moda', Georgia, serif;
            font-size: 0.96rem;
            color: #fff;
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .tetu-cart-item-spec { font-size: 0.72rem; color: #9ba1b0; display: flex; align-items: center; gap: 8px; }
          .tetu-cart-qty-ctrl { display: flex; align-items: center; gap: 6px; margin-top: 6px; }
          .tetu-cart-btn-qty {
            width: 22px;
            height: 22px;
            border-radius: 4px;
            background: #0b0e15;
            border: 1px solid rgba(255, 255, 255, 0.12);
            color: #f5f5f7;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
          }
          .tetu-cart-btn-qty:hover { border-color: #d4af37; color: #d4af37; }
          .tetu-cart-qty-num {
            font-size: 0.8rem;
            font-weight: 600;
            color: #fff;
            min-width: 16px;
            text-align: center;
          }
          .tetu-cart-btn-remove {
            background: none;
            border: none;
            color: #646a7a;
            cursor: pointer;
            padding: 6px;
            font-size: 14px;
            transition: color 0.2s;
          }
          .tetu-cart-btn-remove:hover { color: #ff5555; }
          .tetu-cart-footer {
            padding: 1.5rem 1.75rem;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            background: #0b0e15;
          }
          .tetu-cart-notes-input {
            width: 100%;
            background: #151821;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 8px 12px;
            color: #fff;
            font-size: 0.78rem;
            margin-bottom: 12px;
            outline: none;
            resize: none;
          }
          .tetu-cart-notes-input:focus { border-color: #d4af37; }
          .tetu-cart-btn-checkout {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 13px 20px;
            border-radius: 9999px;
            background: linear-gradient(135deg, #d4af37 0%, #caa12c 100%);
            color: #07090e;
            font-weight: 700;
            font-size: 0.84rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            border: none;
            cursor: pointer;
            box-shadow: 0 6px 20px rgba(212, 175, 55, 0.35);
            transition: all 0.25s ease;
          }
          .tetu-cart-btn-checkout:hover {
            background: linear-gradient(135deg, #e5c158 0%, #d4af37 100%);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5);
          }
          .tetu-cart-footer-info { font-size: 0.68rem; color: #646a7a; text-align: center; margin-top: 10px; }
          #${CART_CONFIG.floatingTriggerId} {
            position: fixed;
            bottom: 90px;
            right: 28px;
            z-index: 9988;
            display: flex;
            align-items: center;
            gap: 8px;
            background: #151821;
            border: 1px solid rgba(212, 175, 55, 0.4);
            color: #f5f5f7;
            padding: 9px 16px;
            border-radius: 9999px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.8), 0 0 15px rgba(212, 175, 55, 0.2);
            cursor: pointer;
            font-family: 'Plus Jakarta Sans', sans-serif;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          }
          #${CART_CONFIG.floatingTriggerId}:hover {
            border-color: #d4af37;
            background: #1c212d;
            transform: translateY(-2px);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.9), 0 0 25px rgba(212, 175, 55, 0.35);
          }
          .tetu-floating-cart-icon { color: #d4af37; display: flex; align-items: center; }
          .tetu-floating-cart-label {
            font-size: 0.74rem;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          .tetu-floating-cart-count {
            background: #d4af37;
            color: #07090e;
            font-size: 0.68rem;
            font-weight: 700;
            padding: 2px 7px;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          @media (max-width: 600px) {
            #${CART_CONFIG.floatingTriggerId} {
              bottom: 80px;
              right: 18px;
              padding: 10px;
              border-radius: 50%;
            }
            .tetu-floating-cart-label { display: none; }
          }
        </style>

        <div class="tetu-cart-sidebar">
          <div class="tetu-cart-header">
            <div>
              <h3 class="tetu-cart-header-title">
                Acquisition Bag
                <span class="tetu-cart-header-tag" id="tetu-cart-badge-inline">0 Pieces</span>
              </h3>
            </div>
            <button class="tetu-cart-close-btn" id="tetu-cart-close-btn" aria-label="Close Bag">&times;</button>
          </div>

          <div class="tetu-cart-body" id="tetu-cart-items-stream"></div>

          <div class="tetu-cart-footer" id="tetu-cart-footer-panel">
            <textarea
              class="tetu-cart-notes-input"
              id="tetu-cart-fitting-notes"
              rows="2"
              placeholder="Custom sizing (e.g. EU 39) or bespoke requests..."
            ></textarea>
            <button class="tetu-cart-btn-checkout" id="tetu-cart-btn-wa-checkout">
              <span>Enquire on WhatsApp â†—</span>
            </button>
            <div class="tetu-cart-footer-info">
              Direct Concierge: ${CART_CONFIG.phone} â€¢ Made by ${CART_CONFIG.madeBy}
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      // Floating bag button
      if (!document.getElementById(CART_CONFIG.floatingTriggerId)) {
        const floatBtn = document.createElement('button');
        floatBtn.id = CART_CONFIG.floatingTriggerId;
        floatBtn.setAttribute('aria-label', 'Open Acquisition Bag');
        floatBtn.innerHTML = `
          <span class="tetu-floating-cart-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </span>
          <span class="tetu-floating-cart-label">Bag</span>
          <span class="tetu-floating-cart-count" style="display:none;">0</span>
        `;
        document.body.appendChild(floatBtn);
        floatBtn.addEventListener('click', () => openCart());
      }
    }

    // ------------------------------------------------------------------------
    // 7. Drawer Render & Item Interactivity
    // ------------------------------------------------------------------------
    function renderCart() {
      const stream = document.getElementById('tetu-cart-items-stream');
      const badgeInline = document.getElementById('tetu-cart-badge-inline');
      const footer = document.getElementById('tetu-cart-footer-panel');
      if (!stream) return;

      const count = getTotalItemCount();
      if (badgeInline) {
        badgeInline.textContent = `${count} ${count === 1 ? 'Piece' : 'Pieces'}`;
      }

      if (state.items.length === 0) {
        if (footer) footer.style.display = 'none';
        stream.innerHTML = `
          <div class="tetu-cart-empty-state">
            <div class="tetu-cart-empty-emblem">âœ§</div>
            <h4 class="tetu-cart-empty-title">Your Bag is Empty</h4>
            <p class="tetu-cart-empty-desc">
              Explore our curated selection of handcrafted leather slides and evening maroquinerie to add items for direct WhatsApp consultation.
            </p>
          </div>
        `;
        return;
      }

      if (footer) footer.style.display = 'block';

      stream.innerHTML = state.items
        .map((item, idx) => {
          const imgSrc = item.image || '';
          return `
          <div class="tetu-cart-item" data-id="${item.id}">
            ${
              imgSrc
                ? `<img src="${imgSrc}" alt="${item.title}" class="tetu-cart-item-img">`
                : `<div class="tetu-cart-item-img" style="display:flex;align-items:center;justify-content:center;color:#d4af37;font-size:1.1rem;">TC</div>`
            }
            <div class="tetu-cart-item-meta">
              <div class="tetu-cart-item-cat">${item.category || 'Atelier Piece'}</div>
              <div class="tetu-cart-item-title" title="${item.title}">${item.title}</div>
              <div class="tetu-cart-item-spec">
                ${item.size ? `<span>Size: ${item.size}</span> â€¢ ` : ''}
                <span style="color:#d4af37;">Bespoke Order</span>
              </div>
              <div class="tetu-cart-qty-ctrl">
                <button class="tetu-cart-btn-qty" data-action="dec" data-index="${idx}">-</button>
                <span class="tetu-cart-qty-num">${item.quantity}</span>
                <button class="tetu-cart-btn-qty" data-action="inc" data-index="${idx}">+</button>
              </div>
            </div>
            <button class="tetu-cart-btn-remove" data-action="remove" data-index="${idx}" title="Remove piece">
              âœ•
            </button>
          </div>
        `;
        })
        .join('');

      // Bind item buttons
      stream.querySelectorAll('[data-action="inc"]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'), 10);
          if (state.items[idx]) {
            state.items[idx].quantity += 1;
            saveCart();
            renderCart();
          }
        });
      });

      stream.querySelectorAll('[data-action="dec"]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'), 10);
          if (state.items[idx]) {
            if (state.items[idx].quantity > 1) {
              state.items[idx].quantity -= 1;
            } else {
              state.items.splice(idx, 1);
            }
            saveCart();
            renderCart();
          }
        });
      });

      stream.querySelectorAll('[data-action="remove"]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'), 10);
          state.items.splice(idx, 1);
          saveCart();
          renderCart();
        });
      });
    }

    // ------------------------------------------------------------------------
    // 8. Public Actions: Open / Close / Add / Clear
    // ------------------------------------------------------------------------
    function openCart() {
      injectDrawerDOM();
      renderCart();

      const drawer = document.getElementById(CART_CONFIG.drawerId);
      if (!drawer) return;

      state.isOpen = true;
      drawer.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeCart() {
      const drawer = document.getElementById(CART_CONFIG.drawerId);
      if (!drawer) return;

      state.isOpen = false;
      drawer.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    function addItem(item) {
      if (!item || !item.title) return;

      const existingIdx = state.items.findIndex(
        (i) =>
          i.title.toLowerCase() === item.title.toLowerCase() &&
          (i.size || '') === (item.size || '')
      );
      if (existingIdx >= 0) {
        state.items[existingIdx].quantity += item.quantity || 1;
      } else {
        state.items.push({
          id: item.id || 'tc-item-' + Date.now(),
          title: item.title,
          category: item.category || 'Atelier Luxury',
          size: item.size || 'Standard',
          finish: item.finish || 'Signature Finish',
          image: item.image || '',
          quantity: item.quantity || 1,
        });
      }

      saveCart();
      renderCart();

      if (typeof window.showTetuToast === 'function') {
        try {
          window.showTetuToast(
            `Added "${item.title}" to Acquisition Bag.`,
            true
          );
        } catch (e) {
          /* silent */
        }
      }

      openCart();
    }

    function clearCart() {
      state.items = [];
      saveCart();
      renderCart();
    }

    // ==========================================================================
    // 9. SMOOTH MOBILE NAVIGATION
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

      els.panel.classList.remove('translate-x-full');
      els.panel.classList.add('translate-x-0', 'open');
      els.panel.setAttribute('aria-hidden', 'false');

      if (els.backdrop) {
        els.backdrop.classList.remove('hidden');
        els.backdrop.classList.add('open');
      }

      if (els.toggle) {
        els.toggle.setAttribute('aria-expanded', 'true');
        els.toggle.classList.add('is-active');
      }

      document.body.classList.add(els.bodyLockClass);
      document.body.style.overflow = 'hidden';
      navState.isOpen = true;
    }

    function closeMobileNav() {
      const els = getNavElements();
      if (!els.panel) return;

      els.panel.classList.add('translate-x-full');
      els.panel.classList.remove('translate-x-0', 'open');
      els.panel.setAttribute('aria-hidden', 'true');

      if (els.backdrop) {
        els.backdrop.classList.add('hidden');
        els.backdrop.classList.remove('open');
      }

      if (els.toggle) {
        els.toggle.setAttribute('aria-expanded', 'false');
        els.toggle.classList.remove('is-active');
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

      if (els.toggle) {
        els.toggle.setAttribute('aria-expanded', 'false');
        els.toggle.setAttribute('aria-controls', 'mobile-menu-panel');

        els.toggle.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          toggleMobileNav();
        });
      }

      if (els.backdrop) {
        els.backdrop.addEventListener('click', closeMobileNav);
      }

      if (els.panel) {
        els.panel.querySelectorAll('a').forEach((link) => {
          link.addEventListener('click', function () {
            setTimeout(closeMobileNav, 150);
          });
        });
      }

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navState.isOpen) {
          closeMobileNav();
        }
      });

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

    // ==========================================================================
    // 10. NAVIGATION LINKS â€” Active state + smooth scroll
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

        if (sections.length > 0) {
          const observer = new IntersectionObserver(
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
          sections.forEach((sec) => observer.observe(sec));
        }
      }
    }

    // ------------------------------------------------------------------------
    // 11. Event Bindings
    // ------------------------------------------------------------------------
    function bindTriggers() {
      injectDrawerDOM();

      // Close buttons
      const closeBtn = document.getElementById('tetu-cart-close-btn');
      if (closeBtn) closeBtn.addEventListener('click', closeCart);

      const overlay = document.getElementById(CART_CONFIG.drawerId);
      if (overlay) {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) closeCart();
        });
      }

      // Checkout button
      const checkoutBtn = document.getElementById('tetu-cart-btn-wa-checkout');
      if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
          const notes =
            document.getElementById('tetu-cart-fitting-notes')?.value || '';
          openWhatsAppCheckout(notes);
        });
      }

      // Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.isOpen) {
          closeCart();
        }
      });

      // Auto-bind any button with [data-add-to-cart] or [data-cart-action="add"]
      document
        .querySelectorAll('[data-add-to-cart], [data-cart-action="add"]')
        .forEach((btn) => {
          if (btn.__tetuCartBound) return;
          btn.__tetuCartBound = true;

          btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.product-card, .catalog-item, article');
            const title =
              btn.getAttribute('data-item-title') ||
              card?.querySelector('.product-title, h3, h4')?.textContent?.trim() ||
              'Handcrafted TETU Piece';
            const category =
              btn.getAttribute('data-item-category') || 'Atelier Collection';
            const size = btn.getAttribute('data-item-size') || '';
            const image =
              btn.getAttribute('data-item-img') ||
              card?.querySelector('img')?.getAttribute('src') ||
              '';

            addItem({ title, category, size, image });
          });
        });

      // All cart drawer open triggers
      document
        .querySelectorAll('[data-cart-open], .btn-open-cart, #nav-cart-trigger')
        .forEach((btn) => {
          if (btn.__tetuCartBound) return;
          btn.__tetuCartBound = true;
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
          });
        });
    }

    // ------------------------------------------------------------------------
    // 12. Public API Export
    // ------------------------------------------------------------------------
    const API = {
      // Cart core
      add: addItem,
      open: openCart,
      close: closeCart,
      clear: clearCart,
      items: () => state.items,
      count: getTotalItemCount,
      checkout: openWhatsAppCheckout,
      config: CART_CONFIG,
      rebind: bindTriggers,

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
      loadCart();
      injectDrawerDOM();
      bindTriggers();
      initMobileNavigation();
      initNavigationLinks();

      console.log(
        `%c ${CART_CONFIG.brandName} %c Cart + Mobile Nav Ready %c Direct WhatsApp: ${CART_CONFIG.phone} `,
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


/* search.js */
﻿/**
 * ==========================================================================
 * TETU COLLECTION â€” REAL-TIME SEARCH & DISCOVERY CONTROLLER (search.js)
 * Brand: TETU COLLECTION
 * Atelier / Made by: Bossy designs
 * Contact / WhatsApp Concierge: +254700309655
 * Theme: Luxury Dark Noir & Brushed Warm Gold (#d4af37)
 * ==========================================================================
 *
 * Key Capabilities:
 * - Real-time client search across luxury footwear and evening maroquinerie
 * - Elegant luxury modal dialog with dark noir glassmorphism & gold accents
 * - Instant debounced filtering by title, material, category, color & style
 * - Filter pills (All, Footwear, Evening Bags, Slides)
 * - Recent search history persistence in localStorage
 * - Seamless integration with WhatsApp Concierge (+254700309655)
 * - Keyboard shortcuts (CMD+K / Ctrl+K to open, Escape to dismiss, Arrow keys navigation)
 * - Highlights search term matches in real time
 * - Smooth Mobile Navigation (drawer toggle, backdrop, body scroll lock)
 * - Navigation Link Handling (active state + smooth scroll)
 * ==========================================================================
 */

(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.TetuSearch = factory();
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
    // 1. Configuration & Initial Catalog Data
    // ------------------------------------------------------------------------
    const SEARCH_CONFIG = {
      brandName: 'TETU COLLECTION',
      madeBy: 'Bossy designs',
      phone: '+254700309655',
      phoneRaw: '254700309655',
      modalId: 'tetu-search-modal',
      triggerSelector:
        '[data-search-trigger], .nav-search-btn, #btn-open-search, [aria-label="Search Archive"]',
      storageKeyRecent: 'tetu_recent_searches_v1',
      maxRecent: 5,
      debounceMs: 180,
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

    // Comprehensive Catalog items
    const DEFAULT_CATALOG = (typeof window !== 'undefined' && Array.isArray(window.TETU_PRODUCTS)) ? window.TETU_PRODUCTS : [];

    // ------------------------------------------------------------------------
    // 2. State Management
    // ------------------------------------------------------------------------
    const state = {
      isOpen: false,
      query: '',
      activeFilter: 'all',
      selectedIndex: -1,
      results: [],
      recentSearches: [],
    };

    const navState = { isOpen: false };

    // ------------------------------------------------------------------------
    // 3. DOM Helpers
    // ------------------------------------------------------------------------
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    // ------------------------------------------------------------------------
    // 4. LocalStorage Helpers
    // ------------------------------------------------------------------------
    function loadRecentSearches() {
      try {
        const data = localStorage.getItem(SEARCH_CONFIG.storageKeyRecent);
        state.recentSearches = data
          ? JSON.parse(data)
          : ['Leather Slide', 'Crescent Bag', 'Evening Luxury'];
      } catch (e) {
        state.recentSearches = [
          'Leather Slide',
          'Crescent Bag',
          'Evening Luxury',
        ];
      }
    }

    function saveRecentSearch(term) {
      if (!term || term.trim().length < 2) return;
      const clean = term.trim();
      state.recentSearches = [
        clean,
        ...state.recentSearches.filter(
          (t) => t.toLowerCase() !== clean.toLowerCase()
        ),
      ].slice(0, SEARCH_CONFIG.maxRecent);
      try {
        localStorage.setItem(
          SEARCH_CONFIG.storageKeyRecent,
          JSON.stringify(state.recentSearches)
        );
      } catch (e) {
        console.warn('TETU Search: Could not persist recent search history.');
      }
    }

    function clearRecentSearches() {
      state.recentSearches = [];
      try {
        localStorage.removeItem(SEARCH_CONFIG.storageKeyRecent);
      } catch (e) {
        /* silent */
      }
      renderRecentSearches();
    }

    // ------------------------------------------------------------------------
    // 5. Search Filter & Matching Logic
    // ------------------------------------------------------------------------
    function escapeRegex(string) {
      return String(string).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function highlightMatch(text, query) {
      if (!query || !query.trim()) return escapeHTML(text);
      const safe = escapeHTML(text);
      const regex = new RegExp(`(${escapeRegex(query.trim())})`, 'gi');
      return safe.replace(
        regex,
        '<span class="tetu-search-highlight">$1</span>'
      );
    }

    function escapeHTML(str) {
      if (str == null) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function performSearch(query, filter = 'all') {
      const q = (query || '').trim().toLowerCase();
      let items = DEFAULT_CATALOG.slice();

      if (filter === 'footwear') {
        items = items.filter(
          (item) => item.category.toLowerCase() === 'footwear'
        );
      } else if (filter === 'bags') {
        items = items.filter((item) => item.category.toLowerCase() === 'bags');
      } else if (filter === 'slides') {
        items = items.filter((item) => item.tag.toLowerCase() === 'slides');
      } else if (filter === 'evening') {
        items = items.filter(
          (item) =>
            item.link.includes('evening') ||
            item.tag.toLowerCase().includes('evening')
        );
      }

      if (!q) return items.slice(0, 6);

      const tokens = q.split(/\s+/).filter(Boolean);

      return items.filter((item) => {
        const haystack = `${item.title} ${item.category} ${item.tag} ${item.material} ${item.finish} ${item.color} ${item.description}`.toLowerCase();
        return tokens.every((token) => haystack.includes(token));
      });
    }

    function getWhatsAppEnquiryUrl(pieceTitle) {
      const text = `Hello TETU COLLECTION (${SEARCH_CONFIG.phone}),\nI found the "${pieceTitle}" via your search catalog and would like to enquire on sizing, price, and availability.\n\nMade by ${SEARCH_CONFIG.madeBy}`;
      return `https://wa.me/${SEARCH_CONFIG.phoneRaw}?text=${encodeURIComponent(
        text.trim()
      )}`;
    }

    // ------------------------------------------------------------------------
    // 6. Modal Component DOM Injection
    // ------------------------------------------------------------------------
    function injectModalHTML() {
      if (document.getElementById(SEARCH_CONFIG.modalId)) return;

      const modal = document.createElement('aside');
      modal.id = SEARCH_CONFIG.modalId;
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', 'Search TETU COLLECTION');

      modal.innerHTML = `
        <style>
          #${SEARCH_CONFIG.modalId} {
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            background: rgba(7, 9, 14, 0.88);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            z-index: 100050;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding: 70px 20px 20px;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1);
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-sizing: border-box;
          }
          #${SEARCH_CONFIG.modalId}.is-open { opacity: 1; pointer-events: auto; }
          .tetu-search-container {
            background: #10131a;
            border: 1px solid rgba(212, 175, 55, 0.35);
            border-radius: 16px;
            max-width: 680px;
            width: 100%;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(212, 175, 55, 0.16);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            max-height: 85vh;
            transform: translateY(18px) scale(0.985);
            transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          }
          #${SEARCH_CONFIG.modalId}.is-open .tetu-search-container {
            transform: translateY(0) scale(1);
          }
          .tetu-search-header {
            padding: 1.25rem 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            align-items: center;
            gap: 14px;
            background: #151821;
          }
          .tetu-search-icon { color: #d4af37; flex-shrink: 0; display: flex; align-items: center; }
          .tetu-search-input {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: #fff;
            font-size: 1.15rem;
            font-family: inherit;
          }
          .tetu-search-input::placeholder { color: #646a7a; font-weight: 300; }
          .tetu-search-clear-btn {
            background: rgba(255, 255, 255, 0.08);
            border: none;
            color: #9ba1b0;
            border-radius: 50%;
            width: 24px; height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s ease;
          }
          .tetu-search-clear-btn:hover { background: rgba(212, 175, 55, 0.3); color: #d4af37; }
          .tetu-search-badge-esc {
            padding: 3px 8px;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.12);
            font-size: 0.65rem;
            color: #9ba1b0;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          .tetu-search-filter-bar {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 0.75rem 1.5rem;
            background: #0b0e15;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            overflow-x: auto;
            scrollbar-width: none;
          }
          .tetu-search-filter-bar::-webkit-scrollbar { display: none; }
          .tetu-filter-pill {
            padding: 5px 12px;
            border-radius: 9999px;
            font-size: 0.72rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            background: #151821;
            color: #9ba1b0;
            border: 1px solid rgba(255, 255, 255, 0.08);
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.2s;
          }
          .tetu-filter-pill:hover { color: #fff; border-color: rgba(212, 175, 55, 0.4); }
          .tetu-filter-pill.active { background: #d4af37; color: #07090e; font-weight: 600; border-color: #d4af37; }
          .tetu-search-body {
            flex: 1;
            overflow-y: auto;
            padding: 1.25rem 1.5rem;
            color: #f5f5f7;
            max-height: 52vh;
          }
          .tetu-search-section-label {
            font-size: 0.7rem;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #d4af37;
            font-weight: 600;
            margin-bottom: 0.85rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .tetu-search-clear-recent {
            color: #646a7a;
            background: none;
            border: none;
            font-size: 0.68rem;
            cursor: pointer;
            letter-spacing: 0.06em;
            text-transform: uppercase;
          }
          .tetu-search-clear-recent:hover { color: #d4af37; }
          .tetu-recent-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 1.5rem; }
          .tetu-recent-chip {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            background: #151821;
            border: 1px solid rgba(255, 255, 255, 0.07);
            border-radius: 8px;
            font-size: 0.78rem;
            color: #c4c9d6;
            cursor: pointer;
            transition: all 0.2s;
          }
          .tetu-recent-chip:hover { border-color: #d4af37; color: #fff; transform: translateY(-1px); }
          .tetu-results-list { display: flex; flex-direction: column; gap: 10px; }
          .tetu-result-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
            padding: 12px 14px;
            background: #151821;
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            text-decoration: none;
            color: inherit;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .tetu-result-item:hover,
          .tetu-result-item.selected {
            border-color: rgba(212, 175, 55, 0.45);
            background: #1a1e2a;
            transform: translateX(3px);
          }
          .tetu-result-meta { flex: 1; }
          .tetu-result-category {
            font-size: 0.66rem;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #d4af37;
            font-weight: 600;
            margin-bottom: 3px;
          }
          .tetu-result-title {
            font-family: 'Bodoni Moda', Georgia, serif;
            font-size: 1.05rem;
            color: #fff;
            margin-bottom: 3px;
          }
          .tetu-result-sub { font-size: 0.74rem; color: #9ba1b0; line-height: 1.35; }
          .tetu-search-highlight {
            color: #d4af37;
            font-weight: 600;
            text-decoration: underline;
            text-decoration-color: rgba(212, 175, 55, 0.4);
          }
          .tetu-result-actions { display: flex; align-items: center; gap: 8px; }
          .tetu-btn-result-wa {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            background: rgba(37, 211, 102, 0.12);
            border: 1px solid rgba(37, 211, 102, 0.3);
            border-radius: 6px;
            color: #25D366;
            font-size: 0.72rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
            transition: all 0.2s;
            text-decoration: none;
          }
          .tetu-btn-result-wa:hover { background: #25D366; color: #07090e; }
          .tetu-search-empty { text-align: center; padding: 3rem 1.5rem; }
          .tetu-search-empty-icon { font-size: 2rem; color: #3e4453; margin-bottom: 0.75rem; }
          .tetu-search-empty-title { font-family: 'Bodoni Moda', serif; font-size: 1.25rem; margin-bottom: 0.5rem; color: #fff; }
          .tetu-search-empty-desc { font-size: 0.82rem; color: #9ba1b0; max-width: 380px; margin: 0 auto 1.25rem; }
          .tetu-btn-enquire-empty {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 18px;
            border-radius: 9999px;
            background: linear-gradient(135deg, #d4af37 0%, #caa12c 100%);
            color: #07090e;
            font-weight: 600;
            font-size: 0.76rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            text-decoration: none;
          }
          .tetu-search-footer {
            padding: 0.85rem 1.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            background: #0b0e15;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.7rem;
            color: #646a7a;
          }
          .tetu-search-shortcuts { display: flex; align-items: center; gap: 12px; }
          .tetu-kbd-hint { display: inline-flex; align-items: center; gap: 4px; }
          .tetu-kbd {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            padding: 1px 4px;
            color: #9ba1b0;
            font-family: monospace;
            font-size: 0.65rem;
          }
          @media (max-width: 640px) {
            #${SEARCH_CONFIG.modalId} { padding: 20px 10px; }
            .tetu-search-shortcuts { display: none; }
            .tetu-search-container { max-height: 92vh; }
          }
        </style>

        <div class="tetu-search-container">
          <div class="tetu-search-header">
            <div class="tetu-search-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input
              type="text"
              id="tetu-search-input-field"
              class="tetu-search-input"
              placeholder="Search bespoke slides, evening bags, leather finishes..."
              autocomplete="off"
              spellcheck="false"
            />
            <button id="tetu-search-clear" class="tetu-search-clear-btn" style="display:none;" title="Clear Search">&times;</button>
            <span class="tetu-search-badge-esc">ESC</span>
          </div>

          <div class="tetu-search-filter-bar" id="tetu-search-filters">
            <button class="tetu-filter-pill active" data-filter="all">All Atelier Pieces</button>
            <button class="tetu-filter-pill" data-filter="footwear">Footwear</button>
            <button class="tetu-filter-pill" data-filter="bags">Bags & Maroquinerie</button>
            <button class="tetu-filter-pill" data-filter="slides">Handcrafted Slides</button>
            <button class="tetu-filter-pill" data-filter="evening">Evening Luxury</button>
          </div>

          <div class="tetu-search-body">
            <div id="tetu-search-recent-block">
              <div class="tetu-search-section-label">
                <span>Recent Searches</span>
                <button class="tetu-search-clear-recent" id="tetu-clear-recent-btn">Clear</button>
              </div>
              <div class="tetu-recent-tags" id="tetu-recent-tags-container"></div>
            </div>

            <div class="tetu-search-section-label" id="tetu-results-counter-label">Curated Collection Highlights</div>
            <div class="tetu-results-list" id="tetu-results-stream"></div>
          </div>

          <div class="tetu-search-footer">
            <div class="tetu-search-shortcuts">
              <span class="tetu-kbd-hint"><span class="tetu-kbd">â†‘</span><span class="tetu-kbd">â†“</span> to navigate</span>
              <span class="tetu-kbd-hint"><span class="tetu-kbd">â†µ</span> to select</span>
              <span class="tetu-kbd-hint"><span class="tetu-kbd">ESC</span> to close</span>
            </div>
            <div>Atelier Concierge: <a href="https://wa.me/${SEARCH_CONFIG.phoneRaw}" target="_blank" rel="noopener noreferrer" style="color: #d4af37;">${SEARCH_CONFIG.phone}</a> â€¢ Made by Bossy designs</div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
    }

    // ------------------------------------------------------------------------
    // 7. UI Renderers
    // ------------------------------------------------------------------------
    function renderRecentSearches() {
      const container = document.getElementById('tetu-recent-tags-container');
      const block = document.getElementById('tetu-search-recent-block');
      if (!container || !block) return;

      if (!state.recentSearches || state.recentSearches.length === 0) {
        block.style.display = 'none';
        return;
      }

      block.style.display = 'block';
      container.innerHTML = state.recentSearches
        .map(
          (term) => `
        <span class="tetu-recent-chip" data-search-term="${escapeHTML(term)}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </svg>
          ${escapeHTML(term)}
        </span>
      `
        )
        .join('');

      container.querySelectorAll('.tetu-recent-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          const query = chip.getAttribute('data-search-term');
          const input = document.getElementById('tetu-search-input-field');
          if (input) {
            input.value = query;
            state.query = query;
            runSearch();
          }
        });
      });
    }

    function renderResults(results) {
      const stream = document.getElementById('tetu-results-stream');
      const label = document.getElementById('tetu-results-counter-label');
      const recentBlock = document.getElementById('tetu-search-recent-block');
      if (!stream) return;

      state.results = results;
      state.selectedIndex = -1;

      if (recentBlock) {
        recentBlock.style.display =
          state.query.trim().length > 0
            ? 'none'
            : state.recentSearches.length
            ? 'block'
            : 'none';
      }

      if (label) {
        if (state.query.trim()) {
          label.textContent = `${results.length} ${
            results.length === 1 ? 'Piece' : 'Pieces'
          } Found for "${state.query}"`;
        } else {
          label.textContent = `Curated Atelier Highlights (${results.length})`;
        }
      }

      if (results.length === 0) {
        const fallbackWaText = `Hello TETU COLLECTION (${SEARCH_CONFIG.phone}),\nI am searching for "${state.query}" from your atelier catalog. Please advise on custom bespoke availability.\n\nMade by ${SEARCH_CONFIG.madeBy}`;
        const fallbackUrl = `https://wa.me/${
          SEARCH_CONFIG.phoneRaw
        }?text=${encodeURIComponent(fallbackWaText)}`;

        stream.innerHTML = `
          <div class="tetu-search-empty">
            <div class="tetu-search-empty-icon">âœ§</div>
            <h4 class="tetu-search-empty-title">No Atelier Pieces Found</h4>
            <p class="tetu-search-empty-desc">
              We couldn't find an exact match for <em>"${escapeHTML(
                state.query
              )}"</em>. Our artisans can handcraft bespoke variants to your preferred color, fit, and leather finish.
            </p>
            <a href="${fallbackUrl}" target="_blank" rel="noopener noreferrer" class="tetu-btn-enquire-empty">
              Enquire Bespoke Custom on WhatsApp â†—
            </a>
          </div>
        `;
        return;
      }

      stream.innerHTML = results
        .map((item, idx) => {
          const highlightedTitle = highlightMatch(item.title, state.query);
          const highlightedDesc = highlightMatch(item.description, state.query);
          const waUrl = getWhatsAppEnquiryUrl(item.title);

          return `
          <div class="tetu-result-item" data-index="${idx}" data-href="${escapeHTML(
            item.link
          )}">
            <div class="tetu-result-meta">
              <div class="tetu-result-category">${escapeHTML(
                item.category
              )} â€¢ ${escapeHTML(item.tag)} â€¢ <span style="color: #9ba1b0;">${escapeHTML(
            item.finish
          )}</span></div>
              <h5 class="tetu-result-title">${highlightedTitle}</h5>
              <p class="tetu-result-sub">${highlightedDesc}</p>
            </div>
            <div class="tetu-result-actions">
              <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="tetu-btn-result-wa" title="Direct WhatsApp order">
                WhatsApp â†—
              </a>
            </div>
          </div>
        `;
        })
        .join('');

      stream.querySelectorAll('.tetu-result-item').forEach((card) => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('.tetu-btn-result-wa')) return;
          const href = card.getAttribute('data-href');
          saveRecentSearch(state.query);
          closeSearch();
          if (href) {
            window.location.href = href;
          }
        });
      });
    }

    // ------------------------------------------------------------------------
    // 8. Modal Control (Open / Close / Debounce)
    // ------------------------------------------------------------------------
    let debounceTimer = null;

    function runSearch() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const clearBtn = document.getElementById('tetu-search-clear');
        if (clearBtn) {
          clearBtn.style.display =
            state.query.trim().length > 0 ? 'flex' : 'none';
        }
        const results = performSearch(state.query, state.activeFilter);
        renderResults(results);
      }, SEARCH_CONFIG.debounceMs);
    }

    function openSearch(initialQuery = '') {
      injectModalHTML();
      loadRecentSearches();

      const modal = document.getElementById(SEARCH_CONFIG.modalId);
      const input = document.getElementById('tetu-search-input-field');

      if (!modal) return;

      state.isOpen = true;
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';

      renderRecentSearches();

      if (initialQuery && input) {
        input.value = initialQuery;
        state.query = initialQuery;
      }

      runSearch();

      if (input) {
        setTimeout(() => {
          input.focus();
          input.select();
        }, 100);
      }
    }

    function closeSearch() {
      const modal = document.getElementById(SEARCH_CONFIG.modalId);
      if (!modal) return;

      state.isOpen = false;
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    // ------------------------------------------------------------------------
    // 9. Keyboard Navigation for Results
    // ------------------------------------------------------------------------
    function updateKeyboardSelection(newIndex) {
      const items = document.querySelectorAll('.tetu-result-item');
      if (!items.length) return;

      items.forEach((el) => el.classList.remove('selected'));

      if (newIndex >= 0 && newIndex < items.length) {
        state.selectedIndex = newIndex;
        items[newIndex].classList.add('selected');
        items[newIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        state.selectedIndex = -1;
      }
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

      els.panel.classList.remove('translate-x-full');
      els.panel.classList.add('translate-x-0', 'open');
      els.panel.setAttribute('aria-hidden', 'false');

      if (els.backdrop) {
        els.backdrop.classList.remove('hidden');
        els.backdrop.classList.add('open');
      }

      if (els.toggle) {
        els.toggle.setAttribute('aria-expanded', 'true');
        els.toggle.classList.add('is-active');
      }

      document.body.classList.add(els.bodyLockClass);
      document.body.style.overflow = 'hidden';
      navState.isOpen = true;
    }

    function closeMobileNav() {
      const els = getNavElements();
      if (!els.panel) return;

      els.panel.classList.add('translate-x-full');
      els.panel.classList.remove('translate-x-0', 'open');
      els.panel.setAttribute('aria-hidden', 'true');

      if (els.backdrop) {
        els.backdrop.classList.add('hidden');
        els.backdrop.classList.remove('open');
      }

      if (els.toggle) {
        els.toggle.setAttribute('aria-expanded', 'false');
        els.toggle.classList.remove('is-active');
      }

      document.body.classList.remove(els.bodyLockClass);
      document.body.style.overflow = '';
      navState.isOpen = false;
    }

    function toggleMobileNav() {
      if (navState.isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    }

    function initMobileNavigation() {
      const els = getNavElements();
      if (!els.toggle && !els.panel) return;

      if (els.toggle) {
        els.toggle.setAttribute('aria-expanded', 'false');
        els.toggle.setAttribute('aria-controls', 'mobile-menu-panel');

        els.toggle.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          toggleMobileNav();
        });
      }

      if (els.backdrop) {
        els.backdrop.addEventListener('click', closeMobileNav);
      }

      if (els.panel) {
        els.panel.querySelectorAll('a').forEach((link) => {
          link.addEventListener('click', function () {
            setTimeout(closeMobileNav, 150);
          });
        });
      }

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navState.isOpen) {
          closeMobileNav();
        }
      });

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

    // ==========================================================================
    // 11. NAVIGATION LINKS â€” Active state + smooth scroll
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

        if (sections.length > 0) {
          const observer = new IntersectionObserver(
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
          sections.forEach((sec) => observer.observe(sec));
        }
      }
    }

    // ------------------------------------------------------------------------
    // 12. Event Bindings
    // ------------------------------------------------------------------------
    function bindEvents() {
      injectModalHTML();

      const modal = document.getElementById(SEARCH_CONFIG.modalId);
      const input = document.getElementById('tetu-search-input-field');
      const clearBtn = document.getElementById('tetu-search-clear');
      const clearRecentBtn = document.getElementById('tetu-clear-recent-btn');
      const filterContainer = document.getElementById('tetu-search-filters');

      if (input) {
        input.addEventListener('input', (e) => {
          state.query = e.target.value;
          runSearch();
        });

        input.addEventListener('keydown', (e) => {
          const items = document.querySelectorAll('.tetu-result-item');
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next =
              state.selectedIndex + 1 >= items.length
                ? 0
                : state.selectedIndex + 1;
            updateKeyboardSelection(next);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev =
              state.selectedIndex - 1 < 0
                ? items.length - 1
                : state.selectedIndex - 1;
            updateKeyboardSelection(prev);
          } else if (e.key === 'Enter') {
            e.preventDefault();
            if (state.selectedIndex >= 0 && items[state.selectedIndex]) {
              items[state.selectedIndex].click();
            } else if (items.length > 0) {
              items[0].click();
            }
          }
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (input) {
            input.value = '';
            input.focus();
            state.query = '';
            runSearch();
          }
        });
      }

      if (clearRecentBtn) {
        clearRecentBtn.addEventListener('click', (e) => {
          e.preventDefault();
          clearRecentSearches();
        });
      }

      if (filterContainer) {
        filterContainer.querySelectorAll('.tetu-filter-pill').forEach((pill) => {
          pill.addEventListener('click', () => {
            filterContainer
              .querySelectorAll('.tetu-filter-pill')
              .forEach((p) => p.classList.remove('active'));
            pill.classList.add('active');
            state.activeFilter = pill.getAttribute('data-filter') || 'all';
            runSearch();
          });
        });
      }

      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeSearch();
        });
      }

      document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          if (state.isOpen) closeSearch();
          else openSearch();
        } else if (e.key === 'Escape' && state.isOpen) {
          closeSearch();
        }
      });

      // Auto-bind trigger buttons
      document.querySelectorAll(SEARCH_CONFIG.triggerSelector).forEach((el) => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          openSearch();
        });
      });
    }

    // ------------------------------------------------------------------------
    // 13. Public API Export
    // ------------------------------------------------------------------------
    const API = {
      // Search
      open: openSearch,
      close: closeSearch,
      search: performSearch,
      catalog: DEFAULT_CATALOG,
      config: SEARCH_CONFIG,
      rebind: bindEvents,

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
    // 14. Bootstrapping
    // ------------------------------------------------------------------------
    function init() {
      bindEvents();
      initMobileNavigation();
      initNavigationLinks();

      console.log(
        `%c ${SEARCH_CONFIG.brandName} %c Search + Mobile Nav Ready %c Shortcut: CMD+K `,
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


/* gallery.js */
﻿/**
 * ==========================================================================
 * TETU COLLECTION â€” INTERACTIVE PRODUCT GALLERY & LIGHTBOX CONTROLLER (gallery.js)
 * Brand: TETU COLLECTION
 * Atelier / Made by: Bossy designs
 * Contact / WhatsApp Concierge: +254700309655
 * Theme: Luxury Dark Noir & Brushed Warm Gold (#d4af37)
 * ==========================================================================
 *
 * Capabilities:
 * - Ultra-Luxury Obsidian Glassmorphic Lightbox Modal for high-res atelier imagery
 * - Dynamic Category Filtering (All, Slides, Bags, Evening)
 * - Magnifying Zoom Lens & Pan Inspection for bespoke leather grain
 * - Direct WhatsApp Acquisition Bridge (+254700309655) from within Lightbox
 * - Seamless Integration with Acquisition Bag (TetuCart / cart.js)
 * - Carousel slide navigation with smooth hardware-accelerated transitions
 * - Full Keyboard Navigation (Left/Right Arrows, ESC to dismiss, 'Z' to zoom)
 * - Touch swipe gestures for mobile & tablet exploration
 * - Smooth Mobile Navigation (drawer toggle, backdrop, body scroll lock)
 * - Navigation Link Handling (active state + smooth scroll)
 * ==========================================================================
 */

(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.TetuGallery = factory();
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
    // 1. Configuration & Default Gallery Data
    // ------------------------------------------------------------------------
    const GALLERY_CONFIG = {
      brandName: 'TETU COLLECTION',
      madeBy: 'Bossy designs',
      phone: '+254700309655',
      phoneRaw: '254700309655',
      lightboxId: 'tetu-gallery-lightbox',
      filterNavSelector: '.gallery-filter-pill, [data-gallery-filter]',
      itemSelector: '[data-gallery-item], .gallery-item, .product-card img',
      zoomScale: 2.2,
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

    const navState = { isOpen: false };

    // ------------------------------------------------------------------------
    // 2. DOM Helpers
    // ------------------------------------------------------------------------
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    // ------------------------------------------------------------------------
    // 3. Default Gallery Items
    // ------------------------------------------------------------------------
    const DEFAULT_ITEMS = [
      {
        id: 'gallery-footwear-1',
        title: 'Tan H-Strap Artisanal Leather Slide',
        category: 'footwear',
        tag: 'Slides',
        material: 'Full-Grain Kenyan Calfskin Leather',
        finish: 'Saddle Tan with Contrast Stitch',
        desc: 'Handcrafted signature dual-band slide with ergonomic cushioned footbed and perimeter hand-stitch detailing.',
        image: 'IMG-20260923-WA0194.jpg',
        placeholder: '{{DATA:IMAGE:IMAGE_21}}',
      },
      {
        id: 'gallery-footwear-2',
        title: 'Midnight Noir Cutout Slide',
        category: 'footwear',
        tag: 'Slides',
        material: 'Embossed Noir Calf Leather',
        finish: 'Obsidian Matte Finish',
        desc: 'Geometric architectural cutout upper designed for refined daytime poise and evening comfort.',
        image: 'IMG-20260923-WA0191.jpg',
        placeholder: '{{DATA:IMAGE:IMAGE_22}}',
      },
      {
        id: 'gallery-footwear-3',
        title: 'Monogram Gold-Chain Leather Slide',
        category: 'footwear',
        tag: 'Slides',
        material: 'Monogram Patterned Leather & Heavy Gold Hardware',
        finish: 'Brushed Warm Gold Chain Clasp',
        desc: 'Bold signature footwear featuring high-polish gold curb chain ornament over structured monogram straps.',
        image: 'IMG-20260923-WA0190.jpg',
        placeholder: '{{DATA:IMAGE:IMAGE_23}}',
      },
      {
        id: 'gallery-footwear-4',
        title: 'Amber Cognac Toe-Loop Artisan Sandal',
        category: 'footwear',
        tag: 'Slides',
        material: 'Pebbled Cognac Saddle Leather',
        finish: 'Hand-Burnished Edges',
        desc: 'Asymmetric contoured toe-loop sandal handcrafted from pliable Kenyan leather.',
        image: 'IMG-20260923-WA0189.jpg',
        placeholder: '{{DATA:IMAGE:IMAGE_24}}',
      },
      {
        id: 'gallery-footwear-5',
        title: 'Rose Gold Beaded Pearl Slide',
        category: 'evening',
        tag: 'Footwear',
        material: 'Metallic Rose Gold Nappa & Hand-Strung Pearls',
        finish: 'Evening Glamour Luster',
        desc: 'Bespoke gala footwear adorned with hand-applied micro seed beads and radiant faux pearl clusters.',
        image: 'IMG-20260923-WA0184.jpg',
        placeholder: '{{DATA:IMAGE:IMAGE_43}}',
      },
      {
        id: 'gallery-footwear-6',
        title: 'Sunburst Yellow Atelier Slide',
        category: 'footwear',
        tag: 'Slides',
        material: 'Vibrant Textured Lizard Grain Leather',
        finish: 'Sunburst Yellow Satin',
        desc: 'Sculptural resort statement slide delivering radiant energy to tailored linen silhouettes.',
        image: 'IMG-20260923-WA0176.jpg',
        placeholder: '{{DATA:IMAGE:IMAGE_50}}',
      },
      {
        id: 'gallery-footwear-7',
        title: 'Imperial Crimson Cutout Sandal',
        category: 'footwear',
        tag: 'Slides',
        material: 'Textured Scarlet Calfskin',
        finish: 'Deep Crimson Hand Stain',
        desc: 'Statement cut-out sandal with ergonomic sole profile and resilient edge coating.',
        image: 'IMG-20260923-WA0178.jpg',
        placeholder: '{{DATA:IMAGE:IMAGE_48}}',
      },
      {
        id: 'gallery-footwear-8',
        title: 'Ivory Textured Cross Slide',
        category: 'footwear',
        tag: 'Slides',
        material: 'Off-White Textured Leather',
        finish: 'Clean Minimalist Crossover',
        desc: 'Contemporary square-toe silhouette with woven-texture bands for breezy warm-weather elegance.',
        image: 'IMG-20260923-WA0171.jpg',
        placeholder: '{{DATA:IMAGE:IMAGE_53}}',
      },
      {
        id: 'gallery-bag-1',
        title: 'Ivory Sculpted Crescent Shoulder Bag',
        category: 'evening',
        tag: 'Bags',
        material: 'Structured Smooth Calfskin with Crimson Interior',
        finish: 'Light Gold Metal Hardware',
        desc: 'Architectural curved baguette featuring ribbed leather relief and luxurious scarlet suede lining.',
        image: 'IMG-20260923-WA0203.jpg',
        placeholder: '{{DATA:IMAGE:IMAGE_29}}',
      },
      {
        id: 'gallery-bag-2',
        title: 'Checkerboard Atelier Weekend Carryall',
        category: 'bags',
        tag: 'Totes',
        material: 'Coated Damier Canvas & Noir Calf Leather Trim',
        finish: 'Detachable Matching Companion Pouch',
        desc: 'Generous bespoke tote engineered for travel and executive poise, accompanied by a quick-access zip pouch.',
        image: 'IMG-20260923-WA0202.jpg',
        placeholder: '{{DATA:IMAGE:IMAGE_30}}',
      },
      {
        id: 'gallery-bag-3',
        title: 'Saddle Cognac Leather Hand-Stitched Tote',
        category: 'bags',
        tag: 'Totes',
        material: 'Rich Supple Brown Calfskin Leather',
        finish: 'Reinforced Long Shoulder Straps & Charm',
        desc: 'Everyday artisan luxury carryall crafted with reinforced base panels and custom hardware clasp.',
        image: 'IMG-20260923-WA0215.jpg',
        placeholder: '{{DATA:IMAGE:IMAGE_27}}',
      },
      {
        id: 'gallery-bag-4',
        title: 'Woven Terracotta Artisanal Striped Shopper',
        category: 'bags',
        tag: 'Totes',
        material: 'Handwoven Kenyan Natural Fiber & Crimson Leather',
        finish: 'Burnished Brass Fastenings',
        desc: 'Heritage East African basketry traditions elevated with bespoke full-grain leather finishes and brass zippers.',
        image: 'IMG-20260923-WA0200.jpg',
        placeholder: '{{DATA:IMAGE:IMAGE_32}}',
      },
      {
        id: 'gallery-bag-5',
        title: 'Curved Obsidian Noir Baguette Bag',
        category: 'evening',
        tag: 'Bags',
        material: 'Soft Pebble-Grain Obsidian Leather',
        finish: 'Polished Minimalist Gold Accent Bar',
        desc: 'Understated evening luxury underarm hobo designed for nocturnal galas and bespoke gatherings.',
        image: 'IMG-20260923-WA0198.jpg',
        placeholder: '{{DATA:IMAGE:IMAGE_34}}',
      },
      {
        id: 'gallery-bag-6',
        title: 'Distressed Denim Starlet Evening Bag',
        category: 'evening',
        tag: 'Bags',
        material: 'Frayed Indigo Denim & Heavy Silver Chain',
        finish: 'High-Luster Chrome Hardware',
        desc: 'Avant-garde luxury evening bag marrying distressed denim textures with polished metal chain handle.',
        image: 'IMG-20260923-WA0199.jpg',
        placeholder: '{{DATA:IMAGE:IMAGE_33}}',
      },
    ];

    // ------------------------------------------------------------------------
    // 4. State Controller
    // ------------------------------------------------------------------------
    const state = {
      isOpen: false,
      currentIndex: 0,
      filteredItems: [...DEFAULT_ITEMS],
      activeFilter: 'all',
      isZoomed: false,
      touchStartX: 0,
      touchEndX: 0,
    };

    // ------------------------------------------------------------------------
    // 5. WhatsApp Message Helper
    // ------------------------------------------------------------------------
    function buildWhatsAppEnquiryUrl(pieceTitle, finish = '') {
      const text =
        `Hello TETU COLLECTION (${GALLERY_CONFIG.phone}),\n\n` +
        `I am viewing the "${pieceTitle}"${
          finish ? ` [Finish: ${finish}]` : ''
        } via your Atelier Gallery and would like to enquire regarding bespoke acquisition, sizing, and custom production.\n\n` +
        `Direct Concierge (${GALLERY_CONFIG.phone} â€¢ Made by ${GALLERY_CONFIG.madeBy})`;
      return `https://wa.me/${
        GALLERY_CONFIG.phoneRaw
      }?text=${encodeURIComponent(text.trim())}`;
    }

    // ------------------------------------------------------------------------
    // 6. Lightbox Modal Injection & DOM Architecture
    // ------------------------------------------------------------------------
    function injectLightboxDOM() {
      if (document.getElementById(GALLERY_CONFIG.lightboxId)) return;

      const modal = document.createElement('aside');
      modal.id = GALLERY_CONFIG.lightboxId;
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', 'TETU COLLECTION Image Lightbox');

      modal.innerHTML = `
        <style>
          #${GALLERY_CONFIG.lightboxId} {
            position: fixed;
            inset: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(7, 9, 14, 0.94);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            z-index: 100100;
            display: flex;
            flex-direction: column;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1);
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            box-sizing: border-box;
            user-select: none;
          }
          #${GALLERY_CONFIG.lightboxId} * { box-sizing: border-box; }
          #${GALLERY_CONFIG.lightboxId}.is-open { opacity: 1; pointer-events: auto; }
          .tetu-lb-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 2rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            background: rgba(16, 19, 26, 0.7);
            z-index: 2;
          }
          .tetu-lb-brand-meta { display: flex; align-items: center; gap: 12px; }
          .tetu-lb-monogram {
            width: 32px; height: 32px; border-radius: 50%;
            border: 1px solid rgba(212, 175, 55, 0.35);
            background: radial-gradient(circle, #212532 0%, #10131a 100%);
            color: #d4af37;
            display: flex; align-items: center; justify-content: center;
            font-family: 'Bodoni Moda', serif; font-size: 0.85rem; font-weight: 600;
          }
          .tetu-lb-counter {
            font-size: 0.75rem;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #9ba1b0;
          }
          .tetu-lb-counter span { color: #d4af37; font-weight: 600; }
          .tetu-lb-top-actions { display: flex; align-items: center; gap: 10px; }
          .tetu-lb-btn-tool {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.12);
            color: #f5f5f7;
            border-radius: 8px;
            padding: 6px 12px;
            font-size: 0.75rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
          }
          .tetu-lb-btn-tool:hover { border-color: #d4af37; color: #d4af37; background: rgba(212, 175, 55, 0.12); }
          .tetu-lb-btn-close {
            width: 34px; height: 34px; border-radius: 50%;
            border: 1px solid rgba(255, 255, 255, 0.12);
            background: rgba(255, 255, 255, 0.05);
            color: #fff;
            font-size: 1.3rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
          }
          .tetu-lb-btn-close:hover { background: #d4af37; color: #07090e; border-color: #d4af37; }
          .tetu-lb-stage {
            flex: 1;
            display: grid;
            grid-template-columns: 1fr 380px;
            overflow: hidden;
            position: relative;
          }
          .tetu-lb-viewport {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            overflow: hidden;
            background: radial-gradient(circle at center, rgba(21, 24, 33, 0.6) 0%, rgba(7, 9, 14, 0.95) 100%);
          }
          .tetu-lb-image-wrapper {
            position: relative;
            max-width: 90%;
            max-height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: zoom-in;
            transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .tetu-lb-image-wrapper.is-zoomed { cursor: zoom-out; }
          .tetu-lb-main-img {
            max-width: 100%;
            max-height: 75vh;
            object-fit: contain;
            border-radius: 12px;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(212, 175, 55, 0.15);
            transition: transform 0.25s ease-out;
            will-change: transform;
          }
          .tetu-lb-nav-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 48px; height: 48px;
            border-radius: 50%;
            background: rgba(16, 19, 26, 0.8);
            border: 1px solid rgba(212, 175, 55, 0.3);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            cursor: pointer;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 5;
          }
          .tetu-lb-nav-arrow:hover {
            background: #d4af37;
            color: #07090e;
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
            transform: translateY(-50%) scale(1.08);
          }
          .tetu-lb-arrow-prev { left: 24px; }
          .tetu-lb-arrow-next { right: 24px; }
          .tetu-lb-sidebar {
            background: #10131a;
            border-left: 1px solid rgba(212, 175, 55, 0.25);
            padding: 2.25rem 2rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            overflow-y: auto;
            box-shadow: -15px 0 35px rgba(0, 0, 0, 0.7);
          }
          .tetu-lb-badge-collection {
            display: inline-block;
            font-size: 0.68rem;
            text-transform: uppercase;
            letter-spacing: 0.16em;
            color: #d4af37;
            border: 1px solid rgba(212, 175, 55, 0.35);
            padding: 3px 10px;
            border-radius: 9999px;
            margin-bottom: 0.75rem;
            width: fit-content;
          }
          .tetu-lb-title {
            font-family: 'Bodoni Moda', Georgia, serif;
            font-size: 1.65rem;
            color: #fff;
            line-height: 1.2;
            margin-bottom: 0.75rem;
          }
          .tetu-lb-desc {
            font-size: 0.86rem;
            color: #9ba1b0;
            line-height: 1.6;
            margin-bottom: 1.5rem;
          }
          .tetu-lb-specs-table {
            background: #151821;
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 10px;
            padding: 1rem 1.2rem;
            margin-bottom: 1.75rem;
          }
          .tetu-lb-spec-row {
            display: flex;
            justify-content: space-between;
            font-size: 0.76rem;
            padding: 6px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          }
          .tetu-lb-spec-row:last-child { border-bottom: none; }
          .tetu-lb-spec-label { color: #646a7a; text-transform: uppercase; letter-spacing: 0.08em; }
          .tetu-lb-spec-val { color: #f5f5f7; font-weight: 500; text-align: right; max-width: 60%; }
          .tetu-lb-actions { display: flex; flex-direction: column; gap: 10px; }
          .tetu-lb-btn-wa {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 13px 20px;
            border-radius: 9999px;
            background: linear-gradient(135deg, #d4af37 0%, #caa12c 100%);
            color: #07090e;
            font-weight: 700;
            font-size: 0.82rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            text-decoration: none;
            box-shadow: 0 4px 18px rgba(212, 175, 55, 0.35);
            transition: all 0.25s;
          }
          .tetu-lb-btn-wa:hover {
            background: linear-gradient(135deg, #e5c158 0%, #d4af37 100%);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5);
          }
          .tetu-lb-btn-cart {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 11px 18px;
            border-radius: 9999px;
            background: transparent;
            color: #f5f5f7;
            border: 1px solid rgba(212, 175, 55, 0.35);
            font-size: 0.78rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.2s;
          }
          .tetu-lb-btn-cart:hover { border-color: #d4af37; color: #d4af37; background: rgba(212, 175, 55, 0.1); }
          .tetu-lb-filmstrip {
            padding: 0.75rem 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            background: #0b0e15;
            display: flex;
            align-items: center;
            gap: 12px;
            overflow-x: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(212, 175, 55, 0.3) transparent;
            z-index: 2;
          }
          .tetu-lb-thumb {
            width: 54px;
            height: 54px;
            border-radius: 8px;
            object-fit: cover;
            border: 1px solid rgba(255, 255, 255, 0.1);
            opacity: 0.5;
            cursor: pointer;
            flex-shrink: 0;
            transition: all 0.2s;
          }
          .tetu-lb-thumb:hover { opacity: 0.85; border-color: rgba(212, 175, 55, 0.5); }
          .tetu-lb-thumb.active {
            opacity: 1;
            border-color: #d4af37;
            box-shadow: 0 0 12px rgba(212, 175, 55, 0.4);
            transform: scale(1.08);
          }
          @media (max-width: 900px) {
            .tetu-lb-stage { grid-template-columns: 1fr; overflow-y: auto; }
            .tetu-lb-viewport { min-height: 48vh; padding: 1.5rem; }
            .tetu-lb-sidebar {
              border-left: none;
              border-top: 1px solid rgba(212, 175, 55, 0.25);
              box-shadow: none;
              padding: 1.5rem;
            }
            .tetu-lb-nav-arrow { width: 38px; height: 38px; font-size: 1rem; }
            .tetu-lb-arrow-prev { left: 10px; }
            .tetu-lb-arrow-next { right: 10px; }
          }
        </style>

        <!-- Lightbox Header Top Bar -->
        <div class="tetu-lb-topbar">
          <div class="tetu-lb-brand-meta">
            <div class="tetu-lb-monogram">TC</div>
            <div class="tetu-lb-counter">
              Piece <span id="tetu-lb-current-index">1</span> of <span id="tetu-lb-total-count">0</span>
            </div>
          </div>
          <div class="tetu-lb-top-actions">
            <button class="tetu-lb-btn-tool" id="tetu-lb-toggle-zoom" title="Toggle Zoom Lens (Z)">
              ðŸ” <span id="tetu-lb-zoom-label">Zoom In</span>
            </button>
            <button class="tetu-lb-btn-close" id="tetu-lb-close-btn" aria-label="Close Lightbox (ESC)">&times;</button>
          </div>
        </div>

        <!-- Main Stage -->
        <div class="tetu-lb-stage">
          <div class="tetu-lb-viewport" id="tetu-lb-viewport-area">
            <button class="tetu-lb-nav-arrow tetu-lb-arrow-prev" id="tetu-lb-btn-prev" aria-label="Previous piece">&#10094;</button>
            <div class="tetu-lb-image-wrapper" id="tetu-lb-img-wrap">
              <img src="" alt="" class="tetu-lb-main-img" id="tetu-lb-main-display">
            </div>
            <button class="tetu-lb-nav-arrow tetu-lb-arrow-next" id="tetu-lb-btn-next" aria-label="Next piece">&#10095;</button>
          </div>

          <!-- Spec Sidebar -->
          <div class="tetu-lb-sidebar">
            <div>
              <div class="tetu-lb-badge-collection" id="tetu-lb-badge">Atelier Showcase</div>
              <h2 class="tetu-lb-title" id="tetu-lb-piece-title">Handcrafted Slide</h2>
              <p class="tetu-lb-desc" id="tetu-lb-piece-desc">Detailed bespoke piece handcrafted from Kenyan leather.</p>

              <div class="tetu-lb-specs-table">
                <div class="tetu-lb-spec-row">
                  <span class="tetu-lb-spec-label">Leather Origin</span>
                  <span class="tetu-lb-spec-val" id="tetu-lb-val-material">Kenyan Calfskin</span>
                </div>
                <div class="tetu-lb-spec-row">
                  <span class="tetu-lb-spec-label">Finish / Shade</span>
                  <span class="tetu-lb-spec-val" id="tetu-lb-val-finish">Signature Tan</span>
                </div>
                <div class="tetu-lb-spec-row">
                  <span class="tetu-lb-spec-label">Atelier</span>
                  <span class="tetu-lb-spec-val">${GALLERY_CONFIG.madeBy}</span>
                </div>
                <div class="tetu-lb-spec-row">
                  <span class="tetu-lb-spec-label">Concierge</span>
                  <span class="tetu-lb-spec-val">${GALLERY_CONFIG.phone}</span>
                </div>
              </div>
            </div>

            <div class="tetu-lb-actions">
              <a href="#" target="_blank" rel="noopener noreferrer" class="tetu-lb-btn-wa" id="tetu-lb-action-wa">
                Enquire on WhatsApp â†—
              </a>
              <button class="tetu-lb-btn-cart" id="tetu-lb-action-bag">
                Add to Acquisition Bag +
              </button>
            </div>
          </div>
        </div>

        <!-- Filmstrip -->
        <div class="tetu-lb-filmstrip" id="tetu-lb-thumbs-container"></div>
      `;

      document.body.appendChild(modal);
    }

    // ------------------------------------------------------------------------
    // 7. Lightbox Presentation & Rendering
    // ------------------------------------------------------------------------
    function updateLightboxContent() {
      const item = state.filteredItems[state.currentIndex];
      if (!item) return;

      const mainImg = document.getElementById('tetu-lb-main-display');
      const titleEl = document.getElementById('tetu-lb-piece-title');
      const descEl = document.getElementById('tetu-lb-piece-desc');
      const badgeEl = document.getElementById('tetu-lb-badge');
      const matEl = document.getElementById('tetu-lb-val-material');
      const finishEl = document.getElementById('tetu-lb-val-finish');
      const curIdxEl = document.getElementById('tetu-lb-current-index');
      const totCountEl = document.getElementById('tetu-lb-total-count');
      const waBtn = document.getElementById('tetu-lb-action-wa');
      const wrapEl = document.getElementById('tetu-lb-img-wrap');

      state.isZoomed = false;
      if (wrapEl) wrapEl.classList.remove('is-zoomed');
      if (mainImg) mainImg.style.transform = 'scale(1)';

      const imgSrc = item.placeholder || item.image || '';
      if (mainImg) {
        mainImg.src = imgSrc;
        mainImg.alt = item.title;
      }

      if (titleEl) titleEl.textContent = item.title;
      if (descEl)
        descEl.textContent =
          item.desc || 'Handcrafted bespoke piece from TETU COLLECTION.';
      if (badgeEl)
        badgeEl.textContent = `${item.category.toUpperCase()} â€¢ ${
          item.tag || 'ATELIER'
        }`;
      if (matEl) matEl.textContent = item.material || 'Kenyan Leather';
      if (finishEl) finishEl.textContent = item.finish || 'Custom Finish';
      if (curIdxEl) curIdxEl.textContent = state.currentIndex + 1;
      if (totCountEl) totCountEl.textContent = state.filteredItems.length;

      if (waBtn) {
        waBtn.href = buildWhatsAppEnquiryUrl(item.title, item.finish);
      }

      const thumbs = document.querySelectorAll('.tetu-lb-thumb');
      thumbs.forEach((thumb, idx) => {
        if (idx === state.currentIndex) {
          thumb.classList.add('active');
          thumb.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest',
          });
        } else {
          thumb.classList.remove('active');
        }
      });
    }

    function renderFilmstrip() {
      const container = document.getElementById('tetu-lb-thumbs-container');
      if (!container) return;

      container.innerHTML = state.filteredItems
        .map((item, idx) => {
          const src = item.placeholder || item.image || '';
          return `
          <img
            src="${src}"
            alt="${item.title}"
            class="tetu-lb-thumb ${idx === state.currentIndex ? 'active' : ''}"
            data-thumb-index="${idx}"
            title="${item.title}"
          />
        `;
        })
        .join('');

      container.querySelectorAll('.tetu-lb-thumb').forEach((thumb) => {
        thumb.addEventListener('click', () => {
          const idx = parseInt(thumb.getAttribute('data-thumb-index'), 10);
          state.currentIndex = idx;
          updateLightboxContent();
        });
      });
    }

    // ------------------------------------------------------------------------
    // 8. Navigation Controls: Next, Prev, Zoom
    // ------------------------------------------------------------------------
    function nextPiece() {
      if (state.filteredItems.length === 0) return;
      state.currentIndex =
        (state.currentIndex + 1) % state.filteredItems.length;
      updateLightboxContent();
    }

    function prevPiece() {
      if (state.filteredItems.length === 0) return;
      state.currentIndex =
        (state.currentIndex - 1 + state.filteredItems.length) %
        state.filteredItems.length;
      updateLightboxContent();
    }

    function toggleZoom(e) {
      const wrap = document.getElementById('tetu-lb-img-wrap');
      const img = document.getElementById('tetu-lb-main-display');
      const label = document.getElementById('tetu-lb-zoom-label');
      if (!wrap || !img) return;

      state.isZoomed = !state.isZoomed;
      wrap.classList.toggle('is-zoomed', state.isZoomed);

      if (state.isZoomed) {
        if (label) label.textContent = 'Zoom Out';
        if (e && e.clientX && e.clientY) {
          const rect = img.getBoundingClientRect();
          const offsetX = ((e.clientX - rect.left) / rect.width) * 100;
          const offsetY = ((e.clientY - rect.top) / rect.height) * 100;
          img.style.transformOrigin = `${offsetX}% ${offsetY}%`;
        } else {
          img.style.transformOrigin = '50% 50%';
        }
        img.style.transform = `scale(${GALLERY_CONFIG.zoomScale})`;
      } else {
        if (label) label.textContent = 'Zoom In';
        img.style.transform = 'scale(1)';
      }
    }

    function handleMouseMovePan(e) {
      if (!state.isZoomed) return;
      const img = document.getElementById('tetu-lb-main-display');
      if (!img) return;

      const rect = img.getBoundingClientRect();
      const offsetX = Math.max(
        0,
        Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)
      );
      const offsetY = Math.max(
        0,
        Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)
      );
      img.style.transformOrigin = `${offsetX}% ${offsetY}%`;
    }

    // ------------------------------------------------------------------------
    // 9. Lightbox Open / Close Public API
    // ------------------------------------------------------------------------
    function openLightbox(index = 0) {
      injectLightboxDOM();

      state.currentIndex = Math.max(
        0,
        Math.min(index, state.filteredItems.length - 1)
      );
      state.isOpen = true;

      const modal = document.getElementById(GALLERY_CONFIG.lightboxId);
      if (!modal) return;

      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';

      renderFilmstrip();
      updateLightboxContent();
    }

    function closeLightbox() {
      const modal = document.getElementById(GALLERY_CONFIG.lightboxId);
      if (!modal) return;

      state.isOpen = false;
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    // ------------------------------------------------------------------------
    // 10. Gallery Filter Engine
    // ------------------------------------------------------------------------
    function filterGallery(category = 'all') {
      state.activeFilter = String(category).toLowerCase();

      if (state.activeFilter === 'all') {
        state.filteredItems = [...DEFAULT_ITEMS];
      } else {
        state.filteredItems = DEFAULT_ITEMS.filter(
          (item) =>
            item.category.toLowerCase() === state.activeFilter ||
            (item.tag && item.tag.toLowerCase() === state.activeFilter)
        );
      }

      state.currentIndex = 0;

      const pageCards = document.querySelectorAll(GALLERY_CONFIG.itemSelector);
      pageCards.forEach((card) => {
        const cardEl = card.closest('.product-card, .catalog-item, article');
        if (!cardEl) return;

        const cardCat = cardEl.getAttribute('data-category') || '';
        if (
          state.activeFilter === 'all' ||
          cardCat.toLowerCase().includes(state.activeFilter)
        ) {
          cardEl.style.display = '';
        } else {
          cardEl.style.display = 'none';
        }
      });

      document
        .querySelectorAll(GALLERY_CONFIG.filterNavSelector)
        .forEach((pill) => {
          const pillFilter = (
            pill.getAttribute('data-gallery-filter') ||
            pill.textContent ||
            ''
          )
            .trim()
            .toLowerCase();
          if (
            pillFilter.includes(state.activeFilter) ||
            (state.activeFilter === 'all' && pillFilter.includes('all'))
          ) {
            pill.classList.add('active');
          } else {
            pill.classList.remove('active');
          }
        });

      if (state.isOpen) {
        renderFilmstrip();
        updateLightboxContent();
      }
    }

    // ========================================================================
    // 11. SMOOTH MOBILE NAVIGATION
    // ========================================================================
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

      els.panel.classList.remove('translate-x-full');
      els.panel.classList.add('translate-x-0', 'open');
      els.panel.setAttribute('aria-hidden', 'false');

      if (els.backdrop) {
        els.backdrop.classList.remove('hidden');
        els.backdrop.classList.add('open');
      }

      if (els.toggle) {
        els.toggle.setAttribute('aria-expanded', 'true');
        els.toggle.classList.add('is-active');
      }

      document.body.classList.add(els.bodyLockClass);
      document.body.style.overflow = 'hidden';
      navState.isOpen = true;
    }

    function closeMobileNav() {
      const els = getNavElements();
      if (!els.panel) return;

      els.panel.classList.add('translate-x-full');
      els.panel.classList.remove('translate-x-0', 'open');
      els.panel.setAttribute('aria-hidden', 'true');

      if (els.backdrop) {
        els.backdrop.classList.add('hidden');
        els.backdrop.classList.remove('open');
      }

      if (els.toggle) {
        els.toggle.setAttribute('aria-expanded', 'false');
        els.toggle.classList.remove('is-active');
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

    // ========================================================================
    // 12. NAVIGATION LINKS â€” Active state + smooth scroll
    // ========================================================================
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

      if ('IntersectionObserver' in window && !window.__tetuSectionObserver) {
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

        if (sections.length > 0) {
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
    // 13. Event Bindings & Gesture Listeners
    // ------------------------------------------------------------------------
    function bindEvents() {
      injectLightboxDOM();

      // Close button
      const closeBtn = document.getElementById('tetu-lb-close-btn');
      if (closeBtn && !closeBtn.__tetuLbBound) {
        closeBtn.__tetuLbBound = true;
        closeBtn.addEventListener('click', closeLightbox);
      }

      // Prev / Next buttons
      const prevBtn = document.getElementById('tetu-lb-btn-prev');
      const nextBtn = document.getElementById('tetu-lb-btn-next');
      if (prevBtn && !prevBtn.__tetuLbBound) {
        prevBtn.__tetuLbBound = true;
        prevBtn.addEventListener('click', prevPiece);
      }
      if (nextBtn && !nextBtn.__tetuLbBound) {
        nextBtn.__tetuLbBound = true;
        nextBtn.addEventListener('click', nextPiece);
      }

      // Zoom toggle button & image click
      const zoomBtn = document.getElementById('tetu-lb-toggle-zoom');
      const imgWrap = document.getElementById('tetu-lb-img-wrap');
      if (zoomBtn && !zoomBtn.__tetuLbBound) {
        zoomBtn.__tetuLbBound = true;
        zoomBtn.addEventListener('click', toggleZoom);
      }
      if (imgWrap && !imgWrap.__tetuLbBound) {
        imgWrap.__tetuLbBound = true;
        imgWrap.addEventListener('click', toggleZoom);
        imgWrap.addEventListener('mousemove', handleMouseMovePan);
      }

      // Add to acquisition bag action from within lightbox
      const addBagBtn = document.getElementById('tetu-lb-action-bag');
      if (addBagBtn && !addBagBtn.__tetuLbBound) {
        addBagBtn.__tetuLbBound = true;
        addBagBtn.addEventListener('click', () => {
          const item = state.filteredItems[state.currentIndex];
          if (!item) return;

          if (window.TetuCart && typeof window.TetuCart.add === 'function') {
            window.TetuCart.add({
              title: item.title,
              category: item.category,
              finish: item.finish,
              image: item.placeholder || item.image,
            });
          } else {
            window.open(
              buildWhatsAppEnquiryUrl(item.title, item.finish),
              '_blank'
            );
          }
        });
      }

      // Keyboard shortcuts
      if (!document.__tetuLbKeyboardBound) {
        document.__tetuLbKeyboardBound = true;
        document.addEventListener('keydown', (e) => {
          if (!state.isOpen) return;

          if (e.key === 'Escape') {
            closeLightbox();
          } else if (e.key === 'ArrowRight') {
            nextPiece();
          } else if (e.key === 'ArrowLeft') {
            prevPiece();
          } else if (e.key.toLowerCase() === 'z') {
            toggleZoom();
          }
        });
      }

      // Touch swipe gestures for mobile
      const viewport = document.getElementById('tetu-lb-viewport-area');
      if (viewport && !viewport.__tetuLbTouchBound) {
        viewport.__tetuLbTouchBound = true;
        viewport.addEventListener(
          'touchstart',
          (e) => {
            state.touchStartX = e.changedTouches[0].screenX;
          },
          { passive: true }
        );

        viewport.addEventListener(
          'touchend',
          (e) => {
            state.touchEndX = e.changedTouches[0].screenX;
            const diff = state.touchStartX - state.touchEndX;
            if (Math.abs(diff) > 45) {
              if (diff > 0) nextPiece();
              else prevPiece();
            }
          },
          { passive: true }
        );
      }

      // Auto-bind clicks on page product cards & images to open lightbox
      document
        .querySelectorAll(
          '.product-card img, .catalog-item img, [data-gallery-trigger]'
        )
        .forEach((img, idx) => {
          if (img.__tetuGalleryTriggerBound) return;
          img.__tetuGalleryTriggerBound = true;
          img.style.cursor = 'pointer';
          img.addEventListener('click', (e) => {
            e.preventDefault();
            const card = img.closest('.product-card, .catalog-item, article');
            const title =
              card?.querySelector('.product-title, h3, h4')?.textContent?.trim() ||
              '';

            const matchIdx = state.filteredItems.findIndex(
              (i) => i.title.toLowerCase() === title.toLowerCase()
            );
            openLightbox(
              matchIdx >= 0 ? matchIdx : idx % state.filteredItems.length
            );
          });
        });

      // Auto-bind category filter pills
      document
        .querySelectorAll(GALLERY_CONFIG.filterNavSelector)
        .forEach((pill) => {
          if (pill.__tetuGalleryFilterBound) return;
          pill.__tetuGalleryFilterBound = true;
          pill.addEventListener('click', () => {
            const cat =
              pill.getAttribute('data-gallery-filter') ||
              pill.getAttribute('data-filter') ||
              'all';
            filterGallery(cat);
          });
        });
    }

    // ------------------------------------------------------------------------
    // 14. Public API Export
    // ------------------------------------------------------------------------
    const API = {
      // Lightbox
      open: openLightbox,
      close: closeLightbox,
      next: nextPiece,
      prev: prevPiece,
      filter: filterGallery,
      zoom: toggleZoom,
      items: () => state.filteredItems,
      config: GALLERY_CONFIG,
      rebind: bindEvents,

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
    // 15. Bootstrapping
    // ------------------------------------------------------------------------
    function init() {
      bindEvents();
      initMobileNavigation();
      initNavigationLinks();

      console.log(
        `%c ${GALLERY_CONFIG.brandName} %c Gallery + Mobile Nav Ready %c Made by ${GALLERY_CONFIG.madeBy} `,
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


/* animation.js */
﻿/**
 * ==========================================================================
 * TETU COLLECTION â€” LUXURY MOTION & AMBIENT ANIMATION CONTROLLER (animation.js)
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

      els.panel.classList.remove('translate-x-full');
      els.panel.classList.add('translate-x-0', 'open');
      els.panel.setAttribute('aria-hidden', 'false');

      if (els.backdrop) {
        els.backdrop.classList.remove('hidden');
        els.backdrop.classList.add('open');
      }

      if (els.toggle) {
        els.toggle.setAttribute('aria-expanded', 'true');
        els.toggle.classList.add('is-active');
      }

      document.body.classList.add(els.bodyLockClass);
      document.body.style.overflow = 'hidden';
      navState.isOpen = true;
    }

    function closeMobileNav() {
      const els = getNavElements();
      if (!els.panel) return;

      els.panel.classList.add('translate-x-full');
      els.panel.classList.remove('translate-x-0', 'open');
      els.panel.setAttribute('aria-hidden', 'true');

      if (els.backdrop) {
        els.backdrop.classList.add('hidden');
        els.backdrop.classList.remove('open');
      }

      if (els.toggle) {
        els.toggle.setAttribute('aria-expanded', 'false');
        els.toggle.classList.remove('is-active');
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
    // 11. NAVIGATION LINKS â€” Active state + smooth scroll
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


/* navigation.js */
﻿/**
 * ==========================================================================
 * TETU COLLECTION â€” GLOBAL NAVIGATION & CHROME CONTROLLER (navigation.js)
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
      panel.classList.remove('translate-x-full');
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
      panel.classList.add('translate-x-full');
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

      document.addEventListener('click', (e) => {
        const closeButton = panel && panel.querySelector('#mobile-menu-close');
        if (closeButton && closeButton.contains(e.target)) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          closeMobileNav();
          return;
        }

        if (!toggle.contains(e.target)) return;

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        const isOpen = panel
          ? panel.classList.contains('translate-x-0')
          : state.isMobileMenuOpen;
        if (isOpen) {
          closeMobileNav();
        } else {
          openMobileNav();
        }
      }, true);
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


/* main.js */
﻿/**
 * ==========================================================================
 * TETU COLLECTION â€” CLIENT-SIDE LOGIC & INTERACTIONS (main.js)
 * Brand: TETU COLLECTION
 * Atelier / Made by: Bossy designs
 * Contact / WhatsApp Concierge: +254700309655
 * Theme: Luxury Dark Noir & Brushed Warm Gold (#d4af37)
 * ==========================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Configuration & Constants
  // --------------------------------------------------------------------------
  const ATELIER_CONFIG = {
    brandName: 'TETU COLLECTION',
    madeBy: 'Bossy designs',
    phone: '+254700309655',
    phoneRaw: '254700309655', // formatted for wa.me API
    storageKey: 'tetu_collection_reviews_v1',
    realtimeChannel: 'tetu_collection_reviews_realtime_v1',
    animationSpeed: 300,
  };

  // State object
  const state = {
    selectedRating: 5,
    activeFilter: 'all',
    reviews: [],
    audioInstance: null,
    isMobileMenuOpen: false,
    reviewChannel: null,
  };

  // --------------------------------------------------------------------------
  // DOM Elements Selector Helper
  // --------------------------------------------------------------------------
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  // --------------------------------------------------------------------------
  // LocalStorage / Persistence Manager
  // --------------------------------------------------------------------------
  function loadPersistedReviews() {
    try {
      const data = localStorage.getItem(ATELIER_CONFIG.storageKey);
      if (data) {
        state.reviews = normaliseReviews(JSON.parse(data));
      } else {
        state.reviews = [];
      }
    } catch (e) {
      console.warn('TETU COLLECTION: Local storage inaccessible, using memory state.', e);
      state.reviews = [];
    }
  }

  function persistReviews() {
    try {
      localStorage.setItem(ATELIER_CONFIG.storageKey, JSON.stringify(state.reviews));
    } catch (e) {
      console.warn('TETU COLLECTION: Could not persist reviews to local storage.', e);
    }
  }

  // --------------------------------------------------------------------------
  // Real-time Review Feed â€” BroadcastChannel + storage fallback
  // --------------------------------------------------------------------------
  function normaliseReviews(reviews) {
    if (!Array.isArray(reviews)) return [];

    return reviews.filter((review) => (
      review &&
      typeof review.name === 'string' &&
      typeof review.comment === 'string' &&
      typeof review.rating === 'number' &&
      review.rating >= 1 &&
      review.rating <= 5
    ));
  }

  function refreshReviewsFromRemote(reviews) {
    state.reviews = normaliseReviews(reviews);
    updateMetricsUI();
    renderReviewsFeed();
  }

  function broadcastReviews() {
    if (state.reviewChannel) {
      state.reviewChannel.postMessage({ reviews: state.reviews });
    }
  }

  function initReviewRealtime() {
    if ('BroadcastChannel' in window) {
      state.reviewChannel = new BroadcastChannel(ATELIER_CONFIG.realtimeChannel);
      state.reviewChannel.addEventListener('message', (event) => {
        if (event.data && Array.isArray(event.data.reviews)) {
          refreshReviewsFromRemote(event.data.reviews);
        }
      });
    }

    window.addEventListener('storage', (event) => {
      if (event.key !== ATELIER_CONFIG.storageKey) return;

      try {
        refreshReviewsFromRemote(event.newValue ? JSON.parse(event.newValue) : []);
      } catch (error) {
        console.warn('TETU COLLECTION: Ignoring an invalid live review update.', error);
      }
    });
  }

  // --------------------------------------------------------------------------
  // Utilities & Formatters
  // --------------------------------------------------------------------------
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getInitials(name) {
    if (!name) return 'TC';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  function buildWhatsAppURL(text) {
    return `https://wa.me/${ATELIER_CONFIG.phoneRaw}?text=${encodeURIComponent(String(text).trim())}`;
  }

  function showToast(message, isSuccess = true) {
    let toast = $('#tetu-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'tetu-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 99999;
        background: #151821;
        border: 1px solid #d4af37;
        color: #f5f5f7;
        padding: 14px 24px;
        border-radius: 9999px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 0.85rem;
        letter-spacing: 0.04em;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.25);
        opacity: 0;
        transform: translateY(15px);
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: none;
        max-width: calc(100vw - 40px);
      `;
      document.body.appendChild(toast);
    }

    const icon = isSuccess ? 'âœ¦' : 'âš ';
    toast.innerHTML = `<span style="color: #d4af37; font-weight: bold;">${icon}</span> <span>${escapeHTML(message)}</span>`;

    // Animate in
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    // Auto-dismiss
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
    }, 4000);
  }

  // --------------------------------------------------------------------------
  // MOBILE NAVIGATION â€” Smooth Toggle, Backdrop & Body Scroll Lock
  // --------------------------------------------------------------------------
  function initMobileNavigation() {
    const menuToggle = $('#mobile-menu-toggle') || $('.mobile-menu-toggle');
    const mobileMenuPanel = $('#mobile-menu-panel') || $('.mobile-menu-panel');
    const mobileMenuBackdrop = $('#mobile-menu-backdrop') || $('.mobile-menu-backdrop');

    if (!menuToggle || !mobileMenuPanel) return;

    function openMenu() {
      mobileMenuPanel.classList.remove('translate-x-full');
      mobileMenuPanel.classList.add('translate-x-0', 'open');
      if (mobileMenuBackdrop) {
        mobileMenuBackdrop.classList.remove('hidden');
        mobileMenuBackdrop.classList.add('open');
      }
      document.body.classList.add('menu-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      state.isMobileMenuOpen = true;

      // Update hamburger icon to "close"
    }

    function closeMenu() {
      mobileMenuPanel.classList.add('translate-x-full');
      mobileMenuPanel.classList.remove('translate-x-0', 'open');
      if (mobileMenuBackdrop) {
        mobileMenuBackdrop.classList.add('hidden');
        mobileMenuBackdrop.classList.remove('open');
      }
      document.body.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      state.isMobileMenuOpen = false;

      // Update close icon back to "menu"
    }

    // Toggle on click
    menuToggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (state.isMobileMenuOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close on backdrop click
    if (mobileMenuBackdrop) {
      mobileMenuBackdrop.addEventListener('click', closeMenu);
    }

    // Close when clicking a link inside the panel
    const mobileLinks = mobileMenuPanel.querySelectorAll('a');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        // Small delay so navigation feels smooth
        setTimeout(closeMenu, 150);
      });
    });

    // Close on window resize if width becomes >= 1024px (desktop)
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth >= 1024 && state.isMobileMenuOpen) {
          closeMenu();
        }
      }, 150);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.isMobileMenuOpen) {
        closeMenu();
      }
    });
  }

  // --------------------------------------------------------------------------
  // Interactive 5-Star Rating Picker
  // --------------------------------------------------------------------------
  function initStarRating() {
    const starPicker = $('.star-rating-picker');
    const starButtons = $$('.star-btn');
    const starHint = $('.star-rating-hint');
    const hiddenInput = $('#selected-rating') || $('input[name="rating"]');

    if (!starPicker || !starButtons.length) return;

    const ratingDescriptions = {
      1: '1 Star â€” Needs Improvement',
      2: '2 Stars â€” Fair Craftsmanship',
      3: '3 Stars â€” Good Bespoke Quality',
      4: '4 Stars â€” Highly Impressed',
      5: '5 Stars â€” Exceptional Luxury',
    };

    function updateStarsDisplay(rating) {
      starButtons.forEach((btn, index) => {
        const val = index + 1;
        const svg = btn.querySelector('svg');
        if (val <= rating) {
          btn.classList.add('active');
          btn.style.color = '#d4af37';
          btn.setAttribute('aria-checked', 'true');
          if (svg) {
            svg.classList.add('fill-primary', 'text-primary');
            svg.classList.remove('fill-none', 'text-slate-600');
          }
        } else {
          btn.classList.remove('active');
          btn.style.color = '#3e4453';
          btn.setAttribute('aria-checked', 'false');
          if (svg) {
            svg.classList.remove('fill-primary', 'text-primary');
            svg.classList.add('fill-none', 'text-slate-600');
          }
        }
      });

      if (starHint) {
        starHint.textContent = ratingDescriptions[rating] || `${rating} Stars`;
      }
      if (hiddenInput) {
        hiddenInput.value = rating;
      }
    }

    starButtons.forEach((btn) => {
      const val = parseInt(
        btn.getAttribute('data-value') || btn.getAttribute('data-val') || btn.value || '5',
        10
      );

      btn.addEventListener('mouseenter', () => updateStarsDisplay(val));
      btn.addEventListener('mouseleave', () => updateStarsDisplay(state.selectedRating));

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        state.selectedRating = val;
        updateStarsDisplay(state.selectedRating);
      });
    });

    updateStarsDisplay(state.selectedRating);
  }

  // --------------------------------------------------------------------------
  // Metric Counters & Summary Sync
  // --------------------------------------------------------------------------
  function updateMetricsUI() {
    const totalCount = state.reviews.length;
    const footwearCount = state.reviews.filter((r) => r.category === 'footwear').length;
    const bagsCount = state.reviews.filter((r) => r.category === 'bags').length;

    // Filter tabs badge counts (supports both CSS class and data-filter)
    const pillAll = $('[data-filter="all"]') || $('#tab-all');
    const pillFootwear = $('[data-filter="footwear"]') || $('#tab-footwear');
    const pillBags = $('[data-filter="bags"]') || $('#tab-bags');

    if (pillAll) pillAll.textContent = `All (${totalCount})`;
    if (pillFootwear) pillFootwear.textContent = `Footwear (${footwearCount})`;
    if (pillBags) pillBags.textContent = `Bags (${bagsCount})`;

    // Top metrics strip elements
    const metricRatingEl = $('#stat-avg-rating') || $('.metric-col:nth-child(1) .metric-value');
    const metricSubRatingEl = $('#stat-review-count') || $('.metric-col:nth-child(1) .metric-sublabel');

    if (metricRatingEl && metricSubRatingEl) {
      if (totalCount === 0) {
        metricRatingEl.innerHTML = `â€” <span class="gold-val">/ 5.0</span>`;
        metricSubRatingEl.textContent = '0 Reviews';
      } else {
        const sum = state.reviews.reduce((acc, cur) => acc + (cur.rating || 5), 0);
        const avg = (sum / totalCount).toFixed(1);
        metricRatingEl.innerHTML = `${avg} <span class="gold-val">/ 5.0</span>`;
        metricSubRatingEl.textContent = `${totalCount} ${totalCount === 1 ? 'Review' : 'Reviews'}`;
      }
    }
  }

  // --------------------------------------------------------------------------
  // Reviews Stream Rendering (Live Feed & Empty State)
  // --------------------------------------------------------------------------
  function renderReviewsFeed() {
    const feedContainer =
      $('#reviews-list-container') ||
      $('#reviews-feed') ||
      $('.reviews-stream-panel .feed-content');

    if (!feedContainer) return;

    // Remove any previously rendered cards (except the empty-state placeholder)
    feedContainer.querySelectorAll('.review-item, .review-item-card').forEach((el) => el.remove());

    // Filter by active category
    let displayedReviews = state.reviews;
    if (state.activeFilter !== 'all') {
      displayedReviews = state.reviews.filter((r) => r.category === state.activeFilter);
    }

    const emptyState = feedContainer.querySelector('#empty-state') || feedContainer.querySelector('.empty-reviews-card');

    if (displayedReviews.length === 0) {
      if (emptyState) emptyState.style.display = '';
      return;
    }

    // Hide empty state
    if (emptyState) emptyState.style.display = 'none';

    // Build cards HTML
    const cardsHTML = displayedReviews
      .map((rev) => {
        const starsDisplay = 'â˜…'.repeat(rev.rating) + 'â˜†'.repeat(5 - rev.rating);
        const initials = getInitials(rev.name);
        const timeAgo = rev.date ? rev.date : 'Just now';

        return `
        <article class="review-item-card" data-category="${escapeHTML(rev.category)}" style="animation: fadeIn 0.35s ease forwards;">
          <div class="card-top">
            <div class="review-client-meta">
              <div class="client-avatar" aria-hidden="true">${escapeHTML(initials)}</div>
              <div class="client-details">
                <div class="client-name">${escapeHTML(rev.name)}</div>
                <div class="client-loc">${escapeHTML(rev.location || 'Kenya')} â€¢ <span style="color: #d4af37;">Verified Purchase</span></div>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
              <div class="stars" aria-label="${rev.rating} out of 5 stars">${starsDisplay}</div>
              <span style="font-size: 0.72rem; color: #646a7a;">${escapeHTML(timeAgo)}</span>
            </div>
          </div>
          <p class="review-text">"${escapeHTML(rev.comment || rev.message || '')}"</p>
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <span class="product-tag-pill">Piece: ${escapeHTML(rev.piece)}</span>
            <a href="${buildWhatsAppURL(`Hello TETU COLLECTION, regarding the review by ${rev.name} on the "${rev.piece}"...`)}"
               target="_blank"
               rel="noopener noreferrer"
               style="font-size: 0.72rem; color: #d4af37; text-transform: uppercase; letter-spacing: 0.08em; display: inline-flex; align-items: center; gap: 4px;">
              Verify with Atelier â†—
            </a>
          </div>
        </article>
        `;
      })
      .join('');

    // Insert new cards after empty state (or at top of container)
    if (emptyState) {
      emptyState.insertAdjacentHTML('afterend', cardsHTML);
    } else {
      feedContainer.insertAdjacentHTML('afterbegin', cardsHTML);
    }
  }

  // --------------------------------------------------------------------------
  // Category Filter Tabs
  // --------------------------------------------------------------------------
  function initFilterTabs() {
    const filterButtons = $$('.filter-btn, .review-filter-btn');
    if (!filterButtons.length) return;

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        filterButtons.forEach((b) => {
          b.classList.remove(
            'active',
            'bg-primary',
            'text-black',
            'text-on-primary',
            'text-slate-300'
          );
          b.classList.add('bg-surface-container', 'text-on-surface-variant');
        });
        btn.classList.add('active', 'bg-primary', 'text-on-primary');
        btn.classList.remove('bg-surface-container', 'text-on-surface-variant');

        state.activeFilter = btn.getAttribute('data-filter') || 'all';

        // Filter DOM items (for static reviews.html cards)
        const staticItems = $$('.review-item');
        if (staticItems.length) {
          staticItems.forEach((item) => {
            const cat = item.getAttribute('data-category');
            if (state.activeFilter === 'all' || cat === state.activeFilter) {
              item.classList.remove('hidden');
            } else {
              item.classList.add('hidden');
            }
          });
        }

        renderReviewsFeed();
      });
    });
  }

  // --------------------------------------------------------------------------
  // Feedback Form Handler (Live DOM + WhatsApp Routing)
  // --------------------------------------------------------------------------
  function initFeedbackForm() {
    const form = $('#review-form') || $('#feedback-form');
    const btnSubmitReview = $('#btn-submit-review');
    const btnWhatsAppOnly = $('#btn-send-whatsapp');

    const nameInput = $('#reviewer-name') || $('#client-name');
    const locationInput = $('#reviewer-location') || $('#client-location');
    const pieceSelect = $('#reviewer-piece') || $('#client-piece');
    const reviewInput = $('#reviewer-message') || $('#client-review');
    const confirmation = $('#submission-confirmation');

    if (!form) return;

    function getFormData() {
      const name = nameInput ? nameInput.value.trim() : '';
      const location = locationInput ? locationInput.value.trim() : 'Nairobi, Kenya';
      const piece = pieceSelect ? pieceSelect.value : 'Handcrafted Leather Slides';
      const comment = reviewInput ? reviewInput.value.trim() : '';
      return { name, location, piece, comment };
    }

    function determineCategory(pieceTitle) {
      const lower = (pieceTitle || '').toLowerCase();
      if (
        lower.includes('bag') ||
        lower.includes('clutch') ||
        lower.includes('tote') ||
        lower.includes('pochette') ||
        lower.includes('crescent') ||
        lower.includes('hobo') ||
        lower.includes('maroquinerie')
      ) {
        return 'bags';
      }
      return 'footwear';
    }

    // Submit review live into the page
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = getFormData();

      if (!data.name) {
        showToast('Please provide your full name to submit a review.', false);
        if (nameInput) nameInput.focus();
        return;
      }

      if (!data.comment) {
        showToast('Please share your thoughts on the craft, fit, or leather finish.', false);
        if (reviewInput) reviewInput.focus();
        return;
      }

      const newReview = {
        id: 'rev_' + Date.now(),
        name: data.name,
        location: data.location || 'Nairobi',
        piece: data.piece,
        rating: state.selectedRating,
        comment: data.comment,
        category: determineCategory(data.piece),
        date: 'Just now',
        timestamp: Date.now(),
      };

      state.reviews.unshift(newReview);
      persistReviews();
      broadcastReviews();
      updateMetricsUI();
      renderReviewsFeed();

      // Clear inputs
      if (nameInput) nameInput.value = '';
      if (locationInput) locationInput.value = '';
      if (reviewInput) reviewInput.value = '';

      // Reset stars
      const starButtons = $$('.star-btn');
      if (starButtons.length) {
        state.selectedRating = 5;
        starButtons.forEach((btn, idx) => {
          if (idx < 5) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      }

      if (confirmation) {
        confirmation.classList.remove('hidden');
        setTimeout(() => confirmation.classList.add('hidden'), 6000);
      }

      showToast('Thank you! Your verified review has been published.', true);
    });

    // Direct WhatsApp submission (alternative button)
    if (btnWhatsAppOnly) {
      btnWhatsAppOnly.addEventListener('click', function (e) {
        e.preventDefault();
        const data = getFormData();
        const starsStr = 'â˜…'.repeat(state.selectedRating) + ` (${state.selectedRating}/5)`;
        const message =
`Hello TETU COLLECTION (+254700309655),

I would like to share my bespoke client feedback:
â€¢ Client: ${data.name || 'Anonymous Client'}
â€¢ Location: ${data.location || 'Kenya'}
â€¢ Piece Owned: ${data.piece}
â€¢ Rating: ${starsStr}
â€¢ Feedback: ${data.comment || 'Exceptional craftsmanship by Bossy designs!'}

Made by Bossy designs`;

        window.open(buildWhatsAppURL(message), '_blank', 'noopener,noreferrer');
      });
    }
  }

  // --------------------------------------------------------------------------
  // Contact Form Handler (index.html / contact.html)
  // --------------------------------------------------------------------------
  function initContactForm() {
    const contactForm = $('#contact-form') || $('#enquire-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameEl = contactForm.querySelector('[name="name"]') || $('#contact-name');
      const phoneEl = contactForm.querySelector('[name="phone"]') || $('#contact-phone');
      const interestEl = contactForm.querySelector('[name="piece"]') || $('#contact-interest');
      const msgEl = contactForm.querySelector('[name="message"]') || $('#contact-message');

      const name = nameEl ? nameEl.value.trim() : 'Client';
      const phone = phoneEl ? phoneEl.value.trim() : '';
      const piece = interestEl ? interestEl.value : 'TETU COLLECTION Piece';
      const msg = msgEl ? msgEl.value.trim() : '';

      if (!name || !msg) {
        showToast('Please complete all required fields before sending.', false);
        return;
      }

      const waText =
`Hello TETU COLLECTION,

*Name:* ${name}
${phone ? `*Phone:* ${phone}\n` : ''}*Interest:* ${piece}

*Message:*
"${msg}"

Sent from TETU COLLECTION website â€¢ Made by Bossy designs`;

      window.open(buildWhatsAppURL(waText), '_blank', 'noopener,noreferrer');
      showToast('Opening WhatsApp Concierge...', true);
    });
  }

  // --------------------------------------------------------------------------
  // Product Catalog WhatsApp Enquire Buttons
  // --------------------------------------------------------------------------
  function initProductEnquireButtons() {
    const productButtons = $$('.btn-enquire-whatsapp, [data-enquire-product]');
    if (!productButtons.length) return;

    productButtons.forEach((btn) => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const productName =
          btn.getAttribute('data-enquire-product') ||
          btn.closest('.product-card')?.querySelector('.product-title')?.textContent?.trim() ||
          'TETU Collection Luxury Piece';

        const waText =
`Hello TETU COLLECTION,

I am interested in acquiring/customizing the following piece:
â€¢ Piece: "${productName}"

Please advise on bespoke sizing, availability, and pricing.

(+254700309655 â€¢ Made by Bossy designs)`;

        window.open(buildWhatsAppURL(waText), '_blank', 'noopener,noreferrer');
      });
    });
  }

  // --------------------------------------------------------------------------
  // Smooth Scroll for Anchor Links & Active Link Sync
  // --------------------------------------------------------------------------
  function initNavigation() {
    // Smooth scroll for same-page anchors
    const anchors = $$('a[href^="#"]');
    anchors.forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#' || targetId.length < 2) return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

          // Update URL hash without jumping
          if (history.pushState) {
            history.pushState(null, '', targetId);
          }
        }
      });
    });

    // Active link sync based on current pathname
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = $$('.nav-links a, .mobile-menu-panel a');

    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const linkPath = href.split('/').pop().split('#')[0];

      link.classList.remove('active', 'text-primary', 'border-b', 'border-primary');

      if (linkPath === currentPath) {
        link.classList.add('active', 'text-primary');
        // Preserve existing border if it's the desktop nav
        if (link.closest('.nav-links')) {
          link.classList.add('border-b', 'border-primary');
        }
      }
    });

    // Update active link on scroll (for single-page sections)
    const sections = $$('section[id]');
    if (sections.length && window.location.pathname.endsWith('index.html')) {
      window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 120;
        let currentSectionId = '';

        sections.forEach((section) => {
          if (section.offsetTop <= scrollPos) {
            currentSectionId = section.id;
          }
        });

        if (currentSectionId) {
          navLinks.forEach((link) => {
            const href = link.getAttribute('href') || '';
            if (href.startsWith('#') || href.includes('index.html#')) {
              const hash = href.includes('#') ? '#' + href.split('#')[1] : '';
              if (hash === '#' + currentSectionId) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            }
          });
        }
      }, { passive: true });
    }
  }

  // --------------------------------------------------------------------------
  // Main Initialization Routine
  // --------------------------------------------------------------------------
  function init() {
    loadPersistedReviews();
    initReviewRealtime();
    initMobileNavigation();
    initStarRating();
    initFilterTabs();
    initFeedbackForm();
    initContactForm();
    initProductEnquireButtons();
    initNavigation();
    updateMetricsUI();
    renderReviewsFeed();

    console.log(
      `%c ${ATELIER_CONFIG.brandName} %c Made by ${ATELIER_CONFIG.madeBy} %c ${ATELIER_CONFIG.phone} `,
      'background: #d4af37; color: #0b0e15; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px;',
      'background: #151821; color: #d4af37; padding: 4px 8px;',
      'background: #212532; color: #fff; padding: 4px 8px; border-radius: 0 4px 4px 0;'
    );
  }

  // Bootstrapping on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
