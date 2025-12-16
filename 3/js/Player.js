// js/Player.js
export default class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 40;
    this.speed = 3;
    this.jumpPower = -13;
    this.velY = 0;
    this.onGround = false;
    this.color = '#4299e1';
    this.dropThrough = false; // флаг: "хочу провалиться"
  }

  update(input) {
    this.velX = 0;
    if (input.keys.has('a') || input.keys.has('ArrowLeft')) this.velX = -this.speed;
    if (input.keys.has('d') || input.keys.has('ArrowRight')) this.velX = this.speed;

    // Прыжок
    if ((input.keys.has(' ') || input.keys.has('ArrowUp') || input.keys.has('w')) && this.onGround) {
      this.velY = this.jumpPower;
      this.onGround = false;
      this.dropThrough = false;
    }

    // Начать провал при нажатии ↓ (только если на земле)
    if ((input.keys.has('ArrowDown') || input.keys.has('s')) && this.onGround) {
      this.dropThrough = true;
    } else if (!input.keys.has('ArrowDown') && !input.keys.has('s')) {
      this.dropThrough = false; // сброс при отпускании
    }

    this.x += this.velX;
  }
}