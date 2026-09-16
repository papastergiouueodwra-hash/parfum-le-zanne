document.querySelectorAll('.category-links button').forEach((button) => {
  button.addEventListener('click', () => {
    const group = button.parentElement;
    group.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
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
