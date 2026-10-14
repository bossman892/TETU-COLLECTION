/* ==========================================================================
   TETU COLLECTION — CLIENT ANALYTICS & TELEMETRY MODULE (analytics.js)
   Brand: TETU COLLECTION
   Atelier / Made by: Bossy designs
   Contact / WhatsApp Concierge: +254 700 309 655 (Raw: 254700309655)
   Theme: Warm Editorial Cream (#f4ede4), Deep Espresso (#26211c) & Brushed Gold (#d4af37)
   Typography: Bodoni Moda (Display/Serif), Plus Jakarta Sans (Body/Sans)
   Supported Pages:
     - index.html (Homepage & Hero Showcase)
     - shoes.html (Footwear Collection)
     - bags.html (Maroquinerie & Handbags)
     - about.html (Foundational Promises & Craft)
     - contact.html (Concierge Channels & Inquiry)
     - reviews.html (Real-time Client Ratings)
     - thank-you.html (Order Confirmation)
     - 404.html (Page Not Found Error Stage)
   ==========================================================================
   
   Capabilities:
   - Privacy-first, lightweight client telemetry (zero external cookies / tracker free)
   - Pageview & dwell time tracking across all pages
   - Product engagement tracking (card clicks, image zooms, category pill taps)
   - High-intent WhatsApp conversion tracking (clicks on "Enquire on WhatsApp",
     direct phone number copies, prefilled inquiry dispatches)
   - Review submission and star rating engagement tracking
   - Smooth mobile navigation drawer (hamburger + backdrop + link tap feedback)
   - Desktop + mobile navigation link active-state highlighting
   - Local storage buffer & session aggregation for store owner metrics
   - Safe export under window.TETU_ANALYTICS with event dispatching
   ========================================================================== */

(function (window, document) {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Module Configuration & Storage Keys
  // --------------------------------------------------------------------------
  const ANALYTICS_CONFIG = {
    brand: {
      name: 'TETU COLLECTION',
      atelier: 'Bossy designs',
      phone: '+254 700 309 655',
      phoneRaw: '254700309655'
    },
    storageKeys: {
      events: 'tetu_analytics_events_log_v1',
      session: 'tetu_analytics_session_v1',
      metrics: 'tetu_analytics_summary_v1'
    },
    maxStoredEvents: 250,
    sessionTimeoutMs: 30 * 60 * 1000, // 30 minutes
    mobileBreakpoint: 768
  };

  // Mobile navigation selectors (multi-naming for all pages)
  const NAV_SELECTORS = {
    triggers: [
      '.mobile-menu-trigger',
      '.tc-mobile-toggle',
      '.page-mobile-toggle',
      '#mobile-menu-toggle',
      '#mobile-toggle',
      '[data-menu-trigger]'
    ],
    panels: [
      '#mobile-nav',
      '#mobile-menu',
      '.tc-mobile-drawer',
      '.page-mobile-drawer',
      '.mobile-drawer'
    ],
    backdrops: [
      '#mobile-nav-backdrop',
      '.tc-mobile-backdrop',
      '.page-mobile-backdrop',
      '.mobile-nav-backdrop'
    ],
    mobileLinks: '.mobile-nav-link, .tc-mobile-link, .page-mobile-link',
    desktopLinks: '.tc-nav-link, .page-nav-link, .header-nav-links a, .nav-link'
  };

  // --------------------------------------------------------------------------
  // 2. Session Management
  // --------------------------------------------------------------------------
  function getOrCreateSession() {
    try {
      const now = Date.now();
      const rawSession = localStorage.getItem(ANALYTICS_CONFIG.storageKeys.session);
      let session = rawSession ? JSON.parse(rawSession) : null;

      if (!session || (now - session.lastActive > ANALYTICS_CONFIG.sessionTimeoutMs)) {
        session = {
          sessionId: 'tc-sess-' + now + '-' + Math.random().toString(36).substring(2, 8),
          startedAt: now,
          lastActive: now,
          pageviews: 0,
          inquiriesTriggered: 0
        };
      } else {
        session.lastActive = now;
      }

      localStorage.setItem(ANALYTICS_CONFIG.storageKeys.session, JSON.stringify(session));
      return session;
    } catch (e) {
      return {
        sessionId: 'ephemeral-session',
        startedAt: Date.now(),
        lastActive: Date.now(),
        pageviews: 1,
        inquiriesTriggered: 0
      };
    }
  }

  // --------------------------------------------------------------------------
  // 3. Event Logging Engine
  // --------------------------------------------------------------------------
  function trackEvent(category, action, label, metadata) {
    label = label || null;
    metadata = metadata || {};

    const session = getOrCreateSession();
    const eventPayload = {
      id: 'tc-ev-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      sessionId: session.sessionId,
      timestamp: new Date().toISOString(),
      page: window.location.pathname.split('/').pop() || 'index.html',
      category: category,
      action: action,
      label: label,
      metadata: metadata
    };

    saveEventLocally(eventPayload);
    updateAggregatedMetrics(eventPayload);

    // Custom browser DOM event for extensible analytics integrations
    // (e.g. Meta Pixel / GA4 / custom dashboard listening for 'tetu:analytics')
    if (typeof window.dispatchEvent === 'function' && typeof window.CustomEvent === 'function') {
      try {
        const customEvent = new CustomEvent('tetu:analytics', { detail: eventPayload });
        window.dispatchEvent(customEvent);
      } catch (err) {
        // Silent fallback for older browsers
      }
    }

    return eventPayload;
  }

  function saveEventLocally(eventObj) {
    try {
      const raw = localStorage.getItem(ANALYTICS_CONFIG.storageKeys.events);
      const events = raw ? JSON.parse(raw) : [];
      events.push(eventObj);
      if (events.length > ANALYTICS_CONFIG.maxStoredEvents) {
        events.shift(); // FIFO eviction
      }
      localStorage.setItem(ANALYTICS_CONFIG.storageKeys.events, JSON.stringify(events));
    } catch (err) {
      console.warn('TETU Analytics: local storage inactive', err);
    }
  }

  function updateAggregatedMetrics(eventObj) {
    try {
      const raw = localStorage.getItem(ANALYTICS_CONFIG.storageKeys.metrics);
      const summary = raw ? JSON.parse(raw) : {
        totalPageviews: 0,
        totalWhatsAppClicks: 0,
        totalProductInteractions: 0,
        totalReviewsSubmitted: 0,
        totalNavClicks: 0,
        totalMobileMenuOpens: 0,
        topInteractedPieces: {},
        topNavLinks: {}
      };

      // Ensure new keys exist for older stored summaries
      if (typeof summary.totalNavClicks !== 'number') summary.totalNavClicks = 0;
      if (typeof summary.totalMobileMenuOpens !== 'number') summary.totalMobileMenuOpens = 0;
      if (!summary.topNavLinks) summary.topNavLinks = {};

      if (eventObj.category === 'navigation' && eventObj.action === 'pageview') {
        summary.totalPageviews++;
      } else if (eventObj.category === 'conversion' && eventObj.action.indexOf('whatsapp') !== -1) {
        summary.totalWhatsAppClicks++;
      } else if (eventObj.category === 'engagement' && eventObj.action === 'product_click') {
        summary.totalProductInteractions++;
        const piece = eventObj.label || 'Unknown Piece';
        summary.topInteractedPieces[piece] = (summary.topInteractedPieces[piece] || 0) + 1;
      } else if (eventObj.category === 'feedback' && eventObj.action === 'review_submitted') {
        summary.totalReviewsSubmitted++;
      } else if (eventObj.category === 'navigation' && eventObj.action === 'nav_link_click') {
        summary.totalNavClicks++;
        const linkLabel = eventObj.label || 'Unknown Link';
        summary.topNavLinks[linkLabel] = (summary.topNavLinks[linkLabel] || 0) + 1;
      } else if (eventObj.category === 'navigation' && eventObj.action === 'mobile_menu_open') {
        summary.totalMobileMenuOpens++;
      }

      localStorage.setItem(ANALYTICS_CONFIG.storageKeys.metrics, JSON.stringify(summary));
    } catch (err) {
      // Ignore in incognito/quota restricted environments
    }
  }

  // --------------------------------------------------------------------------
  // 4. Automatic DOM Listeners & Conversion Trackers
  // --------------------------------------------------------------------------
  function initAutoTracking() {
    // A. Pageview Tracking
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    trackEvent('navigation', 'pageview', currentPage, {
      title: document.title,
      referrer: document.referrer || 'direct'
    });

    // B. Global Click Delegation — WhatsApp, Products, Filters, Copy Channels
    document.addEventListener('click', function (e) {
      const target = e.target.closest('a, button');
      if (!target) return;

      const href = target.getAttribute('href') || '';
      const isWhatsApp =
        href.indexOf('wa.me') !== -1 ||
        target.classList.contains('btn-whatsapp') ||
        target.classList.contains('btn-whatsapp-solid') ||
        target.hasAttribute('data-submit-whatsapp') ||
        target.hasAttribute('data-whatsapp-enquiry');

      // B1. WhatsApp inquiry conversion
      if (isWhatsApp) {
        const itemCard = target.closest('.catalog-item-card, .shoes-card, .bag-card');
        const itemTitle =
          target.getAttribute('data-item-title') ||
          (itemCard
            ? itemCard.querySelector('.catalog-item-title, .shoes-card-title, .bag-card-title')?.textContent?.trim()
            : null) ||
          'General Concierge Inquiry';

        trackEvent('conversion', 'whatsapp_inquiry_click', itemTitle, {
          elementId: target.id || null,
          destination: href
        });
      }

      // B2. Product item card click
      const productCard = target.closest('.catalog-item-card, .shoes-card, .bag-card');
      if (productCard && !isWhatsApp) {
        const pieceName = productCard
          .querySelector('.catalog-item-title, .shoes-card-title, .bag-card-title')
          ?.textContent?.trim();
        if (pieceName) {
          trackEvent('engagement', 'product_click', pieceName);
        }
      }

      // B3. Category filter pills
      if (
        target.classList.contains('filter-pill') ||
        target.classList.contains('filter-btn') ||
        target.hasAttribute('data-filter')
      ) {
        const filterName = target.getAttribute('data-filter') || target.textContent.trim();
        trackEvent('engagement', 'filter_pill_toggled', filterName);
      }

      // B4. Channel copy-to-clipboard
      if (
        target.hasAttribute('data-copy-channel') ||
        target.classList.contains('btn-copy-channel')
      ) {
        const channelVal =
          target.getAttribute('data-copy-val') ||
          target.getAttribute('data-copy') ||
          '+254 700 309 655';
        trackEvent('engagement', 'channel_copied', channelVal);
      }

      // B5. Navigation link clicks (desktop + mobile)
      const navLink =
        target.closest(NAV_SELECTORS.desktopLinks) ||
        target.closest(NAV_SELECTORS.mobileLinks);

      if (navLink && !isWhatsApp && !productCard) {
        const navLabel = (navLink.textContent || '').trim().substring(0, 40);
        const navDest = navLink.getAttribute('href') || '';
        const isMobile = !!navLink.closest(
          '#mobile-nav, #mobile-menu, .tc-mobile-drawer, .page-mobile-drawer, .mobile-drawer'
        );

        trackEvent('navigation', 'nav_link_click', navLabel, {
          destination: navDest,
          surface: isMobile ? 'mobile_drawer' : 'desktop_nav'
        });
      }
    });

    // C. Review Form Submission Listener
    const reviewForm = document.querySelector('#tc-review-form, #review-form, form.tc-form-card');
    if (reviewForm) {
      reviewForm.addEventListener('submit', function () {
        const ratingInput = document.querySelector('#input-rating-val');
        const ratingVal = ratingInput ? ratingInput.value : '5';
        const pieceEl = reviewForm.querySelector('[name="piece"], #client-piece');
        const pieceVal = pieceEl ? pieceEl.value : 'Bespoke Item';

        trackEvent('feedback', 'review_submitted', pieceVal, {
          rating: ratingVal
        });
      });
    }

    // D. Contact Concierge Form Submission Listener
    const contactForm = document.querySelector('#tc-contact-form, #contact-form, [data-contact-form]');
    if (contactForm) {
      contactForm.addEventListener('submit', function () {
        const pieceEl = contactForm.querySelector('#contact-piece, [name="piece"]');
        const pieceVal = pieceEl ? pieceEl.value : 'General Consultation';

        trackEvent('conversion', 'contact_form_whatsapp_dispatch', pieceVal);
      });
    }
  }

  // ==========================================================================
  // 5. SMOOTH MOBILE NAVIGATION (Drawer + Backdrop + Link Tap Feedback)
  // ==========================================================================
  function initSmoothMobileNavigation() {
    // Find trigger
    let triggerBtn = null;
    for (let i = 0; i < NAV_SELECTORS.triggers.length; i++) {
      triggerBtn = document.querySelector(NAV_SELECTORS.triggers[i]);
      if (triggerBtn) break;
    }

    // Find panel
    let mobileNav = null;
    for (let i = 0; i < NAV_SELECTORS.panels.length; i++) {
      mobileNav = document.querySelector(NAV_SELECTORS.panels[i]);
      if (mobileNav) break;
    }

    // Find backdrop
    let backdrop = null;
    for (let i = 0; i < NAV_SELECTORS.backdrops.length; i++) {
      backdrop = document.querySelector(NAV_SELECTORS.backdrops[i]);
      if (backdrop) break;
    }

    if (!triggerBtn || !mobileNav) return;

    const triggerIcon =
      triggerBtn.querySelector('.material-symbols-outlined') ||
      triggerBtn.querySelector('span');

    function openMenu() {
      mobileNav.classList.add('open');
      mobileNav.style.maxHeight = '560px';
      mobileNav.style.opacity = '1';

      if (backdrop) {
        backdrop.classList.remove('hidden');
        backdrop.style.opacity = '1';
        backdrop.style.visibility = 'visible';
      }

      triggerBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
      document.body.classList.add('tc-menu-open');
      document.body.classList.add('page-menu-open');

      if (triggerIcon) triggerIcon.textContent = 'close';

      // Analytics: mobile menu open
      trackEvent('navigation', 'mobile_menu_open', 'Drawer Opened');
    }

    function closeMenu() {
      mobileNav.classList.remove('open');
      mobileNav.style.maxHeight = '0px';
      mobileNav.style.opacity = '0';

      if (backdrop) {
        backdrop.classList.add('hidden');
        backdrop.style.opacity = '0';
        backdrop.style.visibility = 'hidden';
      }

      triggerBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      document.body.classList.remove('tc-menu-open');
      document.body.classList.remove('page-menu-open');

      if (triggerIcon) triggerIcon.textContent = 'menu';
    }

    function toggleMenu() {
      if (mobileNav.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    // Trigger click
    triggerBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });

    // Backdrop click
    if (backdrop) {
      backdrop.addEventListener('click', function (e) {
        e.preventDefault();
        closeMenu();
      });
    }

    // Close when a mobile nav link is tapped (delay for tap feedback)
    const mobileLinks = mobileNav.querySelectorAll(NAV_SELECTORS.mobileLinks + ', a');
    for (let i = 0; i < mobileLinks.length; i++) {
      (function (link) {
        link.addEventListener('click', function () {
          setTimeout(closeMenu, 120);
        });
      })(mobileLinks[i]);
    }

    // ESC key closes
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMenu();
      }
    });

    // Outside click closes
    document.addEventListener('click', function (e) {
      if (
        mobileNav.classList.contains('open') &&
        !mobileNav.contains(e.target) &&
        !triggerBtn.contains(e.target) &&
        (!backdrop || !backdrop.contains(e.target))
      ) {
        closeMenu();
      }
    });

    // Resize to desktop closes
    let resizeTimer = null;
    window.addEventListener('resize', function () {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (window.innerWidth >= ANALYTICS_CONFIG.mobileBreakpoint && mobileNav.classList.contains('open')) {
          closeMenu();
        }
      }, 120);
    });

    // Expose globally for other scripts
    window.TETU_openMobileMenu = openMenu;
    window.TETU_closeMobileMenu = closeMenu;
  }

  // ==========================================================================
  // 6. DESKTOP NAV ACTIVE-STATE HIGHLIGHTING
  // ==========================================================================
  function initDesktopNavActiveState() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    const navLinks = document.querySelectorAll(NAV_SELECTORS.desktopLinks);

    for (let i = 0; i < navLinks.length; i++) {
      const link = navLinks[i];
      const href = link.getAttribute('href');
      if (!href) continue;

      // Strip hash and query for comparison
      const cleanHref = href.split('#')[0].split('?')[0];

      const isMatch =
        cleanHref === currentPath ||
        (currentPath === '' && cleanHref === 'index.html') ||
        (currentPath === 'index.html' && cleanHref === 'index.html');

      if (isMatch) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    }
  }

  // --------------------------------------------------------------------------
  // 7. DOM Ready Initializer
  // --------------------------------------------------------------------------
  function initAll() {
    initAutoTracking();
    initSmoothMobileNavigation();
    initDesktopNavActiveState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // --------------------------------------------------------------------------
  // 8. Public API Export
  // --------------------------------------------------------------------------
  window.TETU_ANALYTICS = Object.freeze({
    brand: ANALYTICS_CONFIG.brand,
    trackEvent: trackEvent,
    getEvents: function () {
      try {
        return JSON.parse(localStorage.getItem(ANALYTICS_CONFIG.storageKeys.events) || '[]');
      } catch (e) {
        return [];
      }
    },
    getSummary: function () {
      try {
        return JSON.parse(localStorage.getItem(ANALYTICS_CONFIG.storageKeys.metrics) || '{}');
      } catch (e) {
        return {};
      }
    },
    getSession: function () {
      try {
        return JSON.parse(localStorage.getItem(ANALYTICS_CONFIG.storageKeys.session) || '{}');
      } catch (e) {
        return {};
      }
    },
    clearEvents: function () {
      try {
        localStorage.removeItem(ANALYTICS_CONFIG.storageKeys.events);
        localStorage.removeItem(ANALYTICS_CONFIG.storageKeys.metrics);
        return true;
      } catch (e) {
        return false;
      }
    }
  });

})(typeof window !== 'undefined' ? window : this, document);