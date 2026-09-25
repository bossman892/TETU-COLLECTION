/**
 * ==========================================================================
 * TETU COLLECTION — WHATSAPP CONCIERGE CONTROLLER (whatsapp.js)
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
      const icon = isSuccess === false ? '⚠' : '✦';
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
    notify('Opening WhatsApp Concierge…', true);
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
    els.panel.classList.remove('-translate-x-full');
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
      const icon = els.toggle.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = els.iconOpen;
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
    els.panel.classList.add('-translate-x-full');
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
      const icon = els.toggle.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = els.iconClosed;
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
  // NAVIGATION LINKS — Active state + smooth scroll
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
          // No hash → highlight the base page link
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
      `.\nPlease advise on availability, sizing, and payment details.\n\n(${cfg.phoneDisplay} • Made by ${cfg.madeBy})`
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
    const stars = '★'.repeat(rating) + ` (${rating}/5)`;
    return (
      `Hello TETU COLLECTION (${cfg.phoneDisplay}),\n\n` +
      `I would like to share my bespoke client feedback:\n` +
      `• Client: ${d.name || 'Anonymous Client'}\n` +
      `• Location: ${d.location || 'Kenya'}\n` +
      `• Piece Owned: ${d.piece || 'TETU COLLECTION Piece'}\n` +
      `• Rating: ${stars}\n` +
      `• Feedback: ${d.comment || 'Exceptional craftsmanship by Bossy designs!'}\n\n` +
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
      `Sent from TETU COLLECTION website • Made by ${cfg.madeBy}`
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