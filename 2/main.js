// main.js
import { Dashboard } from './js/Dashboard.js';

document.addEventListener('DOMContentLoaded', () => {
  const dashboard = new Dashboard('widgets-container');

  document.getElementById('add-todo')?.addEventListener('click', () =>
    dashboard.addWidget('todo', { title: 'Список задач' })
  );

  document.getElementById('add-quote')?.addEventListener('click', () =>
    dashboard.addWidget('quote', { title: 'Вдохновляющая цитата' })
  );

  document.getElementById('add-weather')?.addEventListener('click', () =>
    dashboard.addWidget('weather', { title: 'Погода' })
  );
});