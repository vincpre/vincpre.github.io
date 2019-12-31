const { timer, printPerf } = require("@eventdb/perf");
const EventEmitter = require("events");
const sift = require("sift").default;
const fs = require("fs");
const path = require("path");
const es = require("event-stream");
const JSONStream = require("JSONStream");

/*

*/

function eventDoc(server, doc) {
  server.on(`siren: "${doc.siren}"`, (request, result, data = doc) => {
    const filter = sift(request);
    const filtered = [data].filter(filter);
    if (filtered.length > 0) result.emit("db", filtered);
  });
  server.on(`etablissementSiege: "${doc.etablissementSiege.toString()}"`, (request, result, data = doc) => {
    const filter = sift(request);
    const filtered = [data].filter(filter);
    if (filtered.length > 0) result.emit("db", filtered);
  });
}

async function load(server) {
  const readStream = fs.createReadStream(path.resolve(__dirname, "./siret.json"), { encoding: "utf8" });
  await new Promise((resolve, reject) => {
    readStream
      .pipe(JSONStream.parse("*"))
      .pipe(
        es.through((data) => {
          eventDoc(server, data);
        }),
      )
      .on("error", reject)
      .on("end", resolve);
  });
}

async function run() {
  const db = new EventEmitter();
  const client = new EventEmitter();
  db.setMaxListeners(0);

  timer.start("loading");

  await load(db);
  let answers = 0;
  client.on("db", (data) => {
    answers += data.length;
  });
  timer.stop("loading");

  timer.start("request1");
  answers = 0;
  // eslint-disable-next-line quotes
  db.emit(`etablissementSiege: "true"`, {
    etablissementSiege: true
  }, client);
  console.log(answers);
  timer.stop("request1");

  timer.start("request2");
  answers = 0;
  // eslint-disable-next-line quotes
  db.emit(`siren: "005974761"`, {
    siren: "005974761"
  }, client);
  console.log(answers);

  timer.stop("request2");
  printPerf();
}

run();
