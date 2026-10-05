(function (root) {
  'use strict';
  const PRODUCTS = [
  {
    "id": "tc-bag-alabaster",
    "title": "The Alabaster Crescent Shoulder Bag",
    "category": "Bags",
    "tag": "Shoulder Bag",
    "description": "Architecturally curved off-white leather body with crimson interior trim and polished gold hardware.",
    "material": "Select genuine leather",
    "finish": "Price Upon Request",
    "color": "Atelier finish",
    "image": "assets/images/lg/remote-01.webp",
    "imageSmall": "assets/images/sm/remote-01.webp",
    "width": 512,
    "height": 286,
    "link": "index.html#handbags-section"
  },
  {
    "id": "tc-bag-croc",
    "title": "The Croc-Embossed Crescent Set",
    "category": "Bags",
    "tag": "Crescent Suite",
    "description": "Exotic embossed calfskin in vibrant jewel hues with a sculpted crescent silhouette.",
    "material": "Select genuine leather",
    "finish": "Price Upon Request",
    "color": "Atelier finish",
    "image": "assets/images/lg/remote-02.webp",
    "imageSmall": "assets/images/sm/remote-02.webp",
    "width": 1280,
    "height": 1600,
    "link": "index.html#handbags-section"
  },
  {
    "id": "tc-bag-hobo",
    "title": "The Pastel Nappa Hobo Suite",
    "category": "Bags",
    "tag": "Hobo Bag",
    "description": "Soft nappa leather, considered proportions, and a graceful everyday drape.",
    "material": "Select genuine leather",
    "finish": "Price Upon Request",
    "color": "Atelier finish",
    "image": "assets/images/lg/remote-03.webp",
    "imageSmall": "assets/images/sm/remote-03.webp",
    "width": 384,
    "height": 512,
    "link": "index.html#handbags-section"
  },
  {
    "id": "tc-bag-denim",
    "title": "The Distressed Denim Monogram Bag",
    "category": "Bags",
    "tag": "Monogram Bag",
    "description": "Distressed denim texture paired with the TETU monogram and refined hardware.",
    "material": "Select genuine leather",
    "finish": "Price Upon Request",
    "color": "Atelier finish",
    "image": "assets/images/lg/remote-04.webp",
    "imageSmall": "assets/images/sm/remote-04.webp",
    "width": 384,
    "height": 512,
    "link": "index.html#handbags-section"
  },
  {
    "id": "tc-bag-carryall",
    "title": "The Two-Tone Ivory & Saddle Carryall",
    "category": "Bags",
    "tag": "Carryall",
    "description": "A structured two-tone carryall balancing ivory leather with warm saddle accents.",
    "material": "Select genuine leather",
    "finish": "Price Upon Request",
    "color": "Atelier finish",
    "image": "assets/images/lg/remote-05.webp",
    "imageSmall": "assets/images/sm/remote-05.webp",
    "width": 384,
    "height": 512,
    "link": "index.html#handbags-section"
  },
  {
    "id": "tc-bag-woven",
    "title": "The Artisan Heritage Woven Day Bag",
    "category": "Bags",
    "tag": "Day Bag",
    "description": "Hand-woven leather construction with a relaxed, generous day-bag profile.",
    "material": "Select genuine leather",
    "finish": "Price Upon Request",
    "color": "Atelier finish",
    "image": "assets/images/lg/remote-06.webp",
    "imageSmall": "assets/images/sm/remote-06.webp",
    "width": 384,
    "height": 512,
    "link": "index.html#handbags-section"
  },
  {
    "id": "tc-slide-noir",
    "title": "The Noir Curb Slide",
    "category": "Footwear",
    "tag": "Slides",
    "description": "Jet-black calfskin banded with sculptural gold and porcelain-accented curb chains.",
    "material": "Select genuine leather",
    "finish": "Price Upon Request",
    "color": "Atelier finish",
    "image": "assets/images/lg/remote-07.webp",
    "imageSmall": "assets/images/sm/remote-07.webp",
    "width": 512,
    "height": 512,
    "link": "index.html#footwear-section"
  },
  {
    "id": "tc-slide-chromatic",
    "title": "The Chromatic Woven Slide",
    "category": "Footwear",
    "tag": "Slides",
    "description": "Artisan woven metallic straps of fuchsia, molten gold, and platinum silver.",
    "material": "Select genuine leather",
    "finish": "Price Upon Request",
    "color": "Atelier finish",
    "image": "assets/images/lg/remote-08.webp",
    "imageSmall": "assets/images/sm/remote-08.webp",
    "width": 384,
    "height": 512,
    "link": "index.html#footwear-section"
  },
  {
    "id": "tc-slide-saffron",
    "title": "The Solar Saffron Slide",
    "category": "Footwear",
    "tag": "Slides",
    "description": "A vivid saffron statement slide for modern tailored resort dressing.",
    "material": "Select genuine leather",
    "finish": "Price Upon Request",
    "color": "Atelier finish",
    "image": "assets/images/lg/remote-09.webp",
    "imageSmall": "assets/images/sm/remote-09.webp",
    "width": 384,
    "height": 512,
    "link": "index.html#footwear-section"
  },
  {
    "id": "tc-slide-dual-tan",
    "title": "The Dual Tan Cutout Slide",
    "category": "Footwear",
    "tag": "Slides",
    "description": "Architectural cutouts and warm tan leather create a sculptural everyday slide.",
    "material": "Select genuine leather",
    "finish": "Price Upon Request",
    "color": "Atelier finish",
    "image": "assets/images/lg/remote-10.webp",
    "imageSmall": "assets/images/sm/remote-10.webp",
    "width": 512,
    "height": 286,
    "link": "index.html#footwear-section"
  },
  {
    "id": "tc-slide-safari",
    "title": "The Safari Sling Slide",
    "category": "Footwear",
    "tag": "Slides",
    "description": "A relaxed sling silhouette shaped in rich safari-toned leather.",
    "material": "Select genuine leather",
    "finish": "Price Upon Request",
    "color": "Atelier finish",
    "image": "assets/images/lg/remote-11.webp",
    "imageSmall": "assets/images/sm/remote-11.webp",
    "width": 384,
    "height": 512,
    "link": "index.html#footwear-section"
  },
  {
    "id": "tc-slide-artisan",
    "title": "The Artisan Loop Slide",
    "category": "Footwear",
    "tag": "Slides",
    "description": "Hand-finished loop detailing and a cushioned footbed for quiet comfort.",
    "material": "Select genuine leather",
    "finish": "Price Upon Request",
    "color": "Atelier finish",
    "image": "assets/images/lg/remote-12.webp",
    "imageSmall": "assets/images/sm/remote-12.webp",
    "width": 512,
    "height": 512,
    "link": "index.html#footwear-section"
  },
  {
    "id": "tc-slide-python",
    "title": "The Gilded Python Evening Slide",
    "category": "Footwear",
    "tag": "Gala Footwear",
    "description": "Luminous gold micro-textured reptile leather with double-band contouring.",
    "material": "Select genuine leather",
    "finish": "Price Upon Request",
    "color": "Atelier finish",
    "image": "assets/images/lg/remote-13.webp",
    "imageSmall": "assets/images/sm/remote-13.webp",
    "width": 512,
    "height": 512,
    "link": "index.html#footwear-section"
  },
  {
    "id": "tc-slide-chain",
    "title": "The Monogram Heavy Chain Evening Slide",
    "category": "Footwear",
    "tag": "Chunky Gold Series",
    "description": "Patterned monogram strap highlighted by a sculptural 24k gold curb chain.",
    "material": "Select genuine leather",
    "finish": "Price Upon Request",
    "color": "Atelier finish",
    "image": "assets/images/lg/remote-14.webp",
    "imageSmall": "assets/images/sm/remote-14.webp",
    "width": 512,
    "height": 512,
    "link": "index.html#footwear-section"
  },
  {
    "id": "tc-slide-onyx",
    "title": "The Noir Onyx Chain Slide",
    "category": "Footwear",
    "tag": "Noir Collection",
    "description": "A sleek onyx slide designed for evening opulence.",
    "material": "Select genuine leather",
    "finish": "Price Upon Request",
    "color": "Atelier finish",
    "image": "assets/images/lg/remote-15.webp",
    "imageSmall": "assets/images/sm/remote-15.webp",
    "width": 288,
    "height": 512,
    "link": "index.html#footwear-section"
  },
  {
    "id": "tc-bag-evening",
    "title": "The Alabaster Evening Crescent",
    "category": "Bags",
    "tag": "Black Tie Edition",
    "description": "A luminous sculpted crescent for private salon evenings.",
    "material": "Select genuine leather",
    "finish": "Price Upon Request",
    "color": "Atelier finish",
    "image": "assets/images/lg/remote-16.webp",
    "imageSmall": "assets/images/sm/remote-16.webp",
    "width": 384,
    "height": 512,
    "link": "index.html#handbags-section"
  },
  {
    "id": "tc-slide-gilded",
    "title": "The Chromatic Metallic Gilded Slide",
    "category": "Footwear",
    "tag": "Statement Piece",
    "description": "Woven metallic straps in fuchsia, molten gold, and platinum silver.",
    "material": "Select genuine leather",
    "finish": "Price Upon Request",
    "color": "Atelier finish",
    "image": "assets/images/lg/remote-17.webp",
    "imageSmall": "assets/images/sm/remote-17.webp",
    "width": 384,
    "height": 512,
    "link": "index.html#footwear-section"
  },
  {
    "id": "tc-slide-monogram",
    "title": "The Monogram Chain Slide in Gilded Hardware",
    "category": "Footwear",
    "tag": "Signature Piece",
    "description": "Patterned monogram canvas accentuated by hand-cast 24k golden curb chain links.",
    "material": "Select genuine leather",
    "finish": "Price Upon Request",
    "color": "Atelier finish",
    "image": "assets/images/lg/remote-18.webp",
    "imageSmall": "assets/images/sm/remote-18.webp",
    "width": 512,
    "height": 384,
    "link": "index.html#footwear-section"
  },
  {
    "id": "tc-slide-onyx-curb",
    "title": "The Onyx Curb Chain Leather Slide",
    "category": "Footwear",
    "tag": "Noir Collection",
    "description": "Jet-black calfskin with twin sculptural gold and porcelain-accented chains.",
    "material": "Select genuine leather",
    "finish": "Price Upon Request",
    "color": "Atelier finish",
    "image": "assets/images/lg/remote-19.webp",
    "imageSmall": "assets/images/sm/remote-19.webp",
    "width": 384,
    "height": 512,
    "link": "index.html#footwear-section"
  },
  {
    "id": "tc-bag-sculpted",
    "title": "The Alabaster Sculpted Crescent",
    "category": "Bags",
    "tag": "Maroquinerie",
    "description": "An iconic sculpted crescent shoulder bag in alabaster leather.",
    "material": "Select genuine leather",
    "finish": "Price Upon Request",
    "color": "Atelier finish",
    "image": "assets/images/lg/remote-20.webp",
    "imageSmall": "assets/images/sm/remote-20.webp",
    "width": 384,
    "height": 512,
    "link": "index.html#handbags-section"
  },
  {
    "id": "tc-bag-gala",
    "title": "The Nocturne Croc Pochette",
    "category": "Bags",
    "tag": "Black Tie Edition",
    "description": "A compact croc pochette with a polished evening finish.",
    "material": "Select genuine leather",
    "finish": "Price Upon Request",
    "color": "Atelier finish",
    "image": "assets/images/lg/remote-21.webp",
    "imageSmall": "assets/images/sm/remote-21.webp",
    "width": 384,
    "height": 512,
    "link": "index.html#handbags-section"
  }
];
  const escapeHTML = (value) => String(value || '').replace(/[&<>"']/g, (char) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[char]));
  const whatsappUrl = (product) => 'https://wa.me/254700309655?text=' + encodeURIComponent('Hello TETU COLLECTION,\n\nI would like to enquire about ' + product.title + '.\n\nPlease advise on availability, sizing, and acquisition details.');
  const renderCard = (product) => {
    const categoryClass = product.category.toLowerCase();
    return '<article class="product-card vault-item ' + categoryClass + ' group flex flex-col bg-surface-container-low overflow-hidden transition-all duration-500 hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.9),0_0_35px_-5px_rgba(212,175,55,0.18)]" data-product-id="' + product.id + '" data-category="' + categoryClass + '">' +
      '<div class="relative w-full aspect-[4/5] overflow-hidden bg-surface-container-lowest"><img alt="' + escapeHTML(product.title) + '" class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" src="' + product.image + '" srcset="' + product.imageSmall + ' 640w, ' + product.image + ' 1280w" sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" width="' + product.width + '" height="' + product.height + '"><div class="absolute top-4 left-4"><span class="px-3 py-1 bg-surface-container-lowest/90 backdrop-blur-md text-primary font-label-sm text-label-sm uppercase tracking-widest font-semibold">' + escapeHTML(product.tag) + '</span></div></div>' +
      '<div class="p-space-lg flex flex-col flex-grow justify-between space-y-6"><div class="space-y-2"><h3 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors duration-300">' + escapeHTML(product.title) + '</h3><p class="font-body-md text-body-md text-on-surface-variant font-light line-clamp-3">' + escapeHTML(product.description) + '</p></div><div class="pt-4 space-y-4"><div class="flex items-center justify-between"><span class="font-label-sm text-label-sm text-secondary-fixed/80 uppercase tracking-widest">Acquisition</span><span class="font-title text-title text-primary uppercase font-light tracking-wide">Price Upon Request</span></div><div class="flex gap-2"><button type="button" class="product-select-button flex-1 w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary font-label-md text-label-md uppercase tracking-[0.18em] transition-all duration-300" data-select-product="' + product.id + '" aria-pressed="false"><svg class="icon" aria-hidden="true"><use href="#icon-check"></use></svg><span>Select</span></button><a class="flex-1 w-full flex items-center justify-center gap-2 py-3.5 px-3 bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary font-label-md text-label-md uppercase tracking-[0.12em] transition-all duration-300" href="' + whatsappUrl(product) + '" rel="noopener noreferrer" target="_blank">Enquire</a></div></div></div></article>';
  };
  function renderProductGrids() {
    document.querySelectorAll('[data-product-grid]').forEach((grid) => {
      const kind = grid.dataset.productGrid;
      const filtered = PRODUCTS.filter((product) => kind === 'all' || kind === 'new-arrivals' || product.category.toLowerCase() === kind);
      grid.innerHTML = filtered.map(renderCard).join('');
    });
    updateEnquiryAction();
    document.dispatchEvent(new CustomEvent('tetu:products-rendered'));
  }
  function getSelectedProducts() {
    const selected = new Set(JSON.parse(localStorage.getItem('tetu_enquiry_list') || '[]'));
    return PRODUCTS.filter((product) => selected.has(product.id));
  }
  function updateEnquiryAction() {
    let action = document.getElementById('enquiry-list-action');
    if (!action) {
      action = document.createElement('a');
      action.id = 'enquiry-list-action';
      action.className = 'enquiry-list-action';
      action.target = '_blank';
      action.rel = 'noopener noreferrer';
      action.innerHTML = '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5h14v14H5z"/><path d="m8 12 2.5 2.5L16 9"/></svg><span></span>';
      document.body.appendChild(action);
    }
    const selected = getSelectedProducts();
    action.hidden = selected.length === 0;
    action.querySelector('span').textContent = `Enquiry list (${selected.length})`;
    action.href = 'https://wa.me/254700309655?text=' + encodeURIComponent(
      'Hello TETU COLLECTION,\n\nI would like to enquire about these selected pieces:\n' +
      selected.map((product) => `• ${product.title}`).join('\n') +
      '\n\nPlease advise on availability and acquisition details.'
    );
  }
  function toggleSelection(id) {
    const selected = new Set(JSON.parse(localStorage.getItem('tetu_enquiry_list') || '[]'));
    selected.has(id) ? selected.delete(id) : selected.add(id);
    localStorage.setItem('tetu_enquiry_list', JSON.stringify([...selected]));
    document.querySelectorAll('[data-select-product="' + id + '"]').forEach((button) => { button.classList.toggle('is-selected', selected.has(id)); button.setAttribute('aria-pressed', String(selected.has(id))); button.querySelector('span').textContent = selected.has(id) ? 'Selected' : 'Select'; });
    updateEnquiryAction();
  }
  function initProductInteractions() { document.addEventListener('click', (event) => { const button=event.target.closest('[data-select-product]'); if(button) toggleSelection(button.dataset.selectProduct); }); }
  root.TETU_PRODUCTS = PRODUCTS; root.TETU_PRODUCT_API = { renderProductGrids, whatsappUrl, toggleSelection };
  document.addEventListener('DOMContentLoaded', () => { renderProductGrids(); initProductInteractions(); });
})(window);
