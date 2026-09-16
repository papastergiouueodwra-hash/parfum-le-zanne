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

const renderWomenProducts = (filter) => {
  const grid = document.getElementById('women-grid');
  if (!grid) return;

  const type = filter === 'women-perfumes' ? 'perfume' : filter === 'women-creams' ? 'cream' : null;
  const filtered = filter === 'women-all'
    ? womenProducts
    : womenProducts.filter((product) => product.type === type);

  if (!filtered.length) {
    const title = filter === 'women-perfumes' ? 'Perfumes' : 'Creams';
    const message = filter === 'women-perfumes'
      ? 'Τα γυναικεία αρώματα θα προστεθούν εδώ.'
      : 'Οι γυναικείες κρέμες θα προστεθούν εδώ.';
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

document.querySelectorAll('.category-links button').forEach((button) => {
  button.addEventListener('click', () => {
    const group = button.parentElement;
    group.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    if (button.dataset.filter.startsWith('women-')) {
      renderWomenProducts(button.dataset.filter);
    }
  });
});

const womenAllButton = document.querySelector('.category-links button[data-filter="women-all"]');
if (womenAllButton) womenAllButton.click();

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
