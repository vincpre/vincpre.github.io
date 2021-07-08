/* eslint-env jest */
const Pion = require("./Pion");

describe("Pion", () => {
  describe("1er déplacement", () => {
    it("en Y de 1 case", () => {
      const pion = new Pion("Pion", 1, 2, "blanc");
      expect(pion.joue(1, 3)).toMatchSnapshot();
    });
    it("en Y de 2 cases", () => {
      const pion = new Pion("Pion", 1, 2, "blanc");
      expect(pion.joue(1, 4)).toMatchSnapshot();
    });
    it("en Y de 3 cases", () => {
      const pion = new Pion("Pion", 1, 2, "blanc");
      expect(pion.joue(1, 5)).toMatchSnapshot();
    });
  });
});
