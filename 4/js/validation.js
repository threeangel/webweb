function validateForm() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const country = document.getElementById('country').value;

  if (name.length < 2) {
    alert('Имя должно содержать минимум 2 символа');
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Некорректный email');
    return false;
  }
  if (!country) {
    alert('Выберите страну');
    return false;
  }
  return true;
}