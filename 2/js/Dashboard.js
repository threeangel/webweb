// js/Dashboard.js

import { ToDoWidget } from './ToDoWidget.js';
import { QuoteWidget } from './QuoteWidget.js';
import { WeatherWidget } from './WeatherWidget.js';

export class Dashboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.widgets = [];
  }

  addWidget(type, config = {}) {
    let widget;

    switch (type) {
      case 'todo':
        widget = new ToDoWidget({ ...config, title: config.title || 'Список задач' });
        break;
      case 'quote':
        widget = new QuoteWidget({ ...config, title: config.title || 'Цитата дня' });
        break;
      case 'weather':
        widget = new WeatherWidget({ ...config, title: 'Погода' });
        break;
      default:
        throw new Error(`Неизвестный тип виджета: ${type}`);
    }

    this.widgets.push(widget);
    const el = widget.render();
    this.container.appendChild(el);
  }

  removeWidget(widgetId) {
    const index = this.widgets.findIndex(w => w.id === widgetId);
    if (index !== -1) {
      this.widgets[index].destroy();
      this.widgets.splice(index, 1);
    }
  }
}