/* ==========================================================================
   TETU COLLECTION — INTERACTIVE CATALOG FILTERS & SEARCH MODULE (filters.js)
   Brand: TETU COLLECTION
   Atelier / Made by: Bossy designs
   Contact / WhatsApp Concierge: +254 700 309 655 (Raw: 254700309655)
   Theme: Warm Editorial Cream (#f4ede4), Deep Espresso (#26211c) & Brushed Gold (#d4af37)
   Typography: Bodoni Moda (Serif), Plus Jakarta Sans (Sans-serif)
   Supported Pages:
     - shoes.html (Footwear Collection — slides, sandals, mules, slip-ons)
     - bags.html (Maroquinerie & Handbags — shoulder, totes, hobo, clutches)
     - index.html (Showcase collections & featured previews)
   ==========================================================================
   
   Capabilities:
   - Multi-criteria live filtering (Category pills, Search query, Color/Finish)
   - Zero-latency DOM filtering with graceful staggered fade/scale transitions
   - Dynamic zero-state handling with one-tap filter reset
   - Live item count badge updates
   - URL query parameter synchronization (?category=slides&q=noir)
   - Mobile horizontal touch scrolling for filter pills
   - Smooth mobile navigation drawer (hamburger + backdrop + link tap feedback)
   - Desktop + mobile navigation link active-state highlighting
   - Safe export for window.TETU_FILTERS
   ========================================================================== */

(function (window, document) {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Module Configuration & Selectors
  // --------------------------------------------------------------------------
  const FILTER_CONFIG = {
    selectors: {
      container: '.catalog-grid, .shoes-grid, .bags-grid, [data-catalog-grid]',
      card: '.catalog-item-card, .shoes-card, .bag-card, [data-catalog-item]',
      filterPill: '.filter-pill, .filter-btn, [data-filter]',
      filterBar: '.filter-pills-bar, .filter-pills, .catalog-filter-bar',
      searchInput: '#catalog-search, .catalog-search-input, [data-filter-search]',
      clearSearchBtn: '#btn-clear-search, [data-clear-search]',
      itemCount: '.catalog-count-badge, [data-filter-count]',
      zeroState: '.catalog-empty-state, .empty-filter-card, [data-filter-empty]'
    },
    classes: {
      activePill: 'active',
      hiddenCard: 'filter-hidden',
      visibleCard: 'filter-visible',
      animIn: 'tc-fade-in'
    },
    debounceDelay: 180,
    animationDuration: 300,
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

  // Filter state
  let currentCategory = 'all';
  let currentSearchQuery = '';
  let activeCards = [];

  // --------------------------------------------------------------------------
  // 2. DOM Ready Initializer
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    initCatalogFilters();
    initSmoothMobileNavigation();
    initDesktopNavActiveState();
  });

  // --------------------------------------------------------------------------
  // 3. Core Filter Controller
  // --------------------------------------------------------------------------
  function initCatalogFilters() {
    const gridContainer = document.querySelector(FILTER_CONFIG.selectors.container);
    const filterPills = document.querySelectorAll(FILTER_CONFIG.selectors.filterPill);
    const searchInput = document.querySelector(FILTER_CONFIG.selectors.searchInput);
    const clearBtn = document.querySelector(FILTER_CONFIG.selectors.clearSearchBtn);

    // If no grid or filter pills on the page, gracefully exit
    if (!gridContainer && filterPills.length === 0) return;

    // Cache card elements
    activeCards = Array.from(document.querySelectorAll(FILTER_CONFIG.selectors.card));
    if (activeCards.length === 0 && filterPills.length === 0) return;

    // Inject styles for clean filtering animation
    injectFilterStyles();

    // Ensure zero-state placeholder exists in the DOM
    if (gridContainer) {
      ensureZeroStateCard(gridContainer);
    }

    // Setup category pill listeners
    setupPillListeners(filterPills);

    // Setup search input with debounce
    if (searchInput) {
      setupSearchInput(searchInput, clearBtn);
    }

    // Read initial filter from URL params if present (?category=tote)
    readUrlParams(filterPills, searchInput);

    // Perform initial count and layout pass
    applyFilters();
  }

  // --------------------------------------------------------------------------
  // 4. Pill Filter Interaction
  // --------------------------------------------------------------------------
  function setupPillListeners(pills) {
    pills.forEach(function (pill) {
      pill.addEventListener('click', function (e) {
        e.preventDefault();

        // Update active class
        pills.forEach(function (p) {
          p.classList.remove(FILTER_CONFIG.classes.activePill);
        });
        pill.classList.add(FILTER_CONFIG.classes.activePill);

        // Extract category target
        const rawFilter = pill.getAttribute('data-filter') || pill.textContent.trim().toLowerCase();
        currentCategory = normalizeCategory(rawFilter);

        // Sync URL query string
        syncUrlParams();

        // Re-apply filter
        applyFilters();
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. Search Bar Interaction
  // --------------------------------------------------------------------------
  function setupSearchInput(input, clearBtn) {
    let debounceTimer;

    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        currentSearchQuery = input.value.trim().toLowerCase();
        if (clearBtn) {
          clearBtn.style.display = currentSearchQuery ? 'inline-flex' : 'none';
        }
        syncUrlParams();
        applyFilters();
      }, FILTER_CONFIG.debounceDelay);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', function (e) {
        e.preventDefault();
        input.value = '';
        currentSearchQuery = '';
        clearBtn.style.display = 'none';
        syncUrlParams();
        applyFilters();
        input.focus();
      });
    }
  }

  // --------------------------------------------------------------------------
  // 6. Filtering Logic & DOM Execution
  // --------------------------------------------------------------------------
  function applyFilters() {
    let visibleCount = 0;

    activeCards.forEach(function (card) {
      const cardCategory = (
        card.getAttribute('data-category') ||
        card.querySelector('.catalog-item-category, .shoes-card-category, .bag-card-category')?.textContent ||
        ''
      ).toLowerCase();

      const cardTitle = (
        card.getAttribute('data-title') ||
        card.querySelector('.catalog-item-title, .shoes-card-title, .bag-card-title')?.textContent ||
        ''
      ).toLowerCase();

      const cardDesc = (
        card.getAttribute('data-desc') ||
        card.querySelector('.catalog-item-desc, .shoes-card-desc, .bag-card-desc')?.textContent ||
        ''
      ).toLowerCase();

      // Category matching
      const matchesCategory =
        currentCategory === 'all' ||
        currentCategory === '' ||
        cardCategory.includes(currentCategory) ||
        cardTitle.includes(currentCategory);

      // Search matching
      const matchesSearch =
        !currentSearchQuery ||
        cardTitle.includes(currentSearchQuery) ||
        cardDesc.includes(currentSearchQuery) ||
        cardCategory.includes(currentSearchQuery);

      const isMatch = matchesCategory && matchesSearch;

      if (isMatch) {
        showCard(card);
        visibleCount++;
      } else {
        hideCard(card);
      }
    });

    // Update live counter badge
    updateCounterBadge(visibleCount);

    // Toggle zero-state card
    toggleZeroState(visibleCount);
  }

  function showCard(card) {
    card.classList.remove(FILTER_CONFIG.classes.hiddenCard);
    card.classList.add(FILTER_CONFIG.classes.visibleCard);
    card.style.display = 'flex';
  }

  function hideCard(card) {
    card.classList.remove(FILTER_CONFIG.classes.visibleCard);
    card.classList.add(FILTER_CONFIG.classes.hiddenCard);
    card.style.display = 'none';
  }

  // --------------------------------------------------------------------------
  // 7. Zero-State Display & Reset Action
  // --------------------------------------------------------------------------
  function ensureZeroStateCard(container) {
    if (!container) return;
    let zeroState = container.querySelector(FILTER_CONFIG.selectors.zeroState);

    if (!zeroState) {
      zeroState = document.createElement('div');
      zeroState.className = 'catalog-empty-state empty-filter-card';
      zeroState.style.display = 'none';
      zeroState.innerHTML =
        '<div class="empty-feed-card" style="grid-column: 1 / -1; width: 100%; margin: 2rem 0; padding: 3.5rem 1.5rem; text-align: center; border: 2px dashed rgba(38, 33, 28, 0.15); border-radius: 24px; background: #ede5dc;">' +
          '<div style="width: 52px; height: 52px; border-radius: 50%; background: #f4ede4; border: 1px solid rgba(212, 175, 55, 0.35); display: inline-flex; align-items: center; justify-content: center; color: #d4af37; font-size: 20px; margin-bottom: 1rem;">✦</div>' +
          '<h3 style="font-family: \'Bodoni Moda\', Georgia, serif; font-size: 1.35rem; color: #26211c; text-transform: uppercase; margin-bottom: 6px;">No Matching Pieces Found</h3>' +
          '<p style="font-size: 13px; color: #736b63; max-width: 380px; margin: 0 auto 1.5rem; line-height: 1.5;">We could not find any bespoke pieces matching your selected filter. Explore our full atelier catalog or reset your filters.</p>' +
          '<button type="button" class="btn-gold btn-reset-filters" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 9999px; background-color: #d4af37; color: #26211c; font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; border: none; cursor: pointer;">View All Pieces</button>' +
        '</div>';

      container.appendChild(zeroState);

      // Attach reset trigger
      const resetBtn = zeroState.querySelector('.btn-reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', resetAllFilters);
      }
    }
  }

  function toggleZeroState(count) {
    const zeroState = document.querySelector(FILTER_CONFIG.selectors.zeroState);
    if (!zeroState) return;
    zeroState.style.display = count === 0 ? 'block' : 'none';
  }

  function resetAllFilters() {
    currentCategory = 'all';
    currentSearchQuery = '';

    // Reset pills
    const filterPills = document.querySelectorAll(FILTER_CONFIG.selectors.filterPill);
    filterPills.forEach(function (p) {
      const val = (p.getAttribute('data-filter') || p.textContent).trim().toLowerCase();
      if (val === 'all' || val.includes('all')) {
        p.classList.add(FILTER_CONFIG.classes.activePill);
      } else {
        p.classList.remove(FILTER_CONFIG.classes.activePill);
      }
    });

    // Reset search input
    const searchInput = document.querySelector(FILTER_CONFIG.selectors.searchInput);
    if (searchInput) searchInput.value = '';

    const clearBtn = document.querySelector(FILTER_CONFIG.selectors.clearSearchBtn);
    if (clearBtn) clearBtn.style.display = 'none';

    syncUrlParams();
    applyFilters();
  }

  // --------------------------------------------------------------------------
  // 8. Badge Counter & Statistics
  // --------------------------------------------------------------------------
  function updateCounterBadge(count) {
    const counterElements = document.querySelectorAll(FILTER_CONFIG.selectors.itemCount);
    counterElements.forEach(function (badge) {
      badge.textContent = count + ' ' + (count === 1 ? 'Piece' : 'Pieces');
    });
  }

  // --------------------------------------------------------------------------
  // 9. URL Query Parameter Synchronization
  // --------------------------------------------------------------------------
  function readUrlParams(pills, searchInput) {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlCat = params.get('category') || params.get('filter');
      const urlQ = params.get('q') || params.get('search');

      if (urlCat) {
        currentCategory = normalizeCategory(urlCat);
        pills.forEach(function (p) {
          const val = normalizeCategory(p.getAttribute('data-filter') || p.textContent);
          if (val === currentCategory) {
            p.classList.add(FILTER_CONFIG.classes.activePill);
          } else {
            p.classList.remove(FILTER_CONFIG.classes.activePill);
          }
        });
      }

      if (urlQ && searchInput) {
        currentSearchQuery = urlQ.trim().toLowerCase();
        searchInput.value = urlQ;
        const clearBtn = document.querySelector(FILTER_CONFIG.selectors.clearSearchBtn);
        if (clearBtn) clearBtn.style.display = 'inline-flex';
      }
    } catch (err) {
      console.warn('TETU: URL param reading not supported', err);
    }
  }

  function syncUrlParams() {
    try {
      const url = new URL(window.location);
      if (currentCategory && currentCategory !== 'all') {
        url.searchParams.set('category', currentCategory);
      } else {
        url.searchParams.delete('category');
      }

      if (currentSearchQuery) {
        url.searchParams.set('q', currentSearchQuery);
      } else {
        url.searchParams.delete('q');
      }

      window.history.replaceState({}, '', url.toString());
    } catch (err) {
      // Ignore if running in sandbox iframe
    }
  }

  // --------------------------------------------------------------------------
  // 10. Normalization Helper
  // --------------------------------------------------------------------------
  function normalizeCategory(str) {
    if (!str) return 'all';
    const clean = str.trim().toLowerCase();
    if (clean === 'all' || clean.includes('all')) return 'all';
    if (clean.includes('slide') || clean.includes('footwear') || clean.includes('shoe')) return 'shoes';
    if (clean.includes('bag') || clean.includes('tote') || clean.includes('clutch') || clean.includes('hobo')) return 'bags';
    return clean;
  }

  // --------------------------------------------------------------------------
  // 11. Dynamic CSS Injection for Instant Visual Polish
  // --------------------------------------------------------------------------
  function injectFilterStyles() {
    if (document.getElementById('tc-filters-dynamic-style')) return;

    const style = document.createElement('style');
    style.id = 'tc-filters-dynamic-style';
    style.textContent = [
      '.filter-visible {',
      '  animation: tcFilterFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;',
      '}',
      '@keyframes tcFilterFadeIn {',
      '  from { opacity: 0; transform: translateY(10px) scale(0.98); }',
      '  to { opacity: 1; transform: translateY(0) scale(1); }',
      '}',
      '.catalog-filter-bar {',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  gap: 1.25rem;',
      '  flex-wrap: wrap;',
      '}',
      '.filter-pills-bar {',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 8px;',
      '  overflow-x: auto;',
      '  -webkit-overflow-scrolling: touch;',
      '  scrollbar-width: none;',
      '  -ms-overflow-style: none;',
      '}',
      '.filter-pills-bar::-webkit-scrollbar { display: none; }'
    ].join('\n');
    document.head.appendChild(style);
  }

  // ==========================================================================
  // 12. SMOOTH MOBILE NAVIGATION (Drawer + Backdrop + Link Tap Feedback)
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
        if (window.innerWidth >= FILTER_CONFIG.mobileBreakpoint && mobileNav.classList.contains('open')) {
          closeMenu();
        }
      }, 120);
    });

    // Expose globally for other scripts (main.js etc.)
    window.TETU_openMobileMenu = openMenu;
    window.TETU_closeMobileMenu = closeMenu;
  }

  // ==========================================================================
  // 13. DESKTOP NAV ACTIVE-STATE HIGHLIGHTING
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

      // Match current page
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
  // 14. Public API Export
  // --------------------------------------------------------------------------
  window.TETU_FILTERS = Object.freeze({
    apply: applyFilters,
    reset: resetAllFilters,
    setCategory: function (cat) {
      currentCategory = normalizeCategory(cat);
      syncUrlParams();
      applyFilters();
    },
    setSearch: function (query) {
      currentSearchQuery = (query || '').trim().toLowerCase();
      syncUrlParams();
      applyFilters();
    }
  });

})(typeof window !== 'undefined' ? window : this, document);