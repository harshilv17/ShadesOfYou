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

/* ── Product gallery thumbnails ──────────── */
function initProductGallery() {
  const thumbs = document.getElementById('ProductThumbs');
  const mainImg = document.querySelector('.prod-pg__main img');
  if (!thumbs || !mainImg) return;

  thumbs.addEventListener('click', (e) => {
    const btn = e.target.closest('.prod-pg__thumb');
    if (!btn) return;

    const src = btn.dataset.mediaSrc;
    if (src) mainImg.src = src;

    thumbs.querySelectorAll('.prod-pg__thumb').forEach((t) => t.classList.remove('on'));
    btn.classList.add('on');
  });
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
      let html = '';
      data.products.forEach(p => {
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
  refreshCartCount();
});
