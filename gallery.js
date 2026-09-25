/**
 * ==========================================================================
 * TETU COLLECTION — INTERACTIVE PRODUCT GALLERY & LIGHTBOX CONTROLLER (gallery.js)
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
        `Direct Concierge (${GALLERY_CONFIG.phone} • Made by ${GALLERY_CONFIG.madeBy})`;
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
              🔍 <span id="tetu-lb-zoom-label">Zoom In</span>
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
                Enquire on WhatsApp ↗
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
        badgeEl.textContent = `${item.category.toUpperCase()} • ${
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
    // 12. NAVIGATION LINKS — Active state + smooth scroll
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