// js/Coin.js
export default class Coin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.width = this.radius * 2;
    this.height = this.radius * 2;
  }
}