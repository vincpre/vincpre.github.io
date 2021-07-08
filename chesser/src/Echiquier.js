const Point = require("./Point");

class Echiquier {
  aQuiLeTour;
  nombreDeCoupJoue;
  dateDebutPartie;
  #plateau = [
    [null, null, null, null, null, null, null, null],
    [new Pion("Pion", 1, 7, "noir"), new Pion("Pion", 2, 7, "noir"), new Pion("Pion", 3, 7, "noir"), new Pion("Pion", 4, 7, "noir"), new Pion("Pion", 5, 7, "noir"), new Pion("Pion", 6, 7, "noir"), new Pion("Pion", 7, 7, "noir"), new Pion("Pion", 8, 7, "noir")],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [new Pion("Pion", 1, 7, "blanc"), new Pion("Pion", 2, 7, "blanc"), new Pion("Pion", 3, 7, "blanc"), new Pion("Pion", 4, 7, "blanc"), new Pion("Pion", 5, 7, "blanc"), new Pion("Pion", 6, 7, "blanc"), new Pion("Pion", 7, 7, "blanc"), new Pion("Pion", 8, 7, "blanc")],
    [null, null, null, null, null, null, null, null]
  ]
  constructor(){
    this.aQuiLeTour = "blanc";
    this.nombreDeCoupJoue = 0;
    this.dateDebutPartie = new Date();
  }

  finDePartie() {
    //déterminer Echec et Mat
    return false;
  }

  mouvement(depart, arrivee) {
    const point = new Point(depart.x, depart.y);
    point.deplacement(arrivee);
    this[depart.x, depart.y].deplacement();
  }

  joue() {

  }
}

module.exports = Echiquier;
