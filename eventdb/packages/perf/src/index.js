const timer = require("./timer");

function secNSec2micro(secNSec) {
  return (secNSec[0] * 1000000) + (secNSec[1] / 1000);
}

const startTime = process.hrtime();
const startUsage = process.cpuUsage();

let maxRam = 0;

const printUsage = async () => {
  const elapTime = secNSec2micro(process.hrtime(startTime));
  const elapUsage = process.cpuUsage(startUsage);
  const cpuPercent = Math.round(100 * (elapUsage.user + elapUsage.system) / elapTime);

  console.log(`
    RAM: ${maxRam} MB
    CPU: ${cpuPercent}%
  `);
};

let perfInterval;

if (process.env.PRINT_PERF) {
  perfInterval = setInterval(
    () => {
      maxRam = Math.max(maxRam, Math.round(process.memoryUsage().rss / 1024 / 1024));
    },
    500
  );
}

const printPerf = () => {
  if (!process.env.PRINT_PERF) return;

  if (perfInterval) clearInterval(perfInterval);
  console.table(timer.clearAll());
  printUsage();
};

module.exports = {
  timer,
  printPerf
};
