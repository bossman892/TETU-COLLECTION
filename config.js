/**
 * ==========================================================================
 * TETU COLLECTION — GLOBAL CONFIGURATION & ENVIRONMENT SETUP (config.js)
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
            'https://www.tiktok.com/@tetucollection?_r=1&_d=ec9145l8ih51jj&sec_uid=MS4wLjABAAAAkJCod8PPbU2JYWQWJAxcmEJQx8rNmAU6BltOCit7fhA61G-xjRPUIw9SC1lgw-kW',
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
          weekdays: 'Mon – Fri: 8:00 AM – 7:00 PM',
          weekends: 'Sat – Sun: 10:00 AM – 6:00 PM',
        },
        defaultEnquiryMessage:
          'Hello TETU COLLECTION (+254700309655),\nI would like to enquire about bespoke leather footwear and evening bags from your atelier.\n\nMade by Bossy designs',
        orderMessageTemplate: (productName, variant = '') =>
          `Hello TETU COLLECTION,\n\nI am interested in acquiring the bespoke piece: "${productName}"${
            variant ? ` (Finish: ${variant})` : ''
          }.\nPlease advise on availability, sizing, and payment details.\n\n(+254700309655 • Made by Bossy designs)`,
        reviewMessageTemplate: ({ name, location, piece, rating, comment }) =>
          `Hello TETU COLLECTION (+254700309655),\n\nI would like to share my bespoke client feedback:\n• Client: ${
            name || 'Anonymous Client'
          }\n• Location: ${location || 'Kenya'}\n• Piece Owned: ${piece}\n• Rating: ${'★'.repeat(
            rating || 5
          )} (${rating || 5}/5)\n• Feedback: ${
            comment || 'Exceptional craftsmanship by Bossy designs!'
          }\n\nMade by Bossy designs`,
        contactMessageTemplate: ({ name, phone, interest, message }) =>
          `Hello TETU COLLECTION,\n\n*Name:* ${name}\n${
            phone ? `*Phone:* ${phone}\n` : ''
          }*Interest:* ${interest}\n\n*Message:*\n"${message}"\n\nSent from TETU COLLECTION website • Made by Bossy designs`,
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
        breakpoint: 1024, // px — menu collapses below this width
        toggleSelector: '#mobile-menu-toggle, #mobile-nav-toggle, .mobile-menu-toggle, .mobile-menu-btn',
        panelSelector: '#mobile-menu-panel, .mobile-menu-panel',
        backdropSelector: '#mobile-menu-backdrop, .mobile-menu-backdrop',
        navLinksSelector: '.nav-links',
        animationDuration: 300, // ms — must match CSS transition
        slideClass: '-translate-x-full',
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
        audioStateKey: 'tetu_atmosphere_sound_v1',
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
          1: '1 Star — Needs Improvement',
          2: '2 Stars — Fair Craftsmanship',
          3: '3 Stars — Good Bespoke Quality',
          4: '4 Stars — Highly Impressed',
          5: '5 Stars — Exceptional Luxury',
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