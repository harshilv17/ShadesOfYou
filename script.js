// Shades of You — The Occasion Edit
// Main application script

// ── Product Data (real images from shadesofyou.co.in CDN) ──
const CDN = 'https://www.shadesofyou.co.in/cdn/shop/files/';

const PRODUCTS = [
  {
    id: 1,
    name: 'Autumn Glow Batik Suit Set',
    price: 3199, mrp: 4299,
    img: CDN + 'soy-yellow-batik-cotton-kurta-with-dupatta-styled.webp?v=1770293533&width=720',
    tags: ['festive','gift','all'], color: 'Yellow',
    href: 'https://www.shadesofyou.co.in/products/autumn-glow-batik-suit-set'
  },
  {
    id: 2,
    name: 'Batik Crazy In Love Suit Set',
    price: 2599, mrp: 3799,
    img: CDN + 'shades-of-you-blue-handblock-kurta-neckline-detail.webp?v=1768577315&width=720',
    tags: ['festive','all'], color: 'Blue',
    href: 'https://www.shadesofyou.co.in/products/batik-crazy-in-love-suit-set-in-water-blue'
  },
  {
    id: 3,
    name: "Batik in Alia's Anarkali Suit",
    price: 3199, mrp: 4299,
    img: CDN + '005A6280.webp?v=1769174808&width=720',
    tags: ['festive','gift','all'], color: 'Green',
    href: 'https://www.shadesofyou.co.in/products/batik-in-alia-s-anarkali-suit'
  },
  {
    id: 4,
    name: 'Silver Rain Suit Set',
    price: 2599, mrp: 3799,
    img: CDN + 'SOY2223125_Pink_B.webp?v=1770629410&width=720',
    tags: ['workday','gift','all'], color: 'Pink',
    href: 'https://www.shadesofyou.co.in/products/batik-lurex-suit-set'
  },
  {
    id: 5,
    name: 'Batik Lint Noodle Strap Suit Set',
    price: 1999, mrp: null,
    img: CDN + 'pomelli-image_19_1.webp?v=1773522163&width=720',
    tags: ['weekend','all'], color: 'Lint',
    href: 'https://www.shadesofyou.co.in/products/batik-noodle-strap-suit-set-copy'
  },
  {
    id: 6,
    name: 'Batik Olive Bloom Set',
    price: 1599, mrp: 3199,
    img: CDN + 'SOY2223066OliveB.webp?v=1769248782&width=720',
    tags: ['weekend','workday','all'], color: 'Green',
    href: 'https://www.shadesofyou.co.in/products/batik-olive-bloom-set'
  },
  {
    id: 7,
    name: 'Batik Scarlet Garden Set',
    price: 2799, mrp: 3999,
    img: CDN + 'soy-maroon-batik-cotton-kurta-front-view.webp?v=1770282047&width=720',
    tags: ['festive','gift','all'], color: 'Maroon',
    href: 'https://www.shadesofyou.co.in/products/batik-scarlet-garden-set'
  },
  {
    id: 8,
    name: 'Batik Silver Stripe Co-Ord Set',
    price: 1599, mrp: 3199,
    img: CDN + 'soy-3076-soft-pink-striped-cotton-coord-set-side.webp?v=1769258918&width=720',
    tags: ['weekend','workday','all'], color: 'Pink',
    href: 'https://www.shadesofyou.co.in/products/batik-silver-stripe-co-ord-set'
  },
  {
    id: 9,
    name: "Batik & Tie Dye's Love Child",
    price: 2799, mrp: 3999,
    img: CDN + 'SOY2223092BlueG.webp?v=1769246433&width=720',
    tags: ['festive','weekend','all'], color: 'Blue',
    href: 'https://www.shadesofyou.co.in/products/batik-tie-dye-s-love-child-1'
  },
  {
    id: 10,
    name: 'Rustic Rose Batik Suit Set',
    price: 2599, mrp: 3799,
    img: CDN + 'IMG_9903.webp?v=1770282369&width=720',
    tags: ['workday','gift','all'], color: 'Pink',
    href: 'https://www.shadesofyou.co.in/products/rustic-rose-batik-suit-set'
  },
  {
    id: 11,
    name: 'Indigo Batik Kurta Set',
    price: 2599, mrp: 3799,
    img: CDN + 'soy-indigo-batik-cotton-kurta-front-with-dupatta.webp?v=1768907098&width=720',
    tags: ['workday','festive','all'], color: 'Blue',
    href: 'https://www.shadesofyou.co.in/collections/all'
  },
  {
    id: 12,
    name: 'Lavender Batik Kurta',
    price: 2199, mrp: 3199,
    img: CDN + 'shades-of-you-lavender-handblock-kurta-side-view.webp?v=1768577414&width=720',
    tags: ['weekend','gift','all'], color: 'Purple',
    href: 'https://www.shadesofyou.co.in/collections/all'
  },
];

// ── Collection configs ──
const COLLECTIONS = {
  workday: {
    tag: 'Everyday Edit',
    title: 'Work Day <em>Wear</em>',
    sub: 'Breathable and polished — from first meeting to last chai.',
    heroImg: CDN + '4_4.webp?v=1772214362&width=1400',
    filters: ['All', 'Kurta Sets', 'Tops', 'Co-Ords'],
    tag2: 'Work Day',
  },
  festive: {
    tag: 'Festive Season',
    title: 'Puja & <em>Festive</em>',
    sub: 'Handcrafted prints that feel ceremonial without being stiff.',
    heroImg: CDN + '3_4.webp?v=1772214365&width=1400',
    filters: ['All', 'Suit Sets', 'Anarkali', 'Dupattas'],
    tag2: 'Festive',
  },
  weekend: {
    tag: 'Off-Duty',
    title: 'Weekend <em>Easy</em>',
    sub: 'For slow Sundays and spontaneous plans alike.',
    heroImg: CDN + '1_4.webp?v=1772214372&width=1400',
    filters: ['All', 'Co-Ords', 'Dresses', 'Tops'],
    tag2: 'Weekend',
  },
  gift: {
    tag: 'Thoughtful Giving',
    title: 'Gift <em>with Love</em>',
    sub: 'Pieces that feel personal. Our most-gifted styles.',
    heroImg: CDN + '2_4.webp?v=1772214368&width=1400',
    filters: ['All', 'Under ₹2000', 'Under ₹3000', 'Bestsellers'],
    tag2: 'Gift',
  },
  all: {
    tag: 'Full Collection',
    title: 'All <em>Styles</em>',
    sub: '66 handcrafted pieces. Organic fabrics. Worldwide shipping.',
    heroImg: CDN + 'Help_for.webp?v=1769974408&width=1400',
    filters: ['All', 'Kurta Sets', 'Tops', 'Co-Ords', 'Dresses'],
    tag2: 'All',
  },
};

// ── Routing ──
function goHome() {
  document.getElementById('page-home').classList.add('active');
  document.getElementById('page-collection').classList.remove('active');
  document.getElementById('siteNav').classList.remove('nav--inner');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showCollection(key) {
  const coll = COLLECTIONS[key];
  const products = PRODUCTS.filter(p => p.tags.includes(key));

  // Hero
  document.getElementById('collHeroPhoto').style.backgroundImage = `url('${coll.heroImg}')`;
  document.getElementById('collHeroTag').textContent = coll.tag;
  document.getElementById('collHeroTitle').innerHTML = coll.title;
  document.getElementById('collHeroSub').textContent = coll.sub;

  // Count
  document.getElementById('collCount').textContent = products.length;

  // Filters
  const filtersEl = document.getElementById('collFilters');
  filtersEl.innerHTML = coll.filters.map((f, i) =>
    `<button class="coll-filter${i===0?' active':''}" onclick="filterProducts('${key}', this)">${f}</button>`
  ).join('');

  // Products
  renderProducts(products);

  // Switch pages
  document.getElementById('page-home').classList.remove('active');
  document.getElementById('page-collection').classList.add('active');
  document.getElementById('siteNav').classList.add('nav--inner');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function filterProducts(collKey, btn) {
  // Update active state
  btn.closest('.coll-filter-row').querySelectorAll('.coll-filter')
    .forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Re-render (in a real Shopify build this would filter by tag/variant)
  const products = PRODUCTS.filter(p => p.tags.includes(collKey));
  renderProducts(products);
}

function renderProducts(products) {
  const grid = document.getElementById('prodGrid');
  document.getElementById('collCount').textContent = products.length;

  grid.innerHTML = products.map(p => `
    <a class="prod-card" href="${p.href}" target="_blank" rel="noopener">
      <div class="prod-card__img">
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
        ${p.mrp ? '<span class="prod-card__badge">Sale</span>' : ''}
        <div class="prod-card__overlay">
          <button class="prod-card__quickadd" onclick="event.preventDefault()">Quick Add</button>
        </div>
      </div>
      <p class="prod-card__name">${p.name}</p>
      <p class="prod-card__price">
        ${p.mrp ? `<s>₹${p.mrp.toLocaleString('en-IN')}</s>` : ''}
        <strong>₹${p.price.toLocaleString('en-IN')}</strong>
      </p>
    </a>
  `).join('');
}
