// js/Game.js
import Player from './Player.js';
import Platform from './Platform.js';
import Coin from './Coin.js';
import Spike from './Spike.js';
import MovingSpike from './MovingSpike.js';
import { checkCollision } from './Collision.js';
import InputHandler from './InputHandler.js';

export default class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.input = new InputHandler();
    this.running = false;
    this.gameState = 'playing';

    this.currentLevel = 1;
    this.score = 0;
    this.initLevel();
  }

  generateLevel(level) {
    const floorY = this.canvas.height - 50;
    const playerStartX = 50;

    // Фон: плавный переход от зелёного к красному
    const hue = 120 - Math.min(level * 8, 120);
    const bgColor = `hsl(${hue}, 60%, 75%)`;

    // ====== 1. Платформы (гарантированно проходимые) ======
    const platforms = [];
    platforms.push(new Platform(0, floorY, this.canvas.width, 50)); // пол

    const maxJumpHeight = 120;     // по вертикали
    const maxJumpDistance = 75;    // по горизонтали (между краями)

    let lastPlatform = {
      x: playerStartX,
      y: floorY,
      width: 30,
      height: 40
    };

    const platformCount = 3 + Math.min(level * 2, 12);

    for (let i = 0; i < platformCount; i++) {
      const minY = Math.max(100, lastPlatform.y - maxJumpHeight);
      const maxY = lastPlatform.y - 60;
      if (minY >= maxY) break;

      const nextY = minY + Math.random() * (maxY - minY);

      const minX = lastPlatform.x - maxJumpDistance;
      const maxX = lastPlatform.x + lastPlatform.width + maxJumpDistance;

      const width = 80 + Math.random() * 70;
      const effectiveMinX = Math.max(0, minX);
      const effectiveMaxX = Math.min(this.canvas.width - width, maxX);

      if (effectiveMinX >= effectiveMaxX) continue;

      const nextX = effectiveMinX + Math.random() * (effectiveMaxX - effectiveMinX);

      const newPlatform = new Platform(nextX, nextY, width, 20);
      platforms.push(newPlatform);
      lastPlatform = newPlatform;
    }

    // ====== 2. Монеты — на каждой платформе (кроме пола) ======
    const coins = [];
    for (let i = 1; i < platforms.length; i++) {
      const p = platforms[i];
      const coinX = p.x + Math.random() * (p.width - 20);
      const coinY = p.y - 30;
      coins.push(new Coin(coinX, coinY));
    }

    // ====== 3. Безопасная зона (вокруг старта) ======
    const safeZone = {
      x: playerStartX - 60,
      y: floorY - 150,
      width: 180,
      height: 150
    };

    const isInSafeZone = (obj) => {
      return !(
        obj.x + (obj.width || 0) < safeZone.x ||
        obj.x > safeZone.x + safeZone.width ||
        obj.y + (obj.height || 0) < safeZone.y ||
        obj.y > safeZone.y + safeZone.height
      );
    };

    // ====== 4. Статичные шипы (на полу) ======
    const spikes = [];
    const spikeCount = Math.max(0, level - 1);
    for (let i = 0; i < spikeCount; i++) {
      let x;
      let attempts = 0;
      do {
        x = Math.random() * (this.canvas.width - 20);
        attempts++;
      } while (isInSafeZone({ x, y: floorY - 20, width: 20, height: 20 }) && attempts < 50);
      spikes.push(new Spike(x, floorY - 20));
    }

    // ====== 5. Движущиеся шипы (между платформами, с уровня 3) ======
    const movingSpikes = [];
    if (level >= 3 && platforms.length > 2) {
      const movingSpikeCount = Math.min(level - 2, 5);
      for (let i = 0; i < movingSpikeCount; i++) {
        const idx = 1 + Math.floor(Math.random() * (platforms.length - 2));
        const lower = platforms[idx];
        const upper = platforms[idx + 1];

        const x = lower.x + 20 + Math.random() * (lower.width - 40);
        const y = upper.y + 20 + Math.random() * (lower.y - upper.y - 40);

        if (isInSafeZone({ x, y, width: 20, height: 20 })) continue;

        const speed = 0.4 + (level - 2) * 0.2;
        const range = 60 + level * 6;
        movingSpikes.push(new MovingSpike(x, y, 20, 20, speed, range));
      }
    }

    return { bgColor, platforms, coins, spikes, movingSpikes };
  }

  initLevel() {
    const levelData = this.generateLevel(this.currentLevel);
    this.bgColor = levelData.bgColor;
    this.platforms = levelData.platforms;
    this.coins = levelData.coins;
    this.spikes = levelData.spikes;
    this.movingSpikes = levelData.movingSpikes || [];
    this.player = new Player(50, this.canvas.height - 100);
    this.gameState = 'playing';
    this.updateUI();
  }

  updateUI() {
    document.getElementById('score-value').textContent = this.score;
    document.getElementById('level-value').textContent = this.currentLevel;
  }

  nextLevel() {
    this.currentLevel++;
    this.initLevel();
  }

  gameOver() {
    this.gameState = 'lose';
  }

  restart() {
    this.currentLevel = 1;
    this.score = 0;
    this.initLevel();
  }

  start() {
    this.running = true;
    this.gameLoop();
  }

  gameLoop() {
    if (!this.running) return;

    if (this.gameState === 'playing') {
      this.update();
    }
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }

  update() {
    this.player.update(this.input);

    // Гравитация
    this.player.velY += 0.5;
    this.player.y += this.player.velY;

    // Коллизии с платформами — органичные, без телепортации
    let onGround = false;
    for (const platform of this.platforms) {
      if (checkCollision(this.player, platform)) {
        // Если игрок хочет провалиться — пропускаем верхнюю коллизию
        if (this.player.dropThrough && this.player.velY >= 0) {
          // Ничего не делаем — падаем сквозь
        } else {
          // Стандартная обработка: только при падении сверху
          if (this.player.velY > 0 && this.player.y + this.player.height <= platform.y + 10) {
            this.player.y = platform.y - this.player.height;
            this.player.velY = 0;
            onGround = true;
          }
        }
      }
    }
    this.player.onGround = onGround;
        // Гарантируем, что пол (y = canvas.height - 50) всегда останавливает падение
    const floorY = this.canvas.height - 50;
    if (this.player.velY > 0 && this.player.y + this.player.height > floorY) {
      this.player.y = floorY - this.player.height;
      this.player.velY = 0;
      this.player.onGround = true;
    }
    // Сбор монет
    for (let i = this.coins.length - 1; i >= 0; i--) {
      if (checkCollision(this.player, this.coins[i])) {
        this.score += 10;
        this.coins.splice(i, 1);
        this.updateUI();
        if (this.coins.length === 0) {
          setTimeout(() => this.nextLevel(), 300);
        }
      }
    }

    // Статичные шипы
    for (const spike of this.spikes) {
      if (checkCollision(this.player, spike)) {
        this.gameOver();
        return;
      }
    }

    // Движущиеся шипы
    for (const spike of this.movingSpikes) {
      spike.update();
      if (checkCollision(this.player, spike)) {
        this.gameOver();
        return;
      }
    }

    // Падение вниз — смерть
    if (this.player.y > this.canvas.height) {
      this.gameOver();
    }

    // Границы по X
    if (this.player.x < 0) this.player.x = 0;
    if (this.player.x > this.canvas.width - this.player.width) {
      this.player.x = this.canvas.width - this.player.width;
    }
  }

  render() {
    this.ctx.fillStyle = this.bgColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Платформы
    this.ctx.fillStyle = '#555';
    for (const platform of this.platforms) {
      this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }

    // Статичные шипы
    this.ctx.fillStyle = '#e53e3e';
    for (const spike of this.spikes) {
      this.ctx.beginPath();
      this.ctx.moveTo(spike.x, spike.y + spike.height);
      this.ctx.lineTo(spike.x + spike.width / 2, spike.y);
      this.ctx.lineTo(spike.x + spike.width, spike.y + spike.height);
      this.ctx.closePath();
      this.ctx.fill();
    }

    // Движущиеся шипы
    this.ctx.fillStyle = '#ff6b6b';
    for (const spike of this.movingSpikes) {
      this.ctx.beginPath();
      this.ctx.moveTo(spike.x, spike.y + spike.height);
      this.ctx.lineTo(spike.x + spike.width / 2, spike.y);
      this.ctx.lineTo(spike.x + spike.width, spike.y + spike.height);
      this.ctx.closePath();
      this.ctx.fill();
    }

    // Монеты — серебряные с белой обводкой
    this.ctx.fillStyle = '#c0c0c0';
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 1.5;
    for (const coin of this.coins) {
      this.ctx.beginPath();
      this.ctx.arc(coin.x + coin.radius, coin.y + coin.radius, coin.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
    }

    // Игрок
    this.ctx.fillStyle = '#4299e1';
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);

    // Экран поражения
    if (this.gameState === 'lose') {
      this.renderLoseScreen();
    }
  }

  renderLoseScreen() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#fc8181';
    this.ctx.font = '48px "Exo 2", sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('💀 ИГРА ОКОНЧЕНА!', this.canvas.width / 2, this.canvas.height / 2 - 50);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '24px "Exo 2", sans-serif';
    this.ctx.fillText(`Уровень: ${this.currentLevel}`, this.canvas.width / 2, this.canvas.height / 2 + 10);
    this.ctx.fillText(`Счёт: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 50);

    this.renderRestartButton();
  }

  renderRestartButton() {
    const btnX = this.canvas.width / 2 - 100;
    const btnY = this.canvas.height / 2 + 100;
    const btnW = 200;
    const btnH = 50;

    this.ctx.fillStyle = '#4299e1';
    this.ctx.fillRect(btnX, btnY, btnW, btnH);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '20px "Exo 2", sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('Играть снова', this.canvas.width / 2, btnY + btnH / 2);

    const handleClick = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH) {
        this.restart();
        this.canvas.removeEventListener('click', handleClick);
      }
    };
    this.canvas.addEventListener('click', handleClick, { once: true });
  }
}