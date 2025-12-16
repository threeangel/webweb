// js/InputHandler.js

export default class InputHandler {
  constructor() {
    this.keys = new Set();

    window.addEventListener('keydown', (e) => {
      this.keys.add(e.key);
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key);
    });

    // 👇 Добавляем обработку потери фокуса
    window.addEventListener('blur', () => {
      // Сбрасываем все нажатые клавиши при сворачивании/переключении вкладки
      this.keys.clear();
    });
  }
}