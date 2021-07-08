/* eslint-disable no-useless-constructor */
const Piece = require("./Piece");
const Coup = require("./Coup");
const Point = require("./point");

class Pion extends Piece {
  constructor(nom, x, y, couleur) {
    super(nom, x, y, couleur);
    this.deplacements.push(new Point(0, 1), new Point(0, 2));
    this.prises.push(new Point(1, 1), new Point(1, 1));
  }

  joue(x, y) {
    const p = new Point(x, y);
    const d = this.coordonnees.distance(p);
    const resultat = this.deplacements.filter(point => point.x === d.x && point.y === d.y);
    if (resultat.length > 0) {
      super.joue(x, y);
      if (this.nombreDeCoupJoue === 1) this.deplacements = this.deplacements.slice(0, 1);
      return this;
    }
    return this;
  }
}

module.exports = Pion;
