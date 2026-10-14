/* ==========================================================================
   TETU COLLECTION — CLIENT INQUIRY & CONTACT CONTROLLER (contact.js)
   Brand: TETU COLLECTION
   Atelier / Made by: Bossy designs
   Contact / WhatsApp Concierge: +254 700 309 655 (Raw: 254700309655)
   Theme: Warm Editorial Cream (#f4ede4), Deep Espresso (#26211c) & Brushed Gold (#d4af37)
   Typography: Bodoni Moda (Display/Serif), Plus Jakarta Sans (Body/Sans)
   Supported Pages:
     - contact.html (Dedicated Concierge & Inquiry Desk)
     - index.html (Embedded Quick Inquiries & Footer Channels)
   ==========================================================================
   
   Key Capabilities:
   - Direct WhatsApp inquiry URL building with encoded customized templates
   - Form validation (Client Name, Phone / Email, Selected Piece / Collection, Custom Message)
   - One-tap WhatsApp routing: transforms form inputs into pre-filled WhatsApp conversations
   - Channel copy-to-clipboard actions (Phone, Email, Nairobi Atelier address)
   - Local inquiry backup storage (localStorage) for client reference
   - Interactive UI feedback via animated toast notifications (.tc-toast)
   - Smooth mobile navigation drawer (hamburger + backdrop + link tap feedback)
   - Desktop + mobile navigation link active-state highlighting
   - Safe frozen immutable export for window.TETU_CONTACT
   ========================================================================== */

(function (window, document) {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Configuration & Selectors
  // --------------------------------------------------------------------------
  const CONTACT_CONFIG = {
    brand: {
      name: 'TETU COLLECTION',
      atelier: 'Bossy designs',
      phoneDisplay: '+254 700 309 655',
      phoneRaw: '254700309655',
      email: 'concierge@tetucollection.com',
      location: 'Nairobi, Kenya',
      hours: 'Mon – Sat: 9:00 AM – 7:00 PM (EAT)'
    },
    selectors: {
      form: '#tc-contact-form, #contact-form, form.contact-form, [data-contact-form]',
      nameInput: '#contact-name, [name="name"], [name="client_name"]',
      phoneInput: '#contact-phone, [name="phone"], [name="client_phone"]',
      emailInput: '#contact-email, [name="email"], [name="client_email"]',
      pieceSelect: '#contact-piece, [name="piece"], [name="product_interest"]',
      messageInput: '#contact-message, [name="message"], [name="client_message"]',
      whatsappSubmitBtn: '#btn-submit-whatsapp, .btn-submit-whatsapp, [data-submit-whatsapp]',
      copyChannelBtns: '[data-copy-channel], .btn-copy-channel',
      directChatBtns: '[data-direct-chat], .btn-direct-chat'
    },
    storageKey: 'tetu_client_inquiries_log_v2',
    toastDuration: 4200,
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
    mobileLinks: '.mobile-nav-link, .tc-mobile-link, .page-mobile-link'
  };

  // --------------------------------------------------------------------------
  // 2. DOM Ready Initializer
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    initContactModule();
    initSmoothMobileNavigation();
    initDesktopNavActiveState();
  });

  // --------------------------------------------------------------------------
  // 3. Core Contact Module Initializer
  // --------------------------------------------------------------------------
  function initContactModule() {
    const contactForm = document.querySelector(CONTACT_CONFIG.selectors.form);
    const copyButtons = document.querySelectorAll(CONTACT_CONFIG.selectors.copyChannelBtns);
    const directChatButtons = document.querySelectorAll(CONTACT_CONFIG.selectors.directChatBtns);

    // Setup Contact Form Submissions
    if (contactForm) {
      setupContactForm(contactForm);
    }

    // Setup Copy-to-Clipboard Buttons for Channels
    if (copyButtons.length > 0) {
      setupCopyButtons(copyButtons);
    }

    // Setup Direct Chat Quick Launchers
    if (directChatButtons.length > 0) {
      setupDirectChatButtons(directChatButtons);
    }

    // Pre-populate piece selector from URL parameter if present (?piece=crescent-bag)
    prefillPieceFromUrl();
  }

  // --------------------------------------------------------------------------
  // 4. Contact Form Handling & WhatsApp Conversion
  // --------------------------------------------------------------------------
  function setupContactForm(form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameEl = form.querySelector(CONTACT_CONFIG.selectors.nameInput);
      const phoneEl = form.querySelector(CONTACT_CONFIG.selectors.phoneInput);
      const emailEl = form.querySelector(CONTACT_CONFIG.selectors.emailInput);
      const pieceEl = form.querySelector(CONTACT_CONFIG.selectors.pieceSelect);
      const messageEl = form.querySelector(CONTACT_CONFIG.selectors.messageInput);

      const name = nameEl ? nameEl.value.trim() : '';
      const phone = phoneEl ? phoneEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';
      const piece = pieceEl ? pieceEl.value.trim() : '';
      const message = messageEl ? messageEl.value.trim() : '';

      // Validation
      if (!name) {
        showToast('Please provide your name so we know how to address you.', 'warning');
        if (nameEl) nameEl.focus();
        return;
      }

      if (!message && !piece) {
        showToast('Please select a piece or provide an inquiry message.', 'warning');
        if (messageEl) messageEl.focus();
        return;
      }

      // Build structured inquiry text for WhatsApp
      const inquiryPayload = {
        name: name,
        phone: phone || 'Not specified',
        email: email || 'Not specified',
        piece: piece || 'General Bespoke Consultation',
        message: message || 'I am interested in placing a bespoke order.',
        timestamp: new Date().toISOString()
      };

      // Save inquiry to client browser memory for history
      saveInquiryLocally(inquiryPayload);

      // Construct formatted WhatsApp conversation message
      const formattedWhatsAppText = formatWhatsAppInquiry(inquiryPayload);

      // Launch WhatsApp
      const whatsappUrl = buildWhatsAppUrl(formattedWhatsAppText);
      showToast('Opening WhatsApp Concierge...', 'success');

      setTimeout(function () {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        // Reset form gracefully
        form.reset();
      }, 450);
    });
  }

  // --------------------------------------------------------------------------
  // 5. WhatsApp URL Formatting Helper
  // --------------------------------------------------------------------------
  function buildWhatsAppUrl(message) {
    const rawNumber = CONTACT_CONFIG.brand.phoneRaw;
    const cleanMsg = (message || '').trim();
    return 'https://wa.me/' + rawNumber + '?text=' + encodeURIComponent(cleanMsg);
  }

  function formatWhatsAppInquiry(data) {
    return [
      '✦ *TETU COLLECTION — Bespoke Acquisition Inquiry* ✦',
      '------------------------------------------',
      '• *Client Name:* ' + data.name,
      data.phone !== 'Not specified' ? '• *Phone:* ' + data.phone : null,
      data.email !== 'Not specified' ? '• *Email:* ' + data.email : null,
      '• *Piece / Collection:* ' + data.piece,
      '------------------------------------------',
      '• *Inquiry / Requirements:*',
      '"' + data.message + '"',
      '------------------------------------------',
      '*Official Atelier Desk:* ' + CONTACT_CONFIG.brand.phoneDisplay,
      '*Website Designed & Crafted by:* ' + CONTACT_CONFIG.brand.atelier
    ].filter(Boolean).join('\n');
  }

  // --------------------------------------------------------------------------
  // 6. Direct Quick-Chat Buttons
  // --------------------------------------------------------------------------
  function setupDirectChatButtons(buttons) {
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const customIntent = btn.getAttribute('data-intent') || 'general';
        let defaultMsg =
          'Hello TETU COLLECTION (' + CONTACT_CONFIG.brand.phoneDisplay + '),\n' +
          'I would like to inquire about bespoke handcrafted footwear and bags.\n\n' +
          'Made by ' + CONTACT_CONFIG.brand.atelier;

        if (customIntent === 'custom_sizing') {
          defaultMsg =
            'Hello TETU COLLECTION,\n' +
            'I would like to enquire about bespoke leather footwear custom sizing and fit recommendations.\n\n' +
            'Made by ' + CONTACT_CONFIG.brand.atelier;
        } else if (customIntent === 'leather_care') {
          defaultMsg =
            'Hello TETU COLLECTION,\n' +
            'I would like to ask about care instructions and maintenance for my leather piece.\n\n' +
            'Made by ' + CONTACT_CONFIG.brand.atelier;
        }

        window.open(buildWhatsAppUrl(defaultMsg), '_blank', 'noopener,noreferrer');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. Channel Copy-to-Clipboard Functionality
  // --------------------------------------------------------------------------
  function setupCopyButtons(buttons) {
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const copyTarget =
          btn.getAttribute('data-copy-val') ||
          btn.getAttribute('data-copy') ||
          CONTACT_CONFIG.brand.phoneDisplay;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(copyTarget).then(function () {
            showToast('Copied to clipboard: ' + copyTarget, 'success');
          }).catch(function () {
            fallbackCopy(copyTarget);
          });
        } else {
          fallbackCopy(copyTarget);
        }
      });
    });
  }

  function fallbackCopy(text) {
    try {
      const tempInput = document.createElement('textarea');
      tempInput.value = text;
      tempInput.style.position = 'fixed';
      tempInput.style.opacity = '0';
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showToast('Copied to clipboard: ' + text, 'success');
    } catch (err) {
      showToast('Contact channel: ' + text, 'info');
    }
  }

  // --------------------------------------------------------------------------
  // 8. Local Inquiry History Logger
  // --------------------------------------------------------------------------
  function saveInquiryLocally(inquiryObj) {
    try {
      const existing = JSON.parse(localStorage.getItem(CONTACT_CONFIG.storageKey) || '[]');
      existing.unshift(inquiryObj);
      // Keep recent 20
      if (existing.length > 20) existing.length = 20;
      localStorage.setItem(CONTACT_CONFIG.storageKey, JSON.stringify(existing));
    } catch (err) {
      console.warn('TETU Contact: LocalStorage not active', err);
    }
  }

  // --------------------------------------------------------------------------
  // 9. Pre-populate Piece from URL Parameter
  // --------------------------------------------------------------------------
  function prefillPieceFromUrl() {
    try {
      const params = new URLSearchParams(window.location.search);
      const pieceParam = params.get('piece') || params.get('item') || params.get('product');

      if (!pieceParam) return;

      const pieceSelect = document.querySelector(CONTACT_CONFIG.selectors.pieceSelect);
      if (!pieceSelect) return;

      // Normalize string
      const cleanPiece = decodeURIComponent(pieceParam).trim().toLowerCase();

      // Check options
      let matched = false;
      Array.from(pieceSelect.options).forEach(function (opt) {
        if (
          opt.value.toLowerCase().includes(cleanPiece) ||
          opt.textContent.toLowerCase().includes(cleanPiece)
        ) {
          pieceSelect.value = opt.value;
          matched = true;
        }
      });

      // If not in select options, set custom option or fill message placeholder
      if (!matched) {
        const messageInput = document.querySelector(CONTACT_CONFIG.selectors.messageInput);
        if (messageInput && !messageInput.value) {
          messageInput.value = 'I am inquiring about availability for: "' + decodeURIComponent(pieceParam) + '"';
        }
      }
    } catch (err) {
      // Ignore if sandboxed iframe
    }
  }

  // ==========================================================================
  // 10. SMOOTH MOBILE NAVIGATION (Drawer + Backdrop + Link Tap Feedback)
  // ==========================================================================
  function initSmoothMobileNavigation() {
    // Find trigger
    let triggerBtn = null;
    for (const sel of NAV_SELECTORS.triggers) {
      triggerBtn = document.querySelector(sel);
      if (triggerBtn) break;
    }

    // Find panel
    let mobileNav = null;
    for (const sel of NAV_SELECTORS.panels) {
      mobileNav = document.querySelector(sel);
      if (mobileNav) break;
    }

    // Find backdrop
    let backdrop = null;
    for (const sel of NAV_SELECTORS.backdrops) {
      backdrop = document.querySelector(sel);
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
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        setTimeout(closeMenu, 120);
      });
    });

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
        if (window.innerWidth >= CONTACT_CONFIG.mobileBreakpoint && mobileNav.classList.contains('open')) {
          closeMenu();
        }
      }, 120);
    });

    // Expose globally for other scripts
    window.TETU_openMobileMenu = openMenu;
    window.TETU_closeMobileMenu = closeMenu;
  }

  // ==========================================================================
  // 11. DESKTOP NAV ACTIVE-STATE HIGHLIGHTING
  // ==========================================================================
  function initDesktopNavActiveState() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    const navLinks = document.querySelectorAll(
      '.tc-nav-link, .page-nav-link, .header-nav-links a, .nav-link'
    );

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;

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
    });
  }

  // --------------------------------------------------------------------------
  // 12. Toast Notification System
  // --------------------------------------------------------------------------
  function showToast(message, type) {
    type = type || 'info';
    let toast = document.querySelector('.tc-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'tc-toast';
      document.body.appendChild(toast);
    }

    const icons = {
      success: '✓',
      warning: '⚠',
      info: '✦'
    };

    const icon = icons[type] || '✦';
    toast.innerHTML =
      '<span style="color:#d4af37;font-weight:bold;">' + icon + '</span> ' +
      '<span>' + escapeHtml(message) + '</span>';
    toast.classList.add('show');

    if (toast._timer) clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
      toast.classList.remove('show');
    }, CONTACT_CONFIG.toastDuration);
  }

  // --------------------------------------------------------------------------
  // 13. Security Helper (HTML Escaping)
  // --------------------------------------------------------------------------
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --------------------------------------------------------------------------
  // 14. Public API Export
  // --------------------------------------------------------------------------
  window.TETU_CONTACT = Object.freeze({
    brand: CONTACT_CONFIG.brand,
    buildWhatsAppUrl: buildWhatsAppUrl,
    formatWhatsAppInquiry: formatWhatsAppInquiry,
    showToast: showToast,
    getInquiriesHistory: function () {
      try {
        return JSON.parse(localStorage.getItem(CONTACT_CONFIG.storageKey) || '[]');
      } catch (e) {
        return [];
      }
    }
  });

})(typeof window !== 'undefined' ? window : this, document);