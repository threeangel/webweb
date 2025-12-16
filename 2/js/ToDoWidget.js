// js/ToDoWidget.js

import { UIComponent } from './UIComponent.js';

export class ToDoWidget extends UIComponent {
  constructor(config) {
    super(config);
    this._tasks = this._loadFromStorage() || [];
  }

  _loadFromStorage() {
    const saved = localStorage.getItem(`todo-widget-${this.id}`);
    return saved ? JSON.parse(saved) : null;
  }

  _saveToStorage() {
    localStorage.setItem(`todo-widget-${this.id}`, JSON.stringify(this._tasks));
  }

  addTask(text) {
    if (text.trim() === '') return;
    this._tasks.push({
      id: Date.now().toString(36),
      text: text.trim(),
      done: false
    });
    this._saveToStorage();
    this._renderTaskList();
  }

  removeTask(taskId) {
    this._tasks = this._tasks.filter(task => task.id !== taskId);
    this._saveToStorage();
    this._renderTaskList();
  }

  toggleTask(taskId) {
    this._tasks = this._tasks.map(task =>
      task.id === taskId ? { ...task, done: !task.done } : task
    );
    this._saveToStorage();
    this._renderTaskList();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'widget todo-widget';
    this.element.dataset.widgetId = this.id;

    this.element.innerHTML = `
      <div class="widget-header">
        <h3>${this.title || 'Список задач'}</h3>
        <button class="btn btn-close" aria-label="Закрыть">×</button>
      </div>
      <div class="widget-body">
        <div class="input-group">
          <input 
            type="text" 
            class="input-task" 
            placeholder="Введите задачу..." 
            aria-label="Новая задача"
          >
          <button class="btn btn-add" aria-label="Добавить задачу">➕</button>
        </div>
        <ul class="task-list" aria-label="Список задач"></ul>
      </div>
    `;

    this._input = this.element.querySelector('.input-task');
    this._addBtn = this.element.querySelector('.btn-add');
    this._taskList = this.element.querySelector('.task-list');
    const closeBtn = this.element.querySelector('.btn-close');

    this.addEventListener(this._addBtn, 'click', () => this._handleAdd());
    this.addEventListener(this._input, 'keypress', (e) => {
      if (e.key === 'Enter') this._handleAdd();
    });
    this.addEventListener(closeBtn, 'click', () => this.destroy());

    // Делегирование: обрабатываем клики по кнопкам
    this.addEventListener(this._taskList, 'click', (e) => {
      const taskId = e.target.closest('[data-task-id]')?.dataset.taskId;
      if (!taskId) return;

      if (e.target.classList.contains('btn-delete')) {
        this.removeTask(taskId);
      } else if (e.target.classList.contains('btn-done')) {
        this.toggleTask(taskId);
      }
    });

    this._renderTaskList();
    return this.element;
  }

  _handleAdd() {
    const text = this._input.value;
    if (text.trim()) {
      this.addTask(text);
      this._input.value = '';
      this._input.focus();
    }
  }

  _renderTaskList() {
    this._taskList.innerHTML = '';
    this._tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item';
      li.dataset.taskId = task.id;

      // Кнопка "Выполнено" — всегда видна, меняет текст по статусу
      const doneBtnText = task.done ? '↩ Отменить' : '✅ Выполнено';
      li.innerHTML = `
        <span class="task-text ${task.done ? 'task-done' : ''}">${task.text}</span>
        <div class="task-actions">
          <button class="btn btn-done">${doneBtnText}</button>
          <button class="btn btn-delete">×</button>
        </div>
      `;
      this._taskList.appendChild(li);
    });
  }

  destroy() {
    localStorage.removeItem(`todo-widget-${this.id}`);
    super.destroy();
  }
}