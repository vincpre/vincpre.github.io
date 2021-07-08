class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distance(arrivee) {
    return {
      x: arrivee.x - this.x,
      y: arrivee.y - this.y
    };
  }
}

module.exports = Point;
