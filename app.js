/* TETU COLLECTION site runtime */
(function () {
  'use strict';

  const PHONE = '254700309655';
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function whatsappUrl(message) {
    return `https://wa.me/${PHONE}?text=${encodeURIComponent(String(message).trim())}`;
  }

  function openWhatsApp(message) {
    const url = whatsappUrl(message);
    window.open(url, '_blank', 'noopener,noreferrer');
    return url;
  }

  function initMobileNavigation() {
    const toggle = $('#mobile-menu-toggle');
    const panel = $('#mobile-menu-panel');
    const backdrop = $('#mobile-menu-backdrop');
    const closeButton = $('#mobile-menu-close');
    if (!toggle || !panel) return;

    let isOpen = false;
    const setOpen = (next) => {
      isOpen = next;
      panel.classList.toggle('translate-x-full', !next);
      panel.classList.toggle('translate-x-0', next);
      panel.classList.toggle('open', next);
      panel.setAttribute('aria-hidden', String(!next));
      toggle.setAttribute('aria-expanded', String(next));
      toggle.classList.toggle('is-active', next);
      if (backdrop) {
        backdrop.classList.toggle('hidden', !next);
        backdrop.classList.toggle('open', next);
      }
      document.body.classList.toggle('menu-open', next);
      document.body.style.overflow = next ? 'hidden' : '';
      document.documentElement.style.overflow = next ? 'hidden' : '';
      document.body.style.position = '';
      document.body.style.width = '';
    };

    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      setOpen(!isOpen);
    });
    closeButton?.addEventListener('click', () => setOpen(false));
    backdrop?.addEventListener('click', () => setOpen(false));
    $$('#mobile-menu-panel a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isOpen) setOpen(false);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && isOpen) setOpen(false);
    });
    setOpen(false);
  }

  function initActiveNavigation() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    $$('[data-path]').forEach((link) => {
      const href = link.getAttribute('href') || '';
      const active = href.split('#')[0] === path || (path === 'index.html' && href === '#home');
      link.classList.toggle('text-primary', active);
      link.classList.toggle('border-primary', active);
      link.setAttribute('aria-current', active ? 'page' : 'false');
    });
  }

  function initSmoothAnchors() {
    $$('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => {
      const target = $(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    }));
  }

  function productMatches(product, query) {
    const haystack = [product.title, product.category, product.tag, product.description]
      .join(' ')
      .toLowerCase();
    return haystack.includes(query.toLowerCase());
  }

  function initSearch() {
    const trigger = $$('button[aria-label="Search Archive"]')[0];
    if (!trigger || !window.TETU_PRODUCTS) return;

    const modal = document.createElement('div');
    modal.className = 'tetu-search-modal';
    modal.hidden = true;
    modal.innerHTML = `
      <div class="tetu-search-dialog" role="dialog" aria-modal="true" aria-labelledby="tetu-search-title">
        <button type="button" class="tetu-search-close" aria-label="Close search">×</button>
        <p class="font-label-sm text-label-sm text-primary uppercase tracking-widest">The archive</p>
        <h2 id="tetu-search-title" class="font-headline-lg text-headline-lg text-on-surface">Find your piece</h2>
        <input class="tetu-search-input" type="search" placeholder="Search bags, slides, or finishes" aria-label="Search products">
        <div class="tetu-search-results" aria-live="polite"></div>
      </div>`;
    document.body.appendChild(modal);
    const input = $('.tetu-search-input', modal);
    const results = $('.tetu-search-results', modal);

    const renderResults = () => {
      const query = input.value.trim();
      const matches = query ? window.TETU_PRODUCTS.filter((product) => productMatches(product, query)) : window.TETU_PRODUCTS;
      results.innerHTML = matches.length
        ? matches.map((product) => `<a href="${product.link}" class="tetu-search-result"><span>${product.title}</span><small>${product.category}</small></a>`).join('')
        : '<p class="text-on-surface-variant">No pieces matched your search.</p>';
    };
    const close = () => {
      modal.hidden = true;
      input.value = '';
      trigger.focus();
    };
    trigger.addEventListener('click', () => {
      modal.hidden = false;
      renderResults();
      input.focus();
    });
    $('.tetu-search-close', modal).addEventListener('click', close);
    modal.addEventListener('click', (event) => { if (event.target === modal) close(); });
    input.addEventListener('input', renderResults);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !modal.hidden) close();
    });
  }

  function initContactForm() {
    const form = $('#contact-form');
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = $('#contact-name')?.value.trim();
      const phone = $('#contact-phone')?.value.trim();
      const interest = $('#contact-interest')?.value;
      const message = $('#contact-message')?.value.trim();
      if (!name || !phone || !interest || !message) {
        window.alert('Please complete all fields before sending your enquiry.');
        return;
      }
      openWhatsApp(`Hello TETU COLLECTION,\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Interest:* ${interest}\n\n*Message:*\n"${message}"`);
    });
  }

  function initEveningFilters() {
    window.filterVault = (filter, button) => {
      $$('[data-filter]').forEach((item) => {
        item.classList.toggle('bg-primary', item === button);
        item.classList.toggle('text-on-primary', item === button);
        item.classList.toggle('bg-surface-container', item !== button);
        item.classList.toggle('text-on-surface-variant', item !== button);
      });
      $$('[data-product-id]').forEach((card) => {
        card.hidden = filter !== 'all' && card.dataset.category !== filter &&
          !(filter === 'blacktie' && card.querySelector('.text-label-sm')?.textContent.includes('Black Tie'));
      });
    };
    $$('[data-filter]').forEach((button) => {
      button.addEventListener('click', () => window.filterVault(button.dataset.filter, button));
    });
  }

  function addMobileWhatsAppButton() {
    if ($('#mobile-whatsapp-button')) return;
    const button = document.createElement('a');
    button.id = 'mobile-whatsapp-button';
    button.className = 'mobile-whatsapp-button';
    button.href = whatsappUrl('Hello TETU COLLECTION, I would like to enquire about your bespoke collection.');
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    button.setAttribute('aria-label', 'Contact TETU COLLECTION on WhatsApp');
    button.innerHTML = '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z"/><path d="M8.5 9.2c.3 2 2.3 4 4.3 4.3l1.2-.8 1.5.7c.3.2.3.6.1.9-.5.7-1.4 1-2.3.8-3.6-.9-5.2-2.5-5.9-5.2-.2-.9.1-1.8.8-2.3.3-.2.7-.2.9.1l.7 1.5-.8 1.2Z"/></svg><span>WhatsApp</span>';
    document.body.appendChild(button);
  }

  function initReveals() {
    if (reducedMotion || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    $$('.tetu-reveal, .tetu-reveal-scale, .tetu-reveal-left, .tetu-reveal-right').forEach((element) => observer.observe(element));
  }

  function init() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    initMobileNavigation();
    initActiveNavigation();
    initSmoothAnchors();
    initSearch();
    initContactForm();
    initEveningFilters();
    addMobileWhatsAppButton();
    initReveals();
  }

  window.TetuWhatsApp = { url: whatsappUrl, open: openWhatsApp };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
