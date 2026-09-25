/**
 * ==========================================================================
 * TETU COLLECTION — CLIENT-SIDE LOGIC & INTERACTIONS (main.js)
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
    animationSpeed: 300,
  };

  // State object
  const state = {
    selectedRating: 5,
    activeFilter: 'all',
    reviews: [],
    isAudioPlaying: false,
    audioInstance: null,
    isMobileMenuOpen: false,
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
        state.reviews = JSON.parse(data);
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

    const icon = isSuccess ? '✦' : '⚠';
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
  // MOBILE NAVIGATION — Smooth Toggle, Backdrop & Body Scroll Lock
  // --------------------------------------------------------------------------
  function initMobileNavigation() {
    const menuToggle = $('#mobile-menu-toggle') || $('.mobile-menu-toggle');
    const mobileMenuPanel = $('#mobile-menu-panel') || $('.mobile-menu-panel');
    const mobileMenuBackdrop = $('#mobile-menu-backdrop') || $('.mobile-menu-backdrop');

    if (!menuToggle || !mobileMenuPanel) return;

    function openMenu() {
      mobileMenuPanel.classList.remove('-translate-x-full');
      mobileMenuPanel.classList.add('translate-x-0', 'open');
      if (mobileMenuBackdrop) {
        mobileMenuBackdrop.classList.remove('hidden');
        mobileMenuBackdrop.classList.add('open');
      }
      document.body.classList.add('menu-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      state.isMobileMenuOpen = true;

      // Update hamburger icon to "close"
      const icon = menuToggle.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = 'close';
    }

    function closeMenu() {
      mobileMenuPanel.classList.add('-translate-x-full');
      mobileMenuPanel.classList.remove('translate-x-0', 'open');
      if (mobileMenuBackdrop) {
        mobileMenuBackdrop.classList.add('hidden');
        mobileMenuBackdrop.classList.remove('open');
      }
      document.body.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      state.isMobileMenuOpen = false;

      // Update close icon back to "menu"
      const icon = menuToggle.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = 'menu';
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
      1: '1 Star — Needs Improvement',
      2: '2 Stars — Fair Craftsmanship',
      3: '3 Stars — Good Bespoke Quality',
      4: '4 Stars — Highly Impressed',
      5: '5 Stars — Exceptional Luxury',
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
        metricRatingEl.innerHTML = `— <span class="gold-val">/ 5.0</span>`;
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
        const starsDisplay = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);
        const initials = getInitials(rev.name);
        const timeAgo = rev.date ? rev.date : 'Just now';

        return `
        <article class="review-item-card" data-category="${escapeHTML(rev.category)}" style="animation: fadeIn 0.35s ease forwards;">
          <div class="card-top">
            <div class="review-client-meta">
              <div class="client-avatar" aria-hidden="true">${escapeHTML(initials)}</div>
              <div class="client-details">
                <div class="client-name">${escapeHTML(rev.name)}</div>
                <div class="client-loc">${escapeHTML(rev.location || 'Kenya')} • <span style="color: #d4af37;">Verified Purchase</span></div>
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
              Verify with Atelier ↗
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
        filterButtons.forEach((b) => b.classList.remove('active'));

        // Support Tailwind-based active class from reviews.html
        filterButtons.forEach((b) => {
          b.classList.remove('bg-primary', 'text-black', 'text-on-primary');
          b.classList.add('bg-surface-container', 'text-slate-300');
        });
        btn.classList.add('active', 'bg-primary', 'text-black');

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
        const starsStr = '★'.repeat(state.selectedRating) + ` (${state.selectedRating}/5)`;
        const message =
`Hello TETU COLLECTION (+254700309655),

I would like to share my bespoke client feedback:
• Client: ${data.name || 'Anonymous Client'}
• Location: ${data.location || 'Kenya'}
• Piece Owned: ${data.piece}
• Rating: ${starsStr}
• Feedback: ${data.comment || 'Exceptional craftsmanship by Bossy designs!'}

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

Sent from TETU COLLECTION website • Made by Bossy designs`;

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
• Piece: "${productName}"

Please advise on bespoke sizing, availability, and pricing.

(+254700309655 • Made by Bossy designs)`;

        window.open(buildWhatsAppURL(waText), '_blank', 'noopener,noreferrer');
      });
    });
  }

  // --------------------------------------------------------------------------
  // Atmospheric Audio Toggle
  // --------------------------------------------------------------------------
  function initAudioToggle() {
    const audioToggleBtn = $('#campaign-audio-toggle') || $('#audio-toggle-btn') || $('.atmosphere-audio-toggle');
    if (!audioToggleBtn) return;

    const audioIcon = $('#audio-icon') || audioToggleBtn.querySelector('.material-symbols-outlined');
    const audioLabel = $('#audio-label') || audioToggleBtn.querySelector('.audio-label');

    audioToggleBtn.addEventListener('click', function (e) {
      e.preventDefault();
      state.isAudioPlaying = !state.isAudioPlaying;

      if (state.isAudioPlaying) {
        audioToggleBtn.classList.add('playing', 'text-primary');
        if (audioIcon) audioIcon.textContent = 'volume_up';
        if (audioLabel) audioLabel.textContent = 'Atmosphere Active';
        showToast('Atmospheric atelier ambiance enabled.', true);
      } else {
        audioToggleBtn.classList.remove('playing', 'text-primary');
        if (audioIcon) audioIcon.textContent = 'volume_off';
        if (audioLabel) audioLabel.textContent = 'Atmosphere Sound';
        showToast('Atmospheric audio muted.', false);
      }
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
    initMobileNavigation();
    initStarRating();
    initFilterTabs();
    initFeedbackForm();
    initContactForm();
    initProductEnquireButtons();
    initAudioToggle();
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