document.querySelectorAll('.category-links button').forEach((button) => {
  button.addEventListener('click', () => {
    const group = button.parentElement;
    group.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
  });
});

const cartButton = document.querySelector('.cart-button');
if (cartButton) {
  cartButton.addEventListener('click', () => {
    alert('Your shopping bag will be connected next.');
  });
}