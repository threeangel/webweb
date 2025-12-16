// js/WeatherWidget.js

import { UIComponent } from './UIComponent.js';

export class WeatherWidget extends UIComponent {
  constructor(config) {
    super(config);
    this.city = config.city || 'Moscow';
    this.weather = { temp: '--', description: 'Загрузка...' };
  }

  async fetchWeather() {
    try {
      // Open-Meteo: 55.75, 37.62 — Москва
      const lat = 55.75;
      const lon = 37.62;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`;
      const res = await fetch(url);
      const data = await res.json();
      const temp = data.current.temperature_2m;
      this.weather = {
        temp: `${Math.round(temp)}°C`,
        description: this.getWeatherDescription(data.current.weather_code)
      };
    } catch (err) {
      this.weather = { temp: '--', description: 'Ошибка загрузки' };
    }
    this.renderWeather();
  }

  getWeatherDescription(code) {
    // Упрощённое описание
    if (code >= 0 && code <= 3) return 'Ясно';
    if (code >= 45 && code <= 48) return 'Туман';
    if (code >= 51 && code <= 57) return 'Дождь';
    if (code >= 61 && code <= 67) return 'Ливень';
    if (code >= 71 && code <= 77) return 'Снег';
    if (code >= 80 && code <= 82) return 'Ливень';
    if (code === 85 || code === 86) return 'Снегопад';
    return 'Облачно';
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'widget weather-widget';
    this.element.dataset.id = this.id;

    this.element.innerHTML = `
      <div class="widget-header">
        <h3>Погода в ${this.city}</h3>
        <button class="btn-close">×</button>
      </div>
      <div class="widget-body">
        <div class="weather-temp">${this.weather.temp}</div>
        <div class="weather-desc">${this.weather.description}</div>
        <button class="btn-refresh">🔄 Обновить</button>
      </div>
    `;

    const closeBtn = this.element.querySelector('.btn-close');
    const refreshBtn = this.element.querySelector('.btn-refresh');

    this.addEventListener(closeBtn, 'click', () => this.destroy());
    this.addEventListener(refreshBtn, 'click', () => this.fetchWeather());

    this.fetchWeather();
    return this.element;
  }

  renderWeather() {
    if (!this.element) return;
    const tempEl = this.element.querySelector('.weather-temp');
    const descEl = this.element.querySelector('.weather-desc');
    if (tempEl && descEl) {
      tempEl.textContent = this.weather.temp;
      descEl.textContent = this.weather.description;
    }
  }
}