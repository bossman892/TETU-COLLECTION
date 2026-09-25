/**
 * ==========================================================================
 * TETU COLLECTION — REAL-TIME SEARCH & DISCOVERY CONTROLLER (search.js)
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
    const DEFAULT_CATALOG = [
      {
        id: 'tc-slide-tan-h',
        title: 'Tan H-Strap Leather Slide',
        category: 'Footwear',
        tag: 'Slides',
        material: 'Full-Grain Kenyan Calfskin Tan Leather',
        finish: 'Natural Matte Tan',
        color: 'Tan / Cognac',
        description:
          'Handcrafted signature dual-strap slide with perimeter contrast stitching.',
        link: 'index.html#footwear-section',
      },
      {
        id: 'tc-slide-noir-cutout',
        title: 'Midnight Noir Cutout Slide',
        category: 'Footwear',
        tag: 'Slides',
        material: 'Embossed Noir Calf Leather',
        finish: 'Obsidian Matte',
        color: 'Black / Noir',
        description:
          'Architectural geometric cutouts with soft padded insole for all-day comfort.',
        link: 'index.html#footwear-section',
      },
      {
        id: 'tc-slide-gold-chain',
        title: 'Monogram Gold-Chain Slide',
        category: 'Footwear',
        tag: 'Slides',
        material: 'Monogram Printed Leather & 24K Polished Chain',
        finish: 'Brushed Warm Gold Hardware',
        color: 'Espresso / Gold',
        description:
          'Heavy polished gold chain ornament paired with rich chocolate monogram motif.',
        link: 'index.html#footwear-section',
      },
      {
        id: 'tc-slide-cognac-toe',
        title: 'Amber Cognac Toe-Loop Sandal',
        category: 'Footwear',
        tag: 'Slides',
        material: 'Pebbled Amber Leather',
        finish: 'Hand-burnished edges',
        color: 'Amber Cognac',
        description:
          'Asymmetric toe-loop artisan sandal crafted for effortless warm-weather poise.',
        link: 'index.html#footwear-section',
      },
      {
        id: 'tc-slide-pearl-rose',
        title: 'Rose Gold Beaded Pearl Slide',
        category: 'Footwear',
        tag: 'Slides',
        material: 'Metallic Rose Gold Nappa & Hand-Strung Pearls',
        finish: 'Lustrous Evening Glamour',
        color: 'Rose Gold / Pearl White',
        description:
          'Evening gala slide adorned with lustrous pearls and micro gold seed beads.',
        link: 'evening-luxury.html#vault-collection',
      },
      {
        id: 'tc-slide-yellow-sun',
        title: 'Sunburst Yellow Atelier Slide',
        category: 'Footwear',
        tag: 'Slides',
        material: 'Vibrant Textured Lizard Grain Calfskin',
        finish: 'Sunburst Satin',
        color: 'Yellow',
        description:
          'Bold statement slide bringing vibrant warmth to modern tailored resort wear.',
        link: 'index.html#footwear-section',
      },
      {
        id: 'tc-slide-crimson',
        title: 'Imperial Crimson Cutout Slide',
        category: 'Footwear',
        tag: 'Slides',
        material: 'Textured Scarlet Calfskin',
        finish: 'Deep Crimson Stain',
        color: 'Red / Crimson',
        description:
          'Vibrant sculptural cutout sandal with ergonomic contoured leather footbed.',
        link: 'index.html#footwear-section',
      },
      {
        id: 'tc-slide-ivory-cross',
        title: 'Ivory Textured Cross Slide',
        category: 'Footwear',
        tag: 'Slides',
        material: 'Off-White Textured Leather',
        finish: 'Clean Minimalist Stitch',
        color: 'Ivory / Cream',
        description:
          'Square-toe contemporary silhouette with padded woven textured crossover bands.',
        link: 'index.html#footwear-section',
      },
      {
        id: 'tc-slide-onyx-chain',
        title: 'Onyx Curb Chain Leather Slide',
        category: 'Footwear',
        tag: 'Slides',
        material: 'Jet-Black Calfskin & Porcelain-Accented Chain',
        finish: 'Polished Gold & Porcelain',
        color: 'Jet Black / Gold',
        description:
          'Sleek jet-black calfskin banded with twin sculptural gold and porcelain chains.',
        link: 'new-arrival.html#new-arrivals',
      },
      {
        id: 'tc-slide-chromatic',
        title: 'Chromatic Metallic Gilded Slide',
        category: 'Footwear',
        tag: 'Slides',
        material: 'Woven Metallic Strands',
        finish: 'Fuchsia, Gold, Silver Weave',
        color: 'Chromatic',
        description:
          'Artisan woven metallic straps of fuchsia, molten gold, and platinum silver.',
        link: 'evening-luxury.html#vault-collection',
      },
      {
        id: 'tc-bag-crescent-ivory',
        title: 'Ivory Sculpted Crescent Bag',
        category: 'Bags',
        tag: 'Evening Bags',
        material: 'Smooth Sculpted Calfskin & Red Suede Interior',
        finish: 'Light Gold Hardware',
        color: 'Ivory / Red Contrast',
        description:
          'Iconic curved crescent shoulder bag with ribbed ergonomic contouring.',
        link: 'evening-luxury.html#vault-collection',
      },
      {
        id: 'tc-bag-tote-cognac',
        title: 'Cognac Hand-Stitched Leather Tote',
        category: 'Bags',
        tag: 'Totes',
        material: 'Supple Saddle Brown Leather',
        finish: 'Reinforced Handles & Charm Clasp',
        color: 'Cognac Brown',
        description:
          'Generous everyday luxury carryall featuring reinforced base and plush charm.',
        link: 'index.html#handbags-section',
      },
      {
        id: 'tc-bag-hobo-noir',
        title: 'Noir Classic Curved Shoulder Bag',
        category: 'Bags',
        tag: 'Evening Bags',
        material: 'Smooth Obsidian Calfskin',
        finish: 'Polished Gold Plate',
        color: 'Black / Noir',
        description:
          'Sleek underarm baguette silhouette designed for intimate evening engagements.',
        link: 'evening-luxury.html#vault-collection',
      },
      {
        id: 'tc-bag-nocturne-croc',
        title: 'Nocturne Navy Croc Pochette',
        category: 'Bags',
        tag: 'Evening Bags',
        material: 'Croc-Embossed Midnight Navy Calfskin',
        finish: '24K Gold-Plated Push-Clasp',
        color: 'Midnight Navy',
        description:
          'Structured midnight navy croc pochette with sculpted gold clasp and detachable chain.',
        link: 'new-arrival.html#new-arrivals',
      },
      {
        id: 'tc-bag-alabaster-crescent',
        title: 'Alabaster Sculpted Crescent',
        category: 'Bags',
        tag: 'Evening Bags',
        material: 'Off-White Box Leather',
        finish: 'Gleaming Gold Carabiner Links',
        color: 'Alabaster / Crimson',
        description:
          'Architecturally curved off-white box leather shoulder bag with crimson interior.',
        link: 'new-arrival.html#new-arrivals',
      },
      {
        id: 'tc-bag-tote-damier',
        title: 'Checkerboard Atelier Weekend Tote',
        category: 'Bags',
        tag: 'Totes',
        material: 'Coated Textured Canvas & Espresso Leather Trim',
        finish: 'Zip-Around Detachable Pouch',
        color: 'Espresso / Black',
        description:
          'Timeless checkered pattern tote with dedicated detachable cosmetics pouch.',
        link: 'index.html#handbags-section',
      },
      {
        id: 'tc-bag-weave-terracotta',
        title: 'Woven Terracotta Striped Shopper',
        category: 'Bags',
        tag: 'Totes',
        material: 'Natural Kenyan Handwoven Fiber & Crimson Leather',
        finish: 'Heavy Brass Zip Closure',
        color: 'Terracotta / Ochre',
        description:
          'Artisanal heritage woven textures fused with modern Italian calfskin handles.',
        link: 'index.html#handbags-section',
      },
      {
        id: 'tc-bag-denim-distressed',
        title: 'Distressed Denim Starlet Shoulder Bag',
        category: 'Bags',
        tag: 'Evening Bags',
        material: 'Frayed Indigo Denim & Heavy Chain Handle',
        finish: 'Chrome & Silver Hardware',
        color: 'Indigo Blue / Stonewash',
        description:
          'Y2K inspired luxury evening denim bag featuring star and patchwork motifs.',
        link: 'index.html#handbags-section',
      },
    ];

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
              <span class="tetu-kbd-hint"><span class="tetu-kbd">↑</span><span class="tetu-kbd">↓</span> to navigate</span>
              <span class="tetu-kbd-hint"><span class="tetu-kbd">↵</span> to select</span>
              <span class="tetu-kbd-hint"><span class="tetu-kbd">ESC</span> to close</span>
            </div>
            <div>Atelier Concierge: <a href="https://wa.me/${SEARCH_CONFIG.phoneRaw}" target="_blank" rel="noopener noreferrer" style="color: #d4af37;">${SEARCH_CONFIG.phone}</a> • Made by Bossy designs</div>
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
            <div class="tetu-search-empty-icon">✧</div>
            <h4 class="tetu-search-empty-title">No Atelier Pieces Found</h4>
            <p class="tetu-search-empty-desc">
              We couldn't find an exact match for <em>"${escapeHTML(
                state.query
              )}"</em>. Our artisans can handcraft bespoke variants to your preferred color, fit, and leather finish.
            </p>
            <a href="${fallbackUrl}" target="_blank" rel="noopener noreferrer" class="tetu-btn-enquire-empty">
              Enquire Bespoke Custom on WhatsApp ↗
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
              )} • ${escapeHTML(item.tag)} • <span style="color: #9ba1b0;">${escapeHTML(
            item.finish
          )}</span></div>
              <h5 class="tetu-result-title">${highlightedTitle}</h5>
              <p class="tetu-result-sub">${highlightedDesc}</p>
            </div>
            <div class="tetu-result-actions">
              <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="tetu-btn-result-wa" title="Direct WhatsApp order">
                WhatsApp ↗
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