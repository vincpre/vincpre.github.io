class Coup {
  deplacement;
  prise;

  constructor() {
    this.deplacement = false;
    this.prise = false;
  }

  unDeplacement() {
    this.deplacement = true;
  }

  unePrise() {
    this.prise = true;
  }

  valide() {
    if (this.deplacement || this.prise)
      return true;
    return false;
  }
}

module.exports = Coup;
