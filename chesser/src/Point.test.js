/* eslint-env jest */
const Point = require("./Point");

describe("Point", () => {
  describe("distance entre 2 points", () => {
    it("en Y de 1 case", () => {
      const point = new Point(1, 2);
      expect(point.distance(new Point(1, 3))).toMatchSnapshot();
    });
  });
  describe("distance entre 2 points", () => {
    it("en Y de 2 cases", () => {
      const point = new Point(1, 2);
      expect(point.distance(new Point(1, 4))).toMatchSnapshot();
    });
  });
  describe("distance entre 2 points", () => {
    it("en Y de 3 cases", () => {
      const point = new Point(1, 2);
      expect(point.distance(new Point(1, 5))).toMatchSnapshot();
    });
  });
  describe("distance entre 2 points", () => {
    it("en Y de 4 cases et en x de 1 cases", () => {
      const point = new Point(1, 2);
      expect(point.distance(new Point(2, 6))).toMatchSnapshot();
    });
  });
});
