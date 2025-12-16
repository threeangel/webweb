// js/UIComponent.js

export class UIComponent {
  constructor({ id, title }) {
    this.id = id || `widget-${Date.now()}`;
    this.title = title || 'Untitled';
    this.element = null;
    this.eventListeners = []; // для корректного удаления слушателей
  }

  // абстрактный метод — должен быть переопределён
  render() {
    throw new Error('Метод render() должен быть реализован в дочернем классе');
  }

  // регистрирует слушатель и сохраняет его для последующего удаления
  addEventListener(element, event, handler) {
    element.addEventListener(event, handler);
    this.eventListeners.push({ element, event, handler });
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    // удаляем все слушатели
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventListeners = [];
  }
}