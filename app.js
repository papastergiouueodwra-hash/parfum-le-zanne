document.querySelectorAll('.category-links button').forEach((button) => {
  button.addEventListener('click', () => {
    const group = button.parentElement;
    group.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
  });
});

const scentTabs = document.querySelectorAll('.scent-tab');
scentTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    const isOpen = tab.getAttribute('aria-expanded') === 'true';

    scentTabs.forEach((item) => {
      const otherPanel = document.getElementById(item.getAttribute('aria-controls'));
      item.setAttribute('aria-expanded', 'false');
      item.classList.remove('active');
      if (otherPanel) otherPanel.hidden = true;
    });

    if (!isOpen && panel) {
      tab.setAttribute('aria-expanded', 'true');
      tab.classList.add('active');
      panel.hidden = false;
    }
  });
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
