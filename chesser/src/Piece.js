const Point = require("./Point");

class Piece {
  nombreDeCoupJoue;
  couleur;
  coordonnees;
  deplacements = [];
  prises = [];
  constructor(nom, x, y, couleur){
    this.nombreDeCoupJoue = 0;
    this.couleur = couleur;
    this.nom = nom;
    this.coordonnees = new Point(x, y);
  }

  joue(x, y) {
    this.nombreDeCoupJoue++;
    this.coordonnees = new Point(x, y);
  }
}

module.exports = Piece;
