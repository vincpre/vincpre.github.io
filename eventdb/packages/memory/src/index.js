const { timer, printPerf } = require("@eventdb/perf");
const EventEmitter = require("events");
const sift = require("sift").default;
const fs = require("fs");
const path = require("path");
const es = require("event-stream");
const JSONStream = require("JSONStream");

/*
=> 100K siret documents
┌─────────┬────────────┬────────────────┬──────────┬───────┬─────────────┬───────────┐
│ (index) │   title    │    context     │ time__ms │ units │ perUnit__ms │ perSecond │
├─────────┼────────────┼────────────────┼──────────┼───────┼─────────────┼───────────┤
│    0    │ 'loading'  │ '<no context>' │  18482   │   0   │      0      │ Infinity  │
│    1    │ 'request1' │ '<no context>' │   308    │   0   │      0      │ Infinity  │
│    2    │ 'request2' │ '<no context>' │   336    │   0   │      0      │ Infinity  │
└─────────┴────────────┴────────────────┴──────────┴───────┴─────────────┴───────────┘

    RAM: 417 MB
    CPU: 120%
*/

function eventDoc(server, doc) {
  server.on("db", (request, result, data = doc) => {
    const filter = sift(request);
    const filtered = [data].filter(filter);
    if (filtered.length > 0) result.emit("db", filtered);
  });
}

async function load(server) {
  const readStream = fs.createReadStream(path.resolve(__dirname, "../../../data/siret.json"), { encoding: "utf8" });
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
  db.emit("db", {
    etablissementSiege: false
  }, client);
  console.log(answers);
  timer.stop("request1");

  timer.start("request2");
  answers = 0;
  // eslint-disable-next-line quotes
  db.emit("db", {
    siren: "005974761"
  }, client);
  console.log(answers);

  timer.stop("request2");
  printPerf();
}

run();
