// Работа с корзиной
function addToCart(id, name, price) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`Добавлено: ${name}`);
}