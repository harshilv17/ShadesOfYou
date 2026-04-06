/**
 * Shades of You — global.js
 */

function onReady(fn) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}

/* ── Mobile navigation ───────────────────── */
function initMobileNav() {
  const toggle = document.querySelector('.nav__hamburger');
  const nav = document.querySelector('.mobile-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('is-open');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav') && !e.target.closest('.mobile-nav')) {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    }
  });
}

/* ── Hero slider ─────────────────────────── */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('.hero__dot');
  if (slides.length < 2) return;

  let idx = 0;

  function setSlide(i) {
    idx = i;
    slides.forEach((s, j) => s.classList.toggle('on', j === idx));
    dots.forEach((d, j) => d.classList.toggle('on', j === idx));
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const i = parseInt(dot.dataset.heroDot, 10);
      if (!isNaN(i)) setSlide(i);
    });
  });

  setInterval(() => {
    setSlide((idx + 1) % slides.length);
  }, 5000);
}

/* ── Testimonials drag scroll ────────────── */
function initTestimonialsDrag() {
  const track = document.getElementById('testimonialsTrack');
  if (!track) return;

  let dragging = false, startX = 0, scrollLeft = 0;

  track.addEventListener('mousedown', (e) => {
    dragging = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    track.style.cursor = 'grabbing';
  });
  track.addEventListener('mouseleave', () => { dragging = false; track.style.cursor = 'grab'; });
  track.addEventListener('mouseup', () => { dragging = false; track.style.cursor = 'grab'; });
  track.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX) * 1.2;
  });
}

/* ── Product gallery ─────────────────────── */
function initProductGallery() {
  const slides = document.getElementById('ProductSlides');
  const thumbs = document.getElementById('ProductThumbs');
  const dots = document.getElementById('ProductDots');
  if (!slides) return;

  let currentIndex = 0;
  const slideEls = slides.querySelectorAll('.prod-pg__slide');
  const thumbBtns = thumbs ? thumbs.querySelectorAll('.prod-pg__thumb') : [];
  const dotBtns = dots ? dots.querySelectorAll('.prod-pg__dot') : [];

  function setActive(index) {
    currentIndex = index;
    thumbBtns.forEach((t, i) => t.classList.toggle('on', i === index));
    dotBtns.forEach((d, i) => d.classList.toggle('on', i === index));
  }

  function scrollToSlide(index) {
    const target = slideEls[index];
    if (target) {
      slides.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
    }
  }

  let scrollTimeout;
  slides.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollLeft = slides.scrollLeft;
      const slideWidth = slides.offsetWidth;
      const idx = Math.round(scrollLeft / slideWidth);
      if (idx !== currentIndex && idx >= 0 && idx < slideEls.length) {
        setActive(idx);
      }
    }, 60);
  }, { passive: true });

  if (thumbs) {
    thumbs.addEventListener('click', (e) => {
      const btn = e.target.closest('.prod-pg__thumb');
      if (!btn) return;
      const idx = parseInt(btn.dataset.thumbIndex, 10);
      if (!isNaN(idx)) { scrollToSlide(idx); setActive(idx); }
    });
  }

  if (dots) {
    dots.addEventListener('click', (e) => {
      const btn = e.target.closest('.prod-pg__dot');
      if (!btn) return;
      const idx = parseInt(btn.dataset.dotIndex, 10);
      if (!isNaN(idx)) { scrollToSlide(idx); setActive(idx); }
    });
  }

  initZoomLightbox();
}

/* ── Zoom lightbox ──────────────────────── */
function initZoomLightbox() {
  const overlay = document.getElementById('ZoomOverlay');
  const zoomImg = document.getElementById('ZoomImg');
  if (!overlay || !zoomImg) return;

  let scale = 1;
  const MIN_SCALE = 1;
  const MAX_SCALE = 3;

  function open(src) {
    zoomImg.src = src;
    scale = 1;
    zoomImg.style.transform = 'scale(1)';
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { zoomImg.src = ''; }, 300);
  }

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open-zoom]');
    if (trigger) { open(trigger.dataset.openZoom); return; }
    if (e.target.closest('[data-close-zoom]')) { close(); return; }
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
  });

  overlay.addEventListener('dblclick', (e) => {
    if (e.target.closest('[data-close-zoom]')) return;
    scale = scale > 1 ? 1 : 2;
    zoomImg.style.transform = 'scale(' + scale + ')';
  });

  overlay.addEventListener('wheel', (e) => {
    e.preventDefault();
    scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + (e.deltaY > 0 ? -0.2 : 0.2)));
    zoomImg.style.transform = 'scale(' + scale + ')';
  }, { passive: false });

  let lastDist = 0;
  overlay.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      lastDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  }, { passive: true });

  overlay.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = (dist - lastDist) * 0.008;
      scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + delta));
      zoomImg.style.transform = 'scale(' + scale + ')';
      lastDist = dist;
    }
  }, { passive: false });
}

/* ── Accordion toggle ────────────────────── */
function initAccordions() {
  document.addEventListener('click', (e) => {
    const hd = e.target.closest('[data-accordion-toggle]') || e.target.closest('.prod-pg__acc-hd');
    if (!hd) return;

    const bd = hd.nextElementSibling;
    const icon = hd.querySelector('.prod-pg__acc-icon');
    if (!bd) return;

    bd.classList.toggle('open');
    if (icon) icon.textContent = bd.classList.contains('open') ? '−' : '+';
  });
}

/* ── Quantity controls ───────────────────── */
function initQuantityControls() {
  document.addEventListener('click', (e) => {
    const dec = e.target.closest('[data-qty-decrement]');
    const inc = e.target.closest('[data-qty-increment]');
    if (!dec && !inc) return;

    const wrapper = (dec || inc).closest('.quantity-selector');
    const input = wrapper && wrapper.querySelector('[data-qty-input]');
    if (!input) return;

    const current = parseInt(input.value, 10) || 1;
    const min = parseInt(input.min, 10) || 1;

    if (dec) input.value = Math.max(min, current - 1);
    if (inc) input.value = current + 1;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

/* ── Variant picker ──────────────────────── */
function initVariantPicker() {
  const form = document.querySelector('[data-product-form]');
  if (!form) return;

  form.addEventListener('change', (e) => {
    if (!e.target.matches('[data-variant-option]')) return;
    updateSelectedVariant(form);
  });
}

function updateSelectedVariant(form) {
  const selected = [];
  form.querySelectorAll('.js-variant-fieldset').forEach((fieldset) => {
    const checked = fieldset.querySelector('input[type="radio"]:checked');
    if (checked) selected.push(checked.value);
  });

  const variantData = JSON.parse(
    document.querySelector('[data-product-variants]')?.textContent || '[]'
  );
  const match = variantData.find((v) =>
    v.options.every((opt, i) => opt === selected[i])
  );
  if (!match) return;

  const idInput = form.querySelector('[data-variant-id]');
  const submitBtn = form.querySelector('[type="submit"]');

  if (idInput) idInput.value = match.id;
  if (submitBtn) {
    submitBtn.disabled = !match.available;
    submitBtn.textContent = match.available ? 'Add to Cart' : 'Sold Out';
  }

  const priceEl = document.getElementById('PriceContainer');
  if (priceEl && match.price !== undefined) {
    const fmt = (cents) => '₹' + (cents / 100).toLocaleString('en-IN', { minimumFractionDigits: 0 });
    const current = priceEl.querySelector('.prod-pg__price');
    const compare = priceEl.querySelector('.prod-pg__mrp');
    const saved = priceEl.querySelector('.prod-pg__saved');
    if (current) current.textContent = fmt(match.price);
    if (compare) {
      if (match.compare_at_price && match.compare_at_price > match.price) {
        compare.textContent = fmt(match.compare_at_price);
        compare.style.display = '';
        const pct = Math.round(((match.compare_at_price - match.price) / match.compare_at_price) * 100);
        if (saved) { saved.textContent = pct + '% off'; saved.style.display = ''; }
      } else {
        compare.style.display = 'none';
        if (saved) saved.style.display = 'none';
      }
    }
  }

  if (window.history && window.history.replaceState) {
    const url = new URL(window.location.href);
    url.searchParams.set('variant', match.id);
    window.history.replaceState({}, '', url.toString());
  }

  updateStickyPrice(match);
}

/* ── Cart ─────────────────────────────────── */
async function refreshCartCount() {
  try {
    const res = await fetch('/cart.js');
    const cart = await res.json();
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      el.textContent = cart.item_count;
      el.classList.toggle('hidden', cart.item_count === 0);
    });
  } catch (_) {}
}

function initAddToCart() {
  const form = document.querySelector('[data-product-form]');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const id = form.querySelector('[data-variant-id]')?.value;
    const qty = form.querySelector('[data-qty-input]')?.value || 1;
    if (!id) return;

    btn.disabled = true;
    btn.textContent = 'Adding…';

    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: parseInt(id, 10), quantity: parseInt(qty, 10) }),
      });
      if (!res.ok) throw new Error('Add to cart failed');
      await refreshCartCount();
      btn.textContent = '✓ Added to Cart';
      btn.style.background = '#3A6B4A';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Add to Cart';
        btn.style.background = '';
      }, 2200);
    } catch (err) {
      console.error(err);
      btn.disabled = false;
      btn.textContent = 'Add to Cart';
    }
  });
}

/* ── Sort select ─────────────────────────── */
function initSortSelect() {
  document.addEventListener('change', (e) => {
    if (!e.target.matches('[data-sort-select]')) return;
    const url = new URL(window.location.href);
    url.searchParams.set('sort_by', e.target.value);
    window.location.assign(url.toString());
  });
}

/* ── Product recommendations ─────────────── */
function initProductRecommendations() {
  const el = document.getElementById('ProductRecommendations');
  if (!el) return;

  const productId = el.dataset.productId;
  const sectionId = el.dataset.sectionId;
  if (!productId) return;

  fetch(`/recommendations/products.json?product_id=${productId}&limit=4`)
    .then(r => r.json())
    .then(data => {
      if (!data.products || data.products.length === 0) return;
      const seen = new Set();
      let html = '';
      data.products.forEach(p => {
        if (seen.has(p.id)) return;
        seen.add(p.id);
        const img = p.featured_image ? `<img src="${p.featured_image}" loading="lazy" alt="${p.title}">` : '';
        const comparePrice = p.compare_at_price && p.compare_at_price > p.price
          ? `<s>₹${(p.compare_at_price / 100).toLocaleString('en-IN')}</s>` : '';
        const badge = p.compare_at_price && p.compare_at_price > p.price
          ? '<span class="pcard__badge">Sale</span>' : '';
        html += `<a class="pcard" href="${p.url}">
          <div class="pcard__img">${img}${badge}</div>
          <p class="pcard__name">${p.title}</p>
          <p class="pcard__price">${comparePrice}<strong>₹${(p.price / 100).toLocaleString('en-IN')}</strong></p>
        </a>`;
      });
      el.innerHTML = html;
    })
    .catch(() => {});
}

/* ── Size guide modal ──────────────────── */
function initSizeGuide() {
  const overlay = document.getElementById('SizeGuideOverlay');
  if (!overlay) return;

  function open() {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-open-size-guide]').forEach((btn) => {
    btn.addEventListener('click', open);
  });

  overlay.querySelectorAll('[data-close-size-guide]').forEach((btn) => {
    btn.addEventListener('click', close);
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
  });

  const tabs = overlay.querySelectorAll('.size-guide__tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const unit = tab.dataset.unit;
      tabs.forEach((t) => t.classList.remove('on'));
      tab.classList.add('on');
      overlay.querySelectorAll('[data-unit-table]').forEach((table) => {
        table.style.display = table.dataset.unitTable === unit ? '' : 'none';
      });
    });
  });
}

/* ── Sticky ATC bar ─────────────────────── */
function initStickyAtc() {
  const mainBlock = document.getElementById('MainAtcBlock');
  const stickyBar = document.getElementById('StickyAtc');
  const stickyBtn = document.getElementById('StickyAtcBtn');
  const form = document.querySelector('[data-product-form]');
  if (!mainBlock || !stickyBar || !stickyBtn || !form) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      const show = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      stickyBar.classList.toggle('is-visible', show);
      stickyBar.setAttribute('aria-hidden', String(!show));
    },
    { threshold: 0 }
  );
  observer.observe(mainBlock);

  stickyBtn.addEventListener('click', () => {
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn && !submitBtn.disabled) {
      submitBtn.click();
    }
  });
}

function updateStickyPrice(match) {
  const stickyPrice = document.getElementById('StickyPrice');
  const stickyBtn = document.getElementById('StickyAtcBtn');
  if (!stickyPrice || !match) return;

  const fmt = (cents) => '₹' + (cents / 100).toLocaleString('en-IN', { minimumFractionDigits: 0 });
  let html = fmt(match.price);
  if (match.compare_at_price && match.compare_at_price > match.price) {
    html += ' <span class="sticky-atc__mrp">' + fmt(match.compare_at_price) + '</span>';
  }
  stickyPrice.innerHTML = html;

  if (stickyBtn) {
    stickyBtn.disabled = !match.available;
    stickyBtn.textContent = match.available ? 'Add to Cart' : 'Sold Out';
  }
}

/* ── Reviews section ────────────────────── */
function initReviews() {
  const list = document.getElementById('ReviewsList');
  const empty = document.getElementById('ReviewsEmpty');
  if (!list || !empty) return;

  const observer = new MutationObserver(() => {
    if (list.children.length > 0) {
      empty.style.display = 'none';
    }
  });
  observer.observe(list, { childList: true });
}

/* ── Init ─────────────────────────────────── */
onReady(() => {
  initMobileNav();
  initHeroSlider();
  initTestimonialsDrag();
  initProductGallery();
  initAccordions();
  initQuantityControls();
  initVariantPicker();
  initAddToCart();
  initSortSelect();
  initProductRecommendations();
  initStickyAtc();
  initSizeGuide();
  initReviews();
  refreshCartCount();
});
