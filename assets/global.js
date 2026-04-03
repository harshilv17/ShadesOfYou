/**
 * Shades of You — global.js
 * Vanilla JS for header interactions, mobile nav, cart, variant selection,
 * product gallery, and quantity controls.
 */

/* ── DOM-ready helper ─────────────────────────────────────────────────────── */
function onReady(fn) {
  if (document.readyState !== 'loading') { fn(); } else { document.addEventListener('DOMContentLoaded', fn); }
}

/* ── Mobile navigation ────────────────────────────────────────────────────── */
function initMobileNav() {
  const toggle = document.querySelector('.site-header__menu-toggle');
  const nav    = document.querySelector('.mobile-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('is-open');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.site-header') && !e.target.closest('.mobile-nav')) {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    }
  });
}

/* ── Sticky header shadow ─────────────────────────────────────────────────── */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const observer = new IntersectionObserver(
    ([e]) => header.classList.toggle('site-header--scrolled', !e.isIntersecting),
    { threshold: [1], rootMargin: '-1px 0px 0px 0px' }
  );
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;height:1px;width:100%;pointer-events:none;';
  document.body.prepend(sentinel);
  observer.observe(sentinel);
}

/* ── Quantity controls ────────────────────────────────────────────────────── */
function initQuantityControls() {
  document.addEventListener('click', (e) => {
    const dec = e.target.closest('[data-qty-decrement]');
    const inc = e.target.closest('[data-qty-increment]');
    if (!dec && !inc) return;

    const wrapper = (dec || inc).closest('.quantity-selector');
    const input   = wrapper && wrapper.querySelector('[data-qty-input]');
    if (!input) return;

    const current = parseInt(input.value, 10) || 1;
    const min     = parseInt(input.min, 10)   || 0;

    if (dec) input.value = Math.max(min, current - 1);
    if (inc) input.value = current + 1;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

/* ── Product gallery ──────────────────────────────────────────────────────── */
function initProductGallery() {
  const gallery = document.getElementById('ProductGallery');
  const thumbs  = document.getElementById('ProductThumbs');
  if (!gallery || !thumbs) return;

  thumbs.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-media-id]');
    if (!btn) return;

    const mediaId = btn.dataset.mediaId;

    gallery.querySelectorAll('.main-product__media-item').forEach((item) => {
      item.classList.toggle('main-product__media-item--active', item.dataset.mediaId === mediaId);
    });
    thumbs.querySelectorAll('.main-product__thumb').forEach((t) => {
      t.classList.toggle('active', t.dataset.mediaId === mediaId);
    });
  });
}

/* ── Variant picker ───────────────────────────────────────────────────────── */
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

  const idInput   = form.querySelector('[data-variant-id]');
  const submitBtn = form.querySelector('[type="submit"]');

  if (idInput)   idInput.value = match.id;
  if (submitBtn) {
    submitBtn.disabled = !match.available;
    submitBtn.textContent = match.available ? 'Add to Cart' : 'Sold Out';
  }

  const priceEl = document.getElementById('PriceContainer');
  if (priceEl && match.price !== undefined) {
    const fmt = (cents) => '₹' + (cents / 100).toLocaleString('en-IN', { minimumFractionDigits: 0 });
    const current = priceEl.querySelector('.price__current');
    const compare = priceEl.querySelector('.price__compare');
    if (current) current.textContent = fmt(match.price);
    if (compare) {
      compare.textContent = match.compare_at_price ? fmt(match.compare_at_price) : '';
      compare.style.display = match.compare_at_price ? '' : 'none';
    }
  }
}

/* ── Cart count refresh ───────────────────────────────────────────────────── */
async function refreshCartCount() {
  try {
    const res  = await fetch('/cart.js');
    const cart = await res.json();
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      el.textContent = cart.item_count;
      el.classList.toggle('hidden', cart.item_count === 0);
    });
  } catch (_) {}
}

/* ── Add-to-cart form ─────────────────────────────────────────────────────── */
function initAddToCart() {
  const form = document.querySelector('[data-product-form]');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn  = form.querySelector('[type="submit"]');
    const id   = form.querySelector('[data-variant-id]')?.value;
    const qty  = form.querySelector('[data-qty-input]')?.value || 1;
    if (!id) return;

    btn.disabled = true;
    btn.textContent = 'Adding…';

    try {
      const res = await fetch('/cart/add.js', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id, quantity: parseInt(qty, 10) }),
      });
      if (!res.ok) throw new Error('Add to cart failed');
      await refreshCartCount();
      btn.textContent = 'Added!';
      setTimeout(() => {
        btn.disabled    = false;
        btn.textContent = 'Add to Cart';
      }, 1800);
    } catch (err) {
      console.error(err);
      btn.disabled    = false;
      btn.textContent = 'Add to Cart';
    }
  });
}

/* ── Sort select ──────────────────────────────────────────────────────────── */
function initSortSelect() {
  document.addEventListener('change', (e) => {
    if (!e.target.matches('[data-sort-select]')) return;
    const url = new URL(window.location.href);
    url.searchParams.set('sort_by', e.target.value);
    window.location.assign(url.toString());
  });
}

/* ── Init ─────────────────────────────────────────────────────────────────── */
onReady(() => {
  initMobileNav();
  initStickyHeader();
  initQuantityControls();
  initProductGallery();
  initVariantPicker();
  initAddToCart();
  initSortSelect();
  refreshCartCount();
});
