/* ==========================================================================
   TETU COLLECTION — MASTER CORE RUNTIME SCRIPT (main.js)
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
     - reviews.html (Real-time Client Ratings & Zero-state Feed)
     - thank-you.html (Order & Inquiry Confirmation)
     - 404.html (Page Not Found Error Stage)
   ========================================================================== */

(function (window, document) {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Centralized Configuration & Environment Defaults
  // --------------------------------------------------------------------------
  const TETU = {
    brand: {
      name: 'TETU COLLECTION',
      atelier: 'Bossy designs',
      phoneDisplay: '+254 700 309 655',
      phoneRaw: '254700309655',
      copyrightNotice: 'Copyright 2026 Tetu Collection. Website designed & crafted by Bossy designs',
      year: 2026
    },
    storageKeys: {
      reviews: 'tetu_collection_client_reviews_v2',
      inquiries: 'tetu_collection_enquiries_v2',
      wishlist: 'tetu_collection_saved_pieces_v2'
    },
    ui: {
      toastDuration: 4200,
      scrollHeaderThreshold: 45,
      mobileBreakpoint: 768
    },
    selectors: {
      // Mobile menu triggers (any page)
      menuTriggers: [
        '.mobile-menu-trigger',
        '.tc-mobile-toggle',
        '.page-mobile-toggle',
        '#mobile-menu-toggle',
        '#mobile-toggle',
        '[data-menu-trigger]'
      ],
      // Mobile menu panels (any page)
      menuPanels: [
        '#mobile-nav',
        '#mobile-menu',
        '.tc-mobile-drawer',
        '.page-mobile-drawer',
        '.mobile-drawer'
      ],
      // Backdrops (any page)
      backdrops: [
        '#mobile-nav-backdrop',
        '.tc-mobile-backdrop',
        '.page-mobile-backdrop',
        '.mobile-nav-backdrop'
      ]
    }
  };

  // --------------------------------------------------------------------------
  // 2. DOM Ready Initializer
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    initStickyHeader();
    initMobileNavigation();
    initDesktopNavActiveState();
    initWhatsAppConciergeButtons();
    initReviewSystem();
    initCatalogFilters();
    initProductImageWatermarks();
    initScrollRevealAnimations();
    initAtmosphereAudioToggle();
    initCopyrightAutoYear();
  });

  // --------------------------------------------------------------------------
  // 3. Sticky Header & Top Ribbon Elevation
  // --------------------------------------------------------------------------
  function initStickyHeader() {
    const header =
      document.querySelector('.header-cream-theme') ||
      document.querySelector('.tc-header') ||
      document.querySelector('header');
    if (!header) return;

    let ticking = false;

    function handleScroll() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollY > TETU.ui.scrollHeaderThreshold) {
        header.classList.add('header-scrolled');
        header.style.boxShadow = '0 4px 20px rgba(38, 33, 28, 0.08)';
      } else {
        header.classList.remove('header-scrolled');
        header.style.boxShadow = '0 2px 8px rgba(38, 33, 28, 0.04)';
      }
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          window.requestAnimationFrame(handleScroll);
          ticking = true;
        }
      },
      { passive: true }
    );

    handleScroll();
  }

  // --------------------------------------------------------------------------
  // 4. Mobile Navigation Drawer & Hamburger Trigger (Smooth)
  // --------------------------------------------------------------------------
  function initMobileNavigation() {
    // Find trigger button across all possible naming conventions
    let triggerBtn = null;
    for (const sel of TETU.selectors.menuTriggers) {
      triggerBtn = document.querySelector(sel);
      if (triggerBtn) break;
    }

    // Find mobile drawer panel across all possible naming conventions
    let mobileNav = null;
    for (const sel of TETU.selectors.menuPanels) {
      mobileNav = document.querySelector(sel);
      if (mobileNav) break;
    }

    // Find backdrop across all possible naming conventions
    let backdrop = null;
    for (const sel of TETU.selectors.backdrops) {
      backdrop = document.querySelector(sel);
      if (backdrop) break;
    }

    if (!triggerBtn || !mobileNav) return;

    // Determine the icon inside the trigger (optional)
    const triggerIcon =
      triggerBtn.querySelector('.material-symbols-outlined') ||
      triggerBtn.querySelector('span');

    // --- Core open/close functions ---
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

    // --- Trigger click ---
    triggerBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });

    // --- Backdrop click closes menu ---
    if (backdrop) {
      backdrop.addEventListener('click', function (e) {
        e.preventDefault();
        closeMenu();
      });
    }

    // --- Close menu when a nav link inside drawer is clicked ---
    const mobileLinks = mobileNav.querySelectorAll(
      'a.mobile-nav-link, a.tc-mobile-link, a.page-mobile-link, a'
    );
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        // Small delay to allow the tap feedback / color shift to show
        setTimeout(closeMenu, 120);
      });
    });

    // --- Close on ESC key ---
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMenu();
      }
    });

    // --- Close when clicking outside drawer ---
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

    // --- Close when resizing to desktop ---
    let resizeTimer = null;
    window.addEventListener('resize', function () {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (window.innerWidth >= TETU.ui.mobileBreakpoint && mobileNav.classList.contains('open')) {
          closeMenu();
        }
      }, 120);
    });

    // --- Expose for programmatic use ---
    window.TETU_openMobileMenu = openMenu;
    window.TETU_closeMobileMenu = closeMenu;
  }

  // --------------------------------------------------------------------------
  // 5. Desktop Nav Active State (Highlight current page link)
  // --------------------------------------------------------------------------
  function initDesktopNavActiveState() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    const navLinks = document.querySelectorAll(
      '.tc-nav-link, .page-nav-link, .header-nav-links a'
    );

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;

      // Strip hash and query for comparison
      const cleanHref = href.split('#')[0].split('?')[0];

      // Match exact page name, or index.html for root
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
  // 6. WhatsApp Direct Concierge Linking & Inquiries
  // --------------------------------------------------------------------------
  function buildWhatsAppUrl(message) {
    const phone = TETU.brand.phoneRaw;
    const cleanMsg = (message || '').trim();
    return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(cleanMsg);
  }

  function initWhatsAppConciergeButtons() {
    const ctaButtons = document.querySelectorAll(
      '.btn-whatsapp, .btn-whatsapp-solid, [data-whatsapp-enquiry]'
    );

    ctaButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        const existingHref = btn.getAttribute('href');
        const customTitle =
          btn.getAttribute('data-item-title') ||
          (btn
            .closest('.catalog-item-card, .shoes-card, .bag-card')
            ?.querySelector('.catalog-item-title, .shoes-card-title, .bag-card-title')
            ?.textContent?.trim() ?? '');

        if (customTitle) {
          e.preventDefault();
          const inquiryText =
            'Hello TETU COLLECTION (' + TETU.brand.phoneDisplay + '),\n\n' +
            'I am interested in acquiring this bespoke piece:\n' +
            '• Piece: "' + customTitle + '"\n\n' +
            'Please advise on availability and ordering details.\n\n' +
            'Made by ' + TETU.brand.atelier;
          window.open(buildWhatsAppUrl(inquiryText), '_blank', 'noopener,noreferrer');
        } else if (!existingHref || existingHref === '#' || existingHref.startsWith('javascript:')) {
          e.preventDefault();
          const generalText =
            'Hello TETU COLLECTION (' + TETU.brand.phoneDisplay + '),\n' +
            'I would like to enquire about your footwear and bags collection.\n\n' +
            'Made by ' + TETU.brand.atelier;
          window.open(buildWhatsAppUrl(generalText), '_blank', 'noopener,noreferrer');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. Real-Time Client Reviews & Star Rating System
  // --------------------------------------------------------------------------
  function initReviewSystem() {
    const reviewForm =
      document.querySelector('#tc-review-form') ||
      document.querySelector('#review-form') ||
      document.querySelector('form.tc-form-card');

    const starPicker =
      document.querySelector('.tc-star-picker') ||
      document.querySelector('.star-rating-picker') ||
      document.querySelector('#star-picker');

    const starLabel =
      document.querySelector('.tc-star-label') ||
      document.querySelector('.star-rating-hint') ||
      document.querySelector('#rating-desc');

    const reviewsList =
      document.querySelector('#reviews-container') ||
      document.querySelector('.reviews-list') ||
      document.querySelector('.reviews-stream-panel') ||
      document.querySelector('#reviews-feed');

    const emptyFeedCard =
      document.querySelector('.empty-feed-card') ||
      document.querySelector('.empty-reviews-card') ||
      document.querySelector('#empty-state');

    const starButtons = starPicker ? starPicker.querySelectorAll('.star-btn, .star') : [];

    let selectedRating = 5;

    const ratingLabels = {
      1: '1 Star — Needs Improvement',
      2: '2 Stars — Fair Quality',
      3: '3 Stars — Good Bespoke Craft',
      4: '4 Stars — Highly Impressed',
      5: '5 Stars — Exceptional Luxury'
    };

    // --- Interactive star picker ---
    if (starButtons.length > 0) {
      function highlightStars(rating) {
        starButtons.forEach(function (btn, index) {
          const starVal = index + 1;
          if (starVal <= rating) {
            btn.textContent = '★';
            btn.style.color = '#d4af37';
            btn.classList.remove('inactive');
          } else {
            btn.textContent = '☆';
            btn.style.color = 'rgba(38, 33, 28, 0.25)';
            btn.classList.add('inactive');
          }
        });
        if (starLabel) {
          starLabel.textContent = ratingLabels[rating] || rating + ' Stars';
        }
      }

      starButtons.forEach(function (btn, index) {
        const starVal = index + 1;

        btn.addEventListener('mouseenter', function () {
          highlightStars(starVal);
        });

        btn.addEventListener('mouseleave', function () {
          highlightStars(selectedRating);
        });

        btn.addEventListener('click', function (e) {
          e.preventDefault();
          selectedRating = starVal;
          highlightStars(selectedRating);
          const hiddenInput = document.querySelector('#input-rating-val');
          if (hiddenInput) hiddenInput.value = selectedRating;
        });
      });

      highlightStars(selectedRating);
    }

    // --- LocalStorage helpers ---
    function getStoredReviews() {
      try {
        const raw = localStorage.getItem(TETU.storageKeys.reviews);
        return raw ? JSON.parse(raw) : [];
      } catch (err) {
        console.warn('TETU COLLECTION: LocalStorage not available', err);
        return [];
      }
    }

    function saveReview(reviewObj) {
      try {
        const current = getStoredReviews();
        current.unshift(reviewObj);
        localStorage.setItem(TETU.storageKeys.reviews, JSON.stringify(current));
        return true;
      } catch (err) {
        console.error('Failed to save review', err);
        return false;
      }
    }

    // --- Render reviews ---
    function renderReviews() {
      if (!reviewsList) return;
      const reviews = getStoredReviews();
      const cardsWrapper = reviewsList.querySelector('.reviews-list') || reviewsList;

      if (reviews.length === 0) {
        if (emptyFeedCard) emptyFeedCard.style.display = 'flex';
        const dynamicCards = cardsWrapper.querySelectorAll('.dynamic-review-card');
        dynamicCards.forEach(function (c) {
          c.remove();
        });
        return;
      }

      if (emptyFeedCard) {
        emptyFeedCard.style.display = 'none';
      }

      const dynamicCards = cardsWrapper.querySelectorAll('.dynamic-review-card');
      dynamicCards.forEach(function (c) {
        c.remove();
      });

      reviews.forEach(function (item) {
        const card = document.createElement('div');
        card.className = 'review-item-card dynamic-review-card tc-fade-in-up';

        const initial = (item.name || 'TC').trim().slice(0, 2).toUpperCase();
        const starsText = '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating);

        card.innerHTML =
          '<div class="review-item-header">' +
            '<div class="review-client-meta">' +
              '<div class="review-avatar-circle">' + escapeHtml(initial) + '</div>' +
              '<div>' +
                '<div class="review-client-name">' + escapeHtml(item.name || 'Verified Client') + '</div>' +
                '<div class="review-client-location">' + escapeHtml(item.location || 'Kenya') + '</div>' +
              '</div>' +
            '</div>' +
            '<div class="review-stars-display" aria-label="' + item.rating + ' out of 5 stars">' + starsText + '</div>' +
          '</div>' +
          '<p class="review-body-text">"' + escapeHtml(item.comment || '') + '"</p>' +
          (item.piece
            ? '<div class="review-product-tag">Piece Owned: <strong>' + escapeHtml(item.piece) + '</strong></div>'
            : '');

        cardsWrapper.appendChild(card);
      });
    }

    // --- Form submission ---
    if (reviewForm) {
      reviewForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nameInput = reviewForm.querySelector('[name="name"], #client-name, #review-name');
        const locInput = reviewForm.querySelector('[name="location"], #client-location, #review-location');
        const pieceInput = reviewForm.querySelector('[name="piece"], #client-piece, #review-piece');
        const commentInput = reviewForm.querySelector('[name="comment"], #client-comment, #review-comment, #client-message');

        const nameVal = nameInput ? nameInput.value.trim() : '';
        const locVal = locInput ? locInput.value.trim() : '';
        const pieceVal = pieceInput ? pieceInput.value.trim() : '';
        const commentVal = commentInput ? commentInput.value.trim() : '';

        if (!nameVal || !commentVal) {
          showToast('Please provide your name and feedback comment.', 'warning');
          return;
        }

        const newReview = {
          id: 'tc-rev-' + Date.now(),
          name: nameVal,
          location: locVal || 'Nairobi, Kenya',
          piece: pieceVal || 'Handcrafted Footwear',
          rating: selectedRating,
          comment: commentVal,
          timestamp: new Date().toISOString()
        };

        saveReview(newReview);
        renderReviews();
        reviewForm.reset();
        selectedRating = 5;

        if (starButtons.length > 0) {
          starButtons.forEach(function (btn) {
            btn.textContent = '★';
            btn.style.color = '#d4af37';
          });
          if (starLabel) starLabel.textContent = ratingLabels[5];
        }

        showToast('Thank you! Your feedback has been published.', 'success');
      });
    }

    renderReviews();
  }

  // --------------------------------------------------------------------------
  // 8. Catalog Filter Pills Bar (shoes.html & bags.html & reviews.html)
  // --------------------------------------------------------------------------
  function initCatalogFilters() {
    const filterPills = document.querySelectorAll('.filter-pill, .filter-btn');
    const catalogCards = document.querySelectorAll(
      '.catalog-item-card, .shoes-card, .bag-card, .review-item-card.dynamic-review-card'
    );

    if (filterPills.length === 0) return;

    filterPills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        filterPills.forEach(function (p) {
          p.classList.remove('active');
        });
        pill.classList.add('active');

        const selectedFilter =
          (pill.getAttribute('data-filter') || pill.textContent.trim().toLowerCase()).toLowerCase();

        catalogCards.forEach(function (card) {
          const cardCategory = (
            card.getAttribute('data-category') ||
            card.querySelector('.catalog-item-category')?.textContent ||
            ''
          ).toLowerCase();

          if (selectedFilter === 'all' || selectedFilter.includes('all') || cardCategory.includes(selectedFilter)) {
            card.style.display = 'flex';
            card.classList.add('tc-fade-in');
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // 9. Watermark Logo Overlay Enhancement for Product Images
  // --------------------------------------------------------------------------
  function initProductImageWatermarks() {
    const visualContainers = document.querySelectorAll(
      '.catalog-item-visual, .shoes-card-visual, .bag-card-visual'
    );

    // Skip if no logo asset placeholder exists (image src would break)
    visualContainers.forEach(function (container) {
      if (container.querySelector('.brand-watermark-overlay')) return;
      // Watermark is added via CSS + HTML already; JS skip to avoid broken img src
    });
  }

  // --------------------------------------------------------------------------
  // 10. Intersection Observer Scroll Reveal System
  // --------------------------------------------------------------------------
  function initScrollRevealAnimations() {
    if (!('IntersectionObserver' in window)) {
      document
        .querySelectorAll('.tc-reveal, .tc-reveal-scale, .tetu-reveal')
        .forEach(function (el) {
          el.classList.add('is-revealed');
        });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    const revealElements = document.querySelectorAll(
      '.tc-reveal, .tc-reveal-scale, .tetu-reveal, .shoes-card, .bag-card, .pillar-box, .tc-form-card'
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // --------------------------------------------------------------------------
  // 11. Ambient Atmospheric Sound Toggle (Optional Atelier Audio)
  // --------------------------------------------------------------------------
  function initAtmosphereAudioToggle() {
    const audioBtn =
      document.querySelector('[data-audio-toggle]') ||
      document.querySelector('#btn-atmosphere-sound');
    if (!audioBtn) return;

    let isPlaying = false;
    let audioInstance = null;

    audioBtn.addEventListener('click', function () {
      if (!audioInstance) {
        audioInstance = new Audio(
          'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3'
        );
        audioInstance.loop = true;
        audioInstance.volume = 0.25;
      }

      if (isPlaying) {
        audioInstance.pause();
        isPlaying = false;
        audioBtn.classList.remove('active');
        audioBtn.setAttribute('aria-pressed', 'false');
        showToast('Atelier atmosphere muted.', 'info');
      } else {
        audioInstance
          .play()
          .then(function () {
            isPlaying = true;
            audioBtn.classList.add('active');
            audioBtn.setAttribute('aria-pressed', 'true');
            showToast('Atelier ambient sound active.', 'info');
          })
          .catch(function (err) {
            console.warn('Audio playback blocked or failed', err);
          });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 12. Toast Notifications Utility
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
      '<span style="color:#d4af37;font-weight:bold;">' +
      icon +
      '</span> <span>' +
      escapeHtml(message) +
      '</span>';
    toast.classList.add('show');

    if (toast._timer) clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
      toast.classList.remove('show');
    }, TETU.ui.toastDuration);
  }

  // --------------------------------------------------------------------------
  // 13. Auto Update Copyright Year
  // --------------------------------------------------------------------------
  function initCopyrightAutoYear() {
    const yearElements = document.querySelectorAll('.copyright-year, [data-year]');
    yearElements.forEach(function (el) {
      el.textContent = TETU.brand.year;
    });
  }

  // --------------------------------------------------------------------------
  // 14. Security Helper (HTML Escaping)
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
  // 15. Global API Export
  // --------------------------------------------------------------------------
  window.TETU = Object.freeze({
    brand: TETU.brand,
    buildWhatsAppUrl: buildWhatsAppUrl,
    showToast: showToast
  });

})(typeof window !== 'undefined' ? window : this, document);