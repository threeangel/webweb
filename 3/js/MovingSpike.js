// js/MovingSpike.js
export default class MovingSpike {
  constructor(x, y, width = 20, height = 20, speed = 1, range = 100) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.range = range;
    this.startX = x;
    this.direction = 1;
  }

  update() {
    this.x += this.speed * this.direction;
    if (this.x > this.startX + this.range || this.x < this.startX - this.range) {
      this.direction *= -1;
    }
  }
}