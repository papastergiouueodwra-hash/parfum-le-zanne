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
].map((name) => ({ name, type: null }));

const menProducts = [
  'Angel mugler', 'Cool water', 'Tobacco and woods jesus del pozo', 'Tobacco vanille tom ford',
  'Obre leather tom ford', 'Woody mystery', 'Dior sauvage', 'Stronger with you armani',
  'Aventus creed', 'Invictus intense', 'Bad boy carolina herrera', 'Jean paul gaultier le male',
  'Dolce & gabbana K', 'Aqua di gio giordani armani', 'Stronger with you armani', 'Black code armani',
  'The one for men dolce gabana', 'Intense homme dior', 'Invictus paco rabbane', 'One million paco rabanne',
  'Phantom paco rabanne'
].map((name) => ({ name, type: null }));

const renderProductCollection = (gridId, products, filter, genderLabel) => {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  const type = filter.endsWith('-perfumes') ? 'perfume' : filter.endsWith('-creams') ? 'cream' : null;
  const filtered = filter.endsWith('-all')
    ? products
    : products.filter((product) => product.type === type);

  if (!filtered.length) {
    const title = filter.endsWith('-perfumes') ? 'Perfumes' : 'Creams';
    const message = filter.endsWith('-perfumes')
      ? `Τα ${genderLabel.toLowerCase()} αρώματα θα προστεθούν εδώ.`
      : `Οι ${genderLabel.toLowerCase()} κρέμες θα προστεθούν εδώ.`;
    grid.innerHTML = `<article class="product-placeholder"><span>—</span><h3>${title}</h3><p>${message}</p></article>`;
    return;
  }

  grid.innerHTML = filtered.map((product, index) => `
    <article class="product-placeholder">
      <span>${String(index + 1).padStart(2, '0')}</span>
      <h3>${product.name}</h3>
    </article>
  `).join('');
};

const renderWomenProducts = (filter) => renderProductCollection('women-grid', womenProducts, filter, 'γυναικεία');
const renderMenProducts = (filter) => renderProductCollection('men-grid', menProducts, filter, 'αντρικά');

document.querySelectorAll('.category-links button').forEach((button) => {
  button.addEventListener('click', () => {
    const group = button.parentElement;
    group.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    if (button.dataset.filter.startsWith('women-')) {
      renderWomenProducts(button.dataset.filter);
    } else if (button.dataset.filter.startsWith('men-')) {
      renderMenProducts(button.dataset.filter);
    }
  });
});

const womenAllButton = document.querySelector('.category-links button[data-filter="women-all"]');
if (womenAllButton) womenAllButton.click();

const menAllButton = document.querySelector('.category-links button[data-filter="men-all"]');
if (menAllButton) menAllButton.click();

const scentTabs = document.querySelectorAll('.scent-tab');
const closeScentModal = () => {
  document.querySelectorAll('.scent-panel.scent-modal-open').forEach((panel) => {
    panel.classList.remove('scent-modal-open');
    panel.hidden = true;
  });
  scentTabs.forEach((item) => {
    item.setAttribute('aria-expanded', 'false');
    item.classList.remove('active');
  });
  document.body.classList.remove('scent-modal-visible');
};

scentTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    if (!panel) return;

    closeScentModal();

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'scent-modal-close';
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', closeScentModal);

    panel.prepend(closeButton);
    panel.hidden = false;
    panel.classList.add('scent-modal-open');
    tab.setAttribute('aria-expanded', 'true');
    tab.classList.add('active');
    document.body.classList.add('scent-modal-visible');
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeScentModal();
});

const kitchenButtons = document.querySelectorAll('[data-kitchen-finish]');
const kitchenImages = document.querySelectorAll('[data-kitchen-image]');

kitchenButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const finish = button.dataset.kitchenFinish;

    kitchenButtons.forEach((item) => {
      const selected = item.dataset.kitchenFinish === finish;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });

    kitchenImages.forEach((image) => {
      image.hidden = image.dataset.kitchenImage !== finish;
    });
  });
});

const cartButton = document.querySelector('.cart-button');
if (cartButton) {
  cartButton.addEventListener('click', () => {
    alert('Your shopping bag will be connected next.');
  });
}
