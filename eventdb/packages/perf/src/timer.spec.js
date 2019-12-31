/* eslint-env jest */
jest.mock("perf_hooks", () => ({
  performance: {
    now: jest.fn(() => 10)
  }
}));

const { performance } = require("perf_hooks");
const timer = require("./timer");

describe.skip("timer", () => {
  beforeEach(() => {
    timer.clear("timer-title");
  });

  it("should start a timer with a title", () => {
    const t = timer.start("timer-title");

    expect(t).toEqual({
      start: 10,
      context: undefined,
      end: undefined,
      time: 0,
      units: 0
    });
  });

  it("should start a timer with a context", () => {
    const t = timer.start("timer-title", "timer-context");

    expect(t).toEqual({
      start: 10,
      context: "timer-context",
      end: undefined,
      time: 0,
      units: 0
    });
  });

  it("should stop the timer", () => {
    performance.now
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(37);

    timer.start("timer-title", "timer-context");
    const t = timer.stop("timer-title");

    expect(t).toEqual({
      start: 10,
      context: "timer-context",
      end: 37,
      time: 27,
      units: 0
    });
  });

  it("should add units to the timer", () => {
    timer.start("timer-title", "timer-context");
    const t = timer.addUnits("timer-title", 8);

    expect(t).toEqual({
      start: 10,
      context: "timer-context",
      end: undefined,
      time: 0,
      units: 8
    });
  });

  it("should restart the timer but keep track of everything else", () => {
    performance.now
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(37)
      .mockReturnValueOnce(42)
      .mockReturnValueOnce(58)
      .mockReturnValueOnce(60);

    timer.start("timer-title", "timer-context"); // 10
    timer.stop("timer-title"); // 37 - 10 -> 27
    timer.addUnits("timer-title", 8);
    timer.start("timer-title"); // 42
    timer.stop("timer-title"); // 58 - 42 + 27 -> 43
    const t = timer.start("timer-title");

    expect(t).toEqual({
      start: 60,
      context: "timer-context",
      end: undefined,
      time: 43,
      units: 8
    });
  });

  it("should clear and returns statistics", () => {
    performance.now
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(37)
      .mockReturnValueOnce(42);

    timer.start("timer-title", "timer-context");
    timer.stop("timer-title");
    timer.addUnits("timer-title", 8);
    const stats = timer.clear("timer-title");

    const t = timer.start("timer-title");

    // stats
    expect(stats).toEqual({
      title: "timer-title",
      context: "timer-context",
      units: 8,
      time: "27ms",
      perSecond: 296,
      perUnit: "3.375ms"
    });

    // new timer (with same name since the previous is cleared)
    expect(t).toEqual({
      start: 42,
      context: undefined,
      end: undefined,
      time: 0,
      units: 0
    });
  });
});
