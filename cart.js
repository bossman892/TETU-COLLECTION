/**
 * ==========================================================================
 * TETU COLLECTION — CLIENT ACQUISITIONS & BESPOKE CART CONTROLLER (cart.js)
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
        (notes ? `• Additional Fitting Notes: "${notes}"\n` : '') +
        `Please advise on bespoke production lead time, custom fitting, and acquisition details.\n\n` +
        `Direct Concierge (${CART_CONFIG.phone} • Made by ${CART_CONFIG.madeBy})`
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
              <span>Enquire on WhatsApp ↗</span>
            </button>
            <div class="tetu-cart-footer-info">
              Direct Concierge: ${CART_CONFIG.phone} • Made by ${CART_CONFIG.madeBy}
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
            <div class="tetu-cart-empty-emblem">✧</div>
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
                ${item.size ? `<span>Size: ${item.size}</span> • ` : ''}
                <span style="color:#d4af37;">Bespoke Order</span>
              </div>
              <div class="tetu-cart-qty-ctrl">
                <button class="tetu-cart-btn-qty" data-action="dec" data-index="${idx}">-</button>
                <span class="tetu-cart-qty-num">${item.quantity}</span>
                <button class="tetu-cart-btn-qty" data-action="inc" data-index="${idx}">+</button>
              </div>
            </div>
            <button class="tetu-cart-btn-remove" data-action="remove" data-index="${idx}" title="Remove piece">
              ✕
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
    // 10. NAVIGATION LINKS — Active state + smooth scroll
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