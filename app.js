document.querySelectorAll('.category-links button').forEach((button) => {
  button.addEventListener('click', () => {
    const group = button.parentElement;
    group.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
  });
});

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
