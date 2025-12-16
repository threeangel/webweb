// js/QuoteWidget.js

import { UIComponent } from './UIComponent.js';

const QUOTES = [
  { content: "Единственный способ делать отличную работу — любить то, что ты делаешь.", author: "Стив Джобс" },
  { content: "Жизнь — это то, что с тобой происходит, пока ты строишь планы.", author: "Джон Леннон" },
  { content: "Не бойся медлить, бойся остановиться.", author: "Китайская пословица" },
  { content: "Будущее принадлежит тем, кто верит в красоту своих мечтаний.", author: "Элеонора Рузвельт" },
  { content: "Сделай шаг, и дорога появится сама.", author: "Лао-цзы" }
];

export class QuoteWidget extends UIComponent {
  constructor(config) {
    super(config);
    this.currentQuote = this.getRandomQuote();
  }

  getRandomQuote() {
    return QUOTES[Math.floor(Math.random() * QUOTES.length)];
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'widget quote-widget';
    this.element.dataset.id = this.id;

    this.element.innerHTML = `
      <div class="widget-header">
        <h3>${this.title}</h3>
        <button class="btn-close">×</button>
      </div>
      <div class="widget-body">
        <blockquote class="quote-text">"${this.currentQuote.content}"</blockquote>
        <p class="quote-author">— ${this.currentQuote.author}</p>
        <button class="btn-refresh">🔄 Обновить</button>
      </div>
    `;

    const closeBtn = this.element.querySelector('.btn-close');
    const refreshBtn = this.element.querySelector('.btn-refresh');

    this.addEventListener(closeBtn, 'click', () => this.destroy());
    this.addEventListener(refreshBtn, 'click', () => {
      this.currentQuote = this.getRandomQuote();
      this.renderQuote();
    });

    return this.element;
  }

  renderQuote() {
    const textEl = this.element.querySelector('.quote-text');
    const authorEl = this.element.querySelector('.quote-author');
    if (textEl && authorEl) {
      textEl.textContent = `"${this.currentQuote.content}"`;
      authorEl.textContent = `— ${this.currentQuote.author}`;
    }
  }
}