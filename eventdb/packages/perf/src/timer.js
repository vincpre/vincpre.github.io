const { performance } = require("perf_hooks");

const timeData = new Map();
const defaultContext = "<no context>";

/**
 * Init or (re)start a timer by its title.
 *
 * If the timer id already exists, `timer.start` and `timer.end` are reset. All others fields are kept.
 *
 * @param {String!} title the timer id
 * @param {String} context the timer context
 */
const start = (title, context = defaultContext) => {
  if (!process.env.PRINT_PERF) return undefined;

  if (!timeData.has(title)) {
    timeData.set(title, new Map());
  }
  if (!timeData.get(title).has(context)) {
    timeData.get(title).set(
      context,
      {
        time: 0,
        units: 0,
        context,
        title
      }
    );
  }

  const t = timeData.get(title).get(context);
  t.start = performance.now();
  t.end = undefined;

  return t;
};

/**
 * Stop the timer given by its title.
 *
 * When a timer is stoped, it is not cleared.
 * Each time a timer is stop, the ellapsed time between `start` and `stop` is added to `time` field.
 *
 * @param {String!} title the timer id
 * @param {String} context the timer context
 */
const stop = (title, context = defaultContext) => {
  if (!process.env.PRINT_PERF) return undefined;

  const timers = timeData.get(title);
  if (!timers) throw new Error(`[time] "${title}" doesnt exists, please start it`);

  const t = timers.get(context);
  if (!t) throw new Error(`[time] "${context}" doesnt exists, please start it`);

  t.end = performance.now();
  t.time += (t.end - t.start);

  return t;
};

/**
 * Add units number to the timer.
 *
 * This is useful for the `clear` method to return some statistics.
 *
 * @param {String!} title the timer id
 * @param {String} context the timer context
 * @param {Number!} units the units count to add
 */
const addUnits = (title, context = defaultContext, units) => {
  if (!process.env.PRINT_PERF) return undefined;

  const timers = timeData.get(title);
  if (!timers) throw new Error(`[time] "${title}" doesnt exists, please start it`);

  const t = timers.get(context);
  if (!t) throw new Error(`[time] "${context}" doesnt exists, please start it`);

  t.units += (units || 0);

  return t;
};

/**
 * Delete the timer and returns some statistics about it.
 *
 * It **doesn't stop the timer!**
 *
 * @param {String!} title the timer id
 * @param {String} context the timer context
 * @returns statistics about the timer:
 *  - timer `title`
 *  - timer `context`
 *  - total `time` elapsed
 *  - total count of `units`
 *  - time in ms `perUnit`
 *  - total of units `perSecond`
 */
const clear = (title, context = defaultContext) => {
  if (!process.env.PRINT_PERF) return undefined;

  const timers = timeData.get(title);
  if (!timers) return {};

  const t = timers.get(context);
  if (!t) return {};

  const { units, time } = t;
  const perUnit = units > 0 ? time / units : 0;

  timers.delete(context);
  if (timers.size === 0) timeData.delete(title);

  return {
    title: title.replace(/-.*/, ""),
    context,
    time__ms: +time.toFixed(0),
    units,
    perUnit__ms: +perUnit.toFixed(3),
    perSecond: Math.round(1000 / perUnit)
  };
};

const flatten = array => [].concat(...array);

const clearAll = () => (
  flatten(
    Array
      .from(timeData.values())
      .map(timers => Array.from(timers.values()))
  ).map(({ title, context }) => clear(title, context))
);

module.exports = {
  start,
  stop,
  addUnits,
  clear,
  clearAll
};
