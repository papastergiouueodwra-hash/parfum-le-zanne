const womenProducts = [
  'Alien mugler', 'Black opium', 'Coconut passion.', 'Carolina herrera good girl',
  'Dior hypnotic poison', 'La vie est belle lancome', 'Burberry london', 'Love spell victoria secret',
  'Spectra pink shell', 'Jo malone london pear and freesia', 'Summer girl Tommy hilfiger', 'Rose prick tom ford',
  'Gabrielle Chanel paris', 'Jean paul gaultier scandal', 'Paco rabanne pure Xs', 'Dior joy',
  'Gucci bloom', 'Black orchid tom ford', 'Chanel coco mademoiselle', 'Giorgio armani si passione',
  'Narciso ambree', 'Angel gold victoria secret', 'Chanel no 5', 'Dolce gabbana light blue',
  'Bella vince camuto', 'Pure musc for her narciso rodriguez', 'Lancome idole', 'Armani my way',
  'Burberry her burberry', 'Dior jadore', 'Be giddy black opium ysl', 'Barby my barberry',
  'Channel no5', 'Coconut passion vs', 'Idole lancome', 'Golden scent',
  'Good girl carolina herrera', 'Jennifer Lopez blow', 'Armani my way', 'Olympia paco rabanne',
  'Scandal per femme', 'Jadore Adorable'
].map((name) => ({ name, type: null, price: null, size: null, image: null }));

const menProducts = [
  'Angel mugler', 'Cool water', 'Tobacco and woods jesus del pozo', 'Tobacco vanille tom ford',
  'Obre leather tom ford', 'Woody mystery', 'Dior sauvage', 'Stronger with you armani',
  'Aventus creed', 'Invictus intense', 'Bad boy carolina herrera', 'Jean paul gaultier le male',
  'Dolce & gabbana K', 'Aqua di gio giordani armani', 'Stronger with you armani', 'Black code armani',
  'The one for men dolce gabana', 'Intense homme dior', 'Invictus paco rabbane', 'One million paco rabanne',
  'Phantom paco rabanne'
].map((name) => ({ name, type: null, price: null, size: null, image: null }));

const unisexProducts = [
  'Tropical', 'Diptique philosykos', 'Hermes un jardin sur a lagune', 'Fucking fabulus tom ford'
].map((name) => ({ name, type: null, price: null, size: null, image: null }));

const noGenderProducts = [
  'The scent hugo boss'
].map((name) => ({ name, type: null, price: null, size: null, image: null }));

const allProducts = [...womenProducts, ...menProducts, ...unisexProducts, ...noGenderProducts];

const fragranceOptions = {
  '50ml': [
    { label: 'Eau de Toilette', price: 8 },
    { label: 'Eau de Parfum', price: 10 },
    { label: 'Parfum', price: 12 }
  ],
  '100ml': [
    { label: 'Eau de Toilette', price: 12 },
    { label: 'Eau de Parfum', price: 15 },
    { label: 'Parfum', price: 20 }
  ]
};

const cart = [];
const cartButton = document.querySelector('.cart-button');
const cartCount = cartButton ? cartButton.querySelector('span') : null;

const createProductCard = (product, index) => `
  <article class="product-card" tabindex="0" role="button" aria-label="View ${product.name}" data-product-name="${product.name.replace(/"/g, '&quot;')}">
    <div class="product-card__image">
      ${product.image ? `<img src="${product.image}" alt="${product.name}" loading="lazy">` : '<span class="product-card__image-placeholder">Photo coming soon</span>'}
    </div>
    <div class="product-card__body">
      <span class="product-card__number">${String(index + 1).padStart(2, '0')}</span>
      <h3 class="product-card__name">${product.name}</h3>
      <div class="product-card__meta">
        <span class="product-card__price">Choose size</span>
        <span class="product-card__size">50 / 100 ml</span>
      </div>
      <button class="product-card__action" type="button">View options</button>
    </div>
  </article>
`;

const renderProductCollection = (gridId, products, filter, genderLabel) => {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  const type = filter.endsWith('-perfumes') ? 'perfume' : filter.endsWith('-creams') ? 'cream' : null;
  const filtered = filter.endsWith('-all') ? products : products.filter((product) => product.type === type);

  if (!filtered.length) {
    const title = filter.endsWith('-perfumes') ? 'Perfumes' : 'Creams';
    const message = filter.endsWith('-perfumes')
      ? `Τα ${genderLabel.toLowerCase()} αρώματα θα προστεθούν εδώ.`
      : `Οι ${genderLabel.toLowerCase()} κρέμες θα προστεθούν εδώ.`;
    grid.innerHTML = `<article class="product-placeholder"><span>—</span><h3>${title}</h3><p>${message}</p></article>`;
    return;
  }

  grid.innerHTML = filtered.map(createProductCard).join('');
};

const renderWomenProducts = (filter) => renderProductCollection('women-grid', womenProducts, filter, 'γυναικεία');
const renderMenProducts = (filter) => renderProductCollection('men-grid', menProducts, filter, 'αντρικά');

const bindProductCards = (root = document) => {
  root.querySelectorAll('.product-card').forEach((card) => {
    if (card.dataset.bound === 'true') return;
    card.dataset.bound = 'true';
    const open = () => openProductModal(card.dataset.productName);
    card.addEventListener('click', (event) => {
      if (event.target.closest('button')) event.preventDefault();
      open();
    });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });
};

document.querySelectorAll('.category-links button').forEach((button) => {
  button.addEventListener('click', () => {
    const group = button.parentElement;
    group.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    if (button.dataset.filter.startsWith('women-')) renderWomenProducts(button.dataset.filter);
    else if (button.dataset.filter.startsWith('men-')) renderMenProducts(button.dataset.filter);
    bindProductCards();
  });
});

const womenAllButton = document.querySelector('.category-links button[data-filter="women-all"]');
if (womenAllButton) womenAllButton.click();
const menAllButton = document.querySelector('.category-links button[data-filter="men-all"]');
if (menAllButton) menAllButton.click();

const allProductsGrid = document.getElementById('all-products-grid');
if (allProductsGrid) {
  allProductsGrid.innerHTML = allProducts.map(createProductCard).join('');
  bindProductCards(allProductsGrid);
}

const modal = document.createElement('div');
modal.className = 'product-modal';
modal.hidden = true;
modal.innerHTML = `
  <div class="product-modal__backdrop" data-close-product-modal></div>
  <section class="product-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
    <button class="product-modal__close" type="button" aria-label="Close" data-close-product-modal>&times;</button>
    <div class="product-modal__image"><span>Photo coming soon</span></div>
    <div class="product-modal__content">
      <p class="eyebrow">Le Zanne</p>
      <h2 id="product-modal-title"></h2>
      <p class="product-modal__instruction">Επίλεξε μέγεθος και τύπο αρώματος.</p>
      <div class="product-modal__group">
        <span class="product-modal__label">Size</span>
        <div class="product-modal__choices" data-size-choices>
          <button type="button" data-size="50ml">50ml</button>
          <button type="button" data-size="100ml">100ml</button>
        </div>
      </div>
      <div class="product-modal__group" data-type-group hidden>
        <span class="product-modal__label">Fragrance</span>
        <div class="product-modal__choices" data-type-choices></div>
      </div>
      <div class="product-modal__selection" data-selection>Επίλεξε μέγεθος και τύπο για να δεις την τιμή.</div>
      <button class="product-modal__add" type="button" disabled>Add to Bag</button>
    </div>
  </section>
`;
document.body.appendChild(modal);

let selectedProduct = null;
let selectedSize = null;
let selectedType = null;

const modalTitle = modal.querySelector('#product-modal-title');
const typeGroup = modal.querySelector('[data-type-group]');
const typeChoices = modal.querySelector('[data-type-choices]');
const selectionText = modal.querySelector('[data-selection]');
const addButton = modal.querySelector('.product-modal__add');

const updateModalState = () => {
  const options = selectedSize ? fragranceOptions[selectedSize] : [];
  typeGroup.hidden = !selectedSize;
  typeChoices.innerHTML = options.map((option) => `<button type="button" data-type="${option.label}" data-price="${option.price}">${option.label}<span>${option.price}€</span></button>`).join('');
  typeChoices.querySelectorAll('button').forEach((button) => {
    button.classList.toggle('active', button.dataset.type === selectedType);
    button.addEventListener('click', () => {
      selectedType = button.dataset.type;
      typeChoices.querySelectorAll('button').forEach((item) => item.classList.toggle('active', item === button));
      const price = button.dataset.price;
      selectionText.textContent = `${selectedSize} · ${selectedType} · ${price}€`;
      addButton.disabled = false;
    });
  });
  if (!selectedSize) {
    selectedType = null;
    selectionText.textContent = 'Επίλεξε μέγεθος και τύπο για να δεις την τιμή.';
    addButton.disabled = true;
  } else if (!selectedType) {
    selectionText.textContent = 'Τώρα επίλεξε τον τύπο αρώματος.';
    addButton.disabled = true;
  }
};

const openProductModal = (productName) => {
  selectedProduct = allProducts.find((product) => product.name === productName);
  if (!selectedProduct) return;
  selectedSize = null;
  selectedType = null;
  modalTitle.textContent = selectedProduct.name;
  modal.querySelectorAll('[data-size]').forEach((button) => button.classList.remove('active'));
  updateModalState();
  modal.hidden = false;
  document.body.classList.add('product-modal-visible');
};

const closeProductModal = () => {
  modal.hidden = true;
  document.body.classList.remove('product-modal-visible');
};

modal.querySelectorAll('[data-close-product-modal]').forEach((element) => element.addEventListener('click', closeProductModal));
modal.querySelectorAll('[data-size]').forEach((button) => {
  button.addEventListener('click', () => {
    selectedSize = button.dataset.size;
    selectedType = null;
    modal.querySelectorAll('[data-size]').forEach((item) => item.classList.toggle('active', item === button));
    updateModalState();
  });
});

addButton.addEventListener('click', () => {
  if (!selectedProduct || !selectedSize || !selectedType) return;
  const option = fragranceOptions[selectedSize].find((item) => item.label === selectedType);
  if (!option) return;
  cart.push({ product: selectedProduct.name, size: selectedSize, type: selectedType, price: option.price });
  if (cartCount) cartCount.textContent = String(cart.length);
  addButton.textContent = 'Added to Bag';
  setTimeout(() => { addButton.textContent = 'Add to Bag'; closeProductModal(); }, 700);
});

document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeProductModal(); });

const scentTabs = document.querySelectorAll('.scent-tab');
const closeScentModal = () => {
  document.querySelectorAll('.scent-panel.scent-modal-open').forEach((panel) => { panel.classList.remove('scent-modal-open'); panel.hidden = true; });
  scentTabs.forEach((item) => { item.setAttribute('aria-expanded', 'false'); item.classList.remove('active'); });
  document.body.classList.remove('scent-modal-visible');
};

scentTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    if (!panel) return;
    closeScentModal();
    const closeButton = document.createElement('button');
    closeButton.type = 'button'; closeButton.className = 'scent-modal-close'; closeButton.setAttribute('aria-label', 'Close'); closeButton.innerHTML = '&times;'; closeButton.addEventListener('click', closeScentModal);
    panel.prepend(closeButton); panel.hidden = false; panel.classList.add('scent-modal-open'); tab.setAttribute('aria-expanded', 'true'); tab.classList.add('active'); document.body.classList.add('scent-modal-visible');
  });
});

document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeScentModal(); });

const kitchenButtons = document.querySelectorAll('[data-kitchen-finish]');
const kitchenImages = document.querySelectorAll('[data-kitchen-image]');
kitchenButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const finish = button.dataset.kitchenFinish;
    kitchenButtons.forEach((item) => { const selected = item.dataset.kitchenFinish === finish; item.classList.toggle('active', selected); item.setAttribute('aria-pressed', String(selected)); });
    kitchenImages.forEach((image) => { image.hidden = image.dataset.kitchenImage !== finish; });
  });
});

if (cartButton) cartButton.addEventListener('click', () => {
  alert(cart.length ? `Your bag contains ${cart.length} item${cart.length === 1 ? '' : 's'}.` : 'Your shopping bag is empty.');
});
